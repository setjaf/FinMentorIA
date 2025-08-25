import { useEffect, useState, useCallback } from "react";
import type { CategoriaType } from "../types/CategoriaType";
import { useGastos } from "../hooks/UseGastos";
import { useNavigate } from "react-router-dom";
import { ConfirmationModal } from "./ConfirmationModal";
import { getDateString } from "../utils/TimeUtil";

interface Props {
  onClose: () => void;
  categorias: CategoriaType[];
  gastoId?: string | null; // Opcional para editar un gasto existente
}

export const FormGasto = ({ onClose, categorias, gastoId }: Props) => {
  const [cantidad, setCantidad] = useState("");
  const [categoria, setCategoria] = useState("");
  const [fecha, setFecha] = useState(getDateString());
  const [descripcion, setDescripcion] = useState("");
  const [errores, setErrores] = useState({
    cantidad: false,
    categoria: false,
    fecha: false,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();
  const { fetchGastoById, crear, actualizar, eliminarSoft } = useGastos();

  // Cargar datos del gasto si gastoId está presente
  useEffect(() => {
    const cargarGasto = async () => {
      if (gastoId) {
        const gasto = await fetchGastoById(gastoId);
        if (gasto) {
          const dateFecha = new Date(gasto.fecha);
          setCantidad(gasto.cantidad.toString());
          setCategoria(gasto.categoria);
          setFecha(getDateString(dateFecha));
          setDescripcion(gasto.descripcion || "");
        }
      }
    };
    cargarGasto();
  }, [gastoId, fetchGastoById]);

  const validar = (): boolean => {
    const nuevosErrores = {
      cantidad: !cantidad || parseFloat(cantidad) <= 0,
      categoria: !categoria,
      fecha: !fecha,
    };
    setErrores(nuevosErrores);
    return !Object.values(nuevosErrores).some(Boolean);
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
      e.preventDefault();
      if (validar()) {
        const gastoData = {
            cantidad: parseFloat(cantidad),
            categoria,
            fecha,
            descripcion: descripcion.trim() || undefined,
        };

        try {

            let fechaUTC = new Date(`${gastoData.fecha}T00:00:00`);
            gastoData.fecha = fechaUTC.toISOString();

            if (gastoId) {
                await actualizar(gastoId, gastoData);
                navigate(`/`);
            } else {
                await crear(gastoData);
            }
            setCantidad("");
            setCategoria("");
            setFecha(`${fechaUTC.getFullYear()}-${(fechaUTC.getMonth() + 1).toString().padStart(2, "0")}-${fechaUTC.getDate().toString().padStart(2, "0")}`);
            setDescripcion("");
            window.dispatchEvent(new Event("gastoAdded"));
            onClose();
        } catch (error) {
            console.error("Error al guardar el gasto:", error);
            // Opcional: mostrar un mensaje de error al usuario
        }
      }
  }, [gastoId, cantidad, categoria, fecha, descripcion, validar, actualizar, crear, navigate, onClose]);

  const handleDelete = useCallback(async () => {
    if (gastoId) {
      try {
        await eliminarSoft(Number(gastoId));
        setShowDeleteModal(false);
        navigate(`/`);
        onClose();
      } catch (error) {
        console.error("Error al eliminar el gasto:", error);
        // Opcional: mostrar un mensaje de error al usuario
      }
    }
  }, [gastoId, eliminarSoft, navigate, onClose]);

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="number"
            placeholder="Cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            className={`w-full shadow-md border-1 border-gray-100 rounded-lg p-3 ${errores.cantidad ? "border-red-500" : ""}`}
          />
          {errores.cantidad && <p className="text-red-500 text-sm mt-1">Cantidad inválida</p>}
        </div>
        <div>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className={`w-full shadow-md border-1 border-gray-100 rounded-lg p-3 ${errores.categoria ? "border-red-500" : ""}`}
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
            className={`w-full shadow-md border-1 border-gray-100 rounded-lg p-3 ${errores.fecha ? "border-red-500" : ""}`}
          />
          {errores.fecha && <p className="text-red-500 text-sm mt-1">Fecha requerida</p>}
        </div>
        <div>
          <input
            type="text"
            placeholder="Descripción (opcional)"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full shadow-md border-1 border-gray-100 rounded-lg p-3"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-blue-900 text-white p-3 rounded-lg"
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
      <ConfirmationModal 
        isOpen={showDeleteModal}
        title="Eliminar gasto"
        message="¿Estás seguro de que deseas eliminar este gasto?"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </>
  );
};
