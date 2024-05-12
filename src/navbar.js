import { Link, useMatch, useResolvedPath, useNavigate } from "react-router-dom";
import React, { useContext } from 'react';
import { UserContext } from './UserContext';
import "./styles.css";

export default function Navbar() {
  
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };
  
  return (
    <nav className="nav">
      <Link to="/" className="site-title">
        Recipes Delivery
      </Link>
      <ul>
        <CustomLink to="/">Home</CustomLink>
        {/* Here we conditionally change the path based on the user's login status */}
        <CustomLink to={user ? "/recipes" : "/Allrecipes"}>Recipes</CustomLink>
        {user && <CustomLink to="/savedrecipes">Saved Recipes</CustomLink>}
        <CustomLink to="/contact">Contact</CustomLink>
        <CustomLink to="/about">About</CustomLink>
        {user ? (
          <>
            <li>{user.email}</li> 
            <li><button onClick={handleLogout} className="logoutButton">Logout</button></li>
          </>
        ) : (
          <li><Link to="/auth">Login / Sign Up</Link></li>
        )}
      </ul>
    </nav>
  );
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}
