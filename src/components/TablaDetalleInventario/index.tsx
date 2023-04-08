import { FaDownload, FaTimesCircle, FaUpload } from "react-icons/fa";
import './style.css';

function TablaDetalleInventario(props: any) {

  return (
    <div className='container-fluid'>
        <div  className="mb-4 fw-bold" >
          {props.header}  
        </div>
        <div className='table-responsive'>
          <table  className='table table-hover table-bordered '>
            <thead>
              <tr >
                {
                  props.columHeader.map((title: string, index: number) => <th className='text-center ' key={index}>{title}</th>)
                }
                {
                  <th key={9}>Acciónes</th>
                }
              </tr>
            </thead>
            <tbody  style={{fontSize: "14px"}} >
                {
                    props.data.map((data: string[], index: number) => 
                      <tr key={index}>
                        {
                          data.map((value: string, index: number)=> <td key={index}>{value}</td>)
                        }
                        {
                          <td key={9} >
                            <div className=' d-flex gap-2 align-item-middle' >
                                <a href="#!" onClick={()=>props.handlerEdit(index)}>
                                  <div className='align-middle text-center'  style={{width: "30px", height: "30px"}}>  
                                    <FaUpload title="Cierre y publicación" color={'white'}  className='bg-success rounded-circle p-1 h3'/>   
                                  </div>
                                </a>                               
                                <a href="#!" onClick={()=>props.handlerInfo(index)}>
                                  <div className='align-middle text-center'  style={{width: "30px", height: "30px"}}>
                                    <FaDownload title="Descarga inventario" color={'white'}  className=' bg-primary rounded-circle p-1 h3'/>  
                                  </div>
                                </a>                                                                       
                                <a href="#!" onClick={()=>props.handlerDelete(index)}>
                                  <div className='align-middle text-center'  style={{width: "30px", height: "30px"}}>
                                    <FaTimesCircle title="Elimina período" color={'white'}   className='bg-danger rounded-circle p-1 h3'/>
                                  </div>   
                                </a>                                                                                         
                            </div>
                          </td>
                        }                           
                      </tr>
                    )
                }
            </tbody>
          </table>
        </div>
    </div> 
  );
}

export default TablaDetalleInventario;