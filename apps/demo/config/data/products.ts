export type Product = {
  id: string;
  title: string;
  image: string;
  description: string;
  price: number;
  inStock: boolean;
  categories: string[];
  collections: string[];
  discount?: number; // percentage 0–100; undefined means no active discount
};

export const products: Product[] = [
  {
    id: "prod-001",
    title: "Classic White Sneakers",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    description:
      "Clean, minimalist leather sneakers built for everyday comfort. Featuring a cushioned insole and durable rubber outsole.",
    price: 89.99,
    inStock: true,
    categories: ["Footwear", "Men", "Casual"],
    collections: ["Summer 2025", "Essentials"],
    discount: 10,
  },
  {
    id: "prod-002",
    title: "Wireless Noise-Cancelling Headphones",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    description:
      "40-hour battery life, adaptive noise cancellation, and premium sound. Perfect for work, travel, and everything in between.",
    price: 249.0,
    inStock: true,
    categories: ["Electronics", "Audio"],
    collections: ["Tech Picks", "New Arrivals"],
  },
  {
    id: "prod-003",
    title: "Linen Tote Bag",
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&auto=format&fit=crop&q=80",
    description:
      "Eco-friendly natural linen tote with a large main compartment and inner zip pocket. Folds flat for easy storage.",
    price: 34.5,
    inStock: true,
    categories: ["Accessories", "Women", "Bags"],
    collections: ["Eco Picks", "Summer 2025"],
    discount: 20,
  },
  {
    id: "prod-004",
    title: "Ceramic Pour-Over Coffee Set",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80",
    description:
      "Handcrafted matte ceramic dripper and server for a rich, clean cup. Includes 40 paper filters.",
    price: 58.0,
    inStock: false,
    categories: ["Kitchen", "Coffee"],
    collections: ["Home & Living", "Gifts"],
  },
  {
    id: "prod-005",
    title: "Merino Wool Crew Sweater",
    image:
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&auto=format&fit=crop&q=80",
    description:
      "Lightweight, breathable 100% merino wool sweater. Naturally odour-resistant and machine washable.",
    price: 129.0,
    inStock: true,
    categories: ["Clothing", "Men", "Women"],
    collections: ["Autumn 2025", "Essentials"],
    discount: 15,
  },
  {
    id: "prod-006",
    title: "Portable Standing Desk Converter",
    image:
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&auto=format&fit=crop&q=80",
    description:
      "Adjustable sit-to-stand converter that sits on any desk. Dual monitor support, gas-spring lift mechanism.",
    price: 175.0,
    inStock: true,
    categories: ["Office", "Furniture"],
    collections: ["Work From Home", "New Arrivals"],
  },
  {
    id: "prod-007",
    title: "Hardcover Dot-Grid Notebook",
    image:
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&auto=format&fit=crop&q=80",
    description:
      "200 pages of 100 gsm ivory paper with a flexible hardcover. Lay-flat binding and ribbon bookmark.",
    price: 18.95,
    inStock: true,
    categories: ["Stationery", "Office"],
    collections: ["Stationery Picks", "Gifts"],
    discount: 5,
  },
  {
    id: "prod-008",
    title: "Stainless Steel Water Bottle",
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80",
    description:
      "Double-walled insulation keeps drinks cold for 24h or hot for 12h. Leak-proof lid, BPA-free.",
    price: 42.0,
    inStock: true,
    categories: ["Sports", "Kitchen", "Outdoor"],
    collections: ["Eco Picks", "Summer 2025"],
  },
  {
    id: "prod-009",
    title: "Artisan Soy Candle Trio",
    image:
      "https://images.unsplash.com/photo-1602874801007-bd458bb1b542?w=600&auto=format&fit=crop&q=80",
    description:
      "Three hand-poured soy candles in cedar, vanilla, and lavender. Burn time ~40 hours each, gift-ready box.",
    price: 48.0,
    inStock: true,
    categories: ["Home", "Wellness"],
    collections: ["Gifts", "Home & Living"],
    discount: 12,
  },
  {
    id: "prod-010",
    title: "Leather Passport Wallet",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80",
    description:
      "Full-grain leather holder with RFID blocking, passport slot, and card pockets. Monogramming available.",
    price: 64.0,
    inStock: true,
    categories: ["Accessories", "Travel"],
    collections: ["Gifts", "Essentials"],
  },
  {
    id: "prod-011",
    title: "Gourmet Chocolate Assortment",
    image:
      "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&auto=format&fit=crop&q=80",
    description:
      "24-piece box of dark, milk, and praline chocolates. Fair-trade cocoa, presented in a ribbon-tied tin.",
    price: 36.5,
    inStock: true,
    categories: ["Food", "Gifts"],
    collections: ["Gifts", "New Arrivals"],
    discount: 8,
  },
  {
    id: "prod-012",
    title: "Silk Eye Mask & Scrunchie Set",
    image:
      "https://images.unsplash.com/photo-1616628182505-8490e192697?w=600&auto=format&fit=crop&q=80",
    description:
      "Mulberry silk sleep mask and matching scrunchies in a soft drawstring pouch. Gentle on hair and skin.",
    price: 29.99,
    inStock: true,
    categories: ["Accessories", "Wellness"],
    collections: ["Gifts", "Eco Picks"],
  },
  {
    id: "prod-013",
    title: "Mini Indoor Bonsai Starter Kit",
    image:
      "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&auto=format&fit=crop&q=80",
    description:
      "Everything to grow a tabletop juniper: ceramic pot, soil, pruning shears, and care guide. Ideal for plant lovers.",
    price: 52.0,
    inStock: true,
    categories: ["Home", "Outdoor"],
    collections: ["Gifts", "Home & Living"],
  },
  {
    id: "prod-014",
    title: "Brass Desk Compass & Letter Opener",
    image:
      "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop&q=80",
    description:
      "Vintage-style brass compass paired with a matching letter opener, lined presentation case included.",
    price: 44.0,
    inStock: false,
    categories: ["Stationery", "Office"],
    collections: ["Gifts", "Stationery Picks"],
  },
];

export const productOptions = products.map((p) => ({
  label: p.title,
  value: p.id,
}));

/** Unique collection names across the demo catalog (for collection pickers). */
export const allCollections: string[] = [
  ...new Set(products.flatMap((p) => p.collections)),
].sort();

// ─── Shared helpers ─────────────────────────────────────────────────────────

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(price);
}

export function discountedPrice(price: number, discount: number): number {
  return price * (1 - discount / 100);
}

// ─── Shared external field ───────────────────────────────────────────────────
// Import this in any block that needs a product picker.

export const productExternalField = {
  type: "external" as const,
  label: "Product",
  placeholder: "Search or select a product…",
  showSearch: true,
  fetchList: async ({
    query,
  }: {
    query: string;
    filters: Record<string, any>;
  }) => {
    await new Promise((res) => setTimeout(res, 120));
    const q = query.toLowerCase();
    return products
      .filter(
        (p) =>
          !q ||
          p.title.toLowerCase().includes(q) ||
          p.categories.some((c) => c.toLowerCase().includes(q)) ||
          p.collections.some((c) => c.toLowerCase().includes(q))
      )
      .map((p) => ({
        id: p.id,
        title: p.title,
        price: `$${p.price.toFixed(2)}`,
        inStock: p.inStock ? "Yes" : "No",
        categories: p.categories.join(", "),
      }));
  },
  mapRow: (item: any) => ({
    title: item.title,
    price: item.price,
    inStock: item.inStock,
    categories: item.categories,
  }),
  // Match by id (stable) instead of title
  mapProp: (row: any): Product | null =>
    products.find((p) => p.id === row.id || p.title === row.title) ?? null,
  getItemSummary: (item: Product | null) => item?.title ?? "Product",
};
