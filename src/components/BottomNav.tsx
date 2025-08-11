import { Home, PlusCircle, Settings } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export const BottomNav = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-t-gray-200 flex justify-around py-2 z-50">
      <button
        type="button"
        onClick={() => navigate("/")}
        className={`flex flex-col items-center w-10 ${pathname === "/" ? "text-blue-600" : "text-gray-600"}`}
      >
        <Home />
        <span className="text-xs">Inicio</span>
      </button>
      <button
        type="button"
        onClick={() => navigate("/registrar")}
        className={`flex flex-col items-center w-10 ${pathname === "/registrar" ? "text-blue-600" : "text-gray-600"}`}
      >
        <PlusCircle />
        <span className="text-xs">Registrar</span>
      </button>
      <button
        type="button"
        onClick={() => navigate("/configuracion")}
        className={`flex flex-col items-center w-10 ${pathname === "/configuracion" ? "text-blue-600" : "text-gray-600"}`}
      >
        <Settings />
        <span className="text-xs">Configuración</span>
      </button>
    </nav>
  );
};
