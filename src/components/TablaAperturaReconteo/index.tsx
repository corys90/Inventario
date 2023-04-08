import { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { FaUpload } from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import * as XLSX from "xlsx";
import './style.css';

function TablaAperturaReconteo(props: any) {

  const [muestraModalCargaFile, setMuestraModalCargaFile] = useState(false);
  let datatble: string[][]= [...props.data];

  function SelectFilasMostrar() {  
    return (
      <Form.Select aria-label="Default select example">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>        
      </Form.Select>
    );
  } 

  const abreModalCarga = () =>{

    setMuestraModalCargaFile(true);

  }

  const cargarFile = () =>{

    setMuestraModalCargaFile(false);

  }

  const ModalCargaMasiva = (props: {Show: boolean, Title: string, 
                                    BtnOkName: string, BtnNokName: string, 
                                    HandlerClickOk: any, HanlerdClickNok: any}) =>{
      
      const [items, setItems] = useState([]);
      const [codeSi, setCodeSi] = useState(new Array<string>());
      const [codeNo, setCodeNo] = useState(new Array<string>());
      let fileName: string = "";

      const readExcel = (file: any) => {

          const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);

            fileReader.onload = (e: any) => {
              const bufferArray = e.target.result;
              const wb = XLSX.read(bufferArray, { type: "buffer" });
              const wsname = wb.SheetNames[0];
              const ws = wb.Sheets[wsname];
              const data = XLSX.utils.sheet_to_json(ws);
              resolve(data);
            };

            fileReader.onerror = (error) => {
              reject(error);
            };
          });

          promise.then(async (d: any) => {          
            setItems(d);
            console.log("items : ", d);
            d.map((datoFind: any)=>{
                const Item: string = ("" + datoFind.Item); 
                let sw = false;          
                for (let fila = 0; fila < datatble.length; fila++ ){
                  //console.log("tipo datatble, datofind: ", (datatble[fila][0]), datoFind);   
                    if (datatble[fila][0] === Item){
                      codeSi.push(Item);
                      sw = true;
                      break;
                    }
                }
                if (!sw){
                  codeNo.push(Item);
                }
            }); 
            setCodeSi([...codeSi]);
            setCodeNo([...codeNo]);            
          });
      }        

      const handleClose = () =>{
        setItems([]);
        props.HanlerdClickNok();
      }

      return(
          <>
            <Modal show={props.Show} size="xl"  onHide={()=>handleClose()}>
            <Modal.Header closeButton>
              <Modal.Title>{props.Title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>Adjuntar archivo</div>
                <div className='mb-3 mt-2'>
                  <input type="file"
                      onChange={(e: any) => {
                        const file = e.target.files[0];
                        fileName = file;
                      }}
                      className="form-control"
                  />
                </div>
                <div>Detalle de busqueda</div>
                <div className='mt-3 ' style={{display:"flex", flexDirection:"row"}}>
                    <div className='text-success w-50'>
                        <label htmlFor="">Encontrados</label>
                        {
                          codeSi.map((d: string, index: number) => (
                            <li key={index} className="text-success">
                                {d}
                            </li>
                          ))
                        }
                    </div>
                    <div className='text-danger w-50'>
                      <label htmlFor="">No encontrados</label>                      
                        {
                          codeNo.map((d: string, index: number) => (
                            <li key={index} className="text-danger">
                                    {d}
                            </li>
                          ))
                        }
                    </div>
                </div>            
            </Modal.Body>
            <Modal.Footer>
              <Button  onClick={()=>readExcel(fileName)} className="btn btn-success">
                {props.BtnOkName}
              </Button>          
              <Button onClick={()=>handleClose()} className="btn btn-secondary">
                {props.BtnNokName}
              </Button>
            </Modal.Footer>
            </Modal>
          </>
      )
  }


  return (
    <div className='container-fluid'>
        <div className="text-start mb-4">
            <Button type="button"  className="btn-lg me-2 border-0" style={{backgroundColor:"#16D39A"}}>
                <label htmlFor="" className="">Abrir</label>
            </Button>                                
            <Button type="button" className="ms-1 border-0" style={{backgroundColor:"#2DCEE3"}}
              onClick={()=>abreModalCarga()}
            >
                <FaUpload className=" m-2"/>Carga masiva
            </Button>
        </div> 
        <div className="row d-flex flex-row mb-3">
            <Container fluid className=" mb-3 col-md-12 col-lg-6 align-middle" >
                <label className="form-label">Registros a mostrar</label>    
                <div><SelectFilasMostrar /></div>
            </Container>
            <Container fluid className="mb-3  col-md-12 col-lg-6" >
                <label className="form-label">Buscar</label>    
                <div><input type="text" name="busqueda" id="busqueda" className="form-label border rounded w-100" style={{height:"38px"}}/></div>
            </Container>
        </div>             
        <div  className="mb-4 fw-bold" >
          {props.header}  
        </div>
        <div className='table-responsive'>
          <table  className='table table-hover table-bordered '>
            <thead>
              <tr >
                {
                  <td key={-1}><input type="checkbox" id={"todos"} /></td>
                }
                {
                  props.columHeader.map((title: string, index: number) => <th className='text-center ' key={index}>{title}</th>)
                }
              </tr>
            </thead>
            <tbody  style={{fontSize: "14px"}} >
                {
                    props.data.map((data: string[], index: number) => 
                      <tr key={index}>
                        {
                           <td key={-1}><input type="checkbox" id={data[0]} value={data[0]} checked={(data[13] === "true")}/></td>
                        }
                        {
                          data.map((value: string, index: number)=> <td key={index}>{value}</td>)
                        }                        
                      </tr>
                    )
                }
            </tbody>
          </table>
        </div>
        
        <ModalCargaMasiva
            Show={muestraModalCargaFile}
            Title="Carga Masiva"
            BtnOkName="Cargar archivo"
            BtnNokName="Cerrar"
            HandlerClickOk={()=>cargarFile()} 
            HanlerdClickNok={()=>setMuestraModalCargaFile(false)}
            
        />
    </div> 
  );
}

export default TablaAperturaReconteo;