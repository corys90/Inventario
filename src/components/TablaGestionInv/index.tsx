import { useEffect, useState } from "react";
import { Button, Container, Form, Pagination } from "react-bootstrap";
import { FaCheckCircle, FaDownload, FaTimesCircle, FaUpload } from "react-icons/fa";
import './style.css';

function TablaGestionInv(props: any) {

  const [regIni, setRegIni] = useState(0);
  let {header, columHeader, data, hndlrBtnDescargaSaldos } = props;
  let [dta, setDta] = useState(data); 
  let [nFila, setNfila] = useState(10);

  const hndlrBtnCheck = () => {
    dta = [...data.slice(regIni, nFila)];
    for (let c = 0; c < dta.length; c++){
      dta[c][9] = "true";
    };
    setDta(dta);
  }

 useEffect(()=>{
    setDta(data.slice(regIni, nFila));    
  }, [data]);

  const handleInputChange = (e: any) =>{
    dta = [...dta];
    dta[e.target.id][9] = (dta[e.target.id][9] ==="true") ? "false" :"true";
    setDta(dta);
  }

  const hndlrPrmTable = (event: any) => {
    nFila = event.target.value;
    setNfila(event.target.value);
    dta = data.slice(regIni, nFila);
    setDta(dta);
  } 

  const UploadBtnCierreyPublicacion = (indice: number) =>{
    const bdy = {
      Pais: "CL",
      Anno: props.formData.Anno,
      Mes: props.formData.Mes,
      Centro: dta[indice][0].split("-")[0],
      Almacen: dta[indice][1],
      Estado_inv: "",
      Bajada_saldos: "",
      Bajada_usuario: "",
      Bajada_estado: "",
      Publicado_estado: "",
      Publicado_fecha: dta[indice][5],
      Publicado_usuario: dta[indice][6],
      Usuario_apertura: "",
    };
    props.hndlrUpload(bdy);
  }

  const DownLoadBtnDescargaSaldos = (indice: number) =>{
    const bdy = {
      Pais: "CL",
      Anno: props.formData.Anno,
      Mes: props.formData.Mes,
      Centro: dta[indice][0].split("-")[0],
      Almacen: dta[indice][1],
      Estado_inv: dta[indice][2],
      Bajada_saldos: dta[indice][3],
      Bajada_usuario: dta[indice][4],
      Bajada_estado: null,
      Publicado_estado: "I",
      Publicado_fecha: null,
      Publicado_usuario: null,
      Usuario_apertura: "",
      Subinventario: dta[indice][8],
    };
    props.hndlrDownload(bdy);
  }

  const deletePeriodo = (indice: number) =>{
    const bdy = {
      Pais: "CL",
      Anno: props.formData.Anno,
      Mes: props.formData.Mes,
      Centro: dta[indice][0].split("-")[0],
      Almacen: dta[indice][1],
      Estado_inv: dta[indice][2],
      Bajada_saldos: dta[indice][3],
      Bajada_usuario: dta[indice][4],
      Bajada_estado: "C",
      Publicado_estado: "N",
      Publicado_fecha: "",
      Publicado_usuario: "",
      Usuario_apertura: dta[indice][7],
    };
    props.hndlrDeletePer(bdy);
  }  

  return (
    <div className='container-fluid'>
        <div className="text-end mb-4">
            <Button type="button" className="me-1 border-0" style={{backgroundColor:"#2DCEE3"}} onClick={hndlrBtnCheck}>
                <FaCheckCircle className="h6 m-2"/>Seleccionar todos los centros
            </Button>
            <Button type="button"  className="ms-1 border-0" style={{backgroundColor:"#16D39A"}} onClick={()=>hndlrBtnDescargaSaldos(dta)}>
                <FaDownload className="h6 m-2"/>Descargar Saldos
            </Button>
        </div>
        <div className="row d-flex flex-row mb-3 ">
            <Container fluid className=" mb-3 col-md-12 col-lg-6 align-middle" >
                <label className="form-label">Registros a mostrar</label>    
                <div> 
                    <Form.Select aria-label="Default select example"  id="nregistros" value={nFila} onChange={(e)=>hndlrPrmTable(e)}>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>                                                
                    </Form.Select>
                </div>
            </Container>
            <Container fluid className="mb-3  col-md-12 col-lg-6" >
                <label className="form-label visually-hidden">Buscar</label>    
                <div><input type="text" name="busqueda" id="busqueda" className="form-label border rounded w-100 visually-hidden" style={{height:"38px"}} disabled/></div>
            </Container>
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
                    ( dta.length > 0) ?  dta.map((data: string[], index: number) => 
                      <tr key={index}  style={{width: "fit-content"}}>
                          {
                            data.map((value: string, indexx: number)=> 
                              ((value !== "false") && (value !== "true")) 
                              ? <td key={indexx}  style={{width: "fit-content"}}>{value}</td>
                              : null)
                          }
                          {
                              <td key={9} className='bg-light'   style={{width: "fit-content"}} >
                                {   (data[2].toUpperCase() !== "C") ? 
                                    <div className=' d-flex gap-1' >
                                        <a href="" >
                                          <div className='d-flex justify-content-center h5'  style={{width: "30px"}}>  
                                            <input type="checkbox" id={`${index}`} className="form-check-input" name="topping" value={data[0]} 
                                              checked={(data[9] === "true")} onChange={(e)=>handleInputChange(e)} 
                                            />  
                                          </div>
                                        </a> 
                                        <a href="" onClick={()=>UploadBtnCierreyPublicacion(index)}>
                                          <div className=' text-center'  style={{width: "30px"}}>  
                                            <FaUpload title="Cierre y publicación" color={'white'}  className='bg-success rounded-circle p-1 h3'/>   
                                          </div>
                                        </a>                               
                                        <a href="" onClick={()=>DownLoadBtnDescargaSaldos(index)}>
                                          <div className=' text-center '  style={{width: "30px"}}>
                                            <FaDownload title="Descarga inventario  bg-warning" color={'white'}  className=' bg-primary rounded-circle p-1 h3'/>  
                                          </div>
                                        </a>                                                                       
                                        <a href="" onClick={()=>deletePeriodo(index)} >
                                          <div className='text-center '  style={{width: "30px"}}>
                                            <FaTimesCircle title="Elimina período" color={'white'}   className='bg-danger rounded-circle p-1 h3'/>
                                          </div>   
                                        </a>                                                                                         
                                    </div>
                                    : ""
                                }
                              </td>                          
                          }                           
                      </tr>
                    ): null
                }
            </tbody>
          </table>
        </div>
    </div> 
  );
}

export default TablaGestionInv;