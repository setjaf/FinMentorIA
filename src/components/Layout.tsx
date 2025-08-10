import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { TopHeader } from '../components/TopHeader';
import { FloatingButton } from '../components/FloatingButton';
import { ModalGasto } from '../components/ModalGasto';
import { BottomNav } from '../components/BottomNav';
import { BackgroundMenu } from './BackgroundMenu';
import { SidebarMenu } from './SidebarMenu';


const Layout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setIsSidebarOpen((prev) => !prev)
  };

  const handleCloseMenuClick = () => {
    setIsSidebarOpen(false);
    setIsModalOpen(false);
  }; 
    

  const handleModalToggle = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen pb-16">

        <BackgroundMenu isMenuOpen={isSidebarOpen} onMenuClick={handleCloseMenuClick} />

        {/* Header */}
        <TopHeader onMenuClick={handleMenuClick}/>

        <SidebarMenu menuIsOpen={isSidebarOpen} />

        {/* Main page content */}
        <main className="p-15">
        <Outlet />
        </main>

        {/* Floating Action Button */}
        <FloatingButton onClick={handleModalToggle} />

        {/* Modal para registrar gasto */}
        <ModalGasto
        isOpen={isModalOpen}
        onClose={handleModalToggle}
        />

        {/* Bottom Navigation */}
        <BottomNav />
    </div>
  );
};

export default Layout;