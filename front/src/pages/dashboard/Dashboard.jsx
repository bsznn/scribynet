import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

import defaultProfile from "../../assets/images/default-profile.jpg";
import fondImage from "../../assets/images/fond/fond-don.jpeg";

import "../../assets/styles/pages/dashboard/dashboard.css";

import {
	FaComments,
	FaBookOpen,
	FaChartBar,
	FaHeart,
	FaGift,
	FaClock,
	FaCog,
	FaTags,
	FaUsers,
	FaUserShield,
	FaEllipsisH,
} from "react-icons/fa";
import DashComments from "../../components/dashboard/DashComments";
import DashStories from "../../components/dashboard/DashStories";
import DashStats from "../../components/dashboard/DashStats";
import DashLikes from "../../components/dashboard/DashLikes";
import DashDons from "../../components/dashboard/DashDons";
import DashHistory from "../../components/dashboard/DashHistory";
import DashSettings from "../../components/dashboard/DashSettings";
import DashCategories from "../../components/dashboard/DashCategories";
import DashUsers from "../../components/dashboard/DashUsers";
import DashRoles from "../../components/dashboard/DashRoles";
import { useLocation } from "react-router-dom";

const USER_NAV = [
	{ key: "comments", label: "Commentaires", icon: FaComments },
	{ key: "stories", label: "Histoires", icon: FaBookOpen },
	{ key: "stats", label: "Statistiques", icon: FaChartBar },
	{ key: "likes", label: "Likes", icon: FaHeart },
	{ key: "dons", label: "Mes dons", icon: FaGift },
	{ key: "history", label: "Historique", icon: FaClock },
	{ key: "settings", label: "Paramètres", icon: FaCog },
];

const ADMIN_EXTRA = [
	{ key: "categories", label: "Catégories", icon: FaTags },
	{ key: "users", label: "Utilisateurs", icon: FaUsers },
	{ key: "roles", label: "Rôles", icon: FaUserShield },
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
			? `http://localhost:5000/assets/img/${user.image.src}`
			: defaultProfile;

	const sectionStyle = {
		backgroundImage: `url(${fondImage})`,
		backgroundSize: "cover",
		backgroundPosition: "center",
		backgroundRepeat: "no-repeat",
	};

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
				return <DashComments />;
		}
	};

	const currentLabel = navItems.find((n) => n.key === activeTab)?.label || "";
	const moreIsActive = moreItems.some((i) => i.key === activeTab);

	return (
		<main className="fond__dashboard" style={sectionStyle}>
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
					<main className="dash__main">
						{/* <header className="dash__topbar">
							<h2 className="dash__topbar-title">{currentLabel}</h2>
						</header> */}

						<div className="dash__content">{renderSection()}</div>
					</main>

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
								<FaEllipsisH />
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
