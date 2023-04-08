
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DataTable from 'react-data-table-component';
import LocalMsgModalSpinner from '../../../../components/LocalMsgModalSpinner';
import * as env from '../../../../env';
import { httpApiGetText } from '../../../../lib';
import { exportToExcel } from '../../../../util';

const MsgDialogDetalleReporteInv = (
            props: {Show: boolean, Title: string, SubTitle: string 
            BtnOkName: string, BtnNokName: string, data:any, formData: any;
            HandlerClickOk: any, HanlerdClickNok: any}) =>{

  let [records, setRecords] = useState([]);
  const [sHCarga, setSHCarga] = useState(false);  

  let columns = [
    { name: "Cantidad", selector: (row:any) => row.Cantidad, sortable: true},
    { name: "Serial", selector: (row:any) => row.Serial, sortable: true, grow:4},
    { name: "Esp", selector: (row:any) => row.Especial},
    { name: "Nro. docto.", selector: (row:any) => row.NroDocto,  sortable: true},
    { name: "Pos. Docto.", selector: (row:any) => row.PosDocto}, 
    { name: "Fecha", selector: (row:any) => row.Fecha, sortable: true},
    { name: "Usuario", selector: (row:any) => row.Usuario, sortable: true},
    { name: "Observación", selector: (row:any) => row.Observacion},        
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
      const recurso = `${env.REACT_APP_API_URL_DEV}/api/ReportInventario?pais=CL&Anno=${props.formData.Anno}&Mes=${props.formData.Mes}` + 
                      `&Centro=${props.formData.Centro}&Almacen=${props.formData.Almacen}&Producto=${props.data.Codigo_Rosen}&Diferencias=0&Especial=`;  
      //const recurso = `${env.REACT_APP_API_URL_DEV}/api/ReportInventario?pais=CL&Anno=2022&Mes=06&Centro=3200&Almacen=3201&Producto=10010046&Diferencias=0&Especial=`; 
      const response = await httpApiGetText(recurso, {
          'Content-Type': 'application/json',
          'Rosen-API-Key': '2B89CE9E-47DF-4EF1-8353-CF0C18EE029F',
          'Rosen-API-Secret': 'EFCFA469-8474-4DCF-B84A-CB1B0835ABDA-CDDC8DDB-6E6E-47CB-9422-B8A4312EC01A',
      });
      const arrDta = await JSON.parse(response.message); 
      const auxDta:any = [];
      arrDta.Movimientos.map((obj: any, index: number)=>{
        const newObj = {
          Cantidad: obj.Cantidad, 
          Serial : obj.Serial, 
          Especial : ((obj.Especial)?obj.Especial: ""),
          NroDocto: obj.NroDocto,
          PosDocto: obj.PosDocto,
          Fecha: obj.Fecha,
          Usuario: obj.Usuario,
          Observacion: obj.Observacion
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

  return(
      <>
        <Modal show={props.Show} size="xl" centered>
          <Modal.Header >
            <Modal.Title>{props.Title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <div>{`${props.data.Codigo} - ${props.data.Descripcion}`}</div>
              <div className='mt-3'>
                  <div>
                      <Button className="btn btn-success" onClick={()=>{ 
                              if (records.length > 0 )
                                exportToExcel("tablaAvanceDetalle", records)
                              }
                          }>Exportar</Button>
                      <div>
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
                              onSelectedRowsChange={(e: any)=>console.log("select: ", e)}
                          />                      
                      </div>
                  </div>
              </div>
          </Modal.Body>
          <Modal.Footer>
            <Button  onClick={props.HandlerClickOk} className="btn btn-success">
              {props.BtnOkName}
            </Button>          
            <Button onClick={props.HanlerdClickNok} className="btn btn-secondary">
              {props.BtnNokName}
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

export default MsgDialogDetalleReporteInv;
