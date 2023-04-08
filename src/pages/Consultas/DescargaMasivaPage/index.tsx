import { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { FaCalendarAlt} from "react-icons/fa";
import { useSelector } from "react-redux";
import BarraMenuHz from "../../../components/BarraMenoHz";
import LocalMsgModalSpinner from "../../../components/LocalMsgModalSpinner";
import MsgDialog from "../../../components/MsgDialog";
import MsgModalDialogEspecial from "../../../components/MsgModalDialogEspecial";
import * as env from '../../../env';
import { httpApiGetText } from "../../../lib";


/************************************/
const DescargaMasivaPage = () =>{

    let formData: {fAdesde:string, fMdesde: string, fAhasta: string, fMhasta: string} = {fAdesde:"", fMdesde: "", fAhasta: "", fMhasta: ""};
    const [showMsgDlg, setShowMsgDlg] =  useState(false); 
    const [sHCarga, setSHCarga] =  useState(false);   
    const [msgDlgShowApiResponse, setMsgDlgShowApiResponse] =  useState(false);   
    const [msgRespuestInv, setMsgRespuestInv] =  useState("");          
    const emp: any = useSelector((state: any) => state.emp);
    let arrayCentros: {idx: number, id: string, estado: boolean, texto:string}[] = [];

    const hndlrBtnExport = async () => {
        if((formData.fAdesde !== "") && (formData.fAhasta !== "")){
            if (formData.fAhasta < formData.fAdesde){
                setShowMsgDlg(true);
            }else{
                if (formData.fMhasta < formData.fMdesde) {
                    setShowMsgDlg(true);
                }else{
                    setSHCarga(true);
                    let centros: string = "";
                    arrayCentros.map((valor: any)=> centros+=valor.id.split("-")[1] + "|");
                    centros = centros.substring(0, centros.length-1);
                    console.log("Centros para api: ", centros); 
                    const recurso = `${env.REACT_APP_API_URL_DEV}/api/ReporteInventarioMasivo?Pais=CL&PeriodoDesde=${formData.fAdesde}${formData.fMdesde}&PeriodoHasta=${formData.fAhasta}${formData.fMhasta}&Diferencias=0&Centros=${centros}`;     
                    const response = await httpApiGetText(recurso,{
                        'Content-Type': 'application/json',
                        'Rosen-API-Key': '2B89CE9E-47DF-4EF1-8353-CF0C18EE029F',
                        'Rosen-API-Secret': 'EFCFA469-8474-4DCF-B84A-CB1B0835ABDA-CDDC8DDB-6E6E-47CB-9422-B8A4312EC01A',
                    });
                    setSHCarga(false);
                    setMsgDlgShowApiResponse(true);
                    if (response.code >= 400){
                        setMsgRespuestInv("No se pudo realizar la operación de descarga.");
                    }else{
                        setMsgRespuestInv("La descarga se ha realizado con éxito!!!.");
                    }
                }
            }
        }else{
            setShowMsgDlg(true);
        }
        
    }

    const manejadorFechas = (fd: any) =>{

        formData = fd;
    }

    const manejadorCHK = (arr: any) =>{
        arrayCentros = [];
        arr.map((valor: any)=>{
            if (valor.estado){
                arrayCentros.push(valor);
            }
        })
    }

    const MsgDlghandlerResponseApi = () =>{
        setMsgDlgShowApiResponse(false);
    }

    /**********************************/
    const RangosFechas = (props: any) => {

        const [fdate, setFdate] = useState({fAdesde:"", fMdesde: "", fAhasta: "", fMhasta: ""});

        const hndlrFdesde = (evnt: any) => {

            const f: Date = evnt.target.value; 
            const yy = f.toString().split('-')[0];
            const mm = f.toString().split('-')[1];
            const fd = {...fdate, fAdesde: yy, fMdesde: mm};
            setFdate(fd);
            props.hndlrFD(fd);
        }

        const hndlrFhasta = (evnt: any) => {

            const f: Date = evnt.target.value; 
            const yy = f.toString().split('-')[0];
            const mm = f.toString().split('-')[1];
            const fd = {...fdate, fAhasta: yy, fMhasta: mm};
            setFdate(fd);
            props.hndlrFH(fd);            
        }  

        return(
            <div className=" row w-75" style={{width: "fit-content"}}>
                    <div className=" mt-2 mb-2 col-md-12 col-lg-4 w-50">
                        <div className="align-middle">
                            <FaCalendarAlt className="h5" /> 
                            <label  className="ms-2" >Desde</label>
                        </div>
                        <div>
                            <input type="month" id="fdesde" size={8} className="ms-2"
                                value={`${fdate.fAdesde}-${fdate.fMdesde}`}
                                onChange={hndlrFdesde} 
                                min="1990-01" max="9999-12"
                            />
                        </div>
                    </div>
                    <div className="mt-2 mb-2 col-md-12 col-lg-4 w-50" >
                        <div className="align-middle">
                            <FaCalendarAlt  className="h5"/> 
                            <label  className="ms-2" >Hasta</label>
                        </div>
                        <div >
                            <input type="month" id="fhasta" size={8}  className="ms-2"
                                value={`${fdate.fAhasta}-${fdate.fMhasta}`}
                                onChange={hndlrFhasta} 
                                min="1990-01" max="9999-12"
                            />
                        </div>
                    </div>              
            </div>
        );
    }

    /************************************/
    const CheckComponents = (props: any) =>{

        let arrToObj: {idx: number, id: string, estado: boolean, texto:string}[] = [];
        let [arrChks, setArrChks] = useState(arrToObj);

        useEffect(()=>{
            const init = () =>{
                arrChks = [];
                props.data.map((valor:string, index: number)=>{
                    const prb = {idx: index, id:("chk-" + valor.split(" - ")[0] + "-" + index), estado: false, texto: valor};
                    arrChks.push(prb);
                });
                setArrChks([...arrChks]);            
            }

            init();
        },[]);

        const hndlrCHK = (evnt: any, idx: number) =>{
            let newCheck = [...arrChks];
            if (evnt.target.checked){  
                newCheck[idx].estado = true
            }else{
                newCheck[idx].estado = false
            }     
            setArrChks([...newCheck]);
            props.hndlrCheck(arrChks);           
        } 

        return(
            <Container className="row border rounded shadow pt-3 pb-3 gap-4  bg-white" >
                <div><label htmlFor="">Centros Disponibles</label></div>
                <div className=" border rounded" style={{height: "70vh", overflowY:"scroll"}}>
                        {
                            arrChks.map((dato: {idx: number, id: string, estado: boolean, texto:string}, index: number)=> 
                                <div className="form-check" key={index}  >
                                    <input className="form-check-input" type="checkbox" 
                                        value={`${dato.idx}`} id={`${dato.id}`} 
                                        onChange={(e: any)=>hndlrCHK(e, index)}
                                        checked={dato.estado}
                                    />
                                    <label className="form-check-label" htmlFor="flexCheckChecked">
                                        {`${dato.texto}`}
                                    </label>
                                </div>
                            )
                        }
                </div>
        </Container>
        );
    }

    return(
        <Container fluid>
        <BarraMenuHz/>  
            <div>
                <div className="text-primary ms-3 mt-3">
                            Home / Consulta / Descarga Masiva de Inventario
                </div>  
                <div className="h4 mt-4 mb-4 ms-3">DESCARGA MASIVA DE INVENTARIO</div>
            </div> 
            <div className=" border rounded shadow p-3 mb-4" >
                <div className="row">
                    <RangosFechas hndlrFD={manejadorFechas} hndlrFH={manejadorFechas} />
                    <div className="col-md-12 col-lg-3 " > 
                        <Button type="button" className="btn btn-lg border-0" style={{backgroundColor:"#16D39A"}} onClick={()=>hndlrBtnExport()}>
                            Exportar
                        </Button>
                    </div>     
                </div>                    
            </div>
            <div className="container">
                <CheckComponents data={emp.centros} hndlrCheck={manejadorCHK}  />                
            </div>
            <MsgDialog
                Show={showMsgDlg}
                Title="Descarga Masiva"
                Message="Debe seleccionar un rango de fechas válidas y al menos un centro para exportar"
                BtnOkName="Aceptar"
                BtnNokName=""
                HandlerClickOk={()=>setShowMsgDlg(false)}
                Icon="!"
                HanlerdClickNok={null}
            />
            {/*********** cuadro de dialogo para msj de api **********/}
            <MsgModalDialogEspecial
                Show={msgDlgShowApiResponse}
                Title={`Descarga masiva`}
                Icon="x"
                Message={msgRespuestInv}
                BtnOkName="Aceptar"
                BtnNokName=""
                HandlerClickOk={MsgDlghandlerResponseApi}
                HanlerdClickNok={null}
            />             

            <LocalMsgModalSpinner 
                Show={sHCarga}
                text="Un momento porfavor, procesando..."
                color="#FF7588"
            />                     
        </Container>
    );
}

export default DescargaMasivaPage;
