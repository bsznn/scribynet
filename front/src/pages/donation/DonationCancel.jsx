import React from "react";
import cancel from "../../assets/images/donation/cancel.jpg";
import fondImage from "../../assets/images/fond/fond-don.jpeg";

import "../../assets/styles/pages/donation/donation-component.css";

export default function DonationCancel() {
	const sectionStyle = {
		backgroundImage: `url(${fondImage})`,
		backgroundSize: "cover",
		backgroundPosition: "center",
		backgroundRepeat: "no-repeat",
	};
	return (
		<main className="donation-cancel" style={sectionStyle}>
			<div className="donation-cancel__container">
				<div className="donation-cancel__icon">
					<img src={cancel} alt="Don annulé" aria-label="Don annulé" />
				</div>

				<div className="donation-cancel__content">
					<h1 className="donation-cancel__title">Paiement annulé</h1>
					<p className="donation-cancel__message">
						Vous pouvez réessayer à tout moment.{" "}
					</p>
				</div>
			</div>
		</main>
	);
}
