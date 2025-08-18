export const localNow = () => {

    // Get the current date and time adjusted for local timezone
    return new Date(new Date().setMinutes(
        new Date().getMinutes() - new Date().getTimezoneOffset()
    ));
};

export const getLastDayOfMonth = (year: number, month: number): number => {
    // El mes en el constructor de Date es 0-indexed (0 para Enero, 11 para Diciembre)
    // Crear una fecha para el día 0 del mes siguiente nos da el último día del mes actual.
    return new Date(year, month + 1, 0).getDate();
};
