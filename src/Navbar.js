import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/course/Informática">Informática</Link></li>
        <li><Link to="/course/Maquiagem">Maquiagem</Link></li>
        <li><Link to="/course/Muay%20Thai">Muay Thai</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
