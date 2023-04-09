import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import LocalMsgModalSpinner from "../../../../../components/LocalMsgModalSpinner";
import TreeViewSimple from "../../../../../components/TreeViewSimple";
import * as env from '../../../../../env';
import { httpApiGetText } from "../../../../../lib";
import MsgModalDialogEspecial from "../../../../../components/MsgModalDialogEspecial";

const MostraTodo = (props: any) =>{

    const [sHCarga, setSHCarga] = useState(false);
    const [msgDlgShowApiResponse, setMsgDlgShowApiResponse] = useState(false);
    const [msgRespuestInv, setMsgRespuestInv] = useState("");    
    const [data, setData] = useState([]);      

    useEffect(()=>{

        const loadTree = async () => {

            setSHCarga(true);
            const recurso = `${env.REACT_APP_API_URL_DEV}/api/InventarioSub?Pais=CL&Anno=${props.formData.Anno}&Mes=${props.formData.Mes}` 
                            + `&Centro=${props.formData.Centro}&Almacen=${props.formData.Almacen}&Subinventario_Id=${props.item.Subinventario_Id}`;     
            const response = await httpApiGetText(recurso,{
                'Content-Type': 'application/json',
                'Rosen-API-Key': '2B89CE9E-47DF-4EF1-8353-CF0C18EE029F',
                'Rosen-API-Secret': 'EFCFA469-8474-4DCF-B84A-CB1B0835ABDA-CDDC8DDB-6E6E-47CB-9422-B8A4312EC01A',
            });
            const arrDta = await JSON.parse(response.message);   
            setSHCarga(false);                    
            if (response.code >= 400){
                setMsgRespuestInv("Error: Problemas con el servidor");
                setMsgDlgShowApiResponse(true);      
            }else{
                setData(arrDta);
            }
        }

       if (props.Show)
        loadTree();

    }, [props.item]);

    return (
        <div>
          <Modal show={props.Show} centered={false} size="lg">
              <Modal.Header  >
                  <Modal.Title className='h3 text-center'>
                      {`Clasificación para: ${props.item.Subinventario_Id}`}
                  </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                    <div>
                        <TreeViewSimple treeData={data} />
                    </div>
              </Modal.Body>                
              <Modal.Footer className=''>
                  {
                      (props.BtnOkName) 
                          ? 
                          <Button type="button" className="btn btn-secondary btnColorOk" onClick={props.HandlerClickOk}>
                              {props.BtnOkName}
                          </Button>
                          : <div></div>
                  }                                    
              </Modal.Footer>
          </Modal>
            {/*********** cuadro de dialogo para msj de api **********/}
            <MsgModalDialogEspecial
                Show={msgDlgShowApiResponse}
                Title={`Gestión inventario`}
                Icon="x"
                Message={msgRespuestInv}
                BtnOkName="Aceptar"
                BtnNokName=""
                HandlerClickOk={()=>setMsgDlgShowApiResponse(false)}
                HanlerdClickNok={null}
            />            
          <LocalMsgModalSpinner 
                Show={sHCarga}
                text="Un momento por favor, procesando..."
                color="#FF7588"
            />               
        </div>
    );
};

export default MostraTodo;