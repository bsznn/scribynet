import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Donation() {
	const [content, setContent] = useState("");
	const [price, setPrice] = useState("");
	const auth = useAuth();

	const handleDonate = async () => {
		const token = localStorage.getItem("token");
		if (!token) {
			alert("Vous devez être connecté·e pour faire un don.");
			return;
		}
		if (!price || Number(price) <= 0) {
			alert("Veuillez sélectionner un montant valide.");
			return;
		}

		try {
			const res = await axios.post(
				"http://localhost:5000/gifts/new",
				{ price: Number(price), content },
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
			console.error(err);
			alert("Erreur lors de la création du don");
		}
	};

	return (
		<div style={{ maxWidth: 400, margin: "0 auto" }}>
			<h3>Soutenir la plateforme 💖</h3>

			<textarea
				value={content}
				onChange={(e) => setContent(e.target.value)}
				placeholder="Laissez un message (optionnel)"
				rows={4}
				style={{ width: "100%", marginBottom: 10 }}
			/>

			<select
				value={price}
				onChange={(e) => setPrice(e.target.value)}
				style={{ width: "100%", marginBottom: 10 }}
			>
				<option value="">-- Montant --</option>
				<option value="5">5 €</option>
				<option value="10">10 €</option>
				<option value="20">20 €</option>
				<option value="50">50 €</option>
			</select>

			<button type="button" onClick={handleDonate} style={{ width: "100%" }}>
				Faire un don
			</button>
		</div>
	);
}
