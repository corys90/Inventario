import { useState } from "react";
import { Accordion, Button, Container } from "react-bootstrap";
import SelectAlmacenes from "../../../components/Almacenes";
import SelectCentro from "../../../components/Centros";
import Apertura from "./Apertura";
import Publicacion from "./Publicacion";
import Reporte from "./Reporte";
import Resumen from "./Resumen";
import * as env from '../../../env';
import { httpApiGetText, httpApiPostText } from "../../../lib";
import MsgModalDialogEspecial from "../../../components/MsgModalDialogEspecial";
import LocalMsgModalSpinner from "../../../components/LocalMsgModalSpinner";
import { FaSyncAlt, FaTimesCircle } from "react-icons/fa";
import MostraTodo from "./Resumen/MostraTodo";
import MsgDialog from "../../../components/MsgDialog";
import { useSelector } from "react-redux";
import BarraMenuHz from "../../../components/BarraMenoHz";
 
const rowItemData = {
    Apertura_Fecha   :"",
    Bajada_Saldos    :"",
    Bajada_Usuario   :"",
    Cant_Sku         :"",
    Estado           :"",
    Items_Cuadrados  :"",
    Items_Negativos  :"",
    Items_Positivos  :"",
    Negocio          :"",
    Porc_Cuadratura  :"",
    Publicado_Fecha  :"",
    Publicado_Usuario:"",
    Seleccion        :"",
    Subinventario_Id :"",
    Usuario_Apertura :""
}

const GestionSubInventarioPage = () =>{

    let arrStr: string[] = [];
    const [sHCarga, setSHCarga] = useState(false);
    const [msgMuestraModalArbol, setMsgMuestraModalArbol] = useState(false);    
    const [hbltBtnBuscar, setHbltBtnBuscar] = useState(true);    
    const [msgDlgShowApiResponse, setMsgDlgShowApiResponse] = useState(false);
    const [msgRespuestInv, setMsgRespuestInv] = useState(""); 
    const [showDescargaSaldos, setShowDescargaSaldos] = useState(false);     
    const [showBorrarPeriodo, setShowBorrarPeriodo] = useState(false);      
    const [records, setRecords] = useState([]);
    const [treeViewData, setTreeViewData] = useState([]);    
    let [referencias, setReferencias] = useState(arrStr);    
    let [referenciaPub, setReferenciaPub] = useState(arrStr);    
    let [estados, setEstados] = useState(arrStr);        
    const [resume, setResume] = useState({
        Pais: "",
        Anno: "",
        Mes: "",
        Centro: "",
        Almacen: "",
        Total_Items: 0.0,
        Items_Cuadrados: 0.0,
        Inventario_sistema_valorizado: 0.0,
        Inventario_fisico_valorizado: 0.0,
        Items_negativos: 0.0,
        Items_positivos: 0.0,
        Diferencia_valor_contable: 0.0,
        Diferencia_valor_absoluto: 0.0,
        Porc_descuadre_valorizado: 0.0,
        Porc_cuadratura_items: 0.0
    });
    let [formData, setFormData] = useState({ Pais: "CL", Anno: "", Mes: "", Centro: "", Almacen: ""}); 
    const [item, setItem] = useState(rowItemData);
    let emp: any = useSelector((state: any) => state.emp);     

    let columns = [
        { name: "Ref.", selector: (row:any) => row.Subinventario_Id, sortable: true, grow:2},
        { name: "Familia", selector: (row:any) => row.Negocio, sortable: true, grow:3},
        { name: "Selección", selector: (row:any) => row.Seleccion, grow:1},
        { name: "Cant.Sku", selector: (row:any) => row.Cant_Sku,  sortable: true, right:true},
        { name: "Estado", selector: (row:any) => row.Estado}, 
        { name: "Apertura", selector: (row:any) => row.Apertura_Fecha, sortable: true, grow:3},
        { name: "Usuario Aper.", selector: (row:any) => row.Usuario_Apertura, sortable: true, grow:3},
        { name: "Publicación", selector: (row:any) => row.Publicado_Fecha, grow:4},
        { name: "Fecha de Bajada", selector: (row:any) => row.Bajada_Saldos,  sortable: true, grow:3},
        { name: "Bajada de usuario", selector: (row:any) => row.Bajada_Usuario, sortable: true, right:true, grow:2},
        { name: "Porc. Cuadratura", selector: (row:any) => row.Porc_Cuadratura, right:true, grow:3},
        { name: "Acciones", selector: (row:any) => row.Acciones, grow:3},         
    ]    

    const fillEstadoSelect = async()=>{
        estados = [];
        const recurso = `${env.REACT_APP_API_URL_DEV}/api/PeriodoSub?Pais=CL&Anno=${formData.Anno}&Mes=${formData.Mes}&Centro=${formData.Centro}&Almacen=${formData.Almacen}&Estado=T`;     
        const response = await httpApiGetText(recurso,{
            'Content-Type': 'application/json',
            'Rosen-API-Key': '2B89CE9E-47DF-4EF1-8353-CF0C18EE029F',
            'Rosen-API-Secret': 'EFCFA469-8474-4DCF-B84A-CB1B0835ABDA-CDDC8DDB-6E6E-47CB-9422-B8A4312EC01A',
        });

        const arrDta = await JSON.parse(response.message);  
        if (response.code >= 400){
            setMsgRespuestInv(arrDta.Message);
            setMsgDlgShowApiResponse(true);              
        }else{
            //****Llena el select de estados de la tab-Reporte******/
            arrDta.map((obj: any)=>{
                if (estados.findIndex((dat: string)=> dat === obj.Estado_Inv) < 0){
                    estados.push(obj.Estado_Inv);
                }                 
            });
            estados = estados.filter((dt: string)=> (dt !== null) && (dt !== undefined) );             
            setEstados([...estados]);
        }      
    }

    const procesoDescargaSaldos = async () =>{
        setShowDescargaSaldos(false);
        const body = {
            ...formData,
            Subinventario_Id: item.Subinventario_Id,
            Bajada_Usuario: emp.user
        }

        setSHCarga(true);
        const recurso = `${env.REACT_APP_API_URL_DEV}/api/SubInvDescargaSaldos`;     
        const response = await httpApiPostText(recurso,"POST", {
            'Content-Type': 'application/json',
            'Rosen-API-Key': '2B89CE9E-47DF-4EF1-8353-CF0C18EE029F',
            'Rosen-API-Secret': 'EFCFA469-8474-4DCF-B84A-CB1B0835ABDA-CDDC8DDB-6E6E-47CB-9422-B8A4312EC01A',
        }, body);
        setSHCarga(false);
        const arrDta = await JSON.parse(response.message);  
        if (response.code >= 400){
            setMsgRespuestInv(arrDta.Message);
        }else{
            setMsgRespuestInv(arrDta);
        }      
        setMsgDlgShowApiResponse(true);
    }

    const procesoBorrarPeriodo = async () =>{
        setShowBorrarPeriodo(false);

        const body = {
            ...formData,
            Subinventario_Id: item.Subinventario_Id,
        }

        setSHCarga(true);
        const recurso = `${env.REACT_APP_API_URL_DEV}/api/PeriodoSub`;     
        const response = await httpApiPostText(recurso,"DELETE", {
            'Content-Type': 'application/json',
            'Rosen-API-Key': '2B89CE9E-47DF-4EF1-8353-CF0C18EE029F',
            'Rosen-API-Secret': 'EFCFA469-8474-4DCF-B84A-CB1B0835ABDA-CDDC8DDB-6E6E-47CB-9422-B8A4312EC01A',
        }, body);
        const arrDta = await JSON.parse(response.message); 
        setSHCarga(false);  
         
        if (response.code >= 400){
            setMsgRespuestInv("No se pudo realizar la operación");
        }else{
            setMsgRespuestInv(arrDta);
        }      
        setMsgDlgShowApiResponse(true);
    }    

    const ModalArbolClasificacion = (obj: any)=>{
        setItem(obj);
        setMsgMuestraModalArbol(true);
    }

    const dataTableResumen = async () =>{

        setSHCarga(true);
        const recurso = `${env.REACT_APP_API_URL_DEV}/api/InventarioSub?Pais=CL&Anno=${formData.Anno}&Mes=${formData.Mes}&Centro=${formData.Centro}&Almacen=${formData.Almacen}`;     
        const response = await httpApiGetText(recurso,{
            'Content-Type': 'application/json',
            'Rosen-API-Key': '2B89CE9E-47DF-4EF1-8353-CF0C18EE029F',
            'Rosen-API-Secret': 'EFCFA469-8474-4DCF-B84A-CB1B0835ABDA-CDDC8DDB-6E6E-47CB-9422-B8A4312EC01A',
        });
        const arrDta = await JSON.parse(response.message);        
        if (response.code >= 400){
            setMsgRespuestInv(arrDta.Message);
            setMsgDlgShowApiResponse(true);
            setSHCarga(false);
            setReferencias([]);  
            setRecords([]);
            return false;
        }else{
            setResume(arrDta.ResumenSubInventario)
            const invDet = arrDta.InventarioSubDetalle;
            const auxDta:any = [];  
            referenciaPub = [];          
            invDet.map((obj: any, index: number)=>{
                const newObj = {
                    ...obj,
                    Subinventario_Id: (obj.Subinventario_Id) ? obj.Subinventario_Id : "-",
                    Seleccion: <a href="#!" onClick={()=> ModalArbolClasificacion(obj)}>{obj.Seleccion}</a>, 
                    Acciones: ((obj.Usuario_Apertura !== null) && (obj.Publicado_Usuario === null)) 
                                  ? <div  className=' d-flex gap-1' >
                                        <a href="#!" id={`${index}`} onClick={()=>setShowDescargaSaldos(true)}>
                                            <FaSyncAlt title="Descarga saldos" color={'green'}  className=' rounded-circle p-1 h3'/>    
                                        </a>
                                        <a href="#!" id={`${index}`}  onClick={()=>setShowBorrarPeriodo(true)}>
                                            <FaTimesCircle title="Borra período" color={'red'}  className=' rounded-circle p-1 h3'/>    
                                        </a>                                                                
                                    </div>
                             : null
                };
                auxDta.push(newObj);
                //****Llena el select de Referencia de la tab-Publicación******/
                if (referenciaPub.findIndex((dat: string)=> dat === obj.Subinventario_Id) < 0){
                    referenciaPub.push(obj.Subinventario_Id);  
                }              
            });           
            setRecords(auxDta);   
            //****Llena el select de Referencia de la tab-Publicación******/  
            referenciaPub = referenciaPub.filter((dt: string)=> dt !== null);          
            setReferenciaPub([...referenciaPub]);          
            //*******Llena el select de la tab-Reporte************************ */
            fillEstadoSelect();
        }
        setSHCarga(false);        
        return true;
    }

    const dataTreeApertura = async() =>{
        setSHCarga(true);
        const recurso = `${env.REACT_APP_API_URL_DEV}/api/SubInvClasificaciones?Pais=CL&Anno=${formData.Anno}&Mes=${formData.Mes}&Centro=${formData.Centro}&Almacen=${formData.Almacen}`;     
        const response = await httpApiGetText(recurso,{
            'Content-Type': 'application/json',
            'Rosen-API-Key': '2B89CE9E-47DF-4EF1-8353-CF0C18EE029F',
            'Rosen-API-Secret': 'EFCFA469-8474-4DCF-B84A-CB1B0835ABDA-CDDC8DDB-6E6E-47CB-9422-B8A4312EC01A',
        });
        const arrDta = await JSON.parse(response.message);      
        setSHCarga(false);             
        if (response.code >= 400){
            setMsgRespuestInv(arrDta.Message);
            setMsgDlgShowApiResponse(true);
            return false;         
        }else{
            setTreeViewData(arrDta);   
        }
        return true;
    }

    const hndlrBtnBuscar = async () =>{

            // trae los datos para llenar la tabla de Resumen
            if (await dataTableResumen()){
                // trae los datos para llenar el arbol (TreeView) de apertura 
                await dataTreeApertura();
            }
    }

    const ValidaBtnAbrir = () => {
        if ((formData.Anno !== "") &&
            (formData.Almacen !== "") && 
            (formData.Centro !== "")){
                setHbltBtnBuscar(false);
        }else{
            setHbltBtnBuscar(true);
        }
    }

    const hndlrPeriodo = async (evnt: any) =>{

        const f: Date = evnt.target.value; 
        const yy = f.toString().split('-')[0];
        const mm = f.toString().split('-')[1];
        formData = {...formData, Anno: yy, Mes: mm};
        setFormData(formData);
        ValidaBtnAbrir();        
    }  

    const hndlrOpcionCentro = (evnt: any) =>{
        formData = {...formData, [evnt.target.id]: evnt.target.value.split("-")[0].trim()};
        setFormData(formData); 
        ValidaBtnAbrir();    
    }

    const hndlrOpcionAlmacen = (evnt: any) =>{
        formData = {...formData, [evnt.target.id]: evnt.target.value.split("-")[0].trim()};
        setFormData(formData); 
        ValidaBtnAbrir();              
    } 

    const MsgDlghandlerResponseApi = () =>{
        setMsgDlgShowApiResponse(false);
    }  

    return(
        <Container fluid>
            <BarraMenuHz/>  
            <div >
                <div className="text-primary  ms-3 mt-3">
                      Home / Inventario / Gestión Sub-inventario
                </div>
                <div className="h4 mt-4 mb-4 ms-1">GESTIÓN DE SUB INVENTARIOS</div>
            </div>            
            <Container fluid > 
                <Accordion  className="mb-3" defaultActiveKey={['0']} alwaysOpen>
                    <Accordion.Item eventKey="0" className="border shadow ">
                        <Accordion.Header><div className=" h5 text-dark">Selector de Períodos</div></Accordion.Header>
                            <Accordion.Body>
                                <div className="row d-flex flex-row p-4 " style={{backgroundColor: "white"}}>
                                    <Container fluid className="mb- col-md-12 col-lg-3" >
                                        <label className="form-label">Seleccionar Centro *</label>    
                                        <div><SelectCentro id="Centro" OnSeleccion={hndlrOpcionCentro}/></div>
                                    </Container>
                                    <Container fluid className="mb-3  col-md-12 col-lg-3" >
                                        <label className="form-label">Seleccionar Almacen *</label>    
                                        <div ><SelectAlmacenes id="Almacen" centro={formData.Centro}   OnSeleccion={hndlrOpcionAlmacen} /></div>
                                    </Container>
                                    <Container  className="mb-3 d-flex flex-column col-md-12 col-lg-3">
                                        <label className="m-2 ">Periodos disponibles</label>
                                        <input type="month" id="periodo" size={8}  className="ms-2"
                                                onChange={hndlrPeriodo}
                                                value={`${formData.Anno}-${formData.Mes}`} 
                                                min="1990-01" max="9999-12"
                                        />
                                    </Container>  
                                    <Container className="d-flex align-items-center text-end col-md-12 col-lg-2 ">
                                        <Button type="button" className="btn btn-success btn-lg border-0"  style={{backgroundColor:"#00B5B8"}}  
                                            disabled={hbltBtnBuscar}  onClick={()=>hndlrBtnBuscar()}
                                        >
                                                Buscar
                                        </Button>
                                    </Container>                  
                                </div>                                
                            </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

                <Accordion  className="mb-3" defaultActiveKey={['0']} alwaysOpen>
                    <Accordion.Item eventKey="0" className="border shadow ">
                        <Accordion.Header></Accordion.Header>
                            <Accordion.Body>
                                <div className="row d-flex flex-row  mt-4 mb-4">
                                    <nav>
                                        <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                            <a className="nav-link active" href="#nav-home" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="false">Resumen</a>
                                            <a className="nav-link" href="#nav-profile" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false"
                                                onClick={()=>console.log("apertura...")}
                                            >
                                                    Apertura
                                            </a>
                                            <a className="nav-link" href="#nav-contact" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">Publicación</a>
                                            <a className="nav-link" href="#nav-reporte" id="nav-reporte-tab" data-bs-toggle="tab" data-bs-target="#nav-reporte" type="button" role="tab" aria-controls="nav-reporte" aria-selected="false">Reporte</a>
                                        </div>
                                    </nav>
                                    <div className="tab-content " id="nav-tabContent"  style={{backgroundColor: "white"}}>
                                        <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                                            <Resumen data={records} formData={formData} columns={columns}/>
                                        </div>
                                        <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                                            <Apertura data={treeViewData} formData={formData}/>
                                        </div>
                                        <div className="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">
                                            <Publicacion data={records} formData={formData} columns={columns} referencias={referenciaPub}/>
                                        </div>
                                        <div className="tab-pane fade" id="nav-reporte" role="tabpanel" aria-labelledby="nav-reporte-ta">
                                            <Reporte estados={estados}  referencias={referencias} formData={formData}/>
                                        </div>
                                    </div>
                                </div>                           
                            </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

                <Accordion  className="mb-3" defaultActiveKey={['0']} alwaysOpen>
                    <Accordion.Item eventKey="0" className="border shadow ">
                        <Accordion.Header><div className=" h5 text-dark">RESUMEN - SUB INVENTARIO CON STATUS COMPLETO Y PENDIENTE</div></Accordion.Header>
                            <Accordion.Body>
                                <div className="row" >
                                    <div className="mt-2 mb-2   col-md-12 col-lg-6 " >
                                        <label className="form-label">Total Items</label>    
                                        <div ><input type="text" name="totItems" id="totItems" readOnly value={resume.Total_Items.toLocaleString("es")} className="text-end form-control " pattern="^\$\d{1,3}(,\d{3})*(\.\d+)?$" /></div>
                                    </div>
                                    <div className="mt-2 mb-2   col-md-12 col-lg-6 " >
                                        <label className="form-label">Inv. Físico Valorizado ($)</label>    
                                        <div ><input type="text" name="ifv" id="ifv" readOnly value={resume.Items_Cuadrados.toLocaleString("es")}  className="text-end form-control "/></div>
                                    </div>
                                    <div className="mt-2 mb-2   col-md-12 col-lg-6 " >
                                        <label className="form-label">Valores Negativos</label>    
                                        <div  ><input type="text" name="valneg" id="valneg" readOnly value={resume.Items_negativos.toLocaleString("es")} className="text-end form-control "/></div>
                                    </div>
                                    <div className="mt-2 mb-2   col-md-12 col-lg-6 " >
                                        <label className="form-label">Diferencia Valor Contable ($)</label>    
                                        <div  ><input type="text" name="dvc" id="dvc" readOnly value={resume.Diferencia_valor_contable.toLocaleString("es")} className="text-end form-control "/></div>
                                    </div>
                                    <div className="mt-2 mb-2   col-md-12 col-lg-6 " >
                                        <label className="form-label">Descuadre Inv. Valorizado (%)</label>    
                                        <div ><input type="text" name="div" id="div" readOnly value={resume.Porc_descuadre_valorizado.toLocaleString("es")} className="text-end form-control "/></div>
                                    </div>
                                    <div className="mt-2 mb-2   col-md-12 col-lg-6 " >
                                        <label className="form-label">Items Cuadrados</label>    
                                        <div ><input type="text" name="itcuad" id="itcuad" readOnly value={resume.Items_Cuadrados.toLocaleString("es")} className="text-end form-control "/></div>
                                    </div>
                                    <div className="mt-2 mb-2   col-md-12 col-lg-6 " >
                                        <label className="form-label">Inv. Sistema Valorizado ($)</label>    
                                        <div  ><input type="text" name="isv" id="isv" readOnly value={resume.Inventario_sistema_valorizado.toLocaleString("es")} className="text-end form-control "/></div>
                                    </div>
                                    <div className="mt-2 mb-2   col-md-12 col-lg-6 " >
                                        <label className="form-label">Valores Positivos</label>    
                                        <div ><input type="text" name="valpos" id="valpos" readOnly value={resume.Items_positivos.toLocaleString("es")} className="text-end form-control "/></div>
                                    </div>
                                    <div className="mt-2 mb-2   col-md-12 col-lg-6 " >
                                        <label className="form-label">Diferencia Valor Absoluto ($)</label>    
                                        <div ><input type="text" name="dva" id="dva" readOnly value={resume.Diferencia_valor_absoluto.toLocaleString("es")} className="text-end form-control "/></div>
                                    </div>
                                    <div className="mt-2 mb-2   col-md-12 col-lg-6 " >
                                        <label className="form-label">Cuadratura Items (%)</label>    
                                        <div ><input type="text" name="cuadit" id="cuadit"  readOnly value={resume.Porc_cuadratura_items.toLocaleString("es")} className="text-end form-control "/></div>
                                    </div>   
                                </div>                                  
                            </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Container>  
            {/*********** cuadro de dialogo para msj de api **********/}
            <MsgModalDialogEspecial
                Show={msgDlgShowApiResponse}
                Title={`Gestión inventario`}
                Icon="x"
                Message={msgRespuestInv}
                BtnOkName="Aceptar"
                BtnNokName=""
                HandlerClickOk={()=>MsgDlghandlerResponseApi()}
                HanlerdClickNok={null}
            />  

            <MostraTodo
                Show={msgMuestraModalArbol}
                Title="Clasificación"
                BtnOkName="Cerrar"
                HandlerClickOk={()=>setMsgMuestraModalArbol(false)}
                item={item}
                formData={formData}
            />  

            <MsgDialog
                Show={showDescargaSaldos}
                Title="Gestión Subinvetario"
                Message="¿Desea descargar saldos?"
                Icon="x"
                BtnOkName="Si, descargar"
                BtnNokName="No, cerrar"
                HanlerdClickNok={()=>setShowDescargaSaldos(false)}
                HandlerClickOk={()=>procesoDescargaSaldos()}
            /> 
            
            <MsgDialog
                Show={showBorrarPeriodo}
                Title="Gestión Subinvetario"
                Message="¿Está seguro de Continuar?"
                Icon="x"
                BtnOkName="Si, Continuar"
                BtnNokName="No, Cancelar"
                HanlerdClickNok={()=>setShowBorrarPeriodo(false)}
                HandlerClickOk={()=>procesoBorrarPeriodo()}
            />                              

            <LocalMsgModalSpinner 
                Show={sHCarga}
                text="Un momento por favor, procesando..."
                color="#FF7588"
            />              
        </Container>
    );
}


export default GestionSubInventarioPage;