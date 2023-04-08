
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import * as XLSX from "xlsx";
import MsgDialog from '../../../../components/MsgDialog';

const ModalCargaMasivaMuestras = (
            props: {Data: any, Show: boolean, Title: string, HandlerPreselected: any,
            BtnOkName: string, BtnNokName: string, 
            HandlerClickOk: any, HanlerdClickNok: any}) =>{
  
  const [msgCargaMasiva, setMsgCargaMasiva] = useState(false);
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

    promise.then((d: any) => {
      d.map((datoFind: any)=>{
          const Item: string = ("" + datoFind.Item); 
          let sw = false;          
          for (let fila = 0; fila < props.Data.length; fila++ ){
              if (props.Data[fila].Codigo === Item){
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
  };

  const handleClose = () =>{
    if (codeSi.length > 0){
        props.HandlerPreselected(codeSi);
    }else{
        props.HanlerdClickNok();
    }
  }

  const cargarFile = () =>{
    if (fileName){
      readExcel(fileName)
    }else{
      setMsgCargaMasiva(true);
    }
  }

  useEffect(()=>{
   
    if (props.Show){
        setCodeSi([]);
        setCodeNo([]);
    }
    
  }, [props.Show]);

return(
    <>
      <Modal show={props.Show} size="xl" >
        <Modal.Header >
          <Modal.Title>{props.Title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div>Adjuntar archivo</div>
            <div className='mb-3 mt-2'>
              <input
                  type="file"
                  onChange={(e: any) => {
                    const file = e.target.files[0];
                    fileName = file;
                    //setHabilCargaArchivo(false);
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
          <Button  onClick={()=>cargarFile()} className="btn btn-success"/*  disabled={habilCargaArchivo} */>
            {props.BtnOkName}
          </Button>          
          <Button onClick={()=>handleClose()} className="btn btn-secondary">
            {props.BtnNokName}
          </Button>
        </Modal.Footer>
      </Modal>
      <MsgDialog
        Show={msgCargaMasiva}
        Title='Carga masiva'
        BtnOkName='Cerrar'
        HandlerClickOk={()=>setMsgCargaMasiva(false)}
        Message="Debe seleccionar el archivo a cargar"
        Icon='x'
        BtnNokName=''
        HanlerdClickNok={()=>setMsgCargaMasiva(false)}
      />
    </>
)

}

export default ModalCargaMasivaMuestras;
