import { useState } from "react";
import { Accordion, Button, Container} from "react-bootstrap";
import DataTable from "react-data-table-component";
import { FaCalendarAlt, FaTruck, FaUpload} from "react-icons/fa";
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
import ModalCargaMasiva from "./ModalCargaMasiva";

const objReconteo = {
    Reconteo: "",
    Pais: "",
    Anno: "",
    Mes: "",
    Centro: "",
    Almacen: "",
    Codigo: "",
    E: null,
    Descripcion: "",
    Un: "",
    Precio: 0,
    Sistema:0,
    CCSistema: 0,
    Bloqueado: 0,
    ValorSistema: 0,
    Fisico: 0,
    ValorFisico: 0,
    Diferencia: 0,
    ValorDiferencia: 0,
    Clasificacion1: "",
    Clasificacion2: "",
    Clasificacion: "",
    Base_Sistema: 0,
    Base_CCSistema: 0,
    Base_Bloqueado: 0,
    Base_Fisico: 0,
    Base_Precio: 0
}

const AperturaReconteoPage = () =>{

    let [codeSi, setCodeSi] = useState([""]);
    const [records, setRecords] = useState([]);
    const [showCargaMasiva, setShowCargaMasiva] = useState(false);
    const [sHCarga, setSHCarga] = useState(false);
    const [hbltBtnAbrir, setHbltBtnAbrir] = useState(true);
    const [msgAbrirPeriodoReconteo, setMsgAbrirPeriodoReconteo] = useState(false);    
    const [hbltCargaMasiva, setHbltCargaMasiva] = useState(true);
    let [formData, setFormData] = useState({ Pais: "CL", Anno: "", Mes: "", Centro: "", Almacen: ""});
    const [msgDlgShowApiResponse, setMsgDlgShowApiResponse] = useState(false);
    const [msgRespuestInv, setMsgRespuestInv] = useState("");
    let dt: any = useSelector((state: any) => state.datatable);
    let emp: any = useSelector((state: any) => state.emp);
    const dispatch = useDispatch();   

    let columns = [
        { name: "Código", selector: (row:any) => row.Codigo, sortable: true},
        { name: "E", selector: (row:any) => row.E, sortable: true},
        { name: "Descripción", selector: (row:any) => row.Descripcion, grow: 4},
        { name: "Unidad", selector: (row:any) => row.Un,  sortable: true, right:true},
        { name: "Precio", selector: (row:any) => row.Precio, right:true, grow: 2}, 
        { name: "Sistema", selector: (row:any) => row.Sistema, sortable: true, right:true},
        { name: "CC Sistema", selector: (row:any) => row.CCSistema, sortable: true, right:true, grow: 2},
        { name: "Bloqueado", selector: (row:any) => row.Bloqueado, right:true},
        { name: "Valor sistema", selector: (row:any) => row.ValorSistema,  sortable: true, right:true, grow: 3},
        { name: "Físico", selector: (row:any) => row.Fisico, sortable: true, right:true},
        { name: "Valor Físico", selector: (row:any) => row.ValorFisico, right:true},
        { name: "Diferencia", selector: (row:any) => row.Diferencia, sortable: true, right: true, grow: 2},
        { name: "Valor Diferencia", selector: (row:any) => row.ValorDiferencia, sortable: true, right: true, grow: 2},         
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
        ValidaBtnFiltrat();             
    }

    const hndlrBtnBuscar = async () =>{
        setSHCarga(true);
        const recurso = `${env.REACT_APP_API_URL_DEV}/api/CodigosReconteo?Pais=CL&Anno=${formData.Anno}&Mes=${formData.Mes}&Centro=${formData.Centro}&Almacen=${formData.Almacen}`;     
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
            setHbltCargaMasiva(true);  
            dt = [...auxDta];
            dispatch(SetDataTable(dt));
            setRecords(auxDta);              
        }
        else{

            if (arrDta.Detalle.length > 0){  
                arrDta.Detalle.map((valor: any, index: number)=>{
                    const newObj = {
                        ...valor
                    }
                    auxDta.push(newObj);
                }); 
                //********Pasa el objeto a arreglo para recorrido en table
                dt = [...auxDta];
                dispatch(SetDataTable(dt));
                setRecords(auxDta);    
                setHbltCargaMasiva(false);    
            }else{
                setHbltCargaMasiva(true);  
            }       
        }
    }

    const ValidaBtnFiltrat = () => {
        if ((formData.Anno !== "") &&
            (formData.Almacen !== "") && 
            (formData.Centro !== "")){
                setHbltBtnAbrir(false);
        }else{
                setHbltBtnAbrir(true);
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
    
    const MsgDlghandlerResponseApi = () =>{
        setMsgDlgShowApiResponse(false);
    }  

    const preselectedCodeSi = (code: any) =>{
        setCodeSi(code);
    }

    const criteriPreselectable = (row: any) => (codeSi.length > 0) ?( codeSi.filter((cd: string) => cd === row.Codigo).length > 0): false

    const AperturaPeriodos = async ()=>{
        if (codeSi.length > 0) {
            // se hace le proceso de llamado a la Api
            interface tipoObjItem  {Pais: string, Anno:string, Mes:string, Centro: string, Almacen:string, Inv_item_id:string}
            const arrReconteo: tipoObjItem[] = [];
            setSHCarga(true);
            codeSi.map((code:string)=>{
                const reconteoObj: tipoObjItem = {
                    Pais : "CL",
                    Anno : formData.Anno,
                    Mes : formData.Mes,
                    Centro : formData.Centro,
                    Almacen: formData.Almacen,
                    Inv_item_id : code
                };
                arrReconteo.push(reconteoObj);
            });
            const postReconteo: any = {
                Pais : "CL",
                Anno : formData.Anno,
                Mes : formData.Mes,
                Centro : formData.Centro,
                Almacen: formData.Almacen,
                Usuario : emp.user,
                RConsolidadoReconteo: arrReconteo
            };
            const recurso = `${env.REACT_APP_API_URL_DEV}/api/Reconteos`;     
            const response = await httpApiPostText(recurso,"POST", {
                'Content-Type': 'application/json',
                'Rosen-API-Key': '2B89CE9E-47DF-4EF1-8353-CF0C18EE029F',
                'Rosen-API-Secret': 'EFCFA469-8474-4DCF-B84A-CB1B0835ABDA-CDDC8DDB-6E6E-47CB-9422-B8A4312EC01A',
            }, postReconteo);  
            const arrDta = await JSON.parse(response.message);      
            setSHCarga(false); 
            if (response.code >= 400){
                setMsgRespuestInv(`${arrDta.Mensaje}`) 
            }else{
                setMsgRespuestInv(`Código de Reconteo : ${arrDta.CodReconteo}. ${arrDta.Mensaje}`)                
            }
            setMsgDlgShowApiResponse(true);
        } else{
            setMsgAbrirPeriodoReconteo(true);
        }
        setCodeSi([]);        
    }

    const updateCodeSi = (arrObj: any) =>{
        codeSi = [];
        arrObj.selectedRows.map((obj: typeof objReconteo)=>{
            codeSi.push(obj.Codigo);
        });
    }

    return(
        <Container fluid>
            <BarraMenuHz/>  
            <div >
                <div className="text-primary ms-3 mt-3">
                        Home / Reconteo / Apertura de Reconteo
                </div>
                <div className="h4 mt-4 mb-4 ms-3">APERTURA DE RECONTEO</div>
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
                                    disabled={hbltBtnAbrir}  onClick={hndlrBtnBuscar} style={{backgroundColor: "#00B5B8"}}
                                >
                                    Filtrar
                                </Button>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>         

                <Accordion className="mt-1" defaultActiveKey={['0']} alwaysOpen>
                    <Accordion.Item eventKey="0" className="border shadow ">
                        <Accordion.Header><div className=" h5 text-dark">RECONTEO</div></Accordion.Header>
                        <Accordion.Body>
                            <div className="text-start mb-4">
                                    <Button type="button"  className="btn-lg me-2 border-0" style={{backgroundColor:"#16D39A"}}>
                                        <label htmlFor="" className="" onClick={()=>AperturaPeriodos()}>Abrir</label>
                                    </Button>                                
                                    <Button type="button" className="ms-1 border-0" style={{backgroundColor:"#2DCEE3"}}
                                        disabled={hbltCargaMasiva}
                                        onClick={()=>setShowCargaMasiva(true)}
                                    >
                                        <FaUpload className=" m-2"/>Carga masiva
                                    </Button>
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
                                onSelectedRowsChange={(e: any)=>updateCodeSi(e)}
                                selectableRowSelected={criteriPreselectable}
                            />                               
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>  
            </Container>
            <ModalCargaMasiva 
                Show={showCargaMasiva}
                Title="Carga masiva"
                BtnOkName="Cargar archivo"
                BtnNokName="Cerrar"
                HandlerClickOk={()=>alert("Ok")}
                HanlerdClickNok={()=>setShowCargaMasiva(false)}
                HandlerPreselected={preselectedCodeSi}
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
            
            <MsgDialog
                Show={msgAbrirPeriodoReconteo}
                Title='Apertura de Reconteo'
                BtnOkName='Cerrar'
                HandlerClickOk={()=>setMsgAbrirPeriodoReconteo(false)}
                Message="Para abrir períodos, debe seleccionar al menos un código de producto"
                Icon='x'
                BtnNokName=''
                HanlerdClickNok={()=>setMsgAbrirPeriodoReconteo(false)}
            />  

            <LocalMsgModalSpinner 
                Show={sHCarga}
                text="Un momento porfavor, procesando..."
                color="#FF7588"
            />              
        </Container>
    );
}

export default AperturaReconteoPage;
