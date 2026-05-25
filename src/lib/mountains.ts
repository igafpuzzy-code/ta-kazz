export type Mountain = {
  slug: string;
  name: string;
  type: "Mountain" | "Campsite" | "Farm" | "Grassland" | "Falls";
  elevation?: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  location: string;
  lat: number;
  lng: number;
  description: string;
  highlights: string[];
  duration: string;
};

export const MOUNTAINS: Mountain[] = [
  {
    slug: "mt-mandalagan",
    name: "Mt. Mandalagan",
    type: "Mountain",
    elevation: "1,879 MASL",
    difficulty: "Advanced",
    location: "Murcia, Negros Occidental",
    lat: 10.6536,
    lng: 123.1925,
    description:
      "A dormant volcano in northern Negros known for its lush mossy forests, hot springs, and challenging multi-day traverse. Part of the Mt. Mandalagan Protected Landscape.",
    highlights: ["Mossy forest", "Hot springs", "Crater lakes", "Endemic wildlife"],
    duration: "3-4 days",
  },
  {
    slug: "mt-talinis",
    name: "Mt. Talinis",
    type: "Mountain",
    elevation: "1,903 MASL",
    difficulty: "Advanced",
    location: "Valencia, Negros Oriental",
    lat: 9.2553,
    lng: 123.1761,
    description:
      "Also known as Cuernos de Negros (Horns of Negros), this twin-peaked stratovolcano offers a stunning traverse passing Lake Nailig and Lake Yagumyum.",
    highlights: ["Twin peaks", "Lake Nailig", "Lake Yagumyum", "Sea of clouds"],
    duration: "2-3 days",
  },
  {
    slug: "grassland-campsite",
    name: "Grassland Campsite",
    type: "Grassland",
    elevation: "1,200 MASL",
    difficulty: "Beginner",
    location: "Don Salvador Benedicto, Negros Occidental",
    lat: 10.6789,
    lng: 123.2456,
    description:
      "Wide rolling grasslands perfect for beginners and weekend campers. Offers a cool climate, panoramic ridgelines, and an unobstructed view of the stars.",
    highlights: ["Rolling hills", "Stargazing", "Cool climate", "Family friendly"],
    duration: "Day hike / Overnight",
  },
  {
    slug: "nn-farm",
    name: "N&N Farm",
    type: "Farm",
    elevation: "900 MASL",
    difficulty: "Beginner",
    location: "Don Salvador Benedicto, Negros Occidental",
    lat: 10.6892,
    lng: 123.2389,
    description:
      "A private mountain farm and glamping destination featuring strawberry fields, pine trees, and a chill highland atmosphere. A favorite weekend escape.",
    highlights: ["Strawberry picking", "Glamping", "Pine forest", "Sunrise viewdeck"],
    duration: "Day trip / Overnight",
  },
  {
    slug: "magtahos",
    name: "Magtahos Campsite",
    type: "Campsite",
    elevation: "1,050 MASL",
    difficulty: "Intermediate",
    location: "Don Salvador Benedicto, Negros Occidental",
    lat: 10.6701,
    lng: 123.2298,
    description:
      "An emerging campsite tucked along a ridge in Magtahos, offering a sea of clouds, sunrise views, and a peaceful pine-lined trail to the peak.",
    highlights: ["Sea of clouds", "Sunrise deck", "Pine trails", "Quiet campsite"],
    duration: "Overnight",
  },
  {
    slug: "mt-kanlaon",
    name: "Mt. Kanlaon",
    type: "Mountain",
    elevation: "2,465 MASL",
    difficulty: "Advanced",
    location: "Negros Island",
    lat: 10.4119,
    lng: 123.1325,
    description:
      "The highest peak in Central Visayas and an active stratovolcano. Permits required. Iconic for its crater, Margaja Valley, and Pagatpat traverse.",
    highlights: ["Active crater", "Margaja Valley", "Highest in Visayas", "Permit required"],
    duration: "3-4 days",
  },
  {
    slug: "mt-silay",
    name: "Mt. Silay",
    type: "Mountain",
    elevation: "1,535 MASL",
    difficulty: "Intermediate",
    location: "Silay City, Negros Occidental",
    lat: 10.7350,
    lng: 123.1742,
    description:
      "Part of the Northern Negros Natural Park, Mt. Silay offers dense forest cover, waterfalls, and a beginner-to-intermediate trail.",
    highlights: ["Waterfalls", "Forest trail", "Wildlife", "Day-hike option"],
    duration: "1-2 days",
  },
  {
    slug: "mt-canlandog",
    name: "Mt. Canlandog",
    type: "Mountain",
    elevation: "1,247 MASL",
    difficulty: "Intermediate",
    location: "Moises Padilla, Negros Occidental",
    lat: 10.2728,
    lng: 123.0922,
    description:
      "A scenic peak in south-central Negros offering rolling ridges, panoramic views of the Tañon Strait, and a manageable day-to-overnight climb popular with weekend hikers.",
    highlights: ["Ridge walk", "Tañon Strait view", "Sunrise summit", "Cool climate"],
    duration: "1-2 days",
  },
  {
    slug: "malatan-og-falls",
    name: "Malatan-og Falls",
    type: "Falls",
    difficulty: "Beginner",
    location: "Candoni, Negros Occidental",
    lat: 9.8167,
    lng: 122.6500,
    description:
      "A majestic multi-tiered waterfall plunging into a deep emerald pool. Hidden in the forests of Candoni, it's one of the tallest and most photogenic falls in Negros Occidental.",
    highlights: ["Multi-tier cascade", "Swimming pool", "Jungle trek", "Photography spot"],
    duration: "Day trip",
  },
  {
    slug: "mag-aso-falls",
    name: "Mag-Aso Falls",
    type: "Falls",
    difficulty: "Beginner",
    location: "Kabankalan, Negros Occidental",
    lat: 9.9889,
    lng: 122.8175,
    description:
      "A twin waterfall whose name means 'smoke' for the mist it produces. Easy access, cool swimming basin, and a picnic-friendly setting.",
    highlights: ["Twin falls", "Misty basin", "Picnic area", "Easy access"],
    duration: "Day trip",
  },
  {
    slug: "buenos-aires-falls",
    name: "Buenos Aires Falls",
    type: "Falls",
    difficulty: "Beginner",
    location: "Don Salvador Benedicto, Negros Occidental",
    lat: 10.6450,
    lng: 123.2150,
    description:
      "A serene waterfall tucked along the highland road of DSB. Cool mountain water, mossy rocks, and an easy roadside trek make it a perfect quick stop.",
    highlights: ["Roadside access", "Cool pool", "Highland setting", "Family friendly"],
    duration: "Half day",
  },
  {
    slug: "pulang-tubig-falls",
    name: "Pulang Tubig Falls",
    type: "Falls",
    difficulty: "Intermediate",
    location: "Calatrava, Negros Occidental",
    lat: 10.5972,
    lng: 123.4761,
    description:
      "A tall, powerful waterfall named for its reddish-tinted waters during the rainy season. Requires a moderate trek through forest trails and river crossings.",
    highlights: ["Tall cascade", "River trek", "Forest trail", "Secluded"],
    duration: "Day trip",
  },
];

export const getMountain = (slug: string) => MOUNTAINS.find((m) => m.slug === slug);
