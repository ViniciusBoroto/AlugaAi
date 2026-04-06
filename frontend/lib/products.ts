export type Product = {
  id: string
  title: string
  description: string
  price: number
  image: string
  category: string
  rating: number
  reviewsCount: number
}

export const products: Product[] = [
  {
    id: "furadeira-impacto",
    title: "Furadeira de Impacto",
    description: "650W, mandril 3/4\", ideal para concreto e alvenaria",
    price: 35,
    image:
      "https://images.tcdn.com.br/img/img_prod/1185228/furadeira_de_impacto_gsb_550_bosch_127v_1311_1_20230508104225.jpg",
    category: "Construção",
    rating: 4.9,
    reviewsCount: 312,
  },
  {
    id: "betoneira-120l",
    title: "Betoneira 120L",
    description: "Motor 1/2 CV, tambor basculante, estrutura reforçada",
    price: 89,
    image:
      "https://images.tcdn.com.br/img/img_prod/650492/betoneira_120_litros_bivolt_csm120b_csv_1_20220623142449.jpg",
    category: "Construção",
    rating: 4.7,
    reviewsCount: 87,
  },
  {
    id: "serra-circular",
    title: "Serra Circular",
    description: "1200W, disco 7.1/4\", profundidade de corte 65mm",
    price: 45,
    image:
      "https://images.tcdn.com.br/img/img_prod/650492/serra_circular_cs5005_dewalt_110v_1_20210916165448.jpg",
    category: "Construção",
    rating: 4.6,
    reviewsCount: 204,
  },
  {
    id: "cortador-grama",
    title: "Cortador de Grama",
    description: "Motor a gasolina 4T, 3.5HP, corte 46cm",
    price: 55,
    image:
      "https://images.tcdn.com.br/img/img_prod/650492/cortador_de_grama_a_gasolina_honda_hrb216hxa_1_20211018104837.jpg",
    category: "Jardinagem",
    rating: 4.8,
    reviewsCount: 156,
  },
  {
    id: "motosserra-16",
    title: "Motosserra 16\"",
    description: "40cc, corrente automática, partida fácil",
    price: 70,
    image:
      "https://images.tcdn.com.br/img/img_prod/650492/motosserra_a_gasolina_cs_400_husqvarna_40_3_cc_1_20211018110507.jpg",
    category: "Jardinagem",
    rating: 4.5,
    reviewsCount: 98,
  },
  {
    id: "esmerilhadeira-angular",
    title: "Esmerilhadeira Angular",
    description: "900W, disco 4.1/2\", proteção ajustável",
    price: 28,
    image:
      "https://images.tcdn.com.br/img/img_prod/650492/esmerilhadeira_angular_gws_700_bosch_127v_1_20210916170523.jpg",
    category: "Construção",
    rating: 4.7,
    reviewsCount: 431,
  },
]
