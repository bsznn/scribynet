import Contact from "../models/contactModel.js";

export const addContact = async (req, res) => {
	try {
		const { content, name, subject, email } = req.body;

		if (!content || !name || !subject || !email) {
			return res.status(400).json({
				error:
					"Tous les champs sont obligatoires : content, name, subject, email.",
			});
		}

		const emailRegex = /.+@.+\..+/;
		if (!emailRegex.test(email)) {
			return res
				.status(400)
				.json({ error: "Le format de l'email est invalide." });
		}

		const contact = new Contact({ content, name, subject, email });
		await contact.save();

		return res.status(201).json({
			message: "Message de contact enregistré avec succès.",
			data: contact,
		});
	} catch (error) {
		return res
			.status(500)
			.json({ error: "Une erreur est survenue lors de l'envoi du message." });
	}
};

export const getAllContacts = async (req, res) => {
	try {
		const contacts = await Contact.find().sort({ createdAt: -1 });
		return res.json(contacts);
	} catch (error) {
		return res
			.status(500)
			.json({ error: "Impossible de récupérer tous les contacts." });
	}
};
