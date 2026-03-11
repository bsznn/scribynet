import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Authors from "./pages/authors/Authors";
import { AddBook } from "./pages/books/AddBook";
import Books from "./pages/books/Books";
import Categories from "./pages/categories/Categories";
//import Home from "./pages/home/Home";
import { Readers } from "./pages/readers/Readers";

import "./app.css";
import AboutContact from "./pages/about-contact/AboutContact";
import Book from "./pages/books/Book";
import ChapterUpdate from "./components/chapters/ChapterUpdate";
import ChapterAdd from "./components/chapters/AddChapter";
import Donation from "./pages/donation/Donation";
import DonationSuccess from "./pages/donation/DonationSuccess";
import DonationCancel from "./pages/donation/DonationCancel";
import { EditBook } from "./pages/books/EditBook";
import LegalNotices from "./pages/footer/LegalNotices";
import PrivacyPolicy from "./pages/footer/PrivacyPolicy";
import Profile from "./pages/profile/Profile";
import Conversation from "./pages/messages/Conversation";
import Messages from "./pages/messages/Messages";
import AddMessage from "./components/messages/AddMessage";
import Dashboard from "./pages/dashboard/Dashboard";

const Home = lazy(() => import("./pages/home/Home"));

function App() {
	return (
		<div id="main">
			<Routes>
				<Route
					path="/"
					element={
						<Suspense fallback={<>...</>}>
							<Home />
						</Suspense>
					}
				/>
				<Route path="/se-connecter" element={<Login />} />
				<Route path="/s-inscrire" element={<Register />} />
				<Route path="/histoires" element={<Books />} />
				<Route path="/modifier-histoire/:id" element={<EditBook />} />
				<Route path="/histoire/:id" element={<Book />} />
				<Route path="/auteurs" element={<Authors />} />
				<Route path="/lecteurs" element={<Readers />} />
				<Route path="/categories" element={<Categories />} />
				<Route path="/publier-histoire" element={<AddBook />} />
				<Route path="/a-propos" element={<AboutContact />} />
				<Route
					path="/modifier-chapitre/:bookId/:chapterId"
					element={<ChapterUpdate />}
				/>
				<Route path="/ajouter-chapitre/:bookId" element={<ChapterAdd />} />
				<Route path="/faire-don" element={<Donation />} />
				<Route path="/don-succes" element={<DonationSuccess />} />
				<Route path="/don-annule" element={<DonationCancel />} />
				<Route path="/mentions-legales" element={<LegalNotices />} />
				<Route path="/politique-confidentialite" element={<PrivacyPolicy />} />
				<Route path="/profil" element={<Profile />} />

				<Route path="/messagerie" element={<Messages />} />
				<Route path="/dashboard" element={<Dashboard />} />

				<Route
					path="/messages/conversation/:conversationId"
					element={<Conversation />}
				/>

				<Route path="/messages/new" element={<AddMessage />} />
			</Routes>
		</div>
	);
}

export default App;
