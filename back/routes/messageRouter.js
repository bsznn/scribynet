import express from "express";
import {
	addResponse,
	createMessage,
	deleteMessageForMe,
	deleteMessageForAll,
	deleteResponseForMe,
	deleteResponseForAll,
	getAllMessages,
	getConversation,
	getMessageById,
	markAsRead,
	updateMessage,
	updateResponse,
} from "../controllers/messagesController.js";

import { isAuthorized, isLogged } from "../middlewares/auth.js";
import { updateFiles } from "../middlewares/multer.js";

const messageRouter = express.Router();

// 🔹 Messages
messageRouter.get("/messages", isLogged, getAllMessages);

messageRouter.get("/messages/:id", isLogged, getMessageById);

messageRouter.post(
	"/messages/new",
	isLogged,
	isAuthorized(["admin", "user"]),
	updateFiles,
	createMessage,
);

messageRouter.put(
	"/messages/edit/:id",
	isLogged,
	isAuthorized(["admin", "user"]),
	updateFiles,
	updateMessage,
);

// 🔹 supprimer pour moi
messageRouter.delete(
	"/messages/:id/deleteForMe",
	isLogged,
	isAuthorized(["admin", "user"]),
	deleteMessageForMe,
);

// 🔹 supprimer pour tous
messageRouter.delete(
	"/messages/:id/deleteForAll",
	isLogged,
	isAuthorized(["admin", "user"]),
	deleteMessageForAll,
);

// 🔹 conversation
messageRouter.get(
	"/messages/conversation/:conversationId",
	isLogged,
	isAuthorized(["admin", "user"]),
	getConversation,
);

// 🔹 Réponses
messageRouter.post(
	"/messages/:id/responses",
	isLogged,
	isAuthorized(["admin", "user"]),
	addResponse,
);

messageRouter.put(
	"/messages/:messageId/responses/:responseId",
	isLogged,
	isAuthorized(["admin", "user"]),
	updateResponse,
);

// 🔹 supprimer réponse pour moi
messageRouter.delete(
	"/messages/:messageId/responses/:responseId/deleteForMe",
	isLogged,
	isAuthorized(["admin", "user"]),
	deleteResponseForMe,
);

// 🔹 supprimer réponse pour tous
messageRouter.delete(
	"/messages/:messageId/responses/:responseId/deleteForAll",
	isLogged,
	isAuthorized(["admin", "user"]),
	deleteResponseForAll,
);

messageRouter.patch("/messages/:id/read", isLogged, markAsRead);

export default messageRouter;
