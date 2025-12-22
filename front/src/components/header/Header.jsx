import React, { useEffect, useState } from "react";
import { AiOutlineHome, AiOutlineLogin } from "react-icons/ai";
import { GrClose } from "react-icons/gr";
import { IoMdLogOut } from "react-icons/io";
import { RiMenu3Fill } from "react-icons/ri";
import { NavLink, useNavigate } from "react-router-dom";
import defaultImage from "../../assets/images/default-profile.jpg";
import Logo from "../../assets/images/logo.png";
import { useAuth } from "../../context/AuthContext";
import "../../assets/styles/components/header/header.css";

export default function Header() {
	const [toggle, setToggle] = useState(false);
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
	const auth = useAuth();
	const navigate = useNavigate();

	const profileImage =
		auth.user?.image?.src && auth.user.image.src !== "default-profil.png"
			? `http://localhost:5000/assets/img/${auth.user.image.src}`
			: defaultImage;

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
			if (window.innerWidth >= 768) setToggle(false);
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		if (toggle && isMobile) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}

		return () => {
			document.body.style.overflow = "";
		};
	}, [toggle, isMobile]);


	const handleClick = () => setToggle(!toggle);

	const handleLogout = () => {
		auth.logout();
		navigate("/");
	};

	const closeMenu = () => setToggle(false);

	return (
		<header className="header">
			<div className="header__content">
				<button
					type="button"
					onClick={handleClick}
					className="header__burger-button"
				>
					{toggle ? <GrClose /> : <RiMenu3Fill />}
				</button>
				<NavLink to="/" className="header__branding" onClick={closeMenu}>
					<h1 className="header__title">Scriby'Net</h1>
					<img className="header__logo" src={Logo} alt="logo" />
				</NavLink>

				<section
					className={`header__top ${isMobile && !toggle ? "hidden" : "visible"}`}
				>
					<nav
						className={`header__nav ${isMobile ? (toggle ? "visible" : "hidden") : "visible"}`}
					>
						<li className="header__nav-item">
							<NavLink
								to="/"
								className="header__nav-link"
								id="nav-link__home--2"
								onClick={closeMenu}
							>
								Accueil
							</NavLink>
						</li>
						<li className="header__nav-item">
							<NavLink
								to="/a-propos"
								className="header__nav-link"
								onClick={closeMenu}
							>
								À propos
							</NavLink>
						</li>
						<li className="header__nav-item">
							<NavLink
								to="/histoires"
								className="header__nav-link"
								onClick={closeMenu}
							>
								Histoires
							</NavLink>
						</li>
						<li className="header__nav-item">
							<NavLink
								to="/categories"
								className="header__nav-link"
								onClick={closeMenu}
							>
								Catégories
							</NavLink>
						</li>
						<li className="header__nav-item">
							<NavLink
								to="/publier-histoire"
								className="header__nav-link"
								onClick={closeMenu}
							>
								Publier
							</NavLink>
						</li>
					</nav>
				</section>

				<div className="header__right-group">
					{auth.user ? (
						<div className="header__user-mobile">
							<div className="header__user-info">
								<img
									className="header__user-image"
									src={profileImage}
									alt={auth.user?.image?.alt || "Image de profil par défaut"}
								/>

								<span className="header__user-text">{auth.user.login}</span>
							</div>
							<button onClick={handleLogout} className="header__dropdown-item">
								<span className="header__user-text">Déconnexion</span>{" "}
								<IoMdLogOut />
							</button>
						</div>
					) : (
						<NavLink
							to="/se-connecter"
							className="header__auth-mobile"
							onClick={closeMenu}
						>
							<span className="header__auth-text">Connexion</span>{" "}
							<AiOutlineLogin />
						</NavLink>
					)}
				</div>
			</div>
		</header>
	);
}
