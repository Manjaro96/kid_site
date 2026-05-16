import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createShopifyProxyHandler } from "./shopify/proxy.js";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "shopify-storefront-proxy",
      configureServer(server) {
        const handler = createShopifyProxyHandler(process.env);

        server.middlewares.use("/api/commerce", async (req, res) => {
          const chunks = [];

          req.on("data", (chunk) => chunks.push(chunk));
          req.on("end", async () => {
            const body = chunks.length ? Buffer.concat(chunks).toString("utf8") : undefined;
            const headers = new Headers(req.headers);
            headers.set("x-internal-api-key", process.env.SHOPIFY_INTERNAL_API_KEY || "");

            const request = new Request("http://localhost/api/shopify", {
              method: req.method,
              headers,
              body
            });

            const response = await handler(request);
            res.statusCode = response.status;
            response.headers.forEach((value, key) => {
              res.setHeader(key, value);
            });
            res.end(await response.text());
          });
        });
      }
    }
  ]
});
