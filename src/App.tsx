import  'bootstrap/dist/css/bootstrap.min.css' ;
import AperturaReconteoPage from './pages/Reconteo/AperturaReconteoPage';
import AvanceCierreMuestrasPage from './pages/Muestras/AvanceCierreMuestrasPage';
import AvanceCierreReconteoPage from './pages/Reconteo/AvanceCierreReconteoPage';
import AvanceInventarioPage from './pages/Consultas/AvanceInventarioPage';
import DashboardPage from './pages/DashboardPage';
import DescargaMasivaPage from './pages/Consultas/DescargaMasivaPage';
import GestionInventarioPage from './pages/Inventario/GestionInventarioPage';
import GestionSubInventarioPage from './pages/Inventario/GestionSubInventarioPage';
import InformeSaldosPage from './pages/Consultas/InformeSaldosPage';
import PageLogin from './pages/Login';
import PeriodoMuestrasPage from './pages/Muestras/PeriodoMuestrasPage';
import ReporteInventarioPage from './pages/Consultas/ReporteInventarioPage';
import TratamientoEtiquetaPage from './pages/Inventario/TratamientoEtiquetaPage';
import EtiquetaSinRefPage from './pages/Impresiones/EtiquetaSinRefPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export function App() {

  return (
    <div>
      <BrowserRouter>      
        <Routes>
          <Route path="/muestras/avance" element={<AvanceCierreMuestrasPage />}/> 
          <Route path="/muestras/periodo" element={<PeriodoMuestrasPage />}/> 
          <Route path="/reconteo/avance" element={<AvanceCierreReconteoPage />}/> 
          <Route path="/reconteo/apertura" element={<AperturaReconteoPage /> }/>
          <Route path="/consultas/descargamasiva" element={<DescargaMasivaPage /> }/>
          <Route path="/consultas/informesaldos" element={<InformeSaldosPage /> }/>
          <Route path="/consultas/reporteinventario" element={<ReporteInventarioPage />}/>
          <Route path="/consultas/avanceinventario" element={<AvanceInventarioPage /> }/>
          <Route path="/inventario/tratamiento" element={<TratamientoEtiquetaPage/> }/>
          <Route path="/inventario/gestionsubinventario" element={<GestionSubInventarioPage /> }/>
          <Route path="/inventario/gestioninventario" element={<GestionInventarioPage /> }/>
          <Route path="/impresiones/etiquetas" element={<EtiquetaSinRefPage /> }/>
          <Route path="/dashboard" element={<DashboardPage /> }/>
          <Route path="/" element={<PageLogin />}/>
        </Routes>              
      </BrowserRouter>
    </div>
  );
}

export default App;
