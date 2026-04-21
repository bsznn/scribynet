import { useState } from "react";
import { Link } from "react-router-dom";
import defaultProfile from "../../assets/images/default-profile.jpg";
import { token } from "../../context/token";

import "../../assets/styles/pages/messages/messages.css";

const Message = ({ message, onDeleted, onUpdated, currentUserId, onRead }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [title, setTitle] = useState(message.title);
	const [content, setContent] = useState(message.content);

	const sender = message.senderId;

	const senderId =
		typeof message.senderId === "object"
			? message.senderId._id
			: message.senderId;

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
				`${import.meta.env.VITE_API_URL}/messages/${message._id}/deleteForMe`,
				{
					method: "DELETE",
					headers: token(),
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
				`${import.meta.env.VITE_API_URL}/messages/${message._id}/deleteForAll`,
				{
					method: "DELETE",
					headers: token(),
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
				`${import.meta.env.VITE_API_URL}/messages/edit/${message._id}`,
				{
					method: "PUT",
					headers: {
						...token(),
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ title, content }),
				},
			);

			const data = await res.json();

			if (res.ok) {
				alert("Message mis à jour !");
				setIsEditing(false);
				// On réinjecte le senderId original (populé) dans la réponse
				// pour éviter de perdre l'image et le login au retour du serveur
				onUpdated?.({ ...data, senderId: message.senderId });
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
					src={`${import.meta.env.VITE_API_URL}/assets/img/${sender?.image?.src || defaultProfile}`}
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

					<button
						type="button"
						onClick={handleUpdate}
						className="btn btn-update"
					>
						Enregistrer
					</button>

					<button
						type="button"
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
						onClick={() => {
							if (!isSender && !message.isRead) {
								onRead?.(message._id);
							}
						}}
					>
						Ouvrir la conversation
					</Link>

					{isSender ? (
						<span className="badge badge--sent">Envoyé</span>
					) : (
						<span
							className={`badge ${message.isRead ? "badge--read" : "badge--unread"}`}
						>
							{message.isRead ? "Lu" : "Non lu"}
						</span>
					)}

					<div className="message__actions mt-2">
						{isSender ? (
							<>
								<button
									type="button"
									onClick={() => setIsEditing(true)}
									className="btn btn-edit"
								>
									Modifier
								</button>

								<button
									type="button"
									onClick={handleDeleteForMe}
									className="btn btn-delete"
								>
									Supprimer
								</button>

								<button
									type="button"
									onClick={handleDeleteForAll}
									className="btn btn-delete-all"
								>
									Supprimer pour tous
								</button>
							</>
						) : (
							<button
								type="button"
								onClick={handleDeleteForMe}
								className="btn btn-delete"
							>
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
