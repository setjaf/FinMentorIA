import { useState, useRef, useEffect } from "react";
import { ChartColumn, Home, PlusCircle, Settings } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showResumenOptions, setShowResumenOptions] = useState(false);
  const resumenRef = useRef<HTMLDivElement>(null);

  // Cierra el pop-up si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resumenRef.current && !resumenRef.current.contains(event.target as Node)) {
        setShowResumenOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleResumenClick = () => {
    setShowResumenOptions(prev => !prev);
  };

  const handleOptionClick = (path: string) => {
    navigate(path);
    setShowResumenOptions(false);
  };

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-t-gray-200 flex justify-around py-2 z-50 pb-4">
      <button
        type="button"
        onClick={() => navigate("/")}
        className={`flex flex-col items-center w-10 ${location.pathname === "/" ? "text-blue-900" : "text-gray-600"}`}
      >
        <Home />
        <span className="text-xs">Inicio</span>
      </button>
      <button
        type="button"
        onClick={() => navigate("/registrar")}
        className={`flex flex-col items-center w-10 ${location.pathname === "/registrar" ? "text-blue-900" : "text-gray-600"}`}
      >
        <PlusCircle />
        <span className="text-xs">Registrar</span>
      </button>

      {/* Botón de Resumen con menú flotante */}
      <div className="relative flex justify-center" ref={resumenRef}>
        {showResumenOptions && (
          <div className="absolute bottom-full mb-2 bg-white border border-gray-200 rounded-lg shadow-xl py-1">
            <button
              onClick={() => handleOptionClick("/resumen?tipo=mensual")}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Mensual
            </button>
            <button
              onClick={() => handleOptionClick("/resumen?tipo=quincenal")}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Quincenal
            </button>
            <button
              onClick={() => handleOptionClick("/resumen?tipo=personalizado")}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Personalizado
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={handleResumenClick}
          className={`flex flex-col items-center w-10 ${location.pathname.startsWith("/resumen") ? "text-blue-900" : "text-gray-600"}`}
        >
          <ChartColumn />
          <span className="text-xs">Resumen</span>
        </button>
      </div>

      <button
        type="button"
        onClick={() => navigate("/configuracion")}
        className={`flex flex-col items-center w-10 ${location.pathname === "/configuracion" ? "text-blue-900" : "text-gray-600"}`}
      >
        <Settings />
        <span className="text-xs">Configuración</span>
      </button>
    </nav>
  );
};
