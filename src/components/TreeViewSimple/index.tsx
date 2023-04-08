import { useState } from "react";
import { FaAngleDoubleDown, FaAngleDoubleRight } from "react-icons/fa";

const TreeViewSimple = (props: any) => {

    const TreeNode = (props: any) => {

        const { children, name } = props.node;
        const [showChildren, setShowChildren] = useState(false);
      
        const handleClick = () => {
          setShowChildren(!showChildren);
        };
    
        return (
          <>
            <div onClick={handleClick} style={{ marginBottom: "10px" }}>
              <label>
                {
                  (!showChildren) 
                    ? <div><FaAngleDoubleRight/> {name}</div>
                    : <div><FaAngleDoubleDown /> {name}</div>  
                }
              </label>
            </div>
            <ul style={{ paddingLeft: "10px", borderLeft: "3px dotted black" }}>
              {showChildren && <TreeViewSimple treeData={children} />}
            </ul>
          </>
        );
    }

    return (
        <ul>
          {props.treeData.map((node: any) => (
            <TreeNode node={node} key={node.ID} />
          ))}
        </ul>
      );

}

export default TreeViewSimple;