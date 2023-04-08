import { useState } from "react";
import { Accordion, Button, Container, Form } from "react-bootstrap";
import { FaBarcode, FaPrint, FaTruck } from "react-icons/fa";
import SelectAlmacenes from "../../../components/Almacenes";
import SelectCentro from "../../../components/Centros";
import LocalMsgModalSpinner from "../../../components/LocalMsgModalSpinner";
import { httpApiGetText, httpApiPostText } from "../../../lib";
import * as env from '../../../env';
import './style.css';
import { useSelector } from "react-redux";
import MsgDialog from "../../../components/MsgDialog";
import MsgModalDialogEspecial from "../../../components/MsgModalDialogEspecial";
import BarraMenuHz from "../../../components/BarraMenoHz";

const EtiquetaSinRefPage = () =>{

    const emp: any = useSelector((state: any) => state.emp);
    const [sHCarga, setSHCarga] = useState(false);
    const [msgResponse, setMsgResponse] = useState("");     
    const [msgDlgShow, setMsgDlgShow] = useState(false);  
    const [msgDlgShowImp, setMsgDlgShowImp] = useState(false);            
    const [opcionesSelect, setOpcionesSelect] = useState([{}]);
    const [SizeTag, setSizeTag] = useState("");    
    let [formData, setFormData] = useState({CodigoPr:"", unidadMedida:"", descripcion: "", cantEtiqueta:"1", 
                                            cantEtiquetaImp: "1", codigoCentro2: "", codigoAlmacen: "", 
                                            urlOpcionImp: "", SizeTag: ""});

    const PostImpresorasImpresion = async (body: any) =>{

        setSHCarga(true);
        const recurso = `${env.REACT_APP_API_URL_DEV}/api/Impresoras`;     
        const res = await httpApiPostText(recurso, "POST", {
            'Content-Type': 'application/json',
            'Rosen-API-Key': `${env.REACT_APP_Rosen_API_Key}`,
            'Rosen-API-Secret': `${env.REACT_APP_Rosen_API_Secret}`,
        }, body);
        const dt = await JSON.parse(res.message);   
        setSHCarga(false);        
        if(res.code >= 400){
            setMsgResponse("Ha habido un problema el genrer el archivo de impresión");
        }else{
            setMsgResponse(dt.Message);
        }
        setMsgDlgShowImp(true); 
        console.log(dt);
    }

    const GetInfoProductos = async (producto: string) => {

        setSHCarga(true);
        const recurso = `${env.REACT_APP_API_URL_DEV}/api/Producto?CodProducto=${producto}`;     
        const response = await httpApiGetText(recurso, {
            'Rosen-API-Key': `${env.REACT_APP_Rosen_API_Key}`,
            'Rosen-API-Secret': `${env.REACT_APP_Rosen_API_Secret}`,
        });
        const dt = await JSON.parse(response.message);    
        formData = {...formData, descripcion: dt.Descripcion, unidadMedida:dt.UnidadMedida};
        setFormData(formData); 
        setSHCarga(false);
    }

    const GetobtenerImps = async (centro: string, user: string) =>{

            setSHCarga(true);
            const recurso = `${env.REACT_APP_API_URL_DEV}/api/Impresoras?Pais=CL&Centro=${centro}&Usuario=${user}`;     
            const data = await httpApiGetText(recurso, {
                'Rosen-API-Key': `${env.REACT_APP_Rosen_API_Key}`,
                'Rosen-API-Secret': `${env.REACT_APP_Rosen_API_Secret}`,
            });
            const dt = await JSON.parse(data.message);    
            setOpcionesSelect(dt);   
            setSHCarga(false);
    }

    const hndlrOpcionCentro = (evnt: any) =>{
        formData = {...formData, [evnt.target.id]: evnt.target.value.split("-")[0].trim()};
        GetobtenerImps(evnt.target.value.split("-")[0].trim(), emp.user);
        setFormData(formData); 
    }

    const hndlrOpcionCentro2 = (evnt: any) =>{
        formData = {...formData, [evnt.target.id]: evnt.target.value.split("-")[0].trim()};
        setFormData(formData); 
    }

    const hndlrOpcionAlmacen = (evnt: any) =>{
        formData = {...formData, [evnt.target.id]: evnt.target.value.split("-")[0].trim()};
        setFormData(formData); 
    }

    const changeText = (evnt: any) => {
        formData = {...formData, [evnt.target.id]: evnt.target.value.trim()}
        setFormData(formData);      
    }

    const keyPressEnter = (evnt: any) => {
        if ((evnt.keyCode === 13) && (formData.CodigoPr !== "")){
            GetInfoProductos(formData.CodigoPr);    
        }   
    }     

    const hndlBtnImprimir = () => {

        const bdy = {
            URL: formData.urlOpcionImp,
            ZPL: "",
            Codigo_Producto:formData.CodigoPr,
            Unidad_Medida:formData.unidadMedida,
            Descripcion: formData.descripcion,
            Cantidad_En_Etiqueta:formData.cantEtiqueta,
            Cantidad_De_Etiquetas: formData.cantEtiquetaImp,
            Tipo_Etiqueta: SizeTag
        };

        if ( (formData.urlOpcionImp === "") || 
             (formData.unidadMedida === "") || 
             (formData.cantEtiqueta === "" || parseInt(formData.cantEtiqueta) <= 0) ||
             (formData.cantEtiquetaImp === "" || formData.cantEtiquetaImp === "0") ||
             (formData.codigoCentro2 === "") ||
             (formData.codigoAlmacen === "") ||
             (SizeTag === "")){

                setMsgDlgShow(true);

        }else{
            PostImpresorasImpresion(bdy);           
        }
    }

    const handlerSizeTag = (evnt: any) =>{
        setSizeTag(evnt.target.value);     
    }

    const MsgDlghandlerImpOk = () =>{

        setMsgDlgShowImp(false);
    }    
    
    return(
        <>
            <Container fluid>
                <BarraMenuHz/>                   
                <Container fluid >                   
                    <div >
                        <div className="text-primary mt-3">
                            Home / Impresiones / Etiqueta sin referencia
                        </div>
                        <div className="h4 mt-4 mb-4">IMPRIMIR ETIQUETAS SIN REFERENCIA</div>
                    </div>
                    <Accordion defaultActiveKey={['0']} alwaysOpen className="mb-4">
                        <Accordion.Item eventKey="0" className="border shadow">
                            <Accordion.Header > <div className=" h5 text-dark"> SELECCIÓN DE IMPRESORA </div></Accordion.Header>
                            <Accordion.Body className=" mt-4">
                                <label className="form-label h6  mb-5">INFORMACIÓN IMPRESORA POR RED</label>  
                                <div className="row ">
                                    <div className="col col-lg-6 col-sm-12 ">
                                        <Container fluid className=" mb-3" >
                                            <label className="form-label">Seleccionar Centro de distribución donde se localiza la Impresora. *</label>    
                                            <div > <SelectCentro id="centro1" OnSeleccion={hndlrOpcionCentro} /></div>
                                        </Container>
                                    </div>  
                                    <div className="col col-lg-6 col-sm-12 ">                                                                  
                                        <Container fluid  className="m-1">
                                            <label className="form-label">Seleccionar Impresora. *</label>
                                            <div className="mb-4"  >
                                            <Form.Select aria-label="Default select example" id="urlOpcionImp"  onChange={changeText}>
                                                <option value={""}>Seleccione la impresora</option>
                                                {
                                                    (opcionesSelect.length > 0 ) ? (opcionesSelect.map((valor: any, index: number)=><option key={index} value={valor.Url}>{valor.Descripcion}</option>)) : ""
                                                }
                                            </Form.Select>  
                                            </div>   
                                        </Container>  
                                    </div>
                                </div>                          
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                    <Accordion defaultActiveKey={['0']} alwaysOpen>
                        <Accordion.Item eventKey="0" className="border shadow ">
                            <Accordion.Header><div className=" h5 text-dark"> INFORMACIÓN ETIQUETAS </div></Accordion.Header>
                            <Accordion.Body>
                                <label className="h6 mb-3">Recuerda completar todos los campos que tienen *</label> 
                                <div className="align-middle">
                                    <FaTruck className="h5" /> 
                                    <label className="ms-2 h4 ">Centro y almacen</label>
                                </div>
                                <hr className="t-0 m-0 mb-3" />

                                <div className="d-flex flex-row mb-3">
                                    <Container fluid className="mb-3" >
                                        <label className="form-label">Seleccionar Centro de distribución *</label>    
                                        <div><SelectCentro id="codigoCentro2"  OnSeleccion={hndlrOpcionCentro2}/></div>
                                    </Container>
                                    <Container fluid className="mb-3" >
                                        <label className="form-label">Seleccionar Almacen *</label>    
                                        <div ><SelectAlmacenes id="codigoAlmacen" centro={formData.codigoCentro2} OnSeleccion={hndlrOpcionAlmacen} /></div>
                                    </Container>
                                </div>

                                <div className="d-flex flex-column m-2 mb-4">
                                    <label className="form-label">Seleccionar Tipo de Etiqueta *</label>    
                                    <div className="row">
                                        <div className="col col-lg-6 col-md-6">
                                            <select  className="form-select" id="sizeTag" aria-label="Default select example" value={SizeTag} onChange={(e: any) => handlerSizeTag(e)}>
                                                <option key={-1} value={""}>Seleccione una opción</option>
                                                <option key={0} value={"G"}>Grande</option>
                                                <option key={1} value={"P"}>Pequeña</option>
                                            </select>
                                        </div>                                        
                                    </div>
                                </div>                                

                                <div className="align-middle">
                                    <FaBarcode className="h5" /> 
                                    <label className="ms-2 h4 ">Datos para etiqueta</label>
                                </div>
                                <hr className="t-0 m-0 mb-3" />
                                
                                <div className=" row ">
                                    <div className="d-flex flex-column col col-lg-6 mb-3">
                                        <label>Código de producto (escriba código y pulse enter) *</label>
                                        <input type="number" id="CodigoPr" onKeyUp={keyPressEnter} onBlur={()=> {if (formData.CodigoPr !== "") GetInfoProductos(formData.CodigoPr)}}  onChange={changeText} value={formData.CodigoPr} min={1} required/>
                                    </div>    

                                    <div className="d-flex flex-column col col-lg-6  mb-3">
                                        <label>Unidad de Medida *</label>
                                        <input type="text" id="unidadMedida" disabled={true}  onChange={changeText} value={formData.unidadMedida}/>
                                    </div>  
                                    
                                    <div className="d-flex flex-column col col-lg-6  mb-3">
                                        <label>Descripción etiqueta *</label>
                                        <input type="text" id="descripcion" disabled={true} onChange={changeText} value={formData.descripcion} />
                                    </div>   

                                    <div className="d-flex flex-column col col-lg-6  mb-3">
                                        <label>Cantidad en Etiqueta *</label>
                                        <input type="number" id="cantEtiqueta"  onChange={changeText} value={formData.cantEtiqueta} min={1} required/>
                                    </div>   
                                    
                                    <div className="d-flex flex-column col  col-lg-6  mb-3">
                                        <label>Cantidad de Etiquetas a Imprimir *</label>
                                        <input type="number" id="cantEtiquetaImp"  onChange={changeText} value={formData.cantEtiquetaImp} min={1}  required/>
                                    </div>                                                                 
                                                                    
                                </div>

                                <hr className="t-0 m-0 mb-3" />
                                
                                <div className="text-end">
                                    <Button type="button" style={{backgroundColor:"#00B5B8"}} className="border-0" onClick={hndlBtnImprimir}>
                                        <FaPrint className="h6 m-2"/>Imprimir
                                    </Button>
                                </div>
                            
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Container> 
                {/*********** seccion de modales **********************/}
                <MsgModalDialogEspecial
                    Show={msgDlgShow}
                    Title={`Impresión de etiquetas`}
                    Icon="x"
                    Message="Importante: los campos con (*) son obligatorios y Cantidad de etiquetas a imprimir debe tener valores superiores a 0. Verifiquelos por favor!!!"
                    BtnOkName="Aceptar"
                    BtnNokName=""
                    HandlerClickOk={()=>setMsgDlgShow(false)}
                    HanlerdClickNok={null}
                />                   

                {/*********** cuadro de dialogo para impresion exitosa **********/}
                <MsgDialog
                    Show={msgDlgShowImp}
                    Title={`Imprimir etiquetas`}
                    Icon="x"
                    Message={msgResponse}
                    BtnOkName="Aceptar"
                    BtnNokName=""
                    HandlerClickOk={MsgDlghandlerImpOk}
                    HanlerdClickNok={null}
                />                              
                
                <LocalMsgModalSpinner 
                    Show={sHCarga}
                    text="Un momento porfavor, procesando..."
                    color="#FF7588"
                />                                                   
            </Container>
        </>
    );
}

export default EtiquetaSinRefPage;
