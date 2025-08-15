import { useState } from "react";
import * as GastosDB from '../../../db/GastosDB';
import * as CategoriasDB from '../../../db/CategoriasDB';
import { Upload } from "lucide-react";


const Importar = () => {

    const [gastosFile, setGastosFile] = useState<File | null>(null);
    const [categoriasFile, setCategoriasFile] = useState<File | null>(null);
    
    const readFileAsText = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    };

    const handleImport = async () => {
        if (!gastosFile && !categoriasFile) {
            alert("Por favor, selecciona al menos un archivo para importar.");
            return;
        }

        if (!window.confirm("¿Estás seguro de que quieres importar estos datos? Esta acción puede añadir datos duplicados y no se puede deshacer.")) {
            return;
        }

        try {
            if (categoriasFile) {
                const json = await readFileAsText(categoriasFile);
                await CategoriasDB.importCategorias(json);
            }
            if (gastosFile) {
                const json = await readFileAsText(gastosFile);
                await GastosDB.importGastos(json);
            }
            alert("¡Importación completada! La página se recargará para reflejar los cambios.");
            window.location.reload();
        } catch (error) {
            console.error("Error al importar los datos:", error);
            alert("Hubo un error al importar los datos. Revisa la consola para más detalles.");
        }
    };

    return (
        <div className="p-4 border-t border-gray-200 text-left space-y-4">
            <p className="text-sm text-gray-600 mb-4 text-center">
                Importa gastos y categorías desde archivos JSON.
                <br />
                <strong className="text-red-600">Advertencia:</strong> Esta acción puede modificar o duplicar tus datos existentes.
            </p>

            <div>
                <label htmlFor="categorias-file" className="block text-sm font-medium text-gray-700">
                    Archivo de Categorías (.json)
                </label>
                <input
                    id="categorias-file"
                    type="file"
                    accept=".json,application/json"
                    onChange={(e) => setCategoriasFile(e.target.files ? e.target.files[0] : null)}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
            </div>

            <div>
                <label htmlFor="gastos-file" className="block text-sm font-medium text-gray-700">
                    Archivo de Gastos (.json)
                </label>
                <input
                    id="gastos-file"
                    type="file"
                    accept=".json,application/json"
                    onChange={(e) => setGastosFile(e.target.files ? e.target.files[0] : null)}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
            </div>

            <div className="text-center pt-2">
                <button onClick={handleImport} disabled={!gastosFile && !categoriasFile} className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed">
                    <Upload className="mr-2 -ml-1 h-5 w-5" />
                    Importar Datos
                </button>
            </div>
        </div>
    );

};

export default Importar;