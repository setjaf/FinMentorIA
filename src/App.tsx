import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Resumen from './pages/resumen/Resumen';
import Registro from './pages/registro/Registro';
import Configuracion from './pages/configuracion/Configuracion';
import { useCategorias } from './hooks/UseCategorias';
import { useEffect } from 'react';

function App() {
  // Cargar categorías al inicio
  const {cargar, error, categorias} = useCategorias({ listenGlobalEvents: true });

  // Cargar categorías al montar el componente
  useEffect(() => {
    cargar();
  }, [cargar]);  

  useEffect(() => {
    if (error) {
      console.error('Error al cargar categorías:', error);
    }
  }, [error]);

  return (
    <div className="pb-16"> {/* padding inferior para no tapar con BottomNav */}      
      <Routes>
        <Route path="/" element={<Layout/>}>

          <Route index element={<Resumen categorias={categorias}/>}/>
          <Route path='/registrar' element={<Registro categorias={categorias}/>}/>
          <Route path='/configuracion' element={<Configuracion />}/>

        </Route>
      </Routes>
    </div>
  );
}

export default App;