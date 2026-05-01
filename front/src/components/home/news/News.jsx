import "../../../assets/styles/components/home/news/news.css";

import pexelOne from "../../../assets/images/pexel/pexel-1.jpg";
import pexelTwo from "../../../assets/images/pexel/pexel-2.jpg";
import pexelThree from "../../../assets/images/pexel/pexel-3.jpg";

export default function News() {
	const newsItems = [
		{
			title: "Nouveautés disponibles",
			text: "Découvrez les dernières fonctionnalités ajoutées à notre plateforme d’écriture.",
			imageUrl: pexelOne,
		},
		{
			title: "Nouveau design",
			text: "Une interface repensée pour une meilleure expérience.",
			imageUrl: pexelTwo,
		},
		{
			title: "Communauté active",
			text: "Rejoignez d'autres passionnés d’écriture.",
			imageUrl: pexelThree,
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
