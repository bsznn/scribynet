import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { token } from "../../context/token";

import "../../assets/styles/pages/messages/messages.css";

const AddMessage = ({ onMessageSent }) => {
	const { user } = useAuth();
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);

	const [users, setUsers] = useState([]);
	const [search, setSearch] = useState("");
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [receiverId, setReceiverId] = useState("");
	const [receiverLogin, setReceiverLogin] = useState("");
	const [showDropdown, setShowDropdown] = useState(false);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	const dropdownRef = useRef(null);

	const getUsers = () => {
		axios
			.get(`${import.meta.env.VITE_API_URL}/users`, { headers: token() })
			.then((res) => {
				const otherUsers = res.data.users.filter(
					(oneUser) => oneUser._id !== user._id,
				);
				setUsers(otherUsers);
				setFilteredUsers(otherUsers);
			});
		setError("Impossible de charger les utilisateurs.");
	};

	useEffect(() => {
		getUsers();
	}, []);

	useEffect(() => {
		const lowerSearch = search.toLowerCase();
		setFilteredUsers(
			users.filter(
				(u) => u.login && u.login.toLowerCase().includes(lowerSearch),
			),
		);
	}, [search, users]);

	// Fermer la dropdown si clic en dehors
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
				setShowDropdown(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSelectUser = (u) => {
		setReceiverId(u._id);
		setReceiverLogin(u.login);
		setSearch(u.login);
		setShowDropdown(false);
	};

	const handleSearchChange = (e) => {
		setSearch(e.target.value);
		setReceiverId("");
		setReceiverLogin("");
		setShowDropdown(true);
	};

	const sendMessage = async (e) => {
		e.preventDefault();

		if (!receiverId) {
			setError("Veuillez choisir un destinataire.");
			return;
		}

		try {
			setError(null);
			setSuccess(null);

			await axios.post(
				`${import.meta.env.VITE_API_URL}/messages/new`,
				{ receiverId, title, content },
				{ headers: token() },
			);

			setReceiverId("");
			setReceiverLogin("");
			setTitle("");
			setContent("");
			setSearch("");

			setSuccess("Message envoyé avec succès !");
			if (onMessageSent) onMessageSent();
		} catch (err) {
			setError("Impossible d'envoyer le message.");
		}
	};

	return (
		<form onSubmit={sendMessage} className="add-message-form">
			<h3 className="add-message-form__title">Nouveau message</h3>

			{/* Recherche avec dropdown */}
			<div className="recipient-search" ref={dropdownRef}>
				<input
					type="text"
					placeholder="Rechercher un destinataire..."
					value={search}
					onChange={handleSearchChange}
					onFocus={() => setShowDropdown(true)}
					className={receiverId ? "recipient-search__input--selected" : ""}
					autoComplete="off"
				/>

				{showDropdown && filteredUsers.length > 0 && (
					<ul className="recipient-dropdown">
						{filteredUsers.map((u) => (
							<li
								key={u._id}
								className={`recipient-dropdown__item ${receiverId === u._id ? "recipient-dropdown__item--active" : ""}`}
								onMouseDown={() => handleSelectUser(u)}
							>
								<span className="recipient-dropdown__avatar">
									{u.login.charAt(0).toUpperCase()}
								</span>
								{u.login}
							</li>
						))}
					</ul>
				)}

				{showDropdown && filteredUsers.length === 0 && search.length > 0 && (
					<div className="recipient-dropdown recipient-dropdown--empty">
						Aucun utilisateur trouvé
					</div>
				)}
			</div>

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

			{success && <p className="success-message">{success}</p>}
		</form>
	);
};

export default AddMessage;
