import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import AboutContact from "./pages/about-contact/AboutContact";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyEmail from "./pages/auth/VerifyEmail";
import Book from "./pages/books/Book";
import Books from "./pages/books/Books";
import Categories from "./pages/categories/Categories";
import CategoryDetail from "./pages/categories/CategoryDetail";
import Donation from "./pages/donation/Donation";
import NotFound from "./pages/errors/NotFound";
import LegalNotices from "./pages/footer/LegalNotices";
import PrivacyPolicy from "./pages/footer/PrivacyPolicy";
// ── PAGES CRITIQUES (bundle principal) ──
import Home from "./pages/home/Home";
import UserProfile from "./pages/profile/UserProfile";
import GuestRoute from "./private-route/GuestRoute";
import PrivateRoute from "./private-route/PrivateRoute";

// ── PAGES LAZY (chargées à la demande) ──
const AddBook = lazy(() =>
	import("./pages/books/AddBook").then((m) => ({ default: m.AddBook })),
);
const EditBook = lazy(() =>
	import("./pages/books/EditBook").then((m) => ({ default: m.EditBook })),
);
const ChapterUpdate = lazy(() => import("./components/chapters/ChapterUpdate"));
const ChapterAdd = lazy(() => import("./components/chapters/AddChapter"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const Profile = lazy(() => import("./pages/profile/Profile"));
const Messages = lazy(() => import("./pages/messages/Messages"));
const Conversation = lazy(() => import("./pages/messages/Conversation"));
const DonationSuccess = lazy(() => import("./pages/donation/DonationSuccess"));
const DonationCancel = lazy(() => import("./pages/donation/DonationCancel"));

import "./app.css";

function PageLoader() {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
			}}
		>
			<div className="spinner" />
		</div>
	);
}

function App() {
	return (
		<div id="main">
			<Suspense fallback={<PageLoader />}>
				<Routes>
					{/* ── PUBLIQUES ── */}
					<Route path="/" element={<Home />} />
					<Route path="/histoires" element={<Books />} />
					<Route path="/histoire/:id" element={<Book />} />
					<Route path="/histoire/:id/:chapterId" element={<Book />} />
					<Route path="/categories" element={<Categories />} />
					<Route path="/categories/:id" element={<CategoryDetail />} />
					<Route path="/a-propos" element={<AboutContact />} />
					<Route path="/faire-don" element={<Donation />} />
					<Route path="/mentions-legales" element={<LegalNotices />} />
					<Route
						path="/politique-confidentialite"
						element={<PrivacyPolicy />}
					/>
					<Route path="/profil/:id" element={<UserProfile />} />
					<Route path="/publier-histoire" element={<AddBook />} />
					<Route path="*" element={<NotFound />} />

					{/* ── GUEST ONLY ── */}
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
			</Suspense>
		</div>
	);
}

export default App;
