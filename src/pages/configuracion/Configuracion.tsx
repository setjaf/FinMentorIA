import { useEffect, useState } from 'react';
import { ColorDropdown } from '../../components/ColorDropdown';
import { coloresTailwind } from '../../types/catalogs/TailwindColors';
import { useCategorias } from '../../hooks/UseCategorias';
import type { CategoriaType } from '../../types/CategoriaType';


export default function Configuracion() {
    const [nombre, setNombre] = useState('');
    const [color, setColor] = useState(coloresTailwind[0].value);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<CategoriaType | null>(null);

    const { categorias, error, estado, cargar, crear, actualizar } = useCategorias();

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

    const handleGuardar = async () => {
        if (!categoriaSeleccionada || !nombre.trim()) return;
        if (typeof categoriaSeleccionada.id === 'number') {
            await actualizar(categoriaSeleccionada.id, { nombre, color });
        } else {
            console.error('El id de la categoría seleccionada no es un número:', categoriaSeleccionada.id);
        }
        setCategoriaSeleccionada(null);
        setNombre('');
        setColor(coloresTailwind[0].value);
    };

    // Al hacer clic en una categoría, mostrar su info en los campos
    const handleCategoriaClick = (cat: CategoriaType) => {
        setNombre(cat.nombre);
        setColor(cat.color);
        setCategoriaSeleccionada(cat);
    };

    return (
        <div className="p-4 pb-24 space-y-6 text-center">
            <h1 className="text-2xl font-semibold text-gray-900">
                Configuración de categorías
            </h1>

            <div className="">

                <h2 className="text-lg font-semibold text-gray-800">
                    {categoriaSeleccionada ? `Editar` : `Crear nueva`} categoría
                </h2>

                <div className="space-y-2">
                    <input
                        type="text"
                        placeholder="Nombre de la categoría"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full border rounded-lg p-2"
                    />

                    <ColorDropdown color={color} setColor={setColor} />

                    <div className="flex gap-2">
                        {!categoriaSeleccionada ? (
                            <button
                                onClick={handleAgregar}
                                className="flex-1 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                                type="button"
                            >
                                Agregar categoría
                            </button>
                        ) :
                            (
                                <>
                                    <button
                                        onClick={handleGuardar}
                                        className="flex-1 bg-green-600 text-white p-2 rounded-lg hover:bg-green-700"
                                        type="button"
                                    >
                                        Guardar
                                    </button>
                                    <button
                                        onClick={() => {
                                            setCategoriaSeleccionada(null);
                                            setNombre('');
                                            setColor(coloresTailwind[0].value);
                                        }}
                                        className="flex-1 bg-gray-300 text-gray-800 p-2 rounded-lg hover:bg-gray-400"
                                        type="button"
                                    >
                                        Cancelar edición
                                    </button>
                                </>
                            )}
                    </div>
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
                        className={`p-3 rounded-lg shadow text-white bg-${cat.color}-500 flex justify-between items-center cursor-pointer transition hover:scale-[1.03]`}
                        onClick={() => handleCategoriaClick(cat)}
                        title="Editar categoría"
                    >
                        <span>{cat.nombre}</span>
                        <span className="text-xs uppercase">{cat.color}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}