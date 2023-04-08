import { useSelector } from "react-redux";
import Multiselect from 'multiselect-react-dropdown';

const MultiselectOptions = (props: any) => {

    const emp: any = useSelector((state: any) => state.emp);

    const onSelectedOption = (arr: any, opc: string) =>{
            const arrOpt: any[] = [];
            arr.map((cnt: string)=>{
                    const c = cnt.split("-")[0].trim();
                    const nm =  cnt.split("-")[1].trim();
                    const a = emp.almacenes.filter((alm: string)=>alm.substring(0, 3) === c.substring(0, 3));
                    if(a.length > 0){
                        const almacenDefecto: string = a[0].split("-")[0].trim();
                        arrOpt.push( c + "-" + almacenDefecto);  
                    }
            }, );
            props.OnSelectedOptions(arrOpt);
    }

    return (
        <Multiselect className="" aria-label="Default select example" 
            isObject={false}
            onRemove={(e: any, opc: string)=>onSelectedOption(e, opc)}
            onSelect={(e: any, opc: string)=>onSelectedOption(e, opc)}
            options={emp.centros}
        />
    );
}

export default MultiselectOptions;