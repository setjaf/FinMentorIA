import { useState } from "react";
import type { CategoriaType } from "../types/CategoriaType";
import { useGastos } from "../hooks/UseGastos";

interface Props {
  onClose: () => void;
  categorias: CategoriaType[];
}

export const FormGasto = ({ onClose, categorias }: Props) => {
  const [cantidad, setCantidad] = useState("");
  const [categoria, setCategoria] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [errores, setErrores] = useState({
    cantidad: false,
    categoria: false,
    fecha: false,
  });

  const { crear } = useGastos();

  const validar = (): boolean => {
    const nuevosErrores = {
      cantidad: !cantidad || parseFloat(cantidad) <= 0,
      categoria: !categoria,
      fecha: !fecha,
    };
    setErrores(nuevosErrores);
    return !Object.values(nuevosErrores).some(Boolean);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validar()) {
      crear({
        cantidad: parseFloat(cantidad),
        categoria,
        fecha,
      });
      setCantidad("");
      setCategoria("");
      setFecha("");
      window.dispatchEvent(new Event("gastoAdded")); // Notifica que se ha agregado un gasto
      onClose();
    }
  };

  return (
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
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
      >
        Guardar gasto
      </button>
    </form>
  );
};
