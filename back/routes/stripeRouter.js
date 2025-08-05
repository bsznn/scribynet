import express from "express";
import {
	createStripeSession,
	stripeWebhook,
} from "../controllers/stripeController.js";

const stripeRouter = express.Router();

stripeRouter.post("/stripe/create-checkout-session", createStripeSession);
stripeRouter.post(
	"/stripe/webhook",
	express.raw({ type: "application/json" }),
	stripeWebhook,
);

export default stripeRouter;
