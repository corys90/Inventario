import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import {  FaDotCircle, FaEye } from "react-icons/fa";
import TablaModalDetalleRepInventario from "../TablaModalDetalleRepInventario";
import TablaModalReconteoRepInventario from "../TablaModalReconteoRepInventario";
import * as env from '../../env';
import './style.css';
import { httpApiGetText } from "../../lib";
import MsgDialog from "../MsgDialog";

const datas: string[][] = [];

const ModalDetalle = (props: any) =>{

  const [dataTable, setDataTable] = useState(datas);
  const [msgDlgShowMsg, setMsgDlgShowMsg] = useState(false);  
  const [msgApiResponse, setMsgApiResponse] = useState("");   

  useEffect(()=>{

    const llamadoApi = async() =>{
      const recurso = `${env.REACT_APP_API_URL_DEV}/api/ReportInventario?Pais=CL&Anno=${props.anno}&Mes=${props.mes}&Centro=${props.centro}&Almacen=${props.almacen}&Producto=${props.data[0]}&Diferencias=${props.diferencia}&Especial=${props.data[1]}`;  
      console.log(" Detalle URL : ", recurso);
      const data = await httpApiGetText(recurso,{
          'Content-Type': 'application/json',
          'Rosen-API-Key': '2B89CE9E-47DF-4EF1-8353-CF0C18EE029F',
          'Rosen-API-Secret': 'EFCFA469-8474-4DCF-B84A-CB1B0835ABDA-CDDC8DDB-6E6E-47CB-9422-B8A4312EC01A',
      });
      const arrDta = await JSON.parse(data.message);
      console.log(" Detalle response : ", data);
      console.log(" detalle data.message: ", arrDta);  
      if (data.code >= 400){
        const res = JSON.parse(data.message)
        setMsgApiResponse(res.Message);
        setMsgDlgShowMsg(true);
      }else{
        const arrSw: string[][] = [];
        if (arrDta.Movimientos.length > 0){  
            arrDta.Movimientos.map((valor: any, index: number)=>{
                let dataSW: string[] = [];
                dataSW.push(valor.Cantidad);
                dataSW.push(valor.Serial);
                dataSW.push((valor.Especial) ? valor.Especial: "");
                dataSW.push(valor.NroDocto);
                dataSW.push(valor.PosDocto);
                dataSW.push(valor.Fecha);
                dataSW.push(valor.Usuario);
                dataSW.push(valor.Observacion);
                arrSw.push(dataSW);
            });     
            setDataTable(arrSw);
        }else{
          setMsgApiResponse("Sin registros que mostrar para este producto.");
          setMsgDlgShowMsg(true);
        }        
      }
    }
  
    if (props.show === true){
      llamadoApi();
    }

    return () => {
      setDataTable([]);
    };

  }, [props.data]);

  const MsgDlghandlerOk = ()=>{
    setMsgDlgShowMsg(false);
  }

  return(
      <Modal show={props.show} size="xl">
        <Modal.Header className="p-1" /*  style={{backgroundColor: "#51EBB6"}} */>
          <Modal.Title className="h5" >{props.header}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-1" >
            <div  className="h5"/*  style={{backgroundColor: "#51EBB6"}} */>
                  {props.descripcion}
            </div>
            <div>
                <TablaModalDetalleRepInventario
                    header=""
                    columHeader={["Cantidad", "Serial", "Esp", "Nro. Docto.", "Pos. Docto.", "Fecha", "Usuario", "Observación"]}
                    data={dataTable}
                />
            </div>
        </Modal.Body>
      <Modal.Footer>
          <Button variant="success" onClick={()=>props.onClicCerrar()} >
            Cerrar
          </Button>
      </Modal.Footer>
      {/* ************************************************* */}
      <MsgDialog
          Show={msgDlgShowMsg}
          Title="Reporte de inventario"
          Icon="x"
          Message={msgApiResponse}
          BtnOkName="Aceptar"
          BtnNokName=""
          HandlerClickOk={MsgDlghandlerOk}
          HanlerdClickNok={null}
      />   
    </Modal>      
  );
}

const ModalReconteo = (props: any) =>{

  const [dataTable, setDataTable] = useState(datas);
  const [msgDlgShowMsg, setmsgDlgShowMsg] = useState(false);
  const [msgApiResponse, setMsgApiResponse] = useState("");
  const [arrDta, setArrDta] = useState({Message:"", Movimientos:[]});
 

  useEffect(()=>{

    const llamadoApi = async() =>{
      const recurso = `${env.REACT_APP_API_URL_DEV}/api/ReporteInventarioCentro?Pais=CL&Anno=${props.anno}&Mes=${props.mes}&Centro=${props.centro}&Almacen=${props.almacen}&Inv_item_id=${props.data[0]}&Especial=${props.data[1]}`;  
      const data = await httpApiGetText(recurso,{
          'Content-Type': 'application/json',
          'Rosen-API-Key': '2B89CE9E-47DF-4EF1-8353-CF0C18EE029F',
          'Rosen-API-Secret': 'EFCFA469-8474-4DCF-B84A-CB1B0835ABDA-CDDC8DDB-6E6E-47CB-9422-B8A4312EC01A',
      });
      setArrDta(await JSON.parse(data.message));
      console.log(" Reconteo response : ", data);
      console.log(" Reconteo data.message: ", arrDta);   
      if (data.code >= 400){
        const res = JSON.parse(data.message)
        setMsgApiResponse(res.Message);
        setmsgDlgShowMsg(true);
      }else{
        const arrSw: string[][] = [];
         if (arrDta.Movimientos.length > 0){  
            arrDta.Movimientos.map((valor: any, index: number)=>{
                let dataSW: string[] = [];
                dataSW.push(valor.Cantidad);
                dataSW.push(valor.Serial);
                dataSW.push((valor.Especial) ? valor.Especial: "");
                dataSW.push(valor.NroDocto);
                dataSW.push(valor.PosDocto);
                dataSW.push(valor.Fecha);
                dataSW.push(valor.Usuario);
                dataSW.push(valor.Observacion);
                arrSw.push(dataSW);
            });     
            setDataTable(arrSw);
        }else{
          setMsgApiResponse("Sin registros que mostrar para este producto.");
          setmsgDlgShowMsg(true);          
        }        
      }
    }
  
    if (props.show === true){
      llamadoApi();
    }

    return () => {
      setDataTable([]);
    };

  }, [props.data]);


  const MsgDlghandlerOk = ()=> {

    setmsgDlgShowMsg(false);

  }

  return(
      <Modal show={props.show} size="xl">
        <Modal.Header className="p-1" /*  style={{backgroundColor: "#51EBB6"}} */>
          <Modal.Title className="h5" >{props.header}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-1" >
            <div  className="h5"/*  style={{backgroundColor: "#51EBB6"}} */>
                  {props.descripcion}
            </div>
            <div>
                <TablaModalReconteoRepInventario
                    header=""
                    columHeader={["Anterior Físico", "Anterior SAP", "Bajada Saldos", "Nuevo Físico", "Nuevo SAP", "Fecha Publicación", "Usuario Publicado", "Reconteo Referencia", "Usuario Apertura"]}
                    data={dataTable}
                />
            </div>
        </Modal.Body>
      <Modal.Footer>
          <Button variant="success" onClick={()=>props.onClicCerrar()} >
            Cerrar
          </Button>
      </Modal.Footer>
      {/* ************************************************* */}
      <MsgDialog
          Show={msgDlgShowMsg}
          Title="Reporte de inventario"
          Icon="x"
          Message={msgApiResponse}
          BtnOkName="Aceptar"
          BtnNokName=""
          HandlerClickOk={MsgDlghandlerOk}
          HanlerdClickNok={null}
      />   
    </Modal>
  );
}

function TablaReporteInventario(props: any) {

  const [show, setShow] = useState(false);
  const [showReconteo, setShowReconteo] = useState(false);
  const [regIni, setRegIni] = useState(0);
  let {header, columHeader, data } = props;
  let [dta, setDta] = useState(data); 
  let [nFila, setNfila] = useState(10);
  const [coDesc, setCodDesc] = useState("");
  const [fila, setFila] = useState([]);

  useEffect(()=>{
    setDta(data.slice(regIni, nFila));    
  }, [data]); 

  const hndlrPrmTable = (event: any) => {
    nFila = event.target.value;
    setNfila(event.target.value);
    dta = data.slice(regIni, nFila);
    setDta(dta);
  } 

  const MostrarTodoModalDetalle = (indice: number) =>{
    console.log("Fila: ", dta[indice]);
    setFila(dta[indice]);
    setCodDesc(`${dta[indice][0]}-${dta[indice][2]}`);
    setShow(true);
  }

  const MostrarTodoReconteo = (indice: number) =>{
    console.log("Fila: ", dta[indice]);
    setFila(dta[indice]);
    setCodDesc(`${dta[indice][0]}-${dta[indice][2]}`);
    setShowReconteo(true);
  }  

  const CerrarModalDetalle = () => {
    setShow(false);
  }

  const CerrarModalReconteo = () => {
    setShowReconteo(false);
  }
  
  return (
    <div className='container-fluid'>
        <div className=" mt-3 mb-3">
            <div className=" mb-3 col-md-12 col-lg-4" >
                <label className="form-label">Registros a mostrar</label>    
                <div> 
                    <Form.Select aria-label="Default select example"  id="nregistros" value={nFila} onChange={(e)=>hndlrPrmTable(e)}>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option> 
                        <option value="1000">1000</option>                                                     
                    </Form.Select>
                </div>
            </div>
        </div>      
        <div  className="mb-4 fw-bold" >
          {header}  
        </div>
        <div className='table-responsive' style={{height: ((props.data.length > 0) && (props.data.length < 10)) ? ((43 + props.data.length * 55)+"px") : "430px", overflowY: "scroll"}} >
          <table  className='table table-hover table-bordered '>
            <thead>
              <tr >
                {
                  columHeader.map((title: string, index: number) => <th className='text-center ' key={index}>{title}</th>)
                }
                {
                  <th key={9}>Acciones</th>
                }
              </tr>
            </thead>
            <tbody  style={{fontSize: "14px"}} >
                {
                    ( dta.length > 0) ? dta.map((data: any, index: number) => 
                      <tr key={index}  style={{width: "fit-content"}}>
                          {
                            data.map((value: string, indexx: number)=> 
                              <td key={indexx}  style={{width: "fit-content"}}>{value}</td>
                            )
                          }
                          {
                            <td key={dta.length} className='bg-light'   style={{width: "fit-content"}} >
                              {   
                                <div className=' d-flex gap-1' >  
                                    <a href="#!" onClick={()=>MostrarTodoModalDetalle(index)}>
                                      <div className=' text-center '  style={{width: "30px"}}>
                                        <FaEye title="ver Movimientos" color={'green'}  className=' rounded-circle p-1 h3'/>  
                                      </div>
                                    </a>      
                                    <a href="#!" onClick={()=>MostrarTodoReconteo(index)}>
                                      <div className=' text-center '  style={{width: "30px"}}>
                                        <FaDotCircle title="ver Movimientos" color={'green'}  className=' rounded-circle p-1 h3'/>  
                                      </div>
                                    </a>                                                                                                                                                                                        
                                </div>
                              }
                            </td>                          
                          }                           
                      </tr>
                    ): null
                }
            </tbody>
          </table>
        </div>
        <ModalDetalle 
          show={show}
          header={`Detalle Inventario - ${props.centro} / ${props.almacen}`}
          descripcion={coDesc}
          onClicCerrar={()=>CerrarModalDetalle()}
          almacen={props.almacen}
          centro={props.centro}
          mes={props.mes}
          anno={props.anno}
          diferencia={props.diferencia}
          data={fila}    
        />
        <ModalReconteo 
          show={showReconteo}
          header="Reconteo Inventario"
          descripcion={`Descripción: ${coDesc}`}
          onClicCerrar={()=>CerrarModalReconteo()}
          almacen={props.almacen}
          centro={props.centro}
          mes={props.mes}
          anno={props.anno}    
          data={fila}      
        />
        
    </div> 
  );
}

export default TablaReporteInventario;