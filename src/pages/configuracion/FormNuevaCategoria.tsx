import { useState } from "react";

interface NuevaCategoria {
  nombre: string;
  color: string;
}

interface Props {
  onSubmit: (categoria: NuevaCategoria) => void;
}

export const FormNuevaCategoria = ({ onSubmit }: Props) => {
  const [nombre, setNombre] = useState("");
  const [color, setColor] = useState("#2196f3");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    setError("");
    onSubmit({ nombre: nombre.trim(), color });
    setNombre("");
    setColor("#2196f3");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto p-4 bg-white rounded-xl shadow">
      <div>
        <label className="block mb-1 font-medium">Nombre de la categoría</label>
        <input
          type="text"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          className="w-full border rounded-lg p-3"
          placeholder="Ej: Entretenimiento"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Color</label>
        <input
          type="color"
          value={color}
          onChange={e => setColor(e.target.value)}
          className="w-12 h-12 p-0 border-none bg-transparent"
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
      >
        Registrar categoría
      </button>
    </form>
  );
};
