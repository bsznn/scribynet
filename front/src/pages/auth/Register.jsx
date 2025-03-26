import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register () {
  const [inputs, setInputs] = useState({
    login: "",
    email: "",
    password: "",
  });

  const [err, setErr] = useState();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
    setErr();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      inputs.email.trim() === "" ||
      inputs.password.trim() === "" ||
      inputs.login.trim() === ""
    ) {
      return setErr("Veuillez remplir tous les champs.");
    }
    axios
      .post("http://localhost:5000/register", inputs)
      .then(() => {
        navigate("/se-connecter");
      })
      .catch((error) => {
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
    <main>
      <section>
        <article>
          <p>
            Inscrivez-vous dès maintenant pour profiter de notre plateforme.
          </p>
          <img src="" alt="form-image"/>
        </article>
        <form onSubmit={handleSubmit}>
          <h2>Inscription</h2>
          <label htmlFor="login">Nom d'utilisateur :</label>
          <input
            type="login"
            name="login"
            id="login"
            onChange={handleChange}
            value={inputs.login}
            placeholder="azerty"
          />
          <label htmlFor="email">Adresse mail :</label>
          <input
            type="email"
            name="email"
            id="email"
            onChange={handleChange}
            value={inputs.email}
            placeholder="azerty@azerty.fr"
          />
          <label htmlFor="password">Mot de passe :</label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={handleChange}
            value={inputs.password}
            placeholder="Mot de passe"
          />
          <button>S'inscrire</button>

          <p>
            Déjà inscrit ?
            <Link to="/se-connecter">
              Connectez-vous !
            </Link>
          </p>

          {err && <span>{err}</span>}
        </form>
      </section>
    </main>
  );
};
