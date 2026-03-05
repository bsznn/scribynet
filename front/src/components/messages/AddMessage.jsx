import React, { useEffect, useState } from "react";
import axios from "axios";
import { token } from "../../context/token";
import { useAuth } from "../../context/AuthContext";

const AddMessage = ({ onMessageSent }) => {
	const { user } = useAuth();

	const [users, setUsers] = useState([]);
	const [search, setSearch] = useState("");
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [receiverId, setReceiverId] = useState("");
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	// Récupérer tous les utilisateurs
	const getUsers = () => {
		axios
			.get("http://localhost:5000/users", {
				headers: token(),
			})
			.then((res) => {
				const otherUsers = res.data.users.filter(
					(oneUser) => oneUser._id !== user._id,
				);
				setUsers(otherUsers);
				setFilteredUsers(otherUsers);
			})
			.catch(console.log);
	};

	useEffect(() => {
		getUsers();
	}, []);

	// Filtrer les utilisateurs en fonction de la barre de recherche
	useEffect(() => {
		const lowerSearch = search.toLowerCase();
		setFilteredUsers(
			users.filter(
				(u) => u.login && u.login.toLowerCase().includes(lowerSearch),
			),
		);
	}, [search, users]);

	const sendMessage = (e) => {
		e.preventDefault();

		if (!receiverId) return alert("Veuillez choisir un destinataire");

		axios
			.post(
				"http://localhost:5000/messages/new",
				{ receiverId, title, content },
				{ headers: token() },
			)
			.then(() => {
				setReceiverId("");
				setTitle("");
				setContent("");
				setSearch("");
				onMessageSent();
			})
			.catch(console.log);
	};

	return (
		<form onSubmit={sendMessage}>
			<input
				type="text"
				placeholder="Rechercher un utilisateur..."
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>

			<select
				value={receiverId}
				onChange={(e) => setReceiverId(e.target.value)}
				required
			>
				<option value="">Choisir un destinataire</option>
				{filteredUsers.map((u) => (
					<option key={u._id} value={u._id}>
						{u.login}
					</option>
				))}
			</select>

			<input
				type="text"
				placeholder="Titre"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
			/>

			<textarea
				placeholder="Votre message"
				value={content}
				onChange={(e) => setContent(e.target.value)}
			/>

			<button type="submit">Envoyer</button>
		</form>
	);
};

export default AddMessage;
