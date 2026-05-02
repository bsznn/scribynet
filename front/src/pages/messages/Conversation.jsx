import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { token } from "../../context/token";
import { useParams } from "react-router-dom";
import ResponseList from "../../components/messages/ResponseList";

import "../../assets/styles/pages/messages/responses.css";
import fondImage from "../../assets/images/fond/fond-book.jpeg";

const Conversation = () => {
	const { conversationId } = useParams();

	const [conversation, setConversation] = useState(null);
	const [content, setContent] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const textareaRef = useRef(null);
	const bodyRef = useRef(null);

	const getConversation = async () => {
		setLoading(true);
		setError(null);

		try {
			const res = await axios.get(
				`${import.meta.env.VITE_API_URL}/messages/conversation/${conversationId}`,
				{ headers: token() },
			);
			setConversation(res.data);
		} catch (err) {
			console.error(err);
			if (err.response) {
				setError(err.response.data.error);
			} else {
				setError("Impossible d'afficher la conversation.");
			}
		} finally {
			setLoading(false);
		}
	};

	const markAsRead = async () => {
		try {
			await axios.patch(
				`${import.meta.env.VITE_API_URL}/messages/${conversationId}/read`,
				{},
				{ headers: token() },
			);
		} catch (err) {
			if (err.response?.status !== 403) {
				alert("markAsRead error:", err.response?.data);
			}
		}
	};

	useEffect(() => {
		getConversation();
		markAsRead();
	}, [conversationId]);

	// Scroll vers le bas quand les réponses changent
	useEffect(() => {
		if (bodyRef.current) {
			bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
		}
	}, [conversation]);

	// Auto-resize du textarea
	useEffect(() => {
		const el = textareaRef.current;
		if (!el) return;
		el.style.height = "auto";
		el.style.height = `${el.scrollHeight}px`;
	}, [content]);

	const sendResponse = async (e) => {
		e.preventDefault();
		if (!content.trim()) return;

		try {
			await axios.post(
				`${import.meta.env.VITE_API_URL}/messages/${conversationId}/responses`,
				{ content },
				{ headers: token() },
			);
			setContent("");
			// Reset textarea height
			if (textareaRef.current) {
				textareaRef.current.style.height = "auto";
			}
			getConversation();
		} catch (err) {
			console.error(err);
			alert(
				err.response?.data?.error || "Erreur lors de l'envoi de la réponse",
			);
		}
	};

	const handleKeyDown = (e) => {
		// Entrée → envoie, Shift+Entrée → saut de ligne
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			sendResponse(e);
		}
	};

	if (loading) return <p className="conversation__loading">Chargement...</p>;
	if (error) return <p className="conversation__error">{error}</p>;

	return (
		<main className="fond__conversation">
			<img
				src={fondImage}
				alt="fond__conversation"
				fetchPriority="high"
				decoding="sync"
				className="books__header-bg"
			/>
			<section className="conversation">
				<div className="conversation__container">
					<div className="conversation__topbar">
						<a href="/messagerie" className="conversation__back">
							←
						</a>
						<div className="conversation__topbar-info">
							<p className="conversation__topbar-title">
								{conversation.title || "Sans titre"}
							</p>
							<p className="conversation__topbar-sub">
								avec {conversation.senderId?.login || "Utilisateur"}
							</p>
						</div>
					</div>

					<div className="conversation__body" ref={bodyRef}>
						<div className="conversation__original">
							<p className="conversation__original-label">Message d'origine</p>
							<p className="conversation__original-content">
								{conversation.content}
							</p>
							<p className="conversation__original-meta">
								<strong>{conversation.senderId?.login}</strong> ·{" "}
								{new Date(conversation.createdAt).toLocaleString()}
							</p>
						</div>

						<ResponseList
							responses={conversation.responses}
							messageId={conversation._id}
							onMessageUpdate={getConversation}
						/>
					</div>

					<form onSubmit={sendResponse} className="conversation__reply-bar">
						<textarea
							ref={textareaRef}
							value={content}
							onChange={(e) => setContent(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder="Votre réponse..."
							className="conversation__reply-input"
							rows={1}
						/>
						<button type="submit" className="conversation__reply-btn">
							↑
						</button>
					</form>
				</div>
			</section>
		</main>
	);
};

export default Conversation;
