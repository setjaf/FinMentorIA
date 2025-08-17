import { memo, useState, useEffect } from 'react';
import type { GastoType } from '../../../types/GastoType';
import type { ContextMenuGastoState } from '../../../components/ContextMenuGasto';
import ContextMenuGasto from '../../../components/ContextMenuGasto';



// Envolvemos el componente con React.memo.
// Esto evita que se vuelva a renderizar si sus props (en este caso, `gasto`)
// no han cambiado, lo cual es una optimización clave para componentes en una lista.
const InformacionGasto = memo(({ gasto }: { gasto: GastoType }) => {
  const [contextMenu, setContextMenu] = useState<ContextMenuGastoState>({ visible: false, x: 0, y: 0 });
    
  // Efecto para manejar el cierre del menú contextual al hacer clic fuera
  useEffect(() => {
    const handleClick = () => setContextMenu({ ...contextMenu, visible: false });
    if (contextMenu.visible) {
      document.addEventListener('click', handleClick);
    }
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [contextMenu]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  }

  return (
    <li
      onContextMenu={handleContextMenu}
      className={`flex justify-between items-start relative align-middle text-gray-600 p-1 transition-colors
        ${contextMenu.visible ? 'bg-blue-100' : 'hover:bg-gray-50'} border-b-1 border-b-gray-100
      `}
    >

      <div className='flex flex-col items-start gap-2'>
        <span className="flex align-middle">
          {gasto.fecha.split('-').reverse().join('/')}          
        </span>
        <p className="text-xs text-gray-500 italic max-w-80">{gasto.descripcion}</p>
      </div>

      <span className="flex items-center gap-2">
        ${gasto.cantidad.toFixed(2)}
      </span>

      <ContextMenuGasto gasto={gasto} contextMenu={contextMenu} onCloseContextMenu={handleCloseContextMenu} />
      
    </li>
  );
});

export default InformacionGasto;