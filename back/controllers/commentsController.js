import Book from "../models/bookModel.js";
import mongoose from "mongoose";

// Ajouter un nouveau commentaire à un livre
export const addComment = async (req, res) => {
  try {
    const { userId, bookId } = req.params;
    const { content } = req.body;

    // Vérifier si le contenu du commentaire est vide
    if (content.trim() === "") {
      return res
        .status(401)
        .json({ message: "Veuillez remplir tous les champs" });
    }

    // Créer un nouvel objet commentaire
    const comment = {
      userId: req.userId,
      content,
      date: new Date(),
    };

    // Ajouter le commentaire au livre spécifié
    await Book.updateOne(
      { _id: new mongoose.Types.ObjectId(bookId) },
      { $push: { comments: comment } }
    );

    res.status(200).json({ message: "Le commentaire a bien été ajouté" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Impossible d'ajouter ce commentaire" });
  }
};

// Modifier un commentaire existant dans un livre
export const updateComment = async (req, res) => {
  try {
    const { bookId, commentId } = req.params;
    const { content } = req.body;

    const book = await Book.findById(bookId);
    const comment = book.comments.id(commentId);

    // Vérifier si le commentaire existe
    if (!comment) {
      return res
        .status(404)
        .json({ message: "Ce commentaire est introuvable" });
    }

    // Vérifier si l'utilisateur est l'auteur du commentaire
    if (req.userId.toString() !== comment.userId.toString()) {
      return res
        .status(403)
        .json({ message: "Vous ne pouvez pas éditer ce commentaire" });
    }

    // Mettre à jour le contenu du commentaire et sa date
    if (content) {
      comment.content = content;
      comment.date = new Date();
    }

    await book.save();

    res
      .status(200)
      .json({ message: "Le commentaire a été modifié avec succès" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Impossible de modifier le commentaire" });
  }
};

// Supprimer un commentaire d'un livre
export const deleteComment = async (req, res) => {
  try {
    const { bookId, commentId } = req.params;

    // Supprimer le commentaire du livre spécifié
    await Book.updateOne(
      { _id: bookId },
      { $pull: { comments: { _id: commentId } } }
    );

    res
      .status(200)
      .json({ message: "Le commentaire a été supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Impossible de supprimer le commentaire" });
  }
};

// Récupérer tous les commentaires d'un livre spécifique
export const getAllCommentsByBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    // Récupérer les commentaires du livre
    const comments = book.comments;

    // Peupler les données de l'utilisateur auteur du commentaire
    const populatedComments = await Book.populate(comments, {
      path: "userId",
      select: "-password",
    });

    res.status(200).json(populatedComments);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Impossible de récupérer tous les commentaires",
    });
  }
};

// Récupérer un commentaire spécifique d'un livre
export const getOneCommentByBook = async (req, res) => {
  try {
    const { bookId, commentId } = req.params;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    // Trouver le commentaire par son ID
    const comment = book.comments.find(
      (comment) => comment._id.toString() === commentId
    );

    if (!comment) {
      return res.status(404).json({ message: "Commentaire non trouvé" });
    }

    // Peupler les données de l'utilisateur auteur du commentaire
    await Book.populate(comment, {
      path: "userId",
      select: "-password",
    });

    res.status(200).json(comment);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Impossible de récupérer le commentaire",
    });
  }
};