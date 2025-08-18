import { useCallback } from 'react';
import type { GastoType } from '../types/GastoType';
import {
  getGastos,
  addGasto,
  deleteGasto,
  clearGastos,
  updateGasto,
  getAniosMesesDisponibles,
  getGastosPorMes,
  getGastoById,
  softDeleteGasto,
} from '../db/GastosDB';

/**
 * Este hook ahora actúa como una capa de acceso a datos (Data Access Layer) para React.
 * No mantiene un estado global de 'gastos', sino que proporciona funciones estables
 * para que los componentes soliciten los datos que necesitan.
 * Esto es mucho más eficiente y escalable.
 */
export function useGastos() {
  // ---- Acciones CRUD ----

  // No necesita optimismo aquí, el componente que lo use se encargará de recargar.
  const crear = useCallback(
    async (payload: Omit<GastoType, 'id'>) => {
      try {
        const idReal = await addGasto(payload);
        window.dispatchEvent(new CustomEvent('gastos:cambio', { detail: { action: 'create', id: idReal } }));
        return idReal;
      } catch (e: any) {
        const msg = e?.message ?? 'Error al registrar gasto';
        throw new Error(msg);
      }
    },
    []
  );

  const eliminar = useCallback(
    async (id: number) => {
      try {
        await deleteGasto(id);
        window.dispatchEvent(new CustomEvent('gastos:cambio', { detail: { action: 'delete', id } }));
      } catch (e: any) {
        const msg = e?.message ?? 'Error al eliminar gasto';
        throw new Error(msg);
      }
    },
    []
  );

  const eliminarSoft = useCallback(
    async (id: number) => {
      try {
        await softDeleteGasto(id);
        window.dispatchEvent(new CustomEvent('gastos:cambio', { detail: { action: 'delete', id } }));
      } catch (e: any) {
        const msg = e?.message ?? 'Error al eliminar gasto lógicamente';
        throw new Error(msg);
      }
    },
    []
  );

  const actualizar = useCallback(
    async (id: number | string, data: Partial<GastoType>) => {
      const idNum = typeof id === "string" ? Number(id) : id;
      try {
        await updateGasto(idNum, data);
        window.dispatchEvent(new CustomEvent('gastos:cambio', { detail: { action: 'update', id: idNum } }));
      } catch (e: any) {
        const msg = e?.message ?? 'Error al actualizar gasto';
        throw new Error(msg);
      }
    },
    []
  );

  const limpiar = useCallback(async () => {
    try {
      await clearGastos();
      window.dispatchEvent(new CustomEvent('gastos:cambio', { detail: { action: 'clear' } }));
    } catch (e: any) {
      const msg = e?.message ?? 'Error al limpiar gastos';
      throw new Error(msg);
    }
  }, []);

  // ---- Selectores / utilidades derivadas ----

  /**
   * Calcula el total de una lista de gastos dada.
   * Esta función ahora es pura y no depende del estado del hook.
   */
  const calcularTotal = useCallback((gastosDelPeriodo: GastoType[]): number => {
    return gastosDelPeriodo.reduce((acc, g) => acc + g.cantidad, 0);
  }, []);

  /**
   * Agrupa una lista de gastos por categoría.
   * Función pura que no depende del estado del hook.
   */
  const agruparPorCategoria = useCallback(
    (gastosDelPeriodo: GastoType[]): Record<string, GastoType[]> => {
      return gastosDelPeriodo
        .reduce((acc, g) => {
          (acc[g.categoria] ||= []).push(g);
          return acc;
        }, {} as Record<string, GastoType[]>);
    },
    []
  );

  const agruparPorDia = useCallback(
    (gastosDelPeriodo: GastoType[]): Record<string, GastoType[]> => {
      return gastosDelPeriodo
        .reduce((acc, g) => {
          (acc[g.fecha] ||= []).push(g);
          return acc;
        }, {} as Record<string, GastoType[]>);
    },
    []
  );

  return {
    // acciones
    crear,
    eliminar,
    limpiar,
    actualizar,
    eliminarSoft,

    // Funciones de consulta a la BD
    fetchGastos: getGastos, // Sigue disponible si se necesita
    fetchGastosPorMes: getGastosPorMes,
    fetchGastoById: getGastoById,
    fetchAniosMesesDisponibles: getAniosMesesDisponibles,

    // Funciones de cálculo puras
    calcularTotal,
    agruparPorCategoria,
    agruparPorDia,
  };
}
