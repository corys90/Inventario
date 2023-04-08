import { useEffect, useState } from "react";
import { Accordion, Button, Container, Form, Pagination } from "react-bootstrap";
import {  FaCalendarAlt, FaCheck, FaEye, FaShareAlt, FaTruck } from "react-icons/fa";
import SelectAlmacenes from "../../../components/Almacenes";
import SelectCentro from "../../../components/Centros";
import LocalMsgModalSpinner from "../../../components/LocalMsgModalSpinner";
import MsgModalDialogEspecial from "../../../components/MsgModalDialogEspecial";
import MsgDialogDetalleInventario from "./MsgDialogDetalleInventario";
import * as env from '../../../env';
import './style.css';
import { httpApiGetText } from "../../../lib";
import { useDispatch, useSelector } from "react-redux";
import { SetDataTable } from '../../../redux/store/Actions';
import DataTable from "react-data-table-component";
import { exportToExcel } from "../../../util";
import BarraMenuHz from "../../../components/BarraMenoHz";
  
const AvanceInventarioPage = () =>{

    const [records, setRecords] = useState([]);
    const [msgDlgShow, setMsgDlgShow] = useState(false);
    let [formData, setFormData] = useState({ Pais: "CL", Anno: "", Mes: "", Centro: "", Almacen: ""});
    let [sinoDifRec, setSinoDifRec] = useState({dif: "", sub: ""});
    const [hbltBtnAbrir, setHbltBtnAbrir] = useState(false);
    const [btnToExcel, setBtnToExce] = useState(true);
    const [sHCarga, setSHCarga] = useState(false);
    const [msgDlgShowApiResponse, setMsgDlgShowApiResponse] = useState(false);   
    const [msgRespuestInv, setMsgRespuestInv] = useState(""); 
    const [opcionSubInv, setOpcionSubInv] = useState([]);
    const [datas, setDatas] = useState({
        Pais: "",
        Anno: "",
        Mes: "",
        Centro: "",
        Almacen: "",
        Total_Items: 0,
        Items_Cuadrados: 0,
        Inventario_sistema_valorizado: 0,
        Inventario_fisico_valorizado: 0,
        Items_negativos: 0,
        Items_positivos: 0,
        Diferencia_valor_contable: 0,
        Diferencia_valor_absoluto: 0,
        Porc_descuadre_valorizado: 0,
        Porc_cuadratura_items: 0
    });
    let dt: any = useSelector((state: any) => state.datatable);  
    const dispatch = useDispatch();
    const [element, setElement] = useState({});

    let columns = [
        { name: "Código", selector: (row:any) => row.Codigo_Rosen, sortable: true},
        { name: "Especial", selector: (row:any) => row.Especial, sortable: true},
        { name: "Descripción", selector: (row:any) => row.Descripcion, grow: 4},
        { name: "UM", selector: (row:any) => row.Unidad_Medida,  sortable: true, right:true},
        { name: "Saldo SAP", selector: (row:any) => row.Saldo_SAP, right:true}, 
        { name: "Saldo ctrl. Cal.", selector: (row:any) => row.Control_Cal_SAP, sortable: true, right:true},
        { name: "Bloqueado", selector: (row:any) => row.Bloqueado, sortable: true},
        { name: "Total Sap", selector: (row:any) => row.Total_Stock_SAP, right:true},
        { name: "Acumulado", selector: (row:any) => row.Total_Stock_Bodega,  sortable: true, right:true},
        { name: "Saldo Final", selector: (row:any) => row.Diferencia, sortable: true, right:true},
        { name: "Valor Diferencia", selector: (row:any) => row.Diferencia_Valorizada, right:true},
        { name: "Clasificación", selector: (row:any) => row.Clasificacion, sortable: true, grow: 2},
        { name: "Acciones", selector: (row:any) => row.Acciones},         
    ]

    const pagOptions = {
        rowsPerPageText: "Filas por páginas",
        rangeSeparatorText: "de",
        selectAllRowsItem: true,
        selectAllRowsItemText: "Todos"
    };    

    const styleOpenT = {
        backgroundColor:"#00B5B8"
    };

    const styleOpenF = {
        backgroundColor: "gainsboro",
        PointerEvent: "none",
    };

    const LLenarSelectorSubinventario = async () => {
        const recurso = `${env.REACT_APP_API_URL_DEV}/api/PeriodoSub?Pais=CL&Anno=${formData.Anno}&Mes=${formData.Mes}&Centro=${formData.Centro}&Almacen=${formData.Almacen}&Estado=A`;     
        const data = await httpApiGetText(recurso,{
            'Content-Type': 'application/json',
            'Rosen-API-Key': '2B89CE9E-47DF-4EF1-8353-CF0C18EE029F',
            'Rosen-API-Secret': 'EFCFA469-8474-4DCF-B84A-CB1B0835ABDA-CDDC8DDB-6E6E-47CB-9422-B8A4312EC01A',
        });
        const arrDta = await JSON.parse(data.message);
        setOpcionSubInv(arrDta);      
    }

    const ValidaBtnAbrir = () => {
        if ((formData.Anno !== "") &&
            (formData.Almacen !== "") && 
            (formData.Centro !== "")){

                LLenarSelectorSubinventario();
          
                if ((sinoDifRec.dif !== "") && (sinoDifRec.sub !== "")){
                
                    setHbltBtnAbrir(true);
                }
                else{
                    setHbltBtnAbrir(false);                
                }    
        }else{
                setHbltBtnAbrir(false);  
        }
    }
    
    const hndlrPeriodo = async (evnt: any) =>{

        const f: Date = evnt.target.value; 
        const yy = f.toString().split('-')[0];
        const mm = f.toString().split('-')[1];
        formData = {...formData, Anno: yy, Mes: mm};
        setFormData(formData);
        sinoDifRec = {...sinoDifRec, sub: ""};
        setSinoDifRec(sinoDifRec);
        ValidaBtnAbrir();         
    }

    const hndlrOpcionCentro = (evnt: any) =>{
        formData = {...formData, [evnt.target.id]: evnt.target.value.split("-")[0].trim()};
        setFormData(formData); 
        sinoDifRec = {...sinoDifRec, sub: ""};
        setSinoDifRec(sinoDifRec);        
        ValidaBtnAbrir();   
    }

    const hndlrOpcionAlmacen = (evnt: any) =>{
        formData = {...formData, [evnt.target.id]: evnt.target.value.split("-")[0].trim()};
        setFormData(formData); 
        sinoDifRec = {...sinoDifRec, sub: ""};
        setSinoDifRec(sinoDifRec);        
        ValidaBtnAbrir();                    
    }

    const hndlrOnChangeSel = (evnt: any) =>{
        sinoDifRec = {...sinoDifRec, [evnt.target.id]: evnt.target.value.split("-")[0].trim()};
        setSinoDifRec(sinoDifRec); 
        ValidaBtnAbrir();                 
    } 

    const hndlrBtnBuscar = async () =>{
        setSHCarga(true);
        const recurso = `${env.REACT_APP_API_URL_DEV}/api/ReportInventario?Pais=CL&Anno=${formData.Anno}&Mes=${formData.Mes}&Centro=${formData.Centro}&Almacen=${formData.Almacen}&Diferencias=${sinoDifRec.dif}&Subinventario_Id=${sinoDifRec.sub}`;     
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
        }
        else{
            const auxDta:any = [];
            if (arrDta.Detalle.length > 0){  
                arrDta.Detalle.map((obj: any, index: number)=>{
                    const newObj = {
                        ...obj, 
                        Acciones: <div  className=' d-flex gap-1' >
                                    <a href="#!" id={`${index}`} onClick={(obj: any)=>{
                                            handlerViewDetail(index);
                                        }}>
                                        <FaEye title="ver Movimientos" color={'green'}  className=' rounded-circle p-1 h3'/>    
                                    </a>                                
                                 </div>
                    };
                    auxDta.push(newObj);  
                }); 
                //********Pasa el objeto a arreglo para recorrido en table
                dt = [...auxDta];
                dispatch(SetDataTable(dt));
                setRecords(auxDta); 
                setDatas(arrDta.Resumen);             
            }    
            setBtnToExce(!(arrDta.Detalle.length  > 0));           
        }
    }

    const MsgDlghandlerResponseApi = () =>{
        setMsgDlgShowApiResponse(false);
    }    
    
    const handlerOk = () =>{
        setMsgDlgShow(false);
    }

    const handlerViewDetail = (idx: number) =>{
        setElement({...dt[idx]})
        setMsgDlgShow(true);    
    } 

    const DataTabla = (props:any) =>{
        
        let [registros, setRegistros] = useState(props.records);
        let [filtro, setFiltro] = useState(new Array()); 
        let [formSelect, setFormSelect] = useState();  
        
        useEffect(()=>{
            const filtroClasificacion = () =>{
                registros.map((obj: any)=>{
                    if (filtro.findIndex((dato: string)=>dato === obj.Clasificacion) === -1){
                        filtro.push(obj.Clasificacion.trim());
                    }
                });
                filtro = filtro.sort();
                setFiltro([...filtro]);
            } ;
            
            filtroClasificacion();

        }, props.records);

        const handlerSelect = (e: any)=>{
            setFormSelect(e.target.value);
            if (e.target.value === ""){
                setRegistros(props.records);
            }else{
                registros = props.records.filter((dt: any)=>dt.Clasificacion === e.target.value );
                setRegistros([...registros]);
            }
        }

        return (
            <div>
                <div className="d-flex flex-row m-4 ">
                    <div className=" col-md-12 col-lg-3 align-middle " >
                        <label className="form-label">Clasificación de productos</label>    
                        <div>
                            <Form.Select  value={formSelect} aria-label="Default select example" onChange={(e: any) => handlerSelect(e)}  id="Negocio">
                                    <option key={-1} value={""}>Seleccione una opción</option>
                                    {
                                        filtro.map((opcion: string, index: number)=><option key={index} value={opcion}>{opcion}</option>)
                                    }                                          
                            </Form.Select>
                        </div>
                    </div>
                </div>   
                <div className=" row align-items-center mt-4 ms-3">
                    <div className=" col-md-12 col-lg-8 " > 
                        <Button type="button" className="border-0" style={{backgroundColor:"#16D39A"}}
                            disabled={btnToExcel}
                            onClick={async ()=> exportToExcel("tablaAvance", registros)}>
                            Exportar
                        </Button>
                    </div>               
                </div>                             
                <DataTable
                    columns={props.columns}
                    data={registros}
                    fixedHeader
                    pagination
                    highlightOnHover
                    fixedHeaderScrollHeight="600px"
                    paginationComponentOptions={pagOptions}
                    onSelectedRowsChange={(e: any)=>console.log("OnSelect: ", e)}
                />  
            </div>
        )
    }

    return(
        <>
            <Container fluid>
            <BarraMenuHz/>  
                <div >
                    <div className="text-primary ms-3 mt-3">
                            Home / Consulta / Avance Inventario
                    </div>
                    <div className="h4 mt-4 mb-4 ms-3">AVANCE DE INVENTARIO</div>
                </div> 
                <Container fluid>                
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
                                        <div ><SelectAlmacenes id="Almacen" centro={formData.Centro} OnSeleccion={hndlrOpcionAlmacen} /></div>
                                    </Container>
                                </div>
                                                                                
                                <div className="row d-flex flex-row mb-3">
                                    <Container fluid className="mb-3 col-md-12 col-lg-6" >
                                        <div className="align-middle mt-4 w-50">
                                            <FaCheck className="h5" /> 
                                            <label className="ms-2 h4 ">Diferencias</label>
                                        </div> 
                                        <hr className="t-0 m-0 mb-3" /> 
                                        <label className="form-label">Seleccionar Diferencia</label>    
                                        <Form.Select value={sinoDifRec.dif} aria-label="Default select example"  id="dif" onChange={(e)=>hndlrOnChangeSel(e)}>
                                            <option value="">Seleccione una opción</option>
                                            <option value="1">Si</option>
                                            <option value="0">No</option>
                                        </Form.Select>
                                    </Container>
                                    <Container fluid className="mb-3  col-md-12 col-lg-6" >
                                        <div className="align-middle mt-4 w-50">
                                            <FaShareAlt className="h5" /> 
                                            <label className="ms-2 h4 ">Sub Inventario</label>
                                        </div>   
                                        <hr className="t-0 m-0 mb-3" />                                   
                                        <label className="form-label">Seleccionar Sub Inventario</label>    
                                        <Form.Select value={sinoDifRec.sub} aria-label="Default select example"  id="sub"  onChange={(e)=>hndlrOnChangeSel(e)}>
                                            <option value="">Seleccione una opción</option>
                                            {
                                                opcionSubInv.map((obj: any, index: number)=><option key={index} value={obj.Subinventario_Id}>{obj.Subinventario_Id}</option>)
                                            }
                                        </Form.Select>
                                    </Container>
                                </div>

                                <div className="text-end">
                                    <Button type="button" className=" btn border border-0" 
                                        style={(hbltBtnAbrir)? styleOpenT: styleOpenF }  onClick={hndlrBtnBuscar}
                                    >
                                        Filtrar
                                    </Button>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>         

                    <Accordion  className="mb-4" defaultActiveKey={['0']} alwaysOpen>
                        <Accordion.Item eventKey="0" className="border shadow ">
                            <Accordion.Header><div className=" h5 text-dark">INVENTARIO</div></Accordion.Header>
                            <Accordion.Body>
                                <div>
                                    <DataTabla 
                                        columns={columns}   
                                        records={records}                                    
                                    />
 
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>  

                    <Accordion className="" defaultActiveKey={['0']} alwaysOpen>
                        <Accordion.Item eventKey="0" className="border shadow ">
                            <Accordion.Header><div className=" h5 text-dark">RESUMEN</div></Accordion.Header>
                            <Accordion.Body  className="p-4 mb-5 ">
                                <div className="row">
                                        <div className="mt-2 mb-2   col-md-12 col-lg-6 " >
                                            <label className="form-label">Total Items</label>    
                                            <div><input type="text" name="totItems" id="totItems" value={(datas.Total_Items).toLocaleString("es")} readOnly className=" form-control text-end" /></div>
                                        </div>
                                        <div  className="mt-2 mb-2  col-md-12 col-lg-6" >
                                            <label className="form-label">Inv. Físico Valorizado ($)</label>    
                                            <div ><input type="text" name="ifv" id="ifv" value={datas.Inventario_fisico_valorizado.toLocaleString("es")} readOnly className=" form-control text-end"   /></div>
                                        </div>
                                        <div  className="mt-2 mb-2   col-md-12 col-lg-6" >
                                            <label className="form-label">Valores Negativos</label>    
                                            <div ><input type="text" name="valneg" id="valneg"  value={datas.Items_negativos.toLocaleString("es")} readOnly className=" form-control text-end"  /></div>
                                        </div>
                                        <div  className="mt-2 mb-2   col-md-12 col-lg-6" >
                                            <label className="form-label">Diferencia Valor Contable ($)</label>    
                                            <div ><input type="text" name="dvc" id="dvc"  value={datas.Diferencia_valor_contable.toLocaleString("es")}  readOnly className=" form-control text-end"  /></div>
                                        </div>
                                        <div  className="mt-2 mb-2   col-md-12 col-lg-6" >
                                            <label className="form-label">Descuadre Inv. Valorizado (%)</label>    
                                            <div ><input type="text" name="div" id="div"   value={datas.Porc_descuadre_valorizado} readOnly className=" form-control text-end"  /></div>
                                        </div>
                                        <div  className="mt-2 mb-2   col-md-12 col-lg-6" >
                                            <label className="form-label">Items Cuadrados</label>    
                                            <div ><input type="text" name="itcuad" id="itcuad"   value={datas.Items_Cuadrados}  readOnly className=" form-control text-end" /></div>
                                        </div>
                                        <div  className="mt-2 mb-2   col-md-12 col-lg-6" >
                                            <label className="form-label">Inv. Sistema Valorizado ($)</label>    
                                            <div ><input type="text" name="isv" id="isv"   value={datas.Inventario_sistema_valorizado.toLocaleString("es")} readOnly className=" form-control text-end"  /></div>
                                        </div>
                                        <div  className="mt-2 mb-2   col-md-12 col-lg-6" >
                                            <label className="form-label">Valores Positivos</label>    
                                            <div ><input type="text" name="valpos" id="valpos"   value={datas.Items_positivos.toLocaleString("es")} readOnly className=" form-control text-end"/></div>
                                        </div>
                                        <div  className="mt-2 mb-2   col-md-12 col-lg-6" >
                                            <label className="form-label">Diferencia Valor Absoluto ($)</label>    
                                            <div ><input type="text" name="dva" id="dva"   value={datas.Diferencia_valor_absoluto.toLocaleString("es")} readOnly className=" form-control text-end"  /></div>
                                        </div>
                                        <div  className="mt-2 mb-2   col-md-12 col-lg-6" >
                                            <label className="form-label">Cuadratura Items (%)</label>    
                                            <div ><input type="text" name="cuadit" id="cuadit"   value={datas.Porc_cuadratura_items}  readOnly className=" form-control text-end" /></div>
                                        </div> 
                                </div>                                                        
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>  
                </Container>
            {/*********** seccion de modales **********************/}
            {/*********** cuadro de dialogo para errores **********/}
            <MsgDialogDetalleInventario
                Title={`Detalle Inventario - ${formData.Centro}/${formData.Almacen}`} 
                SubTitle={`${formData.Centro}/${formData.Almacen}`}
                Show={msgDlgShow}
                BtnOkName="Aceptar"
                BtnNokName="Cerrar"
                HandlerClickOk={handlerOk}
                HanlerdClickNok={handlerOk}
                data={element}
                formData={formData}
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

            <LocalMsgModalSpinner 
                Show={sHCarga}
                text="Un momento por favor, procesando..."
                color="#FF7588"
            />                           
            </Container>
        </>
    );
}

export default AvanceInventarioPage;
