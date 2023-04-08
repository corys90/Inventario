import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useSelector } from "react-redux";

function SelectAlmacenes(props?: any) {

  const emp: any = useSelector((state: any) => state.emp);
  const [valor, setValor] = useState("");
  const [filtro, setFiltro] = useState([]);

  useEffect(()=>{

    const filtro = () => {

      if (props.centro){
         const cnt = props.centro.split("-")[0].trim();
        setFiltro(emp.almacenes.filter((alm: any)=>alm.substring(0, 3) === cnt.substring(0, 3)));     
      }

    }

    filtro();

  },[props.centro]);

  const handler = (event: any, id: any) =>{
    setValor(event.target.value);
    props.OnSeleccion(event);
  }   

    return (
      <Form.Select  value={valor} aria-label="Default select example" onChange={(e) => handler(e, props.id)}  id={props.id}>
        <option key={-1} value={""}>Seleccione una opción</option>
        {
            (filtro.length > 0) 
              ? filtro.map((opcion: string, index: number)=><option key={index} value={opcion}>{opcion}</option>)
              : null
        }
      </Form.Select>
    );
} 

export default SelectAlmacenes;

