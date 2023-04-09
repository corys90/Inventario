import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaRegCalendarAlt, FaTruck } from "react-icons/fa";
import { useSelector } from "react-redux";
import LocalMsgModalSpinner from "../../../../components/LocalMsgModalSpinner";
import MsgDialog from "../../../../components/MsgDialog";
import MsgModalDialogEspecial from "../../../../components/MsgModalDialogEspecial";
import * as env from '../../../../env';
import { httpApiPostText } from "../../../../lib";

const Publicacion = (props: any) =>{  

    const [seleccion, setSeleccion] = useState("");
    const [records, setRecords] = useState([]);   
    const [sHCarga, setSHCarga] = useState(false); 
    const [msgDlgShowApiResponse, setMsgDlgShowApiResponse] = useState(false);
    const [msgRespuestInv, setMsgRespuestInv] = useState("");  
    const [btndisabled, setBtnDisabled] = useState(true);  
    const [showMsgDialog, setShowMsgDialog] = useState(false); 
    let emp: any = useSelector((state: any) => state.emp);      

    let columns = [
        { name: "Familia", selector: (row:any) => row.Negocio, sortable: true, grow:4},
        { name: "Selección", selector: (row:any) => row.Seleccion, grow:2, sortable: true},
        { name: "Cant.Sku", selector: (row:any) => row.Cant_Sku,  sortable: true, right:true},
        { name: "Cuadrados", selector: (row:any) => row.Items_Cuadrados, right:true, sortable: true}, 
        { name: "Dif. Pos.", selector: (row:any) => row.Items_Positivos, sortable: true, grow:1, right:true},
        { name: "Dif. Neg.", selector: (row:any) => row.Items_Negativos, sortable: true, grow:1, right:true},
        { name: "Porc. Cuadratura", selector: (row:any) => row.Porc_Cuadratura, grow:1, right:true, sortable: true},    
    ]    

    const pagOptions = {
        rowsPerPageText: "Filas por páginas",
        rangeSeparatorText: "de",
        selectAllRowsItem: true,
        selectAllRowsItemText: "Todos"
    };     

    const handler = async (e: any) => {
        const filtro = e.target.value;
        setSeleccion(filtro);
        if (filtro !== ""){
            setBtnDisabled(false);
        }else{
            setBtnDisabled(true);            
        }
        let invDet = props.data;
        invDet = invDet.filter((obj: any)=> obj.Subinventario_Id === filtro);
        const auxDta:any = []; 
        invDet.map((obj: any)=>{
            const newObj = {
                Negocio: obj.Negocio,
                Seleccion: <a href="#!" onClick={()=> console.log(obj)}>{obj.Seleccion}</a>,
                Cant_Sku: obj.Cant_Sku,
                Items_Cuadrados: obj.Items_Cuadrados,
                Items_Positivos: obj.Items_Positivos,                    
                Items_Negativos: obj.Items_Negativos,   
                Porc_Cuadratura: obj.Porc_Cuadratura,
            };
            auxDta.push(newObj);
        });
        setRecords(auxDta);   
    }

    const publicar = async () => { 
        setShowMsgDialog(false);
        setSHCarga(true);
        const body = {
            ...props.formData,
            Subinventario_Id: seleccion,
            Publicado_usuario: emp.user
        };
        const recurso = `${env.REACT_APP_API_URL_DEV}/api/PublicacionSubInventario`;     
        const response = await httpApiPostText(recurso, "POST" ,{
            'Content-Type': 'application/json',
            'Rosen-API-Key': '2B89CE9E-47DF-4EF1-8353-CF0C18EE029F',
            'Rosen-API-Secret': 'EFCFA469-8474-4DCF-B84A-CB1B0835ABDA-CDDC8DDB-6E6E-47CB-9422-B8A4312EC01A',
        }, body);
        const arrDta = await JSON.parse(response.message);    
        setSHCarga(false);            
        setMsgRespuestInv(arrDta.Message);
        setMsgDlgShowApiResponse(true);
    }

    const btnPublicar = () =>{
        setShowMsgDialog(true);
    }  

    useEffect(()=>{
        setRecords(props.adata);
    }, [props.data]);
    
    return(
        <>
            <div className="d-flex flex-row">
                <div className="d-flex flex-column w-100 m-4 ">
                    <div className="row d-flex flex-row mb-3" >
                        <div className=" col-md-12 col-lg-2 " style={{fontSize: "14px"}}>
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
                        <div className=" col-md-12 col-lg-4 " style={{fontSize: "14px"}}>
                            <div className="m-2 d-flex flex-column " >                   
                                    <div >
                                        <FaTruck className="me-1" />
                                        <label >Ubicación</label>  
                                    </div>
                                    <div >
                                        <label className="mt-1 me-2">Centro: {props.formData.Centro}</label><label className="mt-1 ms-2">Almacén: {props.formData.Almacen} </label>
                                    </div>
                            </div>
                        </div>
                        <div className=" col-md-12 col-lg-4 " style={{fontSize: "14px"}}>
                            <label htmlFor="">Referencia</label>
                            <select  className="form-select "  aria-label="Default select example" value={seleccion} onChange={(e) => handler(e)} id="seleccion">
                                <option key={-1} value={""}>Seleccione una opción</option>
                                {
                                    props.referencias.map((opcion: string, index: number)=><option key={index} value={opcion}>{opcion}</option>)
                                }
                            </select>                            
                        </div>
                        <div className="col-md-12 col-lg-2 d-flex align-items-center justify-content-end">
                            <button className="btn btn-success border border-0 " style={{backgroundColor: "#00B5B8", width: "75%"}} disabled={btndisabled} onClick={btnPublicar}>Publicar</button>
                        </div> 
                    </div>

                    <div>
                        <DataTable
                            columns={columns}
                            data={records}
                            selectableRowsHighlight
                            fixedHeader
                            pagination
                            highlightOnHover
                            fixedHeaderScrollHeight="600px"
                            paginationComponentOptions={pagOptions}
                        />  
                    </div>
                </div>                    
            </div> 
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

            <MsgDialog 
                Show={showMsgDialog}
                Title="Publicación"
                Message={`¿Está seguro de publicar el sub Inventario ${seleccion}?`}
                BtnOkName="Sí, publicar"
                BtnNokName="Nó, cancelar"
                Icon="x"
                HanlerdClickNok={()=>setShowMsgDialog(false)}
                HandlerClickOk={()=> publicar()}
            />

            <LocalMsgModalSpinner 
                Show={sHCarga}
                text="Un momento por favor, procesando..."
                color="#FF7588"
            />               
        </>
    )
};

export default Publicacion;