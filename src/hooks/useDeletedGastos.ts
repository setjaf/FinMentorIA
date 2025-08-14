import { useState, useCallback } from 'react';
import type { GastoType } from '../types/GastoType';
import * as GastosDB from '../db/GastosDB';

type Estado = 'idle' | 'loading' | 'success' | 'error';

export function useDeletedGastos() {
    const [gastos, setGastos] = useState<GastoType[]>([]);
    const [estado, setEstado] = useState<Estado>('idle');
    const [error, setError] = useState<string | null>(null);

    const cargar = useCallback(async () => {
        setEstado('loading');
        setError(null);
        try {
            const deletedGastos = await GastosDB.getDeletedGastos();
            setGastos(deletedGastos);
            setEstado('success');
        } catch (err: any) {
            setError(err.message || 'Error al cargar gastos eliminados');
            setEstado('error');
        }
    }, []);

    const restaurar = useCallback(async (id: number) => {
        try {
            await GastosDB.restoreGasto(id);
            // Disparamos un evento global para que otras partes de la app se actualicen
            window.dispatchEvent(new CustomEvent('gastos:cambio'));
        } catch (err: any) {
            console.error("Error al restaurar gasto:", err);
            setError(err.message || 'Error al restaurar el gasto');
        }
    }, []);

    const eliminarPermanente = useCallback(async (id: number) => {
        try {
            await GastosDB.deleteGasto(id);
            // No disparamos evento porque el gasto ya no existe en ningún estado.
            // Solo recargamos la lista local de eliminados.
            await cargar();
        } catch (err: any) {
            console.error("Error al eliminar permanentemente:", err);
            setError(err.message || 'Error al eliminar el gasto permanentemente');
        }
    }, [cargar]);

    return { gastos, estado, error, cargar, restaurar, eliminarPermanente };
}