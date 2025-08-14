export interface GastoType {
    id?: number;            // Se genera automáticamente (ej. IndexedDB)
    descripcion?: string;   // Descripción opcional del gasto
    cantidad: number;       // Valor numérico del gasto
    categoria: string;      // Ej. "comida", "transporte", etc.
    fecha: string;          // ISO date string: "2025-07-21"
    deletedAt?: string;     // Fecha de eliminación suave (opcional)
    createdAt?: string;     // Fecha de creación (opcional)
    updatedAt?: string;     // Fecha de última actualización (opcional)
}

export interface AgrupadoGastoType {
  [categoria: string]: GastoType[];
};