import {
	b as $,
	m as A,
	u as D,
	j as e,
	c as F,
	k as I,
	r as i,
	T as R,
	S as T,
	e as V,
	t as v,
} from "./index-DV15eqUG.js"; /**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const P = [
		["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", key: "miytrc" }],
		["path", { d: "M3 6h18", key: "d0wm0j" }],
		["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", key: "e791ji" }],
	],
	H = I("trash", P),
	K = ({ response: t, messageId: n, onMessageUpdate: d, onDeleteLocal: r }) => {
		var h, y, k, C;
		const c = D(),
			[x, l] = i.useState(!1),
			[m, _] = i.useState(t.content),
			a = t.userId,
			p = typeof t.userId == "object" ? t.userId._id : t.userId,
			j =
				((h = c == null ? void 0 : c.user) == null ? void 0 : h._id) ||
				((y = c == null ? void 0 : c.user) == null ? void 0 : y.id),
			N = String(j) === String(p),
			g = new Date(t.createdAt),
			w = `${g.toLocaleDateString()} à ${g.toLocaleTimeString()}`,
			b = async () => {
				if (window.confirm("Voulez-vous supprimer cette réponse pour vous ?"))
					try {
						const o = await fetch(
								`http://localhost:5000/messages/${n}/responses/${t._id}/deleteForMe`,
								{ method: "DELETE", headers: v() },
							),
							E = await o.json();
						if (!o.ok) throw new Error(E.error);
						r == null || r(t._id);
					} catch (o) {
						console.error(o), alert(o.message);
					}
			},
			S = async () => {
				if (window.confirm("Voulez-vous supprimer cette réponse pour tous ?"))
					try {
						const o = await fetch(
								`http://localhost:5000/messages/${n}/responses/${t._id}/deleteForAll`,
								{ method: "DELETE", headers: v() },
							),
							E = await o.json();
						if (!o.ok) throw new Error(E.error);
						r == null || r(t._id), d == null || d(E.messageData);
					} catch (o) {
						console.error(o), alert(o.message);
					}
			},
			s = async () => {
				try {
					const u = await fetch(
							`http://localhost:5000/messages/${n}/responses/${t._id}`,
							{
								method: "PUT",
								headers: { ...v(), "Content-Type": "application/json" },
								body: JSON.stringify({ content: m }),
							},
						),
						o = await u.json();
					u.ok
						? (alert("Réponse modifiée !"), l(!1), d == null || d(o))
						: alert(o.error);
				} catch (u) {
					console.error(u), alert("Erreur modification");
				}
			},
			f = String(j) === String(p);
		return e.jsxs("div", {
			className: `response ${f ? "response--mine" : "response--theirs"}`,
			children: [
				e.jsxs("div", {
					className: "response__header",
					children: [
						e.jsx("img", {
							src: `http://localhost:5000/assets/img/${((k = a == null ? void 0 : a.image) == null ? void 0 : k.src) || A}`,
							alt:
								((C = a == null ? void 0 : a.image) == null ? void 0 : C.alt) ||
								"Utilisateur",
							className: "response__avatar",
						}),
						e.jsxs("div", {
							className: "response__info",
							children: [
								e.jsx("strong", {
									children: (a == null ? void 0 : a.login) || "Utilisateur",
								}),
								e.jsx("small", { children: w }),
							],
						}),
					],
				}),
				x
					? e.jsxs("div", {
							className: "response__edit-wrapper",
							children: [
								e.jsx("textarea", {
									value: m,
									onChange: (u) => _(u.target.value),
									className: "response__textarea",
								}),
								e.jsxs("div", {
									className: "response__edit-actions",
									children: [
										e.jsx("button", {
											onClick: s,
											className: "btn btn-update",
											children: "Enregistrer",
										}),
										e.jsx("button", {
											onClick: () => l(!1),
											className: "btn btn-cancel",
											children: "Annuler",
										}),
									],
								}),
							],
						})
					: e.jsxs("div", {
							className: "response__bubble",
							children: [
								e.jsx("p", {
									className: "response__content",
									children: t.content,
								}),
								e.jsx("span", { className: "response__time", children: w }),
							],
						}),
				!x &&
					e.jsxs("div", {
						className: "response__actions",
						children: [
							N &&
								e.jsxs(e.Fragment, {
									children: [
										e.jsx("button", {
											type: "button",
											onClick: () => l(!0),
											className:
												"response__action-btn response__action-btn--edit",
											title: "Modifier",
											children: e.jsx(T, {}),
										}),
										e.jsx("button", {
											type: "button",
											onClick: b,
											className:
												"response__action-btn response__action-btn--delete",
											title: "Supprimer",
											children: e.jsx(R, {}),
										}),
										e.jsx("button", {
											type: "button",
											onClick: S,
											className:
												"response__action-btn response__action-btn--delete-all",
											title: "Supprimer pour tous",
											children: e.jsx(H, {}),
										}),
									],
								}),
							!N &&
								e.jsx("button", {
									type: "button",
									onClick: b,
									className:
										"response__action-btn response__action-btn--delete",
									title: "Supprimer",
									children: e.jsx(R, {}),
								}),
						],
					}),
			],
		});
	},
	z = ({ responses: t, messageId: n, onMessageUpdate: d }) => {
		const [r, c] = i.useState(t);
		i.useEffect(() => {
			c(t);
		}, [t]);
		const x = (l) => {
			c((m) => m.filter((_) => _._id !== l));
		};
		return !r || r.length === 0
			? null
			: e.jsx("div", {
					className: "response-list",
					children: r.map((l) =>
						e.jsx(
							K,
							{
								response: l,
								messageId: n,
								onMessageUpdate: d,
								onDeleteLocal: x,
							},
							l._id,
						),
					),
				});
	},
	O = () => {
		var b, S;
		const { conversationId: t } = F(),
			[n, d] = i.useState(null),
			[r, c] = i.useState(""),
			[x, l] = i.useState(!0),
			[m, _] = i.useState(null),
			a = i.useRef(null),
			p = i.useRef(null),
			j = async () => {
				l(!0), _(null);
				try {
					const s = await $.get(
						`http://localhost:5000/messages/conversation/${t}`,
						{ headers: v() },
					);
					d(s.data);
				} catch (s) {
					console.error(s),
						s.response
							? _(s.response.data.error)
							: _("Impossible d'afficher la conversation.");
				} finally {
					l(!1);
				}
			},
			N = async () => {
				var s, f;
				try {
					await $.patch(
						`http://localhost:5000/messages/${t}/read`,
						{},
						{ headers: v() },
					);
				} catch (h) {
					((s = h.response) == null ? void 0 : s.status) !== 403 &&
						alert(
							"markAsRead error:",
							(f = h.response) == null ? void 0 : f.data,
						);
				}
			};
		i.useEffect(() => {
			j(), N();
		}, [t]),
			i.useEffect(() => {
				p.current && (p.current.scrollTop = p.current.scrollHeight);
			}, [n]),
			i.useEffect(() => {
				const s = a.current;
				s &&
					((s.style.height = "auto"), (s.style.height = `${s.scrollHeight}px`));
			}, [r]);
		const g = async (s) => {
				var f, h;
				if ((s.preventDefault(), !!r.trim()))
					try {
						await $.post(
							`http://localhost:5000/messages/${t}/responses`,
							{ content: r },
							{ headers: v() },
						),
							c(""),
							a.current && (a.current.style.height = "auto"),
							j();
					} catch (y) {
						console.error(y),
							alert(
								((h = (f = y.response) == null ? void 0 : f.data) == null
									? void 0
									: h.error) || "Erreur lors de l'envoi de la réponse",
							);
					}
			},
			w = (s) => {
				s.key === "Enter" && !s.shiftKey && (s.preventDefault(), g(s));
			};
		return x
			? e.jsx("p", {
					className: "conversation__loading",
					children: "Chargement...",
				})
			: m
				? e.jsx("p", { className: "conversation__error", children: m })
				: e.jsxs("main", {
						className: "fond__conversation",
						children: [
							e.jsx("img", {
								src: V,
								alt: "fond__conversation",
								fetchPriority: "low",
								decoding: "sync",
								className: "books__header-bg",
							}),
							e.jsx("section", {
								className: "conversation",
								children: e.jsxs("div", {
									className: "conversation__container",
									children: [
										e.jsxs("div", {
											className: "conversation__topbar",
											children: [
												e.jsx("a", {
													href: "/messagerie",
													className: "conversation__back",
													children: "←",
												}),
												e.jsxs("div", {
													className: "conversation__topbar-info",
													children: [
														e.jsx("p", {
															className: "conversation__topbar-title",
															children: n.title || "Sans titre",
														}),
														e.jsxs("p", {
															className: "conversation__topbar-sub",
															children: [
																"avec ",
																((b = n.senderId) == null ? void 0 : b.login) ||
																	"Utilisateur",
															],
														}),
													],
												}),
											],
										}),
										e.jsxs("div", {
											className: "conversation__body",
											ref: p,
											children: [
												e.jsxs("div", {
													className: "conversation__original",
													children: [
														e.jsx("p", {
															className: "conversation__original-label",
															children: "Message d'origine",
														}),
														e.jsx("p", {
															className: "conversation__original-content",
															children: n.content,
														}),
														e.jsxs("p", {
															className: "conversation__original-meta",
															children: [
																e.jsx("strong", {
																	children:
																		(S = n.senderId) == null ? void 0 : S.login,
																}),
																" ·",
																" ",
																new Date(n.createdAt).toLocaleString(),
															],
														}),
													],
												}),
												e.jsx(z, {
													responses: n.responses,
													messageId: n._id,
													onMessageUpdate: j,
												}),
											],
										}),
										e.jsxs("form", {
											onSubmit: g,
											className: "conversation__reply-bar",
											children: [
												e.jsx("textarea", {
													ref: a,
													value: r,
													onChange: (s) => c(s.target.value),
													onKeyDown: w,
													placeholder: "Votre réponse...",
													className: "conversation__reply-input",
													rows: 1,
												}),
												e.jsx("button", {
													type: "submit",
													className: "conversation__reply-btn",
													children: "↑",
												}),
											],
										}),
									],
								}),
							}),
						],
					});
	};
export { O as default };
