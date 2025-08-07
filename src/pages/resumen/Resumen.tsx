// Devuelve una lista de años únicos presentes en gastosAgrupados

import { useEffect, useState } from 'react';
import { getAniosMesesDisponibles, getGastosAgrupadosPorCategoria } from '../../db/GastosDB';
import type { AgrupadoGastoType, GastoType } from '../../types/GastoType';

const meses = [
  { label: 'Enero', value: '01' },
  { label: 'Febrero', value: '02' },
  { label: 'Marzo', value: '03' },
  { label: 'Abril', value: '04' },
  { label: 'Mayo', value: '05' },
  { label: 'Junio', value: '06' },
  { label: 'Julio', value: '07' },
  { label: 'Agosto', value: '08' },
  { label: 'Septiembre', value: '09' },
  { label: 'Octubre', value: '10' },
  { label: 'Noviembre', value: '11' },
  { label: 'Diciembre', value: '12' },
];

const mesActual = (new Date().getMonth() + 1).toString().padStart(2, '0');
const anioActual = new Date().getFullYear().toString();

export default function Resumen() {
  const [anio, setAnio] = useState(anioActual);
  const [mes, setMes] = useState(mesActual);
  const [gastosAgrupados, setGastosAgrupados] = useState<AgrupadoGastoType>();
  const [acumulado, setAcumulado] = useState(0);
  const [aniosMesesDisponibles, setAniosMesesDisponibles] = useState<{[anio: string] : Set<string>}>({anioActual: new Set([mesActual])});

  const fetchGastos = async () => {
    // Aquí podrías cargar los gastos desde una base de datos o API
    // Por ahora usamos un mock
    setGastosAgrupados(await getGastosAgrupadosPorCategoria(`${anio}-${mes}`));    
    
  }

  const fetchAniosMesesDisponibles = async () => {
    const disponibles = await getAniosMesesDisponibles();
    disponibles[anioActual] = disponibles[anioActual] || new Set();
    disponibles[anioActual].add(mesActual);    
    setAniosMesesDisponibles(disponibles);
    return disponibles;
  }

  useEffect(() => {
    fetchAniosMesesDisponibles();
    const handler = () => {
      fetchAniosMesesDisponibles();
      fetchGastos();
    };

    window.addEventListener('gastoAdded', handler);

    return () => {
      window.removeEventListener('gastoAdded', handler);
    };
  }, []);
  
  useEffect(() => {
    // Aquí podrías cargar los gastos desde una base de datos o API
    // Por ahora usamos un mock
    fetchGastos();
    return () => {};
  }, [mes]);

  useEffect(() => {
    setMes(aniosMesesDisponibles[anio]?.values().next().value || mesActual);
  }, [anio]);

  useEffect(() => {
    calcularAcumulado();
  }, [gastosAgrupados]);
  
  const calcularAcumulado = () => {
    setAcumulado(Object.values(gastosAgrupados ?? {}).flat().reduce((sum, gasto: GastoType) => sum + gasto.cantidad, 0));
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
          const total = lista.reduce((sum, g) => sum + g.cantidad, 0);
          return (
            <details
              key={categoria}
              className="border rounded-xl bg-white shadow"
            >
              <summary className="px-4 py-3 flex justify-between items-center">
                <span className="font-medium text-gray-900">{categoria}</span>
                <span className="text-blue-800 font-semibold">${total.toFixed(2)}</span>
              </summary>
              <ul className="px-4 pb-3 text-sm text-gray-600 mt-2 space-y-1">
                {lista.map((g, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{g.fecha.split('-').reverse().join('/')}</span>
                    <span>${g.cantidad.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </details>
          );
        })}
      </div>
    </main>
  );
}

