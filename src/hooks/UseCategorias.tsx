import { useCallback, useEffect, useRef, useState } from 'react';
import type { CategoriaType } from '../types/CategoriaType';
import {
    getCategorias,
    addCategoria,
    updateCategoria,
    deleteCategoria,
    exportCategorias,
    importCategorias,
    upsertCategoriasPorNombre,
    seedCategorias,
} from '../db/CategoriasDB';

type Estado = 'idle' | 'loading' | 'success' | 'error';

export function useCategorias(opts?: { listenGlobalEvents?: boolean }) {
    const { listenGlobalEvents = true } = opts || {};
    const [categorias, setCategorias] = useState<CategoriaType[]>([]);
    const [estado, setEstado] = useState<Estado>('idle');
    const [error, setError] = useState<string | null>(null);
    const mounted = useRef(true);

    const safeSet = useCallback(<T,>(setter: (v: T) => void, value: T) => {
        if (mounted.current) setter(value);
    }, []);

    const cargar = useCallback(async () => {
        setEstado('loading');
        setError(null);
        try {
            console.log('Se monta componente UseCategorias');
            const data = await getCategorias();
            if (data.length === 0) {
                // Si no hay categorías, podemos agregar las semillas por defecto
                if (await seedCategorias()) {
                    cargar(); // Recargar después de sembrar
                    return;
                }
                safeSet(setError, 'Error al registrar categorías por defecto');
                safeSet(setEstado, 'error');
            }
            safeSet(setCategorias, data);
            safeSet(setEstado, 'success');
        } catch (e: any) {
            safeSet(setError, e?.message ?? 'Error al cargar categorías');
            safeSet(setEstado, 'error');
        }
    }, [safeSet]);

    useEffect(() => {
        mounted.current = true;
        cargar();
        return () => {
            mounted.current = false;
        };
    }, [cargar]);

    // Opcional: escucha eventos globales para recargar (útil si otra vista modifica categorías)
    useEffect(() => {
        if (!listenGlobalEvents) return;
        const handler = () => cargar();
        window.addEventListener('categorias:cambio', handler);
        return () => window.removeEventListener('categorias:cambio', handler);
    }, [cargar, listenGlobalEvents]);

    /** Crear con actualización optimista */
    const crear = useCallback(
        async (payload: Omit<CategoriaType, 'id'>) => {
            setError(null);
            // Optimista: pintamos la nueva categoría de inmediato con id negativo temporal
            const tempId = -(Date.now());
            const tempCat: CategoriaType = { id: tempId, ...payload };
            safeSet(setCategorias, (prev) => [...prev, tempCat]);

            try {
                const idReal = await addCategoria(payload);
                console.log(`Categoría creada con ID: ${idReal}`);               
                safeSet(setCategorias, (prev) =>
                    prev.map((c) => (c.id === tempId ? { ...c, id: idReal } : c))
                );
                // Señal opcional global
                window.dispatchEvent(new CustomEvent('categorias:cambio'));
                return idReal;
            } catch (e: any) {
                // Revertir optimismo
                safeSet(setCategorias, (prev) => prev.filter((c) => c.id !== tempId));
                const msg =
                    e?.message?.includes('ya existe') ?
                        'El nombre de la categoría ya existe.' :
                        (e?.message ?? 'Error al crear categoría');
                safeSet(setError, msg);
                throw new Error(msg);
            }
        },
        [safeSet]
    );

    /** Actualizar con merge y optimismo */
    const actualizar = useCallback(
        async (id: number, patch: Partial<CategoriaType>) => {
            setError(null);
            const prevSnap = categorias;
            // Optimismo
            safeSet(setCategorias, (prev) =>
                prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
            );
            try {
                await updateCategoria(id, patch);
                window.dispatchEvent(new CustomEvent('categorias:cambio'));
            } catch (e: any) {
                // Revertir
                safeSet(setCategorias, prevSnap);
                const msg =
                    e?.message?.includes('ya existe') ?
                        'El nombre de la categoría ya existe.' :
                        (e?.message ?? 'Error al actualizar categoría');
                safeSet(setError, msg);
                throw new Error(msg);
            }
        },
        [categorias, safeSet]
    );

    /** Eliminar con optimismo */
    const eliminar = useCallback(
        async (id: number) => {
            setError(null);
            const prevSnap = categorias;
            safeSet(setCategorias, (prev) => prev.filter((c) => c.id !== id));
            try {
                await deleteCategoria(id);
                window.dispatchEvent(new CustomEvent('categorias:cambio'));
            } catch (e: any) {
                safeSet(setCategorias, prevSnap);
                const msg = e?.message ?? 'Error al eliminar categoría';
                safeSet(setError, msg);
                throw new Error(msg);
            }
        },
        [categorias, safeSet]
    );

    /** Exportar a JSON (string) */
    const exportar = useCallback(async () => {
        try {
            return await exportCategorias();
        } catch (e: any) {
            const msg = e?.message ?? 'Error al exportar categorías';
            setError(msg);
            throw new Error(msg);
        }
    }, []);

    /** Importar desde JSON (merge por nombre con upsert) */
    const importar = useCallback(
        async (json: string) => {
            setError(null);
            try {
                await importCategorias(json);
                await cargar();
                window.dispatchEvent(new CustomEvent('categorias:cambio'));
            } catch (e: any) {
                const msg = e?.message ?? 'Error al importar categorías';
                setError(msg);
                throw new Error(msg);
            }
        },
        [cargar]
    );

    /** Upsert en lote (por nombre) */
    const upsertBatch = useCallback(
        async (items: Array<Omit<CategoriaType, 'id'>>) => {
            setError(null);
            try {
                await upsertCategoriasPorNombre(items);
                await cargar();
                window.dispatchEvent(new CustomEvent('categorias:cambio'));
            } catch (e: any) {
                const msg = e?.message ?? 'Error al actualizar categorías';
                setError(msg);
                throw new Error(msg);
            }
        },
        [cargar]
    );

    return {
        categorias,
        estado,
        loading: estado === 'loading',
        error,

        // acciones
        cargar,
        crear,
        actualizar,
        eliminar,
        exportar,
        importar,
        upsertBatch,
    };
}
