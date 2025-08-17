import { memo, useEffect, useState } from "react";
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
            <>
                <div
                    key={gasto.id}
                    className={`p-3 rounded-lg shadow-sm  border-l-6 border-l-${categoria.color}-500 flex justify-between items-center ${contextMenu.visible ? 'bg-blue-100' : 'bg-white'}`}
                    onContextMenu={handleContextMenu}
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