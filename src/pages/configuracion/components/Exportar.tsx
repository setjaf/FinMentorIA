import { Download } from "lucide-react";
import * as GastosDB from '../../../db/GastosDB';
import * as CategoriasDB from '../../../db/CategoriasDB';
import JSZip from 'jszip';


const Export = () => {

    // Renombramos la función para que sea más genérica, ya que ahora descargará un Blob
    const downloadBlob = (blob: Blob, filename: string) => {
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
            const zip = new JSZip();

            // getGastos() ya filtra los gastos borrados lógicamente.
            const gastos = await GastosDB.getGastos();
            const categorias = await CategoriasDB.getCategorias();

            // Agregar los archivos al ZIP
            zip.file("gastos.json", JSON.stringify(gastos, null, 2));
            zip.file("categorias.json", JSON.stringify(categorias, null, 2));

            // Generar el archivo ZIP como un Blob
            const zipBlob = await zip.generateAsync({ type: "blob" });

            const date = new Date().toISOString().slice(0, 10); // Formato YYYY-MM-DD
            // Iniciar la descarga del único archivo ZIP
            downloadBlob(zipBlob, `respaldo-gastos-${date}.zip`);
        } catch (error) {
            console.error("Error al exportar los datos:", error);
            alert("Hubo un error al exportar los datos. Revisa la consola para más detalles.");
        }
    };

    return (
        <div className="p-4 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600 mb-4">
                Descarga una copia de seguridad de tus gastos y categorías en un único archivo ZIP.
            </p>
            <button
                onClick={handleExport}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                <Download className="mr-2 -ml-1 h-5 w-5" />
                Descargar Respaldo (ZIP)
            </button>
        </div>
    );
}

export default Export;