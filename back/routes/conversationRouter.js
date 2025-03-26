import express from "express";
import { isAuthorized, isLogged } from "../middlewares/auth.js";
import {
  createOrGetConversation,
  sendMessage,
  getConversationById,
  getUserConversations,
} from "../controllers/conversationController.js";

const conversationRouter = express.Router();

conversationRouter.post("/conversation", isLogged, isAuthorized(["admin", "user"]), createOrGetConversation);
conversationRouter.post("/message", isLogged, isAuthorized(["admin", "user"]), sendMessage);
conversationRouter.get("/conversation/:conversationId", isLogged, isAuthorized(["admin", "user"]), getConversationById);
conversationRouter.get("/conversations", isLogged, isAuthorized(["admin", "user"]), getUserConversations);

export default conversationRouter;
