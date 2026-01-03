import express from "express";
import {
	addContact,
	getAllContacts
} from "../controllers/contactController.js";

const contactRouter = express.Router();

contactRouter.post(
	"/contact/new",
	addContact,
);

contactRouter.get(
	"/contacts",
	getAllContacts,
);

export default contactRouter;