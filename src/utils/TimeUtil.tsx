


export const getDateString = (dateToday : Date = new Date()) => {
    return `${dateToday.getFullYear()}-${(dateToday.getMonth() + 1).toString().padStart(2, "0")}-${dateToday.getDate().toString().padStart(2, "0")}`;
};

export const getLastDayOfMonth = (year: number, month: number): number => {
    // El mes en el constructor de Date es 0-indexed (0 para Enero, 11 para Diciembre)
    // Crear una fecha para el día 0 del mes siguiente nos da el último día del mes actual.
    return new Date(year, month + 1, 0).getDate();
};
