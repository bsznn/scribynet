import React from "react";
import NewestBooks from "../../components/home/books/NewestBooks";
import PopularBooks from "../../components/home/books/PopularBooks";
import Carousel from "../../components/home/carousel/Carousel";
import ComponentCategories from "../../components/home/categories/ComponentCategories";
import LastChapters from "../../components/home/chapters/LastChapters";
import Authors from "../../components/home/authors/Authors";
import News from "../../components/home/news/News";
import Head from "../../components/home/head/Head";
import Ads from "../../components/home/ads/ads";

import "../../assets/styles/pages/home/home.css";

export default function Home() {
	return (
		<main className="home">
			<Head />
			<Carousel />

			<div className="home__section home__books">
				{/* Col gauche haut : livres populaires */}
				<div className="home__popular">
					<PopularBooks />
				</div>

				{/* Col droite haut : derniers chapitres + auteurs */}
				<aside className="home__aside">
					<LastChapters />
					<Authors />
				</aside>

				{/* Pleine largeur : pub */}
				<div className="home__ads">
					<Ads />
				</div>

				{/* Col gauche bas : livres récents */}
				<div className="home__newestBooks">
					<NewestBooks />
				</div>

				{/* Col droite bas : actualités */}
				<div className="home__news">
					<News />
				</div>

				{/* Pleine largeur : catégories */}
				<div className="home__categories">
					<ComponentCategories />
				</div>
			</div>
		</main>
	);
}
