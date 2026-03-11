import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},

	content: {
		type: String,
		required: true,
	},

	createdAt: {
		type: Date,
		default: Date.now,
	},

	// 🔹 utilisateurs qui ont supprimé cette réponse pour eux
	deletedFor: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	],

	responses: [],
});

responseSchema.add({ responses: [responseSchema] });

const messageSchema = new mongoose.Schema(
	{
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		receiverId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		title: {
			type: String,
			required: true,
		},

		subject: {
			type: String,
		},

		content: {
			type: String,
			required: true,
		},

		image: {
			type: String,
		},

		files: [{ type: String }],

		isRead: {
			type: Boolean,
			default: false,
		},

		// 🔹 réponses imbriquées
		responses: [responseSchema],

		// 🔹 suppression individuelle du message
		deletedBySender: {
			type: Boolean,
			default: false,
		},

		deletedByReceiver: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true },
);

export default mongoose.model("Message", messageSchema);
