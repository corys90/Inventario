import { useState } from "react";
import { Accordion, Button, Container} from "react-bootstrap";
import { FaCalendarAlt, FaTimesCircle, FaTruck } from "react-icons/fa";
import SelectAlmacenes from "../../../components/Almacenes";
import SelectCentro from "../../../components/Centros";
import LocalMsgModalSpinner from "../../../components/LocalMsgModalSpinner";
import MsgModalDialogEspecial from "../../../components/MsgModalDialogEspecial";
import { httpApiGetText, httpApiPostText } from "../../../lib";
import * as env from '../../../env';
import DataTable from "react-data-table-component";
import MsgDialogEspecial from "../../../components/MsgDialogEspecial";
import { useSelector } from "react-redux";
import BarraMenuHz from "../../../components/BarraMenoHz";

   
const TratamientoEtiquetaPage = () =>{

    let [formData, setFormData] = useState({ Pais: "CL", Anno: "", Mes: "", Centro: "", Almacen: ""});
    let [formData2, setFormData2] = useState({ Centro2: "", Almacen2: ""});   
    const [hbltBtnAbrir, setHbltBtnAbrir] = useState(true);
    const [hbltBtnAbrir2, setHbltBtnAbrir2] = useState(true);    
    const [sHCarga, setSHCarga] = useState(false);
    const [msgDlgShowApiResponse, setMsgDlgShowApiResponse] = useState(false);
    const [msgRespuestInv, setMsgRespuestInv] = useState("");  
    const [records, setRecords] = useState([]);   
    const [rowSelected, setRowSelected] = useState([]);     
    const [msgDlgShowGen, setMsgDlgShowGen] = useState(false); 
    const [msgDlgShowCambio, setMsgDlgShowCambio] = useState(false);      
    const [body, setBody] = useState({});  
    const emp: any = useSelector((state: any) => state.emp);               
    
    let columns = [
        { name: "Código", selector: (row:any) => row.Inv_item_id, sortable: true, grow: 2},
        { name: "Descripción", selector: (row:any) => row.Descripcion, grow: 4, sortable: true},
        { name: "Serial", selector: (row:any) => row.Serial, sortable: true, grow:4},
        { name: "Cantidad", selector: (row:any) => row.Cantidad, sortable: true, right:true, grow:2},
        { name: "Acciones", selector: (row:any) => row.Acciones, grow:2},
    ]

    const pagOptions = {
        rowsPerPageText: "Filas por páginas",
        rangeSeparatorText: "de",
        selectAllRowsItem: true,
        selectAllRowsItemText: "Todos"
    };     

    const ValidaBtnAbrir = () => {
        if ((formData.Anno !== "") &&
            (formData.Almacen !== "") && 
            (formData.Centro !== "")){
                setHbltBtnAbrir(false);
        }else{
                setHbltBtnAbrir(true);
        }
    }

    const ValidaBtnAbrir2 = () => {
        if ((formData2.Almacen2 !== "") && (formData2.Centro2 !== "")){
                setHbltBtnAbrir2(false);
        }else{
                setHbltBtnAbrir2(true);
        }
    }
    
    const btnBorrarEtiqueta = async (bdy:any) => {
        setMsgDlgShowGen(false);
        const body = {
            ...formData,
            Inv_item_id:bdy.Inv_item_id,
            Nro_documento: bdy.Nro_documento,
            Serial:bdy.Serial,
            Cantidad:bdy.Cantidad,
            Usuario: emp.user
        };
        setSHCarga(true);
        const recurso = `${env.REACT_APP_API_URL_DEV}/api/Etiquetas`;     
        const response = await httpApiPostText(recurso, "DELETE", {
            'Content-Type': 'application/json',
            'Rosen-API-Key': '2B89CE9E-47DF-4EF1-8353-CF0C18EE029F',
            'Rosen-API-Secret': 'EFCFA469-8474-4DCF-B84A-CB1B0835ABDA-CDDC8DDB-6E6E-47CB-9422-B8A4312EC01A',
        }, body);
        const arrDta = await JSON.parse(response.message);
        setSHCarga(false);
        setMsgRespuestInv(arrDta.Message);
        setMsgDlgShowApiResponse(true);
    } 
    
    const borraEtiquetaPickeada = async (bdy:any)=>{
        setMsgDlgShowGen(true);
        setBody(bdy);  
    }   
        
    const hndlrBtnBuscar = async () =>{
        setSHCarga(true);
        const recurso = `${env.REACT_APP_API_URL_DEV}/api/Etiquetas?Pais=CL&Anno=${formData.Anno}&Mes=${formData.Mes}&Centro=${formData.Centro}&Almacen=${formData.Almacen}`;     
        const response = await httpApiGetText(recurso,{
            'Content-Type': 'application/json',
            'Rosen-API-Key': '2B89CE9E-47DF-4EF1-8353-CF0C18EE029F',
            'Rosen-API-Secret': 'EFCFA469-8474-4DCF-B84A-CB1B0835ABDA-CDDC8DDB-6E6E-47CB-9422-B8A4312EC01A',
        });
        setSHCarga(false);
        const arrDta = await JSON.parse(response.message);     
        if (response.code >= 400){
            setMsgRespuestInv(arrDta);
            setMsgDlgShowApiResponse(true);
        }
        else{      
            const auxDta:any = [];
            arrDta.map((obj: any, index: number)=>{
                const newObj = {
                    ...obj, 
                    Acciones: <div>                                                                     
                                <a href="#!" id={`${index}`}  onClick={()=>{
                                        borraEtiquetaPickeada(obj);
                                    }} >
                                    <FaTimesCircle title="Elimina etiqueta" color={'white'}   className='bg-danger rounded-circle p-1 h4'/>
                                </a>   
                             </div>
                };
                auxDta.push(newObj);
            });            
            setRecords(auxDta);                       
        }
        setFormData2({ Centro2: "", Almacen2: ""});
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
        formData = {...formData, [evnt.target.id]: evnt.target.value.split("-")[0].trim(), Almacen: ""};
        setFormData(formData); 
        ValidaBtnAbrir();    
    }

    const hndlrOpcionCentro2 = (evnt: any) =>{
        formData2 = {...formData2, [evnt.target.id]: evnt.target.value.split("-")[0].trim(), Almacen2: ""};
        setFormData2(formData2); 
        ValidaBtnAbrir2();    
    }

    const hndlrOpcionAlmacen = (evnt: any) =>{
        formData = {...formData, [evnt.target.id]: evnt.target.value.split("-")[0].trim()};
        setFormData(formData); 
        ValidaBtnAbrir();                  
    }

    const hndlrOpcionAlmacen2 = (evnt: any) =>{
        formData2 = {...formData2, [evnt.target.id]: evnt.target.value.split("-")[0].trim()};
        setFormData2(formData2); 
        ValidaBtnAbrir2();                  
    }    
    
    const MsgDlghandlerResponseApi = () =>{
        setMsgDlgShowApiResponse(false);
    } 

    const rowSelectedDelete = (obj: any) =>{
        setRowSelected(obj.selectedRows);
    } 

    const deleteRowsSelected = () =>{
        setMsgDlgShowCambio(true);
    }    
    
    const btnCambiaEtiquetas = async() =>{
        setMsgDlgShowCambio(false);  
        setSHCarga(true);              
        const arrAux: { Pais: string; Anno: any; Mes: any; Centro: any; Almacen: any; AlmacenDest: any; Inv_item_id: any; Nro_documento: any; Serial: any; }[] = [];
        rowSelected.map((obj: any)=>{
            const newObj = {
                Pais: "CL",
                Anno: obj.Anno,
                Mes: obj.Mes,
                Centro: obj.Centro,
                Almacen: obj.Almacen,
                AlmacenDest: obj.AlmacenDest,
                Inv_item_id: obj.Inv_item_id,
                Nro_documento: obj.Nro_documento,
                Serial: obj.Serial
            };
            arrAux.push(newObj);
        });

        const recurso = `${env.REACT_APP_API_URL_DEV}/api/Etiquetas`;     
        const response = await httpApiPostText(recurso, "POST", {
            'Content-Type': 'application/json',
            'Rosen-API-Key': '2B89CE9E-47DF-4EF1-8353-CF0C18EE029F',
            'Rosen-API-Secret': 'EFCFA469-8474-4DCF-B84A-CB1B0835ABDA-CDDC8DDB-6E6E-47CB-9422-B8A4312EC01A',
        }, arrAux);
        setSHCarga(false);
        const arrDta = await JSON.parse(response.message);     
        if (response.code >= 400){
            setMsgRespuestInv(arrDta.Message);
        }else{
            setMsgRespuestInv(arrDta);
        }
        setMsgDlgShowApiResponse(true);
    }     
   
    return(
        <>
            <Container fluid>
            <BarraMenuHz/>  
                <div >
                    <div className="text-primary ms-3 mt-3">
                            Home / Inventario / Tratamiento Etiquetas
                    </div>
                    <div className="h4 mt-4 mb-4 ms-3">TRATAMIENTO DE ETIQUETAS</div>
                </div>  
                <Container fluid >
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
                                        value={`${formData.Anno}-${formData.Mes}`}
                                        onChange={hndlrPeriodo} 
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
                                        <div><SelectCentro id="Centro" OnSeleccion={hndlrOpcionCentro} /></div>
                                    </Container>
                                    <Container fluid className="mb-3  col-md-12 col-lg-6" >
                                        <label className="form-label">Seleccionar Almacen </label>    
                                        <div ><SelectAlmacenes  id="Almacen" centro={formData.Centro} OnSeleccion={hndlrOpcionAlmacen} /></div>
                                    </Container>
                                </div>

                                <div className="text-end">
                                    <Button type="button" style={{backgroundColor:"#00B5B8"}} className=" btn border border-0" 
                                        disabled={hbltBtnAbrir} onClick={() => hndlrBtnBuscar()}
                                    >
                                        Filtrar
                                    </Button>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>         

                    <Accordion className="mt-3" defaultActiveKey={['0']} alwaysOpen>
                        <Accordion.Item eventKey="0" className="border shadow ">
                            <Accordion.Header><div className=" h5 text-dark"></div></Accordion.Header>
                            <Accordion.Body>
                                <div className="row d-flex flex-row mb-3">
                                    <Container fluid className=" mb-3 col-md-12 col-lg-6 align-middle" >
                                        <label className="form-label">Centro</label>    
                                        <div><SelectCentro  id="Centro2" OnSeleccion={hndlrOpcionCentro2} /></div>
                                    </Container>
                                    <Container fluid className=" mb-3 col-md-12 col-lg-6 align-middle" >
                                        <label className="form-label">Almacén</label>    
                                        <div><SelectAlmacenes  id="Almacen2" centro={formData2.Centro2} OnSeleccion={hndlrOpcionAlmacen2}  /></div>
                                    </Container>
                                    <div className="text-end">
                                        <Button type="button" style={{backgroundColor:"#00B5B8"}}   disabled={hbltBtnAbrir2}  className=" btn border border-0" 
                                            onClick={()=>deleteRowsSelected()}
                                        >
                                            Cambiar
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
                                        onSelectedRowsChange={(e: any)=>rowSelectedDelete(e)}
                                    />  
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion> 
                </Container> 
            </Container>
                {/*********** cuadro de dialogo para pregunta genérica**********/}
                <MsgDialogEspecial
                    Show={msgDlgShowGen}
                    Title={`Tratamiento Etiquetas`}
                    Icon="!"
                    Message={"¿Desea eliminar Etiqueta Pickeada?"}
                    BtnOkName={"Sí. Eliminar"}
                    BtnNokName="No, cancelar"
                    HandlerClickOk={btnBorrarEtiqueta}
                    HanlerdClickNok={() => setMsgDlgShowGen(false)}
                    body={body}
                />     
                {/*********** cuadro de dialogo para pregunta de cambio**********/}
                <MsgDialogEspecial
                    Show={msgDlgShowCambio}
                    Title={`Tratamiento Etiquetas`}
                    Icon="!"
                    Message={"¿Desea cambiar Centro/Almacen de etiqueta(s) seleccionada(s)?"}
                    BtnOkName={"Sí. Cambiar"}
                    BtnNokName="No, cancelar"
                    HandlerClickOk={btnCambiaEtiquetas}
                    HanlerdClickNok={() => setMsgDlgShowCambio(false)}
                    body={body}
                />                            
            {/*********** cuadro de dialogo para msj de api **********/}
            <MsgModalDialogEspecial
                Show={msgDlgShowApiResponse}
                Title={`Inventario`}
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

export default TratamientoEtiquetaPage;
