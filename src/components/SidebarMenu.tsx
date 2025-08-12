import { useLocation, useNavigate } from "react-router-dom";

type Props = {
    menuIsOpen : boolean;
    onMenuClose: () => void;
}

export const SidebarMenu = ({menuIsOpen, onMenuClose}:Props) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleMenuClick = (urlLocation:string ) => {
        navigate(urlLocation);
        // Cerrar el menú al hacer clic en un enlace
        onMenuClose();
    }

    return (
        <aside id="sidebar" className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md pt-15 p-4 space-y-4 transform ${menuIsOpen?"":"-translate-x-full"} transition-transform duration-300 z-50`}>
            <button
                className={`block w-full text-left p-2 rounded-md ${location.pathname === '/' ? 'text-blue-900 font-medium bg-gray-100' : 'text-gray-800'}`}
                onClick={() => handleMenuClick("/")}
            >
                Inicio
            </button>
            <button
                className={`block w-full text-left p-2 rounded-md ${location.pathname === '/registrar' ? 'text-blue-900 font-medium bg-gray-100' : 'text-gray-800'}`}
                onClick={() => handleMenuClick("/registrar")}
            >
                Nuevo gasto
            </button>
            <button
                className={`block w-full text-left p-2 rounded-md ${location.pathname === '/configuracion' ? 'text-blue-900 font-medium bg-gray-100' : 'text-gray-800'}`}
                onClick={() => handleMenuClick("/configuracion")}
            >
                Configuración
            </button>
            <hr />
        </aside>
    );
};