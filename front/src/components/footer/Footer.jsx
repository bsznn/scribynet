import { Link } from "react-router-dom";
import {
	FaLinkedin,
	FaXTwitter,
	FaGithub,
	FaYoutube,
	FaSlack,
} from "react-icons/fa6";

import logo from "../../assets/images/logo.png";
import "../../assets/styles/components/footer/footer.css";

const Footer = () => {
	return (
		<footer className="footer">
			<div className="footer__container">
				<div className="footer__brand">
					<img src={logo} alt="Scriby'Net Logo" className="footer__logo" />
					<p className="footer__copyright">
						© {new Date().getFullYear()} Scriby'Net
					</p>
				</div>

				<nav className="footer__links">
					<Link to="/mentions-legales" className="footer__link">
						Mentions légales
					</Link>
					<Link to="/politique-confidentialite" className="footer__link">
						Politique de confidentialité
					</Link>
				</nav>

				<div className="footer__socials">
					<a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
						<FaLinkedin className="footer__icon" />
					</a>
					<a href="https://twitter.com" target="_blank" rel="noreferrer">
						<FaXTwitter className="footer__icon" />
					</a>
					<a href="https://github.com" target="_blank" rel="noreferrer">
						<FaGithub className="footer__icon" />
					</a>
					<a href="https://youtube.com" target="_blank" rel="noreferrer">
						<FaYoutube className="footer__icon" />
					</a>
					<a href="https://slack.com" target="_blank" rel="noreferrer">
						<FaSlack className="footer__icon" />
					</a>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
