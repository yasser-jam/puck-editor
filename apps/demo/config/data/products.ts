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
];

export const productOptions = products.map((p) => ({
  label: p.title,
  value: p.id,
}));
