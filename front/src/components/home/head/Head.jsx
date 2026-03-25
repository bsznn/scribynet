import "../../../assets/styles/components/home/head/head.css";
import headImage from "../../../assets/images/header-home/grass.jpg";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

import "../../../assets/styles/components/home/head/head.css";

export default function Head() {
	const auth = useAuth();

	const sectionStyle = {
		backgroundImage: `url(${headImage})`,
		backgroundSize: "cover",
		backgroundPosition: "center",
		backgroundRepeat: "no-repeat",
		height: 350,
	};

	return (
		<section className="head" style={sectionStyle}>
			<p className="head__text">Donnez vie à vos histoires avec Scriby'Net !</p>

			{auth.user ? (
				<Link to="/dashboard" className="head__button">
					Accédez au dashboard !
				</Link>
			) : (
				<Link to="/publier-histoire" className="head__button">
					Publiez dès maintenant !
				</Link>
			)}
		</section>
	);
}
