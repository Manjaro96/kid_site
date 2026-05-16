import { createShopifyProxyHandler } from "../shopify/proxy.js";

const handler = createShopifyProxyHandler(process.env);

export default async function shopifyHandler(request, response) {
  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : typeof request.body === "string"
        ? request.body
        : JSON.stringify(request.body || {});

  const webRequest = new Request("http://local/api/shopify", {
    method: request.method,
    headers: request.headers,
    body
  });

  const webResponse = await handler(webRequest);
  response.status(webResponse.status);
  webResponse.headers.forEach((value, key) => {
    response.setHeader(key, value);
  });
  response.send(await webResponse.text());
}
