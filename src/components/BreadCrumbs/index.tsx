
const  BreadCrumbss = (props: any) => {

    console.log(props.Links);

  return (
    <nav >
        <ol>
            {
                props.Links.map((dt: string)=>{
                    <li>{"dt"}</li>
                })
            }
        </ol>
    </nav>
  );
}

export default BreadCrumbss;