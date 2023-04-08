import { useState } from "react";
import { Accordion, Button, Container, Form } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { FaCalendarAlt, FaCheck, FaDotCircle, FaEye, FaTruck } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import SelectAlmacenes from "../../../components/Almacenes";
import BarraMenuHz from "../../../components/BarraMenoHz";
import SelectCentro from "../../../components/Centros";
import LocalMsgModalSpinner from "../../../components/LocalMsgModalSpinner";
import MsgModalDialogEspecial from "../../../components/MsgModalDialogEspecial";
import * as env from '../../../env';
import { httpApiGetText } from "../../../lib";
import { SetDataTable } from "../../../redux/store/Actions";
import { exportToExcel } from "../../../util";
import MsgDialogDetalleReporteInv from "./MsgDialogDetalleReporteInv";
import MsgDialogReconteoRepoInv from "./MsgDialogReconteoRepoInv";
import './style.css';
  
const ReporteInventarioPage = () =>{

    const [records, setRecords] = useState([]);
    let dt: any = useSelector((state: any) => state.datatable);  
    const [msgDlgShow, setMsgDlgShow] = useState(false);
    const [msgDlgShowReconteo, setMsgDlgShowReconteo] = useState(false);    
    let [formData, setFormData] = useState({ Pais: "CL", Anno: "", Mes: "", Centro: "", Almacen: ""});
    let [sinoDifRec, setSinoDifRec] = useState({dif: "", rec: ""});
    const [hbltBtnAbrir, setHbltBtnAbrir] = useState(true);
    const [sHCarga, setSHCarga] = useState(false);
    const [msgDlgShowApiResponse, setMsgDlgShowApiResponse] = useState(false);
    const [msgRespuestInv, setMsgRespuestInv] = useState(""); 
    const [btnToExcel, setBtnToExce] = useState(true);
    const dispatch = useDispatch();
    const [element, setElement] = useState({});
    const [resumen, setResumen] = useState({
        Pais: "",
        Anno: "",
        Mes: "",
        Centro: "",
        Almacen: "",
        TotalItems: 0,
        ItemsGuardados: 0,
        InvSistemaValorizado: 0,
        InvFisicoValorizado: 0,
        ValoresNegativos: 0,
        ValoresPositivos: 0,
        DiferenciaValorContable: 0,
        DiferenciaValorAbsoluto: 0,
        PorcDescuadreInvValorizado: 0,
        PorcCuadraturaItems: 0
    });    

    let columns = [
        { name: "Código", selector: (row:any) => row.Codigo, sortable: true},
        { name: "E", selector: (row:any) => row.E, sortable: true,},
        { name: "Descripción", selector: (row:any) => row.Descripcion, grow: 6},
        { name: "Descripción1", selector: (row:any) => row.Clasificacion1,  sortable: true, grow: 2},
        { name: "Descripción2", selector: (row:any) => row.Clasificacion2, grow: 4}, 
        { name: "Description", selector: (row:any) => row.Clasificacion, sortable: true, grow: 3},
        { name: "Unidad", selector: (row:any) => row.Un, sortable: true},
        { name: "Precio", selector: (row:any) => row.Precio, right: true},
        { name: "Sistema", selector: (row:any) => row.Sistema,  sortable: true, right: true},
        { name: "CC Sistema", selector: (row:any) => row.CCSistema,  sortable: true, right: true},
        { name: "Bloqueado", selector: (row:any) => row.Bloqueado, right: true}, 
        { name: "Valor Sistema", selector: (row:any) => row.ValorSistema, sortable: true, right: true, grow: 2},
        { name: "Físico", selector: (row:any) => row.Fisico, sortable: true, right: true},
        { name: "Valor Físico", selector: (row:any) => row.ValorFisico, right: true},
        { name: "Diferencia", selector: (row:any) => row.Diferencia,  sortable: true, grow: 2, right: true},
        { name: "Valor Diferencia", selector: (row:any) => row.ValorDiferencia,  sortable: true, right: true, grow: 3},
        { name: "Base sistema", selector: (row:any) => row.Base_Sistema, grow: 2, right: true,}, 
        { name: "Base CC Sistema", selector: (row:any) => row.Base_CCSistema, sortable: true, grow: 2, right: true,},
        { name: "Base Bloqueado", selector: (row:any) => row.Base_Bloqueado, sortable: true, right: true,},
        { name: "Base Físico", selector: (row:any) => row.Base_Fisico, grow: 2, right: true,},
        { name: "Base Precio", selector: (row:any) => row.Base_Precio,  sortable: true, right: true, grow: 2},        
        { name: "Acciones", selector: (row:any) => row.Acciones},         
    ]

    const pagOptions = {
        rowsPerPageText: "Filas por páginas",
        rangeSeparatorText: "de",
        selectAllRowsItem: true,
        selectAllRowsItemText: "Todos"
    };

    const hndlrPeriodo = async (evnt: any) =>{

        const f: Date = evnt.target.value; 
        const yy = f.toString().split('-')[0];
        const mm = f.toString().split('-')[1];
        formData = {...formData, Anno: yy, Mes: mm};
        setFormData(formData);
        ValidaBtnAbrir();      
    }

    const MostrarTodoModalDetalle = (indice: number) =>{
        setElement({...dt[indice]})
        setMsgDlgShow(true);           
    }
    
    const MostrarTodoReconteo = (indice: number) =>{
        setElement({...dt[indice]})
        setMsgDlgShowReconteo(true);        
    }  

    const hndlrBtnBuscar = async () =>{
        setSHCarga(true);
        const recurso = `${env.REACT_APP_API_URL_DEV}/api/ReporteInventarioCentro?Pais=CL&Anno=${formData.Anno}&Mes=${formData.Mes}&Centro=${formData.Centro}&Almacen=${formData.Almacen}&Diferencias=${sinoDifRec.dif}`;     
        const data = await httpApiGetText(recurso,{
            'Content-Type': 'application/json',
            'Rosen-API-Key': '2B89CE9E-47DF-4EF1-8353-CF0C18EE029F',
            'Rosen-API-Secret': 'EFCFA469-8474-4DCF-B84A-CB1B0835ABDA-CDDC8DDB-6E6E-47CB-9422-B8A4312EC01A',
        });
        setSHCarga(false);
        const arrDta = await JSON.parse(data.message);
        if (data.code >= 400){
            setMsgRespuestInv(arrDta.Message);
            setMsgDlgShowApiResponse(true);
            dispatch(SetDataTable([]));
            setRecords([]);
        }
        else{
            const auxDta:any = [];
            arrDta.Detalle.map((valor: any, index: number)=>{
            const newObj = {
                ...valor,
                Acciones: <div  className=' d-flex gap-1' >
                                <a href="#!" id={`${index}`} onClick={(obj: any)=>{
                                        MostrarTodoModalDetalle(index)
                                    }}>
                                    <FaEye title="Publicar inventario" color={'white'}  className='bg-success rounded-circle p-1 h4'/>   
                                </a>                               
                                <a href="#!" id={`${index}`}  onClick={(obj: any)=>{
                                        MostrarTodoReconteo(index);
                                    }}>
                                    <FaDotCircle title="Descarga saldos" color={'white'}  className=' bg-primary rounded-circle p-1 h4'/>  
                                </a>                                                                       
                            </div>
            };
            auxDta.push(newObj);  
            });
            //********Pasa el objeto a arreglo para recorrido en table
            if (auxDta.length > 0){
                setBtnToExce(false);
            }else{
                setBtnToExce(true);                
            }
            dt = [...auxDta];
            dispatch(SetDataTable(dt));
            setRecords(auxDta); 
            setResumen(arrDta.Resumen);     
            setBtnToExce(!(arrDta.Detalle.length  > 0));            
        }
    }

    const ValidaBtnAbrir = () => {
        if ((formData.Anno !== "") &&
            (formData.Almacen !== "") && 
            (formData.Centro !== "") && 
            (sinoDifRec.dif !== "") && 
            (sinoDifRec.rec !== "")){
                setHbltBtnAbrir(false);
        }else{
                setHbltBtnAbrir(true);
        }
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

    const hndlrOnChangeSel = (evnt: any) =>{
        sinoDifRec = {...sinoDifRec, [evnt.target.id]: evnt.target.value.split("-")[0].trim()};
        setSinoDifRec(sinoDifRec); 
        ValidaBtnAbrir();                 
    }

    const MsgDlghandlerResponseApi = () =>{
        setMsgDlgShowApiResponse(false);
    }  

    const handlerDlgDetReportOk = () =>{
        setMsgDlgShow(false);    
    } 

    const handlerDlgDetReportReconteoOk = () =>{
        setMsgDlgShowReconteo(false);    
    }    
    
    const digitadoInventario = async()=>{

        setSHCarga(true);
        const recurso = `${env.REACT_APP_API_URL_DEV}/api/ReportInventario?Pais=CL&Anno=${formData.Anno}&Mes=${formData.Mes}&Centro=${formData.Centro}&Almacen=${formData.Almacen}`;     
        const response = await httpApiGetText(recurso,{
            'Content-Type': 'application/json',
            'Rosen-API-Key': '2B89CE9E-47DF-4EF1-8353-CF0C18EE029F',
            'Rosen-API-Secret': 'EFCFA469-8474-4DCF-B84A-CB1B0835ABDA-CDDC8DDB-6E6E-47CB-9422-B8A4312EC01A',
        });
        const arrDta = await JSON.parse(response.message);
        setSHCarga(false);        
        if (response.code >= 400){
            setMsgRespuestInv("No se pudo realizar la operación");
            setMsgDlgShowApiResponse(true);              
        }else{
            if(arrDta.length > 0){
                exportToExcel("tablaDigitadoInventario", arrDta)
            }else{
                setMsgRespuestInv("No hay datos que exportar"); 
                setMsgDlgShowApiResponse(true);                                 
            }
        } 
    }    

    return(
        <>
            <Container fluid>
                <BarraMenuHz/>  
                <div >
                    <div className="text-primary ms-3 mt-3">
                            Home / Consulta / Reporte Inventario
                    </div>
                    <div className="h4 mt-4 mb-4 ms-3">REPORTE DE INVENTARIO</div>
                </div>
                <Container fluid>
                    <Accordion  className="mb-1" defaultActiveKey={['0']} alwaysOpen>
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
                                        <label className="form-label">Seleccionar Centro de distribución *</label>    
                                        <div><SelectCentro id="Centro" OnSeleccion={hndlrOpcionCentro}/></div>
                                    </Container>
                                    <Container fluid className="mb-3  col-md-12 col-lg-6" >
                                        <label className="form-label">Seleccionar Almacen *</label>    
                                        <div ><SelectAlmacenes id="Almacen" centro={formData.Centro}  OnSeleccion={hndlrOpcionAlmacen} /></div>
                                    </Container>
                                </div>

                                <div className="align-middle mt-4">
                                    <FaCheck className="h5" />  
                                    <label className="ms-2 h4 "> Diferencias y Reconteo</label>
                                </div>
                                <hr className="t-0 m-0 mb-3" /> 
                                                                                
                                <div className="row d-flex flex-row mb-3">
                                    <Container fluid className="mb-3 col-md-12 col-lg-6" >
                                        <label className="form-label">Seleccionar Diferencia</label>    
                                        <Form.Select value={sinoDifRec.dif} aria-label="Default select example"  id="dif" onChange={(e)=>hndlrOnChangeSel(e)}>
                                            <option value="">Seleccione una opción</option>
                                            <option value="1">Si</option>
                                            <option value="0">No</option>
                                        </Form.Select>
                                    </Container>
                                    <Container fluid className="mb-3  col-md-12 col-lg-6" >
                                        <label className="form-label">Seleccionar Reconteo</label>    
                                        <Form.Select value={sinoDifRec.rec} aria-label="Default select example"  id="rec"  onChange={(e)=>hndlrOnChangeSel(e)}>
                                            <option value="">Seleccione una opción</option>
                                            <option value="0">Si</option>
                                            <option value="1">No</option>
                                        </Form.Select>
                                    </Container>
                                </div>

                                <div className="text-end">
                                    <Button type="button" className=" btn btn-success border border-0" 
                                        disabled={hbltBtnAbrir}  onClick={hndlrBtnBuscar}
                                    >
                                        Filtrar
                                    </Button>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>         

                    <Accordion  className="mb-1" defaultActiveKey={['0']} alwaysOpen>
                        <Accordion.Item eventKey="0" className="border shadow ">
                            <Accordion.Header><div className=" h5 text-dark">REPORTE</div></Accordion.Header>
                            <Accordion.Body>
                                <div>
                                    <div className=" row align-items-center mt-4 ms-3">
                                        <div className="m-1 col-md-12 col-lg-8 " > 
                                            <Button type="button" className="border-0" style={{backgroundColor:"#16D39A"}}
                                                onClick={()=>digitadoInventario()}
                                                disabled={hbltBtnAbrir}
                                            >
                                                Digitado
                                            </Button>
                                        </div>
                                        <div className="m-1 col-md-12 col-lg-8 " > 
                                        <Button type="button" className="border-0" style={{backgroundColor:"#16D39A"}}
                                                disabled={btnToExcel}
                                                onClick={async ()=> exportToExcel("tablaReporteInventario", records)}>
                                                Exportar
                                            </Button>
                                        </div>            
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
                                    />                                                  
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>  

                    <Accordion className="mt-1" defaultActiveKey={['0']} alwaysOpen>
                        <Accordion.Item eventKey="0" className="border shadow ">
                            <Accordion.Header><div className=" h5 text-dark">RESUMEN</div></Accordion.Header>
                            <Accordion.Body  className="p-4 mb-5 ">
                                <div className="row">
                                    <div  className="mt-2 mb-2   col-md-12 col-lg-6 " >
                                        <label className="form-label fs-6">Total Items</label>    
                                        <div><input type="text" name="totItems" id="totItems" className=" form-control text-end" readOnly value={resumen.TotalItems}/></div>
                                    </div>
                                    <div  className="mt-2 mb-2   col-md-12 col-lg-6 " >
                                        <label className="form-label fs-6">Inv. Físico Valorizado ($)</label>    
                                        <div ><input type="text" name="ifv" id="ifv" className=" form-control text-end"  readOnly  value={resumen.InvFisicoValorizado.toLocaleString("es")} /></div>
                                    </div>
                                    <div  className="mt-2 mb-2   col-md-12 col-lg-6 " >
                                        <label className="form-label fs-6">Valores Negativos</label>    
                                        <div ><input type="text" name="valneg" id="valneg" className=" form-control text-end"  readOnly   value={resumen.ValoresNegativos}/></div>
                                    </div>
                                    <div  className="mt-2 mb-2   col-md-12 col-lg-6 " >
                                        <label className="form-label ">Diferencia Valor Contable ($)</label>    
                                        <div ><input type="text" name="dvc" id="dvc" className=" form-control text-end"   readOnly  value={resumen.DiferenciaValorContable.toLocaleString("es")}/></div>
                                    </div>
                                    <div  className="mt-2 mb-2   col-md-12 col-lg-6 " >
                                        <label className="form-label">Descuadre Inv. Valorizado (%)</label>    
                                        <div ><input type="text" name="div" id="div"  className=" form-control text-end"  readOnly value={resumen.PorcDescuadreInvValorizado}/></div>
                                    </div>
                                    <div  className="mt-2 mb-2   col-md-12 col-lg-6 " >
                                        <label className="form-label">Items Cuadrados</label>    
                                        <div ><input type="text" name="itcuad" id="itcuad"  className=" form-control text-end"  readOnly  value={resumen.ItemsGuardados}/></div>
                                    </div>
                                    <div  className="mt-2 mb-2   col-md-12 col-lg-6 " >
                                        <label className="form-label">Inv. Sistema Valorizado ($)</label>    
                                        <div ><input type="text" name="isv" id="isv"  className=" form-control text-end"  readOnly value={resumen.InvSistemaValorizado.toLocaleString("es")}/></div>
                                    </div>
                                    <div className="mt-2 mb-2   col-md-12 col-lg-6 " >
                                        <label className="form-label">Valores Positivos</label>    
                                        <div ><input type="text" name="valpos" id="valpos"  className=" form-control text-end"  readOnly  value={resumen.ValoresPositivos}/></div>
                                    </div>
                                    <div  className="mt-2 mb-2   col-md-12 col-lg-6 "  >
                                        <label className="form-label">Diferencia Valor Absoluto ($)</label>    
                                        <div ><input type="text" name="dva" id="dva" className=" form-control text-end"  readOnly   value={resumen.DiferenciaValorAbsoluto.toLocaleString("es")}/></div>
                                    </div>
                                    <div  className="mt-2 mb-2   col-md-12 col-lg-6 " >
                                        <label className="form-label">Cuadratura Items (%)</label>    
                                        <div ><input type="text" name="cuadit" id="cuadit" className=" form-control text-end"  readOnly  value={resumen.PorcCuadraturaItems}/></div>
                                    </div> 
                                </div>                                                    
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>  
                </Container>                    
            </Container>
            {/*********** cuadro de dialogo para detalle inv **********/}
            <MsgDialogDetalleReporteInv
                Title={`Detalle Inventario - ${formData.Centro}/${formData.Almacen}`} 
                SubTitle={`${formData.Centro}/${formData.Almacen}`}
                Show={msgDlgShow}
                BtnOkName="Aceptar"
                BtnNokName="Cerrar"
                HandlerClickOk={handlerDlgDetReportOk}
                HanlerdClickNok={handlerDlgDetReportOk}
                data={element}
                formData={formData}
            />     
            {/*********** cuadro de dialogo para detalle inv **********/}
            <MsgDialogReconteoRepoInv
                Title={`Reconteo Inventario`} 
                Show={msgDlgShowReconteo}
                BtnOkName="Aceptar"
                BtnNokName="Cerrar"
                HandlerClickOk={handlerDlgDetReportReconteoOk}
                HanlerdClickNok={handlerDlgDetReportReconteoOk}
                data={element}
                formData={formData}
            />                       
            {/*********** cuadro de dialogo para msj de api **********/}
            <MsgModalDialogEspecial
                Show={msgDlgShowApiResponse}
                Title={`Consulta`}
                Icon="x"
                Message={msgRespuestInv}
                BtnOkName="Aceptar"
                BtnNokName=""
                HandlerClickOk={MsgDlghandlerResponseApi}
                HanlerdClickNok={null}
            />            
            <LocalMsgModalSpinner 
                Show={sHCarga}
                text="Un momento porfavor, procesando..."
                color="#FF7588"
            />  
        </>
    );
}

export default ReporteInventarioPage;
