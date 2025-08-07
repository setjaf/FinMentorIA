
import { Home, PlusCircle, BarChart2} from "lucide-react";
import { useLocation } from "react-router-dom";

export const BottomNav = () => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-t-gray-200 flex justify-around py-2 z-50">
      <a
        href="/"
        className={`flex flex-col items-center ${pathname === "/" ? "text-blue-600" : "text-gray-600"}`}
      >
        <Home />
        <span className="text-xs">Inicio</span>
      </a>
      <a
        href="/registrar"
        className={`flex flex-col items-center ${pathname === "/registrar" ? "text-blue-600" : "text-gray-600"}`}
      >
        <PlusCircle />
        <span className="text-xs">Registrar</span>
      </a>
      {/* <a
        href="/resumen"
        className={`flex flex-col items-center ${pathname === "/resumen" ? "text-blue-600" : "text-gray-600"}`}
      >
        <BarChart2 />
        <span className="text-xs">Resumen</span>
      </a> */}
    </nav>
  );
};
