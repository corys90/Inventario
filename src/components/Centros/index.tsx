import { useState } from "react";
import { useSelector } from "react-redux";

function SelectCentro(props: any) {
    
    const emp: any = useSelector((state: any) => state.emp);
    const [valor, setValor] = useState("");

    const handler = (event: any, id: any) =>{
      setValor(event.target.value);
      props.OnSeleccion(event);
    }

    return (
      <select  className="form-select "  aria-label="Default select example" value={valor} onChange={(e) => handler(e, props.id)} id={props.id}>
        <option key={-1} value={""}>Seleccione una opción</option>
        {
            emp.centros.map((opcion: string, index: number)=><option key={index} value={opcion}>{opcion}</option>)
        }
      </select>
    );
} 

export default SelectCentro;