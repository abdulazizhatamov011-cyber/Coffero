export const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&auto=format&fit=crop`;

export type Flavor = {
  name: string;
  notes: string;
  price: number;
  img: string;
};

export const FLAVORS: Flavor[] = [
  { name: "Original", notes: "Cold brew, oat milk, a whisper of cane sugar.", price: 5.5, img: "1642647391072-6a2416f048e5" },
  { name: "Vanilla Cloud", notes: "Madagascar vanilla, sweet cream, layered slow.", price: 6.0, img: "1764298490445-6add12301888" },
  { name: "Caramel Crush", notes: "Salted caramel, double shot, lots of crushed ice.", price: 6.5, img: "1517701550927-30cf4ba1dba5" },
];

export const PHOTOS = {
  hero: "1761673930163-8d3d6d73cd7a",
  pour: "1562447457-579fc34967fb",
  sun: "1773958872887-33cd90409f7e",
  splash: "1763995687869-86fea4d59553",
  honey: "1662047102608-a6f2e492411f",
  banner: "1617086903048-65e5d76dd467",
  visit: "1592663527359-cf6642f54cff",
};

export const money = (n: number) => `$${n.toFixed(2)}`;

/** Pages rendered without the site header and footer. */
export const BARE_PAGES = ["/login"];

export const NAV_LINKS = [
  { href: "/", key: "nav.home" },
  { href: "/menu", key: "nav.menu" },
  { href: "/about", key: "nav.about" },
  { href: "/contact", key: "nav.contact" },
];

/** How a swirl is built — shown in the "Mix it up" scene and on the About page. */
export const STEPS = [
  { n: "01", title: "Pour", text: "18-hour cold brew over clear, slow-melting ice." },
  { n: "02", title: "Cream", text: "Oat milk or sweet cream, poured from up high." },
  { n: "03", title: "Swirl", text: "A ribbon of salted caramel — then watch it bloom." },
];

export const EXTRAS = [
  { name: "Extra shot", price: 0.8 },
  { name: "Oat / almond milk", price: 0.6 },
  { name: "Salted caramel drizzle", price: 0.5 },
  { name: "Vanilla cold foam", price: 0.9 },
  { name: "Size up (L → XL)", price: 0.7 },
];

export const VALUES = [
  { title: "Slow on purpose", text: "Cold water and 18 hours pull out chocolate and caramel notes — and leave the bitterness behind." },
  { title: "Real ingredients", text: "House-made caramel, Madagascar vanilla, oat milk without the gums. Nothing from a pump bottle." },
  { title: "Made for the city", text: "Grab-and-go cups, quick pickup and a spot to sit when you want to slow down too." },
];
