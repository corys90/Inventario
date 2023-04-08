import './style.css';

function TablaModalDetalleRepInventario(props: any) {

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
              </tr>
            </thead>
            <tbody  style={{fontSize: "14px"}} >
                {
                    (props.data.length > 0) 
                    ? props.data.map((data: string[], index: number) => 
                        <tr key={index}>
                          {
                            data.map((value: string, index: number)=> <td key={index}>{value}</td>)
                          }                         
                        </tr>
                      )
                      :null
                }
            </tbody>
          </table>
        </div>
    </div> 
  );
}

export default TablaModalDetalleRepInventario;