import { useState } from "react";
import { Accordion, Button, Container} from "react-bootstrap";
import { FaCalendarAlt, FaTruck } from "react-icons/fa";
import LocalMsgModalSpinner from "../../../components/LocalMsgModalSpinner";
import MultiselectOptions from "../../../components/MultiselectOptions";
import { httpApiGetText } from "../../../lib";
import * as env from '../../../env';
import './style.css';
import MsgModalDialogEspecial from "../../../components/MsgModalDialogEspecial";
import { exportToExcel } from "../../../util";
import DataTable from "react-data-table-component";
import BarraMenuHz from "../../../components/BarraMenoHz";

const  Resumen = {
    Diferencia_valor_absoluto     :0,
    Diferencia_valor_contable     :0,
    Inventario_fisico_valorizado  :0,
    Inventario_sistema_valorizado :0,
    Items_Cuadrados               :0,
    Porc_cuadratura_items         :0,
    Porc_descuadre                :0,
    Total_items                   :0, 
}

const InformeSaldosPage = () =>{

    const [centroAlmacenes, setCentroAlmacenes] = useState([])
    const [records, setRecords] = useState([]);    
    const [sHCarga, setSHCarga] = useState(false);
    let [formData, setFormData] = useState({ Pais: "CL", Anno: "", Mes: "", Centro: "", Almacen: ""});
    const [msgDlgShowApiResponse, setMsgDlgShowApiResponse] = useState(false);   
    const [msgRespuestInv, setMsgRespuestInv] = useState(""); 
    const [resumen, setResumen] = useState(Resumen);
    const [btnToExcel, setBtnToExce] = useState(true);    

    let columns = [
        { name: "Centro", selector: (row:any) => row.Centro, sortable: true},
        { name: "Almacén", selector: (row:any) => row.Almacen, sortable: true},
        { name: "Total ítems", selector: (row:any) => row.Total_items},
        { name: "Ítem Cuadrados", selector: (row:any) => row.Items_Cuadrados,  sortable: true, right:true},
        { name: "Inv. Físico Valorizado", selector: (row:any) => row.Inventario_fisico_valorizado, right:true}, 
        { name: "Inv. Sistema Valorizado", selector: (row:any) => row.Inventario_sistema_valorizado, sortable: true, right:true},
        { name: "Dif. Valor Contable", selector: (row:any) => row.Diferencia_valor_contable, sortable: true, right:true},
        { name: "Dif. Valor Absoluto", selector: (row:any) => row.Diferencia_valor_absoluto, right:true},
        { name: "% Descuento", selector: (row:any) => row.Porc_descuadre,  sortable: true, right:true},
        { name: "% Descuadre Valorizado", selector: (row:any) => row.Porc_descuadre_valorizado, sortable: true, right:true},
        { name: "% Cuadratura Ïtems", selector: (row:any) => row.Porc_cuadratura_items, right:true},
        { name: "Hora", selector: (row:any) => row.Hr, sortable: true, grow: 2},      
    ];

    const pagOptions = {
        rowsPerPageText: "Filas por páginas",
        rangeSeparatorText: "de",
        selectAllRowsItem: true,
        selectAllRowsItemText: "Todos"
    };  

    const hndlrBtnBuscar = async () =>{
        setSHCarga(true);
        let cnts = "";
        let almc = "";        
        centroAlmacenes.map((dato: string)=>{
            cnts+= dato.split("-")[0].trim() + "|";
            almc+= dato.split("-")[1].trim() + "|";
        });
        cnts = cnts.substring(0, cnts.length-1);
        almc = almc.substring(0, almc.length-1);        

       const recurso = `${env.REACT_APP_API_URL_DEV}/api/ReporteInventarioGlobal?Pais=CL&Anno=${formData.Anno}&Mes=${formData.Mes}` + 
                        `&Centros=${cnts}&Almacenes=${almc}`;       
        const response = await httpApiGetText(recurso,{
            'Content-Type': 'application/json',
            'Rosen-API-Key': '2B89CE9E-47DF-4EF1-8353-CF0C18EE029F',
            'Rosen-API-Secret': 'EFCFA469-8474-4DCF-B84A-CB1B0835ABDA-CDDC8DDB-6E6E-47CB-9422-B8A4312EC01A',
        });
        const arrDta = await JSON.parse(response.message);        
        setSHCarga(false);        
        if (response.code >= 400){
            setMsgRespuestInv("No se pudo recuperar las información solicitada.");
            setMsgDlgShowApiResponse(true);
        }
        else{
            setResumen(arrDta.Resumen);
            const auxDta:any = [];
            if (arrDta.Detalle.length > 0){  
                arrDta.Detalle.map((obj: any, index: number)=>{
                    const newObj = {
                        ...obj,
                    };
                    auxDta.push(newObj);  
                }); 
                //********Pasa el objeto a arreglo para recorrido en table
                setRecords(auxDta);           
            }else{
                setRecords([]); 
            }    
            setBtnToExce(!(arrDta.Detalle.length  > 0));         
        }
    }

    const hndlrPeriodo = async (evnt: any) =>{
        const f: Date = evnt.target.value; 
        const yy = f.toString().split('-')[0];
        const mm = f.toString().split('-')[1];
        formData = {...formData, Anno: yy, Mes: mm};
        setFormData(formData);      
    }

    const selections = (opcions: []) =>{
        setCentroAlmacenes([...opcions]);
    }

    return(
        <>
            <Container fluid>
            <BarraMenuHz/>  
                <div >
                    <div className="text-primary ms-3 mt-3">
                            Home / Consulta / Informe de Saldos
                    </div>
                    <div className="h4 mt-4 mb-4 ms-3">INFORME DE SALDOS</div>
                </div> 
                <Container fluid>               
                    <Accordion  className="mb-4" defaultActiveKey={['0']} alwaysOpen>
                        <Accordion.Item eventKey="0" className="border shadow ">
                            <Accordion.Header><div className=" h5 text-dark">PARÁMETROS INFORMES</div></Accordion.Header>
                            <Accordion.Body>
                                <label className="h6 mb-3">Recuerda completar todos los campos con *</label> 
                                <div className="align-middle">
                                    <FaCalendarAlt className="h5" /> 
                                    <label className="ms-2 h4 ">Periodo</label>
                                </div>
                                <hr className="t-0 m-0 mb-3" />
                                <div  className="d-flex flex-column col-md-12 col-lg-6">
                                    <label className="m-2 ">Mes/Año</label>
                                    <input type="month" id="periodo" size={8}  className="ms-2"
                                        onChange={hndlrPeriodo}
                                        value={`${formData.Anno}-${formData.Mes}`} 
                                        min="1990-01" max="9999-12"
                                    />
                                </div>
                                <div className="align-middle mt-4">
                                    <FaTruck className="h5" /> 
                                    <label className="ms-2 h4 ">Centro y Almacenes</label>
                                </div>
                                <hr className="t-0 m-0 mb-3" /> 

                                <div className="mb-3">
                                    <div className="mb-3 col-md-12 col-lg-12" >
                                        <label className="form-label">Seleccionar Centros de Distribución, Almacenes automaticamente seleccionados </label>    
                                    </div>
                                    <MultiselectOptions 
                                        OnSelectedOptions={selections}
                                    />
                                </div>
                                <div className="text-end">
                                    <Button type="button" disabled={!((centroAlmacenes.length > 0) && (formData.Anno !== ""))} 
                                    style={{backgroundColor:"#00B5B8"}} className=" btn border border-0" onClick={hndlrBtnBuscar}
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
                                    <div className=" mt-4 mb-4">
                                        <div className=" col-md-12 col-lg-8 " > 
                                            <Button type="button" className="border-0" style={{backgroundColor:"#16D39A"}}
                                                disabled={btnToExcel}
                                                onClick={async ()=> exportToExcel("tablaInformeSaldos", records)}>
                                                Exportar
                                            </Button>
                                        </div>               
                                    </div>            
                                    <DataTable
                                        columns={columns}
                                        data={records}
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
                            <Accordion.Body  className=" p-2 mb-2 ">
                                <div className="row">
                                    <div  className="mt-2 mb-2 col-md-12 col-lg-3" >
                                        <label className="form-label">Total Items</label>    
                                        <div><input type="text" name="totItems" id="totItems" value={resumen.Total_items} readOnly className=" form-control text-end" /></div>
                                    </div>
                                    <div  className="mt-2 mb-2  col-md-12 col-lg-3" >
                                        <label className="form-label">Items Cuadrados</label>    
                                        <div ><input type="text" name="ifv" id="ifv" value={resumen.Items_Cuadrados} readOnly   className=" form-control text-end" /></div>
                                    </div>
                                    <div  className="mt-2 mb-2   col-md-12 col-lg-3" >
                                        <label className="form-label">Inv. Físico valorizado ($)</label>    
                                        <div ><input type="text" name="valneg" id="valneg" value={resumen.Inventario_fisico_valorizado.toLocaleString("es")} readOnly   className=" form-control text-end" /></div>
                                    </div>
                                    <div  className="mt-2 mb-2   col-md-12 col-lg-3" >
                                        <label className="form-label">Inv. Sistema valorizado ($)</label>    
                                        <div ><input type="text" name="dvc" id="dvc" value={resumen.Inventario_sistema_valorizado.toLocaleString("es")} readOnly  className=" form-control text-end" /></div>
                                    </div>
                                    <div  className="mt-2 mb-2   col-md-12 col-lg-3" >
                                        <label className="form-label">Diferencia valor contable ($)</label>    
                                        <div ><input type="text" name="div" id="div" value={resumen.Diferencia_valor_contable.toLocaleString("es")} readOnly className=" form-control text-end"  /></div>
                                    </div>
                                    <div  className="mt-2 mb-2    col-md-12 col-lg-3" >
                                        <label className="form-label">Diferencia valor absoluto ($)</label>    
                                        <div ><input type="text" name="itcuad" id="itcuad"  value={resumen.Diferencia_valor_absoluto.toLocaleString("es")} readOnly className=" form-control text-end" /></div>
                                    </div>
                                    <div  className="mt-2 mb-2    col-md-12 col-lg-3" >
                                        <label className="form-label">Porcentaje Descuadre (%)</label>    
                                        <div ><input type="text" name="isv" id="isv"  value={resumen.Porc_descuadre.toLocaleString("es")} readOnly   className=" form-control text-end" /></div>
                                    </div>
                                    <div  className="mt-2 mb-2   col-md-12 col-lg-3" >
                                        <label className="form-label">Porcentaje Cuadratura Items (%)</label>    
                                        <div ><input type="text" name="valpos" id="valpos"  value={resumen.Porc_cuadratura_items.toLocaleString("es")} readOnly   className=" form-control text-end" /></div>
                                    </div> 
                                </div>                                                   
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion> 
                </Container>                     
            </Container>
            {/*********** cuadro de dialogo para msj de api **********/}
            <MsgModalDialogEspecial
                Show={msgDlgShowApiResponse}
                Title={`Informe de saldos`}
                Icon="x"
                Message={msgRespuestInv}
                BtnOkName="Aceptar"
                BtnNokName=""
                HandlerClickOk={()=>setMsgDlgShowApiResponse(false)}
                HanlerdClickNok={null}
            />  
            <LocalMsgModalSpinner 
                Show={sHCarga}
                text="Un momento por favor, procesando..."
                color="#FF7588"
            />               
        </>
    );
}

export default InformeSaldosPage;
