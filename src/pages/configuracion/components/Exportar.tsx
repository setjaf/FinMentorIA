import { Download } from "lucide-react";
import * as GastosDB from '../../../db/GastosDB';
import * as CategoriasDB from '../../../db/CategoriasDB';


const Export = () => {

    const downloadJSON = (data: unknown, filename: string) => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleExport = async () => {
        try {
            // getGastos() ya filtra los gastos borrados lógicamente.
            const gastos = await GastosDB.getGastos();
            const categorias = await CategoriasDB.getCategorias();

            // Iniciar descargas
            downloadJSON(gastos, 'gastos.json');
            downloadJSON(categorias, 'categorias.json');

        } catch (error) {
            console.error("Error al exportar los datos:", error);
            alert("Hubo un error al exportar los datos. Revisa la consola para más detalles.");
        }
    };

    return (
        <div className="p-4 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600 mb-4">
                Descarga una copia de seguridad de tus gastos y categorías en formato JSON.
            </p>
            <button
                onClick={handleExport}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                <Download className="mr-2 -ml-1 h-5 w-5" />
                Descargar Datos
            </button>
        </div>
    );
}

export default Export;