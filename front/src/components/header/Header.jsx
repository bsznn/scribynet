import React, { useEffect, useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
import { NavLink, useNavigate } from "react-router-dom";
import { RiMenu3Fill } from "react-icons/ri";
import { GrClose } from "react-icons/gr";
import { AiOutlineLogin } from "react-icons/ai";
import { useAuth } from "../../context/AuthContext";
import { GrLogout } from "react-icons/gr";
import { IoIosArrowDown } from "react-icons/io";


import userImage from "../../assets/images/default-profile.png";
import Logo from "../../assets/images/logo.png"
import "../../assets/styles/components/header/header.css";

export default function Header() {
  const [toggle, setToggle] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const auth = useAuth(); 
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);

      if (window.innerWidth >= 768) {
        setToggle(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClick = () => {
    setToggle(!toggle);
  };

  const handleLogout = () => {
    auth.logout(); 
    navigate("/"); 
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <header className="header">
      <button onClick={handleClick} className="header__burger-button">
        {toggle ? <GrClose /> : <RiMenu3Fill />}
      </button>

      <section className={`header__top ${isMobile && toggle ? "hidden" : "visible"}`}>
        <span className="header__home">
            <NavLink to={"/"} className="header__nav-link" id="nav-link__home--1">
                <AiOutlineHome className="header__home-icon" />
                <p className="header__home-text">Accueil</p>
            </NavLink>
        </span> 
       
        <NavLink to={"/"} className="header__nav-link" id="nav-link__branding">
            <div className="header__branding">
            <h1 className="header__title">Scriby'Net</h1>
            <img className="header__logo" src={Logo} alt="logo" />
            </div>
        </NavLink>

        {auth.user ? (
          <div className="header__user">
            <span className="header__user-profile" id="nav-link__profile" onClick={toggleDropdown}>
              <img
                className="header__user-image"
                src={
                  auth.user.image
                    ? `http://localhost:5000/assets/img/${auth.user.image.src}`
                    : userImage
                }
                alt={auth.user.image?.alt || "default-user-profile"}
              />
              <p className="header__user-name">{auth.user.login}</p>
              <IoIosArrowDown  className="header__arrow-icon"/>
            </span>

            {showDropdown && (
              <div className="header__dropdown">
                <NavLink to="/" className="header__dropdown-item">
                  Profil
                </NavLink>
                <NavLink to="/" className="header__dropdown-item">
                  Dashboard
                </NavLink>
                <button onClick={handleLogout} className="header__dropdown-item">Déconnexion
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="header__auth">
            <NavLink to="/se-connecter" className="header__nav-link">
              <span className="header__auth-content">
                <p className="header__auth-text">Connexion</p>
                <AiOutlineLogin className="header__auth-icon" />
              </span>
            </NavLink>
          </div>
        )}
      </section>

      <nav
        className={`header__nav ${isMobile ? (toggle ? "visible" : "hidden") : "visible"}`}
      >
        <ul className="header__nav-list">
          <li className="header__nav-item">
            <NavLink to="/" className="header__nav-link" id="nav-link__home--2">
              Accueil
            </NavLink>
          </li>
          <li className="header__nav-item">
            <NavLink to="/a-propos" className="header__nav-link">
              À propos
            </NavLink>
          </li>
          <li className="header__nav-item">
            <NavLink to="/histoires" className="header__nav-link">
              Histoires
            </NavLink>
          </li>
          <li className="header__nav-item">
            <NavLink to="/categories" className="header__nav-link">
              Catégories
            </NavLink>
          </li>
          <li className="header__nav-item">
            <NavLink to="/auteurs" className="header__nav-link">
              Auteurs
            </NavLink>
          </li>
          <li className="header__nav-item">
            <NavLink to="/lecteurs" className="header__nav-link">
              Lecteurs
            </NavLink>
          </li>
          <li className="header__nav-item">
            <NavLink to="/publier-histoire" className="header__nav-link">
              Publier
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
