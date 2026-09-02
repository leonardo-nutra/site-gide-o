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
    comingSoon: false,
  },
  {
    id: "revestimentos",
    title: "Revestimentos",
    description: "Ripados, frisos e acabamentos para paredes internas e externas.",
    icon: "Layers",
    message: "Olá! Quero saber os preços de revestimentos da Gideão.",
    comingSoon: true,
  },
  {
    id: "tintas",
    title: "Tintas",
    description: "Látex, acrílicas e esmaltes das principais marcas do mercado.",
    icon: "PaintBucket",
    message: "Olá! Quero saber os preços de tintas da Gideão.",
    comingSoon: true,
  },
  {
    id: "torneiras",
    title: "Torneiras & Metais",
    description: "Torneiras, registros e acessórios para cozinha e banheiro.",
    icon: "Droplets",
    message: "Olá! Quero saber os preços de torneiras e metais da Gideão.",
    comingSoon: true,
  },
  {
    id: "portas",
    title: "Portas & Janelas",
    description: "Modelos variados em madeira, alumínio e vidro.",
    icon: "DoorOpen",
    message: "Olá! Quero saber os preços de portas e janelas da Gideão.",
    comingSoon: true,
  },
  {
    id: "ferramentas",
    title: "Ferramentas & Materiais",
    description: "Tudo para construção, reforma e acabamento em um só lugar.",
    icon: "Hammer",
    message: "Olá! Quero saber sobre ferramentas e materiais de construção da Gideão.",
    comingSoon: true,
  },
] as const;

export const steps = [
  {
    title: "Monte seu orçamento",
    description: "Adicione os produtos e categorias que precisa ao seu orçamento.",
    icon: "Tag",
  },
  {
    title: "Envie pelo WhatsApp",
    description: "Escolha pagamento e entrega, e mande tudo de uma vez só.",
    icon: "MessageCircle",
  },
  {
    title: "Receba atendimento",
    description: "Nossa equipe confirma preços, prazos e a melhor forma de entrega.",
    icon: "CheckCircle2",
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
