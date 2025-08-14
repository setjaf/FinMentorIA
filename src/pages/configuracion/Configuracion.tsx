import AdministrarCategorias from './components/AdministrarCategorias';
import PapeleraGastos from './components/PapeleraGastos';
import { ChevronDown } from 'lucide-react';


export default function Configuracion() {     
    


    return (
        <div className="p-4 pb-24 space-y-6 text-center">
            <h1 className="text-2xl font-semibold text-gray-900">
                Configuración
            </h1>

            {/* Usamos la pseudo-clase 'group' de Tailwind para animar el ícono basado en el estado 'open' del <details> */}
            <details className="group bg-white rounded-lg shadow-md overflow-hidden">
                <summary className="flex justify-between items-center p-4 cursor-pointer list-none hover:bg-gray-50 transition-colors">
                    <h2 className="text-lg font-semibold text-gray-800">Gestionar Categorías</h2>
                    <ChevronDown className="transform transition-transform duration-300 group-open:rotate-180 text-gray-600" />
                </summary>
                <div className="p-4 border-t border-gray-200 max-h-120 overflow-y-auto">
                    <AdministrarCategorias />
                </div>
            </details>

            <details className="group bg-white rounded-lg shadow-md overflow-hidden">
                <summary className="flex justify-between items-center p-4 cursor-pointer list-none hover:bg-gray-50 transition-colors">
                    <h2 className="text-lg font-semibold text-gray-800">Papelera de Gastos</h2>
                    <ChevronDown className="transform transition-transform duration-300 group-open:rotate-180 text-gray-600" />
                </summary>
                <div className="p-4 border-t border-gray-200">
                    <PapeleraGastos />
                </div>
            </details>
            
        </div>
    );
}