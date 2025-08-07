export interface GastoType {
    id?: number;            // Se genera automáticamente (ej. IndexedDB)
    cantidad: number;       // Valor numérico del gasto
    categoria: string;      // Ej. "comida", "transporte", etc.
    fecha: string;          // ISO date string: "2025-07-21"
}

export interface AgrupadoGastoType {
  [categoria: string]: GastoType[];
};