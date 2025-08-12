import { useEffect, useState } from "react";
import type { CategoriaType } from "../types/CategoriaType";
import { useGastos } from "../hooks/UseGastos";
import { useNavigate } from "react-router-dom";
import { localNow } from "../utils/TimeUtil";

interface Props {
  onClose: () => void;
  categorias: CategoriaType[];
  gastoId?: string | null; // Opcional para editar un gasto existente
}

export const FormGasto = ({ onClose, categorias, gastoId }: Props) => {
  const [cantidad, setCantidad] = useState("");
  const [categoria, setCategoria] = useState("");
  const [fecha, setFecha] = useState(localNow().toISOString().split("T")[0]);
  const [descripcion, setDescripcion] = useState("");
  const [errores, setErrores] = useState({
    cantidad: false,
    categoria: false,
    fecha: false,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();
  const { crear, actualizar, eliminar, gastos } = useGastos();

  // Cargar datos del gasto si gastoId está presente
  useEffect(() => {
    const cargarGasto = async () => {
      if (gastoId) {
        const gasto = gastos.find((g) => g.id?.toString() == gastoId);
        if (gasto) {
          setCantidad(gasto.cantidad.toString());
          setCategoria(gasto.categoria);
          setFecha(gasto.fecha);
          setDescripcion(gasto.descripcion || "");
        }
      }
    };
    cargarGasto();
  }, [gastoId, gastos]);

  const validar = (): boolean => {
    const nuevosErrores = {
      cantidad: !cantidad || parseFloat(cantidad) <= 0,
      categoria: !categoria,
      fecha: !fecha,
    };
    setErrores(nuevosErrores);
    return !Object.values(nuevosErrores).some(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validar()) {
      if (gastoId) {
        // Editar gasto existente
        await actualizar(gastoId, {
          cantidad: parseFloat(cantidad),
          categoria,
          fecha,
          descripcion: descripcion.trim() || undefined,
        });
        navigate(`/`);
      } else {
        // Crear nuevo gasto
        await crear({
          cantidad: parseFloat(cantidad),
          categoria,
          fecha,
          descripcion: descripcion.trim() || undefined,
        });
      }
      setCantidad("");
      setCategoria("");
      setFecha(new Date().toISOString().split("T")[0]);
      setDescripcion("");
      window.dispatchEvent(new Event("gastoAdded")); // Notifica que se ha agregado o editado un gasto
      onClose();
    }
  };

  const handleDelete = async () => {
    if (gastoId) {
      await eliminar(Number(gastoId));
      setShowDeleteModal(false);
      navigate(`/`);
      onClose();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="number"
            placeholder="Cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            className={`w-full border rounded-lg p-3 ${errores.cantidad ? "border-red-500" : ""}`}
          />
          {errores.cantidad && <p className="text-red-500 text-sm mt-1">Cantidad inválida</p>}
        </div>
        <div>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className={`w-full border rounded-lg p-3 ${errores.categoria ? "border-red-500" : ""}`}
          >
            <option value="">Selecciona categoría</option>
            {categorias.map((item, index) => (
              <option value={item.id} key={index + (item.id?.toString() || "")}>
                {item.nombre}
              </option>
            ))}
          </select>
          {errores.categoria && <p className="text-red-500 text-sm mt-1">Selecciona una categoría</p>}
        </div>
        <div>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className={`w-full border rounded-lg p-3 ${errores.fecha ? "border-red-500" : ""}`}
          />
          {errores.fecha && <p className="text-red-500 text-sm mt-1">Fecha requerida</p>}
        </div>
        <div>
          <input
            type="text"
            placeholder="Descripción (opcional)"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full border rounded-lg p-3"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            {gastoId ? "Editar gasto" : "Guardar gasto"}
          </button>
          {gastoId && (
            <button
              type="button"
              className="flex-1 bg-red-600 text-white p-3 rounded-lg hover:bg-red-700"
              onClick={() => setShowDeleteModal(true)}
            >
              Eliminar
            </button>
          )}
        </div>
      </form>
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">¿Eliminar gasto?</h2>
            <p className="mb-6 text-gray-600">¿Estás seguro de que deseas eliminar este gasto? Esta acción no se puede deshacer.</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={handleDelete}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
