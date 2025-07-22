import express from "express";
import {
	createMessage,
	getAllMessages,
	getMessageById,
	updateMessage,
	deleteMessage,
	addResponse,
	updateResponse,
	deleteResponse,
	markAsRead,
	getConversation,
} from "../controllers/messagesController.js";
import { isLogged, isAuthorized } from "../middlewares/auth.js";
import { updateFiles } from "../middlewares/multer.js";

const messageRouter = express.Router();

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

messageRouter.delete(
	"/messages/delete/:id",
	isLogged,
	isAuthorized(["admin", "user"]),
	deleteMessage,
);

messageRouter.get(
	"/messages/conversation/:conversationId",
	isLogged,
	getConversation,
);

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

messageRouter.delete(
	"/messages/:messageId/responses/:responseId",
	isLogged,
	isAuthorized(["admin", "user"]),
	deleteResponse,
);

messageRouter.patch("/messages/:id/read", isLogged, markAsRead);

export default messageRouter;
