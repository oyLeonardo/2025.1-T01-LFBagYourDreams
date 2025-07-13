import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api'; // Garanta que este import esteja correto

interface Pedido {
  id: number;
  status: string;
  valor_total: number;
  frete: number;
  criado_em: string;
}

const columnHelper = createColumnHelper<Pedido>();

const columns = [
  columnHelper.accessor('status', {
    cell: (info) => info.getValue(),
    header: 'Status',
  }),
  columnHelper.accessor('valor_total', {
    cell: (info) => `R$ ${Number(info.getValue()).toFixed(2)}`,
    header: 'Valor Total',
  }),
  columnHelper.accessor('frete', {
    header: 'Frete',
    cell: (info) => `R$ ${Number(info.getValue()).toFixed(2)}`,
  }),
  columnHelper.accessor('criado_em', {
    header: 'Data do Pedido',
    cell: (info) => new Date(info.getValue()).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    }),
  }),
];

function TabelaPedidos() {
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  
  // A função é declarada aqui, no corpo do componente
  const fetchData = async () => {
    setCarregando(true);
    setErro(null);
    try {
      const response = await apiClient.get('/orders/'); // Usa nosso apiClient
      setPedidos(response.data.results || response.data); // Funciona com ou sem paginação
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      setErro('Não foi possível carregar os pedidos. Verifique se você está logado.');
    } finally {
      setCarregando(false);
    }
  };

  // O useEffect chama a função quando a página carrega pela primeira vez
  useEffect(() => {
    fetchData();
  }, []); // O array vazio [] garante que isso só aconteça uma vez.

  const handleRowClick = (pedido: Pedido) => {
    // navigate(`/admin/pedido/${pedido.id}`);
    console.log("Pedido clicado:", pedido);
  };

  const paginatedData = useMemo(() => {
    const start = pageIndex * pageSize;
    const end = start + pageSize; 
    return pedidos.slice(start, end);
  }, [pageIndex, pageSize, pedidos]);

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const totalPages = Math.ceil(pedidos.length / pageSize);


  if (carregando) {
    return (
      <div className="p-7 bg-[#f3f3f3] rounded-xl shadow-sm max-w-5xl mx-auto mt-10">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
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
          onClick={fetchData}  
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
      <h2 className="text-xl font-semibold mb-4">Pedidos</h2>
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

export default TabelaPedidos;