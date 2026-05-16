import { createShopifyOperations } from "./operations.js";
import {
  assertInternalApiKey,
  assertRateLimit,
  getOperationType,
  parseOperationRequest,
  readBodyText
} from "./security.js";

const DEFAULT_API_VERSION = "2026-04";
const DEFAULT_RARITY_NAMESPACE = "custom";
const DEFAULT_RARITY_KEY = "rarity";
const SHOPIFY_TIMEOUT_MS = 9_000;
const cacheStore = new Map();

const JSON_HEADERS = {
  "Content-Type": "application/json"
};

const getCacheTtlMs = (operationType) => {
  if (operationType === "products") {
    return 2 * 60 * 1000;
  }

  if (operationType === "collections") {
    return 15 * 60 * 1000;
  }

  return 0;
};

const buildCacheKey = (operation, variables) => `${operation}:${JSON.stringify(variables)}`;

const getCachedResponse = (cacheKey) => {
  const entry = cacheStore.get(cacheKey);
  if (!entry) {
    return null;
  }

  if (Date.now() >= entry.expiresAt) {
    cacheStore.delete(cacheKey);
    return null;
  }

  return entry.value;
};

const setCachedResponse = (cacheKey, value, ttlMs) => {
  if (!ttlMs) {
    return;
  }

  cacheStore.set(cacheKey, {
    value,
    expiresAt: Date.now() + ttlMs
  });
};

const createJsonResponse = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...JSON_HEADERS,
      "Cache-Control": "no-store"
    }
  });

const getSafeErrorResponse = (error) => {
  const status = Number.isInteger(error.status) ? error.status : 503;
  const publicMessage =
    typeof error.publicMessage === "string"
      ? error.publicMessage
      : status >= 500
        ? "Commerce service unavailable"
        : "Invalid request";

  return createJsonResponse({ error: publicMessage }, status);
};

const executeShopifyRequest = async ({ endpoint, token, query, variables }) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), SHOPIFY_TIMEOUT_MS);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token
      },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal
    });

    const payload = await response.json();

    if (!response.ok || payload.errors?.length) {
      console.error("Shopify upstream error", {
        status: response.status,
        errors: payload.errors
      });
      throw Object.assign(new Error("Shopify upstream error"), {
        status: 503,
        publicMessage: "Commerce service unavailable"
      });
    }

    return payload.data;
  } catch (error) {
    if (error.name === "AbortError") {
      console.error("Shopify request timed out");
      throw Object.assign(new Error("Shopify request timed out"), {
        status: 504,
        publicMessage: "Commerce service unavailable"
      });
    }

    throw error.publicMessage
      ? error
      : Object.assign(new Error("Shopify request failed"), {
          status: 503,
          publicMessage: "Commerce service unavailable"
        });
  } finally {
    clearTimeout(timeoutId);
  }
};

export const createShopifyProxyHandler = (env = process.env) => {
  const domain = env.SHOPIFY_STORE_DOMAIN;
  const token = env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const internalApiKey = env.SHOPIFY_INTERNAL_API_KEY;
  const endpoint = domain
    ? `https://${domain}/api/${env.SHOPIFY_STOREFRONT_API_VERSION || DEFAULT_API_VERSION}/graphql.json`
    : "";
  const operations = createShopifyOperations({
    rarityNamespace: env.SHOPIFY_RARITY_NAMESPACE || DEFAULT_RARITY_NAMESPACE,
    rarityKey: env.SHOPIFY_RARITY_KEY || DEFAULT_RARITY_KEY
  });

  return async function handleShopifyProxy(request) {
    if (request.method !== "POST") {
      return createJsonResponse({ error: "Invalid request" }, 405);
    }

    if (!endpoint || !token || !internalApiKey) {
      console.error("Missing commerce environment configuration");
      return createJsonResponse({ error: "Commerce service unavailable" }, 500);
    }

    try {
      assertInternalApiKey(request, internalApiKey);
      const bodyText = await readBodyText(request);
      const { operation, variables } = parseOperationRequest(bodyText);
      assertRateLimit(request, operation);

      const operationType = getOperationType(operation);
      const ttlMs = getCacheTtlMs(operationType);
      const cacheKey = buildCacheKey(operation, variables);

      if (ttlMs) {
        const cached = getCachedResponse(cacheKey);
        if (cached) {
          return createJsonResponse({ data: cached });
        }
      }

      const data = await executeShopifyRequest({
        endpoint,
        token,
        query: operations[operation],
        variables
      });

      if (ttlMs) {
        setCachedResponse(cacheKey, data, ttlMs);
      }

      return createJsonResponse({ data });
    } catch (error) {
      console.error("Commerce proxy error", error);
      return getSafeErrorResponse(error);
    }
  };
};
