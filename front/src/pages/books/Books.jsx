import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

export default function Books () {
  const [books, setBooks] = useState([]);
  const [currentBooks, setCurrentBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [err, setErr] = useState();

  useEffect(() => {
    axios
      .get("http://localhost:5000/books/")
      .then((res) => {
        console.log(res);
        setBooks(res.data);
        setCurrentBooks(res.data.slice(0, 6));
      })
      .catch((res) => {
        console.log(res);
        setErr("Impossible de charger les données");
      });
  }, []);

  const nextBook = () => {
    const nextPage = currentPage + 1;
    const startIndex = nextPage * 6;
    const endIndex = (nextPage + 1) * 6;

    if (endIndex <= books.length) {
      setCurrentBooks(books.slice(startIndex, endIndex));
      setCurrentPage(nextPage);
    } else if (startIndex < books.length) {
      setCurrentBooks(books.slice(startIndex));
      setCurrentPage(nextPage);
    }
  };

  const prevBook = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
    const startIndex = Math.max((currentPage - 1) * 6, 0);
    const endIndex = startIndex + 6;
    setCurrentBooks(books.slice(startIndex, endIndex));
  };

  return (
    <main>
      <section>
        <h1>Livres</h1>

        {/* <ul>
          <li>
            <img
              src=""
              alt="category-title"
            />
          </li>
          <li>
            <p>
              Découvrez une multitude d'histoires fascinantes sur Scribify, où
              chaque livre vous transporte dans un univers unique. Du suspense
              palpitant aux romances envoûtantes, de la science-fiction à la
              fantaisie, nos auteurs talentueux vous offrent une variété
              d'aventures captivantes. Plongez dans notre bibliothèque virtuelle
              dès maintenant et laissez-vous emporter par la magie des mots.
            </p>
          </li>
          <li>
            <img
              src=""
              alt="fond-lune"
              id="books-fond-img"
            />
          </li>
        </ul> */}
      </section>

      <section>
        {currentBooks.map((oneBook) => (
          <NavLink to={`/livre/${oneBook._id}`} key={oneBook._id}>
            <section>
              <article>
                <ul>
                  <li>
                    <img
                      src={`http://localhost:5000/assets/img/${oneBook.image.src}`}
                      alt={oneBook.image.alt}
                      aria-label="books-image"
                      title={oneBook.image.alt}
                    />
                  </li>
                  <li>
                    <NavLink to={`/livre/${oneBook._id}`}>
                      <h3>{oneBook.title}</h3>
                    </NavLink>
                    <pre>Par {oneBook.userId.login}</pre>
                  </li>
                </ul>
              </article>

              <article>
                <ul>
                  <li>{oneBook.description}</li>
                  <li>
                    {oneBook.categoryId &&
                      oneBook.categoryId.map((category, index) => (
                        <span key={index}>#{category.name} </span>
                      ))}
                  </li>
                  <li>
                    <pre>
                      Créé le:{" "}
                      {new Date(oneBook.createdAt).toLocaleDateString()}
                    </pre>
                    <pre>
                      Modifié le:{" "}
                      {new Date(oneBook.updatedAt).toLocaleDateString()}
                    </pre>
                  </li>
                </ul>
              </article>
            </section>
          </NavLink>
        ))}
      </section>

      <section>
        <button onClick={prevBook}>
          Précédent
        </button>
        <button onClick={nextBook}>
          Suivant
        </button>
      </section>
    </main>
  );
};
