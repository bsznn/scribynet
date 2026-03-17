import React from "react";
import NewestBooks from "../../components/home/books/NewestBooks";
import PopularBooks from "../../components/home/books/PopularBooks";
import Carousel from "../../components/home/carousel/Carousel";
import ComponentCategories from "../../components/home/categories/ComponentCategories";
import LastChapters from "../../components/home/chapters/LastChapters";

import "../../assets/styles/pages/home/home.css";
import Authors from "../../components/home/authors/Authors";
import News from "../../components/home/news/News";
import Head from "../../components/home/head/Head";
import Ads from "../../components/home/ads/ads";
// import DonationButton from "../gifts/DonationButton";

export default function Home() {
	return (
		<main className="home">
			<Head />
			<Carousel />
			{/* <DonationButton /> */}

			<div className="home__section  home__books">
				<div>
					<PopularBooks />
				</div>
				<div className="home__newestBooks">
					<NewestBooks />
				</div>
				<div className="home__ads">
					<Ads />
				</div>

				<ComponentCategories />
				<div className="home__aside">
					<div>
						<LastChapters />
						<Authors />
					</div>
					<News />
				</div>
			</div>
		</main>
	);
}
