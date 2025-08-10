import type { CategoriaType } from '../types/CategoriaType';
import { getDB } from './initializeDB';


/** =========================
 *  Config
 *  ========================= */
const STORE = 'categorias';


/** Semillas opcionales (llamar una vez desde bootstrap) */
export async function seedCategorias(defaults: Array<Omit<CategoriaType, 'id'>> = [
  { nombre: 'Alimentos', color: 'emerald' },
  { nombre: 'Transporte', color: 'blue' },
  { nombre: 'Vivienda', color: 'amber' },
  { nombre: 'Entretenimiento', color: 'indigo' },
]): Promise<boolean> {
  const db = await getDB();
  const tx = db.transaction(STORE, 'readwrite');
  const count = await tx.store.count();
  if (count === 0) {
    for (const c of defaults) await tx.store.add(c as any);
  }
  await tx.done;

  return true
}

/** =========================
 *  CRUD
 *  ========================= */

/** Crear */
export async function addCategoria(data: Omit<CategoriaType, 'id'>): Promise<number> {
  const db = await getDB();
  try {
    return await db.add(STORE, data as any);
  } catch (e: any) {
    if (String(e?.message || e).includes('by-nombre')) {
      throw new Error('El nombre de la categoría ya existe.');
    }
    throw e;
  }
}

/** Leer: todas */
export async function getCategorias(): Promise<CategoriaType[]> {
  const db = await getDB();
  return await db.getAll(STORE);
}

/** Leer: por id */
export async function getCategoriaById(id: number): Promise<CategoriaType | undefined> {
  const db = await getDB();
  return await db.get(STORE, id);
}

/** Leer: por nombre (usa índice) */
export async function getCategoriaByNombre(nombre: string): Promise<CategoriaType | undefined> {
  const db = await getDB();
  const idx = db.transaction(STORE).store.index('by-nombre');
  return await idx.get(nombre);
}

/** Actualizar (parcial o total) */
export async function updateCategoria(id: number, patch: Partial<CategoriaType>): Promise<void> {
  const db = await getDB();
  const current = await db.get(STORE, id);
  if (!current) throw new Error('Categoría no encontrada');

  const next: CategoriaType & { id: number } = { ...current, ...patch, id };
  try {
    await db.put(STORE, next);
  } catch (e: any) {
    if (String(e?.message || e).includes('by-nombre')) {
      throw new Error('El nombre de la categoría ya existe.');
    }
    throw e;
  }
}

/** Eliminar */
export async function deleteCategoria(id: number): Promise<void> {
  const db = await getDB();
  await db.delete(STORE, id);
}

/** Borrar todo (solo dev/tools) */
export async function clearCategorias(): Promise<void> {
  const db = await getDB();
  await db.clear(STORE);
}

/** =========================
 *  Utilidades
 *  ========================= */

/** Bulk upsert por nombre (útil para importar configuraciones) */
export async function upsertCategoriasPorNombre(items: Array<Omit<CategoriaType, 'id'>>) {
  const db = await getDB();
  const tx = db.transaction(STORE, 'readwrite');
  const idx = tx.store.index('by-nombre');

  for (const item of items) {
    const existing = await idx.get(item.nombre);
    if (existing) {
      await tx.store.put({ ...existing, ...item, id: existing.id });
    } else {
      await tx.store.add(item as any);
    }
  }

  await tx.done;
}

/** Exportar/importar a JSON */
export async function exportCategorias(): Promise<string> {
  const all = await getCategorias();
  return JSON.stringify(all, null, 2);
}

export async function importCategorias(json: string) {
  const parsed: CategoriaType[] = JSON.parse(json);
  await upsertCategoriasPorNombre(parsed.map(({ id, ...rest }) => rest));
}
