import express from "express";
import {
	createGift,
	getAllGifts,
	getGiftById,
	getGiftsReceivedByUser,
	getGiftsSentByUser,
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

giftRouter.get("/gifts/success", (req, res) => {
	res.send("<h1>Paiement réussi 🎉</h1><p>Merci pour votre don !</p>");
});

giftRouter.get("/gifts/cancel", (req, res) => {
	res.send(
		"<h1>Paiement annulé ❌</h1><p>Le paiement n'a pas été finalisé.</p>",
	);
});

export default giftRouter;
