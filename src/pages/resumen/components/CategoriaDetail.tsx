import { memo, useMemo } from "react";
import type { CategoriaType } from "../../../types/CategoriaType";
import type { GastoType } from "../../../types/GastoType";
import InformacionGasto from "./InformacionGasto";
import { ChevronDown } from "lucide-react";

type CategoriaDetailProps = {
    categoria: CategoriaType;
    gastos: GastoType[];
};


const CategoriaDetail = memo(({ categoria, gastos }: CategoriaDetailProps) => {

    const total = useMemo(() => {
        return gastos.reduce((sum, g) => sum + g.cantidad, 0);
    }, [gastos]);

    return (
        <details
            key={categoria?.id + categoria?.nombre}
            className={`group bg-white rounded-lg shadow-md border-l-10 border-l-${categoria?.color||'gray'}-500`}
        >
            <summary className="flex justify-between items-center p-4 cursor-pointer list-none hover:bg-gray-50 transition-colors">
                <span className="font-medium text-gray-600">{categoria?.nombre || 'Categoria'}</span>
                <span className="text-gray-600 font-semibold flex items-center">
                    ${total.toFixed(2)}
                    <ChevronDown className="transform transition-transform duration-300 group-open:rotate-180 text-gray-600" />
                </span>
                
            </summary>
            <ul className="px-4 pb-3 text-sm text-gray-600 mt-2 space-y-1">
                {gastos.map((g, i) => (
                    <InformacionGasto key={i} gasto={g} />
                ))}
            </ul>
        </details>
    );
});

export default CategoriaDetail;