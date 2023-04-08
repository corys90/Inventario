
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DataTable from 'react-data-table-component';
import LocalMsgModalSpinner from '../../../../components/LocalMsgModalSpinner';
import MsgModalDialogEspecial from '../../../../components/MsgModalDialogEspecial';
import * as env from '../../../../env';
import { httpApiGetText } from '../../../../lib';
import { exportToExcel } from '../../../../util';

const MsgDialogReconteoRepoInv = (
            props: {Show: boolean, Title: string, BtnOkName: string, 
            BtnNokName: string, data:any, formData: any;
            HandlerClickOk: any, HanlerdClickNok: any}) =>{

  let [records, setRecords] = useState([]);
  const [sHCarga, setSHCarga] = useState(false);  
  const [msgDlgShowApiResponse, setMsgDlgShowApiResponse] = useState(false); 
  const [msgApiResponse, setMsgApiResponse] = useState("");  

  let columns = [
    { name: "Anterior Físico", selector: (row:any) => row.Anterior_fisico, sortable: true},
    { name: "Anterior SAP", selector: (row:any) => row.Anterior_sap, sortable: true, grow:4},
    { name: "Bajada Saldos", selector: (row:any) => row.Bajada_saldos},
    { name: "Nuevo Físico", selector: (row:any) => row.Nuevo_fisico,  sortable: true},
    { name: "Nuevo SAP", selector: (row:any) => row.Nuevo_sap}, 
    { name: "Fecha Publicación", selector: (row:any) => row.Publicado_fecha, sortable: true},
    { name: "Usuario Publicado", selector: (row:any) => row.Publicado_usuario, sortable: true},
    { name: "Reconteo Referencia", selector: (row:any) => row.Reconteo_ref},        
    { name: "Usuario Apertura", selector: (row:any) => row.Usuario_apertura},          
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
      const recurso = `${env.REACT_APP_API_URL_DEV}/api/ReporteInventarioCentro?Pais=CL&Anno=${props.formData.Anno}&Mes=${props.formData.Mes}` + 
                      `&Centro=${props.formData.Centro}&Almacen=${props.formData.Almacen}&Inv_item_id=${props.data.Codigo}&Especial=`;  
      //const recurso = `${env.REACT_APP_API_URL_DEV}/api/ReporteInventarioCentro?Pais=CL&Anno=2022&Mes=06&Centro=3200&Almacen=3201&Inv_item_id=10012130&Especial=`; 
      const response = await httpApiGetText(recurso, {
          'Content-Type': 'application/json',
          'Rosen-API-Key': '2B89CE9E-47DF-4EF1-8353-CF0C18EE029F',
          'Rosen-API-Secret': 'EFCFA469-8474-4DCF-B84A-CB1B0835ABDA-CDDC8DDB-6E6E-47CB-9422-B8A4312EC01A',
      });
      const arrDta = await JSON.parse(response.message); 
      if (response.code >= 400){
        setSHCarga(false);
        setMsgApiResponse(arrDta.Message);
        setMsgDlgShowApiResponse(true);
      }else{
        const auxDta:any = [];
        arrDta.Movimientos.map((obj: any, index: number)=>{
          const newObj = {...obj};
          auxDta.push(newObj);
        });
        setRecords(auxDta);
        setSHCarga(false);        
      }
    }

    if (props.Show){
      llamadaApi();
    }
  }, [props.Show]);

  const MsgDlghandlerResponseApi = () =>{
    setMsgDlgShowApiResponse(false);
  }

return(
    <>
      <Modal show={props.Show} size="xl" centered>
        <Modal.Header >
          <Modal.Title>{props.Title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div>{`Descripción: ${props.data.Codigo} - ${props.data.Descripcion}`}</div>
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
      {/*********** cuadro de dialogo para msj de api **********/}
      <MsgModalDialogEspecial
          Show={msgDlgShowApiResponse}
          Title={`Reporte Inventario - Reconteo`}
          Icon="x"
          Message={msgApiResponse}
          BtnOkName="Aceptar"
          BtnNokName=""
          HandlerClickOk={MsgDlghandlerResponseApi}
          HanlerdClickNok={null}
      />        
      <LocalMsgModalSpinner 
                    Show={sHCarga}
                    text="Un momento por favor, verificando detalle..."
                    color="#FF7588"
        />        
    </>
)

}

export default MsgDialogReconteoRepoInv;
