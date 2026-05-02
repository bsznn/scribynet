import React, { useState } from "react";
import axios from "axios";
import { MapPin, Phone, Mail } from "lucide-react";
import fondImage from "../../assets/images/fond/fond-arbre.jpeg";

import "../../assets/styles/pages/about-contact/about-contact.css";

export default function AboutContact() {
	const [status, setStatus] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const formData = {
			name: e.target.name.value.trim(),
			email: e.target.email.value.trim(),
			subject: e.target.subject.value.trim(),
			content: e.target.message.value.trim(),
		};

		if (
			!formData.name ||
			!formData.email ||
			!formData.subject ||
			!formData.content
		) {
			setStatus("Veuillez remplir tous les champs.");
			return;
		}

		try {
			const res = await axios.post(
				`${import.meta.env.VITE_API_URL}/contact/new`,
				formData,
			);
			if (res.status === 201) {
				alert("Message bien enregistré !");
				setStatus("Message envoyé avec succès ✨");
				e.target.reset();
			}
		} catch (error) {
			console.error(error);
			setStatus("Une erreur est survenue. Veuillez réessayer.");
		}
	};

	const sectionStyle = {
		backgroundSize: "cover",
		backgroundImage: `url(${fondImage})`,
		backgroundPosition: "center",
		backgroundRepeat: "no-repeat",
	};

	return (
		<main className="aboutContact" style={sectionStyle}>
			<div className="aboutContact__content">
				<section className="aboutContact__infos">
					<h1 className="aboutContact__title">Nos coordonnées</h1>

					<div className="aboutContact__infoCard">
						<div className="aboutContact__iconWrapper">
							<MapPin />
						</div>
						<div>
							<span className="aboutContact__label">Adresse</span>
							<p>
								12 rue des Plumes Dorées
								<br />
								75000 Paris
							</p>
						</div>
					</div>

					<div className="aboutContact__infoCard">
						<div className="aboutContact__iconWrapper">
							<Phone />
						</div>
						<div>
							<span className="aboutContact__label">Téléphone</span>
							<p>01 23 45 67 89</p>
						</div>
					</div>

					<div className="aboutContact__infoCard">
						<div className="aboutContact__iconWrapper">
							<Mail />
						</div>
						<div>
							<span className="aboutContact__label">Email</span>
							<p>contact@scribynet.fr</p>
						</div>
					</div>
				</section>

				<section className="aboutContact__contact">
					<h2 className="aboutContact__subtitle">Nous contacter</h2>
					<form className="aboutContact__form" onSubmit={handleSubmit}>
						<div className="aboutContact__field">
							<label className="aboutContact__label" htmlFor="name">
								Nom
							</label>
							<input
								id="name"
								name="name"
								type="text"
								className="aboutContact__input"
								placeholder="Votre nom"
								required
							/>
						</div>
						<div className="aboutContact__field">
							<label className="aboutContact__label" htmlFor="email">
								Email
							</label>
							<input
								id="email"
								name="email"
								type="email"
								className="aboutContact__input"
								placeholder="votre@email.com"
								required
							/>
						</div>
						<div className="aboutContact__field">
							<label className="aboutContact__label" htmlFor="subject">
								Sujet
							</label>
							<input
								id="subject"
								name="subject"
								type="text"
								className="aboutContact__input"
								placeholder="Sujet du message"
								required
							/>
						</div>
						<div className="aboutContact__field">
							<label className="aboutContact__label" htmlFor="message">
								Message
							</label>
							<textarea
								id="message"
								name="message"
								className="aboutContact__textarea"
								rows="5"
								placeholder="Votre message..."
								required
							/>
						</div>
						<button type="submit" className="aboutContact__button">
							Envoyer
						</button>
					</form>
					{status && <p className="aboutContact__status">{status}</p>}
				</section>

				<section className="aboutContact__map">
					<h2 className="aboutContact__subtitle">Nous situer</h2>
					<div className="aboutContact__mapWrapper">
						<iframe
							title="Carte Scriby'net"
							src="https://www.google.com/maps?q=Paris&output=embed"
							loading="lazy"
							referrerPolicy="no-referrer-when-downgrade"
							style={{
								border: 0,
								width: "100%",
								height: "300px",
								borderRadius: "12px",
							}}
						/>
					</div>
				</section>
			</div>
		</main>
	);
}
