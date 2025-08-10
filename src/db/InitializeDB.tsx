import { openDB, type IDBPDatabase, type DBSchema } from 'idb';
import type { GastoType } from '../types/GastoType';
import type { CategoriaType } from '../types/CategoriaType';

interface AppDB extends DBSchema {
  gastos: {
    key: number;
    value: GastoType;
    indexes: {};
  };
  categorias: {
    key: number;
    value: CategoriaType;
    indexes: { 'by-nombre': string };
  };
}

const DB_NAME = 'gastos-db';
const VERSION = 3; // ⬅️ súbela cuando agregues/modifiques stores
let _db: IDBPDatabase<AppDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<AppDB>> {
  if (_db) return _db;

  _db = await openDB<AppDB>(DB_NAME, VERSION, {
    upgrade(db, oldVersion) {
      // v1: crea 'gastos'
      if (oldVersion < 1) {
        db.createObjectStore('gastos', { keyPath: 'id', autoIncrement: true });
      }
      // v2: crea 'categorias'
      if (oldVersion < 2) {
        const store = db.createObjectStore('categorias', { keyPath: 'id', autoIncrement: true });
        store.createIndex('by-nombre', 'nombre', { unique: true });
      }
      // v3: aquí podrías agregar otros índices o stores
    },
  });

  return _db;
}