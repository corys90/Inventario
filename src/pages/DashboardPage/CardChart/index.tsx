import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const CardChart = (props: any) =>{
    
  return (
    <div className='text-center border shadow' > 
      <CircularProgressbar
        value={props.cuadratura}
        text={`${props.cuadratura}%`}
        styles={buildStyles({
          textColor: (props.color === "R") ? "red": (props.color === "A") ? "Orange" : "green",
          pathColor: (props.color === "R") ? "red": (props.color === "A") ? "yellow" : "green",
          trailColor: "#CDE7EE"
        })}
      />            
      <label htmlFor="">{props.title}</label>
    </div>
  );
};

export default CardChart;
