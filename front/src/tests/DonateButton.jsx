import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DonationButton({ senderId }) {
	const [content, setContent] = useState("");
	const [price, setPrice] = useState("");
	const [receiverId, setReceiverId] = useState("");
	const [users, setUsers] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredUsers, setFilteredUsers] = useState([]);

	useEffect(() => {
		// Récupérer tous les utilisateurs au chargement du composant
		const fetchUsers = async () => {
			try {
				const res = await axios.get("http://localhost:5000/users");
				setUsers(res.data.users || []);
				setFilteredUsers(res.data.users || []);
			} catch (err) {
				console.error("Erreur récupération utilisateurs:", err);
			}
		};
		fetchUsers();
	}, []);

	useEffect(() => {
		// Filtrer les utilisateurs selon la recherche
		const filtered = users.filter((user) =>
			user.login.toLowerCase().includes(searchTerm.toLowerCase()),
		);
		setFilteredUsers(filtered);
	}, [searchTerm, users]);

	const handleDonate = async () => {
		const token = localStorage.getItem("token");
		if (!token) {
			alert("Vous devez être connecté·e pour faire un don.");
			return;
		}
		if (!receiverId) {
			alert("Veuillez sélectionner un destinataire.");
			return;
		}
		if (!price) {
			alert("Veuillez sélectionner un montant.");
			return;
		}
		try {
			const res = await axios.post(
				"http://localhost:5000/gifts/new",
				{ senderId, receiverId, price, content },
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				},
			);
			if (res.data.url) {
				window.location.href = res.data.url;
			} else {
				alert(res.data.error || "Erreur lors de la création du paiement");
			}
		} catch (err) {
			console.error("Donation error:", err);
			if (err.response) {
				alert(
					err.response.data.error ||
						"Erreur serveur lors de la création du paiement",
				);
			} else {
				alert("Erreur serveur lors de la création du paiement");
			}
		}
	};

	return (
		<div style={{ maxWidth: 400, margin: "0 auto" }}>
			<label htmlFor="content">Message :</label>
			<textarea
				id="content"
				value={content}
				onChange={(e) => setContent(e.target.value)}
				placeholder="Écrivez un message..."
				rows={4}
				style={{ width: "100%", marginBottom: 10 }}
			/>

			<label htmlFor="price">Montant :</label>
			<select
				id="price"
				value={price}
				onChange={(e) => setPrice(e.target.value)}
				style={{ width: "100%", marginBottom: 10 }}
			>
				<option value="">-- Sélectionnez un montant --</option>
				<option value="5">5 €</option>
				<option value="10">10 €</option>
				<option value="20">20 €</option>
				<option value="50">50 €</option>
			</select>

			<label htmlFor="receiver-search">Destinataire :</label>
			<input
				type="text"
				id="receiver-search"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				placeholder="Rechercher un utilisateur"
				style={{ width: "100%", marginBottom: 5 }}
			/>

			<select
				size={5}
				style={{ width: "100%", marginBottom: 10 }}
				value={receiverId}
				onChange={(e) => setReceiverId(e.target.value)}
			>
				{filteredUsers.map((user) => (
					<option key={user._id} value={user._id}>
						{user.login}
					</option>
				))}
			</select>

			<button
				onClick={handleDonate}
				style={{
					padding: "10px 20px",
					backgroundColor: "#4CAF50",
					color: "#fff",
					border: "none",
					borderRadius: "5px",
					cursor: "pointer",
					fontSize: "16px",
					width: "100%",
				}}
			>
				Faire un don
			</button>
		</div>
	);
}
