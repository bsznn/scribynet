import "../../assets/styles/pages/footer/legal-notices.css";
import headImage from "../../assets/images/header-home/grass.jpg";

const PrivacyPolicy = () => {
	const sectionStyle = {
		backgroundImage: `url(${headImage})`,
		backgroundSize: "cover",
		backgroundPosition: "center",
		backgroundRepeat: "no-repeat",
	};

	return (
		<main className="legal-notices" style={sectionStyle}>
			<div className="legal-notices__container">
				<div className="legal-notices__content">
					<h1 className="legal-notices__title">
						Politique de confidentialité – Scriby’net
					</h1>

					<section className="legal-notices__section">
						<h2 className="legal-notices__subtitle">Introduction</h2>
						<p>
							La présente politique de confidentialité a pour objectif
							d’informer les utilisateurs de Scriby’net sur la manière dont
							leurs données personnelles sont collectées, utilisées et
							protégées.
						</p>
					</section>

					<section className="legal-notices__section">
						<h2 className="legal-notices__subtitle">Données collectées</h2>
						<p>
							Nous pouvons collecter les données suivantes lors de votre
							utilisation de la plateforme :
						</p>
						<p>• Nom ou pseudonyme</p>
						<p>• Adresse email</p>
						<p>• Contenus publiés (textes, commentaires)</p>
						<p>• Données de connexion et statistiques de navigation</p>
					</section>

					<section className="legal-notices__section">
						<h2 className="legal-notices__subtitle">Finalité de la collecte</h2>
						<p>Les données collectées sont utilisées pour :</p>
						<p>• La gestion des comptes utilisateurs</p>
						<p>• L’amélioration de l’expérience utilisateur</p>
						<p>• La modération des contenus publiés</p>
						<p>• L’envoi d’informations liées au service</p>
					</section>

					<section className="legal-notices__section">
						<h2 className="legal-notices__subtitle">
							Conservation des données
						</h2>
						<p>
							Les données personnelles sont conservées pendant la durée
							nécessaire à la gestion du compte utilisateur. Elles peuvent être
							supprimées sur simple demande.
						</p>
					</section>

					<section className="legal-notices__section">
						<h2 className="legal-notices__subtitle">Sécurité</h2>
						<p>
							Scriby’net met en œuvre des mesures techniques et
							organisationnelles appropriées afin de protéger les données
							personnelles contre toute perte, altération ou accès non autorisé.
						</p>
					</section>

					<section className="legal-notices__section">
						<h2 className="legal-notices__subtitle">Droits des utilisateurs</h2>
						<p>
							Conformément au Règlement Général sur la Protection des Données
							(RGPD), vous disposez des droits suivants :
						</p>
						<p>• Droit d’accès</p>
						<p>• Droit de rectification</p>
						<p>• Droit de suppression</p>
						<p>• Droit d’opposition</p>
						<p>
							Pour exercer vos droits, vous pouvez nous contacter à :
							<a href="mailto:contact@scribynet.com"> contact@scribynet.com</a>
						</p>
					</section>

					<section className="legal-notices__section">
						<h2 className="legal-notices__subtitle">Cookies</h2>
						<p>
							Des cookies peuvent être utilisés afin d’améliorer la navigation
							et de mesurer l’audience. Vous pouvez configurer votre navigateur
							pour les refuser.
						</p>
					</section>

					<section className="legal-notices__section">
						<h2 className="legal-notices__subtitle">
							Modification de la politique
						</h2>
						<p>
							Scriby’net se réserve le droit de modifier la présente politique
							de confidentialité à tout moment afin de garantir sa conformité
							avec la législation en vigueur.
						</p>
					</section>

					<section className="legal-notices__section">
						<h2 className="legal-notices__subtitle">Loi applicable</h2>
						<p>La présente politique est soumise au droit français.</p>
					</section>
				</div>
			</div>
		</main>
	);
};

export default PrivacyPolicy;
