import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaCaretRight } from "react-icons/fa";
import { BeatLoader } from "react-spinners";
import * as env from '../../../../env';

import './style.css';


const DescargaSaldos = (props: any) =>{

    let dta = [];
    let [arrAux, setArrAux] = useState(new Array(props.data.length).fill("Descargando...")); 

    const llamadosApi = async () =>{
        dta = props.data;
        dta.map(async (valor: any, ind: number)=>{
            const bdy = {
                Pais: "CL",
                Anno: props.Anno,
                Mes: props.Mes,
                Centro: valor.Centro,
                Almacen: valor.Almacen,
                Estado_inv: valor.Estado_inv,
                Bajada_saldos: valor.Bajada_saldos,
                Bajada_usuario: valor.Bajada_usuario,
                Bajada_estado: null,
                Publicado_estado: valor.Publicado_estado,
                Publicado_fecha: null,
                Publicado_usuario: null,
                Usuario_apertura: valor.Usuario_apertura,
                Subinventario: valor.Subinventario,
            };      
            const recurso = `${env.REACT_APP_API_URL_DEV}/api/Inventario`;              
            fetch(recurso, 
                    {
                        method: "POST", 
                        headers:
                                {
                                    "Content-Type": "application/json",
                                    'Rosen-API-Key': '2B89CE9E-47DF-4EF1-8353-CF0C18EE029F',
                                    'Rosen-API-Secret': 'EFCFA469-8474-4DCF-B84A-CB1B0835ABDA-CDDC8DDB-6E6E-47CB-9422-B8A4312EC01A', 
                                }, 
                        body: JSON.stringify(bdy),
                    })
                    .then((res: any)=>{
                        if (res.status < 400){
                            arrAux[ind] = "Descarga Ok.";                  
                        }else{
                            arrAux[ind] = "Descarga fallida";
                        }   
                        setArrAux([...arrAux]);                
                    }).catch((e: any)=>{
                        arrAux[ind] = e;
                        setArrAux([...arrAux]);
                    });    
        });
    }

    useEffect(()=>{
        if (props.Show){
            llamadosApi();  
        }       
    },[props.Show]);

    return (
        <div>
          <Modal show={props.Show} centered={true} size="lg">
              <Modal.Header  >
                  <Modal.Title className='h3 text-center'>
                      {                        
                          props.Title
                      }
                  </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                    {
                         props.data.map((valor: any, index:number)=>
                                <div key={index} className="mt-3">
                                    <FaCaretRight className="h5"/>
                                    <label className="h5">Centro/Almacen : </label>
                                    <label className="h5">{valor.Centro}</label>
                                    <label className="h5">/</label>
                                    <label className="h5">{valor.Almacen}</label>
                                        {
                                           (arrAux[index] === "Descargando...") 
                                           ?<label className="h5 ms-3 text-success">
                                                <BeatLoader color={props.color} />
                                                {arrAux[index]}
                                                <BeatLoader color={props.color} /> 
                                            </label>
                                           :<label className="h5 ms-3 text-success">
                                                {arrAux[index]} 
                                            </label>
                                        }                                                                      
                                </div>
                            )
                    }
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
        </div>
    );
};

export default DescargaSaldos;