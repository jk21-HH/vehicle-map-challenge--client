import React from "react";
import classes from "./Header.module.css";

const Header = (props) => {
  return (
    <header>
      <h1 className={classes.title}>Vehicle Map Chalenge</h1>
      <section className={classes.city}>London map</section>
    </header>
  );
};

export default Header;
