import { Route, Routes } from "react-router-dom";
import AboutUs from "./pages/about-us/AboutUs";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Authors from "./pages/authors/Authors";
import { AddBook } from "./pages/books/AddBook";
import Books from "./pages/books/Books";
import Categories from "./pages/categories/Categories";
import Home from "./pages/home/Home";
import { Readers } from "./pages/readers/Readers";

import "./app.css";

function App() {
	return (
		<div id="root">
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/se-connecter" element={<Login />} />
				<Route path="/s-inscrire" element={<Register />} />
				<Route path="/a-propos" element={<AboutUs />} />
				<Route path="/histoires" element={<Books />} />
				<Route path="/auteurs" element={<Authors />} />
				<Route path="/lecteurs" element={<Readers />} />
				<Route path="/categories" element={<Categories />} />
				<Route path="/publier-histoire" element={<AddBook />} />
			</Routes>
		</div>
	);
}

export default App;
