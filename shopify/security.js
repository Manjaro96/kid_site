const MAX_BODY_BYTES = 50 * 1024;
const PRODUCT_OPERATIONS = new Set(["getProducts", "getCollectionProducts"]);
const COLLECTION_OPERATIONS = new Set(["getCollections"]);
const CART_OPERATIONS = new Set(["getCart", "createCart", "addToCart", "updateCartLines", "removeCartLines"]);
const ALL_OPERATIONS = new Set([...PRODUCT_OPERATIONS, ...COLLECTION_OPERATIONS, ...CART_OPERATIONS]);
const rateBuckets = {
  catalog: new Map(),
  cart: new Map()
};

const clampInt = (value, min, max, fallback) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(Math.max(parsed, min), max);
};

const isPlainObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);

const safeString = (value, maxLength) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

const sanitizePriceFilter = (price) => {
  if (!isPlainObject(price)) {
    return null;
  }

  const nextPrice = {};
  const min = Number.parseFloat(price.min ?? "");
  const max = Number.parseFloat(price.max ?? "");

  if (Number.isFinite(min) && min >= 0) {
    nextPrice.min = min;
  }

  if (Number.isFinite(max) && max >= 0) {
    nextPrice.max = max;
  }

  return Object.keys(nextPrice).length ? nextPrice : null;
};

const sanitizeFilters = (filters) => {
  if (!Array.isArray(filters)) {
    return [];
  }

  return filters
    .filter(isPlainObject)
    .map((filter) => {
      const nextFilter = {};

      if (typeof filter.available === "boolean") {
        nextFilter.available = filter.available;
      }

      const tag = safeString(filter.tag, 120);
      if (tag) {
        nextFilter.tag = tag;
      }

      const price = sanitizePriceFilter(filter.price);
      if (price) {
        nextFilter.price = price;
      }

      return nextFilter;
    })
    .filter((filter) => Object.keys(filter).length > 0)
    .slice(0, 6);
};

const sanitizeLines = (lines) => {
  if (!Array.isArray(lines)) {
    return [];
  }

  return lines
    .filter(isPlainObject)
    .map((line) => {
      const merchandiseId = safeString(line.merchandiseId, 160);
      if (!merchandiseId.startsWith("gid://shopify/")) {
        return null;
      }

      return {
        merchandiseId,
        quantity: clampInt(line.quantity, 1, 99, 1)
      };
    })
    .filter(Boolean)
    .slice(0, 25);
};

const sanitizeLineUpdates = (lines) => {
  if (!Array.isArray(lines)) {
    return [];
  }

  return lines
    .filter(isPlainObject)
    .map((line) => {
      const id = safeString(line.id, 160);
      if (!id.startsWith("gid://shopify/")) {
        return null;
      }

      return {
        id,
        quantity: clampInt(line.quantity, 0, 99, 1)
      };
    })
    .filter(Boolean)
    .slice(0, 25);
};

const sanitizeLineIds = (lineIds) => {
  if (!Array.isArray(lineIds)) {
    return [];
  }

  return lineIds
    .map((lineId) => safeString(lineId, 160))
    .filter((lineId) => lineId.startsWith("gid://shopify/"))
    .slice(0, 25);
};

export const readBodyText = async (request) => {
  let bodyText = "";

  if (typeof request.text === "function") {
    bodyText = await request.text();
  } else if (typeof request.body === "string") {
    bodyText = request.body;
  }

  if (Buffer.byteLength(bodyText || "", "utf8") > MAX_BODY_BYTES) {
    throw Object.assign(new Error("Invalid request"), { status: 413, publicMessage: "Invalid request" });
  }

  return bodyText;
};

export const assertInternalApiKey = (request, internalApiKey) => {
  const headerValue = request.headers.get("x-internal-api-key");
  if (!internalApiKey || headerValue !== internalApiKey) {
    throw Object.assign(new Error("Missing or invalid internal API key"), {
      status: 401,
      publicMessage: "Invalid request"
    });
  }
};

export const parseOperationRequest = (bodyText) => {
  let payload = {};

  try {
    payload = bodyText ? JSON.parse(bodyText) : {};
  } catch {
    throw Object.assign(new Error("Unable to parse request body"), {
      status: 400,
      publicMessage: "Invalid request"
    });
  }

  const operation = safeString(payload.operation, 64);
  if (!ALL_OPERATIONS.has(operation)) {
    throw Object.assign(new Error(`Unsupported operation: ${operation || "unknown"}`), {
      status: 400,
      publicMessage: "Invalid request"
    });
  }

  const variables = sanitizeVariables(operation, payload.variables);
  validateVariables(operation, variables);

  return { operation, variables };
};

export const sanitizeVariables = (operation, rawVariables = {}) => {
  const variables = isPlainObject(rawVariables) ? rawVariables : {};

  switch (operation) {
    case "getProducts":
      return {
        first: clampInt(variables.first, 1, 24, 12),
        after: safeString(variables.after, 160) || null,
        query: safeString(variables.query, 200) || null,
        sortKey: safeString(variables.sortKey, 40) || "UPDATED_AT",
        reverse: Boolean(variables.reverse)
      };
    case "getCollectionProducts":
      return {
        handle: safeString(variables.handle, 120),
        first: clampInt(variables.first, 1, 24, 12),
        after: safeString(variables.after, 160) || null,
        filters: sanitizeFilters(variables.filters),
        sortKey: safeString(variables.sortKey, 40) || "BEST_SELLING",
        reverse: Boolean(variables.reverse)
      };
    case "getCollections":
      return {
        first: clampInt(variables.first, 1, 12, 6),
        after: safeString(variables.after, 160) || null
      };
    case "getCart":
      return {
        id: safeString(variables.id, 160)
      };
    case "createCart":
      return {
        input: {
          lines: sanitizeLines(variables.input?.lines)
        }
      };
    case "addToCart":
      return {
        cartId: safeString(variables.cartId, 160),
        lines: sanitizeLines(variables.lines)
      };
    case "updateCartLines":
      return {
        cartId: safeString(variables.cartId, 160),
        lines: sanitizeLineUpdates(variables.lines)
      };
    case "removeCartLines":
      return {
        cartId: safeString(variables.cartId, 160),
        lineIds: sanitizeLineIds(variables.lineIds)
      };
    default:
      return {};
  }
};

export const validateVariables = (operation, variables) => {
  if (operation === "getCollectionProducts" && !variables.handle) {
    throw Object.assign(new Error("Collection handle is required"), {
      status: 400,
      publicMessage: "Invalid request"
    });
  }

  if (operation === "getCart" && !variables.id.startsWith("gid://shopify/")) {
    throw Object.assign(new Error("Cart id is required"), {
      status: 400,
      publicMessage: "Invalid request"
    });
  }

  if (["addToCart", "updateCartLines", "removeCartLines"].includes(operation)) {
    if (!variables.cartId.startsWith("gid://shopify/")) {
      throw Object.assign(new Error("Cart id is required"), {
        status: 400,
        publicMessage: "Invalid request"
      });
    }
  }
};

const getBucketName = (operation) => (CART_OPERATIONS.has(operation) ? "cart" : "catalog");

const getRateConfig = (bucket) =>
  bucket === "cart" ? { limit: 30, windowMs: 10_000 } : { limit: 60, windowMs: 10_000 };

export const assertRateLimit = (request, operation) => {
  const bucketName = getBucketName(operation);
  const bucket = rateBuckets[bucketName];
  const { limit, windowMs } = getRateConfig(bucketName);
  const now = Date.now();

  for (const [key, entry] of bucket.entries()) {
    if (now >= entry.resetAt) {
      bucket.delete(key);
    }
  }

  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "anonymous";
  const key = `${bucketName}:${ip}`;
  const current = bucket.get(key);

  if (!current || now >= current.resetAt) {
    bucket.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  if (current.count >= limit) {
    throw Object.assign(new Error(`Rate limit exceeded for ${key}`), {
      status: 429,
      publicMessage: "Commerce service unavailable"
    });
  }

  current.count += 1;
};

export const getOperationType = (operation) => {
  if (PRODUCT_OPERATIONS.has(operation)) {
    return "products";
  }

  if (COLLECTION_OPERATIONS.has(operation)) {
    return "collections";
  }

  return "cart";
};
