import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import TablaModalDetalleRepInventario from "../TablaModalDetalleRepInventario";
import * as env from '../../env';
import './style.css';
import { httpApiGetText } from "../../lib";

const datas: string[][] = [];

const ModalDetalle = (props: any) =>{

const [data, setData] = useState(datas);

useEffect(()=>{

  const llamadoApi = async() =>{
    const recurso = `${env.REACT_APP_API_URL_DEV}/api/ReportInventario?Pais=CL&Anno=${props.anno}&Mes=${props.mes}&Centro=${props.centro}&Almacen=${props.almacen}&Producto=${props.data[0]}&Diferencias=${props.diferencia}&Especial=${props.data[1]}`;  
    const data = await httpApiGetText(recurso,{
        'Content-Type': 'application/json',
        'Rosen-API-Key': '2B89CE9E-47DF-4EF1-8353-CF0C18EE029F',
        'Rosen-API-Secret': 'EFCFA469-8474-4DCF-B84A-CB1B0835ABDA-CDDC8DDB-6E6E-47CB-9422-B8A4312EC01A',
    });
    const arrDta = await JSON.parse(data.message);
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
        setData(arrSw);
    }
  }

  if (props.show === true){
    llamadoApi();
  }
}, [props.data]);

  return(
      <Modal show={props.show} size="xl">
        <Modal.Header className="p-1" /*  style={{backgroundColor: "#51EBB6"}} */>
          <Modal.Title className="h6" >{props.header}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-1" >
            <div  className="h6"/*  style={{backgroundColor: "#51EBB6"}} */>
                  {props.descripcion}
            </div>
            <div>
                <TablaModalDetalleRepInventario
                    header=""
                    columHeader={["Cantidad", "Serial", "Esp", "Nro. Docto.", "Pos. Docto.", "Fecha", "Usuario", "Observación"]}
                    data={data}
                />
            </div>
        </Modal.Body>
      <Modal.Footer>
          <Button variant="success" onClick={()=>props.onClicCerrar()} >
            Cerrar
          </Button>
      </Modal.Footer>
    </Modal>
  );
}


function TablaAvanceInventario(props: any) {


  const [show, setShow] = useState(false);
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

  const MostrarTodo = (indice: number) =>{
    console.log("Fila: ", dta[indice]);
    setFila(dta[indice]);
    setCodDesc(`${dta[indice][0]}-${dta[indice][2]}`);
    setShow(true);
  }

  const CerrarModalDetalle = () => {
    setShow(false);
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
                    </Form.Select>
                </div>
            </div>
        </div>      
        <div className="mb-4 fw-bold" >
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
                                    <a href="#!" onClick={()=>MostrarTodo(index)}>
                                      <div className=' text-center '  style={{width: "30px"}}>
                                        <FaEye title="ver Movimientos" color={'green'}  className=' rounded-circle p-1 h3'/>  
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
          data={fila}
          diferencia={props.diferencia}
        />
    </div> 
  );
}

export default TablaAvanceInventario;