import { Modal } from "react-bootstrap";
import { BeatLoader } from "react-spinners";

const LocalMsgModalSpinner = (props: any) =>{

    return(
        <>
            <Modal size="lg" show={props.Show}       centered>
                <Modal.Body>
                    <div className="verticalAlign">
                        <label>
                            <BeatLoader color={props.color} />
                        </label>                        
                        <label className="h5 text-center">
                            {props.text}
                        </label>
                        <label>
                            <BeatLoader color={props.color} />
                        </label>
                    </div>
                </Modal.Body>
            </Modal>
        </> 
    );
};

export default LocalMsgModalSpinner;