import { useEffect, useState } from "react";
import axios from "axios";
import { token } from "../../context/token";
import Message from "../../components/messages/Message";
import AddMessage from "../../components/messages/AddMessage";

import "../../assets/styles/pages/messages/messages.css";
import fondImage from "../../assets/images/fond/fond-don.jpg";
import { useAuth } from "../../context/AuthContext";

const MESSAGES_PER_PAGE = 3;

const Messages = () => {
	const [messages, setMessages] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [update, setUpdate] = useState(false);
	const [err, setErr] = useState();
	const [currentPage, setCurrentPage] = useState(1);
	const { user } = useAuth();

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 1200) setShowForm(true);
		};
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const getMessages = () => {
		axios
			.get(`${import.meta.env.VITE_API_URL}/messages`, { headers: token() })
			.then((res) => setMessages(res.data))
			.catch((error) => {
				setErr("Impossible de charger les messages");
			});
	};

	useEffect(() => {
		getMessages();
	}, [update]);

	// Remettre à la page 1 si la liste change
	useEffect(() => {
		setCurrentPage(1);
	}, [messages.length]);

	const totalPages = Math.ceil(messages.length / MESSAGES_PER_PAGE);
	const paginatedMessages = messages.slice(
		(currentPage - 1) * MESSAGES_PER_PAGE,
		currentPage * MESSAGES_PER_PAGE,
	);

	return (
		<main className="fond__messages">
			<img
				src={fondImage}
				alt="fond__messages"
				fetchPriority="low"
				decoding="sync"
				className="books__header-bg"
			/>
			<section className="messages">
				<div className="messages__container">
					<h1>Messagerie</h1>

					<button
						type="button"
						onClick={() => setShowForm(!showForm)}
						className="btn-new-message"
					>
						Nouveau message
					</button>

					{showForm && <AddMessage onMessageSent={() => setUpdate(!update)} />}

					{err && <p className="error-msg">{err}</p>}

					<div className="space-y-2">
						{messages.length === 0 ? (
							<div className="messages-empty">
								<span className="messages-empty__icon">✉</span>
								<p className="messages-empty__title">
									Aucun message pour le moment
								</p>
								<p className="messages-empty__sub">
									Commencez une conversation en envoyant votre premier message.
								</p>
							</div>
						) : (
							paginatedMessages.map((message) => (
								<Message
									key={message._id}
									message={message}
									currentUserId={user?._id || user?.id}
									onRead={(id) =>
										setMessages((prev) =>
											prev.map((m) =>
												m._id === id ? { ...m, isRead: true } : m,
											),
										)
									}
									onDeleted={() =>
										setMessages((prev) =>
											prev.filter((m) => m._id !== message._id),
										)
									}
									onUpdated={(updatedMessage) =>
										setMessages((prev) =>
											prev.map((m) =>
												m._id === updatedMessage._id ? updatedMessage : m,
											),
										)
									}
								/>
							))
						)}
					</div>

					{totalPages > 1 && (
						<div className="messages__pagination">
							<button
								type="button"
								className="pagination__btn"
								onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
								disabled={currentPage === 1}
							>
								←
							</button>

							{Array.from({ length: totalPages }, (_, i) => i + 1).map(
								(page) => (
									<button
										type="button"
										key={page}
										className={`pagination__btn ${currentPage === page ? "pagination__btn--active" : ""}`}
										onClick={() => setCurrentPage(page)}
									>
										{page}
									</button>
								),
							)}

							<button
								type="button"
								className="pagination__btn"
								onClick={() =>
									setCurrentPage((p) => Math.min(p + 1, totalPages))
								}
								disabled={currentPage === totalPages}
							>
								→
							</button>
						</div>
					)}
				</div>
			</section>
		</main>
	);
};

export default Messages;
