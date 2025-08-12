// Devuelve una lista de años únicos presentes en gastosAgrupados

import { useEffect, useState } from 'react';
import type { AgrupadoGastoType } from '../../types/GastoType';
import type { CategoriaType } from '../../types/CategoriaType';
import { useGastos } from '../../hooks/UseGastos';
import InformacionGasto from './components/InformacionGasto';
import { meses } from '../../types/catalogs/MesesCatalog';
import { localNow } from '../../utils/TimeUtil';

const mesActual = (localNow().getMonth() + 1).toString().padStart(2, '0');
const anioActual = localNow().getFullYear().toString();

type ResumenProps = {
  categorias: CategoriaType[];
};

export default function Resumen({ categorias }: ResumenProps) {
  const [anio, setAnio] = useState(anioActual);
  const [mes, setMes] = useState(mesActual);
  const [gastosAgrupados, setGastosAgrupados] = useState<AgrupadoGastoType>();
  const [acumulado, setAcumulado] = useState(0);
  const [aniosMesesDisponibles, setAniosMesesDisponibles] = useState<{ [anio: string]: Set<string> }>(({}));

  const { cargar, error, gastos, agruparPorCategoriaDelMes, mesesDisponibles, totalDelMes } = useGastos({
    listenGlobalEvents: true,
  });

  const fetchGastos = async () => {
    // Aquí podrías cargar los gastos desde una base de datos o API
    // Por ahora usamos un mock
    setGastosAgrupados(await agruparPorCategoriaDelMes(`${anio}-${mes}`));

  }

  const fetchAniosMesesDisponibles = async () => {
    const disponibles = await mesesDisponibles();
    disponibles[anioActual] = disponibles[anioActual] || new Set();
    disponibles[anioActual].add(mesActual);
    setAniosMesesDisponibles(disponibles);
    return disponibles;
  }

  useEffect(() => {
    cargar();
  }, [cargar]);

  useEffect(() => {
    console.log(error);
  }, [error]);

  useEffect(() => {
    console.log(gastos);

    fetchGastos();
    fetchAniosMesesDisponibles();
  }, [gastos]);

  useEffect(() => {
    // Aquí podrías cargar los gastos desde una base de datos o API
    // Por ahora usamos un mock
    fetchGastos();
    return () => { };
  }, [mes]);

  useEffect(() => {
    setMes(aniosMesesDisponibles[anio]?.values().next().value || mesActual);
  }, [anio]);

  useEffect(() => {
    calcularAcumulado();
  }, [gastosAgrupados]);

  const calcularAcumulado = () => {
    setAcumulado(totalDelMes(`${anio}-${mes}`));
  }

  return (
    <main className="p-4 pb-24 space-y-4">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Resumen Mensual
        </h1>
        {/* <!-- Total de gastos mensual destacado --> */}
        <div className="px-4 pt-2 pb-4">
          <p className="text-center text-sm text-gray-500 mb-1">Total de gastos registrados en {meses.find(m => m.value === mes.toString())?.label} {anio}</p>
          <p className="text-4xl text-center text-blue-900 font-light tracking-wide">${acumulado.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <select
          className="border rounded-lg p-2 w-1/2"
          value={anio}
          onChange={(e) => setAnio(e.target.value)}
        >
          {Object.keys(aniosMesesDisponibles).map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <select
          className="border rounded-lg p-2 w-1/2"
          value={mes}
          onChange={(e) => setMes(e.target.value)}
        >
          {Array.from(aniosMesesDisponibles[anio] || []).map((m) => {
            const mesObj = meses.find(me => me.value === m);
            return (
              <option key={m} value={m}>
                {mesObj ? mesObj.label : m}
              </option>
            )
          })}
          {/*
          {meses.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))} 
          */}
        </select>
      </div>

      <div className="space-y-3">
        {Object.entries(gastosAgrupados ?? {}).map(([categoria, lista]) => {
          console.log(categorias);

          const total = lista.reduce((sum, g) => sum + g.cantidad, 0);
          const nombreCategoria = categorias.find(c => c.id == categoria)?.nombre || categoria;
          const colorCategoria = categorias.find(c => c.id == categoria)?.color || 'white'; // Default color if not found
          return (
            <details
              key={categoria}
              className={`rounded-lg shadow bg-white border-2 border-gray-300 border-l-10 border-l-${colorCategoria}-500`}
            >
              <summary className="px-4 py-3 flex justify-between items-center">
                <span className="font-medium text-gray-600">{nombreCategoria}</span>
                <span className="text-gray-600 font-semibold">${total.toFixed(2)}</span>
              </summary>
              <ul className="px-4 pb-3 text-sm text-gray-600 mt-2 space-y-1">
                {lista.map((g, i) => (
                  <InformacionGasto key={i} gasto={g} />
                ))}
              </ul>
            </details>
          );
        })}
      </div>
    </main>
  );
}

