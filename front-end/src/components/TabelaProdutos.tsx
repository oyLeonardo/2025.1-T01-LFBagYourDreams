import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ImagemProduto {
  id: number;
  url: string;
  criado_em: string;
}

interface Produto {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  preco: number;
  quantidade: number;
  material: string;
  cor_padrao: string;
  altura: number | null;
  comprimento: number | null;
  largura: number | null;
  imagens: ImagemProduto[];
}

const columnHelper = createColumnHelper<Produto>();

const columns = [
  columnHelper.accessor('titulo', {
    cell: (info) => info.getValue(),
    header: 'Produto',
  }),
  columnHelper.accessor('quantidade', {
    cell: (info) => <i>{info.getValue()}</i>,
    header: 'Estoque (Quantidade)',
  }),
  columnHelper.accessor('preco', {
    header: 'Preço',
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor('categoria', {
    header: 'Categoria',
  }),
];

function TabelaProdutos() {
  const [products, setproducts] = useState<Produto[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  

  const API_URL = 'http://localhost:8000/api/products/';
  
  useEffect(() => {
    fetchData(API_URL);
  }, []);
  
  function fetchData(baseUrl: string) {
    setCarregando(true);
    setErro(null);
    
    fetch(baseUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setproducts(data);
      })
      .catch((error) => {
        console.error('Erro ao buscar products:', error);
        setErro('Não foi possível carregar os products. Tente novamente mais tarde.');
      })
      .finally(() => {
        setCarregando(false);
      });
  }

  const handleRowClick = (produto: Produto) => {
    navigate(`/admin/produto/${produto.id}`);
  };

  const paginatedData = useMemo(() => {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    return products.slice(start, end);
  }, [pageIndex, pageSize, products]);

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const totalPages = Math.ceil(products.length / pageSize);

  if (carregando) {
    return (
      <div className="p-7 bg-[#f3f3f3] rounded-xl shadow-sm max-w-5xl mx-auto mt-10">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Carregando produtos...</div>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="p-7 bg-[#f3f3f3] rounded-xl shadow-sm max-w-5xl mx-auto mt-10">
        <div className="flex flex-col justify-center items-center h-64">
          <div className="text-lg text-red-600 mb-4">{erro}</div>
          <button 
            onClick={() => fetchData(API_URL)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-7 bg-[#f3f3f3] rounded-xl shadow-sm max-w-5xl mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">Produtos</h2>
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="bg-gray-100 text-gray-600 border-b">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-2">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-b hover:bg-green-300 bg-gray-100 transition cursor-pointer" 
              onClick={() => handleRowClick(row.original)}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginação */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <div className="flex gap-2">
          <button
            onClick={() => setPageIndex((p) => Math.max(p - 1, 0))}
            disabled={pageIndex === 0}
            className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer hover:bg-gray-600 hover:text-white"
          >
            Anterior
          </button>
          <button
            onClick={() =>
              setPageIndex((p) => Math.min(p + 1, totalPages - 1))
            }
            disabled={pageIndex + 1 >= totalPages}
            className="px-3 py-1 border rounded hover:bg-gray-600 hover:text-white disabled:opacity-50 cursor-pointer"
          >
            Próxima
          </button>
        </div>
        <span>
          Página {pageIndex + 1} de {totalPages}
        </span>
      </div>
    </div>
  );
}

export default TabelaProdutos;