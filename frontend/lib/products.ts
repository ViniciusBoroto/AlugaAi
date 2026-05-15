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
      "https://lojawap.vtexassets.com/arquivos/ids/176185/parafusadeira-e-furadeira-de-impacto-wap-wf-700-fe_01.png?v=638793668909000000",
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
    id: "soprador-folhas",
    title: "Soprador de Folhas",
    description: "Elétrico 2500W, função soprador e aspirador",
    price: 38,
    image:
      "https://png.pngtree.com/png-vector/20260110/ourmid/pngtree-powerful-leaf-blower-for-efficient-yard-maintenance-png-image_18461858.webp",
    category: "Jardinagem",
    rating: 4.6,
    reviewsCount: 74,
    location: "Joinville, SC",
  },
  {
    id: "aparador-cerca-viva",
    title: "Aparador de Cerca Viva",
    description: "Lâmina 51cm, empunhadura ergonômica, corte preciso",
    price: 42,
    image:
      "https://www.trapp.com.br/wp-content/uploads/2024/09/htx-6000.png",
    category: "Jardinagem",
    rating: 4.7,
    reviewsCount: 121,
    location: "Ribeirão Preto, SP",
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
  {
    id: "lavadora-alta-pressao",
    title: "Lavadora de Alta Pressão",
    description: "1800 PSI, mangueira 5m, ideal para quintais e fachadas",
    price: 50,
    image:
      "https://lojawap.vtexassets.com/arquivos/ids/174272/lavadora-de-alta-pressao-1400w-1500psi-wap-eco-fit-2200_01.png?v=638792139812700000",
    category: "Doméstica",
    rating: 4.8,
    reviewsCount: 189,
    location: "Santos, SP",
  },
  {
    id: "aspirador-po-agua",
    title: "Aspirador de Pó e Água",
    description: "20L, filtro lavável, acompanha bocais para limpeza pesada",
    price: 34,
    image:
      "https://images.tcdn.com.br/img/img_prod/1156829/aspirador_de_po_agua_gtw_inox_50l_1600w_127v_wap_161_1_e04b2fcca7840d859381216db4f5df76.png",
    category: "Doméstica",
    rating: 4.6,
    reviewsCount: 142,
    location: "Osasco, SP",
  },
  {
    id: "extratora-estofados",
    title: "Extratora de Estofados",
    description: "Limpeza profunda de sofás, bancos e tapetes",
    price: 65,
    image:
      "https://lojawap.vtexassets.com/arquivos/ids/175322/extratora-de-carpetes-e-estofados-wap-carpet-cleaner.png?v=638793009458600000",
    category: "Doméstica",
    rating: 4.9,
    reviewsCount: 96,
    location: "Guarulhos, SP",
  },
  {
    id: "escada-articulada",
    title: "Escada Articulada",
    description: "4x4 degraus, alumínio, suporta até 150kg",
    price: 30,
    image:
      "https://www.reisam.com.br/wp-content/uploads/2021/01/articulada-1.png",
    category: "Doméstica",
    rating: 4.7,
    reviewsCount: 238,
    location: "São Bernardo do Campo, SP",
  },
  {
    id: "macaco-hidraulico",
    title: "Macaco Hidráulico",
    description: "Tipo jacaré, capacidade 2 toneladas, rodas de apoio",
    price: 32,
    image:
      "https://bzautomotive.com/wp-content/uploads/2024/08/macaco-hidraulico-jacare-3-ton-para-caminhao-bz-automotive-3.png",
    category: "Automotivo",
    rating: 4.8,
    reviewsCount: 173,
    location: "Sorocaba, SP",
  },
  {
    id: "compressor-ar",
    title: "Compressor de Ar",
    description: "24L, 2HP, indicado para calibragem e pintura leve",
    price: 58,
    image:
      "https://brasmetal.com/wp-content/uploads/2019/02/Imagens-recortadas_37.png",
    category: "Automotivo",
    rating: 4.7,
    reviewsCount: 128,
    location: "Jundiaí, SP",
  },
  {
    id: "politriz-automotiva",
    title: "Politriz Automotiva",
    description: "Rotativa 7\", controle de velocidade, boina inclusa",
    price: 40,
    image:
      "https://blog.leroymerlin.com.br/wp-content/uploads/2024/05/politriz_roto_orbital_5_pol_1050w_mxt_5130_maxx_tools_1570435547_8855_600x600-1.png",
    category: "Automotivo",
    rating: 4.6,
    reviewsCount: 88,
    location: "São Caetano do Sul, SP",
  },
  {
    id: "scanner-automotivo",
    title: "Scanner Automotivo",
    description: "OBD2, leitura de falhas, compatível com carros nacionais",
    price: 46,
    image:
      "https://www.alfatest.com.br/wp-content/uploads/2023/10/rf-ALFATEST-116-recorte-Grande.png",
    category: "Automotivo",
    rating: 4.5,
    reviewsCount: 67,
    location: "Mogi das Cruzes, SP",
  },
]
