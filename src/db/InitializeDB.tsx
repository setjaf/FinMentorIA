import { openDB, type IDBPDatabase, type DBSchema } from 'idb';
import type { GastoType } from '../types/GastoType';
import type { CategoriaType } from '../types/CategoriaType';

interface AppDB extends DBSchema {
  gastos: {
    key: number;
    value: GastoType;
    indexes: { 'by-fecha': string, 'by-deletedAt': string};
  };
  categorias: {
    key: number;
    value: CategoriaType;
    indexes: { 'by-nombre': string };
  };
}

const DB_NAME = 'gastos-db';
const VERSION = 5;
let _db: IDBPDatabase<AppDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<AppDB>> {
  if (_db) return _db;

  _db = await openDB<AppDB>(DB_NAME, VERSION, {
    upgrade(db, oldVersion, newVersion ,tx) {
      // v1: crea 'gastos'
      if (oldVersion < 1) {
        db.createObjectStore('gastos', { keyPath: 'id', autoIncrement: true });
      }
      // v2: crea 'categorias'
      if (oldVersion < 2) {
        const catStore = db.createObjectStore('categorias', { keyPath: 'id', autoIncrement: true });
        catStore.createIndex('by-nombre', 'nombre', { unique: true });
      }
      // v4: Agrega índice por fecha a los gastos para consultas eficientes
      if (oldVersion < 4) {
        const gastoStore = tx.objectStore('gastos');
        gastoStore.createIndex('by-fecha', 'fecha');
      }
      // v5: Agrega índices para borrado lógico y fechas de auditoría
      if (oldVersion < 5) {
        const gastoStore = tx.objectStore('gastos');
        // Índice para filtrar eficientemente los gastos no borrados (deletedAt será undefined para los activos)
        gastoStore.createIndex('by-deletedAt', 'deletedAt');
    }
  }});

  return _db;
}