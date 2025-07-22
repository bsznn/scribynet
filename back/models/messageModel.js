import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	content: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
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
		title: { type: String, required: true },
		subject: { type: String },
		content: { type: String, required: true },
		image: { type: String },
		files: [{ type: String }],
		isRead: { type: Boolean, default: false },
		responses: [responseSchema],
	},
	{ timestamps: true },
);

export default mongoose.model("Message", messageSchema);
