import { Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Authors from "./pages/authors/Authors";
import { AddBook } from "./pages/books/AddBook";
import Books from "./pages/books/Books";
import Categories from "./pages/categories/Categories";
import Home from "./pages/home/Home";
import EditBook from "./pages/books/EditBook";
import { Readers } from "./pages/readers/Readers";

import "./app.css";
import AboutContact from "./pages/about-contact/AboutContact";
import Book from "./pages/books/Book";

function App() {
	return (
		<div id="root">
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/se-connecter" element={<Login />} />
				<Route path="/s-inscrire" element={<Register />} />
				<Route path="/histoires" element={<Books />} />
				<Route path="/histoire/:id" element={<Book />} />
				<Route path="/auteurs" element={<Authors />} />
				<Route path="/lecteurs" element={<Readers />} />
				<Route path="/categories" element={<Categories />} />
				<Route path="/publier-histoire" element={<AddBook />} />
				<Route path="/modifier-histoire" element={<EditBook />} />
				<Route path="/a-propos" element={<AboutContact />} />
			</Routes>
		</div>
	);
}

export default App;
