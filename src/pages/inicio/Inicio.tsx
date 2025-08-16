import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import type { GastoType } from '../../types/GastoType';
import type { CategoriaType } from '../../types/CategoriaType';
import * as GastosDB from '../../db/GastosDB';
import { localNow } from '../../utils/TimeUtil';

type GastosDelDiaProps = {
  categorias: CategoriaType[];
};

// Formatea la fecha actual a YYYY-MM-DD
const getTodayString = () => {
  return localNow().toISOString().slice(0, 10);
};

export default function GastosDelDia({ categorias }: GastosDelDiaProps) {
  const [gastos, setGastos] = useState<GastoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const cargarGastos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fechaHoy = getTodayString();
      const gastosDeHoy = await GastosDB.getGastosPorDia(fechaHoy);
      setGastos(gastosDeHoy);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los gastos del día.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carga inicial y escucha de cambios para refrescar automáticamente
  useEffect(() => {
    cargarGastos();
    window.addEventListener('gastos:cambio', cargarGastos);
    return () => {
      window.removeEventListener('gastos:cambio', cargarGastos);
    };
  }, [cargarGastos]);

  const totalDelDia = useMemo(() => {
    return gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
  }, [gastos]);

  const handleEdit = (id: number | undefined) => {
    if (!id) return;
    navigate(`/registrar?id=${id}`);
  };

  return (
    <div className="p-4 bg-white rounded-lg">
      <div className="text-center mb-4">
        <p className="text-sm text-gray-500">Total de gastos de hoy</p>
        <p className="text-3xl text-blue-900 font-light tracking-wide">${totalDelDia.toFixed(2)}</p>
      </div>

      <div className="space-y-3">
        {loading && <p className="text-center text-gray-500">Cargando...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && gastos.length === 0 && <p className="text-center text-gray-500 pt-4">Aún no has registrado gastos hoy.</p>}
        {gastos.map((gasto) => {
          const categoria = categorias.find(c => c.id === Number(gasto.categoria));
          const color = categoria?.color || 'gray';
          return (
            <div key={gasto.id} className={`p-3 rounded-lg shadow-sm bg-white border-l-6 border-l-${color}-500 flex justify-between items-center`}>
              <div>
                <p className="font-semibold text-gray-800">{categoria?.nombre || 'Sin Categoría'}</p>
                <p className="text-sm text-gray-600 font-mono">${gasto.cantidad.toFixed(2)}</p>
                <p className="text-xs text-gray-500 italic mt-1 max-w-xs">{gasto.descripcion}</p>
              </div>
              <button onClick={() => handleEdit(gasto.id)} title="Editar gasto" className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors">
                <Pencil size={18} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
