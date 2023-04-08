import { useDispatch, useSelector } from "react-redux";
import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { FaBarcode, FaBoxOpen, FaClipboardList, FaCloudDownloadAlt, FaFlask, FaFolder, FaListOl, FaPowerOff, FaPrint, FaQuestion, FaRegCalendarAlt, FaRegChartBar, FaShareAltSquare, FaWarehouse } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import './style.css';
import { SetEntornoEmp } from "../../redux/store/Actions";
import { useEffect } from "react";

const logo = require('./logo.png');

const BarraMenu = () =>{

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const emp: any = useSelector((state: any) => state.emp);

    useEffect(() => {

        if (emp.user === "") {
          navigate('/');
        }

      }, []);

    const hndlrSalir = () =>{
        dispatch(SetEntornoEmp({pais:"", user:""}));
        navigate('/');
    }

    return(
        <div className="container-fluid">
            <Navbar bg="light" expand="lg" className=" navbar-dark ">
                <Container fluid className=" shadow rounded" style={{backgroundColor:"#404E67"}}>
                    <Navbar.Brand href="#!" className=" " >
                        <img src={logo} alt="" width={150} className="img-fluid alert  alert-danger border rounded"/>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px', color:"white"}}
                        >
                            <div className="d-flex flex-row align-items-center gap-1 me-3 ">
                                <FaWarehouse />
                                <NavDropdown title="Dashboard">
                                    <NavDropdown.Item >
                                        <Link to="/dashboard" className="text-decoration-none me-2"  key={0}>Dashboard</Link>
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </div>

                            <div className="d-flex flex-row align-items-center gap-1 me-3 "> 
                                <FaPrint />    
                                <NavDropdown title="Impresiones" id="navbarScrollingDropdown">
                                    <NavDropdown.Item >
                                        <div className="d-flex flex-row align-items-center gap-1">
                                            <FaBarcode />
                                            <Link to="/impresiones/etiquetas" className="text-decoration-none me-2"  key={1}>Etiqueta sin referencias</Link>
                                        </div>
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </div>

                            <div className="d-flex flex-row align-items-center gap-1 me-3 ">
                                <FaClipboardList />  
                                <NavDropdown title="Inventario" id="navbarScrollingDropdown">
                                    <NavDropdown.Item href="#!">
                                        <div className="d-flex flex-row align-items-center gap-1">
                                            <FaShareAltSquare />
                                            <Link to="/inventario/gestioninventario" className="text-decoration-none me-2"  key={2}>Gestión Inventario</Link>
                                        </div> 
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="#!">
                                        <div className="d-flex flex-row align-items-center gap-1">
                                            <FaShareAltSquare />                                        
                                            <Link to="/inventario/gestionsubinventario" className="text-decoration-none me-2"  key={3}>Gestión Sub-inventario</Link>
                                        </div>    
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="#!">
                                        <div className="d-flex flex-row align-items-center gap-1">
                                            <FaBarcode />
                                            <Link to="/inventario/tratamiento" className="text-decoration-none me-2"  key={4}>Tratamiento de etiquetas</Link>
                                        </div>
                                    </NavDropdown.Item>                                                
                                </NavDropdown>
                            </div>

                            <div className="d-flex flex-row align-items-center gap-1 me-3 ">
                                <FaQuestion /> 
                                <NavDropdown title="Consultas" id="navbarScrollingDropdown" className="text-decoration-none " style={{color:"red"}}>
                                    <NavDropdown.Item href="#!">
                                        <div className="d-flex flex-row align-items-center gap-1">
                                            <FaShareAltSquare />
                                            <Link to="/consultas/avanceinventario" className="text-decoration-none me-2"  key={5}>Avance Inventario</Link>
                                        </div>    
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="#!">
                                        <div className="d-flex flex-row align-items-center gap-1">
                                            <FaClipboardList />
                                            <Link to="/consultas/reporteinventario" className="text-decoration-none me-2"  key={6}>Reporte Inventario</Link>
                                        </div>                                           
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="#!">
                                        <div className="d-flex flex-row align-items-center gap-1">
                                            <FaRegChartBar />
                                            <Link to="/consultas/informesaldos" className="text-decoration-none me-2"  key={7}>Informe de saldos</Link>
                                        </div>                                            
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="#!">
                                        <div className="d-flex flex-row align-items-center gap-1">
                                            <FaCloudDownloadAlt />
                                            <Link to="/consultas/descargamasiva" className="text-decoration-none me-2"  key={8}>Descarga masiva</Link>
                                        </div>   
                                    </NavDropdown.Item>                                                                        
                                </NavDropdown>
                            </div>    

                            <div className="d-flex flex-row align-items-center gap-1 me-3 ">
                                <FaListOl />
                                <NavDropdown title="Reconteo" id="navbarScrollingDropdown">
                                    <NavDropdown.Item href="#!">
                                        <div className="d-flex flex-row align-items-center gap-1">
                                            <FaBoxOpen />
                                            <Link to="/reconteo/apertura" className="text-decoration-none me-2"  key={9}>Apertura de reconteo</Link>
                                        </div>                                          
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="#!">
                                        <div className="d-flex flex-row align-items-center gap-1">
                                            <FaFolder />
                                            <Link to="/reconteo/avance" className="text-decoration-none me-2"  key={10}>Avance y cierre de reconteo</Link>
                                        </div>   
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </div>

                            <div className="d-flex flex-row align-items-center gap-1 me-3 ">
                                <FaFlask />
                                <NavDropdown title="Muestras" id="navbarScrollingDropdown">
                                    <NavDropdown.Item href="#!">
                                        <div className="d-flex flex-row align-items-center gap-1">
                                            <FaRegCalendarAlt />
                                            <Link to="/muestras/periodo" className="text-decoration-none me-2"  key={11}>Período de Muestras</Link>
                                        </div>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="#!">
                                        <div className="d-flex flex-row align-items-center gap-1">
                                            <FaShareAltSquare />
                                            <Link to="/muestras/avance" className="text-decoration-none me-2"  key={12}>Avance y cierre de Muestras</Link>
                                        </div>                                        
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </div>                                                                               
                        </Nav>
                    </Navbar.Collapse>
                    <div className="d-flex flex-row gap-3 text-light " style={{width:"fit-content"}}>
                        <div className="d-flex flex-column">
                            <div className="">
                                {emp.pais}
                            </div>
                            <div className="">
                                Hola, {emp.user}
                            </div>
                        </div>
                        <div className="">
                            <Button type="button" className="border-0 bg-secondary" onClick={hndlrSalir}><FaPowerOff className="h3 mt-1"/></Button>
                        </div>
                    </div>                      
                </Container>
            </Navbar>
        </div>             
    )
};

export default BarraMenu;