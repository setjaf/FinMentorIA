import { useNavigate } from "react-router-dom";

type Props = {
    menuIsOpen : boolean;
    onMenuClose: () => void;
}

export const SidebarMenu = ({menuIsOpen, onMenuClose}:Props) => {
    const navigate = useNavigate();

    const handleMenuClick = (urlLocation:string ) => {
        navigate(urlLocation);
        // Cerrar el menú al hacer clic en un enlace
        onMenuClose();
    }

    return (
        <aside id="sidebar" className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md pt-15 p-4 space-y-4 transform ${menuIsOpen?"":"-translate-x-full"} transition-transform duration-300 z-50`}>
            <button className="block text-gray-800 font-medium w-full text-left" onClick={() => handleMenuClick("/")}>Inicio</button>
            <button className="block text-gray-800 w-full text-left" onClick={() => handleMenuClick("/registrar")}>Nuevo gasto</button>
            <button className="block text-gray-800 w-full text-left" onClick={() => handleMenuClick("/configuracion")}>Configuración</button>
            <hr />
            <button className="block text-red-600 font-medium w-full text-left" onClick={() => {/* lógica de cerrar sesión */}}>Cerrar sesión</button>
        </aside>
    );
};