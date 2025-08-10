type Props = {
    menuIsOpen : boolean
}

export const SidebarMenu = ({menuIsOpen}:Props) => (
    <aside id="sidebar" className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md pt-15 p-4 space-y-4 transform ${menuIsOpen?"":"-translate-x-full"} transition-transform duration-300 z-50`}>
        <a className="block text-gray-800 font-medium" href="/">Inicio</a>
        <a className="block text-gray-800" href="/registrar">Nuevo gasto</a>
        <a className="block text-gray-800" href="/configuracion">Configuración</a>
        <hr />
        <a className="block text-red-600 font-medium" href="#">Cerrar sesión</a>
    </aside>
);