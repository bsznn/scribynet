import "../../../assets/styles/components/home/head/head.css";
import headImage from "../../../assets/images/header-home/grass.jpg";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

import "../../../assets/styles/components/home/head/head.css"

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
        <p className="head__text">
            Donnez vie à vos histoires avec Scribi'Net !
        </p>

        {auth.user ? (
          <Link to="/publier-histoire" className="head__button">
            Publiez dès maintenant !
          </Link>
        ) : (
          <Link to="/s-inscrire" className="head__button">
            Rejoignez-nous dès maintenant !
          </Link>
        )}


    </section>
  );
}
