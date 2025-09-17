import React from "react";
import Carousel from "../../components/home/carousel/Carousel";
import PopularBooks from "../../components/home/books/PopularBooks";
import NewestBooks from "../../components/home/books/NewestBooks";
import ComponentCategories from "../../components/home/categories/ComponentCategories";
import LastChapters from "../../components/home/chapters/LastChapters";

import "../../assets/styles/pages/home/home.css";
import News from "../../components/home/news/News";
import Authors from "../../components/home/authors/Authors";

export default function Home() {
	return (
		<div className="home">
			<div>
				<Carousel />
			</div>

			<div className="home__section">
				<div>
					<PopularBooks />
					<NewestBooks />
				</div>
				<div>
					<ComponentCategories />
				</div>

				<div className="home__aside">
					<div>
						<LastChapters />
						<Authors />
					</div>
					<News />
				</div>
			</div>
		</div>
	);
}
