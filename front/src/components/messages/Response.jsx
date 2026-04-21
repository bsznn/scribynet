import React, { useState } from "react";
import defaultProfile from "../../assets/images/default-profile.jpg";
import { useAuth } from "../../context/AuthContext";
import ResponseList from "./ResponseList";
import { token } from "../../context/token";
import { MdDelete } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";

const Response = ({ response, messageId, onMessageUpdate, onDeleteLocal }) => {
	const auth = useAuth();

	const [isEditing, setIsEditing] = useState(false);
	const [content, setContent] = useState(response.content);

	const responseUser = response.userId;

	const responseUserId =
		typeof response.userId === "object" ? response.userId._id : response.userId;

	const currentUserId = auth?.user?._id || auth?.user?.id;

	const isOwner = String(currentUserId) === String(responseUserId);

	const createdAt = new Date(response.createdAt);
	const formattedDate = `${createdAt.toLocaleDateString()} à ${createdAt.toLocaleTimeString()}`;

	// DELETE FOR ME
	const handleDeleteForMe = async () => {
		const confirmDelete = window.confirm(
			"Voulez-vous supprimer cette réponse pour vous ?",
		);
		if (!confirmDelete) return;

		try {
			const res = await fetch(
				`${import.meta.env.VITE_API_URL}/messages/${messageId}/responses/${response._id}/deleteForMe`,
				{
					method: "DELETE",
					headers: token(),
				},
			);

			const data = await res.json();
			if (!res.ok) throw new Error(data.error);

			onDeleteLocal?.(response._id); // ✅ après le fetch
			// ❌ ne pas appeler onMessageUpdate ici, sinon ça réaffiche tout
		} catch (err) {
			console.error(err);
			alert(err.message);
		}
	};

	// DELETE FOR ALL
	const handleDeleteForAll = async () => {
		const confirmDelete = window.confirm(
			"Voulez-vous supprimer cette réponse pour tous ?",
		);
		if (!confirmDelete) return;

		try {
			const res = await fetch(
				`${import.meta.env.VITE_API_URL}/messages/${messageId}/responses/${response._id}/deleteForAll`,
				{
					method: "DELETE",
					headers: token(),
				},
			);

			const data = await res.json();
			if (!res.ok) throw new Error(data.error);

			onDeleteLocal?.(response._id);
			onMessageUpdate?.(data.messageData);
		} catch (err) {
			console.error(err);
			alert(err.message);
		}
	};

	// UPDATE
	const handleUpdate = async () => {
		try {
			const res = await fetch(
				`${import.meta.env.VITE_API_URL}/messages/${messageId}/responses/${response._id}`,
				{
					method: "PUT",
					headers: { ...token(), "Content-Type": "application/json" },
					body: JSON.stringify({ content }),
				},
			);

			const data = await res.json();

			if (res.ok) {
				alert("Réponse modifiée !");
				setIsEditing(false);
				onMessageUpdate?.(data);
			} else {
				alert(data.error);
			}
		} catch (err) {
			console.error(err);
			alert("Erreur modification");
		}
	};

	const isMine = String(currentUserId) === String(responseUserId);

	return (
		<div
			className={`response ${isMine ? "response--mine" : "response--theirs"}`}
		>
			<div className="response__header">
				<img
					src={`${import.meta.env.VITE_API_URL}/assets/img/${responseUser?.image?.src || defaultProfile}`}
					alt={responseUser?.image?.alt || "Utilisateur"}
					className="response__avatar"
				/>
				<div className="response__info">
					<strong>{responseUser?.login || "Utilisateur"}</strong>
					<small>{formattedDate}</small>
				</div>
			</div>

			{isEditing ? (
				<div className="response__edit-wrapper">
					<textarea
						value={content}
						onChange={(e) => setContent(e.target.value)}
						className="response__textarea"
					/>
					<div className="response__edit-actions">
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
				</div>
			) : (
				<div className="response__bubble">
					<p className="response__content">{response.content}</p>
					<span className="response__time">{formattedDate}</span>
				</div>
			)}

			{!isEditing && (
				<div className="response__actions">
					{isOwner && (
						<>
							<button
								type="button"
								onClick={() => setIsEditing(true)}
								className="response__action-btn response__action-btn--edit"
								title="Modifier"
							>
								<IoIosSettings />
							</button>
							<button
								type="button"
								onClick={handleDeleteForMe}
								className="response__action-btn response__action-btn--delete"
								title="Supprimer"
							>
								<MdDelete />
							</button>
							<button
								type="button"
								onClick={handleDeleteForAll}
								className="response__action-btn response__action-btn--delete-all"
								title="Supprimer pour tous"
							>
								<MdDeleteForever />
							</button>
						</>
					)}
					{!isOwner && (
						<button
							type="button"
							onClick={handleDeleteForMe}
							className="response__action-btn response__action-btn--delete"
							title="Supprimer"
						>
							<MdDelete />
						</button>
					)}
				</div>
			)}
		</div>
	);
};

export default Response;
