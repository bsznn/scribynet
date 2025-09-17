import React from "react";
import Carousel from "../../components/home/carousel/Carousel";
import PopularBooks from "../../components/home/books/PopularBooks";
import NewestBooks from "../../components/home/books/NewestBooks";
import ComponentCategories from "../../components/home/categories/ComponentCategories";
import LastChapters from "../../components/home/chapters/LastChapters";

import "../../assets/styles/pages/home/home.css";
import News from "../../components/home/news/News";

export default function Home() {
	return (
		<div>
			<div>
				<Carousel />
			</div>

			<div>
				<div>
					<PopularBooks />
					<NewestBooks />
				</div>
				<div>
					<ComponentCategories />
				</div>

				<div className="home__categories-chapters">
					<LastChapters />
					<News />
				</div>
			</div>
		</div>
	);
}
