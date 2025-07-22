import express from "express";
import {
	getAllGifts,
	getGiftById,
	getGiftsReceivedByUser,
	getGiftsSentByUser,
	createGift,
} from "../controllers/giftsController.js";
import { isAuthorized, isLogged } from "../middlewares/auth.js";

const giftRouter = express.Router();

giftRouter.get(
	"/gifts",
	isLogged,
	isAuthorized(["admin", "user"]),
	getAllGifts,
);
giftRouter.get(
	"/gifts/:id",
	isLogged,
	isAuthorized(["admin", "user"]),
	getGiftById,
);
giftRouter.get(
	"/gifts/received/:userId",
	isLogged,
	isAuthorized(["admin", "user"]),
	getGiftsReceivedByUser,
);
giftRouter.get(
	"/gifts/sent/:userId",
	isLogged,
	isAuthorized(["admin", "user"]),
	getGiftsSentByUser,
);
giftRouter.post(
	"/gifts/new",
	isLogged,
	isAuthorized(["admin", "user"]),
	createGift,
);

export default giftRouter;
