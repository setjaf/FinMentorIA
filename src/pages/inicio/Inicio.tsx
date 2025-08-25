import { useState, useEffect, useMemo, useCallback } from 'react';
import type { GastoType } from '../../types/GastoType';
import type { CategoriaType } from '../../types/CategoriaType';
import * as GastosDB from '../../db/GastosDB';
import GastoIndividual from './components/GastoIndividual';
import { getDateString } from '../../utils/TimeUtil';

type GastosDelDiaProps = {
  categorias: CategoriaType[];
};



export default function GastosDelDia({ categorias }: GastosDelDiaProps) {
  const [gastos, setGastos] = useState<GastoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarGastos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      
      const gastosDeHoy = await GastosDB.getGastosPorDia(getDateString());

      console.log(gastosDeHoy);
      

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

  return (
    <div className="p-4 bg-white rounded-lg">
      <div className="text-center mb-4">
        <p className="text-center text-sm text-gray-500 mb-1">Total de gastos de hoy</p>
        <p className="text-4xl text-center text-blue-900 font-light tracking-wide">${totalDelDia.toFixed(2)}</p>
      </div>

      <div className="space-y-3">
        {loading && <p className="text-center text-gray-500">Cargando...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && gastos.length === 0 && <p className="text-center text-gray-500 pt-4">Aún no has registrado gastos hoy.</p>}
        {gastos.map((gasto) => {
          const categoria = categorias.find(c => c.id === Number(gasto.categoria));
          return (
            <GastoIndividual key={gasto.id} gasto={gasto} categoria={categoria || {} as CategoriaType} />
          );
        })}
      </div>
    </div>
  );
}
