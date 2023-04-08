import { useState } from "react";
import { Accordion, Button, Container, Form } from "react-bootstrap";
import { FaCalendarAlt, FaDownload, FaRegFolderOpen, FaTimesCircle, FaTruck, FaUpload } from "react-icons/fa";
import { useSelector } from "react-redux";
import SelectAlmacenes from "../../../components/Almacenes";
import SelectCentro from "../../../components/Centros";
import LocalMsgModalSpinner from "../../../components/LocalMsgModalSpinner";
import MsgDialog from "../../../components/MsgDialog";
import { httpApiGetText, httpApiPostText } from "../../../lib";
import * as env from '../../../env';
import './style.css';
import DescargaSaldos from "./DescargaSaldos";
import MsgDialogEspecial from "../../../components/MsgDialogEspecial";
import MsgModalDialogEspecial from "../../../components/MsgModalDialogEspecial";
import DataTable from "react-data-table-component";
import BarraMenuHz from "../../../components/BarraMenoHz";
   
const GestionInventarioPage = () =>{

    const [records, setRecords] = useState([]);
    const [cpRecords, setCpRecords] = useState([]);    
    let   [varGenerica, setVarGenerica] = useState(0);
    const [body, setBody] = useState({});  
    const [msgDlgShowGen, setMsgDlgShowGen] = useState(false);  
    const [msgDlgShow, setMsgDlgShow] = useState(false);  
    const [msgShowSinItems, setMsgShowSinItems] = useState(false);  
    const [msgDlgShowDescarga, setMsgDlgShowDescarga] = useState(false);       
    const [msgDlgShowApiResponse, setMsgDlgShowApiResponse] = useState(false);    
    const [msgRespuestInv, setMsgRespuestInv] = useState("");    
    const [sHCarga, setSHCarga] = useState(false);
    const [msgDlgShowError, setMsgDlgShowError] = useState(false); 
    const [btnDescargaSaldos, setBtnDescargaSaldos] = useState(true);
    const [msgDescargaMasiva, setMsgDescargaMasiva] = useState(false);       
    const emp: any = useSelector((state: any) => state.emp); 
    let   [dtSelected, setDtSelected]  = useState([]);        
    const [datosDS, setDatosDS] = useState([]);                              
    let   [formData, setFormData] = useState({ Pais: "CL", Anno: "", Mes: "", Centro: "", Almacen: "", Subinventario: "",
                                            Estado_inv:"", Bajada_saldos:"", Bajada_usuario:"",  Bajada_estado:"", Publicado_estado:"",
                                            Publicado_fecha:"",  Publicado_usuario:"", Usuario_apertura: "",
                                           });

    let columns = [
        { name: "Centro", selector: (row:any) => row.Centro, sortable: true},
        { name: "Almacen", selector: (row:any) => row.Almacen, sortable: true},
        { name: "Estado", selector: (row:any) => row.Estado_inv},
        { name: "Ult. Fecha Bajada", selector: (row:any) => row.Bajada_saldos,  sortable: true},
        { name: "Usuario Bajada", selector: (row:any) => row.Bajada_usuario}, 
        { name: "Fecha de Publicación", selector: (row:any) => row.Publicado_fecha, sortable: true},
        { name: "Publicador", selector: (row:any) => row.Publicado_usuario, sortable: true},
        { name: "Apertura", selector: (row:any) => row.Usuario_apertura},
        { name: "Sub Inventario", selector: (row:any) => row.Subinventario,  sortable: true},
        { name: "Acciones", selector: (row:any) => row.Acciones, grow:1},         
    ]

    const pagOptions = {
        rowsPerPageText: "Filas por páginas",
        rangeSeparatorText: "de",
        selectAllRowsItem: true,
        selectAllRowsItemText: "Todos"
    };

    //*** Acciones de botones de Mensaje de dialogo abrir periodo ********* */
    const cargarGrilla = async () =>{

        //*******todos los centros*********//
        let cnts = "";
        emp.centros.map((cnt: string)=> cnts += cnt.split("-")[0].trim() + "|" );
        cnts = cnts.substring(0, cnts.length-1);
        //*******todos los almacenes*********//
        let almc = "";
        emp.almacenes.map((alm: string)=> almc += alm.split("-")[0].trim() + "|" );
        almc = almc.substring(0, almc.length-1);        

        const recurso = `${env.REACT_APP_API_URL_DEV}/api/Periodo?pais=CL&anno=${formData.Anno}&mes=${formData.Mes}&centros=${cnts}&almacenes=${almc}`;     
        const response = await httpApiGetText(recurso, {
            'Content-Type': 'application/json',
            'Rosen-API-Key': `${env.REACT_APP_Rosen_API_Key}`,
            'Rosen-API-Secret': `${env.REACT_APP_Rosen_API_Secret}`,
        });
        const arrDta = await JSON.parse(response.message);
        const auxDta:any = [];
        arrDta.map((obj: any, index: number)=>{
            const newObj = {
                ...obj, 
                Acciones: (obj.Estado_inv !== "C") ? <div  className=' d-flex gap-1' >
                                                        <a href="#!" id={`${index}`} onClick={()=>{
                                                                publicarInventario(obj)
                                                            }}>
                                                            <FaUpload title="Publicar inventario" color={'white'}  className='bg-success rounded-circle p-1 h4'/>   
                                                        </a>                               
                                                        <a href="#!" id={`${index}`}  onClick={()=>{
                                                                descargaSaldos(obj);
                                                            }}>
                                                            <FaDownload title="Descarga saldos" color={'white'}  className=' bg-primary rounded-circle p-1 h4'/>  
                                                        </a>                                                                       
                                                        <a href="#!" id={`${index}`}  onClick={()=>{
                                                                borrarPeriodo(obj);
                                                            }} >
                                                            <FaTimesCircle title="Elimina período" color={'white'}   className='bg-danger rounded-circle p-1 h4'/>
                                                        </a>   
                                                    </div>
                                                    : null
            };
            auxDta.push(newObj);
        });
        //********Pasa el objeto a arreglo para recorrido en table
        setRecords(auxDta);
        setCpRecords(auxDta);
    }

    const hndlrPeriodo = async (evnt: any) =>{

        const f: Date = evnt.target.value; 
        const yy = f.toString().split('-')[0];
        const mm = f.toString().split('-')[1];
        formData = {...formData, Anno: yy, Mes: mm};
        setFormData(formData);
        cargarGrilla();           
    }  

    const hndlrOpcionCentro = (evnt: any) =>{
        formData = {...formData, [evnt.target.id]: evnt.target.value.split("-")[0].trim()};
        setFormData(formData);    
    }

    const hndlrOpcionAlmacen = (evnt: any) =>{
        formData = {...formData, [evnt.target.id]: evnt.target.value.split("-")[0].trim()};
        setFormData(formData);    
    }   
    
    const changeText = (evnt: any) => {
        formData = {...formData, [evnt.target.id]: evnt.target.value.trim()}
        setFormData(formData);      
    }  
    
    const changeTextFiltro = (evnt: any) => {
        if (evnt.target.value.trim() === ""){
          setRecords([...cpRecords]);  
        }else{
            let reg = cpRecords.filter((dato: any)=> {
                return dato.Centro.includes(evnt.target.value) || dato.Usuario_apertura.includes(evnt.target.value) || dato.Almacen.includes(evnt.target.value)
            });  
            setRecords([...reg]);              
        }
    }      

    const hndlrBtnAbrir = (evnt: any) => {
        formData = {...formData, Usuario_apertura: emp.user};
        setFormData(formData);
        if ( (formData.Centro === "") ||
             (formData.Almacen === "") ||
             (formData.Anno === "") ||
             (formData.Subinventario === "")){
                setMsgDlgShowError(true);
        }else{
            setMsgDlgShow(true); 
        } 
    } 
    
    const MsgDlghandlerOk = () =>{
        setMsgDlgShowError(false);
    }

    const MsgDlghandlerResponseApi = () =>{
        setMsgDlgShowApiResponse(false);
    }  
    
    const handlerOk = async () =>{
        setMsgDlgShow(false);
        setSHCarga(true);
        const recurso = `${env.REACT_APP_API_URL_DEV}/api/Periodo`;     
        const data = await httpApiPostText(recurso, "POST", {
            'Content-Type': 'application/json',
            'Rosen-API-Key': `${env.REACT_APP_Rosen_API_Key}`,
            'Rosen-API-Secret': `${env.REACT_APP_Rosen_API_Secret}`,
        }, formData);
        const dt = await (data);
        const msg = JSON.parse(data.message)
        if (dt.code >= 400){
            setMsgRespuestInv(msg.Message);
            setMsgDlgShowApiResponse(true);
        }else{
            setMsgRespuestInv("Período abierto con éxito!!!");
            setMsgDlgShowApiResponse(true);            
        }    
        setSHCarga(false); 
        cargarGrilla();        
    }

    const handlerNOk = () =>{
        setMsgDlgShow(false);
    }   

    const descargarSaldosMasivos = ()=>{
        setMsgDescargaMasiva(false)
        setMsgDlgShowDescarga(true); 
    }

    const onBtnDescargaSaldos = () =>{
        if (dtSelected.length > 0){
            setDatosDS(dtSelected);
            setMsgDescargaMasiva(true);
        }else{
            setMsgShowSinItems(true);
        }
    }  

    const arrConSlasdosDescargar = (arr: any) =>{
        setDtSelected(arr.selectedRows);
        if (arr.selectedRows.length > 0)  {
            setBtnDescargaSaldos(false);
        }else{
            setBtnDescargaSaldos(true);            
        }
    }

    const MsgDlghandlerDescarga = (arrDta: any) =>{

        setMsgDlgShowDescarga(false);

    }  
    
    const btnSiPublicaInventario = async (bdy:any) => {
        bdy = {...bdy, Publicado_usuario: emp.user.toUpperCase()};
        setMsgDlgShowGen(false);
        setSHCarga(true);
        /**************************************/
        const recurso = `${env.REACT_APP_API_URL_DEV}/api/PublicacionInventario`;     
        const response = await httpApiPostText(recurso, "POST", {
            'Content-Type': 'application/json',
            'Rosen-API-Key': `${env.REACT_APP_Rosen_API_Key}`,
            'Rosen-API-Secret': `${env.REACT_APP_Rosen_API_Secret}`,
        }, bdy);
        const arrDta = await JSON.parse(response.message);
        setSHCarga(false);
        setMsgRespuestInv(arrDta.Message);
        setMsgDlgShowApiResponse(true);
        cargarGrilla();
    } 

    const publicarInventario = async (bdy: any)=>{
        setVarGenerica(1);
        setMsgDlgShowGen(true);
        setBody(bdy);       
    }

   const btnDescargaSaldosInventario = async (bdy:any) => {

        setMsgDlgShowGen(false);
        setSHCarga(true);
        /**************************************/
        const recurso = `${env.REACT_APP_API_URL_DEV}/api/Inventario`;     
        const response = await httpApiPostText(recurso, "POST", {
            'Content-Type': 'application/json',
            'Rosen-API-Key': `${env.REACT_APP_Rosen_API_Key}`,
            'Rosen-API-Secret': `${env.REACT_APP_Rosen_API_Secret}`,
        }, bdy);
        const arrDta = await JSON.parse(response.message);
        setSHCarga(false);
        setMsgRespuestInv(arrDta.Message);
        setMsgDlgShowApiResponse(true);
        cargarGrilla();        
    } 
    
    const descargaSaldos = async (bdy: any)=>{
        setVarGenerica(2);
        setMsgDlgShowGen(true);
        setBody(bdy);     
    }    

    const btnBorrarPeriodo = async (bdy:any) => {
        setMsgDlgShowGen(false);
        setSHCarga(true);
        /**************************************/
        const recurso = `${env.REACT_APP_API_URL_DEV}/api/Periodo`;     
        const response = await httpApiPostText(recurso, "DELETE", {
            'Content-Type': 'application/json',
            'Rosen-API-Key': `${env.REACT_APP_Rosen_API_Key}`,
            'Rosen-API-Secret': `${env.REACT_APP_Rosen_API_Secret}`,
        }, bdy);
        const arrDta = await JSON.parse(response.message);
        setSHCarga(false);
        setMsgRespuestInv(arrDta);
        setMsgDlgShowApiResponse(true);
        cargarGrilla();
    } 
    
    const borrarPeriodo = async (bdy:any)=>{
        setVarGenerica(3);
        setMsgDlgShowGen(true);
        setBody(bdy);  
    }   
    
     const handlerPreguntaGenericaNOk = () =>{
        setMsgDlgShowGen(false);
    }    

    return(
        <>
            <Container fluid>
            <BarraMenuHz/>  
                <Container fluid>
                    <div >
                        <div className="text-primary mt-3">
                            Home / Inventario / Gestión Inventario
                        </div>
                        <div className="h4 mt-4 mb-4">GESTIONAR INVENTARIO</div>
                    </div>
                    <Accordion  className="mb-4" defaultActiveKey={['0']} alwaysOpen>
                        <Accordion.Item eventKey="0" className="border shadow ">
                            <Accordion.Header><div className=" h5 text-dark">PARÁMETROS INVENTARIO</div></Accordion.Header>
                            <Accordion.Body>
                                <label className="h6 mb-3">Recuerda completar todos los campos con *</label> 
                                <div className="align-middle">
                                    <FaCalendarAlt className="h5" /> 
                                    <label className="ms-2 h4 ">Periodo</label>
                                </div>
                                <hr className="t-0 m-0 mb-3" />

                                <div  className="d-flex flex-column col-6">
                                    <label className="m-2 ">Mes/Año *</label>
                                    <input type="month" id="periodo" size={8}  className="ms-2"
                                        onChange={hndlrPeriodo}
                                        value={`${formData.Anno}-${formData.Mes}`} 
                                        min="1990-01" max="9999-12"
                                    />
                                </div>
                                <div className="align-middle mt-4">
                                    <FaTruck className="h5" /> 
                                    <label className="ms-2 h4 ">Centro y Almacen</label>
                                </div>
                                <hr className="t-0 m-0 mb-3" /> 

                                <div className="row d-flex flex-row mb-3">
                                    <Container fluid className="mb-3 col-md-12 col-lg-6" >
                                        <label className="form-label">Seleccionar Centro de distribución *</label>    
                                        <div><SelectCentro id="Centro" OnSeleccion={hndlrOpcionCentro}/></div>
                                    </Container>
                                    <Container fluid className="mb-3  col-md-12 col-lg-6" >
                                        <label className="form-label">Seleccionar Almacen *</label>    
                                        <div ><SelectAlmacenes id="Almacen"  centro={formData.Centro}  OnSeleccion={hndlrOpcionAlmacen} /></div>
                                    </Container>
                                </div>

                                <div className="align-middle mt-4">
                                    <FaTruck className="h5" /> 
                                    <label className="ms-2 h4 ">Sub Inventario</label>
                                </div>
                                <hr className="t-0 m-0 mb-3 w-50" /> 

                                <div className="mt-3 mb-5 col-md-12 col-lg-6" >
                                    <label className="form-label">Seleccionar Sub Inventario *</label>    
                                    <div >
                                    <Form.Select value={formData.Subinventario} aria-label="Default select example"  id="Subinventario"  onChange={(e)=>changeText(e)}>
                                        <option value="">Seleccione una opción</option>
                                        <option value="S">Si</option>
                                        <option value="N">No</option>
                                    </Form.Select>
                                    </div>
                                </div>
                                <hr className="t-0 m-0 mb-4 mt-4" />

                                <div className="text-end ">
                                    <Button type="button" style={{backgroundColor:"#00B5B8"}} className="border-0" onClick={hndlrBtnAbrir} >
                                        <FaRegFolderOpen className="h6 m-2"/>Abrir
                                    </Button>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>         

                    <Accordion className="mt-1" defaultActiveKey={['0']} alwaysOpen>
                        <Accordion.Item eventKey="0" className="border shadow ">
                            <Accordion.Header><div className=" h5 text-dark">INVENTARIO</div></Accordion.Header>
                            <Accordion.Body>
                                <div className="text-end mb-4">
                                    <Button type="button"  className={`ms-1 border-0`} style={{backgroundColor:"#16D39A"}} onClick={()=>onBtnDescargaSaldos()}
                                        /* disabled={btnDescargaSaldos} */
                                    >
                                        <FaDownload className="h6 m-2"/>Descargar Saldos
                                    </Button>
                                </div>     
                                <div className="d-flex flex-column col col-lg-4 mb-3">
                                        <label className="m-1">Filtro</label>
                                        <input type="text" id="txtBuscar" className="form-control m-1" onChange={changeTextFiltro} />
                                </div>                                                           
                                <DataTable
                                    columns={columns}
                                    data={records}
                                    selectableRows
                                    selectableRowsHighlight
                                    fixedHeader
                                    pagination
                                    highlightOnHover
                                    fixedHeaderScrollHeight="600px"
                                    paginationComponentOptions={pagOptions}
                                    onSelectedRowsChange={(e: any)=>arrConSlasdosDescargar(e)}
                                />
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion> 
                </Container> 
                {/*********** seccion de modales **********************/}
                {/*********** cuadro de dialogo para errores **********/}
                <MsgModalDialogEspecial
                    Show={msgDlgShowError}
                    Title={`Gestión inventario`}
                    Icon="x"
                    Message="Importante: los campos con (*) son obligatorios. Verifíquelos por favor!!!"
                    BtnOkName="Aceptar"
                    BtnNokName=""
                    HandlerClickOk={MsgDlghandlerOk}
                    HanlerdClickNok={null}
                />   
                <MsgModalDialogEspecial
                    Show={msgShowSinItems}
                    Title={`Gestión inventario`}
                    Icon="x"
                    Message="Importante: No hay registros seleccionados para realizar descarga masiva de saldos."
                    BtnOkName="Aceptar"
                    BtnNokName=""
                    HandlerClickOk={()=>setMsgShowSinItems(false)}
                    HanlerdClickNok={null}
                />    
                {/*********** cuadro de dialogo para pregunta de descarga masiva de saldos **********/}
                <MsgModalDialogEspecial
                    Show={msgDescargaMasiva}
                    Title={`Gestión inventario`}
                    Icon="!"
                    Message={`¿Desea descargar estos saldos? Se descargaran los saldos seleccionados. \n Este proceso puede demorar bastante. Por favor espere...`}
                    BtnOkName="Sí, descargar"
                    BtnNokName="No, cancelar"
                    HandlerClickOk={()=>descargarSaldosMasivos()}
                    HanlerdClickNok={()=>setMsgDescargaMasiva(false)}
                />                                                                      
                {/*********** cuadro de dialogo para pregunta de apertura de inventario**********/}
                <MsgDialog
                    Show={msgDlgShow}
                    Title={`Gestión inventario`}
                    Icon="!"
                    Message="Se abrirá este período de inventario. ¿Desea abrirlo?"
                    BtnOkName="Sí, Abrir"
                    BtnNokName="No, cancelar"
                    HandlerClickOk={handlerOk}
                    HanlerdClickNok={handlerNOk}
                />
                {/*********** cuadro de dialogo para pregunta genérica**********/}
                <MsgDialogEspecial
                    Show={msgDlgShowGen}
                    Title={`Gestión inventario`}
                    Icon="!"
                    Message={ (varGenerica === 1) 
                               ? "¿Desea publicar este inventario?"
                               : (varGenerica === 2)
                                 ? "¿Desea descargar este inventario? Este proceso puede tardar algunos minutos. Por favor espere."
                                 : "¿Desea cerrar el período?"
                            }
                    BtnOkName={(varGenerica === 1) 
                                ? "Sí. Publicar"
                                : (varGenerica === 2)
                                  ? "Sí. Descargar"
                                  : "Sí. Cerrar"
                            }
                    BtnNokName="No, cancelar"
                    HandlerClickOk={(varGenerica === 1) 
                                     ? btnSiPublicaInventario
                                    : (varGenerica === 2)
                                        ? btnDescargaSaldosInventario
                                        : btnBorrarPeriodo
                                   }
                    HanlerdClickNok={handlerPreguntaGenericaNOk}
                    body={body}
                />                
                {/*********** cuadro de dialogo para msj de api **********/}
                <MsgModalDialogEspecial
                    Show={msgDlgShowApiResponse}
                    Title={`Gestión inventario`}
                    Icon="x"
                    Message={msgRespuestInv}
                    BtnOkName="Aceptar"
                    BtnNokName=""
                    HandlerClickOk={MsgDlghandlerResponseApi}
                    HanlerdClickNok={null}
                />   
                
                {/*********** cuadro de dialogo para descarga saldos **********/}
                <DescargaSaldos
                    Show={msgDlgShowDescarga}
                    Title="Descarga de saldos"
                    Icon="x"
                    Message="Descarga de saldos en proceso..."
                    BtnOkName="Salir"
                    BtnNokName=""
                    HandlerClickOk={MsgDlghandlerDescarga}
                    HanlerdClickNok={null}
                    data={datosDS}
                    Anno={formData.Anno}
                    Mes={formData.Mes}
                />
                <LocalMsgModalSpinner 
                    Show={sHCarga}
                    text="Un momento por favor, procesando..."
                    color="#FF7588"
                />                 
            </Container>
        </>
    );
}

export default GestionInventarioPage;
