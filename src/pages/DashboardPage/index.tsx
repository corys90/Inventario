import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import CardChart from "./CardChart";
import * as env from '../../env';
import {httpApiGetText} from '../../lib';
import './style.css';
import { useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
import MsgModalDialogEspecial from "../../components/MsgModalDialogEspecial";
import BarraMenuHz from "../../components/BarraMenoHz";

const DashboardPage = () =>{

    const [sHCarga, setsHCarga] = useState(false);
    let [datos, setDatos] = useState([{Descripcion: "", Cuadratura: 0, Color: ""}]);
    const [periodo, setPeriodo] = useState("");
    const emp: any = useSelector((state: any) => state.emp);
    const [msgDlgShowApiResponse, setMsgDlgShowApiResponse] = useState(false);    
    const [msgRespuestInv, setMsgRespuestInv] = useState("");      

    const apiDashboard = async(yy: string, mm: string) =>{
        setsHCarga(true);
        const recurso = `${env.REACT_APP_API_URL_DEV}/api/Dashboard?Dominio=${emp.pais}&Pais=${"CL"}&Usuario=${emp.user}&Anno=${yy}&Mes=${mm}`; 
        const response = await httpApiGetText(recurso, {
            'Accept': 'application/json',
            'Authorization': `API_Key ROSENPROD_KEY=${env.REACT_APP_ROSENPROD_KEY}`,
            'Rosen-API-Key': `${env.REACT_APP_Rosen_API_Key}`,
            'Rosen-API-Secret': `${env.REACT_APP_Rosen_API_Secret}`,
            'Content-Type': 'application/json'
        });
        const dt = JSON.parse(response.message);
        setsHCarga(false);     
        if (response.code >= 400){
            setMsgRespuestInv("Error al cargar la información");
            setMsgDlgShowApiResponse(true);
        }else{
            datos = [...dt];
            setDatos(datos);
        }  
    }

    const hndlrPeriodo =  (event: any) =>{
        const f: Date = event.target.value; 
        const yy = f.toString().split('-')[0];
        const mm = f.toString().split('-')[1];
        setPeriodo(event.target.value);
        apiDashboard(yy, mm);
    }

    useEffect(()=>{
        let m: any = new Date().getMonth() + 1;
        m = (m > 9) ? m : `0${m}`;
        const y = new Date().getFullYear();
        setPeriodo(y + "-" + m);
        apiDashboard(`${y}`, `${m}`);
    },[]);


    return(
        <>
            <Container fluid>
            <BarraMenuHz/>  
                <Container fluid className="text-center" >
                    <label style={{fontSize:"28px", color:"#00B5B8"}}>BIENVENIDO</label>
                    <br />
                    <label style={{fontSize:"24px", color:"#00B5B8"}}>Sistema de Control y Gestión de Inventario</label>
                </Container>
                <div className="m-3 d-flex flex-row justify-content-center" style={{fontSize:"18px", color:"#404E67"}}>
                    <div className="m-3 d-flex flex-column " >                   
                        <div >
                            <FaRegCalendarAlt className="me-1" />
                            <label >Período</label>  
                        </div>
                        <div className="input-group date" >
                            <input type="month" id="periodo" size={8} 
                                value={periodo} 
                                onChange={hndlrPeriodo} 
                                min="1990-01" max="9999-12"
                                className="form-control"
                                />
                        </div>
                    </div>
                </div> 
                {   
                    (sHCarga) ? <div className="d-flex justify-content-center " style={{display:`${sHCarga}`}}>
                                        <label>
                                            <BeatLoader color="#FF7588" />
                                        </label>                        
                                        <label className="h5 text-center">Descargando indicadores...</label>
                                        <label>
                                            <BeatLoader color="#FF7588" />
                                        </label>
                                </div>
                              : null  
                }                                                                                   
                <div style={{display:"flex", flexDirection: "row", justifyContent:"center", 
                            flexWrap: "wrap", gap: 20
                          }}
                >
                    {
                         ((datos.length > 0) && (datos[0].Descripcion !== "")) ? 
                            datos.map((data, index)=>
                                <div style={{width: "350px"}} key={index}>
                                    <CardChart 
                                        key={index}
                                        title={data.Descripcion}
                                        cuadratura={data.Cuadratura}
                                        color={data.Color}

                                    />   
                                </div>
                            )
                            : <div></div>                            
                    }          
                </div>
            </Container>
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
        </>
    );
}

export default DashboardPage;
