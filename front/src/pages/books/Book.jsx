import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { token } from "../../context/token";

const Book = () => {
  const [book, setBook] = useState(null);
  const [categories, setCategories] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [err, setErr] = useState();
  const [currentChapter, setCurrentChapter] = useState(0);
  const [handleCurrentChapter, setHandleCurrentChapter] = useState([]);

  const { id } = useParams();
  const auth = useAuth();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/books/${id}`)
      .then((res) => {
        setBook(res.data);
        setCategories(res.data.categoryId || []);
        setChapters(res.data.chapters || []);
        setHandleCurrentChapter([res.data.chapters[0]]);
      })
      .catch(() => {
        setErr("Impossible de récupérer le livre");
      });
  }, [id]);

  const handleDelete = (bookId, chapterId) => {
    if (!window.confirm("Supprimer ce chapitre ?")) return;

    axios
      .delete(
        `http://localhost:5000/books/chapter/delete/${bookId}/${chapterId}`,
        { headers: token() }
      )
      .then(() => {
        const updatedChapters = chapters.filter(
          (chapter) => chapter._id !== chapterId
        );
        setChapters(updatedChapters);
        setCurrentChapter(0);
        setHandleCurrentChapter([updatedChapters[0]]);
      })
      .catch((error) => {
        alert(error.response?.data?.message);
      });
  };

  const nextChapter = () => {
    if (currentChapter < chapters.length - 1) {
      setCurrentChapter((prev) => prev + 1);
      setHandleCurrentChapter([chapters[currentChapter + 1]]);
    }
  };

  const prevChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter((prev) => prev - 1);
      setHandleCurrentChapter([chapters[currentChapter - 1]]);
    }
  };

  return (
    <main className="m-container">
      <section className="bk-section">
        {err && <span>{err}</span>}

        {book && (
          <>
            {/* Infos livre */}
            <section className="bk-section-livre">
              <article className="article-livre">
                <img
                  className="bk-img"
                  src={`http://localhost:5000/assets/img/${book.image.src}`}
                  alt={book.image.alt}
                />
              </article>

              <article className="bk-article1">
                <h2 className="bk-title">{book.title}</h2>
                <p className="bk-author">Par {book.userId.login}</p>

                <p className="description">{book.description}</p>

                <div className="categories">
                  {categories.map((category, index) => (
                    <span key={index}>#{category.name} </span>
                  ))}
                </div>
              </article>
            </section>

            {/* Chapitres */}
            <section className="section-chapitre">
              {handleCurrentChapter.map((chapter) => (
                <article key={chapter._id} className="bk-article2">
                  <h4>{chapter.title}</h4>
                  <p className="description">{chapter.content}</p>

                  {auth.user && auth.user.id === book.userId._id && (
                    <div className="chapter-actions">
                      <Link
                        to={`/modifier-chapitre/${book._id}/${chapter._id}`}
                      >
                        Modifier
                      </Link>
                      <button
                        onClick={() =>
                          handleDelete(book._id, chapter._id)
                        }
                      >
                        Supprimer
                      </button>
                    </div>
                  )}

                  <div className="page-button">
                    <button onClick={prevChapter}>Précédent</button>
                    <button onClick={nextChapter}>Suivant</button>
                  </div>
                </article>
              ))}

              {auth.user && auth.user.id === book.userId._id && (
                <Link to={`/ajouter-chapitre/${book._id}`}>
                  Ajouter un chapitre
                </Link>
              )}
            </section>
          </>
        )}
      </section>
    </main>
  );
};

export default Book;
