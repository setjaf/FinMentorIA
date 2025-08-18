import { memo, useState, useEffect, useRef } from 'react';
import type { GastoType } from '../../../types/GastoType';
import type { ContextMenuGastoState } from '../../../components/ContextMenuGasto';
import ContextMenuGasto from '../../../components/ContextMenuGasto';
import type { CategoriaType } from '../../../types/CategoriaType';

type InformacionGastoDiaProps = {
  gasto: GastoType;
  categoria: CategoriaType;
};


// Envolvemos el componente con React.memo.
// Esto evita que se vuelva a renderizar si sus props (en este caso, `gasto`)
// no han cambiado, lo cual es una optimización clave para componentes en una lista.
const InformacionGasto = memo(({gasto, categoria}: InformacionGastoDiaProps) => {
  const [contextMenu, setContextMenu] = useState<ContextMenuGastoState>({ visible: false, x: 0, y: 0 });
  const longPressTimer = useRef<number | null>(null);
    
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
  
  const openContextMenu = (x: number, y: number) => {
            setContextMenu({
                visible: true,
                x: x,
                y: y,
            });
        };

  const handleContextMenu = (e: React.MouseEvent) => {
      e.preventDefault(); // Previene el menú contextual del navegador
      openContextMenu(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
      if (longPressTimer.current) clearTimeout(longPressTimer.current);
      const touch = e.touches[0];
      longPressTimer.current = window.setTimeout(() => {
          openContextMenu(touch.clientX, touch.clientY);
      }, 500); // 500ms para un toque largo
  };

  const handleTouchMove = () => {
      if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  const handleTouchEnd = () => {
      if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  const handleCloseContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  }

  return (
    <li
      onTouchStart={handleTouchStart}     // Para simular toque largo en móviles
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onContextMenu={handleContextMenu}
      className={`flex justify-between items-start relative align-middle text-gray-600 p-1 transition-colors
        ${contextMenu.visible ? 'bg-blue-100' : 'hover:bg-gray-50'} border-b-1 border-b-gray-100 select-none
        border-l-4 border-l-${categoria?.color || 'gray'}-500
      `}
    >

      <div className='flex flex-col items-start gap-2'>
        <span className="flex align-middle">
          {categoria?.nombre || 'Sin Categoría'}          
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