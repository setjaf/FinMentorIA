import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Resumen from './pages/resumen/Resumen';
import Registro from './pages/registro/Registro';

function App() {
  return (
    <div className="pb-16"> {/* padding inferior para no tapar con BottomNav */}      
      <Routes>
        <Route path="/" element={<Layout/>}>

          <Route index element={<Resumen/>}/>
          <Route path='/registrar' element={<Registro/>}/>

        </Route>
      </Routes>
    </div>
  );
}

export default App;