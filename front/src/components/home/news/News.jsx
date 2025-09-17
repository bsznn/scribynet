import "../../../assets/styles/components/home/news/news.css";

export default function News() {
	const newsItems = [
		{
			title: "Nouvelle mise à jour sur Scribify",
			text: "Découvrez les dernières fonctionnalités ajoutées à notre plateforme d’écriture collaborative.",
			imageUrl:
				"https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg",
		},
		{
			title: "Conseils pour écrire un roman",
			text: "Apprenez à structurer votre récit et captiver vos lecteurs dès le premier chapitre.",
			imageUrl:
				"https://images.pexels.com/photos/261719/pexels-photo-261719.jpeg",
		},
		{
			title: "Focus sur un auteur",
			text: "Découvrez le parcours et les conseils d’un de nos auteurs les plus populaires ce mois-ci.",
			imageUrl:
				"https://images.pexels.com/photos/7260644/pexels-photo-7260644.jpeg",
		},
	];

	return (
		<section className="news-section__container">
			<h2 className="news-section__title">Actualités</h2>
			<div className="news-section__grid">
				{newsItems.map((item, index) => (
					<div key={index} className="news-block__container">
						<div className="news-block__image-wrapper">
							<img
								src={item.imageUrl}
								alt={item.title}
								className="news-block__image"
							/>
						</div>
						<div className="news-block__content">
							<h3 className="news-block__title">{item.title}</h3>
							<p className="news-block__text">{item.text}</p>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
