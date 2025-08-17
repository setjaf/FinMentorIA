import { memo, useEffect, useState, useRef } from "react";
import type { CategoriaType } from "../../../types/CategoriaType";
import type { GastoType } from "../../../types/GastoType";
import type { ContextMenuGastoState } from "../../../components/ContextMenuGasto";
import ContextMenuGasto from "../../../components/ContextMenuGasto";

type GastoIndividualProps = {
    gasto: GastoType;
    categoria: CategoriaType;
}

const GastoIndividual = memo(
    ({ gasto, categoria }: GastoIndividualProps) => {

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
            <>
                <div
                    key={gasto.id}
                    className={`p-3 rounded-lg shadow-sm border-l-8 border-l-${categoria.color}-500 flex justify-between items-center ${contextMenu.visible ? 'bg-blue-100' : 'bg-white'} select-none`}
                    onContextMenu={handleContextMenu}   // Para clic derecho en escritorio
                    onTouchStart={handleTouchStart}     // Para simular toque largo en móviles
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    style={{ WebkitTouchCallout: 'none' }} // Evita el menú nativo de iOS
                >
                    <div>
                        <p className="font-semibold text-gray-800">{categoria?.nombre || 'Sin Categoría'}</p>
                        <p className="text-sm text-gray-600">${gasto.cantidad.toFixed(2)}</p>
                        <p className="text-xs text-gray-500 italic max-w-xs">{gasto.descripcion}</p>
                    </div>
                </div>

                <ContextMenuGasto gasto={gasto} contextMenu={contextMenu} onCloseContextMenu={handleCloseContextMenu} />
            </>
        );
    }
);


export default GastoIndividual;