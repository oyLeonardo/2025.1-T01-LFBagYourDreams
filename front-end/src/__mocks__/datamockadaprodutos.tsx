
export type Product = {
  id: number
  produto: string
  estoque: string
  data: number
  status: string
  preco: number
}

export const defaultData: Product[] = [
  {
    id: 1,
    produto: 'Bolsa de Couro Premium',
    estoque: '25',
    data: 24,
    status: 'Ativo',
    preco: 150,
  },
  {
    id: 2,
    produto: 'Mochila Executiva',
    estoque: '18',
    data: 40,
    status: 'Ativo',
    preco: 280,
  },
  {
    id: 3,
    produto: 'Carteira Masculina',
    estoque: '35',
    data: 45,
    status: 'Ativo',
    preco: 75,
  },
  {
    id: 4,
    produto: 'Bolsa Feminina Casual',
    estoque: '12',
    data: 29,
    status: 'Ativo',
    preco: 120,
  },
  {
    id: 5,
    produto: 'Mala de Viagem',
    estoque: '8',
    data: 32,
    status: 'Ativo',
    preco: 350,
  },
  {
    id: 6,
    produto: 'Necessaire de Couro',
    estoque: '22',
    data: 28,
    status: 'Ativo',
    preco: 85,
  },
]