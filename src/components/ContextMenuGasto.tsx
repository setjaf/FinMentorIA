import { useNavigate } from "react-router-dom";
import { ConfirmationModal } from "./ConfirmationModal"
import { useGastos } from "../hooks/UseGastos";
import { useState } from "react";
import type { GastoType } from "../types/GastoType";
import { Pencil, Trash2 } from "lucide-react";

type ContextMenuGastoProps = {
    gasto: GastoType;
    contextMenu: ContextMenuGastoState;
    onCloseContextMenu: () => void;
};


export type ContextMenuGastoState = {
  visible: boolean;
  x: number;
  y: number;
};



const ContextMenuGasto = ({ gasto, contextMenu, onCloseContextMenu }: ContextMenuGastoProps) => {

    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const navigate = useNavigate();
    const {eliminarSoft} = useGastos();


    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Puedes pasar el id del gasto por query param o state
        navigate(`/registrar?id=${gasto.id}`);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onCloseContextMenu(); // Cerrar menú contextual
        setDeleteModalOpen(true); // Abrir modal de confirmación
    };

    const confirmDelete = async () => {
        if (!gasto.id) return;
        await eliminarSoft(gasto.id);
        setDeleteModalOpen(false);
    };

    return (
        <>
        {contextMenu.visible && (
            <div
                style={{ top: contextMenu.y, left: contextMenu.x }}
                className="fixed z-50 bg-white border border-gray-200 rounded-md shadow-lg py-1"
            >
                <button
                    onClick={handleEdit}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                    <Pencil size={16} className="mr-2" />
                    Editar
                </button>
                <button
                    onClick={handleDelete}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                    <Trash2 size={16} className="mr-2" />
                    Eliminar
                </button>
            </div>
        )}
            

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                title="Eliminar Gasto"
                message={`¿Estás seguro de que quieres mover este gasto a la papelera?`}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteModalOpen(false)}
                confirmText="Eliminar"
            />
        </>

    );

}

export default ContextMenuGasto;