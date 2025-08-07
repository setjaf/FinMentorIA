import { useEffect, useState } from "react";
import { getTotalesPorCategoriaMesActual } from "../../db/GastosDB";
import { CATEGORIAS_PREDEFINIDAS } from "../../types/catalogs/CategoriaCatalog";
import CategoriaResume from "./components/CategoriaResume";

function Inicio() {

    const [total, setTotal] = useState(0);
    const [totales, setTotales] = useState<{ idCategoria: string; total: number }[]>([]);

    const fetchTotales = async () => {
        const result = await getTotalesPorCategoriaMesActual();
        setTotales(result);
    }
    const calcularTotal = () => {
        const totalMes = totales.reduce((acc, curr) => acc + curr.total, 0);
        setTotal(totalMes);
    }

    useEffect(() => {  
        fetchTotales();

        const handler = () => {
            fetchTotales();
        };

        window.addEventListener('gastoAdded', handler);

        return () => {
        window.removeEventListener('gastoAdded', handler);
        };

     },[]);

     useEffect(() => {
        calcularTotal();
     }, [totales]);

    return (
        <div className="bg-white font-sans relative"> {/* padding inferior para no tapar con BottomNav */}
            
            {/* <!-- Total de gastos mensual destacado --> */}
            <div className="px-4 pt-2 pb-4">
                <p className="text-center text-sm text-gray-500 mb-1">Total de gastos registrados este mes</p>
                <p className="text-4xl text-center text-blue-900 font-light tracking-wide">${total.toFixed(2)}</p>
            </div>

            {/* <!-- Contenido principal --> */}
            <main className="p-4 pb-20 relative z-10 space-y-4">

                {
                    CATEGORIAS_PREDEFINIDAS.map((categoria, index)=>{
                        const totalCategoria = totales.find(t => t.idCategoria == categoria.id)?.total || 0;
                        return (
                            <CategoriaResume categoria={categoria.nombre} total={totalCategoria} key={`${categoria.id}${index}`}/>
                        );
                    })
                }
                
            </main>
        </div>
    );
}

export default Inicio;