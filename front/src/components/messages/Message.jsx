import React, { useState } from "react";
import { Link } from "react-router-dom";
import defaultProfile from "../../assets/images/default-profile.jpg";
import { useAuth } from "../../context/AuthContext";

const Message = ({ message, onDeleted }) => {
	const auth = useAuth();

	const [isEditing, setIsEditing] = useState(false);
	const [title, setTitle] = useState(message.title);
	const [content, setContent] = useState(message.content);

	const sender = message.senderId;

	const senderId =
		typeof message.senderId === "object"
			? message.senderId._id
			: message.senderId;

	const currentUserId = auth?.user?._id || auth?.user?.id;

	const isSender = String(currentUserId) === String(senderId);

	const createdAt = new Date(message.createdAt);
	const formattedDate = `${createdAt.toLocaleDateString()} à ${createdAt.toLocaleTimeString()}`;

	const handleDeleteForMe = async () => {
		const confirmDelete = window.confirm(
			"Voulez-vous vraiment supprimer ce message pour vous ?",
		);
		if (!confirmDelete) return;

		try {
			const res = await fetch(
				`http://localhost:5000/messages/delete/${message._id}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${auth?.user?.token}`,
					},
				},
			);

			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Erreur serveur");

			alert(data.message);
			onDeleted?.();
		} catch (err) {
			console.error(err);
			alert(err.message);
		}
	};

	const handleDeleteForAll = async () => {
		const confirmDelete = window.confirm(
			"Voulez-vous vraiment supprimer ce message pour tous ?",
		);
		if (!confirmDelete) return;

		try {
			const res = await fetch(
				`http://localhost:5000/messages/${message._id}/deleteForAll`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${auth?.user?.token}`,
					},
				},
			);

			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Erreur serveur");

			alert(data.message);
			onDeleted?.();
		} catch (err) {
			console.error(err);
			alert(err.message);
		}
	};

	const handleUpdate = async () => {
		if (!isSender) {
			alert("Vous ne pouvez modifier que vos propres messages.");
			return;
		}

		try {
			const res = await fetch(
				`http://localhost:5000/messages/edit/${message._id}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${auth?.user?.token}`,
					},
					body: JSON.stringify({ title, content }),
				},
			);

			const data = await res.json();

			if (res.ok) {
				alert("Message mis à jour !");
				setIsEditing(false);
			} else {
				alert(data.error);
			}
		} catch (err) {
			console.error(err);
			alert("Erreur lors de la mise à jour");
		}
	};

	return (
		<div className="message">
			<div className="message__header">
				<img
					src={`http://localhost:5000/assets/img/${sender?.image?.src || defaultProfile}`}
					alt={sender?.image?.alt || "Utilisateur"}
					className="message__avatar"
				/>
				<div className="message__info">
					<h4>{sender?.login || "Utilisateur inconnu"}</h4>
					<small>{formattedDate}</small>
				</div>
			</div>

			{isEditing ? (
				<div>
					<input
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="message__input-title"
					/>
					<textarea
						value={content}
						onChange={(e) => setContent(e.target.value)}
						className="message__input-content"
					/>

					<button onClick={handleUpdate} className="btn btn-update">
						Enregistrer
					</button>

					<button
						onClick={() => setIsEditing(false)}
						className="btn btn-cancel"
					>
						Annuler
					</button>
				</div>
			) : (
				<>
					<h3 className="message__title">{message.title}</h3>

					<p className="message__content">
						{message.content.length > 80
							? `${message.content.slice(0, 80)}...`
							: message.content}
					</p>

					<Link
						to={`/messages/conversation/${message._id}`}
						className="message__link"
					>
						Ouvrir la conversation
					</Link>

					<span
						className={`text-xs font-bold px-2 py-1 rounded ${
							message.isRead
								? "bg-green-200 text-green-800"
								: "bg-red-200 text-red-800"
						}`}
					>
						{message.isRead ? "Lu" : "Non lu"}
					</span>

					<div className="message__actions mt-2">
						{isSender ? (
							<>
								<button
									onClick={() => setIsEditing(true)}
									className="btn btn-edit"
								>
									Modifier
								</button>

								<button onClick={handleDeleteForMe} className="btn btn-delete">
									Supprimer
								</button>

								<button
									onClick={handleDeleteForAll}
									className="btn btn-delete-all"
								>
									Supprimer pour tous
								</button>
							</>
						) : (
							<button onClick={handleDeleteForMe} className="btn btn-delete">
								Supprimer
							</button>
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default Message;
