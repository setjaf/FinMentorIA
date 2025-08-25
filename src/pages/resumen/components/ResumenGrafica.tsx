import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import type { GastoType } from '../../../types/GastoType';
import type { CategoriaType } from '../../../types/CategoriaType';

type ResumenGraficaProps = {
    gastos: GastoType[];
    categorias: CategoriaType[];
    viewMode: 'categoria' | 'dia';
    // Necesitamos las fechas para la gráfica por día
    fechaInicio: string;
    fechaFin: string;
};

// Mapa para convertir los nombres de colores de Tailwind a códigos hexadecimales para la gráfica
const tailwindColorMap: { [key: string]: string } = {
    slate: '#64748b', gray: '#6b7280', zinc: '#71717a', neutral: '#737373',
    stone: '#78716c', red: '#ef4444', orange: '#f97316', amber: '#f59e0b',
    yellow: '#eab308', lime: '#84cc16', green: '#22c55e', emerald: '#10b981',
    teal: '#14b8a6', cyan: '#06b6d4', sky: '#0ea5e9', blue: '#3b82f6',
    indigo: '#6366f1', violet: '#8b5cf6', purple: '#a855f7', fuchsia: '#d946ef',
    pink: '#ec4899', rose: '#f43f5e',
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    // No renderizar etiquetas para porciones muy pequeñas para evitar desorden
    if (percent < 0.05) {
        return null;
    }
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="black"
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            fontSize="12px"
            fontWeight="bold"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

// Helper para obtener todas las fechas en un rango, incluyendo inicio y fin
function getDatesInRange(startDateStr: string, endDateStr: string): string[] {
    const dates = [];
    // Parseamos las fechas como UTC para evitar la interpretación de la zona horaria local.
    const startDate = new Date(`${startDateStr}T00:00:00Z`);
    const endDate = new Date(`${endDateStr}T00:00:00Z`);

    // Usamos un nuevo objeto Date para la iteración para no modificar el original.
    // Empezamos con los componentes UTC de la fecha de inicio.
    let currentDate = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate()));

    console.log({ startDate, endDate, currentDate });


    while (currentDate <= endDate) {
        currentDate.setMinutes(currentDate.getMinutes() + currentDate.getTimezoneOffset());
        // Formateamos la fecha de vuelta a 'YYYY-MM-DD'
        dates.push(currentDate.toISOString().slice(0, 10));
        // Incrementamos el día en UTC para evitar problemas con el cambio de horario (DST).
        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }

    console.log(dates);

    return dates;
}

export default function ResumenGrafica({ gastos, categorias, viewMode, fechaInicio, fechaFin }: ResumenGraficaProps) {

    console.log({ fechaInicio, fechaFin });


    // Prepara los datos para el gráfico de pastel (por categoría)
    const pieChartData = useMemo(() => {
        const gastosPorCategoria: { [key: string]: number } = {};

        // Agrupamos y sumamos los gastos por ID de categoría
        for (const gasto of gastos) {
            gastosPorCategoria[gasto.categoria] = (gastosPorCategoria[gasto.categoria] || 0) + gasto.cantidad;
        }

        const totalGastosDelPeriodo = Object.values(gastosPorCategoria).reduce((a, b) => a + b, 0);

        // Mapeamos a un formato que Recharts entiende, añadiendo nombre y color
        return Object.entries(gastosPorCategoria)
            .map(([categoriaId, total]) => {
                const categoria = categorias.find(c => c.id === Number(categoriaId));
                return {
                    name: categoria?.nombre || 'Sin Categoría',
                    total: total,
                    percent: total / totalGastosDelPeriodo,
                    color: tailwindColorMap[categoria?.color || 'gray'] || '#6b7280',
                };
            })
            .sort((a, b) => b.total - a.total); // Ordenamos de mayor a menor
    }, [gastos, categorias]);

    // Prepara los datos para el gráfico de barras (por día)
    const barChartData = useMemo(() => {
        if (!fechaInicio || !fechaFin) return [];

        const allDates = getDatesInRange(fechaInicio, fechaFin);
        const gastosPorDia: { [key: string]: number } = {};

        // Agrupamos los gastos por día
        for (const gasto of gastos) {
            gastosPorDia[gasto.fecha] = (gastosPorDia[gasto.fecha] || 0) + gasto.cantidad;
        }

        console.log({ gastosPorDia });

        // Mapeamos todas las fechas del período para asegurar que se muestren los días con 0 gastos
        return allDates.map(date => {

            const diaDate = new Date(`${date}T00:00:00.000`);


            return {
                name: date.slice(8, 10), // Mostramos solo el número del día 'DD' en el eje
                fullDate: date,
                total: gastosPorDia[diaDate.toISOString()] || 0,
            }
        });
    }, [gastos, fechaInicio, fechaFin]);

    if (gastos.length === 0) {
        return (
            <div className="mt-6 bg-white p-4 rounded-lg shadow-md text-center text-gray-500">
                <p>No hay datos para graficar en este período.</p>
            </div>
        );
    }

    return (
        <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 text-center mb-4">
                {viewMode === 'categoria' ? 'Gastos por Categoría' : 'Gastos por Día'}
            </h3>
            <div style={{ width: '100%', height: 300 }}>
                {viewMode === 'categoria' ? (
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={pieChartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="total"
                                nameKey="name"
                                labelLine={false}
                                label={renderCustomizedLabel}
                            >
                                {pieChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number, name: string, entry: any) => {
                                const percent = (entry.payload.percent * 100).toFixed(2);
                                return [`$${value.toFixed(2)} (${percent}%)`, 'Total'];
                            }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <ResponsiveContainer>
                        <BarChart data={barChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tickFormatter={(value) => `$${value}`} tick={{ fontSize: 12 }} />
                            <Tooltip
                                cursor={{ fill: 'rgba(243, 244, 246, 0.5)' }}
                                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Total']}
                                labelFormatter={(label, payload) => payload?.[0]?.payload.fullDate || label}
                            />
                            <Bar dataKey="total" fill="#1c398e" barSize={15} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
