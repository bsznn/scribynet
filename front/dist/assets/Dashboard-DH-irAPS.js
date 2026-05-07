import {
	u as $,
	k as A,
	n as ae,
	H as D,
	j as e,
	a as ee,
	m as F,
	f as ie,
	t as k,
	B as L,
	G as M,
	r as n,
	T as R,
	E as se,
	L as T,
	o as te,
	S as U,
	b as v,
	l as z,
} from "./index-DV15eqUG.js"; /**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const ne = [
		["path", { d: "M5 21v-6", key: "1hz6c0" }],
		["path", { d: "M12 21V3", key: "1lcnhd" }],
		["path", { d: "M19 21V9", key: "unv183" }],
	],
	re = A("chart-no-axes-column", ne); /**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const le = [
		["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
		["path", { d: "M12 6v6l4 2", key: "mmk7yg" }],
	],
	G = A("clock", le); /**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ce = [
		["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }],
		["circle", { cx: "19", cy: "12", r: "1", key: "1wjl8i" }],
		["circle", { cx: "5", cy: "12", r: "1", key: "1pcz8c" }],
	],
	de = A("ellipsis", ce); /**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const oe = [
		[
			"path",
			{
				d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
				key: "18887p",
			},
		],
	],
	B = A("message-square", oe); /**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const he = [
		[
			"path",
			{
				d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
				key: "oel41y",
			},
		],
		["path", { d: "M6.376 18.91a6 6 0 0 1 11.249.003", key: "hnjrf2" }],
		["circle", { cx: "12", cy: "11", r: "4", key: "1gt34v" }],
	],
	K = A("shield-user", he); /**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const me = [
		[
			"path",
			{
				d: "M13.172 2a2 2 0 0 1 1.414.586l6.71 6.71a2.4 2.4 0 0 1 0 3.408l-4.592 4.592a2.4 2.4 0 0 1-3.408 0l-6.71-6.71A2 2 0 0 1 6 9.172V3a1 1 0 0 1 1-1z",
				key: "16rjxf",
			},
		],
		[
			"path",
			{
				d: "M2 7v6.172a2 2 0 0 0 .586 1.414l6.71 6.71a2.4 2.4 0 0 0 3.191.193",
				key: "178nd4",
			},
		],
		[
			"circle",
			{ cx: "10.5", cy: "6.5", r: ".5", fill: "currentColor", key: "12ikhr" },
		],
	],
	X = A("tags", me); /**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ue = [
		["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
		["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
		["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
		["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
	],
	J = A("users", ue);
function pe() {
	const { user: a } = $(),
		[c, m] = n.useState([]),
		[x, g] = n.useState([]),
		[u, r] = n.useState(!0),
		[h, t] = n.useState("sent");
	n.useEffect(() => {
		Promise.all([
			v.get(`http://localhost:5000/books/my-book/${a.id}`, { headers: k() }),
			v.get("http://localhost:5000/books"),
		])
			.then(([d, l]) => {
				m(Array.isArray(d.data) ? d.data : []),
					g(Array.isArray(l.data) ? l.data : []);
			})
			.catch(() => {})
			.finally(() => r(!1));
	}, [a.id]);
	const i = x.flatMap((d) =>
			(d.comments || [])
				.filter((l) => {
					var b;
					const _ = ((b = l.userId) == null ? void 0 : b._id) || l.userId;
					return String(_) === String(a.id);
				})
				.map((l) => ({
					...l,
					bookTitle: d.title,
					bookId: d._id,
					answers: l.answers || [],
				})),
		),
		s = c.flatMap((d) =>
			(d.comments || [])
				.filter((l) => {
					var b;
					const _ = ((b = l.userId) == null ? void 0 : b._id) || l.userId;
					return String(_) !== String(a.id);
				})
				.map((l) => ({
					...l,
					bookTitle: d.title,
					bookId: d._id,
					answers: l.answers || [],
				})),
		),
		p = h === "sent" ? i : s;
	return u
		? e.jsx("div", { className: "dash-loader", children: "Chargement…" })
		: e.jsxs("div", {
				children: [
					e.jsx("h3", {
						className: "dash-section__title",
						children: "Commentaires",
					}),
					e.jsxs("div", {
						className: "dash-tabs",
						children: [
							e.jsxs("button", {
								type: "button",
								className: `dash-tab ${h === "sent" ? "dash-tab--active" : ""}`,
								onClick: () => t("sent"),
								children: ["Envoyés (", i.length, ")"],
							}),
							e.jsxs("button", {
								type: "button",
								className: `dash-tab ${h === "received" ? "dash-tab--active" : ""}`,
								onClick: () => t("received"),
								children: ["Reçus (", s.length, ")"],
							}),
						],
					}),
					p.length === 0
						? e.jsxs("div", {
								className: "dash-empty",
								children: [
									e.jsx(B, { className: "dash-empty__icon" }),
									e.jsxs("span", {
										children: [
											"Aucun commentaire ",
											h === "sent" ? "envoyé" : "reçu",
										],
									}),
								],
							})
						: e.jsx("div", {
								className: "dash-list",
								children: p.map((d) => {
									var l;
									return e.jsxs(
										"div",
										{
											className: "dash-comment",
											children: [
												e.jsxs("p", {
													className: "dash-comment__book",
													children: ["Histoire : ", d.bookTitle],
												}),
												h === "received" &&
													((l = d.userId) == null ? void 0 : l.login) &&
													e.jsxs("p", {
														className: "dash-comment__meta",
														children: [
															"Par ",
															e.jsx("strong", { children: d.userId.login }),
														],
													}),
												e.jsx("p", {
													className: "dash-comment__content",
													children: d.content,
												}),
												e.jsxs("span", {
													className: "dash-comment__meta",
													children: [
														new Date(d.date).toLocaleDateString(),
														" à",
														" ",
														new Date(d.date).toLocaleTimeString(),
													],
												}),
												d.answers.length > 0 &&
													e.jsxs("div", {
														style: {
															marginTop: "0.6rem",
															paddingLeft: "1rem",
															borderLeft: "2px solid var(--mediumBeige)",
														},
														children: [
															e.jsxs("p", {
																style: {
																	fontSize: "0.72rem",
																	color: "var(--mediumMarron)",
																	textTransform: "uppercase",
																	letterSpacing: "0.06em",
																	marginBottom: "0.4rem",
																},
																children: [
																	d.answers.length,
																	" réponse",
																	d.answers.length > 1 ? "s" : "",
																],
															}),
															d.answers.map((_) => {
																var b;
																return e.jsxs(
																	"div",
																	{
																		style: { marginBottom: "0.5rem" },
																		children: [
																			e.jsxs("p", {
																				style: {
																					fontSize: "0.82rem",
																					color: "var(--darkMarron)",
																				},
																				children: [
																					e.jsx("strong", {
																						children:
																							((b = _.userId) == null
																								? void 0
																								: b.login) || "Utilisateur",
																					}),
																					" —",
																					" ",
																					_.content,
																				],
																			}),
																			e.jsx("span", {
																				style: {
																					fontSize: "0.72rem",
																					color: "var(--mediumMarron)",
																				},
																				children: new Date(
																					_.date,
																				).toLocaleDateString(),
																			}),
																		],
																	},
																	_._id,
																);
															}),
														],
													}),
											],
										},
										d._id,
									);
								}),
							}),
				],
			});
}
function q() {
	const { user: a } = $(),
		[c, m] = n.useState([]),
		[x, g] = n.useState(!0),
		u = ee(),
		r = () => {
			v.get(`http://localhost:5000/books/my-book/${a.id}`, { headers: k() })
				.then((t) => m(Array.isArray(t.data) ? t.data : []))
				.catch(() => m([]))
				.finally(() => g(!1));
		};
	n.useEffect(() => {
		r();
	}, [a.id]);
	const h = (t) => {
		window.confirm("Supprimer cette histoire ?") &&
			v
				.delete(`http://localhost:5000/books/delete/${t}/${a.id}`, {
					headers: k(),
				})
				.then(() => m((i) => i.filter((s) => s._id !== t)))
				.catch(() => alert("Impossible de supprimer l'histoire"));
	};
	return x
		? e.jsx("div", { className: "dash-loader", children: "Chargement…" })
		: e.jsxs("div", {
				children: [
					e.jsxs("div", {
						style: {
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							marginBottom: "1.5rem",
						},
						children: [
							e.jsx("h3", {
								className: "dash-section__title",
								children: "Mes histoires",
							}),
							e.jsx(T, {
								to: "/publier-histoire",
								className: "dash-btn dash-btn--primary",
								children: "+ Nouvelle histoire",
							}),
						],
					}),
					c.length === 0
						? e.jsxs("div", {
								className: "dash-empty",
								children: [
									e.jsx(L, { className: "dash-empty__icon" }),
									e.jsx("span", {
										children: "Vous n'avez pas encore publié d'histoire",
									}),
								],
							})
						: e.jsx("div", {
								className: "dash-list",
								children: c.map((t) => {
									var i, s, p, d;
									return e.jsxs(
										"div",
										{
											className: "dash-book",
											children: [
												e.jsx("img", {
													className: "dash-book__image",
													src:
														(i = t.image) != null && i.src
															? `http://localhost:5000/assets/img/${t.image.src}`
															: z,
													alt:
														((s = t.image) == null ? void 0 : s.alt) || t.title,
												}),
												e.jsxs("div", {
													className: "dash-book__info",
													children: [
														e.jsx("p", {
															className: "dash-book__title",
															children: t.title,
														}),
														e.jsxs("p", {
															className: "dash-book__meta",
															children: [
																((p = t.chapters) == null
																	? void 0
																	: p.length) || 0,
																" chapitre(s) —",
																" ",
																(d = t.categoryId) == null
																	? void 0
																	: d.map((l) => `#${l.name}`).join(" "),
															],
														}),
													],
												}),
												e.jsxs("div", {
													className: "dash-book__actions",
													children: [
														e.jsx("button", {
															type: "button",
															className:
																"dash-btn dash-btn--secondary dash-btn--icon",
															title: "Modifier",
															onClick: () => u(`/modifier-histoire/${t._id}`),
															children: e.jsx(U, {}),
														}),
														e.jsx("button", {
															type: "button",
															className:
																"dash-btn dash-btn--danger dash-btn--icon",
															title: "Supprimer",
															onClick: () => h(t._id),
															children: e.jsx(R, {}),
														}),
													],
												}),
											],
										},
										t._id,
									);
								}),
							}),
				],
			});
}
function xe() {
	const { user: a } = $(),
		[c, m] = n.useState([]),
		[x, g] = n.useState(!0);
	n.useEffect(() => {
		v.get(`http://localhost:5000/books/my-book/${a.id}`, { headers: k() })
			.then((t) => m(Array.isArray(t.data) ? t.data : []))
			.catch(() => m([]))
			.finally(() => g(!1));
	}, [a.id]);
	const u = c.reduce((t, i) => t + (i.views || 0), 0),
		r = c.reduce((t, i) => {
			var s;
			return t + (((s = i.likes) == null ? void 0 : s.length) || 0);
		}, 0),
		h = c.reduce((t, i) => {
			var s;
			return t + (((s = i.comments) == null ? void 0 : s.length) || 0);
		}, 0);
	return x
		? e.jsx("div", { className: "dash-loader", children: "Chargement…" })
		: e.jsxs("div", {
				children: [
					e.jsx("h3", {
						className: "dash-section__title",
						children: "Statistiques",
					}),
					e.jsxs("div", {
						className: "dash-stats__grid",
						children: [
							e.jsxs("div", {
								className: "dash-stat-card",
								children: [
									e.jsx("div", {
										className: "dash-stat-card__icon",
										children: e.jsx(L, {}),
									}),
									e.jsx("span", {
										className: "dash-stat-card__value",
										children: c.length,
									}),
									e.jsx("span", {
										className: "dash-stat-card__label",
										children: "Histoires",
									}),
								],
							}),
							e.jsxs("div", {
								className: "dash-stat-card",
								children: [
									e.jsx("div", {
										className: "dash-stat-card__icon",
										children: e.jsx(se, {}),
									}),
									e.jsx("span", {
										className: "dash-stat-card__value",
										children: u,
									}),
									e.jsx("span", {
										className: "dash-stat-card__label",
										children: "Vues totales",
									}),
								],
							}),
							e.jsxs("div", {
								className: "dash-stat-card",
								children: [
									e.jsx("div", {
										className: "dash-stat-card__icon",
										children: e.jsx(D, {}),
									}),
									e.jsx("span", {
										className: "dash-stat-card__value",
										children: r,
									}),
									e.jsx("span", {
										className: "dash-stat-card__label",
										children: "Likes totaux",
									}),
								],
							}),
							e.jsxs("div", {
								className: "dash-stat-card",
								children: [
									e.jsx("div", {
										className: "dash-stat-card__icon",
										children: e.jsx(B, {}),
									}),
									e.jsx("span", {
										className: "dash-stat-card__value",
										children: h,
									}),
									e.jsx("span", {
										className: "dash-stat-card__label",
										children: "Commentaires totaux",
									}),
								],
							}),
						],
					}),
					e.jsx("h4", {
						className: "dash-section__subtitle",
						children: "Détail par histoire",
					}),
					c.length === 0
						? e.jsxs("div", {
								className: "dash-empty",
								children: [
									e.jsx(L, { className: "dash-empty__icon" }),
									e.jsx("span", { children: "Aucune histoire publiée" }),
								],
							})
						: e.jsx("div", {
								className: "dash-table__wrapper",
								children: e.jsxs("table", {
									className: "dash-table",
									children: [
										e.jsx("thead", {
											children: e.jsxs("tr", {
												children: [
													e.jsx("th", { children: "Histoire" }),
													e.jsx("th", { children: "Vues" }),
													e.jsx("th", { children: "Likes" }),
													e.jsx("th", { children: "Commentaires" }),
												],
											}),
										}),
										e.jsx("tbody", {
											children: c.map((t) => {
												var i, s, p;
												return e.jsxs(
													"tr",
													{
														children: [
															e.jsx("td", {
																children: e.jsxs("div", {
																	style: {
																		display: "flex",
																		alignItems: "center",
																		gap: "0.7rem",
																	},
																	children: [
																		e.jsx("img", {
																			src:
																				(i = t.image) != null && i.src
																					? `http://localhost:5000/assets/img/${t.image.src}`
																					: z,
																			alt: t.title,
																			style: {
																				width: 32,
																				height: 44,
																				objectFit: "cover",
																				borderRadius: 4,
																			},
																		}),
																		e.jsx("span", { children: t.title }),
																	],
																}),
															}),
															e.jsx("td", { children: t.views || 0 }),
															e.jsx("td", {
																children:
																	((s = t.likes) == null ? void 0 : s.length) ||
																	0,
															}),
															e.jsx("td", {
																children:
																	((p = t.comments) == null
																		? void 0
																		: p.length) || 0,
															}),
														],
													},
													t._id,
												);
											}),
										}),
									],
								}),
							}),
				],
			});
}
function ge() {
	const { user: a } = $(),
		[c, m] = n.useState([]),
		[x, g] = n.useState(!0);
	return (
		n.useEffect(() => {
			v.get("http://localhost:5000/books/", { headers: k() })
				.then((u) => {
					const h = (Array.isArray(u.data) ? u.data : []).filter((t) => {
						var i;
						return (i = t.likes) == null
							? void 0
							: i.some((s) => s.toString() === a.id || s === a.id);
					});
					m(h);
				})
				.catch(() => m([]))
				.finally(() => g(!1));
		}, [a.id]),
		x
			? e.jsx("div", { className: "dash-loader", children: "Chargement…" })
			: e.jsxs("div", {
					children: [
						e.jsx("h3", {
							className: "dash-section__title",
							children: "Livres aimés",
						}),
						c.length === 0
							? e.jsxs("div", {
									className: "dash-empty",
									children: [
										e.jsx(D, { className: "dash-empty__icon" }),
										e.jsx("span", {
											children: "Vous n'avez encore liké aucune histoire",
										}),
									],
								})
							: e.jsx("div", {
									className: "dash-list",
									children: c.map((u) => {
										var r, h, t;
										return e.jsx(
											T,
											{
												to: `/histoire/${u._id}`,
												style: { textDecoration: "none" },
												children: e.jsxs("div", {
													className: "dash-book",
													children: [
														e.jsx("img", {
															className: "dash-book__image",
															src:
																(r = u.image) != null && r.src
																	? `http://localhost:5000/assets/img/${u.image.src}`
																	: z,
															alt: u.title,
														}),
														e.jsxs("div", {
															className: "dash-book__info",
															children: [
																e.jsx("p", {
																	className: "dash-book__title",
																	children: u.title,
																}),
																e.jsxs("p", {
																	className: "dash-book__meta",
																	children: [
																		"Par ",
																		((h = u.userId) == null
																			? void 0
																			: h.login) || "Auteur inconnu",
																		" —",
																		" ",
																		((t = u.likes) == null
																			? void 0
																			: t.length) || 0,
																		" likes",
																	],
																}),
															],
														}),
														e.jsx(D, {
															style: { color: "var(--orange)", flexShrink: 0 },
														}),
													],
												}),
											},
											u._id,
										);
									}),
								}),
					],
				})
	);
}
function je() {
	const { user: a } = $(),
		[c, m] = n.useState([]),
		[x, g] = n.useState(!0);
	n.useEffect(() => {
		v.get(`http://localhost:5000/gifts/sent/${a.id}`, { headers: k() })
			.then((r) => m(Array.isArray(r.data) ? r.data : []))
			.catch(() => m([]))
			.finally(() => g(!1));
	}, [a.id]);
	const u = c
		.filter((r) => r.isValidated)
		.reduce((r, h) => r + (h.price || 0), 0);
	return x
		? e.jsx("div", { className: "dash-loader", children: "Chargement…" })
		: e.jsxs("div", {
				children: [
					e.jsxs("div", {
						style: {
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							marginBottom: "1.5rem",
						},
						children: [
							e.jsx("h3", {
								className: "dash-section__title",
								children: "Mes dons",
							}),
							e.jsx(T, {
								to: "/faire-don",
								className: "dash-btn dash-btn--primary",
								children: "Faire un don",
							}),
						],
					}),
					c.length > 0 &&
						e.jsxs("div", {
							className: "dash-stat-card",
							style: { marginBottom: "1.5rem", maxWidth: 220 },
							children: [
								e.jsx("div", {
									className: "dash-stat-card__icon",
									children: e.jsx(M, {}),
								}),
								e.jsxs("span", {
									className: "dash-stat-card__value",
									children: [u.toFixed(2), " €"],
								}),
								e.jsx("span", {
									className: "dash-stat-card__label",
									children: "Total donné",
								}),
							],
						}),
					c.length === 0
						? e.jsxs("div", {
								className: "dash-empty",
								children: [
									e.jsx(M, { className: "dash-empty__icon" }),
									e.jsx("span", {
										children: "Vous n'avez encore effectué aucun don",
									}),
								],
							})
						: e.jsx("div", {
								className: "dash-list",
								children: c.map((r) => {
									var h;
									return e.jsxs(
										"div",
										{
											className: "dash-don",
											children: [
												e.jsxs("div", {
													children: [
														e.jsxs("p", {
															className: "dash-don__amount",
															children: [
																(h = r.price) == null ? void 0 : h.toFixed(2),
																" €",
															],
														}),
														r.content &&
															e.jsxs("p", {
																className: "dash-don__info",
																children: ['"', r.content, '"'],
															}),
														e.jsxs("p", {
															className: "dash-don__info",
															children: [
																new Date(r.createdAt).toLocaleDateString(),
																" à",
																" ",
																new Date(r.createdAt).toLocaleTimeString(),
															],
														}),
													],
												}),
												e.jsx("span", {
													className: `dash-don__status ${r.isValidated ? "dash-don__status--validated" : "dash-don__status--pending"}`,
													children: r.isValidated ? "Validé" : "En attente",
												}),
											],
										},
										r._id,
									);
								}),
							}),
				],
			});
}
function _e() {
	const { user: a } = $(),
		[c, m] = n.useState([]),
		[x, g] = n.useState(!0);
	n.useEffect(() => {
		Promise.all([
			v
				.get(`http://localhost:5000/books/my-book/${a.id}`, { headers: k() })
				.catch(() => ({ data: [] })),
			v
				.get("http://localhost:5000/books/", { headers: k() })
				.catch(() => ({ data: [] })),
			v
				.get(`http://localhost:5000/gifts/sent/${a.id}`, { headers: k() })
				.catch(() => ({ data: [] })),
		])
			.then(([r, h, t]) => {
				const i = Array.isArray(r.data) ? r.data : [],
					s = Array.isArray(h.data) ? h.data : [],
					p = Array.isArray(t.data) ? t.data : [],
					d = [];
				i.forEach((l) => {
					d.push({
						id: `book-${l._id}`,
						type: "book",
						icon: L,
						label: `Histoire publiée : ${l.title}`,
						date: new Date(l.createdAt),
					});
				}),
					s.forEach((l) => {
						(l.comments || [])
							.filter((_) => {
								var b;
								return (
									((b = _.userId) == null ? void 0 : b._id) === a.id ||
									_.userId === a.id
								);
							})
							.forEach((_) => {
								d.push({
									id: `comment-${_._id}`,
									type: "comment",
									icon: B,
									label: `Commentaire sur "${l.title}"`,
									date: new Date(_.date),
								});
							});
					}),
					p
						.filter((l) => l.isValidated)
						.forEach((l) => {
							var _;
							d.push({
								id: `don-${l._id}`,
								type: "don",
								icon: M,
								label: `Don de ${((_ = l.price)) == null ? void 0 : _.toFixed(2)} €`,
								date: new Date(l.createdAt),
							});
						}),
					d.sort((l, _) => _.date - l.date),
					m(d);
			})
			.finally(() => g(!1));
	}, [a.id]);
	const u = {
		book: "var(--darkMarron)",
		comment: "var(--mediumMarron)",
		don: "var(--orange)",
	};
	return x
		? e.jsx("div", { className: "dash-loader", children: "Chargement…" })
		: e.jsxs("div", {
				children: [
					e.jsx("h3", {
						className: "dash-section__title",
						children: "Historique d'activité",
					}),
					c.length === 0
						? e.jsxs("div", {
								className: "dash-empty",
								children: [
									e.jsx(G, { className: "dash-empty__icon" }),
									e.jsx("span", { children: "Aucune activité enregistrée" }),
								],
							})
						: e.jsx("div", {
								className: "dash-table__wrapper",
								children: e.jsxs("table", {
									className: "dash-table",
									children: [
										e.jsx("thead", {
											children: e.jsxs("tr", {
												children: [
													e.jsx("th", { children: "Type" }),
													e.jsx("th", { children: "Activité" }),
													e.jsx("th", { children: "Date" }),
												],
											}),
										}),
										e.jsx("tbody", {
											children: c.map((r) => {
												const h = r.icon;
												return e.jsxs(
													"tr",
													{
														children: [
															e.jsx("td", {
																children: e.jsx(h, {
																	style: { color: u[r.type], fontSize: "1rem" },
																}),
															}),
															e.jsx("td", { children: r.label }),
															e.jsxs("td", {
																style: {
																	whiteSpace: "nowrap",
																	color: "var(--mediumMarron)",
																	fontSize: "0.82rem",
																},
																children: [
																	r.date.toLocaleDateString(),
																	" ",
																	r.date.toLocaleTimeString(),
																],
															}),
														],
													},
													r.id,
												);
											}),
										}),
									],
								}),
							}),
				],
			});
}
function fe() {
	var f;
	const { user: a, login: c } = $(),
		[m, x] = n.useState({ login: "", email: "", description: "" }),
		[g, u] = n.useState(null),
		[r, h] = n.useState(null),
		[t, i] = n.useState(""),
		[s, p] = n.useState(""),
		[d, l] = n.useState(!1);
	n.useEffect(() => {
		v.get(`http://localhost:5000/users/${a.id}`, { headers: k() })
			.then((j) => {
				x({
					login: j.data.login || "",
					email: j.data.email || "",
					description: j.data.description || "",
				});
			})
			.catch(() => {});
	}, [a.id]);
	const _ =
			(f = a == null ? void 0 : a.image) != null &&
			f.src &&
			a.image.src !== "default-profil.png"
				? `http://localhost:5000/assets/img/${a.image.src}`
				: F,
		b = (j) => {
			const N = j.target.files[0];
			N && (u(N), h(URL.createObjectURL(N)));
		},
		C = async () => {
			var N, I;
			p(""), i(""), l(!0);
			const j = new FormData();
			m.login.trim() && j.append("login", m.login),
				m.email.trim() && j.append("email", m.email),
				m.description.trim() && j.append("description", m.description),
				g && j.append("image", g);
			try {
				const w = await v.put(`http://localhost:5000/users/edit/${a.id}`, j, {
					headers: { ...k() },
				});
				c({
					...a,
					login: w.data.login,
					description: w.data.description,
					image: w.data.image,
				}),
					i("Profil mis à jour avec succès !");
			} catch (w) {
				p(
					((I = (N = w.response) == null ? void 0 : N.data) == null
						? void 0
						: I.message) || "Erreur lors de la mise à jour",
				);
			} finally {
				l(!1);
			}
		};
	return e.jsxs("div", {
		children: [
			e.jsx("h3", {
				className: "dash-section__title",
				children: "Paramètres du profil",
			}),
			e.jsxs("div", {
				style: {
					display: "flex",
					alignItems: "center",
					gap: "1.2rem",
					marginBottom: "1.8rem",
				},
				children: [
					e.jsx("img", {
						src: r || _,
						alt: "Avatar",
						style: {
							width: 72,
							height: 72,
							borderRadius: "50%",
							objectFit: "cover",
							border: "2px solid var(--mediumBeige)",
						},
					}),
					e.jsxs("label", {
						className: "dash-btn dash-btn--secondary",
						style: { cursor: "pointer" },
						children: [
							"Changer la photo",
							e.jsx("input", {
								type: "file",
								accept: "image/*",
								style: { display: "none" },
								onChange: b,
							}),
						],
					}),
				],
			}),
			e.jsxs("div", {
				className: "dash-form",
				children: [
					e.jsxs("div", {
						className: "dash-form__group",
						children: [
							e.jsx("label", {
								className: "dash-form__label",
								children: "Nom d'utilisateur",
							}),
							e.jsx("input", {
								className: "dash-form__input",
								type: "text",
								value: m.login,
								onChange: (j) => x({ ...m, login: j.target.value }),
							}),
						],
					}),
					e.jsxs("div", {
						className: "dash-form__group",
						children: [
							e.jsx("label", {
								className: "dash-form__label",
								children: "Email",
							}),
							e.jsx("input", {
								className: "dash-form__input",
								type: "email",
								value: m.email,
								onChange: (j) => x({ ...m, email: j.target.value }),
							}),
						],
					}),
					e.jsxs("div", {
						className: "dash-form__group",
						children: [
							e.jsx("label", {
								className: "dash-form__label",
								children: "Description",
							}),
							e.jsx("textarea", {
								className: "dash-form__textarea",
								value: m.description,
								onChange: (j) => x({ ...m, description: j.target.value }),
							}),
						],
					}),
					s &&
						e.jsx("p", {
							style: { color: "var(--orange)", fontSize: "0.85rem" },
							children: s,
						}),
					t &&
						e.jsx("p", {
							style: { color: "var(--mediumMarron)", fontSize: "0.85rem" },
							children: t,
						}),
					e.jsx("button", {
						type: "button",
						className: "dash-btn dash-btn--primary dash-btn-settings",
						onClick: C,
						disabled: d,
						children: d ? "Enregistrement…" : "Enregistrer",
					}),
				],
			}),
		],
	});
}
function ye({ src: a, alt: c }) {
	return a
		? e.jsx("img", {
				src: a,
				alt: c,
				style: {
					width: "100%",
					height: "80px",
					objectFit: "cover",
					borderRadius: "6px",
					marginTop: "0.4rem",
					border: "1px solid var(--mediumBeige)",
				},
			})
		: null;
}
function ve() {
	const [a, c] = n.useState([]),
		[m, x] = n.useState(!0),
		[g, u] = n.useState({ name: "" }),
		[r, h] = n.useState(null),
		[t, i] = n.useState(null),
		s = n.useRef(null),
		[p, d] = n.useState(null),
		[l, _] = n.useState({ name: "" }),
		[b, C] = n.useState(null),
		[f, j] = n.useState(null),
		N = n.useRef(null),
		I = () => {
			v.get("http://localhost:5000/categories", { headers: k() })
				.then((o) => c(Array.isArray(o.data) ? o.data : []))
				.catch(() => c([]))
				.finally(() => x(!1));
		};
	n.useEffect(() => {
		I();
	}, []);
	const w = (o) => {
			const y = o.target.files[0];
			y && (h(y), i(URL.createObjectURL(y)));
		},
		Q = (o) => {
			const y = o.target.files[0];
			y && (C(y), j(URL.createObjectURL(y)));
		},
		V = async () => {
			if (!g.name.trim()) return alert("Le nom de la catégorie est requis.");
			const o = new FormData();
			o.append("name", g.name), r && o.append("image", r);
			try {
				await v.post("http://localhost:5000/categories/new", o, {
					headers: k(),
				}),
					u({ name: "" }),
					h(null),
					i(null),
					s.current && (s.current.value = ""),
					alert("Catégorie ajoutée avec succès !"),
					I();
			} catch {
				alert("Impossible d'ajouter la catégorie.");
			}
		},
		Y = async (o, y) => {
			if (
				window.confirm(
					`Supprimer la catégorie "${y}" ? Cette action est irréversible.`,
				)
			)
				try {
					await v.delete(`http://localhost:5000/categories/delete/${o}`, {
						headers: k(),
					}),
						c((E) => E.filter((S) => S._id !== o)),
						alert(`Catégorie "${y}" supprimée.`);
				} catch {
					alert("Impossible de supprimer cette catégorie.");
				}
		},
		Z = (o) => {
			var y;
			d(o._id),
				_({ name: o.name }),
				C(null),
				j(
					(y = o.image) != null && y.src
						? `http://localhost:5000/assets/img/${o.image.src}`
						: null,
				);
		},
		P = async (o) => {
			if (!l.name.trim()) return alert("Le nom ne peut pas être vide.");
			const y = new FormData();
			y.append("name", l.name), b && y.append("image", b);
			try {
				await v.put(`http://localhost:5000/categories/edit/${o}`, y, {
					headers: k(),
				}),
					d(null),
					C(null),
					j(null),
					N.current && (N.current.value = ""),
					alert("Catégorie modifiée avec succès !"),
					I();
			} catch {
				alert("Impossible de modifier cette catégorie.");
			}
		},
		H = () => {
			d(null), C(null), j(null);
		};
	return m
		? e.jsx("div", { className: "dash-loader", children: "Chargement…" })
		: e.jsxs("div", {
				children: [
					e.jsx("h3", {
						className: "dash-section__title",
						children: "Catégories",
					}),
					e.jsxs("div", {
						className: "dash-card",
						style: { marginBottom: "2rem" },
						children: [
							e.jsx("h4", {
								className: "dash-section__subtitle",
								style: { marginTop: 0 },
								children: "Ajouter une catégorie",
							}),
							e.jsxs("div", {
								style: {
									display: "flex",
									gap: "1rem",
									flexWrap: "wrap",
									alignItems: "flex-end",
								},
								children: [
									e.jsxs("div", {
										className: "dash-form__group",
										style: { flex: 1, minWidth: 180 },
										children: [
											e.jsx("label", {
												className: "dash-form__label",
												children: "Nom",
											}),
											e.jsx("input", {
												className: "dash-form__input",
												value: g.name,
												onChange: (o) => u({ name: o.target.value }),
												onKeyDown: (o) => o.key === "Enter" && V(),
												placeholder: "Nom de la catégorie",
											}),
										],
									}),
									e.jsxs("div", {
										className: "dash-form__group",
										style: { minWidth: 160 },
										children: [
											e.jsx("label", {
												className: "dash-form__label",
												children: "Image (optionnelle)",
											}),
											e.jsx("input", {
												ref: s,
												type: "file",
												accept: "image/*",
												style: {
													fontSize: "0.8rem",
													color: "var(--mediumMarron)",
												},
												onChange: w,
											}),
											e.jsx(ye, { src: t, alt: "aperçu" }),
										],
									}),
									e.jsx("button", {
										type: "button",
										className: "dash-btn dash-btn--primary",
										onClick: V,
										children: "Ajouter",
									}),
								],
							}),
						],
					}),
					a.length === 0
						? e.jsxs("div", {
								className: "dash-empty",
								children: [
									e.jsx(X, { className: "dash-empty__icon" }),
									e.jsx("span", { children: "Aucune catégorie" }),
								],
							})
						: e.jsx("div", {
								className: "dash-categories__grid",
								children: a.map((o) => {
									var y, E;
									return e.jsxs(
										"div",
										{
											className: "dash-category-card",
											children: [
												p === o._id
													? e.jsxs("div", {
															style: { position: "relative" },
															children: [
																f
																	? e.jsx("img", {
																			src: f,
																			alt: "aperçu",
																			className: "dash-category-card__img",
																			style: { cursor: "pointer" },
																			title: "Cliquer pour changer l'image",
																			onClick: () => {
																				var S;
																				return (S = N.current) == null
																					? void 0
																					: S.click();
																			},
																		})
																	: e.jsx("div", {
																			style: {
																				height: "85px",
																				display: "flex",
																				alignItems: "center",
																				justifyContent: "center",
																				background: "var(--mediumBeige)",
																				cursor: "pointer",
																				fontSize: "0.78rem",
																				color: "var(--mediumMarron)",
																			},
																			onClick: () => {
																				var S;
																				return (S = N.current) == null
																					? void 0
																					: S.click();
																			},
																			children: "+ Ajouter une image",
																		}),
																e.jsx("span", {
																	onClick: () => {
																		var S;
																		return (S = N.current) == null
																			? void 0
																			: S.click();
																	},
																	style: {
																		position: "absolute",
																		bottom: "6px",
																		right: "6px",
																		background: "rgba(66,60,57,0.75)",
																		color: "#fff",
																		fontSize: "0.65rem",
																		padding: "0.2rem 0.5rem",
																		borderRadius: "6px",
																		cursor: "pointer",
																	},
																	children: "Changer",
																}),
																e.jsx("input", {
																	ref: N,
																	type: "file",
																	accept: "image/*",
																	style: { display: "none" },
																	onChange: Q,
																}),
															],
														})
													: e.jsx("img", {
															className: "dash-category-card__img",
															src:
																(y = o.image) != null && y.src
																	? `http://localhost:5000/assets/img/${o.image.src}`
																	: ae,
															alt:
																((E = o.image) == null ? void 0 : E.alt) ||
																o.name,
														}),
												e.jsxs("div", {
													className: "dash-category-card__body",
													children: [
														p === o._id
															? e.jsx("input", {
																	className: "dash-form__input",
																	style: {
																		fontSize: "0.82rem",
																		padding: "0.3rem 0.5rem",
																		width: "100%",
																	},
																	value: l.name,
																	autoFocus: !0,
																	onChange: (S) => _({ name: S.target.value }),
																	onKeyDown: (S) => {
																		S.key === "Enter" && P(o._id),
																			S.key === "Escape" && H();
																	},
																})
															: e.jsx("span", {
																	className: "dash-category-card__name",
																	children: o.name,
																}),
														e.jsx("div", {
															style: {
																display: "flex",
																gap: "0.3rem",
																flexShrink: 0,
															},
															children:
																p === o._id
																	? e.jsxs(e.Fragment, {
																			children: [
																				e.jsx("button", {
																					type: "button",
																					className:
																						"dash-btn dash-btn--primary dash-btn--icon",
																					onClick: () => P(o._id),
																					title: "Valider",
																					children: "✓",
																				}),
																				e.jsx("button", {
																					type: "button",
																					className:
																						"dash-btn dash-btn--secondary dash-btn--icon",
																					onClick: H,
																					title: "Annuler",
																					children: "✕",
																				}),
																			],
																		})
																	: e.jsxs(e.Fragment, {
																			children: [
																				e.jsx("button", {
																					type: "button",
																					className:
																						"dash-btn dash-btn--secondary dash-btn--icon",
																					onClick: () => Z(o),
																					title: "Modifier",
																					children: e.jsx(U, {}),
																				}),
																				e.jsx("button", {
																					type: "button",
																					className:
																						"dash-btn dash-btn--danger dash-btn--icon",
																					onClick: () => Y(o._id, o.name),
																					title: "Supprimer",
																					children: e.jsx(R, {}),
																				}),
																			],
																		}),
														}),
													],
												}),
											],
										},
										o._id,
									);
								}),
							}),
				],
			});
}
function be() {
	const [a, c] = n.useState([]),
		[m, x] = n.useState(!0),
		[g, u] = n.useState(""),
		r = () => {
			v.get("http://localhost:5000/users", { headers: k() })
				.then((i) => c(Array.isArray(i.data.users) ? i.data.users : []))
				.catch(() => c([]))
				.finally(() => x(!1));
		};
	n.useEffect(() => {
		r();
	}, []);
	const h = async (i) => {
			if (window.confirm("Supprimer cet utilisateur et tous ses livres ?"))
				try {
					await v.delete(`http://localhost:5000/users/delete/${i}`, {
						headers: k(),
					}),
						c((s) => s.filter((p) => p._id !== i));
				} catch {
					alert("Impossible de supprimer l'utilisateur");
				}
		},
		t = a.filter((i) => {
			var s, p;
			return (
				((s = i.login) == null
					? void 0
					: s.toLowerCase().includes(g.toLowerCase())) ||
				((p = i.email) == null
					? void 0
					: p.toLowerCase().includes(g.toLowerCase()))
			);
		});
	return m
		? e.jsx("div", { className: "dash-loader", children: "Chargement…" })
		: e.jsxs("div", {
				children: [
					e.jsxs("div", {
						style: {
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							marginBottom: "1.5rem",
							flexWrap: "wrap",
							gap: "1rem",
						},
						children: [
							e.jsxs("h3", {
								className: "dash-section__title",
								children: ["Utilisateurs (", a.length, ")"],
							}),
							e.jsx("input", {
								className: "dash-form__input",
								style: { maxWidth: 260 },
								placeholder: "Rechercher…",
								value: g,
								onChange: (i) => u(i.target.value),
							}),
						],
					}),
					t.length === 0
						? e.jsxs("div", {
								className: "dash-empty",
								children: [
									e.jsx(J, { className: "dash-empty__icon" }),
									e.jsx("span", { children: "Aucun utilisateur trouvé" }),
								],
							})
						: e.jsx("div", {
								className: "dash-table__wrapper",
								children: e.jsxs("table", {
									className: "dash-table",
									children: [
										e.jsx("thead", {
											children: e.jsxs("tr", {
												children: [
													e.jsx("th", { children: "Utilisateur" }),
													e.jsx("th", { children: "Email" }),
													e.jsx("th", { children: "Rôle" }),
													e.jsx("th", { children: "Actions" }),
												],
											}),
										}),
										e.jsx("tbody", {
											children: t.map((i) => {
												var s;
												return e.jsxs(
													"tr",
													{
														children: [
															e.jsx("td", {
																children: e.jsxs("div", {
																	style: {
																		display: "flex",
																		alignItems: "center",
																		gap: "0.7rem",
																	},
																	children: [
																		e.jsx("img", {
																			className: "dash-user__avatar",
																			src:
																				(s = i.image) != null &&
																				s.src &&
																				i.image.src !== "default-profil.png"
																					? `http://localhost:5000/assets/img/${i.image.src}`
																					: F,
																			alt: i.login,
																		}),
																		e.jsx("span", {
																			className: "dash-user__name",
																			children: i.login,
																		}),
																	],
																}),
															}),
															e.jsx("td", {
																style: {
																	fontSize: "0.82rem",
																	color: "var(--mediumMarron)",
																},
																children: i.email,
															}),
															e.jsx("td", {
																children: e.jsx("span", {
																	className: `dash-tag dash-tag--${i.role === "admin" ? "admin" : "user"}`,
																	children: i.role || "user",
																}),
															}),
															e.jsx("td", {
																children: e.jsx("button", {
																	type: "button",
																	className:
																		"dash-btn dash-btn--danger dash-btn--icon",
																	onClick: () => h(i._id),
																	title: "Supprimer",
																	children: e.jsx(R, {}),
																}),
															}),
														],
													},
													i._id,
												);
											}),
										}),
									],
								}),
							}),
				],
			});
}
function Ne() {
	const [a, c] = n.useState([]),
		[m, x] = n.useState(!0),
		[g, u] = n.useState(null),
		[r, h] = n.useState("");
	n.useEffect(() => {
		v.get("http://localhost:5000/users", { headers: k() })
			.then((s) => c(Array.isArray(s.data.users) ? s.data.users : []))
			.catch(() => c([]))
			.finally(() => x(!1));
	}, []);
	const t = async (s, p) => {
			u(s);
			try {
				await v.put(
					`http://localhost:5000/users/edit-role/${s}`,
					{ role: p },
					{ headers: k() },
				),
					c((d) => d.map((l) => (l._id === s ? { ...l, role: p } : l)));
			} catch {
				alert("Impossible de modifier le rôle");
			} finally {
				u(null);
			}
		},
		i = a.filter((s) => {
			var p;
			return (p = s.login) == null
				? void 0
				: p.toLowerCase().includes(r.toLowerCase());
		});
	return m
		? e.jsx("div", { className: "dash-loader", children: "Chargement…" })
		: e.jsxs("div", {
				children: [
					e.jsxs("div", {
						style: {
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							marginBottom: "1.5rem",
							flexWrap: "wrap",
							gap: "1rem",
						},
						children: [
							e.jsx("h3", {
								className: "dash-section__title",
								children: "Gestion des rôles",
							}),
							e.jsx("input", {
								className: "dash-form__input",
								style: { maxWidth: 260 },
								placeholder: "Rechercher…",
								value: r,
								onChange: (s) => h(s.target.value),
							}),
						],
					}),
					i.length === 0
						? e.jsxs("div", {
								className: "dash-empty",
								children: [
									e.jsx(K, { className: "dash-empty__icon" }),
									e.jsx("span", { children: "Aucun utilisateur trouvé" }),
								],
							})
						: e.jsx("div", {
								className: "dash-table__wrapper",
								children: e.jsxs("table", {
									className: "dash-table",
									children: [
										e.jsx("thead", {
											children: e.jsxs("tr", {
												children: [
													e.jsx("th", { children: "Utilisateur" }),
													e.jsx("th", { children: "Rôle actuel" }),
													e.jsx("th", { children: "Changer le rôle" }),
												],
											}),
										}),
										e.jsx("tbody", {
											children: i.map((s) => {
												var p;
												return e.jsxs(
													"tr",
													{
														children: [
															e.jsx("td", {
																children: e.jsxs("div", {
																	style: {
																		display: "flex",
																		alignItems: "center",
																		gap: "0.7rem",
																	},
																	children: [
																		e.jsx("img", {
																			className: "dash-user__avatar",
																			src:
																				(p = s.image) != null &&
																				p.src &&
																				s.image.src !== "default-profil.png"
																					? `http://localhost:5000/assets/img/${s.image.src}`
																					: F,
																			alt: s.login,
																		}),
																		e.jsx("span", {
																			className: "dash-user__name",
																			children: s.login,
																		}),
																	],
																}),
															}),
															e.jsx("td", {
																children: e.jsx("span", {
																	className: `dash-tag dash-tag--${s.role === "admin" ? "admin" : "user"}`,
																	children: s.role || "user",
																}),
															}),
															e.jsx("td", {
																children: e.jsxs("div", {
																	style: {
																		display: "flex",
																		alignItems: "center",
																		gap: "0.6rem",
																	},
																	children: [
																		e.jsxs("select", {
																			className: "dash-roles__select",
																			value: s.role || "user",
																			onChange: (d) => t(s._id, d.target.value),
																			disabled: g === s._id,
																			children: [
																				e.jsx("option", {
																					value: "user",
																					children: "user",
																				}),
																				e.jsx("option", {
																					value: "admin",
																					children: "admin",
																				}),
																			],
																		}),
																		g === s._id &&
																			e.jsx("span", {
																				style: {
																					fontSize: "0.75rem",
																					color: "var(--mediumMarron)",
																				},
																				children: "Sauvegarde…",
																			}),
																	],
																}),
															}),
														],
													},
													s._id,
												);
											}),
										}),
									],
								}),
							}),
				],
			});
}
const O = [
		{ key: "comments", label: "Commentaires", icon: B },
		{ key: "stories", label: "Histoires", icon: L },
		{ key: "stats", label: "Statistiques", icon: re },
		{ key: "likes", label: "Likes", icon: D },
		{ key: "dons", label: "Mes dons", icon: M },
		{ key: "history", label: "Historique", icon: G },
		{ key: "settings", label: "Paramètres", icon: U },
	],
	ke = [
		{ key: "categories", label: "Catégories", icon: X },
		{ key: "users", label: "Utilisateurs", icon: J },
		{ key: "roles", label: "Rôles", icon: K },
	],
	W = 4;
function Ce() {
	var _, b, C;
	const { user: a } = $(),
		c = (a == null ? void 0 : a.role) === "admin",
		m = te(),
		[x, g] = n.useState(((_ = m.state) == null ? void 0 : _.tab) || "comments"),
		[u, r] = n.useState(!1),
		h = c ? [...O, ...ke] : O,
		t = h.slice(0, W),
		i = h.slice(W),
		s =
			(b = a == null ? void 0 : a.image) != null &&
			b.src &&
			a.image.src !== "default-profil.png"
				? `http://localhost:5000/assets/img/${a.image.src}`
				: F,
		p = (f) => {
			g(f), r(!1);
		},
		d = () => {
			switch (x) {
				case "settings":
					return e.jsx(fe, {});
				case "stories":
					return e.jsx(q, {});
				case "stats":
					return e.jsx(xe, {});
				case "comments":
					return e.jsx(pe, {});
				case "likes":
					return e.jsx(ge, {});
				case "dons":
					return e.jsx(je, {});
				case "history":
					return e.jsx(_e, {});
				case "categories":
					return c ? e.jsx(ve, {}) : null;
				case "users":
					return c ? e.jsx(be, {}) : null;
				case "roles":
					return c ? e.jsx(Ne, {}) : null;
				default:
					return e.jsx(q, {});
			}
		};
	(C = h.find((f) => f.key === x)) != null && C.label;
	const l = i.some((f) => f.key === x);
	return e.jsxs("main", {
		className: "fond__dashboard",
		children: [
			e.jsx("img", {
				src: ie,
				alt: "fond__dashboard",
				fetchPriority: "low",
				decoding: "async",
				className: "fond__dashboard-bg",
			}),
			e.jsx("div", {
				className: "dash",
				children: e.jsxs("div", {
					className: "dash__container",
					children: [
						e.jsxs("aside", {
							className: "dash__sidebar",
							children: [
								e.jsx("div", {
									className: "dash__sidebar-header",
									children: e.jsxs("div", {
										className: "dash__profile",
										children: [
											e.jsx("img", {
												className: "dash__avatar",
												src: s,
												alt: a == null ? void 0 : a.login,
											}),
											e.jsxs("div", {
												className: "dash__profile-info",
												children: [
													e.jsx("span", {
														className: "dash__profile-name",
														children: a == null ? void 0 : a.login,
													}),
													e.jsx("span", {
														className: `dash__badge ${c ? "dash__badge--admin" : "dash__badge--user"}`,
														children: c ? "Admin" : "Membre",
													}),
												],
											}),
										],
									}),
								}),
								e.jsx("nav", {
									className: "dash__nav",
									children: h.map(({ key: f, label: j, icon: N }) =>
										e.jsxs(
											"button",
											{
												type: "button",
												className: `dash__nav-item ${x === f ? "dash__nav-item--active" : ""}`,
												onClick: () => g(f),
												children: [
													e.jsx(N, { className: "dash__nav-icon" }),
													e.jsx("span", { children: j }),
												],
											},
											f,
										),
									),
								}),
							],
						}),
						e.jsx("div", {
							className: "dash__main",
							children: e.jsx("div", {
								className: "dash__content",
								children: d(),
							}),
						}),
						e.jsxs("nav", {
							className: "dash__bottomnav",
							children: [
								t.map(({ key: f, label: j, icon: N }) =>
									e.jsxs(
										"button",
										{
											type: "button",
											className: `dash__bottomnav-item ${x === f ? "dash__bottomnav-item--active" : ""}`,
											onClick: () => p(f),
											children: [e.jsx(N, {}), e.jsx("span", { children: j })],
										},
										f,
									),
								),
								i.length > 0 &&
									e.jsxs("button", {
										type: "button",
										className: `dash__bottomnav-item ${l || u ? "dash__bottomnav-item--active" : ""}`,
										onClick: () => r((f) => !f),
										children: [
											e.jsx(de, {}),
											e.jsx("span", { children: "Plus" }),
										],
									}),
							],
						}),
						u &&
							e.jsxs(e.Fragment, {
								children: [
									e.jsx("div", {
										className: "dash__more-overlay",
										onClick: () => r(!1),
									}),
									e.jsx("div", {
										className: "dash__more-menu",
										children: i.map(({ key: f, label: j, icon: N }) =>
											e.jsxs(
												"button",
												{
													type: "button",
													className: `dash__more-item ${x === f ? "dash__more-item--active" : ""}`,
													onClick: () => p(f),
													children: [
														e.jsx(N, { className: "dash__more-icon" }),
														e.jsx("span", { children: j }),
													],
												},
												f,
											),
										),
									}),
								],
							}),
					],
				}),
			}),
		],
	});
}
export { Ce as default };
