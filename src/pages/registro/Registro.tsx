import { FormGasto } from "../../components/FormGasto";
import type { CategoriaType } from "../../types/CategoriaType";

type RegistroProps = {  
    categorias: CategoriaType[];
};

export default function Registro({ categorias }: RegistroProps) {
    return (
        <div className="flex flex-col h-screen">
            <div className="text-center">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Registrar Gasto
                </h1>
            </div>
            <main className="flex-1 overflow-y-auto p-4">
                <FormGasto onClose={()=>{}} categorias={categorias} />
            </main>
        </div>
    );
}