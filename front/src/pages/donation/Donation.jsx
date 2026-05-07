import axios from "axios";
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "../../assets/styles/pages/donation/donation.css";
import { Gift } from "lucide-react";

import fondImage from "../../assets/images/fond/fond-don.jpg";

export default function Donation() {
	const [content, setContent] = useState("");
	const [selectedPrice, setSelectedPrice] = useState("");
	const [customPrice, setCustomPrice] = useState("");
	const auth = useAuth();

	const handleDonate = async () => {
		const token = localStorage.getItem("token");

		let amount;
		if (selectedPrice === "custom") {
			amount = Number(customPrice);
		} else {
			amount = Number(selectedPrice);
		}

		if (!token) {
			alert("Vous devez être connecté·e pour faire un don.");
			return;
		}
		if (!amount || amount <= 0 || Number.isNaN(amount)) {
			alert("Veuillez sélectionner ou saisir un montant valide.");
			return;
		}

		try {
			const res = await axios.post(
				`${import.meta.env.VITE_API_URL}/gifts/new`,
				{ price: amount, content },
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				},
			);

			if (res.data.url) {
				window.location.href = res.data.url;
			}
		} catch (err) {
			alert("Erreur lors de la création du don");
		}
	};

	return (
		<main className="donation">
			<img
				src={fondImage}
				alt="donation__fond"
				fetchPriority="low"
				decoding="async"
				className="donation__bg"
			/>
			<div className="donation__area">
				<section className="donation__content">
					<div className="donation__header">
						<h3 className="donation__title">Soutenez la plateforme </h3>

						<div className="donation__description">
							<p>
								Cette plateforme n’est portée ni par une grande entreprise, ni
								par la publicité. Elle existe grâce au temps, à l’énergie et à
								la passion investis pour créer un espace où chacun peut écrire,
								partager et échanger librement. Votre don permet de couvrir les
								coûts essentiels : hébergement, maintenance, sécurité, mais
								aussi le développement continu et l’amélioration de nouvelles
								fonctionnalités. Soutenir la plateforme, c’est choisir un lieu
								indépendant, sans pression commerciale, conçu avant tout pour la
								communauté et le plaisir de créer.
							</p>
							<p>
								Même quelques euros font une vraie différence pour garder ce
								projet vivant et accessible à tous.
							</p>
						</div>
					</div>
					<form>
						<label htmlFor="donation-message" className="donation__label">
							Laissez un message de soutien (optionnel)
						</label>
						<textarea
							id="donation-message"
							className="donation__textarea"
							value={content}
							onChange={(e) => setContent(e.target.value)}
							placeholder="Votre message ici..."
							rows={4}
						/>

						<label
							htmlFor="donation-amount"
							className="donation__label"
							style={{ marginTop: 15 }}
						>
							Choisissez un montant ou saisissez-en un autre
						</label>
						<select
							id="donation-amount"
							className="donation__select"
							value={selectedPrice}
							onChange={(e) => setSelectedPrice(e.target.value)}
						>
							<option value="">-- Montant --</option>
							<option value="5">5 €</option>
							<option value="10">10 €</option>
							<option value="20">20 €</option>
							<option value="50">50 €</option>
							<option value="100">100 €</option>
							<option value="custom">Autre montant</option>
						</select>

						{selectedPrice === "custom" && (
							<input
								type="number"
								min="1"
								className="donation__input"
								placeholder="Entrez votre montant en €"
								value={customPrice}
								onChange={(e) => setCustomPrice(e.target.value)}
								aria-label="Montant libre en euros"
							/>
						)}

						<p className="donation__help-text" style={{ marginTop: 10 }}>
							Tous les paiements sont sécurisés et votre soutien est précieux 💫
						</p>

						{!auth.user ? (
							<p className="donation__alert">
								Vous devez être <a href="/se-connecter">connecté·e</a> pour
								faire un don.
							</p>
						) : (
							<button
								type="button"
								onClick={handleDonate}
								className="donation__submit"
							>
								Faire un don <Gift />
							</button>
						)}
					</form>
				</section>
			</div>
		</main>
	);
}
