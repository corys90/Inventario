import { useState } from "react";
import { Accordion, Button, Container, Form } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { FaCalendarAlt, FaEye, FaShareAlt, FaTruck } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import SelectAlmacenes from "../../../components/Almacenes";
import BarraMenuHz from "../../../components/BarraMenoHz";
import SelectCentro from "../../../components/Centros";
import LocalMsgModalSpinner from "../../../components/LocalMsgModalSpinner";
import MsgDialog from "../../../components/MsgDialog";
import MsgModalDialogEspecial from "../../../components/MsgModalDialogEspecial";
import * as env from '../../../env';
import { httpApiGetText, httpApiPostText } from "../../../lib";
import { SetDataTable } from "../../../redux/store/Actions";
import { exportToExcel } from "../../../util";
import MsgModalDetalleMuestras from "./MsgModalDetalleMuestras";
   
const AvanceCierreMuestrasPage = () =>{

    const [modalDetalleMuestra, setModalDetalleMuestra] = useState(false);  
    let [element, setElement] = useState({});
    const [hbltBtnExport, setHbltBtnExport] = useState(true);
    const [hbltBtnAbrir, setHbltBtnAbrir] = useState(true);
    const [hbltBtnExportTable, sethbltBtnExportTable] = useState(true);
    const [sHCarga, setSHCarga] = useState(false);
    const [showResPublicar, setShowResPublicar] = useState(false);
    const [msgDlgShowGen, setMsgDlgShowGen] = useState(false); 
    const [msgShowPublicar, setMsgShowPublicar] = useState(false);        
    const [msgResPublicar, setMsgResPublicar] = useState("");
    let emp: any = useSelector((state: any) => state.emp); 
    let dt: any = useSelector((state: any) => state.datatable);    
    let [formData, setFormData] = useState({ Pais: "CL", Anno: "", Mes: "", Centro: "", Almacen: "", Estado: "", Muestra: "", });
    const dispatch = useDispatch();  
    const [records, setRecords] = useState([]);     
    const [opcionSubMuestras, setOpcionSubMuestras] = useState([""]); 
    const [cabecera, setCabecera] = useState({Estado_Muestra: "", Usuario_apertura:"", Bajada_saldos:"",
                                              Publicado_usuario:"", Publicado_fecha:""}); 
    const [resumen, setResumen] = useState({
        Pais: "",  Anno: "", Mes: "", Centro: "", Almacen: "",  Total_Items: 0,
        Items_Cuadrados: 0, Inventario_sistema_valorizado: 0, Inventario_fisico_valorizado: 0,
        Items_negativos: 0, Items_positivos: 0, Diferencia_valor_contable: 0,  Diferencia_valor_absoluto: 0,
        Porc_descuadre_valorizado: 0, Porc_cuadratura_items: 0
    }); 
    
    let columns = [
        { name: "Código", selector: (row:any) => row.Codigo_Rosen, sortable: true},
        { name: "Especial", selector: (row:any) => row.Especial, sortable: true},
        { name: "Descripción", selector: (row:any) => row.Descripcion, grow: 4},
        { name: "UM", selector: (row:any) => row.Unidad_Medida,  sortable: true, right:true},
        { name: "Saldo SAP", selector: (row:any) => row.Saldo_SAP, right:true}, 
        { name: "Saldo ctrl. Cal.", selector: (row:any) => row.Control_Cal_SAP, sortable: true, right:true, grow:2},
        { name: "Bloqueado", selector: (row:any) => row.Bloqueado, sortable: true, grow:2},
        { name: "Total Sap", selector: (row:any) => row.Total_Stock_SAP, right:true},
        { name: "Acumulado", selector: (row:any) => row.Total_Stock_Bodega,  sortable: true, right:true, grow:2},
        { name: "Saldo Final", selector: (row:any) => row.Diferencia, sortable: true, right:true, grow:2},
        { name: "Valor Diferencia", selector: (row:any) => row.Diferencia_Valorizada, right:true, grow:3},
        { name: "Muestra_Ref", selector: (row:any) => row.Muestra_ref, sortable: true,  right:true, grow: 3},
        { name: "Acciones", selector: (row:any) => row.Acciones},         
    ]

    const pagOptions = {
        rowsPerPageText: "Filas por páginas",
        rangeSeparatorText: "de",
        selectAllRowsItem: true,
        selectAllRowsItemText: "Todos"
    };     

    const LLenarSelectorMuestra = async () => {
        const recurso = `${env.REACT_APP_API_URL_DEV}/api/MuestrasInventarioAvance?Pais=CL&Anno=${formData.Anno}&Mes=${formData.Mes}&Centro=${formData.Centro}` + 
                            `&Almacen=${formData.Almacen}&Estado=${formData.Estado}`;     
        const response = await httpApiGetText(recurso,{
            'Content-Type': 'application/json',
            'Rosen-API-Key': '2B89CE9E-47DF-4EF1-8353-CF0C18EE029F',
            'Rosen-API-Secret': 'EFCFA469-8474-4DCF-B84A-CB1B0835ABDA-CDDC8DDB-6E6E-47CB-9422-B8A4312EC01A',
        });
        const arrDta = await JSON.parse(response.message);
        const arrSelectMuestra: string[]= [];
        arrDta.map((obj: any, index: number)=>{
                arrSelectMuestra.push(obj.Muestra_ref_concat);
        });
        setOpcionSubMuestras([...arrSelectMuestra]);  
    }

    const ValidaBtnAbrir = () => {     
        if ((formData.Anno !== "") &&
            (formData.Almacen !== "") && 
            (formData.Centro !== "") && 
            (formData.Estado !== "") ){     
                LLenarSelectorMuestra();     
                if (formData.Muestra !== ""){
                    setHbltBtnAbrir(false); 
                }else{
                    setHbltBtnAbrir(true); 
                }
        }else{
            setHbltBtnAbrir(true); 
        }
    }

    const ValidaBtnExport = () => {
        if ((formData.Anno !== "") &&
            (formData.Almacen !== "") && 
            (formData.Centro !== "") && 
            (formData.Estado !== "")){
                setHbltBtnExport(false);                
        }else{
            setHbltBtnExport(true);  
        }
    }

    const hndlrPeriodo = async (evnt: any) =>{
        const f: Date = evnt.target.value; 
        const yy = f.toString().split('-')[0];
        const mm = f.toString().split('-')[1];
        formData = {...formData, Anno: yy, Mes: mm};
        setFormData(formData);
        ValidaBtnAbrir();   
        ValidaBtnExport();                   
    }

    const hndlrOpcionCentro = (evnt: any) =>{
        formData = {...formData, [evnt.target.id]: evnt.target.value.split("-")[0].trim()};
        setFormData(formData);        
        ValidaBtnAbrir();   
        ValidaBtnExport();             
    }

    const hndlrOpcionAlmacen = (evnt: any) =>{
        formData = {...formData, [evnt.target.id]: evnt.target.value.split("-")[0].trim()};
        setFormData(formData);        
        ValidaBtnAbrir(); 
        ValidaBtnExport();                                
    }   
    
    const handlerEstado = (event: any) =>{
        formData = {...formData, [event.target.id]: event.target.value};
        setFormData(formData);
        ValidaBtnAbrir(); 
        ValidaBtnExport();             
    }    

    const handlerMuestras = (event: any) =>{
        formData = {...formData, [event.target.id]: event.target.value};
        setFormData(formData);
        ValidaBtnAbrir();           
    }   
    
    const btnExportar = async ()=>{
        if (opcionSubMuestras.length > 0){
            setSHCarga(true);  
            // llamar a api
            let cat = "";
            opcionSubMuestras.map((mst: string)=>{
                cat += mst.split("-")[0].trim() + ",";
            });
            cat = cat.substring(0, cat.length - 1);
            console.log("Muestras: ", cat);
            const recurso = `${env.REACT_APP_API_URL_DEV}/api/MuestrasInventarioAvance?Pais=CL&Anno=${formData.Anno}&Mes=${formData.Mes}` + 
                            `&Centro=${formData.Centro}&Almacen=${formData.Almacen}&Muestra_Ref_Concat=${cat}`;     
            const response = await httpApiGetText(recurso,{
                'Content-Type': 'application/json',
                'Rosen-API-Key': '2B89CE9E-47DF-4EF1-8353-CF0C18EE029F',
                'Rosen-API-Secret': 'EFCFA469-8474-4DCF-B84A-CB1B0835ABDA-CDDC8DDB-6E6E-47CB-9422-B8A4312EC01A',
            });
            const arrDta = await JSON.parse(response.message);
            if (response.code >= 400){
                // pendinte por definir
            }else{
                exportToExcel("Muestras", arrDta.Detalle);            
            }    
            setSHCarga(false);                 
        }else{
            setMsgDlgShowGen(true);
        }
    }

    const btnVerDetalleMuestras = (idx: number) =>{
        element = {...formData, Codigo: dt[idx].Codigo_Rosen, Descripcion:dt[idx].Descripcion}
        setElement(element);   
        setModalDetalleMuestra(true);        
    }

    const btnBuscar = async () =>{
        sethbltBtnExportTable(true);
        setSHCarga(true);
        const recurso = `${env.REACT_APP_API_URL_DEV}/api/MuestrasInventarioAvance?Pais=CL&Anno=${formData.Anno}&Mes=${formData.Mes}` + 
        `&Centro=${formData.Centro}&Almacen=${formData.Almacen}&Diferencias=0&Muestra_Ref=${formData.Muestra.split("-")[0].trim()}`;     
        const response = await httpApiGetText(recurso,{
        'Content-Type': 'application/json',
        'Rosen-API-Key': '2B89CE9E-47DF-4EF1-8353-CF0C18EE029F',
        'Rosen-API-Secret': 'EFCFA469-8474-4DCF-B84A-CB1B0835ABDA-CDDC8DDB-6E6E-47CB-9422-B8A4312EC01A',
        });
        const arrDta = await JSON.parse(response.message); 
        setSHCarga(false);
        if(response.code >= 400){
            console.log("btn 400:", response, recurso);
        }else{
            sethbltBtnExportTable(false);
            setResumen(arrDta.Resumen);
            setCabecera(arrDta.Cabecera);            
            const auxDta:any = [];            
            arrDta.Detalle.map((obj: any, index: number)=>{
                const newObj = {
                    ...obj, 
                    Acciones: <div  className=' d-flex gap-1' >
                                <a href="#!" id={`${index}`} onClick={(obj: any)=>{
                                        btnVerDetalleMuestras(index);
                                    }}>
                                    <FaEye title="ver Movimientos" color={'green'}  className=' rounded-circle p-1 h3'/>    
                                </a>                                
                             </div>
                };
                auxDta.push(newObj);  
            });  
            dt = [...auxDta];
            dispatch(SetDataTable(dt));           
            setRecords(auxDta);
        }       
    }

    const apiPublicar = async()=>{

        setMsgShowPublicar(false);

        const bdy = {
            Pais:"CL",
            Anno: formData.Anno,
            Mes: formData.Mes,
            Centro:formData.Centro,
            Almacen:formData.Almacen,
            Muestra_ref:formData.Muestra.split("-")[0].trim(),
            Publicado_usuario: emp.user
        }

        const recurso = `${env.REACT_APP_API_URL_DEV}/api/MuestraInventarioPublicar`
        const response = await httpApiPostText(recurso,"POST", {
        'Content-Type': 'application/json',
        'Rosen-API-Key': '2B89CE9E-47DF-4EF1-8353-CF0C18EE029F',
        'Rosen-API-Secret': 'EFCFA469-8474-4DCF-B84A-CB1B0835ABDA-CDDC8DDB-6E6E-47CB-9422-B8A4312EC01A',
        }, bdy);

        if (response.code >= 400){
            const arrDta = await JSON.parse(response.message);
            setMsgResPublicar(arrDta.Message);
        }else{
            setMsgResPublicar(response.message);
        }
        setShowResPublicar(true);
    }

    const btnPublicar = () =>{

        setMsgShowPublicar(true);  
    }

    const resetPage = ()=>{

        setFormData({ Pais: "CL", Anno: "", Mes: "", Centro: "", Almacen: "", Estado: "", Muestra: "", });
        setRecords([]);
        setCabecera({Estado_Muestra: "", Usuario_apertura:"", Bajada_saldos:"",
        Publicado_usuario:"", Publicado_fecha:""});
        setResumen({
            Pais: "",  Anno: "", Mes: "", Centro: "", Almacen: "",  Total_Items: 0,
            Items_Cuadrados: 0, Inventario_sistema_valorizado: 0, Inventario_fisico_valorizado: 0,
            Items_negativos: 0, Items_positivos: 0, Diferencia_valor_contable: 0,  Diferencia_valor_absoluto: 0,
            Porc_descuadre_valorizado: 0, Porc_cuadratura_items: 0
        });
        setShowResPublicar(false);        
    }

    return(
        <>
        <Container fluid>
        <BarraMenuHz/>  
            <div >
                <div className="text-primary ms-3 mt-3">
                        Home / Muestras / Avance y Cierre de Muestras
                </div>
                <div className="h4 mt-4 mb-4 ms-3">AVANCE Y CIERRE DE MUESTRAS</div>
            </div> 
            <Container fluid>  
                <Accordion  className="mb-3" defaultActiveKey={['0']} alwaysOpen>
                    <Accordion.Item eventKey="0" className="border shadow ">
                        <Accordion.Header><div className=" h5 text-dark">PARÁMETROS DE MUESTRA</div></Accordion.Header>
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
                                    value={`${formData.Anno}-${formData.Mes}`}
                                    onChange={hndlrPeriodo} 
                                    min="1990-01" max="9999-12"
                                />
                            </div>
                            <div className="align-middle mt-4">
                                <FaTruck className="h5" /> 
                                <label className="ms-2 h4 ">Centro y Almacén</label>
                            </div>
                            <hr className="t-0 m-0 mb-3" /> 

                            <div className="row d-flex flex-row mb-3">
                                <Container fluid className="mb-3 col-md-12 col-lg-6" >
                                    <label className="form-label">Seleccionar Centro de distribución</label>    
                                    <div><SelectCentro id="Centro" OnSeleccion={hndlrOpcionCentro} /></div>
                                </Container>
                                <Container fluid className="mb-3  col-md-12 col-lg-6" >
                                    <label className="form-label">Seleccionar Almacen </label>    
                                    <div ><SelectAlmacenes  id="Almacen" centro={formData.Centro} OnSeleccion={hndlrOpcionAlmacen} /></div>
                                </Container>
                            </div>
                                                                              
                            <div className="row d-flex flex-row mb-3">
                                <Container fluid className="mb-3 col-md-12 col-lg-6" >
                                    <div className="align-middle mt-4 w-50">
                                        <FaShareAlt className="h5" /> 
                                        <label className="ms-2 h4 ">Estado Muestras</label>
                                    </div> 
                                    <hr className="t-0 m-0 mb-3" /> 
                                    <label className="form-label">Seleccionar Estado</label>    
                                    <div>
                                    <Form.Select aria-label="Default select example" id="Estado"  value={formData.Estado} onChange={(e) => handlerEstado(e)}>
                                        <option value="">Seleccione una opción</option>
                                        <option value="C">Cerradas</option>
                                        <option value="A">Abiertas</option>
                                        <option value="T">Todas</option>
                                    </Form.Select>
                                    </div>
                                </Container>
                                <Container fluid className="mb-3  col-md-12 col-lg-6" >
                                    <div className="align-middle mt-4 w-50">
                                        <FaShareAlt className="h5" /> 
                                        <label className="ms-2 h4 ">Muestras</label>
                                    </div>   
                                    <hr className="t-0 m-0 mb-3" />                                   
                                    <label className="form-label">Seleccionar Muestra </label>    
                                    <div >
                                    <Form.Select aria-label="Default select example" id="Muestra"  value={formData.Muestra} onChange={(e) => handlerMuestras(e)}>
                                        <option key={-1} value="">Seleccione una opción</option>
                                        {
                                            opcionSubMuestras.map((obj: any, index: number)=><option key={index} value={obj}>{obj}</option>)
                                        }
                                    </Form.Select>                                        

                                    </div>
                                </Container>
                            </div>
                            <div className="row ">
                                <div className=" col-md-12 col-lg-6">
                                    <Button type="button" style={{backgroundColor:"#00B5B8"}} className=" btn border border-0" 
                                        disabled={hbltBtnExport} onClick={() => btnExportar()}
                                    >
                                        Exportar
                                    </Button>
                                </div>
                                <div className=" col-md-12 col-lg-6 text-end">
                                    <Button type="button" style={{backgroundColor:"#00B5B8"}} className=" btn border border-0" 
                                        disabled={hbltBtnAbrir} onClick={() => btnBuscar()}
                                    >
                                        Buscar
                                    </Button>
                                </div>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>         

                <Accordion  className="mb-3" defaultActiveKey={['0']} alwaysOpen>
                    <Accordion.Item eventKey="0" className="border shadow ">
                        <Accordion.Header><div className=" h5 text-dark">TABLA DE MUESTRAS</div></Accordion.Header>
                        <Accordion.Body>
                            <div>
                                <div className=" row align-items-center mt-2 ms-3">
                                    <div className=" col-md-12 col-lg-8 " > 
                                        <Button type="button" className="border-0" style={{backgroundColor:"#16D39A"}}
                                          disabled={hbltBtnExportTable}  onClick={()=> {if (records.length > 0) exportToExcel("TablaMuestra", records);}}
                                        >
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
                                        onSelectedRowsChange={(e: any)=>console.log("OnSelect: ", e)}
                                    />   
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>  

                <Accordion className="mb-3" defaultActiveKey={['0']} alwaysOpen>
                    <Accordion.Item eventKey="0" className="border shadow ">
                        <Accordion.Header><div className=" h5 text-dark">MUESTRA</div></Accordion.Header>
                        <Accordion.Body  className="row p-4 mb-1 ">
                            <div className="row">
                                <div  className="mt-2 mb-2 col-md-12 col-lg-12" >
                                    <label className="form-label">Muestra</label>    
                                    <div><input type="text" name="em" id="em" className=" form-control "  value={formData.Muestra.split("-")[0]} readOnly  /></div>
                                </div>
                                <div  className="mt-2 mb-2 col-md-12 col-lg-6" >
                                    <label className="form-label">Estado Muestra</label>    
                                    <div><input type="text" name="em" id="em" className=" form-control text-end "  value={cabecera.Estado_Muestra} readOnly  /></div>
                                </div>
                                <div  className="mt-2 mb-2  col-md-12 col-lg-6" >
                                    <label className="form-label">Fecha Stock SAP</label>    
                                    <div ><input type="text" name="fssap" id="fssap"  className=" form-control text-end"   value={cabecera.Bajada_saldos} readOnly  /></div>
                                </div>
                                <div  className="mt-2 mb-2   col-md-12 col-lg-6" >
                                    <label className="form-label">Usuario Apertura</label>    
                                    <div ><input type="text" name="usrap" id="usrap"  className=" form-control text-end"   value={cabecera.Usuario_apertura} readOnly /></div>
                                </div>
                                <div  className="mt-2 mb-2   col-md-12 col-lg-6" >
                                    <label className="form-label">Usuario Publicación</label>    
                                    <div ><input type="text" name="pubusr" id="pubusr" className=" form-control text-end"  value={cabecera.Publicado_usuario} readOnly /></div>
                                </div>
                                <div  className="mt-2 mb-2   col-md-12 col-lg-6" >
                                    <label className="form-label">Fecha de Publicación</label>    
                                    <div ><input type="text" name="div" id="div"  className=" form-control text-end" value={cabecera.Publicado_fecha} readOnly  /></div>
                                </div>     
                                {   (formData.Estado === "A")
                                    ?
                                        <div className="d-flex align-items-center justify-content-end   col-md-12 col-lg-6" > 
                                            <Button type="button" className="border-0  col-md-12 col-lg-6"  style={{backgroundColor:"#00B5B8"}} 
                                                onClick={()=>btnPublicar()}
                                            >
                                                Publicar
                                            </Button>
                                        </div>
                                    : <div></div>
                                }    
                            </div>                                
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion> 

                <Accordion className="" defaultActiveKey={['0']} alwaysOpen>
                    <Accordion.Item eventKey="0" className="border shadow ">
                        <Accordion.Header><div className=" h5 text-dark">RESUMEN</div></Accordion.Header>
                        <Accordion.Body  className="row p-4 mb-1 ">
                            <div className="row">
                                            <div className="mt-2 mb-2   col-md-12 col-lg-6 " >
                                                <label className="form-label">Total Items</label>    
                                                <div><input type="text" name="totItems" id="totItems" value={(resumen.Total_Items).toLocaleString("es")} readOnly className=" form-control text-end" /></div>
                                            </div>
                                            <div  className="mt-2 mb-2  col-md-12 col-lg-6" >
                                                <label className="form-label">Inv. Físico Valorizado ($)</label>    
                                                <div ><input type="text" name="ifv" id="ifv" value={resumen.Inventario_fisico_valorizado.toLocaleString("es")} readOnly className=" form-control text-end"   /></div>
                                            </div>
                                            <div  className="mt-2 mb-2   col-md-12 col-lg-6" >
                                                <label className="form-label">Valores Negativos</label>    
                                                <div ><input type="text" name="valneg" id="valneg"  value={resumen.Items_negativos.toLocaleString("es")} readOnly className=" form-control text-end"  /></div>
                                            </div>
                                            <div  className="mt-2 mb-2   col-md-12 col-lg-6" >
                                                <label className="form-label">Diferencia Valor Contable ($)</label>    
                                                <div ><input type="text" name="dvc" id="dvc"  value={resumen.Diferencia_valor_contable.toLocaleString("es")}  readOnly className=" form-control text-end"  /></div>
                                            </div>
                                            <div  className="mt-2 mb-2   col-md-12 col-lg-6" >
                                                <label className="form-label">Descuadre Inv. Valorizado (%)</label>    
                                                <div ><input type="text" name="div" id="div"   value={resumen.Porc_descuadre_valorizado} readOnly className=" form-control text-end"  /></div>
                                            </div>
                                            <div  className="mt-2 mb-2   col-md-12 col-lg-6" >
                                                <label className="form-label">Items Cuadrados</label>    
                                                <div ><input type="text" name="itcuad" id="itcuad"   value={resumen.Items_Cuadrados}  readOnly className=" form-control text-end" /></div>
                                            </div>
                                            <div  className="mt-2 mb-2   col-md-12 col-lg-6" >
                                                <label className="form-label">Inv. Sistema Valorizado ($)</label>    
                                                <div ><input type="text" name="isv" id="isv"   value={resumen.Inventario_sistema_valorizado.toLocaleString("es")} readOnly className=" form-control text-end"  /></div>
                                            </div>
                                            <div  className="mt-2 mb-2   col-md-12 col-lg-6" >
                                                <label className="form-label">Valores Positivos</label>    
                                                <div ><input type="text" name="valpos" id="valpos"   value={resumen.Items_positivos.toLocaleString("es")} readOnly className=" form-control text-end"/></div>
                                            </div>
                                            <div  className="mt-2 mb-2   col-md-12 col-lg-6" >
                                                <label className="form-label">Diferencia Valor Absoluto ($)</label>    
                                                <div ><input type="text" name="dva" id="dva"   value={resumen.Diferencia_valor_absoluto.toLocaleString("es")} readOnly className=" form-control text-end"  /></div>
                                            </div>
                                            <div  className="mt-2 mb-2   col-md-12 col-lg-6" >
                                                <label className="form-label">Cuadratura Items (%)</label>    
                                                <div ><input type="text" name="cuadit" id="cuadit"   value={resumen.Porc_cuadratura_items}  readOnly className=" form-control text-end" /></div>
                                            </div> 
                            </div>                
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>  
            </Container>
        </Container>    
            {/*********** cuadro de dialogo para msj de api **********/}
            <MsgModalDialogEspecial
                Show={msgDlgShowGen}
                Title={`Muestras`}
                Icon="x"
                Message="No hay datos que exportar"
                BtnOkName="Aceptar"
                BtnNokName=""
                HandlerClickOk={()=>setMsgDlgShowGen(false)}
                HanlerdClickNok={null}
            />  

            {/*********** cuadro de dialogo para msj de api **********/}
            <MsgDialog
                Show={msgShowPublicar}
                Title={`Muestras`}
                Icon="x"
                Message={`¿Está seguro de publicar la muestra ${formData.Muestra.split("-")[0]}?`}
                BtnOkName="Confirmar"
                BtnNokName="Cancelar"
                HandlerClickOk={apiPublicar}
                HanlerdClickNok={()=>setMsgShowPublicar(false)}
            />  

            {/*********** otro cuadro de dialogo para msj de api **********/}
            <MsgModalDialogEspecial
                Show={showResPublicar}
                Title={`Muestras`}
                Icon="x"
                Message={msgResPublicar}
                BtnOkName="Aceptar"
                BtnNokName=""
                HandlerClickOk={()=>resetPage()}
                HanlerdClickNok={null}
            />    

            {/*********** cuadro de dialogo para detalle Muestra **********/}
            <MsgModalDetalleMuestras
                Show={modalDetalleMuestra}
                BtnOkName="Aceptar"
                HandlerClickOk={()=>setModalDetalleMuestra(false)}
                data={element}
                formData={formData}
            />                         

            <LocalMsgModalSpinner 
                Show={sHCarga}
                text="Un momento por favor, procesando..."
                color="#FF7588"
            />           
        </>
    );
}

export default AvanceCierreMuestrasPage;