import { useState } from 'react';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { FaExclamationCircle } from "react-icons/fa";
import './style.css';

const ModalAbrirPeriodo = (props: {Show: boolean, Title: string, Icon: string, Message: string, 
                  BtnOkName: string, BtnNokName: string, 
                  HandlerClickOk: any, HanlerdClickNok: any}) => {

    const [texto, setTexto] = useState("");
    const [btnOk, setBtnOk] = useState(true);

    const onChangeText = (evnt: any) =>{
        if (evnt.target.value.length > 0){
            setBtnOk(false);
        }else{    
            setBtnOk(true);
        }
        setTexto(evnt.target.value);
    }

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
                <div className='d-flex flex-column gap-4 justify-content-center align-middle'>
                    <div className='d-flex justify-content-center '><FaExclamationCircle className='text-success' style={{fontSize:"4rem"}}/></div>
                    <div className=''><span className=' h5'>{props.Message}</span></div>
                    <div className=''> 
                        <input type="text" className="form-control" name="" id="texto" value={texto} onChange={(e: any)=>onChangeText(e)}/>
                    </div>
                </div>
            </Modal.Body>                
            <Modal.Footer className=''>
                {
                    (props.BtnOkName) 
                        ? 
                        <Button type="button" className="btn btn-success btnColorOk" 
                            onClick={()=>{
                                setTexto("");
                                props.HandlerClickOk(texto)
                            }}
                            disabled={btnOk}    
                        >
                            {props.BtnOkName}
                        </Button>
                        : <div></div>
                }      
                {
                    (props.BtnNokName) 
                        ? 
                            <Button type="button" className="btn btn-danger btnColorNOk" onClick={()=>{
                                    setTexto("");  
                                    props.HanlerdClickNok();
                                }}
                            >
                                {props.BtnNokName}
                            </Button>
                        :   <div></div>
                }                                      
            </Modal.Footer>
        </Modal>
      </div>
  );
}

export default ModalAbrirPeriodo;