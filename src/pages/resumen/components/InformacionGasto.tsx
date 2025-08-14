import { memo, useState } from 'react';
import { Info, Pencil } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import type { GastoType } from '../../../types/GastoType';

// Envolvemos el componente con React.memo.
// Esto evita que se vuelva a renderizar si sus props (en este caso, `gasto`)
// no han cambiado, lo cual es una optimización clave para componentes en una lista.
const InformacionGasto = memo(({ gasto }: { gasto: GastoType }) => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Puedes pasar el id del gasto por query param o state
    navigate(`/registrar?id=${gasto.id}`);
  };

  return (
    <li
      onClick={() => setShow((v) => !v)}
      className="flex justify-between items-center relative align-middle text-gray-600 focus:text-blue-900"
    >
      <span className="flex align-middle">
        {
          gasto.descripcion && (
            <button
              type="button"
              className="relative mr-1 focus:text-blue-900"
              tabIndex={0}
            >
              <Info size={20} />
              {show && (
                <div
                  className={`absolute left-0 top-full mt-1 z-50 bg-white border border-gray-300 rounded shadow-lg p-2 text-xs text-gray-800 min-w-[80px] max-w-[180px]`}
                >
                  {gasto.descripcion}
                </div>
              )}
            </button>
          )
        }
        {gasto.fecha.split('-').reverse().join('/')}
      </span>
      <span className="flex items-center gap-2">
        ${gasto.cantidad.toFixed(2)}
        {show && (
          <button
            type="button"
            tabIndex={1}
            onClick={handleEdit}>
            <Pencil size={20} />
          </button>)}
      </span>
    </li>
  );
});

export default InformacionGasto;