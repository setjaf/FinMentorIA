
import { openDB } from 'idb';
import type { AgrupadoGastoType, GastoType } from '../types/GastoType';

const DB_NAME = 'gastos-db';
const STORE_NAME = 'gastos';
const VERSION = 1;

// Inicializa y retorna la conexión a IndexedDB
const initDB = async () => {
  return await openDB(DB_NAME, VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
      }
    },
  });
};

// Agrega un nuevo gasto
export const addGasto = async (gasto: Omit<GastoType, 'id'>): Promise<IDBValidKey> => {
  const db = await initDB();
  return await db.add(STORE_NAME, gasto);
};

// Obtiene todos los gastos
export const getGastos = async (): Promise<GastoType[]> => {
  const db = await initDB();
  return await db.getAll(STORE_NAME);
};

// Obtiene los gastos de un mes específico: "2025-08"
export const getGastosPorMes = async (yyyyMm: string): Promise<GastoType[]> => {
  const all = await getGastos();
  if (!all) return [];
  return all.filter((g) => g.fecha.startsWith(yyyyMm));
};

// Elimina un gasto por ID
export const deleteGasto = async (id: number): Promise<void> => {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
};

// Borra todos los gastos (precaución)
export const clearGastos = async (): Promise<void> => {
  const db = await initDB();
  await db.clear(STORE_NAME);
};


// Obtiene los gastos agrupados por categoría
export const getGastosAgrupadosPorCategoria = async (yyyyMm: string): Promise<AgrupadoGastoType> => {
  const all = await getGastosPorMes(yyyyMm); // Obtiene gastos del mes actual
  if (!all) return {};
  return all.reduce((acc: { [categoria: string]: GastoType[] }, gasto: GastoType) => {
    if (!acc[gasto.categoria]) acc[gasto.categoria] = [];
    acc[gasto.categoria].push(gasto);
    return acc;
  }, {});
};

// Devuelve un arreglo con el nombre de las categorías y el total registrado en el año y mes actual
export const getTotalesPorCategoriaMesActual = async (): Promise<{ idCategoria: string; total: number }[]> => {
  const filtrados = await getGastosPorMes(new Date().toISOString().slice(0, 7)); // Obtiene gastos del mes actual
  const agrupados: { [idCategoria: string]: number } = {};
  filtrados.forEach(g => {
    agrupados[g.categoria] = (agrupados[g.categoria] || 0) + g.cantidad;
  });
  return Object.entries(agrupados).map(([idCategoria, total]) => ({ idCategoria, total }));
};

export const getAniosMesesDisponibles = async (): Promise<{ [anio: string]: Set<string> }> => {
  const gastos = await getGastos();
  const mesesUnicos = new Set(
    gastos.map((g) => g.fecha.slice(0, 7)) // 'YYYY-MM'
  );

  const agrupado: { [anio: string]: Set<string> } = {};

  for (const gasto of mesesUnicos) {
    const [anio, mes] = gasto.split('-');
    if (!agrupado[anio]) agrupado[anio] = new Set();
    agrupado[anio].add(mes);
  }

  return agrupado; // orden descendente
};