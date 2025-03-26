import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, NavLink } from "react-router-dom";

import { IoIosSettings } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import { token } from "../../context/token";

import { useAuth } from "../../context/AuthContext";

export default function Categories () {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  const auth = useAuth();

  useEffect(() => {
    axios
      .get("http://localhost:5000/categories/")
      .then((res) => {
        console.log(res);
        setCategories(res.data); 
      })
      .catch((error) => {
        console.log(error);
        setError("Impossible de charger les catégories"); 
      });
  }, []); 

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer la catégorie ?"
    );

    if (confirmDelete) {
      axios
        .delete(`http://localhost:5000/categories/delete/${id}`, {
          headers: token(),
        })
        .then((res) => {
          console.log(res.data.message);
          setCategories((prevCategories) =>
            prevCategories.filter((category) => category._id !== id)
          );
          alert("La catégorie a été supprimée avec succès !");
        })
        .catch((err) => {
          alert("Impossible de supprimer la catégorie !");
        });
    }
  };

  return (
    <main>
      {error && <p>{error}</p>}

      <section>
        <h1>Catégories</h1>

        <ul>
          {/* <li>
            <img
              src=""
              alt="category-title"
            />
          </li>
          <li>
            <p>
              Découvrez les catégories sur Scribify : votre outil indispensable
              pour organiser et structurer vos écrits selon thèmes et genres.
              Simplifiez la navigation et la gestion de votre contenu en
              regroupant vos œuvres de manière logique. Les catégories offrent
              une expérience de lecture fluide pour vos lecteurs tout en vous
              permettant de suivre facilement vos progrès d'écriture et
              d'explorer de nouveaux thèmes et genres littéraires.
            </p>
            <li>
              <img
                src=""
                alt="fond-lune"
              />
            </li>
          </li> */}
          <li>
            {auth.user && auth.user.role === "admin" && (
              <Link to={`/`}>
                <IoIosAddCircle/>
              </Link>
            )}
          </li>
        </ul>
      </section>

      <section>
        {categories.map((category) => (
          <section key={category._id}>
            <article>
              {category.image && (
                <img
                  src={`http://localhost:5000/assets/img/${category.image.src}`}
                  alt={category.image.alt}
                  aria-label="category-image"
                  title={category.image.alt}
                />
              )}
            </article>

            <article>
              <NavLink
                to={`/`}
              >
                <h3>{category.name}</h3>
              </NavLink>
            </article>

            {auth.user && auth.user.role === "admin" ? (
              <article>
                <Link to={`/}`}>
                  <IoIosSettings/>
                </Link>

                <span onClick={() => handleDelete(category._id)}>
                  <MdDelete/>
                </span>
              </article>
            ) : (
              <article>
                <img
                  src=""
                  alt="logo-image"
                />
              </article>
            )}
          </section>
        ))}
      </section>
    </main>
  );
};

