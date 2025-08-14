import { useEffect } from "react";
import { useDeletedGastos } from "../../../hooks/useDeletedGastos";
import { RotateCcw, Trash2 } from "lucide-react";
import { useCategorias } from "../../../hooks/UseCategorias";


const PapeleraGastos = () => {

    const { categorias, cargar: cargarCategorias } = useCategorias();


    const {
        gastos: gastosEliminados,
        estado: estadoEliminados,
        error: errorEliminados,
        cargar: cargarEliminados,
        restaurar,
        eliminarPermanente
    } = useDeletedGastos();

    useEffect(() => {
        if (errorEliminados) {
            console.error('Error con gastos eliminados:', errorEliminados);
        }
    }, [errorEliminados]);

    // Carga inicial de datos y recarga cuando hay cambios
    useEffect(() => {
        const reloadAll = () => {
            cargarEliminados();
            cargarCategorias();
        };
        reloadAll(); // Carga inicial

        window.addEventListener('gastos:cambio', reloadAll);
        return () => {
            window.removeEventListener('gastos:cambio', reloadAll);
        };
    }, [cargarEliminados, cargarCategorias]);




    const handleRestaurar = async (id: number | undefined) => {
        if (!id) return;
        // Confirmación antes de restaurar
        if (window.confirm('¿Estás seguro de que quieres restaurar este gasto?')) {
            await restaurar(id);
        }
    };

    const handleEliminarPermanente = async (id: number | undefined) => {
        if (!id) return;
        // Confirmación antes de eliminar permanentemente
        if (window.confirm('¿Estás seguro de que quieres eliminar este gasto permanentemente? Esta acción no se puede deshacer.')) {
            await eliminarPermanente(id);
        }
    };


    return (

        < div className="space-y-4 pt-2 mt-2" >
            <h2 className="text-lg font-semibold text-gray-800">Gastos Eliminados (Papelera)</h2>
            {estadoEliminados === 'loading' && <p className="text-gray-500">Cargando gastos eliminados...</p>}
            {
                estadoEliminados === 'success' && gastosEliminados.length === 0 && (
                    <p className="text-gray-500 text-sm">No hay gastos en la papelera.</p>
                )
            }
            <div className="space-y-3 text-left">
                {gastosEliminados.map((gasto) => {
                    const categoriaDelGasto = categorias.find(c => c.id === Number(gasto.categoria));
                    const color = categoriaDelGasto?.color || 'gray';

                    return (
                        <div
                            key={gasto.id}
                            className={`p-3 rounded-lg shadow bg-white border-l-8 border-l-${color}-500 flex justify-between items-center`}
                        >
                            <div>
                                <p className="font-semibold text-gray-700">{categoriaDelGasto?.nombre || 'Sin Categoría'}</p>
                                <p className="text-sm text-gray-600">
                                    {new Date(gasto.fecha + 'T00:00:00').toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })} - <span className="font-mono">${gasto.cantidad.toFixed(2)}</span>
                                </p>
                                {gasto.descripcion && <p className="text-xs text-gray-500 italic mt-1 max-w-xs">{gasto.descripcion}</p>}
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => handleRestaurar(gasto.id)}
                                    title="Restaurar gasto"
                                    className="p-1 rounded-full hover:bg-green-100 transition-colors"
                                >
                                    <RotateCcw size={20} className="text-green-600" />
                                </button>
                                <button
                                    onClick={() => handleEliminarPermanente(gasto.id)}
                                    title="Eliminar permanentemente"
                                    className="p-1 rounded-full hover:bg-red-100 transition-colors"
                                >
                                    <Trash2 size={20} className="text-red-600" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div >
    );
}

export default PapeleraGastos;