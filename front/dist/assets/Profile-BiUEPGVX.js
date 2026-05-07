import {
	m as $,
	t as c,
	j as e,
	H as G,
	u as H,
	L as h,
	T as I,
	E as K,
	s as O,
	b as o,
	q,
	B as R,
	a as T,
	r as t,
	v as U,
	S as w,
	l as y,
} from "./index-DV15eqUG.js";

const J = "/assets/fly-B2bKDqJf.jpg",
	W = () => {
		var f, j, g;
		const i = H(),
			p = T(),
			[n, _] = t.useState([]),
			[S, E] = t.useState(0),
			[P, A] = t.useState(0),
			[D, B] = t.useState([]),
			[L, C] = t.useState([]),
			[u, F] = t.useState(0),
			m = 3,
			[x, d] = t.useState();
		t.useEffect(() => {
			o.get(`http://localhost:5000/books/my-book/${i.user.id}`, {
				headers: c(),
			})
				.then((s) => _(s.data))
				.catch(() => d("Impossible de charger vos histoires !"));
		}, [i.user.id]),
			t.useEffect(() => {
				o.get(`http://localhost:5000/books/total-views/${i.user.id}`, {
					headers: c(),
				})
					.then((s) => E(s.data.totalViews))
					.catch(() => d("Impossible de charger les vues !"));
			}, [i.user.id]),
			t.useEffect(() => {
				o.get(`http://localhost:5000/books/total-likes/${i.user.id}`, {
					headers: c(),
				})
					.then((s) => A(s.data.totalLikes))
					.catch(() => d("Impossible de charger les likes !"));
			}, [i.user.id]),
			t.useEffect(() => {
				o.get("http://localhost:5000/users", { headers: c() })
					.then((s) => B(s.data.authors || []))
					.catch(() => d("Impossible de charger les auteurs !"));
			}, []),
			t.useEffect(() => {
				o.get("http://localhost:5000/books/newest-books")
					.then((s) => C(s.data))
					.catch(() => d("Impossible de charger le profil !"));
			}, []);
		const M = (s) => {
				window.confirm("Êtes-vous sûr de vouloir supprimer l'utilisateur ?") &&
					o
						.delete(`http://localhost:5000/users/delete/${s}`, { headers: c() })
						.then(() => {
							alert("Utilisateur supprimé !"), i.logout(), p("/");
						})
						.catch(() => alert("Impossible de supprimer l'utilisateur !"));
			},
			V = (s) => {
				window.confirm("Êtes-vous sûr de vouloir supprimer cette histoire ?") &&
					o
						.delete(`http://localhost:5000/books/delete/${s}/${i.user.id}`, {
							headers: c(),
						})
						.then(() => _((a) => a.filter((r) => r._id !== s)))
						.catch(() => alert("Impossible de supprimer l'histoire !"));
			};
		return (
			Math.ceil(n.length / m),
			n.slice(u * m, (u + 1) * m),
			e.jsxs("main", {
				className: "profile",
				children: [
					x && e.jsx("span", { className: "profile__error", children: x }),
					e.jsxs("section", {
						className: "profile__header",
						children: [
							e.jsx("img", {
								src: q,
								alt: "fond__profile",
								fetchPriority: "low",
								decoding: "sync",
								className: "books__header-bg",
							}),
							i.user.login &&
								e.jsxs("div", {
									className: "profile__header--content",
									children: [
										e.jsxs("div", {
											className: "profile__header--info",
											children: [
												e.jsx("div", {
													className: "profile__avatar",
													children: e.jsx("img", {
														src: i.user.image
															? `http://localhost:5000/assets/img/${i.user.image.src}`
															: $,
														alt:
															((f = i.user.image) == null ? void 0 : f.alt) ||
															"default-image",
														title:
															((j = i.user.image) == null ? void 0 : j.alt) ||
															"default-image",
													}),
												}),
												e.jsx("div", {
													className: "profile__user",
													children: e.jsxs("h3", {
														children: [
															i.user.login,
															i.user.role === "admin"
																? e.jsx("img", {
																		src: O,
																		alt: "admin-badge",
																		className: "profile__badge",
																	})
																: e.jsx("img", {
																		src: U,
																		alt: "user-badge",
																		className: "profile__badge",
																	}),
														],
													}),
												}),
											],
										}),
										e.jsx("div", {
											className: "profile__description",
											children: e.jsx("p", {
												children:
													(g = i.user.description) != null && g.trim()
														? i.user.description
														: "Votre bio attend ses premiers mots… à vous de jouer !",
											}),
										}),
										e.jsxs("div", {
											className: "profile__side",
											children: [
												e.jsx("div", {
													className: "profile__stats",
													children: e.jsxs("ul", {
														children: [
															e.jsxs("li", {
																children: [
																	e.jsx(K, { className: "profile__icon" }),
																	" ",
																	S,
																],
															}),
															e.jsxs("li", {
																children: [
																	e.jsx(R, { className: "profile__icon" }),
																	" ",
																	n.length,
																],
															}),
															e.jsxs("li", {
																children: [
																	e.jsx(G, { className: "profile__icon" }),
																	" ",
																	P,
																],
															}),
														],
													}),
												}),
												e.jsx("div", {
													className: "profile__actions",
													children: e.jsxs("ul", {
														children: [
															e.jsx("li", {
																children: e.jsxs(h, {
																	to: "/dashboard",
																	state: { tab: "settings" },
																	className: "profile__link",
																	children: [
																		e.jsx(w, { className: "profile__icon" }),
																		" Modifier",
																	],
																}),
															}),
															e.jsxs("li", {
																onClick: () => M(i.user.id),
																children: [
																	e.jsx(I, { className: "profile__icon" }),
																	" Supprimer",
																],
															}),
														],
													}),
												}),
											],
										}),
									],
								}),
						],
					}),
					e.jsxs("div", {
						className: "profile__container",
						children: [
							e.jsxs("section", {
								className: "profile__books",
								children: [
									e.jsx("h2", {
										className: "profile__title",
										children: "Histoires publiées",
									}),
									e.jsx("section", {
										className: "books__list",
										children:
											n.length === 0
												? e.jsxs("div", {
														className: "profile__empty",
														children: [
															e.jsx("p", {
																children:
																	"Votre profil ne contient pas encore de publications et cet espace reste pour le moment entièrement vide, prêt à accueillir les histoires, expériences, réflexions ou inspirations que vous souhaitez partager.",
															}),
															e.jsx("p", {
																children:
																	"Partagez vos premiers récits, vos expériences ou vos idées afin de remplir cet espace et permettre aux autres de découvrir votre univers.",
															}),
															e.jsx("p", {
																children:
																	"Lancez-vous et publiez votre première histoire dès maintenant. ✨",
															}),
															e.jsxs(h, {
																to: "/publier-histoire",
																className: "books__link books__add-card",
																children: [
																	e.jsx("img", {
																		src: J,
																		alt: "heart-composant",
																		"aria-label": "heart-composant",
																		className: "books__heart-modern-component",
																	}),
																	e.jsx("div", {
																		className: "books__heart-modern",
																		children: e.jsx("span", {
																			children: "Ajouter une histoire",
																		}),
																	}),
																],
															}),
														],
													})
												: n.map((s) => {
														var a, r, N, b, v, k;
														return e.jsx(
															h,
															{
																to: `/histoire/${s._id}`,
																className: "books__link",
																children: e.jsxs("article", {
																	className: "books__card",
																	children: [
																		e.jsxs("div", {
																			className: "books__card-header",
																			children: [
																				e.jsx("img", {
																					className: "books__image",
																					src:
																						(a = s.image) != null && a.src
																							? `http://localhost:5000/assets/img/${s.image.src}`
																							: y,
																					alt:
																						((r = s.image) == null
																							? void 0
																							: r.alt) || "Image par défaut",
																				}),
																				e.jsxs("div", {
																					className: "books__meta",
																					children: [
																						e.jsx("h3", {
																							className: "books__card-title",
																							children: s.title,
																						}),
																						e.jsxs("span", {
																							className: "books__author",
																							children: [
																								"Par ",
																								((N = s.userId) == null
																									? void 0
																									: N.login) ||
																									"Auteur inconnu",
																							],
																						}),
																					],
																				}),
																			],
																		}),
																		e.jsxs("div", {
																			className: "books__card-body",
																			children: [
																				e.jsx("p", {
																					className: "books__description",
																					children: s.description,
																				}),
																				e.jsxs("div", {
																					className: "books__categories",
																					children: [
																						(b = s.categoryId) == null
																							? void 0
																							: b.slice(0, 2).map((l, z) =>
																									e.jsxs(
																										"span",
																										{
																											className:
																												"books__category",
																											children: ["#", l.name],
																										},
																										z,
																									),
																								),
																						s.categoryId &&
																							s.categoryId.length > 2 &&
																							e.jsxs("span", {
																								className: "books__more",
																								children: [
																									"+",
																									s.categoryId.length - 2,
																									" autres",
																								],
																							}),
																					],
																				}),
																				e.jsxs("div", {
																					className: "books__settings",
																					children: [
																						e.jsxs("div", {
																							className: "books__dates",
																							children: [
																								e.jsxs("span", {
																									children: [
																										"Créé le",
																										" ",
																										new Date(
																											s.createdAt,
																										).toLocaleDateString(),
																									],
																								}),
																								e.jsxs("span", {
																									children: [
																										"Modifié le",
																										" ",
																										new Date(
																											s.updatedAt,
																										).toLocaleDateString(),
																									],
																								}),
																							],
																						}),
																						((v =
																							i == null ? void 0 : i.user) ==
																						null
																							? void 0
																							: v.id) &&
																							((k =
																								s == null
																									? void 0
																									: s.userId) == null
																								? void 0
																								: k._id) === i.user.id &&
																							e.jsxs("ul", {
																								className: "books__actions",
																								children: [
																									e.jsx("li", {
																										children: e.jsx("button", {
																											type: "button",
																											className:
																												"books__icon-btn",
																											onClick: (l) => {
																												l.preventDefault(),
																													l.stopPropagation(),
																													p(
																														`/modifier-histoire/${s._id}`,
																													);
																											},
																											title: "Modifier",
																											"aria-label":
																												"Modifier l'histoire",
																											children: e.jsx(w, {}),
																										}),
																									}),
																									e.jsx("li", {
																										children: e.jsx("button", {
																											type: "button",
																											className:
																												"books__icon-btn delete",
																											onClick: (l) => {
																												l.preventDefault(),
																													l.stopPropagation(),
																													V(s._id);
																											},
																											title: "Supprimer",
																											"aria-label":
																												"Supprimer l'histoire",
																											children: e.jsx(I, {}),
																										}),
																									}),
																								],
																							}),
																					],
																				}),
																			],
																		}),
																	],
																}),
															},
															s._id,
														);
													}),
									}),
								],
							}),
							e.jsxs("aside", {
								className: "profile__aside",
								children: [
									e.jsxs("section", {
										className: "profile__aside-section",
										children: [
											e.jsx("h2", {
												className: "profile__title",
												children: "Auteurs Incontournables",
											}),
											e.jsx("div", {
												className: "profile__authors",
												children: D.filter((s) => {
													var a;
													return (
														s._id !== ((a = i.user) == null ? void 0 : a.id)
													);
												})
													.slice(0, 12)
													.map((s) => {
														var a;
														return e.jsx(
															"div",
															{
																className: "profile__author",
																children: e.jsxs(h, {
																	to: `/profil/${s._id}`,
																	className: "profile__author-link",
																	children: [
																		e.jsx("img", {
																			src: s.image
																				? `http://localhost:5000/assets/img/${s.image.src}`
																				: $,
																			alt:
																				((a = s.image) == null
																					? void 0
																					: a.alt) || "default-image",
																			className: "profile__author-img",
																		}),
																		e.jsx("p", {
																			className: "profile__author-name",
																			children: s.login,
																		}),
																	],
																}),
															},
															s._id,
														);
													}),
											}),
										],
									}),
									e.jsxs("section", {
										className: "profile__aside-section",
										children: [
											e.jsx("h2", {
												className: "profile__title",
												children: "Histoires recommandées",
											}),
											e.jsx("div", {
												className: "profile__new-books",
												children: L.slice(0, 12).map((s) => {
													var a, r;
													return e.jsx(
														"div",
														{
															className: "profile__new-book",
															children: e.jsxs(h, {
																to: `/histoire/${s._id}`,
																className: "profile__new-book-link",
																children: [
																	e.jsx("img", {
																		className: "profile__new-book-img",
																		src:
																			(a = s.image) != null && a.src
																				? `http://localhost:5000/assets/img/${s.image.src}`
																				: y,
																		alt:
																			((r = s.image) == null
																				? void 0
																				: r.alt) || "Image par défaut",
																	}),
																	e.jsx("p", {
																		className: "profile__new-book-title",
																		children: s.title,
																	}),
																],
															}),
														},
														s._id,
													);
												}),
											}),
										],
									}),
								],
							}),
						],
					}),
				],
			})
		);
	};
export { W as default };
