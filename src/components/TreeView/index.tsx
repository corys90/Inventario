import { useEffect, useState } from "react";
import { FaAngleDoubleDown, FaAngleDoubleRight } from "react-icons/fa";

const  TreeView = (props: any) => {

    let chksTrue: string[] = [];
    
    const Tree = (props:any ) => {
        
        const TreeNode = (props: any) => {

            const { children, name, seleccionable } = props.node;
            let [ndSh, setNdsh] = useState({ID: "", name: "", seleccionable: "", children: []});
            let [shwChil, setShwChil] = useState(false);

            useEffect(()=>{
                const chekcsInArray = (arrHjs: any)=>{
                    arrHjs.map((hj: any)=>{
                           const idx = chksTrue.findIndex((chk)=> chk === hj.ID);
                           if (idx >= 0){
                                let chk = document.getElementById(hj.ID) as HTMLInputElement | null;
                                if (chk !== null){
                                    chk.checked = true;
                                }
                           }
                    });
                }
                if (shwChil)
                    chekcsInArray(ndSh.children);

            }, [shwChil]);

            const handleClick = (nd: any) => {
                setNdsh(nd);
                setShwChil(!shwChil);
            };
        
            const ponerHijosTrue = (arrHijos: any) =>{
                arrHijos.map((hj: any)=>{
                    if (hj.seleccionable !== "false"){
                        let chk = document.getElementById(hj.ID) as HTMLInputElement | null;
                        if (chk !== null){
                            chk.checked = true;
                        }
                        const srrTmp = chksTrue.filter((dato)=> dato === hj.ID);                     
                        if (srrTmp.length < 1){
                            chksTrue.push(hj.ID);
                        }

                        let vl = document.getElementById(hj.ID.split(";")[0] + ";" + hj.ID.split(";")[1]) as HTMLInputElement | null;
                        if (vl !== null){
                            let nhs = parseInt(vl.value);
                            vl.value = ("" + (++nhs));
                        }                   
                        if (hj.children.length > 0){
                            ponerHijosTrue(hj.children);
                        }  
                    }
                });                
            }

            const ponerTrue = (nd: any)=>{
                if (nd.ID.split(";").length === 1){
                        // .....actualiza el mismo abuelo.... //
                        chksTrue.push(nd.ID);
                        // actualiza sus hijos
                        nd.children.map((hj: any)=>{
                            if (hj.seleccionable !== "false"){
                                let chk = document.getElementById(hj.ID) as HTMLInputElement | null;
                                if (chk !== null){
                                    chk.checked = true;
                                }
                                const srrTmp = chksTrue.filter((dato)=> dato === hj.ID);                     
                                if (srrTmp.length < 1){
                                    chksTrue.push(hj.ID);
                                }
                                if (hj.children.length > 0){
                                    ponerHijosTrue(hj.children);
                                }
                            }
                        });
                        // actualiza el value del abuelo 
                        let vl = document.getElementById(nd.ID) as HTMLInputElement | null;
                        if (vl !== null){
                            vl.value = "" + nd.children.length;
                        }
                }else{
                    if (nd.ID.split(";").length === 2){
                        //actualiza al padre poniendo un check
                        let chk = document.getElementById(nd.ID.split(";")[0]) as HTMLInputElement | null;
                        if (chk !== null){
                            chk.checked = true;
                        }                        
                        // .. verifica si el padre ya está en arreglo, si no, incluirlo
                        let srrTmp = chksTrue.filter((dato)=> dato === nd.ID.split(";")[0]);                     
                        if (srrTmp.length < 1){
                            chksTrue.push(nd.ID.split(";")[0]);
                        }
                         // aumenta el value del padre en uno.
                        //let nhs = parseInt(document.getElementById(nd.ID.split(";")[0]).value); 
                        let vl = document.getElementById(nd.ID.split(";")[0]) as HTMLInputElement | null;
                        if (vl !== null){
                            let nhs = parseInt(vl.value);
                            vl.value = "" + (++nhs);
                        }                  

                        // ....actualizo yo mismo..... //
                        chksTrue.push(nd.ID); 

                        // Se actualiza el estado de los hijos //
                        if (nd.children.length > 0){
                            ponerHijosTrue(nd.children);
                        }                                                                             
                    }else{
                        if (nd.ID.split(";").length === 3){
                            // .....actualiza abuelo .... //
                            let chk = document.getElementById(nd.ID.split(";")[0]) as HTMLInputElement | null;
                            if (chk !== null){
                                chk.checked = true;
                            } 
                            // verifica si abuelo ya existe en arreglo, de no estarlo, incluirlo
                            let srrTmp: any = chksTrue.filter((dato)=> dato === nd.ID.split(";")[0]);                     
                            if (srrTmp.length < 1){
                                chksTrue.push(nd.ID.split(";")[0]);
                            }
                            // verifica si hay una combiación de ABUELO/PADRE en el arreglo, si no están, el valor de el se incrementa en 1
                            srrTmp = chksTrue.findIndex((dato)=> dato === (nd.ID.split(";")[0] + ";" + nd.ID.split(";")[1]));                           
                            if (srrTmp < 0){ 
                                chksTrue.push(nd.ID.split(";")[0] + ";" + nd.ID.split(";")[1]);                         
                            }
                            // ....actualiza el padre..... //                            
                            // ponerlo en true
                            chk = document.getElementById(nd.ID.split(";")[0] + ";" + nd.ID.split(";")[1]) as HTMLInputElement | null;
                            if (chk !== null){
                                chk.checked = true;
                            } 
                            //Si padre existe en el arreglo no incluirlo, si no, incluirlo.
                            srrTmp = chksTrue.filter((dato)=> dato === (nd.ID.split(";")[0] + ";" + nd.ID.split(";")[1])); 
                            if (srrTmp.length < 1){
                                chksTrue.push(nd.ID.split(";")[0] + ";" + nd.ID.split(";")[1]);
                            }
                            // aumentarle el value de hijos seleccionados al padre                                  
                            let vl = document.getElementById(nd.ID.split(";")[0] + ";" + nd.ID.split(";")[1]) as HTMLInputElement | null;
                            if (vl !== null){
                                let nhs = parseInt(vl.value);
                                vl.value = ("" + (++nhs));
                            }
                            // ....actualizo yo mismo..... //
                            chksTrue.push(nd.ID);  
                        }
                    }  
                }
            }

            const ponerHijosFalse = (arrHijos: any) =>{
                arrHijos.map((hj: any)=>{
                    if (hj.seleccionable !== "false"){
                        // pone a nieto en false y lo borra del arreglo
                        let chk = document.getElementById(hj.ID) as HTMLInputElement | null;
                        if (chk !== null){
                            chk.checked = false;
                        }
                        const idx = chksTrue.findIndex((dato)=> dato === hj.ID);
                        if (idx >= 0) {
                            chksTrue.splice(idx, 1);
                        }                    
                        if (hj.children.length > 0){
                            ponerHijosFalse(hj.children);
                        }   
                    }
                });                
            }            

            const ponerFalse = (nd: any)=>{
                if (nd.ID.split(";").length === 1){
                        // .....actualiza el mismo padre.... //
                        // actualiza hijos
                        nd.children.map((hj: any)=>{
                            if(hj.seleccionable !== "false"){
                                const chkbx = document.getElementById(hj.ID) as HTMLInputElement | null;
                                if (chkbx !== null) {
                                    chkbx.checked = false;
                                }
                                const idx = chksTrue.findIndex((dato)=> dato === hj.ID);
                                if (idx >= 0) {
                                    chksTrue.splice(idx, 1);
                                }                             
                                if (hj.children.length > 0){
                                    ponerHijosFalse(hj.children);
                                }
                            }
                        });
                        // se eleimina el mismo del arreglo
                        const idx = chksTrue.findIndex((dato)=> dato === nd.ID);
                        if (idx >= 0) {
                            chksTrue.splice(idx, 1);
                        }                                                
                }else{
                    if (nd.ID.split(";").length === 2){
                        // elimina los hijos del arreglo
                        if (nd.children.length > 0){
                            ponerHijosFalse(nd.children);
                        }
                        // se eleimina el mismo del arreglo
                        const idx = chksTrue.findIndex((dato)=> dato === nd.ID);
                        if (idx >= 0) {
                            chksTrue.splice(idx, 1);
                        }  
                        // verificar si abuelo tiene más hijos, si no, poner el false
                        const abuelo = nd.ID.split(";")[0]; 
                        let flt = chksTrue.filter((dato)=> dato.includes(abuelo)); 
                        // descuenta el value del abuelo en 1 
                        let vl = document.getElementById(abuelo) as HTMLInputElement | null;
                        if (vl !== null){
                            vl.value = "" + (parseInt(vl.value) - 1);
                        }
                        if (flt.length === 1){
                            let chk = document.getElementById(abuelo) as HTMLInputElement | null;
                            if (chk !== null){
                                chk.checked = false;
                            }
                            chksTrue.splice(0, 1);
                        }
                    }else{
                        // se elimina a si mismo del arreglo
                        const idx = chksTrue.findIndex((dato)=> dato === nd.ID);
                        if (idx >= 0) {
                            chksTrue.splice(idx, 1);
                        } 
                        // verifica si hay hermanos en el arreglo
                        const padre = nd.ID.split(";")[0] + ";" + nd.ID.split(";")[1]; 
                        let flt = chksTrue.filter((dato)=> (dato.split(";")[0] + ";" + dato.split(";")[1]) === padre);
                        // descontar del value del padre 1 valor
                        let vl = document.getElementById(padre) as HTMLInputElement | null;
                        if (vl !== null){
                            vl.value = "" + (parseInt(vl.value) - 1);
                        }
                        if (flt.length <= 1){
                            let chk = document.getElementById(padre) as HTMLInputElement | null;
                            if (chk !== null){
                                chk.checked = false;
                            }

                            // elimino al padre del arreglo
                            const idx = chksTrue.findIndex((dato)=> dato === padre);
                            if (idx >= 0) {
                                chksTrue.splice(idx, 1);
                            } 
                            // verificar si abuelo tiene más hijos, si no, poner el false
                            const abuelo = nd.ID.split(";")[0]; 
                            flt = chksTrue.filter((dato)=> dato.includes(abuelo));  
                            if (flt.length === 1){
                                vl = document.getElementById(abuelo) as HTMLInputElement | null;
                                if (vl !== null){
                                    vl.value = "" + (parseInt(vl.value) - 1);
                                }
                                let chk = document.getElementById(abuelo) as HTMLInputElement | null;
                                if (chk !== null){
                                    chk.checked = false;
                                }                                
                                chksTrue.splice(0, 1);
                            }                          
                        }
                    }
                }
            }            

            const onCheCked = (e: any, nd: any) =>{
                let vref = 0;
                if (e.target.checked){
                    ponerTrue(nd);
                    vref = 1;
                }else{
                    ponerFalse(nd);
                    vref = -1;
                }  
                props.onItemClick(chksTrue, vref);     
            }
        
            const nameChk = <div>
                                {
                                  (props.node.children.length > 0)
                                  ? <label onClick={()=>handleClick(props.node)} style={{ marginBottom: "10px" }}>
                                        {
                                            (shwChil) 
                                                ? <FaAngleDoubleDown/> 
                                                : <FaAngleDoubleRight/> 
                                        }
                                    </label>
                                  : null
                                }
                                <input type={'checkbox'} id={props.keyy} value="" onClick={(e)=>onCheCked(e, props.node)} disabled={(seleccionable === "false" ? true: false)} 
                                    className={"form-check-input "  + (seleccionable === "false" ? "bg-dark" : "")}
                                />
                                <label  className="ms-1">{name}</label>
                            </div>
        
            return (
              <>
                <div >
                  {nameChk}
                </div>
                <ul style={{ paddingLeft: "10px", borderLeft: "3px dotted black" }}>
                  {
                    <div style={{display:(!shwChil) ? "none": "block"}}>
                        <Tree treeData={children}  onItemClick={props.onItemClick}  />
                    </div>
                  }
                </ul>
              </>
            );
        }        

        return (
          <ul>
            {props.treeData.map((node: any, idx: number) => (
              <TreeNode node={node} key={idx} keyy={node.ID}  onItemClick={props.onItemClick} />
            ))}
          </ul>
        );
    }    

  return (
    <div>
        <Tree treeData={props.data} onItemClick={props.onItemClick} />
    </div>
  );
}

export default TreeView;