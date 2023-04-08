import { useState } from "react";
import { FaRegCalendarAlt, FaTruck } from "react-icons/fa";
import { useSelector } from "react-redux";
import LocalMsgModalSpinner from "../../../../components/LocalMsgModalSpinner";
import MsgDialog from "../../../../components/MsgDialog";
import MsgModalDialogEspecial from "../../../../components/MsgModalDialogEspecial";
import TreeView from "../../../../components/TreeView";
import * as env from '../../../../env';
import { httpApiPostText } from "../../../../lib";

const Apertura = (props:any) =>{

    const emp: any = useSelector((state: any) => state.emp);
    const [showAbrirSub, setShowAbrirSub,] = useState(false);   
    const [msgDlgShowApiResponse, setMsgDlgShowApiResponse] = useState(false);
    const [msgRespuestInv, setMsgRespuestInv] = useState("");    
    const [sHCarga, setSHCarga] = useState(false);     
    let arrchks: any = [];
    let [objSend, setObjSend] = useState({});

    const onSelectionItem = (arr: any, val: number) =>{
        arrchks = arr;
        const arrchksNietos = arrchks.filter((dato: string)=> dato.split(";").length === 3 );
        let vl = document.getElementById("NroItemsSelected") as HTMLInputElement | null;
        if (vl !== null){
            vl.innerHTML = ("" + arrchksNietos.length);
        }        
    }

    const abrirSibInv = ()=>{
        const arrchksNietos = arrchks.filter((dato: string)=> dato.split(";").length === 3 );    
        let arrSend: any = [];
        arrchksNietos.map((dt: string)=>{
            const newObj = {
                Nivel1: dt.split(";")[0],
                Nivel2: dt.split(";")[1], 
                Nivel4: dt.split(";")[2],               
            };
            arrSend.push(newObj);
        });
        objSend = {
            PeriodoSub: {    
                Pais: "CL",
                Anno: props.formData.Anno,
                Mes: props.formData.Mes,
                Centro: props.formData.Centro,
                Almacen: props.formData.Almacen,
                Usuario_apertura: emp.user,
            },  
            NivelesSeleccion: arrSend,           
        };        
        if (arrchks.length > 0){
            setObjSend(objSend);
            setShowAbrirSub(true);
        }
    }

    const procesoAbreSub = async () =>{
        setShowAbrirSub(false);
        setSHCarga(true);
        const recurso = `${env.REACT_APP_API_URL_DEV}/api/PeriodoSub`;     
        const response = await httpApiPostText(recurso,"POST", {
            'Content-Type': 'application/json',
            'Rosen-API-Key': '2B89CE9E-47DF-4EF1-8353-CF0C18EE029F',
            'Rosen-API-Secret': 'EFCFA469-8474-4DCF-B84A-CB1B0835ABDA-CDDC8DDB-6E6E-47CB-9422-B8A4312EC01A',
        }, objSend);    
        const arrDta = await JSON.parse(response.message); 
        setSHCarga(false);
         if (response.code >= 400){
            setMsgRespuestInv(arrDta.Message);
        }else{
            setMsgRespuestInv("Apertura exitosa...");
        } 
        setMsgDlgShowApiResponse(true);        
        //** actualiza el contador de items */
        let vl = document.getElementById("NroItemsSelected") as HTMLInputElement | null;
        if (vl !== null){
            vl.innerHTML = ("" + 0);
        }         
    } 

    return(
        <>
            <div className="d-flex flex-row">

                <div className="border border-secondary m-3 w-50 rounded" >
                    <div style={{height: "350px", overflow: "scroll"}}>

                        <TreeView data={props.data} onItemClick={onSelectionItem} />

                    </div>
                </div>
                <div className="d-flex flex-column  w-50 m-4 ">
                    <div className="d-flex flex-row " >
                        <div className="" style={{fontSize: "14px", width: "40%"}}>
                            <div className="m-2 d-flex flex-column " >                   
                                <div >
                                    <FaRegCalendarAlt className="me-1" />
                                    <label >Período</label>  
                                </div>
                                <div >
                                    <label className="mt-1 me-2">Año: {props.formData.Anno}</label><label className="mt-1 ms-2">Mes: {props.formData.Mes}</label>
                                </div>
                            </div>
                        </div>
                        <div className=" " style={{fontSize: "14px", width: "60%"}}>
                            <div className="m-2 d-flex flex-column " >                   
                                    <div >
                                        <FaTruck className="me-1" />
                                        <label >Ubicación</label>  
                                    </div>
                                    <div >
                                        <label className="mt-1 me-2">Centro: {props.formData.Centro}</label><label className="mt-1 ms-2">Almacén: {props.formData.Almacen}</label>
                                    </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-3">
                        <label htmlFor="" id="NroItemsSelected" className="m-1">0</label><label className="m-1"> Items Seleccionados</label>
                        <button className="btn btn-success w-100 border -border-0" style={{backgroundColor: "#00B5B8", width: "100%"}}
                            onClick={()=>abrirSibInv()}
                        >
                            Abrir sub Inventario
                        </button>
                    </div> 
                </div>                    
                
            </div> 
            {/*********** cuadro de dialogo para msj de api **********/}
            <MsgModalDialogEspecial
                Show={msgDlgShowApiResponse}
                Title={`Apertura Sub-inventario`}
                Icon="x"
                Message={msgRespuestInv}
                BtnOkName="Aceptar"
                BtnNokName=""
                HandlerClickOk={()=>setMsgDlgShowApiResponse(false)}
                HanlerdClickNok={null}
            />              
            <MsgDialog
                Show={showAbrirSub}
                Title="Apertura Sub-inventario"
                Message="¿Está seguro de Continuar?"
                Icon="x"
                BtnOkName="Si, Continuar"
                BtnNokName="No, Cancelar"
                HanlerdClickNok={()=>setShowAbrirSub(false)}
                HandlerClickOk={()=>procesoAbreSub()}
            />  

            <LocalMsgModalSpinner 
                Show={sHCarga}
                text="Un momento por favor, procesando..."
                color="#FF7588"
            />                        
        </>
    )
};

export default Apertura;