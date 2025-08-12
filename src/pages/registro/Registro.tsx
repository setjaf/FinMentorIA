import { FormGasto } from "../../components/FormGasto";
import type { CategoriaType } from "../../types/CategoriaType";
import { useSearchParams } from "react-router-dom";

type RegistroProps = {  
    categorias: CategoriaType[];
};

export default function Registro({ categorias }: RegistroProps) {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    return (
        <div className="flex flex-col h-screen">
            <div className="text-center">
                <h1 className="text-2xl font-semibold text-gray-900 pb-4">
                    Registrar Gasto
                </h1>
            </div>
            <main className="flex-1 overflow-y-auto p-4">
                <FormGasto onClose={() => {}} categorias={categorias} gastoId={id} />
            </main>
        </div>
    );
}