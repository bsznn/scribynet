import React from "react";
import { Link } from "react-router-dom";
import "../../assets/styles/pages/not-found/not-found.css"

const NotFound = () => {
    return (
        <main className="notfound">
            <div className="notfound__overlay" />

            <div className="notfound__box">
                <span className="notfound__eyebrow">Erreur</span>
                <h1 className="notfound__code">404</h1>
                <div className="notfound__divider" />
                <p className="notfound__title">Page introuvable</p>
                <p className="notfound__text">
                    La page que vous cherchez n'existe pas ou a été déplacée.
                </p>
                <Link to="/" className="notfound__btn">
                    ← Retour à l'accueil
                </Link>
            </div>
        </main>
    );
};

export default NotFound;
