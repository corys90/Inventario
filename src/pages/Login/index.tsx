import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Alert, Button, Col, Container, Form } from 'react-bootstrap';
import { FaDoorOpen, FaKey, FaRegBuilding, FaRegHandPaper, FaUserTie } from 'react-icons/fa';
import MsgDialog from '../../components/MsgDialog';
import MsgModalSpinner from '../../components/MsgModalSpinner';
import * as env from '../../env';
import { getCentros, getAlmacenes, getDominios, getXmlNodeFromXmlString, getXmlNodeFromXmlStringArray} from '../../lib';
import './style.css';
import { SetEntornoEmp } from '../../redux/store/Actions';
import { fncDominios, fncValidaUsuario } from '../../util';
import { ReactSVG } from "react-svg";

const PageLogin = () => {

    const navigate = useNavigate();
    const [msgDlgShow, setMsgDlgShow] = useState(false);
    const [msgAlrtUsr, setMsgAlrtUsr] = useState(false);
    const [msgAlrtPwd, setMsgAlrtPwd] = useState(false);
    const [msgAlrtDom, setMsgAlrtDom] = useState(false);
    const [sHCarga, setSHCarga] = useState(false);    
    const dispatch = useDispatch();
    let [formData, setFormData] = useState({idUser:"app_test", password:"app_test", dominio: "ROSENCHILE"});
    let [xmlTree, setXmlTree ]= useState(new Array());

    const changeText = (evnt: any) => {

        formData = {...formData, [evnt.target.id]: evnt.target.value.trim()}
        setFormData(formData);
        setMsgAlrtUsr(false);
        setMsgAlrtPwd(false);
        setMsgAlrtDom(false);       
    }

    const keyPress = (evnt: any) => {
        if (evnt.key === "Enter"){
            sendForm(evnt);
        }      
    }    

    const sendForm = async(e: any) =>{
        e.preventDefault();

        let sw = 0;
        
        (formData.idUser === "") ? setMsgAlrtUsr(true) : sw++; 
        (formData.password === "") ? setMsgAlrtPwd(true) : sw++; 
        (formData.dominio === "") ? setMsgAlrtDom(true): sw++;

        if (sw === 3){
            setSHCarga(true);
            const recurso = `${env.REACT_APP_API_URL_PROD}/wsseguridad/wsseguridad20.asmx/fncValidaUsuario`;            
            const data = await fncValidaUsuario(recurso, formData.dominio, formData.idUser, formData.password);
            const res = getXmlNodeFromXmlString("short", data.message);
            setSHCarga(false);

            if (data){
                setSHCarga(false);
                if (res === "0") {
                    setMsgDlgShow(true);
                }else{
                    // trae los codigos-descripción de los centros
                    const centros = await getCentros(formData.dominio, formData.idUser, "inventario_corp");
                    const codigos = await getXmlNodeFromXmlStringArray("lista_valores_asignados", "descripcion", centros.message);
                    // trae los codigos-descripción de los almecenes
                    const almacene = await getAlmacenes(formData.dominio, formData.idUser, "inventario_corp");
                    const listalmacenes = await getXmlNodeFromXmlStringArray("lista_valores_asignados", "descripcion", almacene.message);                    

                    sessionStorage.setItem("entorno", JSON.stringify({pais:formData.dominio, user:formData.idUser, centros:codigos, almacenes:listalmacenes}));
                    dispatch(SetEntornoEmp({pais:formData.dominio, user:formData.idUser, centros:codigos, almacenes:listalmacenes }));
                    navigate("/dashboard");
                }                
            }else{
                alert("Error: Problemas en la comunciación. Comunicarse con soporte");
            }
        }
    }

    /* manejadores de msgDialog */
    const handlerOk = () => {
        setMsgDlgShow(false);
    }

    useEffect(()=>{

        const init = async () =>{
            const recurso = `${env.REACT_APP_API_URL_PROD}/wsseguridad/wsseguridad20.asmx/fncDominios`;            
            const data = await fncDominios(recurso);

            let aux = getDominios(data.message);
            aux = aux.splice(1, aux.length - 1);

            setXmlTree(aux);
        }

        init();
    }, []);

    return(
        <>
            <div className='container mt-5 shadow-lg p-3 mb-5 border rounded bg-light pageMobile'>
                <Container className=' container-sm rounded' >
                    <ReactSVG src='./logo-rosen3.svg' className=" d-block img-fluid mx-auto m-3"  style={{width: "250px", height:"100px"}}/>
                </Container>
                <Container>
                    <div className='m-3 text-center'><span className='h3'>Inicio de sesión</span></div>
                    <Form>
                        <Form.Group className="mb-3" >
                            <Form.Label><FaUserTie /> Usuario</Form.Label>
                            <Form.Control type="user" placeholder="usuario" id="idUser" onChange={changeText} value={formData.idUser}/>
                            <Form.Text>
                                <Alert variant="danger" show={msgAlrtUsr} className="p-1 m-0">
                                    <FaRegHandPaper className='mb-1' /> Debe ingresar un usuario válido!!!
                                </Alert>
                                <div className=" text-end ">Ingrese con un usuario autorizado</div>
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label> <FaKey /> Constraseña</Form.Label>
                            <Form.Control type="password" placeholder="contraseña"  id="password" onChange={changeText} onKeyUp={keyPress} value={formData.password}/>
                            <Form.Text>
                                <Alert variant="danger" show={msgAlrtPwd} className="p-1 m-0">
                                        <FaRegHandPaper className='mb-1' /> Debe ingresar una contraseña válida!!!
                                </Alert>
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Label> <FaRegBuilding /> Dominio</Form.Label>
                            <Form.Select aria-label="Dominio"  id="dominio"  onChange={changeText}  defaultValue={"ROSENCHILE"}>
                                <option value="ROSENCHILE"  key={-1}>ROSENCHILE</option>
                                {/*{
                                   xmlTree !=null ? xmlTree.map((dominio: string, idx: number) => <option value={dominio} key={idx}>{dominio}</option>): null 
                                }*/}
                            </Form.Select>  
                            <Form.Text>
                                <Alert variant="danger" show={msgAlrtDom} className="p-1 m-0">
                                        <FaRegHandPaper className='mb-1' /> Debe seleccionar un dominio.
                                </Alert>
                            </Form.Text>                             
                        </Form.Group>  
                        <Form.Group className="mt-4 mb-4">
                            <Col className='text-center mt-3'>
                                <Button onClick={sendForm} className='w-75 border ' style={{backgroundColor: " #404E67", height:"60px"}}> <FaDoorOpen /> Ingresar</Button>
                            </Col>
                        </Form.Group>                                           
                    </Form>
                </Container>
            </div>
            {/*********** seccion de modales **********************/}
            {/*********** cuadro de dialogo para errores **********/}
            <MsgDialog
                Show={msgDlgShow}
                Title={`Inicio de sesión`}
                Icon="!"
                Message="Usuario y/o password incorrecto. Por favor verifiquelo y vuelva a intentar."
                BtnOkName="Aceptar"
                BtnNokName=""
                HandlerClickOk={handlerOk}
                HanlerdClickNok={null}
            />
            <MsgModalSpinner 
                Show={sHCarga}
                text="Un momento porfavor, validando acceso y cargando valores..."
                color="#FF7588"
            />
        </>
    )

};

export default PageLogin;