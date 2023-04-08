import { useEffect, useState } from "react";
import { Accordion, Button, Container, Form } from "react-bootstrap";
import { FaCalendarAlt, FaTruck, FaUpload } from "react-icons/fa";
import { useSelector } from "react-redux";
import SelectAlmacenes from "../../../components/Almacenes";
import SelectCentro from "../../../components/Centros";
import LocalMsgModalSpinner from "../../../components/LocalMsgModalSpinner";
import * as env from '../../../env';
import { httpApiPostText } from "../../../lib";
import DataTable from "react-data-table-component";
import { exportToExcel } from "../../../util";
import ModalCargaMasivaMuestras from "./ModalCargaMasivaMuestras";
import ModalAbrirPeriodo from "./ModalAbrirPeriodo";
import MsgDialog from "../../../components/MsgDialog";
import BarraMenuHz from "../../../components/BarraMenoHz";
  

const PeriodoMuestrasPage = () =>{

    const [hbltBtnAbrir, setHbltBtnAbrir] = useState(true); 
    let [formData, setFormData] = useState({ Pais: "CL", Anno: "", Mes: "", Centro: "", Almacen: ""});
    const [sHCarga, setSHCarga] = useState(false);
    const [negocio, setNegocio] = useState(new Array());    
    const [familia, setFamilia] = useState(new Array());        
    const [modelo, setModelo] = useState(new Array());   
    let [records, setRecords] = useState(new Array<any>());    

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
    
    const btnBuscar = async () =>{
        setSHCarga(true);
        const recurso = `${env.REACT_APP_API_URL_DEV}/api/MuestraInventario`;     
        const response = await httpApiPostText(recurso,"POST", {
        'Content-Type': 'application/json',
        'Rosen-API-Key': '2B89CE9E-47DF-4EF1-8353-CF0C18EE029F',
        'Rosen-API-Secret': 'EFCFA469-8474-4DCF-B84A-CB1B0835ABDA-CDDC8DDB-6E6E-47CB-9422-B8A4312EC01A',
        }, {...formData});
        const arrDta = await JSON.parse(response.message); 
        setSHCarga(false);
        if(response.code >= 400){
            console.log("Error Muestras - 400:", response, recurso);
        }else{     
            const auxDta:any = [];          
            arrDta.map((obj: any, index: number)=>{
                const newObj = {
                    ...obj,
                    Negocio:obj.Negocio.trim(),
                    Familia:obj.Familia.trim(),
                    Modelo:obj.Modelo.trim()
                };
                if (negocio.findIndex((dato: string)=>dato === obj.Negocio) === -1){
                    negocio.push(obj.Negocio.trim());
                }
                if (familia.findIndex((dato: string)=>dato === obj.Familia) === -1){
                    familia.push(obj.Familia.trim());
                }          
                if (modelo.findIndex((dato: string)=>dato === obj.Modelo) === -1){
                    modelo.push(obj.Modelo.trim());
                }                         
                auxDta.push(newObj);  
            });
            negocio.sort();
            negocio.unshift("TODOS"); 

            familia.sort();
            familia.unshift("TODOS");    

            modelo.sort();
            modelo.unshift("TODOS");                
            //dt = [...auxDta];
            //dispatch(SetDataTable(dt));   
            //setFamilia([...familia]);
            //setNegocio([...negocio]);
            //setModelo([...modelo]);     
            setRecords(auxDta);
        }       
    }


    /******************************************** */
    const TablaDeDatos = (props: any) =>{

        interface rec {
            chk: string,
            Codigo: string,
            Especial: String,
            Descripcion: string,
            Unidad_Medida: string,
            Saldo_sap: string,
            Control_cal_sap: string,
            Bloqueado: string,
            Total_sap: string,
            Costo_unitario: string,
            Negocio: string,
            Familia: string,
            Modelo: string,
            Det_Especial: string
        };

        let cpDt = [];
        let emp: any = useSelector((state: any) => state.emp); 
        const [showCargaMasiva, setShowCargaMasiva] = useState(false); 
        const [showAbrirPeriodo, setShowAbrirPeriodo] = useState(false); 
        const [showMsgApiResponse, setShowMsgApiResponse] = useState(false); 
        const [MsgApiResponse, setMsgApiResponse] = useState("");       
        let [records, setRecords] = useState(new Array<rec>());
        let [rowDatas, setRowDatas] = useState(new Array<rec>()); 
        let [rowsPreselected, setRowsPreselected] = useState([]);    
        let [chks, setChks] = useState(new Array(props.records.length).fill(false));
        let [rowsperpage, setRowsperpage] = useState(10);    
        let [chkHD, setChkHD] = useState(false);
        const [sHCargai, setSHCargai] = useState(false);  
        let [formSelect, setFormSelect] = useState({ Negocio: "TODOS", Modelo: "TODOS", Familia: "TODOS"});                  
        
        const checkController = (e: any) =>{

            const bln = e.target.checked;
            const idx = parseInt(e.target.value);
            chks[idx] = bln;
            records[idx].chk = bln; 
            updateRecords(); 
        }

        const updateRecords = ()=>{
            const rrAux: any[] = [];  
            props.records.map((dt: rec, idx: number)=>{
              const nd = {
                ...dt,
                chk: chks[idx],
                icon:<input type="checkbox" id={`chk-${idx}`}  value={idx} onChange={(e)=>checkController(e)} checked={chks[idx]} />,        
              }
              rrAux.push(nd);
            });
            setRecords([...rrAux]);
            setRowDatas([...rrAux]);
        }

        const allCheckControllers = (e: any) =>{
            const bln = e.target.checked;
            chks.map((dato, idx)=>{
              chks[idx] = bln;
              records[idx].chk = bln;      
            });
            setChkHD(e.target.checked);
            updateRecords();       
        }

        let columns = [
            { name: <input type="checkbox" checked={chkHD} onChange={(e)=>allCheckControllers(e)}></input>,  button: true,  selector: (row: any) => row.icon},
            { name: "chk", selector: (row:any) => row.chk, omit: true}, 
            { name: "Código", selector: (row:any) => row.Codigo, sortable: true, right:true},
            { name: "Especial", selector: (row:any) => row.Especial, sortable: true},
            { name: "Descripción", selector: (row:any) => row.Descripcion, sortable: true, grow: 4},
            { name: "UM", selector: (row:any) => row.Unidad_Medida, sortable: true},
            { name: "Saldo SAP", selector: (row:any) => row.Saldo_sap, right:true},            
            { name: "Saldo ctrl. Cal.", selector: (row:any) => row.Control_cal_sap, sortable: true, right:true, grow:2},
            { name: "Bloqueado", selector: (row:any) => row.Bloqueado, sortable: true, grow:2, right:true},
            { name: "Total Sap", selector: (row:any) => row.Total_sap, right:true},
            { name: "Costo Unitario", selector: (row:any) => row.Costo_unitario, right:true},             
            { name: "Negocio", selector: (row:any) => row.Negocio,  sortable: true, grow:2},
            { name: "Familia", selector: (row:any) => row.Familia, sortable: true, grow:2},
            { name: "Modélo", selector: (row:any) => row.Modelo,  grow:2, sortable: true},  
            { name: "Det. Especial", selector: (row:any) => row.Det_Especial,  omit: true},                     
        ]

        const preselectedRows = (arrID: any) =>{
            let neArr = arrID.length;
            for (let f = 0; f < rowDatas.length; f++){
                let bln = arrID.findIndex((id: string)=> id === rowDatas[f].Codigo);
                if (bln >= 0){
                  chks[f] = true;
                  rowDatas[f].chk = ("" + true);
                  neArr--;
                  if (neArr === 0) {break};
                }
            }
            updateRecords();
        }

        const preselectedCodeSi = (code: any) =>{
            setShowCargaMasiva(false);
            setRowsPreselected(code);
            preselectedRows(code);
        }

        const FiltrarTabla = (slt: any) =>{          
            cpDt = [...records];
            let arr = []; 
            if (formSelect.Negocio === "TODOS"){
                if (formSelect.Familia === "TODOS"){
                    if (formSelect.Modelo === "TODOS"){
                        arr = [...records];   
                    }else{
                        arr = cpDt.filter((obj: any)=> obj.Modelo === formSelect.Modelo);
                    }
                }else{
                    if (formSelect.Modelo === "TODOS"){
                        arr = cpDt.filter((obj: any)=> obj.Familia === formSelect.Familia);
                    }else{
                        arr = cpDt.filter((obj: any)=> (obj.Familia === formSelect.Familia) && (obj.Modelo === formSelect.Modelo));                    
                    }
                }
            }else{
                if (formSelect.Familia === "TODOS"){
                    if (formSelect.Modelo === "TODOS"){
                        arr = cpDt.filter((obj: any)=> obj.Negocio === formSelect.Negocio);     
                    }else{
                        arr = cpDt.filter((obj: any)=> (obj.Negocio === formSelect.Negocio) && (obj.Modelo === formSelect.Modelo));  
                    }
                }else{
                    if (formSelect.Modelo === "TODOS"){
                        arr = cpDt.filter((obj: any)=> (obj.Negocio === formSelect.Negocio) && (obj.Familia === formSelect.Familia));                      
                    }else{
                        arr = cpDt.filter((obj: any)=> (obj.Negocio === formSelect.Negocio) && (obj.Familia === formSelect.Familia) && (obj.Modelo === formSelect.Modelo));  
                    }
                }
            }
            rowDatas = [...arr];
            setRowDatas(rowDatas);    
        }

        useEffect(()=>{
            const init = () => {
              const rrAux: any[] = [];  
              props.records.map((dt: any, idx: number)=>{
                const nd = {
                  ...dt,
                  chk: chks[idx],
                  icon:<input type="checkbox" id={`chk-${idx}`}  value={idx} onChange={(e)=>checkController(e)} checked={chks[idx]} />,        
                }
                rrAux.push(nd);
              });
              records = [...rrAux];
              rowDatas = [...rrAux];
              setRecords(records);
              setRowDatas([...rrAux]);
            }
        
            const preselectedRows = (arrID: any) =>{
              let neArr = arrID.length;
              for (let f = 0; f < rowDatas.length; f++){
                  let bln = arrID.findIndex((id:string) => id === rowDatas[f].Codigo);
                  if (bln >= 0){
                    chks[f] = true;
                    rowDatas[f].chk = ("" + true);
                    neArr--;
                    if (neArr == 0) {break};
                  }
              }
              updateRecords();
            }
                 
            init();
            preselectedRows(rowsPreselected);
             
        }, []);        
        
        const handlerSelect = (evnt: any) =>{
            formSelect = {...formSelect, [evnt.target.id]: evnt.target.value.trim()};
            setFormSelect(formSelect); 
            FiltrarTabla(evnt.target);                                   
        }

        const procesarApertura = async (val: any) =>{          
            setShowAbrirPeriodo(false);

            setSHCargai(true);
            let detalle: any[] = [];
            rowDatas.map((obj: any)=>{
                if (obj.chk){
                    const { chk, icon, ...objBdy } = obj;
                    detalle.push(objBdy);
                }
            });
            const body = {
                ...formData,
                Usuario: emp.user,
                Observacion:val,
                detalle: detalle
            };
            const recurso = `${env.REACT_APP_API_URL_DEV}/api/MuestraInventarioAbrir`;     
            const response = await httpApiPostText(recurso,"POST", {
            'Content-Type': 'application/json',
            'Rosen-API-Key': '2B89CE9E-47DF-4EF1-8353-CF0C18EE029F',
            'Rosen-API-Secret': 'EFCFA469-8474-4DCF-B84A-CB1B0835ABDA-CDDC8DDB-6E6E-47CB-9422-B8A4312EC01A',
            }, body);
            const arrDta = await JSON.parse(response.message);           
            setSHCargai(false);
            if (response.code >= 400){
                setMsgApiResponse(arrDta);
            }else{
                setMsgApiResponse(`Operación exitosa. Referencia : ${arrDta.Muestra_Referencia}`);
            }
            setShowMsgApiResponse(true);
        }
        
        ///******************************************* */
        const Selectores = (props: any) => {

            return (
                <div className="row d-flex flex-row mb-3">
                    <Container fluid className="mb-3 col-md-12 col-lg-4" >
                        <label className="form-label">Seleccionar Negocio</label>    
                        <div>
                            <Form.Select  value={formSelect.Negocio} aria-label="Default select example" onChange={(e) => props.handlerSelect(e)}  id="Negocio">
                                {
                                    props.negocio.map((opcion: string, index: number)=><option key={index} value={opcion}>{opcion}</option>)
                                }                                          
                            </Form.Select>
                        </div>
                    </Container>
                    <Container fluid className="mb-3  col-md-12 col-lg-4" >
                        <label className="form-label">Seleccionar Familia </label>    
                        <div>
                            <Form.Select  value={formSelect.Familia} aria-label="Default select example" onChange={(e) => props.handlerSelect(e)}  id="Familia">
                                {
                                    props.familia.map((opcion: string, index: number)=><option key={index} value={opcion}>{opcion}</option>)
                                }
                            </Form.Select>
                        </div>
                    </Container>
                    <Container fluid className="mb-3  col-md-12 col-lg-4" >
                        <label className="form-label">Seleccionar Modelo</label>    
                        <div>
                            <Form.Select  value={formSelect.Modelo} aria-label="Default select example" onChange={(e) => props.handlerSelect(e)}  id="Modelo">
                                {
                                    props.modelo.map((opcion: string, index: number)=><option key={index} value={opcion}>{opcion}</option>)
                                }
                            </Form.Select>
                        </div>
                    </Container> 
                </div>                       
            );
        }

        ///******************************************* */
        const Grilla = (props: any) => {

            return(
                <div>
                    <div className="d-flex flex-row align-middle mt-5 mb-4">
                        <div  className="col-md-12 col-lg-6  d-flex align-items-center" >
                            <Button type="button" style={{backgroundColor:"#00B5B8"}} className=" border-0"
                                onClick={()=> {if (props.rowDatas.length > 0) exportToExcel("TablaMuestra", props.rowDatas);}}
                            >Exportar tabla a Excel</Button>
                        </div>
                    </div>
                    <DataTable
                        columns={columns}
                        data={props.rowDatas}
                        selectableRowsHighlight
                        fixedHeader
                        pagination
                        highlightOnHover
                        fixedHeaderScrollHeight="600px"
                        paginationComponentOptions={pagOptions}
                        onChangeRowsPerPage={(e)=>setRowsperpage(e)}
                        paginationPerPage={props.rowsperpage}
                    /> 
                </div>
            );
        }

        return(
            <div> 
                <Selectores 
                    familia={familia}
                    negocio={negocio}
                    modelo={modelo}
                    handlerSelect={handlerSelect}
                />               
                <div  className="text-start mb-4">
                    <Button type="button"  className="btn-lg me-2 border-0" style={{backgroundColor:"#16D39A"}}
                        disabled={!chks.find((dt: any)=> dt === true)}
                        onClick={()=>{
                            if (chks.find((val: any)=> val === true) >= 0) setShowAbrirPeriodo(true);
                        }}                
                    >
                        <label htmlFor="" className="">Abrir</label>
                    </Button>                                
                    <Button type="button" className="ms-1 border-0" style={{backgroundColor:"#2DCEE3"}}
                        disabled={(rowDatas.length === 0)}
                        onClick={()=> {if (rowDatas.length > 0) setShowCargaMasiva(true);}}     
                    >
                        <FaUpload className=" m-2"/>Carga masiva
                    </Button>
                </div>
                <Grilla 
                    rowDatas={rowDatas}
                    rowsperpage={rowsperpage}
                />
                <ModalCargaMasivaMuestras 
                        Data={rowDatas}
                        Show={showCargaMasiva}
                        Title="Carga masiva"
                        BtnOkName="Cargar archivo"
                        BtnNokName="Cerrar"
                        HandlerClickOk={null}
                        HanlerdClickNok={()=>{setShowCargaMasiva(false)}}
                        HandlerPreselected={preselectedCodeSi}
                />    
                <ModalAbrirPeriodo 
                    Show={showAbrirPeriodo}
                    Title="Período de Muestras"
                    Message={"Se va abrir período de muestras para los elementos seleccionados " +   
                            "Si desea continuar escriba el nombre de la muestra y luego pulse el botón Ok"}
                    BtnNokName="Cancelar"
                    BtnOkName="Aceptar"
                    HandlerClickOk={procesarApertura}
                    HanlerdClickNok={()=>setShowAbrirPeriodo(false)}
                    Icon="!"
                /> 
                <MsgDialog 
                    Title="Período de Muestras"
                    Icon="!"
                    Show={showMsgApiResponse}
                    BtnNokName=""
                    BtnOkName="Cerrar"
                    Message={MsgApiResponse}
                    HandlerClickOk={()=>setShowMsgApiResponse(false)}
                    HanlerdClickNok={null}
                />                            
                <LocalMsgModalSpinner 
                    Show={sHCargai}
                    text="Un momento por favor, procesando..."
                    color="#FF7588"
                />                 
            </div>             
        );
    }
    
    return(
        <Container fluid>
        <BarraMenuHz/>  
            <div >
                <div className="text-primary ms-3 mt-3">
                        Home / Muestras / Período de Muestras
                </div>
                <div className="h4 mt-4 mb-4 ms-3">PERÍODO DE MUESTRAS</div>
            </div> 
            <Container fluid>   
                <Accordion  className="mb-4" defaultActiveKey={['0']} alwaysOpen>
                    <Accordion.Item eventKey="0" className="border shadow ">
                        <Accordion.Header><div className=" h5 text-dark">PARÁMETROS MUESTRAS</div></Accordion.Header>
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
                                    <div ><SelectAlmacenes  id="Almacen" centro={formData.Centro}  OnSeleccion={hndlrOpcionAlmacen} /></div>
                                </Container>
                            </div>

                            <div className=" col-md-12 col-lg-12 text-end">
                                <Button type="button" style={{backgroundColor:"#00B5B8"}} className=" btn border border-0" 
                                    disabled={hbltBtnAbrir} onClick={() => btnBuscar()}
                                >
                                    Buscar
                                </Button>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>         
                <Accordion className="mt-1" defaultActiveKey={['0']} alwaysOpen>
                    <Accordion.Item eventKey="0" className="border shadow ">
                        <Accordion.Header><div className=" h5 text-dark">MUESTRAS</div></Accordion.Header>
                        <Accordion.Body>
                            <TablaDeDatos
                                records={records}
                            />
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>  
            </Container>
            <LocalMsgModalSpinner 
                Show={sHCarga}
                text="Un momento por favor, procesando..."
                color="#FF7588"
            />             
        </Container>    
    );
}

export default PeriodoMuestrasPage;