export const site = {
  name: "Gideão",
  fullName: "Gideão Atacadão da Construção",
  tagline: "Todo dia é dia de ofertas",
  phoneDisplay: "(21) 3589-9833",
  whatsappNumber: "552135899833",
  address: {
    line: "Rua Almirante Batista das Neves, nº 525",
    city: "Mesquita - RJ",
    mapsQuery: "Rua Almirante Batista das Neves, 525, Mesquita, RJ",
  },
  hours: [
    { label: "Segunda a sábado", value: "8h às 18h" },
    { label: "Domingo", value: "8h às 13h" },
  ],
};

export function waLink(message: string) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${site.whatsappNumber}?text=${text}`;
}

export const categories = [
  {
    id: "pisos",
    title: "Pisos & Porcelanatos",
    description: "Polidos, retificados e em diversas medidas para sua obra ou reforma.",
    icon: "Grid3x3",
    message: "Olá! Quero saber os preços de pisos e porcelanatos da Gideão.",
  },
  {
    id: "revestimentos",
    title: "Revestimentos",
    description: "Revestimentos e acabamentos para paredes internas e externas.",
    icon: "Layers",
    message: "Olá! Quero saber os preços de revestimentos da Gideão.",
  },
  {
    id: "tintas",
    title: "Tintas",
    description: "Látex, acrílicas, esmaltes e acessórios das principais marcas do mercado.",
    icon: "PaintBucket",
    message: "Olá! Quero saber os preços de tintas da Gideão.",
  },
  {
    id: "construcao",
    title: "Materiais de Construção",
    description: "Tijolos, argamassas, rejuntes, mantas e tudo para a base da sua obra.",
    icon: "BrickWall",
    message: "Olá! Quero saber os preços de materiais de construção da Gideão.",
  },
  {
    id: "ferramentas",
    title: "Ferramentas",
    description: "Chaves, brocas, discos, escadas e ferramentas para todo tipo de serviço.",
    icon: "Hammer",
    message: "Olá! Quero saber sobre ferramentas da Gideão.",
  },
  {
    id: "eletrica",
    title: "Elétrica & Iluminação",
    description: "Disjuntores, tomadas, interruptores, fios, lâmpadas e luminárias.",
    icon: "Zap",
    message: "Olá! Quero saber os preços de material elétrico e iluminação da Gideão.",
  },
  {
    id: "hidraulica",
    title: "Hidráulica",
    description: "Tubos, conexões, registros, mangueiras e tudo para água e esgoto.",
    icon: "Pipette",
    message: "Olá! Quero saber os preços de material hidráulico da Gideão.",
  },
  {
    id: "ferragens",
    title: "Ferragens & Fixação",
    description: "Parafusos, buchas, porcas, abraçadeiras, pregos e suportes.",
    icon: "Nut",
    message: "Olá! Quero saber os preços de ferragens e fixação da Gideão.",
  },
  {
    id: "portas",
    title: "Portas & Janelas",
    description: "Portas, janelas, fechaduras, dobradiças, puxadores e soleiras.",
    icon: "DoorOpen",
    message: "Olá! Quero saber os preços de portas e janelas da Gideão.",
  },
  {
    id: "banheiros",
    title: "Banheiros & Cozinhas",
    description: "Pias, vasos, armários, chuveiros, resistências e acessórios.",
    icon: "Bath",
    message: "Olá! Quero saber os preços de itens para banheiro e cozinha da Gideão.",
  },
  {
    id: "torneiras",
    title: "Torneiras & Metais",
    description: "Torneiras, registros, válvulas, sifões e engates.",
    icon: "Droplets",
    message: "Olá! Quero saber os preços de torneiras e metais da Gideão.",
  },
] as const;

export const differentiators = [
  {
    title: "Preço de atacado",
    description: "Direto da distribuidora para sua obra, todos os dias.",
    icon: "Percent",
  },
  {
    title: "Entrega rápida",
    description: "Levamos o material até você na Baixada Fluminense e região.",
    icon: "Truck",
  },
  {
    title: "Variedade completa",
    description: "Pisos, tintas, metais, portas e muito mais em um só lugar.",
    icon: "ShieldCheck",
  },
] as const;
