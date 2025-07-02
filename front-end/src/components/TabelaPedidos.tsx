import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { defaultData, type Person } from '../__mocks__/datamockadapedidos';
import { useNavigate } from 'react-router-dom';

const columnHelper = createColumnHelper<Person>();

const columns = [
  columnHelper.accessor('produto', {
    cell: (info) => info.getValue(),
    header: 'Produto',
  }),
  columnHelper.accessor('estoque', {
    cell: (info) => <i>{info.getValue()}</i>,
    header: 'Estoque',
  }),
  columnHelper.accessor('data', {
    header: 'Data',
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
  }),
  columnHelper.accessor('preco', {
    header: 'Preço',
  }),
];

function TabelaPedidos() {
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;
  const navigate = useNavigate();


  const handleRowClick = (pedido: Person) => {
    navigate(`/pedido/${pedido.produto}`); //aqui deveria ser .id mas os dados estão mockados e eu não fiz um id para eles kkkkkkkk
  }; 

  const paginatedData = useMemo(() => {
    const start = pageIndex * pageSize;
    const end = start + pageSize; 
    return defaultData.slice(start, end);
  }, [pageIndex, pageSize]); 

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const totalPages = Math.ceil(defaultData.length / pageSize);

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