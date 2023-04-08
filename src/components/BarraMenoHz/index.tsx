import { useEffect } from "react";
import { Button} from "react-bootstrap";
import { FaBarcode, FaBoxOpen, FaClipboardList, FaCloudDownloadAlt, FaFlask, FaFolder, FaListOl, FaPowerOff, FaPrint, FaQuestion, FaRegCalendarAlt, FaRegChartBar, FaShareAltSquare, FaWarehouse } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SetEntornoEmp } from "../../redux/store/Actions";
import './style.css';

const logo = require('./logo-rosen2.png');

const BarraMenuHz = () => {
   
    let MisDatos: any;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const emp: any = useSelector((state: any) => state.emp);

    let url: any = useLocation();
    url = url.pathname;

    console.log("mi url: ", url);

    useEffect(() => {

        if (emp.user === "") {
            const ss = sessionStorage.getItem("entorno");
            console.log("Sesión Storage: ", ss);
            if (ss){
                let sesionData = JSON.parse(ss);
                console.log("Sesión Storage: ", sesionData);
                dispatch(SetEntornoEmp({...sesionData}));
            } else{
                navigate('/');  
            }               
        }

    });

    const hndlrSalir = () =>{
        dispatch(SetEntornoEmp({pais:"", user:""}));
        navigate('/');
    }

    
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-light">
            <div className="container-fluid  shadow rounded"  style={{backgroundColor:"#404E67"}}>
                {/* Imagén marca fluida */}
                <div className="m-2" >
                    <a  href="#!">
                        <img src={logo} alt="" width={150} className="img-fluid m-2"/>
                    </a>
                </div>
                {/* Ícono de hamburguesa en modo responsive*/}
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                        {/* Menú Dashboard */} 
                        <li className="nav-item dropdown  me-3 ">
                            <Link to="/dashboard" className="nav-link dropdown-toggle text-decoration-none me-2 d-flex flex-row align-items-center gap-1"  id="navbarDropdownDashboard" role="button" data-bs-toggle="dropdown" aria-expanded="false" key={0}> <FaWarehouse /> Dashboard</Link>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">                               
                                <li><Link className="dropdown-item" to="/dashboard" >Dashboard</Link></li>
                            </ul>    
                        </li>

                        {/* Menú Impresiones*/} 
                        <li className="nav-item dropdown  me-3 ">
                            <Link to="/impresiones/etiquetas" className="nav-link dropdown-toggle text-decoration-none me-2 d-flex flex-row align-items-center gap-1"  id="navbarDropdownReferencia" role="button" data-bs-toggle="dropdown" aria-expanded="false" key={0}> <FaPrint /> Impresiones</Link>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdownReferencia">                               
                                <li><Link className="dropdown-item" to="/impresiones/etiquetas" ><FaBarcode /> Etiqueta sin referencias </Link></li>
                            </ul>    
                        </li>

                        {/* Menú Inventario*/} 
                        <li className="nav-item dropdown  me-3 ">
                            <Link to="#!" className="nav-link dropdown-toggle text-decoration-none me-2 d-flex flex-row align-items-center gap-1"  id="navbarDropdownInventario" role="button" data-bs-toggle="dropdown" aria-expanded="false" key={0}> <FaClipboardList /> Inventario</Link>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdownInventario">                               
                                <li><Link className="dropdown-item" to="/inventario/gestioninventario" ><FaShareAltSquare /> Gestión de inventario </Link></li>
                                <li><Link className="dropdown-item" to="/inventario/gestionsubinventario" ><FaShareAltSquare />  Gestión Sub-inventario </Link></li>
                                <li><Link className="dropdown-item" to="/inventario/tratamiento" ><FaBarcode /> Tratamiento de etiquetas </Link></li>                                                                
                            </ul>    
                        </li>

                        {/* Menú Consultas*/} 
                        <li className="nav-item dropdown  me-3 ">
                            <Link to="#!" className="nav-link dropdown-toggle text-decoration-none me-2 d-flex flex-row align-items-center gap-1"  id="navbarDropdownConsultas" role="button" data-bs-toggle="dropdown" aria-expanded="false" key={0}> <FaQuestion /> Consultas</Link>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdownConsultas">                               
                                <li><Link className="dropdown-item" to="/consultas/avanceinventario" ><FaShareAltSquare /> Avance inventario </Link></li>
                                <li><Link className="dropdown-item" to="/consultas/reporteinventario" ><FaClipboardList />  Reporte inventario </Link></li>
                                <li><Link className="dropdown-item" to="/consultas/informesaldos" ><FaRegChartBar /> Informe de saldos </Link></li>       
                                <li><Link className="dropdown-item" to="/consultas/descargamasiva" ><FaCloudDownloadAlt /> Descarga masiva </Link></li>                                                                                              
                            </ul>    
                        </li>


                        {/* Menú Reconteo*/} 
                        <li className="nav-item dropdown  me-3 ">
                            <Link to="#!" className="nav-link dropdown-toggle text-decoration-none me-2 d-flex flex-row align-items-center gap-1"  id="navbarDropdownReconteo" role="button" data-bs-toggle="dropdown" aria-expanded="false" key={0}> <FaListOl /> Reconteo</Link>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdownReconteo">                               
                                <li><Link className="dropdown-item" to="/reconteo/apertura" ><FaBoxOpen /> Apertura de reconteo</Link></li>
                                <li><Link className="dropdown-item" to="/reconteo/avance" ><FaFolder /> Avance y cierre de reconteo </Link></li>                                                                                          
                            </ul>    
                        </li>


                        {/* Menú Muestras*/} 
                        <li className="nav-item dropdown  me-3 ">
                            <Link to="#!" className="nav-link dropdown-toggle text-decoration-none me-2 d-flex flex-row align-items-center gap-1"  id="navbarDropdownMuestras" role="button" data-bs-toggle="dropdown" aria-expanded="false" key={0}> <FaFlask /> Muestras</Link>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdownMuestras">                               
                                <li><Link className="dropdown-item" to="/muestras/periodo" ><FaRegCalendarAlt /> Período de muestras</Link></li>
                                <li><Link className="dropdown-item" to="/muestras/avance" ><FaShareAltSquare /> Avance y cierre de muestras </Link></li>                                                                                          
                            </ul>    
                        </li>
                    </ul>
                    <div className="d-flex flex-row gap-3 text-light wrap" style={{width:"fit-content"}}>
                        <div className="">
                            <div className="">
                                {emp.pais}
                            </div>
                            <div className="">
                                Hola, {emp.user}
                            </div>
                        </div>
                        <div >
                            <Button type="button" className="border-0 bg-secondary" onClick={hndlrSalir}><FaPowerOff className="h3 mt-1"/></Button>
                        </div>
                    </div>  
                </div>
            </div>
        </nav>        
    );
};

export default BarraMenuHz;