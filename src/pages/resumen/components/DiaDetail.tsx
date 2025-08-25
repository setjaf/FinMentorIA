import { memo, useMemo } from "react";
import type { CategoriaType } from "../../../types/CategoriaType";
import type { GastoType } from "../../../types/GastoType";
import { ChevronDown } from "lucide-react";
import InformacionGastoDia from "./InformacionGastoDia";

type DiaDetailProps = {
    dia: string;
    gastos: GastoType[];
    categorias: CategoriaType[];
};


const CategoriaDetail = memo(({ dia, gastos, categorias }: DiaDetailProps) => {

    const total = useMemo(() => {
        return gastos.reduce((sum, g) => sum + g.cantidad, 0);
    }, [gastos]);

    return (
        <details
            key={dia}
            className={`group bg-white rounded-lg shadow-md`}
        >
            <summary className="flex justify-between items-center p-4 pb-4 cursor-pointer list-none hover:bg-gray-50 transition-colors">
                <span className="font-medium text-gray-600">{(dia.split('T')[0]).split('-').reverse().join('/')}</span>
                <span className="text-gray-600 font-semibold flex items-center">
                    ${total.toFixed(2)}
                    <ChevronDown className="transform transition-transform duration-300 group-open:rotate-180 text-gray-600" />
                </span>
                
            </summary>
            <ul className="px-4 pb-3 text-sm text-gray-600 space-y-1">
                {gastos.map((g, i) => (
                    <InformacionGastoDia key={i} gasto={g} categoria={categorias.find(c => c.id == g.categoria)!} />
                ))}
            </ul>
        </details>
    );
});

export default CategoriaDetail;