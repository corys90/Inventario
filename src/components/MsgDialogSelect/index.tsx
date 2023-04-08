import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { FaExclamationCircle } from "react-icons/fa";
import './style.css';

const MsgDialogSelect = (props: {Show: boolean, Title: string, Icon: string, Message: string[], 
                  BtnOkName: string, BtnNokName: string, 
                  HandlerClickOk: any, HanlerdClickNok: any}) => {
                   
 return (
      <div>
        <Modal show={props.Show} centered={true} >
            <Modal.Header  >
                <Modal.Title className='h3 text-center'>
                    {                        
                        props.Title
                    }
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='d-flex flex-row gap-4  align-middle'>
                    {/* <div ><FaExclamationCircle className='text-success' style={{fontSize:"5rem"}}/></div> */}
                    <div className='d-flex align-items-center '>
                        <span className=' h5'>
                            <select className="form-select" aria-label="Default select example">
                                <option>Seleccione la clasificación</option>
                                {props.Message.map((value: string, index: number)=><option key={index} value={value}>{value}</option>)}
                            </select>
                        </span>
                    </div>
                </div>
            </Modal.Body>                
            <Modal.Footer className=''>
                {
                    (props.BtnOkName) 
                        ? 
                        <Button type="button" className="btn btn-success btnColorOk" onClick={props.HandlerClickOk}>
                            {props.BtnOkName}
                        </Button>
                        : <div></div>
                }      
                {
                    (props.BtnNokName) 
                        ? 
                        <Button type="button" className="btn btn-danger btnColorNOk" onClick={props.HanlerdClickNok}>
                            {props.BtnNokName}
                        </Button>
                        : <div></div>
                }                                      
            </Modal.Footer>
        </Modal>
      </div>
  );
}

export default MsgDialogSelect;