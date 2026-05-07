import { useState } from "react";
import defaultProfile from "../../assets/images/default-profile.jpg";
import fondImage from "../../assets/images/fond/fond-don.jpg";
import { useAuth } from "../../context/AuthContext";

import "../../assets/styles/pages/dashboard/dashboard.css";

import {
	BarChart2,
	BookOpen,
	Clock,
	Ellipsis,
	Gift,
	Heart,
	MessageSquare,
	Settings,
	ShieldUser,
	Tags,
	Users,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import DashCategories from "../../components/dashboard/DashCategories";
import DashComments from "../../components/dashboard/DashComments";
import DashDons from "../../components/dashboard/DashDons";
import DashHistory from "../../components/dashboard/DashHistory";
import DashLikes from "../../components/dashboard/DashLikes";
import DashRoles from "../../components/dashboard/DashRoles";
import DashSettings from "../../components/dashboard/DashSettings";
import DashStats from "../../components/dashboard/DashStats";
import DashStories from "../../components/dashboard/DashStories";
import DashUsers from "../../components/dashboard/DashUsers";

const USER_NAV = [
	{ key: "comments", label: "Commentaires", icon: MessageSquare },
	{ key: "stories", label: "Histoires", icon: BookOpen },
	{ key: "stats", label: "Statistiques", icon: BarChart2 },
	{ key: "likes", label: "Likes", icon: Heart },
	{ key: "dons", label: "Mes dons", icon: Gift },
	{ key: "history", label: "Historique", icon: Clock },
	{ key: "settings", label: "Paramètres", icon: Settings },
];

const ADMIN_EXTRA = [
	{ key: "categories", label: "Catégories", icon: Tags },
	{ key: "users", label: "Utilisateurs", icon: Users },
	{ key: "roles", label: "Rôles", icon: ShieldUser },
];

const BOTTOM_COUNT = 4;

export default function Dashboard() {
	const { user } = useAuth();
	const isAdmin = user?.role === "admin";
	const location = useLocation();
	const [activeTab, setActiveTab] = useState(location.state?.tab || "comments");
	const [moreOpen, setMoreOpen] = useState(false);

	const navItems = isAdmin ? [...USER_NAV, ...ADMIN_EXTRA] : USER_NAV;
	const bottomItems = navItems.slice(0, BOTTOM_COUNT);
	const moreItems = navItems.slice(BOTTOM_COUNT);

	const profileImage =
		user?.image?.src && user.image.src !== "default-profil.png"
			? `${import.meta.env.VITE_API_URL}/assets/img/${user.image.src}`
			: defaultProfile;

	const handleTabChange = (key) => {
		setActiveTab(key);
		setMoreOpen(false);
	};

	const renderSection = () => {
		switch (activeTab) {
			case "settings":
				return <DashSettings />;
			case "stories":
				return <DashStories />;
			case "stats":
				return <DashStats />;
			case "comments":
				return <DashComments />;
			case "likes":
				return <DashLikes />;
			case "dons":
				return <DashDons />;
			case "history":
				return <DashHistory />;
			case "categories":
				return isAdmin ? <DashCategories /> : null;
			case "users":
				return isAdmin ? <DashUsers /> : null;
			case "roles":
				return isAdmin ? <DashRoles /> : null;
			default:
				return <DashStories />;
		}
	};

	const currentLabel = navItems.find((n) => n.key === activeTab)?.label || "";
	const moreIsActive = moreItems.some((i) => i.key === activeTab);

	return (
		<main className="fond__dashboard">
			<img
				src={fondImage}
				alt="fond__dashboard"
				fetchPriority="low"
				decoding="async"
				className="fond__dashboard-bg"
			/>
			<div className="dash">
				<div className="dash__container">
					{/* ── SIDEBAR (desktop/tablette) ── */}
					<aside className="dash__sidebar">
						<div className="dash__sidebar-header">
							<div className="dash__profile">
								<img
									className="dash__avatar"
									src={profileImage}
									alt={user?.login}
								/>
								<div className="dash__profile-info">
									<span className="dash__profile-name">{user?.login}</span>
									<span
										className={`dash__badge ${isAdmin ? "dash__badge--admin" : "dash__badge--user"}`}
									>
										{isAdmin ? "Admin" : "Membre"}
									</span>
								</div>
							</div>
						</div>

						<nav className="dash__nav">
							{navItems.map(({ key, label, icon: Icon }) => (
								<button
									key={key}
									type="button"
									className={`dash__nav-item ${activeTab === key ? "dash__nav-item--active" : ""}`}
									onClick={() => setActiveTab(key)}
								>
									<Icon className="dash__nav-icon" />
									<span>{label}</span>
								</button>
							))}
						</nav>
					</aside>

					{/* ── MAIN ── */}
					<div className="dash__main">
						{/* <header className="dash__topbar">
							<h2 className="dash__topbar-title">{currentLabel}</h2>
						</header> */}

						<div className="dash__content">{renderSection()}</div>
					</div>

					{/* ── BOTTOM NAV (mobile uniquement) ── */}
					<nav className="dash__bottomnav">
						{bottomItems.map(({ key, label, icon: Icon }) => (
							<button
								key={key}
								type="button"
								className={`dash__bottomnav-item ${activeTab === key ? "dash__bottomnav-item--active" : ""}`}
								onClick={() => handleTabChange(key)}
							>
								<Icon />
								<span>{label}</span>
							</button>
						))}

						{/* Bouton "Plus" uniquement si des items dépassent BOTTOM_COUNT */}
						{moreItems.length > 0 && (
							<button
								type="button"
								className={`dash__bottomnav-item ${moreIsActive || moreOpen ? "dash__bottomnav-item--active" : ""}`}
								onClick={() => setMoreOpen((prev) => !prev)}
							>
								<Ellipsis />
								<span>Plus</span>
							</button>
						)}
					</nav>

					{/* ── MENU "PLUS" (popup au-dessus de la bottombar) ── */}
					{moreOpen && (
						<>
							{/* Overlay pour fermer en cliquant dehors */}
							<div
								className="dash__more-overlay"
								onClick={() => setMoreOpen(false)}
							/>
							<div className="dash__more-menu">
								{moreItems.map(({ key, label, icon: Icon }) => (
									<button
										key={key}
										type="button"
										className={`dash__more-item ${activeTab === key ? "dash__more-item--active" : ""}`}
										onClick={() => handleTabChange(key)}
									>
										<Icon className="dash__more-icon" />
										<span>{label}</span>
									</button>
								))}
							</div>
						</>
					)}
				</div>
			</div>
		</main>
	);
}
