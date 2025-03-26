import Conversation from "../models/conversationModel.js";
import User from "../models/userModel.js";

// Créer ou obtenir une conversation existante
export const createOrGetConversation = async (req, res) => {
  try {
    const { participantId } = req.body; // ID de l'autre utilisateur

    // Vérifier si une conversation existe déjà entre les deux utilisateurs
    let conversation = await Conversation.findOne({
      participants: { $all: [req.userId, participantId] },
    }).populate("participants", "login image");

    if (!conversation) {
      // Si la conversation n'existe pas, on la crée
      conversation = new Conversation({
        participants: [req.userId, participantId],
        messages: [],
      });
      await conversation.save();
    }

    res.status(200).json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création de la conversation" });
  }
};

// Envoyer un message dans une conversation
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, content, attachments } = req.body;

    // Vérifier si l'utilisateur est bien connecté
    if (!req.userId) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    const message = {
      sender: req.userId,
      content,
      attachments,
      timestamp: new Date(),
    };

    const conversation = await Conversation.findByIdAndUpdate(
      conversationId,
      {
        $push: { messages: message },
        $set: { lastUpdated: new Date() },
      },
      { new: true }
    )
      .populate("participants", "login image") // Remplacer le champ `userId` par les informations de l'utilisateur
      .populate("messages.sender", "login image"); // Ajouter les infos de l'envoyeur du message

    res.status(200).json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'envoi du message" });
  }
};

// Récupérer une conversation par ID
export const getConversationById = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId)
      .populate("participants", "login image")
      .populate("messages.sender", "login image");

    if (!conversation) {
      return res.status(404).json({ message: "Conversation non trouvée" });
    }

    res.status(200).json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération de la conversation" });
  }
};

// Récupérer toutes les conversations d'un utilisateur
export const getUserConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.userId,
    })
      .populate("participants", "login image")
      .sort({ lastUpdated: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des conversations" });
  }
};
