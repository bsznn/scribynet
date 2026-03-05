import React, { useEffect, useState } from "react";
import axios from "axios";
import { token } from "../../context/token";
import { useParams } from "react-router-dom";
import ResponseList from "../../components/messages/ResponseList";

const Conversation = () => {
	const { conversationId } = useParams();

	const [conversation, setConversation] = useState(null);
	const [content, setContent] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const getConversation = async () => {
		setLoading(true);
		setError(null);

		try {
			const res = await axios.get(
				`http://localhost:5000/messages/conversation/${conversationId}`,
				{ headers: token() },
			);
			setConversation(res.data);
		} catch (err) {
			console.error(err);
			if (err.response) {
				setError(err.response.data.error);
			} else {
				setError("Erreur serveur");
			}
		} finally {
			setLoading(false);
		}
	};

	const markAsRead = async () => {
		try {
			await axios.patch(
				`http://localhost:5000/messages/${conversationId}/read`,
				{},
				{ headers: token() },
			);
		} catch (err) {
			console.log("Impossible de marquer comme lu :", err);
		}
	};

	useEffect(() => {
		getConversation();
		markAsRead();
	}, [conversationId]);

	const sendResponse = async (e) => {
		e.preventDefault();
		if (!content.trim()) return;

		try {
			await axios.post(
				`http://localhost:5000/messages/${conversationId}/responses`,
				{ content },
				{ headers: token() },
			);
			setContent("");
			getConversation();
		} catch (err) {
			console.error(err);
			alert(
				err.response?.data?.error || "Erreur lors de l'envoi de la réponse",
			);
		}
	};

	if (loading) return <p>Chargement...</p>;
	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<section className="conversation p-4 max-w-2xl mx-auto">
			<h2 className="text-xl font-bold mb-2">
				{conversation.title || "Sans titre"}
			</h2>

			<div className="border p-3 rounded mb-4">
				<p>{conversation.content}</p>
				<div className="text-xs text-gray-500 mt-1">
					Envoyé par {conversation.senderId?.login || "Utilisateur"} le{" "}
					{new Date(conversation.createdAt).toLocaleString()}
				</div>
			</div>

			<ResponseList responses={conversation.responses} />

			<form onSubmit={sendResponse} className="flex gap-2 mt-4">
				<input
					type="text"
					value={content}
					onChange={(e) => setContent(e.target.value)}
					placeholder="Votre réponse..."
					className="flex-1 border p-2 rounded"
				/>
				<button
					type="submit"
					className="bg-blue-500 text-white px-4 py-2 rounded"
				>
					Envoyer
				</button>
			</form>
		</section>
	);
};

export default Conversation;
