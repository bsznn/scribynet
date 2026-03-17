import { useEffect, useRef, useState } from "react";
import { AiOutlineLogin } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
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

	const [userDropdownOpen, setUserDropdownOpen] = useState(false);
	const dropdownRef = useRef(null);

	const toggleUserDropdown = () => {
		setUserDropdownOpen((prev) => !prev);
	};

	const profileImage =
		auth.user?.image?.src && auth.user.image.src !== "default-profil.png"
			? `http://localhost:5000/assets/img/${auth.user.image.src}`
			: defaultImage;

	// Ferme le dropdown au clic extérieur
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
				setUserDropdownOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Reset dropdown à la connexion / déconnexion
	useEffect(() => {
		setUserDropdownOpen(false);
	}, [auth.user]);

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
			document.body.classList.add("no-scroll");
		} else {
			document.body.classList.remove("no-scroll");
		}

		return () => {
			document.body.classList.remove("no-scroll");
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
				<NavLink to="/" className="header__branding" onClick={closeMenu}>
					<h1 className="header__title">Scriby'Net</h1>
					<img className="header__logo" src={Logo} alt="logo" />
				</NavLink>

				<button
					type="button"
					onClick={handleClick}
					className="header__burger-button"
				>
					{toggle ? <AiOutlineClose /> : <RiMenu3Fill />}
				</button>

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

						{isMobile && auth.user && (
							<div className="header__mobile-user-block">
								<NavLink
									to="/profil"
									className="header__nav-link"
									onClick={closeMenu}
								>
									Profil
								</NavLink>

								<NavLink
									to="/dashboard"
									className="header__nav-link"
									onClick={closeMenu}
								>
									Dashboard
								</NavLink>

								<NavLink
									to="/messagerie"
									className="header__nav-link"
									onClick={closeMenu}
								>
									Messagerie
								</NavLink>

								<button
									type="button"
									onClick={() => {
										handleLogout();
										closeMenu();
									}}
									className="header__logout-mobile"
								>
									Déconnexion
								</button>
							</div>
						)}
					</nav>
				</section>

				<div className="header__right-group">
					<NavLink
						to="/faire-don"
						className="header__don-mobile"
						onClick={closeMenu}
					>
						<span>Don</span>
					</NavLink>

					{auth.user ? (
						<div className="header__user-wrapper" ref={dropdownRef}>
							<div
								className="header__user-info"
								onClick={!isMobile ? toggleUserDropdown : undefined}
							>
								<img
									className="header__user-image"
									src={profileImage}
									alt="Image de profil"
								/>
								<span className="header__user-text">{auth.user.login}</span>
							</div>

							{!isMobile && userDropdownOpen && (
								<div className="header__dropdown">
									<NavLink
										to="/profil"
										className="header__dropdown-link"
										onClick={() => setUserDropdownOpen(false)}
									>
										Profil
									</NavLink>

									<NavLink
										to="/dashboard"
										className="header__dropdown-link"
										onClick={() => setUserDropdownOpen(false)}
									>
										Dashboard
									</NavLink>

									<NavLink
										to="/messagerie"
										className="header__dropdown-link"
										onClick={() => setUserDropdownOpen(false)}
									>
										Messagerie
									</NavLink>

									<button
										type="button"
										onClick={handleLogout}
										className="header__dropdown-link logout"
									>
										Déconnexion
									</button>
								</div>
							)}
						</div>
					) : (
						<NavLink
							to="/se-connecter"
							className="header__auth-mobile"
							onClick={closeMenu}
						>
							<span className="header__auth-text">Connexion</span>
							<AiOutlineLogin />
						</NavLink>
					)}
				</div>
			</div>
		</header>
	);
}
