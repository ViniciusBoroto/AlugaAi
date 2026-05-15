export type Product = {
  id: string
  title: string
  description: string
  price: number
  image: string
  category: string
  rating: number
  reviewsCount: number
  location: string
}

export const products: Product[] = [
  {
    id: "furadeira-impacto",
    title: "Furadeira de Impacto",
    description: '650W, mandril 3/4", ideal para concreto e alvenaria',
    price: 35,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8mlEVmVp22nPEwKtik2ck36lafESyW0ZZPg&s",
    category: "Construção",
    rating: 4.9,
    reviewsCount: 312,
    location: "São Paulo, SP",
  },
  {
    id: "betoneira-120l",
    title: "Betoneira 120L",
    description: "Motor 1/2 CV, tambor basculante, estrutura reforçada",
    price: 89,
    image:
      "https://casadopicapau.vtexassets.com/arquivos/ids/164635/40104201.png?v=638248684185000000",
    category: "Construção",
    rating: 4.7,
    reviewsCount: 87,
    location: "Campinas, SP",
  },
  {
    id: "serra-circular",
    title: "Serra Circular",
    description: '1200W, disco 7.1/4", profundidade de corte 65mm',
    price: 45,
    image:
      "https://madeirasgasometro.vtexassets.com/arquivos/ids/174359/serra-circular-185mm-sc16-stanley-imagem-01.jpg?v=637139100535670000",
    category: "Construção",
    rating: 4.6,
    reviewsCount: 204,
    location: "Curitiba, PR",
  },
  {
    id: "cortador-grama",
    title: "Cortador de Grama",
    description: "Motor a gasolina 4T, 3.5HP, corte 46cm",
    price: 55,
    image:
      "https://images.tcdn.com.br/img/img_prod/1103256/cortador_de_grama_eletrico_trapp_mc_50e_505095609_1_fcef2609ebc7a80914e8397ed17df267.jpg",
    category: "Jardinagem",
    rating: 4.8,
    reviewsCount: 156,
    location: "Porto Alegre, RS",
  },
  {
    id: "motosserra-16",
    title: 'Motosserra 16"',
    description: "40cc, corrente automática, partida fácil",
    price: 70,
    image:
      "https://m.media-amazon.com/images/I/31Ulzu8teNL._AC_UF894,1000_QL80_.jpg",
    category: "Jardinagem",
    rating: 4.5,
    reviewsCount: 98,
    location: "Belo Horizonte, MG",
  },
  {
    id: "esmerilhadeira-angular",
    title: "Esmerilhadeira Angular",
    description: '900W, disco 4.1/2", proteção ajustável',
    price: 28,
    image:
      "https://images.tcdn.com.br/img/img_prod/219075/kit_serra_circular_gks150_e_esmerilhadeira_gws850_220v_disco_de_serra_184mm_bosch_144521_5_8ebb47c4500388a990a8a52db2fa1242.jpg",
    category: "Construção",
    rating: 4.7,
    reviewsCount: 431,
    location: "São Paulo, SP",
  },
]
