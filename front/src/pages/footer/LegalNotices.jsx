import "../../assets/styles/pages/footer/legal-notices.css";

import headImage from "../../assets/images/header-home/grass.webp";

const LegalNotices = () => {
	return (
		<main className="legal-notices">
			<img
				src={headImage}
				alt="fond__notices"
				fetchPriority="low"
				decoding="async"
				className="legal-notices__bg"
			/>
			<div className="legal-notices__container">
				<div className="legal-notices__content">
					<h1 className="legal-notices__title">
						Mentions légales – Scriby’net
					</h1>

					<section className="legal-notices__section">
						<h2 className="legal-notices__subtitle">Éditeur du site</h2>
						<p>Scriby’net</p>
						<p>Responsable de la publication : Scriby’net Team</p>
						<p>
							Email :{" "}
							<a href="mailto:contact@scribynet.com">contact@scribynet.com</a>
						</p>
						<p>Statut juridique : SASU au capital de 5 000 €</p>
						<p>SIRET : 123 456 789 00010</p>
						<p>Adresse : 10 Rue des Écrivains, 75001 Paris, France</p>
					</section>

					<section className="legal-notices__section">
						<h2 className="legal-notices__subtitle">Hébergement</h2>
						<p>
							Le site Scriby'net est hébergé par la société <strong>Render Services, Inc.</strong>
						</p>
						<p>Adresse : 525 Brannan St, Suite 300, San Francisco, CA 94107, États-Unis</p>
						<p>
							Site web :{" "}
							<a href="https://render.com" target="_blank" rel="noopener noreferrer">
							https://render.com
							</a>
						</p>
						<p>
							Le nom de domaine <strong>scribynet.com</strong> est enregistré auprès de{" "}
							<strong>Gandi SAS</strong>, 63-65 Boulevard Masséna, 75013 Paris, France.
						</p>
						<p>
							Site web :{" "}
							<a href="https://www.gandi.net" target="_blank" rel="noopener noreferrer">
							https://www.gandi.net
							</a>
						</p>
					</section>

					<section className="legal-notices__section">
						<h2 className="legal-notices__subtitle">
							Propriété intellectuelle
						</h2>
						<p>
							Tout le contenu présent sur Scriby’net, incluant textes, logos,
							graphismes, images et vidéos, est protégé par le droit d’auteur et
							appartient à Scriby’net ou à ses partenaires.
						</p>
						<p>
							Les images et vidéos utilisées proviennent de{" "}
							<a
								href="https://www.pexels.com"
								target="_blank"
								rel="noopener noreferrer"
							>
								Pexels
							</a>{" "}
							et sont utilisées conformément aux licences libres fournies par la
							plateforme.
						</p>
						<p>
							Toute reproduction, représentation, modification, publication,
							transmission ou exploitation du contenu du site sans autorisation
							écrite préalable est interdite.
						</p>
					</section>

					<section className="legal-notices__section">
						<h2 className="legal-notices__subtitle">Responsabilité</h2>
						<p>
							Scriby’net met tout en œuvre pour garantir l’exactitude et la mise
							à jour des informations publiées sur le site. Cependant,
							Scriby’net ne saurait être tenu responsable des erreurs, omissions
							ou conséquences liées à l’utilisation du site et des informations
							qu’il contient.
						</p>
						<p>
							Les contenus publiés par les utilisateurs restent sous leur
							responsabilité exclusive. Scriby’net se réserve le droit de
							supprimer tout contenu contraire à la loi ou aux bonnes mœurs.
						</p>
					</section>

					<section className="legal-notices__section">
						<h2 className="legal-notices__subtitle">Données personnelles</h2>
						<p>
							Conformément au Règlement Général sur la Protection des Données
							(RGPD) et à la loi Informatique et Libertés, vous disposez d’un
							droit d’accès, de rectification, de suppression et d’opposition
							sur vos données personnelles.
						</p>
						<p>
							Pour exercer vos droits, vous pouvez contacter :{" "}
							<a href="mailto:contact@scribynet.com">contact@scribynet.com</a>
						</p>
						<p>
							Les données collectées sont utilisées uniquement pour la gestion
							de votre compte et l’amélioration de nos services.
						</p>
					</section>

					<section className="legal-notices__section">
						<h2 className="legal-notices__subtitle">Cookies</h2>
						<p>
							Scriby’net utilise des cookies pour améliorer l’expérience
							utilisateur et mesurer l’audience du site. Vous pouvez configurer
							votre navigateur pour refuser les cookies.
						</p>
					</section>

					<section className="legal-notices__section">
						<h2 className="legal-notices__subtitle">Liens externes</h2>
						<p>
							Le site peut contenir des liens vers d’autres sites. Scriby’net
							n’est pas responsable du contenu ou des pratiques de ces sites.
						</p>
					</section>

					<section className="legal-notices__section">
						<h2 className="legal-notices__subtitle">Loi applicable</h2>
						<p>
							Les présentes mentions légales sont soumises au droit français.
							Tout litige sera soumis aux tribunaux compétents français.
						</p>
					</section>
				</div>
			</div>
		</main>
	);
};

export default LegalNotices;
