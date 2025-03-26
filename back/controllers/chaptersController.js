import Book from "../models/bookModel.js";
import mongoose from "mongoose";

// Ajouter un nouveau chapitre à un livre existant
export const addChapter = async (req, res) => {
    try {
      const { bookId } = req.params;
      const book = await Book.findById(bookId);
  
      // Vérifier si l'utilisateur est autorisé à ajouter un chapitre
      if (!bookId || !req.userId) {
        return res.status(401).json({ message: "Non autorisé" });
      }
  
      // Vérifier si l'utilisateur est l'auteur du livre
      if (book.userId != req.userId) {
        throw new Error(
          "Vous ne pouvez ajouter des chapitres qu'à vos propres livres"
        );
      }
  
      const { chapters } = req.body;
  
      // Vérifier si le tableau chapters existe et contient des données
      if (!chapters || !Array.isArray(chapters) || chapters.length === 0) {
        return res.status(400).json({
          message: "Les données du chapitre sont manquantes ou invalides",
        });
      }
  
      const { chapterTitle, chapterContent } = chapters[0];
  
      // Vérifier si les champs du chapitre sont vides
      if (!chapterTitle || !chapterContent || chapterTitle.trim() === "" || chapterContent.trim() === "") {
        return res
          .status(400)
          .json({ message: "Veuillez remplir tous les champs" });
      }
  
      const chapter = {
        content: chapterContent,
        title: chapterTitle,
        date: new Date(), // Date actuelle du serveur
      };
  
      await Book.updateOne({ _id: bookId }, { $push: { chapters: chapter } });
  
      res.status(200).json({ message: "Le chapitre a bien été ajouté" });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Impossible d'ajouter de nouveaux chapitres",
        error: error.message,
      });
    }
  };
  

// Modifier un chapitre existant dans un livre
export const updateChapter = async (req, res) => {
  try {
    const { bookId, chapterId } = req.params;
    const { chapterTitle, chapterContent } = req.body.chapters[0];

    const book = await Book.findById(bookId);

    const chapter = book.chapters.id(chapterId);

    // Vérifier si le chapitre existe
    if (!chapter) {
      return res.status(404).json({ message: "Ce chapitre est introuvable" });
    }

    // Mettre à jour les champs du chapitre si fournis dans la requête
    if (chapterTitle) {
      chapter.title = chapterTitle;
    }

    if (chapterContent) {
      chapter.content = chapterContent;
    }

    await book.save();

    res
      .status(200)
      .json({ message: "Le chapitre a été modifié avec succès !" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Impossible de modifier le chapitre !" });
  }
};

// Supprimer un chapitre d'un livre
export const deleteChapter = async (req, res) => {
  try {
    const { bookId, chapterId } = req.params;
    const book = await Book.updateOne(
      { _id: bookId },
      { $pull: { chapters: { _id: chapterId } } }
    );

    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    res.status(200).json({ message: "Le chapitre a été supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Le chapitre n'a pas pu être supprimé" });
  }
};

// Récupérer tous les chapitres d'un livre spécifique
export const getAllChaptersByBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    // Récupérer les chapitres du livre
    const chapters = book.chapters;

    // Peupler les données de l'auteur du chapitre
    const populatedChapters = await Book.populate(chapters, {
      path: "userId",
      select: "-password",
    });

    res.status(200).json(populatedChapters);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Impossible de récupérer tous les chapitres",
    });
  }
};

// Récupérer un chapitre spécifique d'un livre
export const getOneChapterByBook = async (req, res) => {
  try {
    const { bookId, chapterId } = req.params;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    // Trouver le chapitre par son ID
    const chapter = book.chapters.find(
      (chapter) => chapter._id.toString() === chapterId
    );

    if (!chapter) {
      return res.status(404).json({ message: "Chapitre non trouvé" });
    }

    // Peupler les données de l'auteur du chapitre
    await Book.populate(chapter, {
      path: "userId",
      select: "-password",
    });

    res.status(200).json(chapter);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Impossible de récupérer le chapitre",
    });
  }
};