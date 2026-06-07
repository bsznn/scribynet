/**
 * @jest-environment node
 */

import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import express from "express";
import request from "supertest";
import Contact from "../../models/contactModel.js";
import { addContact, getAllContacts } from "../contactController.js";

const app = express();
app.use(express.json());
app.post("/contact", addContact);
app.get("/contacts", getAllContacts);

let mongoServer;

beforeAll(async () => {
	mongoServer = await MongoMemoryServer.create();
	await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
	await mongoose.disconnect();
	await mongoServer.stop();
});

afterEach(async () => {
	await Contact.deleteMany({});
});

const validBody = {
	content: "Bonjour, je souhaite vous contacter.",
	name: "Alice",
	subject: "Question",
	email: "alice@test.com",
};

describe("POST /contact — test d'intégration", () => {

	// Ligne 8 : guard champs manquants
	it("retourne 400 si un champ est manquant", async () => {
		const res = await request(app)
			.post("/contact")
			.send({ name: "Alice", subject: "Question", email: "alice@test.com" });

		expect(res.status).toBe(400);
		expect(res.body.error).toBe(
			"Tous les champs sont obligatoires : content, name, subject, email."
		);
	});

	it("retourne 400 si l'email est invalide", async () => {
		const res = await request(app)
			.post("/contact")
			.send({ ...validBody, email: "pasunemail" });

		expect(res.status).toBe(400);
		expect(res.body.error).toBe("Le format de l'email est invalide.");
	});

	it("retourne 201 et persiste le contact en base", async () => {
		const res = await request(app).post("/contact").send(validBody);

		expect(res.status).toBe(201);
		expect(res.body.message).toBe("Message de contact enregistré avec succès.");

		const saved = await Contact.findOne({ email: "alice@test.com" });
		expect(saved).not.toBeNull();
		expect(saved.name).toBe("Alice");
	});
});

describe("GET /contacts — test d'intégration", () => {

	it("retourne 200 avec les contacts triés par date décroissante", async () => {
		await Contact.create({ ...validBody, name: "Alice" });
		await Contact.create({ ...validBody, name: "Bob", email: "bob@test.com" });

		const res = await request(app).get("/contacts");

		expect(res.status).toBe(200);
		expect(res.body).toHaveLength(2);
		expect(res.body[0].name).toBe("Bob");
	});

	it("retourne un tableau vide si aucun contact", async () => {
		const res = await request(app).get("/contacts");

		expect(res.status).toBe(200);
		expect(res.body).toEqual([]);
	});
});
