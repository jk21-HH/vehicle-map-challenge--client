import classes from "./Car.module.css";

const Car = (props) => {
  return <li className={classes.car}>{`Car ID: ${props.carId}`}</li>;
};

export default Car;
