
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DataTable from 'react-data-table-component';
import LocalMsgModalSpinner from '../../../../components/LocalMsgModalSpinner';
import * as env from '../../../../env';
import { httpApiGetText } from '../../../../lib';
import { exportToExcel } from '../../../../util';

const MsgModalAvanceYcierreReconteo = (
            props: {Show: boolean, Title: string
            BtnOkName: string, BtnNokName: string, data:any
            HandlerClickOk: any, HanlerdClickNok: any}) =>{

  let [records, setRecords] = useState([]);
  const [sHCarga, setSHCarga] = useState(false);  

  let columns = [
    { name: "ID", selector: (row:any) => row.Reconteo_ref, sortable: true},
    { name: "Código", selector: (row:any) => row.Inv_item_id, sortable: true, grow:1},
    { name: "Descripción", selector: (row:any) => row.Descr60, sortable: true, grow:7},
    { name: "Especial", selector: (row:any) => row.Especial,  sortable: true, right: true},
    { name: "Saldo SAP", selector: (row:any) => row.Saldo_sap, grow:3,  sortable: true, right: true}, 
    { name: "Control de calidad SAP", selector: (row:any) => row.Control_cal_sap, sortable: true, grow:4, right: true},     
    { name: "Bloqueado", selector: (row:any) => row.Bloqueado,  sortable: true, right: true, grow:3},
    { name: "Saldo Físico", selector: (row:any) => row.Saldo_inv, grow:3,  sortable: true, right: true}, 
    { name: "Diferencia", selector: (row:any) => row.Diferencia_Fisico, sortable: true, grow:3, right: true},   
  ]

  const pagOptions = {
      rowsPerPageText: "Filas por páginas",
      rangeSeparatorText: "de",
      selectAllRowsItem: true,
      selectAllRowsItemText: "Todos"
  }; 

  useEffect(()=>{

    const llamadaApi = async () =>{
      setSHCarga(true);
      const recurso = `${env.REACT_APP_API_URL_DEV}/api/Reconteos?pais=CL&Anno=${props.data.Anno}&Mes=${props.data.Mes}` + 
                      `&Centro=${props.data.Centro}&Almacen=${props.data.Almacen}&Reconteo=${props.data.Reconteo_ref}`;  
      //const recurso = `${env.REACT_APP_API_URL_DEV}/api/ReportInventario?pais=CL&Anno=2022&Mes=06&Centro=3200&Almacen=3201&Producto=10010046&Diferencias=0&Especial=`; 
      const response = await httpApiGetText(recurso, {
          'Content-Type': 'application/json',
          'Rosen-API-Key': '2B89CE9E-47DF-4EF1-8353-CF0C18EE029F',
          'Rosen-API-Secret': 'EFCFA469-8474-4DCF-B84A-CB1B0835ABDA-CDDC8DDB-6E6E-47CB-9422-B8A4312EC01A',
      });
      const arrDta = await JSON.parse(response.message); 
      setSHCarga(false);
      const auxDta:any = [];
      arrDta.RConsolidadoReconteo.map((obj: any, index: number)=>{
        const newObj = {
          Reconteo_ref: obj.Reconteo_ref, 
          Inv_item_id : obj.Inv_item_id, 
          Descr60 : obj.Descr60,
          Especial: obj.Especial,
          Saldo_sap: obj.Saldo_sap,
          Control_cal_sap: obj.Control_cal_sap,
          Bloqueado: obj.Bloqueado,
          Saldo_inv: obj.Saldo_inv,
          Diferencia_Fisico: obj.Diferencia_Fisico,
        };
        auxDta.push(newObj);
      });
      setRecords(auxDta);
      setSHCarga(false);
    }; 

    if (props.Show){
      llamadaApi();
    }

    return ()=> {
        records = [];
    }
  }, [props.Show]);

  const btnAccion = (act: any) =>{
    setRecords([]);
    act();
  }

  return(
      <>
        <Modal show={props.Show} size="xl" centered>
          <Modal.Header >
            <Modal.Title>{props.Title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <div className='mt-3'>
                  <div>
                      <Button className="btn btn-success" onClick={()=>{ 
                              if (records.length > 0 )
                                exportToExcel("tablaProductoReconteo", records)
                              }
                          }>Exportar</Button>
                      <div>
                          <DataTable
                              columns={columns}
                              data={records}
                              fixedHeader
                              pagination
                              highlightOnHover
                              fixedHeaderScrollHeight="600px"
                              paginationComponentOptions={pagOptions}
                          />                     
                      </div>
                  </div>
              </div>
          </Modal.Body>
          <Modal.Footer>
            <Button  onClick={()=>btnAccion(props.HandlerClickOk)} className="btn btn-success">
              {props.BtnOkName}
            </Button>          
          </Modal.Footer>
        </Modal>
        <LocalMsgModalSpinner 
            Show={sHCarga}
            text="Un momento por favor, verificando detalle..."
            color="#FF7588"
        />        
      </>
  )

}

export default MsgModalAvanceYcierreReconteo;
