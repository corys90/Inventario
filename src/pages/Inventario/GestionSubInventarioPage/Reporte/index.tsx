import { useState } from "react";
import { Button} from "react-bootstrap"
import DataTable from "react-data-table-component";
import { httpApiGetText } from "../../../../lib";
import * as env from '../../../../env';    
import MsgModalDialogEspecial from "../../../../components/MsgModalDialogEspecial";
import LocalMsgModalSpinner from "../../../../components/LocalMsgModalSpinner";
import { exportToExcel } from "../../../../util";

const Reporte = (props: any) =>{

    let arrStr: string[] = [];
    let [estado, setEstado] = useState("");
    let [subinventario, setSubinventario] = useState("");    
    let [records, setRecords] = useState([]); 
    let [referencia, setReferencia] = useState(arrStr);       
    const [msgDlgShowApiResponse, setMsgDlgShowApiResponse] = useState(false);
    const [msgRespuestInv, setMsgRespuestInv] = useState("");  
    const [sHCarga, setSHCarga] = useState(false);    

    let columns = [
        { name: "Código", selector: (row:any) => row.Codigo_Rosen, sortable: true, grow:2},
        { name: "E", selector: (row:any) => row.Especial, sortable: true},
        { name: "Descripción", selector: (row:any) => row.Descripcion,  sortable: true, grow:4},
        { name: "UM", selector: (row:any) => row.Unidad_Medida, sortable: true}, 
        { name: "Saldo SAP", selector: (row:any) => row.Saldo_SAP, sortable: true, grow:2, right:true},
        { name: "Saldo Ctrl. Cal", selector: (row:any) => row.Control_Cal_SAP, sortable: true, grow:2, right:true},
        { name: "Bloqueado", selector: (row:any) => row.Bloqueado, grow:2, right:true, sortable: true},    
        { name: "Total SAP", selector: (row:any) => row.Total_Stock_SAP, sortable: true, grow:1, right:true},
        { name: "Acumulado", selector: (row:any) => row.Total_Stock_Bodega, sortable: true, grow:2, right:true},
        { name: "Saldo Final", selector: (row:any) => row.Diferencia, grow:2, right:true, sortable: true},          
        { name: "Valor Diferencia", selector: (row:any) => row.Diferencia_Valorizada, sortable: true, grow:3, right:true},
        { name: "Clasificación", selector: (row:any) => row.Clasificacion, grow:3, right:true, sortable: true},               
    ]    

    const pagOptions = {
        rowsPerPageText: "Filas por páginas",
        rangeSeparatorText: "de",
        selectAllRowsItem: true,
        selectAllRowsItemText: "Todos"
    }; 

    const Reporte = async () =>{
        referencia = [];
        setReferencia([...referencia]);
        records = [];
        setRecords([...records]);        
        if (estado !== ""){
            const recurso = `${env.REACT_APP_API_URL_DEV}/api/PeriodoSub?Pais=CL&Anno=${props.formData.Anno}&Mes=${props.formData.Mes}&Centro=${props.formData.Centro}&Almacen=${props.formData.Almacen}&Estado=${estado}`;     
            const response = await httpApiGetText(recurso,{
                'Content-Type': 'application/json',
                'Rosen-API-Key': '2B89CE9E-47DF-4EF1-8353-CF0C18EE029F',
                'Rosen-API-Secret': 'EFCFA469-8474-4DCF-B84A-CB1B0835ABDA-CDDC8DDB-6E6E-47CB-9422-B8A4312EC01A',
            });

            const arrDta = await JSON.parse(response.message); 
            arrDta.map((obj:any)=>{
                referencia.push(obj.Subinventario_Id);
            });
            setReferencia([...referencia]);
        }
    }

    const handler = async (e: any) => {
        const filtro = e.target.value;
        estado = filtro;
        setEstado(filtro);
        Reporte();
    } 
    
    const ApiGrilla = async() => {

        const recurso = `${env.REACT_APP_API_URL_DEV}/api/ReportInventario?Pais=CL&Anno=${props.formData.Anno}&Mes=${props.formData.Mes}&Centro=${props.formData.Centro}&Almacen=${props.formData.Almacen}` + 
                        `&Diferencias=0&Subinventario_Id=${subinventario}`;     
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
        }else{
            setRecords(arrDta.Detalle);
        }
    }

    const hndlrSubInv = (e: any) =>{
        const filtro = e.target.value;
        subinventario = filtro;
        setSubinventario(filtro);
        ApiGrilla();      
    }          

    return(
        <>
            <div className="row d-flex flex-row m-4 ">
                <div className="mb- col-md-12 col-lg-3" >
                    <label className="form-label">Estado</label>    
                    <div>
                        <select  className="form-select "  aria-label="Default select example" value={estado} onChange={(e) => handler(e)} id="estado">
                                <option key={-1} value={""}>Seleccione una opción</option>
                                {
                                    props.estados.map((opcion: string, index: number)=><option key={index} value={opcion}>{(opcion === "A") ? "ABIERTO": "CERRADO"}</option>)
                                }
                        </select>  
                    </div>
                </div>
                <div className="mb- col-md-12 col-lg-3" >
                    <label className="form-label">Sub Inventario</label>    
                    <div>
                        <select  className="form-select "  aria-label="Default select example" value={subinventario} onChange={(e) => hndlrSubInv(e)} id="subInventario">
                                <option key={-1} value={""}>Seleccione una opción</option>
                                {
                                    referencia.map((opcion: string, index: number)=><option key={index} value={opcion}>{opcion}</option>)
                                }
                        </select>  
                    </div>
                </div>
            </div>
            <div className=" row align-items-center mt-4 ms-3">
                <div className=" col-md-12 col-lg-8 " > 
                    <Button type="button" className="border-0" style={{backgroundColor:"#16D39A"}} disabled={(records.length <= 0)}
                        onClick={()=>exportToExcel("TablaReporteSubInventario", records)}
                    >
                        Exportar
                    </Button>
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
                    onSelectedRowsChange={(e: any)=>console.log("OnSelect: ", e)}
                />                                 
            </div>  
            <MsgModalDialogEspecial
                Show={msgDlgShowApiResponse}
                Title={`Gestión inventario`}
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
    )
};

export default Reporte;