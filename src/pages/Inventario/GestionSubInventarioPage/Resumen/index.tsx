import { useEffect, useState } from "react";
import { Button} from "react-bootstrap"
import LocalMsgModalSpinner from "../../../../components/LocalMsgModalSpinner";
import { httpApiPostText } from "../../../../lib";
import * as env from '../../../../env';
import MsgModalDialogEspecial from "../../../../components/MsgModalDialogEspecial";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";

const Resumen = (props: any) =>{
    const [sHCarga, setSHCarga] = useState(false);  
    const [records, setRecords] = useState(props.data);  
    const [msgRespuestInv, setMsgRespuestInv] = useState("");  
    const [msgDlgShowApiResponse, setMsgDlgShowApiResponse] = useState(false);
    let emp: any = useSelector((state: any) => state.emp);     

    const pagOptions = {
        rowsPerPageText: "Filas por páginas",
        rangeSeparatorText: "de",
        selectAllRowsItem: true,
        selectAllRowsItemText: "Todos"
    }; 
    
    const MsgDlghandlerResponseApi = () =>{
        setMsgDlgShowApiResponse(false);
    }  

    const recargarClasificaciones = async () =>{
        setSHCarga(true);
        const recurso = `${env.REACT_APP_API_URL_DEV}/api/ClasificacionesInventario?Pais=CL&Usuario=${emp.user}`;     
        const response = await httpApiPostText(recurso,"PUT", {
            'Content-Type': 'application/json',
            'Rosen-API-Key': '2B89CE9E-47DF-4EF1-8353-CF0C18EE029F',
            'Rosen-API-Secret': 'EFCFA469-8474-4DCF-B84A-CB1B0835ABDA-CDDC8DDB-6E6E-47CB-9422-B8A4312EC01A',
        }, {});
        setSHCarga(false);
        const arrDta = await JSON.parse(response.message);
        if (response.code >= 400){
            setMsgRespuestInv("No se pudo realizar la opreración");
        }else{
            setMsgRespuestInv(arrDta);
        }
        setMsgDlgShowApiResponse(true);
    }

    useEffect(()=>{
        setRecords(props.data);

    }, [props.data]);

    return(
        <>
            <div className="mb-4 mt-4">
                <Button type="button" className="me-1 border-0" style={{backgroundColor:"#2DCEE3"}} onClick={()=>recargarClasificaciones()}
                 disabled={records.length <= 0}
                >
                    Recargar calificaciones
                </Button>
            </div>
            <DataTable
                columns={props.columns}
                data={records}
                selectableRowsHighlight
                fixedHeader
                pagination
                highlightOnHover
                fixedHeaderScrollHeight="600px"
                paginationComponentOptions={pagOptions}
            />  
            {/*********** cuadro de dialogo para msj de api **********/}
            <MsgModalDialogEspecial
                Show={msgDlgShowApiResponse}
                Title={`Gestión inventario`}
                Icon="x"
                Message={msgRespuestInv}
                BtnOkName="Aceptar"
                BtnNokName=""
                HandlerClickOk={MsgDlghandlerResponseApi}
                HanlerdClickNok={null}
            />   
                     
            <LocalMsgModalSpinner 
                Show={sHCarga}
                text="Un momento por favor, procesando..."
                color="#FF7588"
            />                          
        </>
    )
};

export default Resumen;