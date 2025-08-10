import { use, useEffect, useState } from 'react';
import { ColorDropdown } from '../../components/ColorDropdown';
import { coloresTailwind } from '../../types/catalogs/TailwindColors';
import { useCategorias } from '../../hooks/UseCategorias';
import type { CategoriaType } from '../../types/CategoriaType';

let nextId = 1;

export default function Configuracion() {
    const [nombre, setNombre] = useState('');
    const [color, setColor] = useState(coloresTailwind[0].value);

    const { categorias, error, estado, cargar, crear } = useCategorias();

    useEffect(() => {
        if (error) {
            console.error('Error al cargar categorías:', error);
        }
    }, [error]);

    useEffect(() => {
        cargar();
    }, [cargar]);

    useEffect(() => {
        if (estado === 'loading') {
            console.log('Cargando categorías...');
        } else if (estado === 'success') {
            console.log('Categorías cargadas:', categorias);
        } else if (estado === 'error') {
            console.error('Error al cargar categorías');
        }
    }, [estado, categorias]);

    const handleAgregar = async () => {
        if (!nombre.trim()) return;

        const nueva: CategoriaType = {
            nombre,
            color,
        };

        console.log(await crear(nueva));
        setNombre('');
        setColor(coloresTailwind[0].value);
    };

    return (
        <div className="p-4 pb-24 space-y-6 text-center">
            <h1 className="text-2xl font-semibold text-gray-900">
                Resumen Mensual
            </h1>

            <div className="">
                <h2 className="text-lg font-semibold text-gray-800">Crear nueva categoría</h2>

                <div className="space-y-2">
                    <input
                        type="text"
                        placeholder="Nombre de la categoría"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full border rounded-lg p-2"
                    />

                    <ColorDropdown color={color} setColor={setColor} />

                    <button
                        onClick={handleAgregar}
                        className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                    >
                        Agregar categoría
                    </button>
                </div>
            </div>

            {/* Lista de categorías creadas */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800">Categorías creadas</h2>
                {categorias.length === 0 && (
                    <p className="text-gray-500 text-sm">Aún no hay categorías personalizadas.</p>
                )}
                {categorias.map((cat) => (
                    <div
                        key={cat.id}
                        className={`p-3 rounded-lg shadow text-white bg-${cat.color}-500 flex justify-between items-center`}
                    >
                        <span>{cat.nombre}</span>
                        <span className="text-xs uppercase">{cat.color}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}