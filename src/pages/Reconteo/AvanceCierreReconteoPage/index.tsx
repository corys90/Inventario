import { useState } from "react";
import { Accordion, Button, Container} from "react-bootstrap";
import { FaCalendarAlt, FaDownload, FaEye, FaTimesCircle, FaTruck } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import SelectAlmacenes from "../../../components/Almacenes";
import SelectCentro from "../../../components/Centros";
import { httpApiGetText, httpApiPostText } from "../../../lib";
import { SetDataTable } from "../../../redux/store/Actions";
import * as env from '../../../env';
import DataTable from "react-data-table-component";
import LocalMsgModalSpinner from "../../../components/LocalMsgModalSpinner";
import MsgModalAvanceYcierreReconteo from "./MsgModalAvanceYcierreReconteo";
import MsgDialogEspecial from "../../../components/MsgDialogEspecial";
import MsgModalDialogEspecial from "../../../components/MsgModalDialogEspecial";
import BarraMenuHz from "../../../components/BarraMenoHz";

const bd = {
    Pais:"",
    Anno:"",
    Mes:"",
    Centro: "",
    Almacen:"",
    Reconteo_ref:"",
    Publicado_usuario:""
}

const AvanceCierreReconteoPage = () =>{

    const [body, setBody] = useState(bd);  
    const [hbltBtnAbrir, setHbltBtnAbrir] = useState(true);
    const [sHCarga, setSHCarga] = useState(false);
    const [msgDlgShowApiResponse, setMsgDlgShowApiResponse] = useState(false);
    const [msgDlgShowGen, setMsgDlgShowGen] = useState(false);    
    const [msgRespuestInv, setMsgRespuestInv] = useState("");
    let dt: any = useSelector((state: any) => state.datatable); 
    let [formData, setFormData] = useState({ Pais: "CL", Anno: "", Mes: "", Centro: "", Almacen: ""});
    const dispatch = useDispatch();  
    const [records, setRecords] = useState([]); 
    const [showModalProductos, setShowModalProductos] = useState(false);
    const [filaData, setFilaData] = useState();
    const [varGenerica, setVarGenerica] = useState(0);

    let columns = [
        { name: "Id", selector: (row:any) => row.Reconteo_ref, sortable: true},
        { name: "Fecha Creación", selector: (row:any) => row.Bajada_saldos, sortable: true, grow: 4},
        { name: "Usuario Creación", selector: (row:any) => row.Bajada_usuario, grow: 4},
        { name: "Fecha Publicación", selector: (row:any) => row.Publicado_fecha,  sortable: true, grow: 4},
        { name: "Usuario Publicación", selector: (row:any) => row.Publicado_usuario, right:true, grow: 2}, 
        { name: "Centro", selector: (row:any) => row.Centro, sortable: true, right:true},
        { name: "Almacen", selector: (row:any) => row.Almacen, sortable: true, right:true, grow: 2},
        { name: "Estado", selector: (row:any) => row.Estado_inv, right:true},
        { name: "Acciones", selector: (row:any) => row.Acciones, grow: 3},
    ]

    const pagOptions = {
        rowsPerPageText: "Filas por páginas",
        rangeSeparatorText: "de",
        selectAllRowsItem: true,
        selectAllRowsItemText: "Todos"
    };      

    const ValidaBtnFiltrat = () => {
        if ((formData.Anno !== "") &&
            (formData.Almacen !== "") && 
            (formData.Centro !== "")){
                setHbltBtnAbrir(false);
        }else{
                setHbltBtnAbrir(true);
        }
    }    

    const hndlrPeriodo = async (evnt: any) =>{

        const f: Date = evnt.target.value; 
        const yy = f.toString().split('-')[0];
        const mm = f.toString().split('-')[1];
        formData = {...formData, Anno: yy, Mes: mm};
        setFormData(formData);
        ValidaBtnFiltrat(); 
    }

    const AbreModalproductosReconteo = (idx: number) => {
        console.log("Fila: ", dt[idx] );
        setFilaData(dt[idx]);
        setShowModalProductos(true);
    }    

    const Cierre = (idx: number)=>{
        setVarGenerica(1);
        setMsgDlgShowGen(true);
        setBody(dt[idx]); 
    }

    const Elimina = (idx: number)=>{
        setVarGenerica(2);
        setMsgDlgShowGen(true);
        setBody(dt[idx]); 
    }   
    
    const btnSiCerraReconteo = async()=>{
        setMsgDlgShowGen(false);
        setSHCarga(true);
        const bdy = {
            Pais:"CL",
            Anno:body.Anno,
            Mes:body.Mes,
            Centro: body.Centro,
            Almacen:body.Almacen,
            Reconteo_ref:body.Reconteo_ref,
            Publicado_usuario:body.Publicado_usuario            
        };
        const recurso = `${env.REACT_APP_API_URL_DEV}/api/Reconteos`;     
        const response = await httpApiPostText(recurso,"PUT", {
            'Content-Type': 'application/json',
            'Rosen-API-Key': '2B89CE9E-47DF-4EF1-8353-CF0C18EE029F',
            'Rosen-API-Secret': 'EFCFA469-8474-4DCF-B84A-CB1B0835ABDA-CDDC8DDB-6E6E-47CB-9422-B8A4312EC01A',
        }, bdy);
        setSHCarga(false);
        const arrDta = await JSON.parse(response.message); 
        setMsgDlgShowApiResponse(true);
        setMsgRespuestInv(arrDta);
        
    }

    const btnEliminarReconteo = async()=>{
        setMsgDlgShowGen(false);
        setSHCarga(true);
        const bdy = {
            Pais:"CL",
            Anno:body.Anno,
            Mes:body.Mes,
            Centro: body.Centro,
            Almacen:body.Almacen,
            Reconteo_ref:body.Reconteo_ref,          
        };
        const recurso = `${env.REACT_APP_API_URL_DEV}/api/Reconteos`;     
        const response = await httpApiPostText(recurso,"DELETE", {
            'Content-Type': 'application/json',
            'Rosen-API-Key': '2B89CE9E-47DF-4EF1-8353-CF0C18EE029F',
            'Rosen-API-Secret': 'EFCFA469-8474-4DCF-B84A-CB1B0835ABDA-CDDC8DDB-6E6E-47CB-9422-B8A4312EC01A',
        }, bdy);
        setSHCarga(false);
        const arrDta = await JSON.parse(response.message); 
        if (response.code >= 400){
            setMsgRespuestInv(arrDta.Message);
        }else{
            setMsgRespuestInv("Proceso Ok.");
        }
        setMsgDlgShowApiResponse(true);        
    }   

    const hndlrBtnFiltrar = async () =>{
        setSHCarga(true);
        const recurso = `${env.REACT_APP_API_URL_DEV}/api/Reconteos?Pais=CL&Anno=${formData.Anno}&Mes=${formData.Mes}&Centro=${formData.Centro}&Almacen=${formData.Almacen}&Estado_inv=&Bajada_estado=`;     
        const response = await httpApiGetText(recurso,{
            'Content-Type': 'application/json',
            'Rosen-API-Key': '2B89CE9E-47DF-4EF1-8353-CF0C18EE029F',
            'Rosen-API-Secret': 'EFCFA469-8474-4DCF-B84A-CB1B0835ABDA-CDDC8DDB-6E6E-47CB-9422-B8A4312EC01A',
        });
        setSHCarga(false);
        const arrDta = await JSON.parse(response.message);
        const auxDta:any = [];
        if (response.code >= 400){
            setMsgRespuestInv(arrDta.Message);
            setMsgDlgShowApiResponse(true);
            dt = [...auxDta];
            dispatch(SetDataTable(dt));
            setRecords(auxDta);              
        }
        else{
            if (arrDta.length > 0){  
                arrDta.map((valor: any, index: number)=>{
                    const newObj = {
                        ...valor, 
                        Acciones:<div  className=' d-flex gap-1' >
                                    <a href="#!" id={`${index}`} onClick={(obj: any)=>{
                                                    AbreModalproductosReconteo(index);
                                                }}>
                                                <FaEye title="Ver" color={'white'}  className='bg-success rounded-circle p-1 h4'/>   
                                    </a>                            
                                    {(valor.Estado_inv === "A") 
                                        ?   <a href="#!" id={`${index}`}  onClick={(obj: any)=>{
                                                Cierre(index);
                                            }}>
                                                <FaDownload title="Cierre" color={'white'}  className=' bg-primary rounded-circle p-1 h4'/>  
                                            </a>
                                            : null }                                                                       
                                    <a href="#!" id={`${index}`}  onClick={(obj: any)=>{
                                            Elimina(index);
                                        }} >
                                        <FaTimesCircle title="Eliminar" color={'white'}   className='bg-danger rounded-circle p-1 h4'/>
                                    </a>   
                                </div>
                    }
                    auxDta.push(newObj);
                }); 
                //********Pasa el objeto a arreglo para recorrido en table
                dt = [...auxDta];
                dispatch(SetDataTable(dt));
                setRecords(auxDta);      
            }else{

            }       
        }
    }

    const hndlrOpcionCentro = (evnt: any) =>{
        formData = {...formData, [evnt.target.id]: evnt.target.value.split("-")[0].trim()};
        setFormData(formData); 
        ValidaBtnFiltrat();   
    }

    const hndlrOpcionAlmacen = (evnt: any) =>{
        formData = {...formData, [evnt.target.id]: evnt.target.value.split("-")[0].trim()};
        setFormData(formData); 
        ValidaBtnFiltrat();                  
    }

    return(
        <Container fluid>
            <BarraMenuHz/>  
            <div >
                <div className="text-primary ms-3 mt-3">
                        Home / Reconteo / Avance y Cierre de Reconteo
                </div>
                <div className="h4 mt-4 mb-4 ms-3">AVANCE Y CIERRE DE RECONTEO</div>
            </div> 
            <Container fluid>                
                <Accordion  className="mb-4" defaultActiveKey={['0']} alwaysOpen>
                    <Accordion.Item eventKey="0" className="border shadow ">
                        <Accordion.Header><div className=" h5 text-dark">PARÁMETROS RECONTEO</div></Accordion.Header>
                        <Accordion.Body>
                        <label className="h6 mb-3">Recuerda completar todos los campos con *</label> 
                            <div className="align-middle">
                                <FaCalendarAlt className="h5" /> 
                                <label className="ms-2 h4 ">Periodo</label>
                            </div>
                            <hr className="t-0 m-0 mb-3" />

                            <div  className="d-flex flex-column w-50">
                                <label className="m-2 ">Mes/Año</label>
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
                                    <label className="form-label">Seleccionar Centro de distribución</label>    
                                    <div><SelectCentro id="Centro" OnSeleccion={hndlrOpcionCentro}/></div>
                                </Container>
                                <Container fluid className="mb-3  col-md-12 col-lg-6" >
                                    <label className="form-label">Seleccionar Almacen </label>    
                                    <div ><SelectAlmacenes id="Almacen" centro={formData.Centro}  OnSeleccion={hndlrOpcionAlmacen} /></div>
                                </Container>
                            </div>

                            <div className="text-end">
                                <Button type="button" className=" btn border border-0" 
                                    disabled={hbltBtnAbrir}  onClick={()=>hndlrBtnFiltrar()} style={{backgroundColor: "#00B5B8"}}
                                >
                                    Filtrar
                                </Button>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>         

                <Accordion className="mt-1" defaultActiveKey={['0']} alwaysOpen>
                    <Accordion.Item eventKey="0" className="border shadow ">
                        <Accordion.Header><div className=" h5 text-dark">RECONTEOS</div></Accordion.Header>
                        <Accordion.Body>
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
                            />  
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>  
            </Container>
            <MsgModalAvanceYcierreReconteo
                Show={showModalProductos}
                Title="Productos del Reconteo"
                BtnOkName="Aceptar"
                BtnNokName=""
                data={filaData}
                HandlerClickOk={()=>setShowModalProductos(false)}
                HanlerdClickNok={()=>null}
            />

            <MsgDialogEspecial
                    Show={msgDlgShowGen}
                    Title={`Consultas - Reconteo`}
                    Icon="!"
                    Message={ (varGenerica === 1) 
                               ? "¿Esta seguro que desea cerrar éste reconteo?"
                               : "¿Esta seguro que desea eliminar éste reconteo??"
                            }
                    BtnOkName={(varGenerica === 1) 
                                ? "Cerrar Reconteo"
                                : "Eliminar Reconteo"
                            }
                    BtnNokName="Cancelar"
                    HandlerClickOk={(varGenerica === 1) 
                                     ? btnSiCerraReconteo
                                     : btnEliminarReconteo
                                   }
                    HanlerdClickNok={()=>setMsgDlgShowGen(false)}
                    body={body}
            />    
            {/*********** cuadro de dialogo para msj de api **********/}
            <MsgModalDialogEspecial
                Show={msgDlgShowApiResponse}
                Title={`Consultas Reconteo`}
                Icon="x"
                Message={msgRespuestInv}
                BtnOkName="Aceptar"
                BtnNokName=""
                HandlerClickOk={()=>setMsgDlgShowApiResponse(false)}
                HanlerdClickNok={null}
            />                      
            <LocalMsgModalSpinner 
                Show={sHCarga}
                text="Un momento porfavor, procesando..."
                color="#FF7588"
            />              
        </Container>
    );
}

export default AvanceCierreReconteoPage;