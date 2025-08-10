import { useCallback, useEffect, useRef, useState } from 'react';
import type { GastoType } from '../types/GastoType';
import {
  getGastos,
  addGasto,
  deleteGasto,
  clearGastos,
} from '../db/GastosDB';

type Estado = 'idle' | 'loading' | 'success' | 'error';

export function useGastos(opts?: { listenGlobalEvents?: boolean }) {
  const { listenGlobalEvents = true } = opts || {};

  const [gastos, setGastos] = useState<GastoType[]>([]);
  const [estado, setEstado] = useState<Estado>('idle');
  const [error, setError] = useState<string | null>(null);

  // ---- safeSet pattern ----
  const mounted = useRef(true);
  const safeSet = useCallback(<T,>(setter: (v: T | ((prev: any) => T)) => void, value: any) => {
    if (mounted.current) setter(value);
  }, []);

  // ---- helpers internos ----
  const _setLoading = useCallback(() => {
    safeSet(setEstado, 'loading');
    safeSet(setError, null);
  }, [safeSet]);

  const cargar = useCallback(async () => {
    _setLoading();
    try {
      const data = await getGastos();
      safeSet(setGastos, data);
      safeSet(setEstado, 'success');
      return data;
    } catch (e: any) {
      const msg = e?.message ?? 'Error al cargar gastos';
      safeSet(setError, msg);
      safeSet(setEstado, 'error');
      throw new Error(msg);
    }
  }, [_setLoading, safeSet]);

  // Alta con actualización optimista
  const crear = useCallback(
    async (payload: Omit<GastoType, 'id'>) => {
      safeSet(setError, null);
      const tempId = -(Date.now());
      const temp: GastoType = { id: tempId, ...payload };

      // Optimismo: pintamos al instante
      safeSet(setGastos, (prev: GastoType[]) => [...prev, temp]);

      try {
        const idReal = await addGasto(payload);
        safeSet(setGastos, (prev: GastoType[]) =>
          prev.map((g) => (g.id === tempId ? { ...g, id: idReal } : g))
        );
        // Señal global opcional
        window.dispatchEvent(new CustomEvent('gastos:cambio'));
        return idReal;
      } catch (e: any) {
        // Revertir optimismo
        safeSet(setGastos, (prev: GastoType[]) => prev.filter((g) => g.id !== tempId));
        const msg = e?.message ?? 'Error al registrar gasto';
        safeSet(setError, msg);
        throw new Error(msg);
      }
    },
    [safeSet]
  );

  // Borrado con optimismo
  const eliminar = useCallback(
    async (id: number) => {
      safeSet(setError, null);
      const snapshot = gastos;
      // Optimismo: removemos localmente
      safeSet(setGastos, (prev: GastoType[]) => prev.filter((g) => g.id !== id));
      try {
        await deleteGasto(id);
        window.dispatchEvent(new CustomEvent('gastos:cambio'));
      } catch (e: any) {
        // Revertir
        safeSet(setGastos, snapshot);
        const msg = e?.message ?? 'Error al eliminar gasto';
        safeSet(setError, msg);
        throw new Error(msg);
      }
    },
    [gastos, safeSet]
  );

  const limpiar = useCallback(async () => {
    safeSet(setError, null);
    try {
      await clearGastos();
      safeSet(setGastos, []);
      window.dispatchEvent(new CustomEvent('gastos:cambio'));
    } catch (e: any) {
      const msg = e?.message ?? 'Error al limpiar gastos';
      safeSet(setError, msg);
      throw new Error(msg);
    }
  }, [safeSet]);

  // Montaje / desmontaje + recarga por eventos globales
  useEffect(() => {
    mounted.current = true;
    cargar();
    return () => {
      mounted.current = false;
    };
  }, [cargar]);

  useEffect(() => {
    if (!listenGlobalEvents) return;
    const handler = () => cargar();
    window.addEventListener('gastos:cambio', handler);
    return () => window.removeEventListener('gastos:cambio', handler);
  }, [cargar, listenGlobalEvents]);

  // ---- Selectores / utilidades derivadas ----

  /** Lista única de meses disponibles en formato 'YYYY-MM' (orden descendente) */
  const mesesDisponibles = useCallback((): { [anio: string]: Set<string> } => {
    const set = new Set(gastos.map((g) => g.fecha.slice(0, 7)));
    const agrupado: { [anio: string]: Set<string> } = {};

    for (const gasto of set) {
        const [anio, mes] = gasto.split('-');
        if (!agrupado[anio]) agrupado[anio] = new Set();
        agrupado[anio].add(mes);
    }

    return agrupado; 
  }, [gastos]);

  /** Total del mes dado 'YYYY-MM' (si el estado actual no es ese mes, calcula directo en memoria) */
  const totalDelMes = useCallback(
    (yyyyMm: string): number =>
      gastos
        .filter((g) => g.fecha.startsWith(yyyyMm))
        .reduce((acc, g) => acc + g.cantidad, 0),
    [gastos]
  );

  /** Agrupa gastos del mes actual por categoría (útil para Resumen) */
  const agruparPorCategoriaDelMes = useCallback(
    (yyyyMm: string): Record<string, GastoType[]> => {
      return gastos
        .filter((g) => g.fecha.startsWith(yyyyMm))
        .reduce((acc, g) => {
          (acc[g.categoria] ||= []).push(g);
          return acc;
        }, {} as Record<string, GastoType[]>);
    },
    [gastos]
  );

  return {
    // estado
    gastos,
    estado,
    loading: estado === 'loading',
    error,

    // acciones
    cargar,
    crear,
    eliminar,
    limpiar,

    // selectores / utilidades
    mesesDisponibles,
    totalDelMes,
    agruparPorCategoriaDelMes,
  };
}
