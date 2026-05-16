const escapeGraphQLString = (value) => String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"');

const createProductFragment = ({ rarityNamespace, rarityKey }) => `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    availableForSale
    tags
    featuredImage {
      url
      altText
      width
      height
    }
    images(first: 8) {
      nodes {
        url
        altText
        width
        height
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    collections(first: 6) {
      nodes {
        id
        handle
        title
      }
    }
    rarityMetafield: metafield(namespace: "${escapeGraphQLString(rarityNamespace)}", key: "${escapeGraphQLString(rarityKey)}") {
      value
    }
    variants(first: 25) {
      nodes {
        id
        title
        availableForSale
        quantityAvailable
        sku
        selectedOptions {
          name
          value
        }
        image {
          url
          altText
          width
          height
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
      }
    }
  }
`;

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            image {
              url
              altText
              width
              height
            }
            product {
              id
              handle
              title
            }
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export const createShopifyOperations = ({
  rarityNamespace = "custom",
  rarityKey = "rarity"
} = {}) => {
  const productFragment = createProductFragment({ rarityNamespace, rarityKey });

  return {
    getProducts: `
      ${productFragment}
      query GetProducts($first: Int!, $after: String, $query: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
        products(first: $first, after: $after, query: $query, sortKey: $sortKey, reverse: $reverse) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            cursor
            node {
              ...ProductFields
            }
          }
        }
      }
    `,
    getCollectionProducts: `
      ${productFragment}
      query GetCollectionProducts(
        $handle: String!,
        $first: Int!,
        $after: String,
        $filters: [ProductFilter!],
        $sortKey: ProductCollectionSortKeys,
        $reverse: Boolean
      ) {
        collection(handle: $handle) {
          id
          handle
          title
          description
          products(first: $first, after: $after, filters: $filters, sortKey: $sortKey, reverse: $reverse) {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              cursor
              node {
                ...ProductFields
              }
            }
          }
        }
      }
    `,
    getCollections: `
      query GetCollections($first: Int!, $after: String) {
        collections(first: $first, after: $after, sortKey: UPDATED_AT, reverse: true) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            id
            handle
            title
            description
            image {
              url
              altText
              width
              height
            }
            products(first: 4) {
              nodes {
                id
                handle
                title
                featuredImage {
                  url
                  altText
                  width
                  height
                }
              }
            }
          }
        }
      }
    `,
    getCart: `
      ${CART_FRAGMENT}
      query GetCart($id: ID!) {
        cart(id: $id) {
          ...CartFields
        }
      }
    `,
    createCart: `
      ${CART_FRAGMENT}
      mutation CreateCart($input: CartInput) {
        cartCreate(input: $input) {
          cart {
            ...CartFields
          }
          userErrors {
            message
          }
        }
      }
    `,
    addToCart: `
      ${CART_FRAGMENT}
      mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            ...CartFields
          }
          userErrors {
            message
          }
        }
      }
    `,
    updateCartLines: `
      ${CART_FRAGMENT}
      mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            ...CartFields
          }
          userErrors {
            message
          }
        }
      }
    `,
    removeCartLines: `
      ${CART_FRAGMENT}
      mutation RemoveCartLines($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            ...CartFields
          }
          userErrors {
            message
          }
        }
      }
    `
  };
};
