// Devuelve una lista de años únicos presentes en gastosAgrupados

import { useEffect, useMemo, useState, useCallback } from 'react';
import type { AgrupadoGastoType, GastoType } from '../../types/GastoType';
import type { CategoriaType } from '../../types/CategoriaType';
import { useGastos } from '../../hooks/UseGastos';
import { meses } from '../../types/catalogs/MesesCatalog';
import { localNow } from '../../utils/TimeUtil';
import CategoriaDetail from './components/CategoriaDetail';

const mesActual = (localNow().getMonth() + 1).toString().padStart(2, '0');
const anioActual = localNow().getFullYear().toString();

type ResumenProps = {
  categorias: CategoriaType[];
};

export default function Resumen({ categorias }: ResumenProps) {
  const [anio, setAnio] = useState(anioActual);
  const [mes, setMes] = useState(mesActual);
  const [gastosDelMes, setGastosDelMes] = useState<GastoType[]>([]);
  const [aniosMeses, setAniosMeses] = useState<{ [anio: string]: Set<string> }>({});
  const [loading, setLoading] = useState(true);
  const [componentError, setComponentError] = useState<string | null>(null);

  const { fetchGastosPorMes, fetchAniosMesesDisponibles, agruparPorCategoria, calcularTotal } = useGastos();

  // Función para cargar todos los datos necesarios para la vista.
  const cargarDatos = useCallback(async () => {
    setLoading(true);
    setComponentError(null);
    try {
      const [gastos, disponibles] = await Promise.all([
        fetchGastosPorMes(`${anio}-${mes}`),
        fetchAniosMesesDisponibles(),
      ]);

      // Aseguramos que el mes y año actual siempre estén disponibles para seleccionar
      disponibles[anioActual] = disponibles[anioActual] || new Set();
      disponibles[anioActual].add(mesActual);

      setGastosDelMes(gastos);
      setAniosMeses(disponibles);
    } catch (err: any) {
      setComponentError(err.message || 'Ocurrió un error al cargar los datos.');
    } finally {
      setLoading(false);
    }
  }, [anio, mes, fetchGastosPorMes, fetchAniosMesesDisponibles]);

  // Carga inicial y cuando cambia el mes/año
  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // Escucha eventos globales para recargar si hay cambios en la BD
  useEffect(() => {
    window.addEventListener('gastos:cambio', cargarDatos);
    return () => window.removeEventListener('gastos:cambio', cargarDatos);
  }, [cargarDatos]);

  // Ajusta el mes si el actual no es válido para el año seleccionado.
  useEffect(() => {
    const mesesDelAnio = aniosMeses[anio];
    if (mesesDelAnio && !mesesDelAnio.has(mes)) {
      setMes(mesesDelAnio.values().next().value || mesActual);
    }
  }, [anio, aniosMeses, mes]);

  // Calculamos valores derivados con useMemo para optimización.
  const gastosAgrupados = useMemo<AgrupadoGastoType>(() => {
    return agruparPorCategoria(gastosDelMes);
  }, [gastosDelMes, agruparPorCategoria]);

  const acumulado = useMemo(() => {
    return calcularTotal(gastosDelMes);
  }, [gastosDelMes, calcularTotal]);

  return (
    <>
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Resumen Mensual
        </h1>
        {/* <!-- Total de gastos mensual destacado --> */}
        <div className="px-4 pt-2 pb-4">
          <p className="text-center text-sm text-gray-500 mb-1">Total de gastos en {meses.find(m => m.value === mes.toString())?.label} {anio}</p>
          <p className="text-4xl text-center text-blue-900 font-light tracking-wide">${acumulado.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <select
          className="border-2 border-gray-300 rounded-lg p-2 w-1/2"
          value={anio}
          onChange={(e) => setAnio(e.target.value)}
        >
          {Object.keys(aniosMeses).sort((a, b) => b.localeCompare(a)).map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <select
          className="border-2 border-gray-300 rounded-lg p-2 w-1/2"
          value={mes}
          onChange={(e) => setMes(e.target.value)}
        >
          {Array.from(aniosMeses[anio] || []).sort((a, b) => b.localeCompare(a)).map((m) => {
            const mesObj = meses.find(me => me.value === m);
            return (
              <option key={m} value={m}>
                {mesObj ? mesObj.label : m}
              </option>
            )
          })}
        </select>
      </div>

      <div className="space-y-3">
        {loading && <p className="text-center text-gray-500">Cargando...</p>}
        {componentError && <p className="text-center text-red-500">{componentError}</p>}
        {!loading && Object.keys(gastosAgrupados).length === 0 && (
          <p className="text-center text-gray-500 pt-8">
            No hay gastos registrados para este mes.
          </p>
        )}
        {Object.entries(gastosAgrupados ?? {}).sort(([catA], [catB]) => catA.localeCompare(catB)).map(([categoria, lista]) => {          
          return (
            <CategoriaDetail categoria={categorias.find(c => c.id == categoria)!} gastos={lista} />
          );
        })}
      </div>
    </>
  );
}
