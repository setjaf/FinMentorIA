import type { GastoType } from '../types/GastoType';
import { getDB } from './InitializeDB';

const STORE_NAME = 'gastos';

// Agrega un nuevo gasto
export const addGasto = async (gasto: Omit<GastoType, 'id'>): Promise<IDBValidKey> => {
    const db = await getDB();
    gasto.createdAt = new Date().toISOString();
    return await db.add(STORE_NAME, gasto);
};

// Obtiene todos los gastos
// Nota: Esta función ahora solo devuelve gastos no borrados lógicamente.
export const getGastos = async (): Promise<GastoType[]> => {
    const db = await getDB();
    const allGastos = await db.getAll(STORE_NAME);
    return allGastos.filter(gasto => !gasto.deletedAt);
};

// Obtiene un gasto por su ID
export const getGastoById = async (id: number | string): Promise<GastoType | undefined> => {
    const db = await getDB();
    return db.get(STORE_NAME, typeof id === 'string' ? Number(id) : id);
};

// Obtiene los gastos de un día específico: "2025-08-21"
export const getGastosPorDia = async (yyyyMmDd: string): Promise<GastoType[]> => {
    const db = await getDB();
    const fechaInicioLocal = new Date(`${yyyyMmDd}T00:00:00.000`);
    const fechaFinLocal = new Date(`${yyyyMmDd}T23:59:59.999`);

    const range = IDBKeyRange.bound(fechaInicioLocal.toISOString(), fechaFinLocal.toISOString());
    const gastosDelDia = await db.getAllFromIndex(STORE_NAME, 'by-fecha', range);
    // Filtramos para excluir los gastos borrados lógicamente
    const gastosActivos = gastosDelDia.filter(gasto => !gasto.deletedAt);
    // Ordenamos por fecha de creación descendente para mostrar los más recientes primero
    return gastosActivos.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
};

// Obtiene los gastos de un mes específico: "2025-08"
export const getGastosPorMes = async (yyyyMm: string): Promise<GastoType[]> => {
    const db = await getDB();

    const fechaInicioLocal = new Date(`${yyyyMm}-01T00:00:00.000`);
    const fechaFinLocal = new Date(`${yyyyMm}-31T23:59:59.999`);

    const range = IDBKeyRange.bound(fechaInicioLocal.toISOString(), fechaFinLocal.toISOString());
    const gastosDelMes = await db.getAllFromIndex(STORE_NAME, 'by-fecha', range);
    // Filtramos para excluir los gastos borrados lógicamente
    const gastosActivos = gastosDelMes.filter(gasto => !gasto.deletedAt);
    // Ordenamos por fecha descendente para mostrar los más recientes primero
    return gastosActivos.sort((a, b) => b.fecha.localeCompare(a.fecha));
};


// Obtiene los gastos de un rango específico: "2025-01-01" - "2025-01-15"
export const getGastosPorRango = async (fechaInicio: string, fechaFin: string): Promise<GastoType[]> => {
    const db = await getDB();
    const dateFechaInicio = new Date(`${fechaInicio}T00:00:00`);
    const dateFechaFin = new Date(`${fechaFin}T00:00:00`);

    const range = IDBKeyRange.bound(dateFechaInicio.toISOString(), dateFechaFin.toISOString());
    const gastosDelMes = await db.getAllFromIndex(STORE_NAME, 'by-fecha', range);
    // Filtramos para excluir los gastos borrados lógicamente
    const gastosActivos = gastosDelMes.filter(gasto => !gasto.deletedAt);
    // Ordenamos por fecha descendente para mostrar los más recientes primero
    return gastosActivos.sort((a, b) => b.fecha.localeCompare(a.fecha));
};

// Elimina un gasto por ID
export const deleteGasto = async (id: number): Promise<void> => {
    const db = await getDB();
    await db.delete(STORE_NAME, id);
};

// Obtiene solo los gastos que han sido borrados lógicamente
export const getDeletedGastos = async (): Promise<GastoType[]> => {
    const db = await getDB();
    // Usamos el índice 'by-deletedAt' para obtener eficientemente solo los registros
    // que tienen un valor en el campo 'deletedAt'.
    const range = IDBKeyRange.lowerBound('');
    const deletedGastos = await db.getAllFromIndex(STORE_NAME, 'by-deletedAt', range);
    // Ordenamos por fecha de borrado, mostrando los más recientes primero
    return deletedGastos.sort((a, b) => (b.deletedAt || '').localeCompare(a.deletedAt || ''));
};

// Restaura un gasto que fue borrado lógicamente
export const restoreGasto = async (id: number | string): Promise<void> => {
    const db = await getDB();
    const numericId = typeof id === 'string' ? Number(id) : id;

    const current = await db.get(STORE_NAME, numericId);
    if (!current) throw new Error(`Gasto con id ${id} no encontrado.`);
    if (!current.deletedAt) return; // Ya está restaurado, no hacer nada.

    const { deletedAt, ...restoredGasto } = current;
    await db.put(STORE_NAME, { ...restoredGasto, updatedAt: new Date().toISOString() });
};

// Realiza un borrado lógico de un gasto marcándolo con una fecha de borrado
export const softDeleteGasto = async (id: number | string): Promise<void> => {
    const db = await getDB();
    const numericId = typeof id === 'string' ? Number(id) : id;

    const current = await db.get(STORE_NAME, numericId);
    if (!current) throw new Error(`Gasto con id ${id} no encontrado.`);

    const updatedGasto = { ...current, deletedAt: new Date().toISOString() };
    await db.put(STORE_NAME, updatedGasto);
};

// Borra todos los gastos (precaución)
export const clearGastos = async (): Promise<void> => {
    const db = await getDB();
    await db.clear(STORE_NAME);
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

// Actualiza un gasto existente por ID
export const updateGasto = async (id: number | string, data: Partial<GastoType>): Promise<void> => {
    const db = await getDB();
    // Obtener el gasto actual
    const current: GastoType | undefined = await db.get(STORE_NAME, typeof id === "string" ? Number(id) : id);
    if (!current) throw new Error("Gasto no encontrado");
    // Actualizar solo los campos proporcionados
    const updated = { ...current, ...data, updatedAt: new Date().toISOString() };
    await db.put(STORE_NAME, updated);
};

// Agrega masivamente gastos desde un array. No comprueba duplicados.
const bulkAddGastos = async (gastos: Array<Omit<GastoType, 'id'>>): Promise<void> => {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const now = new Date().toISOString();

    for (const gasto of gastos) {
        const gastoToInsert = {
            ...gasto,
            createdAt: gasto.createdAt || now,
            updatedAt: now, // Siempre establece la fecha de actualización
        };
        await tx.store.add(gastoToInsert as any);
    }
    await tx.done;
};

export async function importGastos(json: string) {
  const parsed: GastoType[] = JSON.parse(json);
  await bulkAddGastos(parsed.map(({ id, ...rest }) => rest));
}