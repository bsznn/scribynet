import axios from "axios";
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";

import "../../assets/styles/pages/auth/login.css"

export default function Login() {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [err, setErr] = useState();
  const auth = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
    setErr();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (inputs.email.trim() === "" || inputs.password.trim() === "") {
      return setErr("Veuillez remplir tous les champs.");
    }
    axios
      .post("http://localhost:5000/login", inputs)
      .then((res) => {
        if (res.data.token) {
          auth.login(res.data);
          navigate("/");
        }
      })
      .catch((error) => {
        console.log(error);

        if (error.response && error.response.status === 401) {
          window.alert("Identifiant ou mot de passe incorrect");
        } else {
          window.alert(
            "Une erreur s'est produite. Veuillez réessayer plus tard."
          );
        }
      });
  };

  return (
    <main className="login">
      <section className="login__section">
        <article className="login__left">
          <p className="login__text">
            Connectez-vous dès maintenant pour profiter de notre plateforme.
          </p>
          <img src="" alt="formulaire visuel" className="login__image" />
        </article>

        <form onSubmit={handleSubmit} className="login__form">
          <h2 className="login__title login__title--mobile">Connexion</h2>
          <label htmlFor="email" className="login__label">
            Email :
          </label>
          <input
            className="login__input"
            type="email"
            name="email"
            id="email"
            onChange={handleChange}
            value={inputs.email}
            placeholder="azerty@azerty.fr"
          />
          <label htmlFor="password" className="login__label">
            Mot de passe :
          </label>
          <input
            className="login__input"
            type="password"
            name="password"
            id="password"
            onChange={handleChange}
            value={inputs.password}
            placeholder="Mot de passe"
          />

          <div><button className="login__button">Se connecter</button></div>

          <p className="login__signup">
            Pas de compte ?
            <Link to="/s-inscrire" className="login__signup-link">
              Inscrivez-vous !
            </Link>
          </p>

          {err && <span className="login__error">{err}</span>}
        </form>
      </section>
    </main>
  );
}
