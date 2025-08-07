import { FormGasto } from "../../components/FormGasto";

export default function Registro() {
    return (
        <div className="flex flex-col h-screen">
            <div className="text-center">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Registrar Gasto
                </h1>
            </div>
            <main className="flex-1 overflow-y-auto p-4">
                <FormGasto onClose={()=>{}} />
            </main>
        </div>
    );
}