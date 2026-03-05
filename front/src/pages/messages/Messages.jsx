import React, { useEffect, useState } from "react";
import axios from "axios";
import { token } from "../../context/token";
import { useNavigate } from "react-router-dom";
import Message from "../../components/messages/Message";
import AddMessage from "../../components/messages/AddMessage";

const Messages = () => {
	const [messages, setMessages] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [update, setUpdate] = useState(false);
	const [err, setErr] = useState();
	const navigate = useNavigate();

	const getMessages = () => {
		axios
			.get("http://localhost:5000/messages", { headers: token() })
			.then((res) => setMessages(res.data))
			.catch((error) => {
				console.log(error);
				setErr("Impossible de charger les messages");
			});
	};

	useEffect(() => {
		getMessages();
	}, [update]);

	return (
		<section className="messages p-4 max-w-2xl mx-auto">
			<h1 className="text-2xl font-bold mb-4">Messagerie</h1>

			<button
				type="button"
				onClick={() => setShowForm(!showForm)}
				className="bg-green-500 text-white px-3 py-1 rounded mb-4"
			>
				Nouveau message
			</button>

			{showForm && <AddMessage onMessageSent={() => setUpdate(!update)} />}

			{err && <p className="text-red-500">{err}</p>}

			<div className="space-y-2">
				{messages.map((message) => (
					<Message key={message._id} message={message} />
				))}
			</div>
		</section>
	);
};

export default Messages;
