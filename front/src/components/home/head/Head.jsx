import "../../../assets/styles/components/home/head/head.css";
import { Link } from "react-router-dom";
import headImage from "../../../assets/images/header-home/grass.webp";
import { useAuth } from "../../../context/AuthContext";

export default function Head() {
	const auth = useAuth();

	return (
		<section className="head">
			<img
				src={headImage}
				alt="Head_floral"
				fetchPriority="high"
				decoding="sync"
				className="head__bg"
			/>
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
