import React from 'react';
import { NavLink } from 'react-router-dom'; // Assuming you are using React Router for navigation

const Navbar = () => {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <NavLink to="/">home</NavLink>
          </li>
          <li>
            <NavLink to="/game">Game</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;