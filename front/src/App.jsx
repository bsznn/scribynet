import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { AddBook } from "./pages/books/AddBook";
import Books from "./pages/books/Books";
import Categories from "./pages/categories/Categories";

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
import Dashboard from "./pages/dashboard/Dashboard";
import UserProfile from "./pages/profile/UserProfile";
import CategoryDetail from "./pages/categories/CategoryDetail";
import PrivateRoute from "./private-route/PrivateRoute";
import GuestRoute from "./private-route/GuestRoute";
import NotFound from "./pages/errors/NotFound";
import VerifyEmail from "./pages/auth/VerifyEmail";

const Home = lazy(() => import("./pages/home/Home"));

function App() {
	return (
		<div id="main">
			<Routes>
				{/* ── PUBLIQUES ── */}
				<Route
					path="/"
					element={
						<Suspense fallback={<>...</>}>
							<Home />
						</Suspense>
					}
				/>

				<Route path="*" element={<NotFound />} />

				<Route path="/histoires" element={<Books />} />
				<Route path="/histoire/:id" element={<Book />} />
				<Route path="/histoire/:id/:chapterId" element={<Book />} />
				<Route path="/categories" element={<Categories />} />
				<Route path="/categories/:id" element={<CategoryDetail />} />
				<Route path="/a-propos" element={<AboutContact />} />
				<Route path="/faire-don" element={<Donation />} />
				<Route path="/mentions-legales" element={<LegalNotices />} />
				<Route path="/politique-confidentialite" element={<PrivacyPolicy />} />
				<Route path="/profil/:id" element={<UserProfile />} />
				<Route path="/publier-histoire" element={<AddBook />} />

				{/* ── GUEST ONLY (non connecté) ── */}
				<Route element={<GuestRoute />}>
					<Route path="/se-connecter" element={<Login />} />
					<Route path="/s-inscrire" element={<Register />} />
					<Route path="/verify-email" element={<VerifyEmail />} />
				</Route>

				{/* ── UTILISATEURS CONNECTÉS ── */}
				<Route element={<PrivateRoute />}>
					<Route path="/modifier-histoire/:id" element={<EditBook />} />
					<Route
						path="/modifier-chapitre/:bookId/:chapterId"
						element={<ChapterUpdate />}
					/>
					<Route path="/ajouter-chapitre/:bookId" element={<ChapterAdd />} />
					<Route path="/profil" element={<Profile />} />
					<Route path="/messagerie" element={<Messages />} />
					<Route
						path="/messages/conversation/:conversationId"
						element={<Conversation />}
					/>
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/don-succes" element={<DonationSuccess />} />
					<Route path="/don-annule" element={<DonationCancel />} />
				</Route>
			</Routes>
		</div>
	);
}

export default App;
