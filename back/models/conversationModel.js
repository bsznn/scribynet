import mongoose from "mongoose";

// Schéma pour les messages dans la conversation
const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Référence au modèle User
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    attachments: [
      {
        type: String, // URL ou chemin vers les fichiers
      },
    ],
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false } // Empêche Mongoose de créer un ID unique pour chaque message
);

// Schéma de la conversation
const ConversationSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Référence au modèle User
      required: true,
    },
  ],
  messages: [MessageSchema],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Création du modèle Conversation
const Conversation = mongoose.model("Conversation", ConversationSchema);

export default Conversation;
