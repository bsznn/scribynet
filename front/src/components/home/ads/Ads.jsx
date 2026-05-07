import { useState } from "react";
import Image1 from "../../../assets/images/header-home/1.jpg";
import Image2 from "../../../assets/images/header-home/2.jpg";
import Image3 from "../../../assets/images/header-home/3.jpg";

import "../../../assets/styles/components/home/ads/ads.css";

const images = [
	{ src: Image1, alt: "Recrutement" },
	{ src: Image2, alt: "Concours d'écriture" },
	{ src: Image3, alt: "Conseils d'écriture" },
];

export default function Ads() {
	const [index, setIndex] = useState(0);

	const prev = () => {
		setIndex(index === 0 ? images.length - 1 : index - 1);
	};

	const next = () => {
		setIndex(index === images.length - 1 ? 0 : index + 1);
	};

	return (
		<section className="ads">
			<div className="ads__images">
				<img
					src={images[index].src}
					alt={images[index].alt}
					className="ads__image ads__image--active"
				/>

				{images.map((img, i) => (
					<img
						key={i}
						src={img.src}
						alt={img.alt}
						className="ads__image ads__image--desktop"
					/>
				))}

				<button
					className="ads__arrow ads__arrow--left"
					onClick={prev}
					aria-label="Image précédente"
				>
					‹
				</button>

				<button
					className="ads__arrow ads__arrow--right"
					onClick={next}
					aria-label="Image suivante"
				>
					›
				</button>
			</div>
		</section>
	);
}
