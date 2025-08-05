import React from "react";
import Carousel from "../../components/home/carousel/Carousel";
import PopularBooks from "../../components/home/books/PopularBooks";
import NewestBooks from "../../components/home/books/NewestBooks";
import DonateButton from "../../tests/DonateButton";

export default function Home() {
	return (
		<div>
			<div>
				<Carousel />
			</div>

			<div>
				<PopularBooks />
				<NewestBooks />
			</div>

			<DonateButton />
		</div>
	);
}
