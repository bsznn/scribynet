import {
	j as e,
	b as I,
	u as M,
	f as P,
	L as R,
	t as S,
	r as t,
	m as U,
} from "./index-DV15eqUG.js";

const T = ({
		message: s,
		onDeleted: c,
		onUpdated: f,
		currentUserId: x,
		onRead: j,
	}) => {
		var E, C;
		const [w, v] = t.useState(!1),
			[y, u] = t.useState(s.title),
			[h, m] = t.useState(s.content),
			o = s.senderId,
			p = typeof s.senderId == "object" ? s.senderId._id : s.senderId,
			_ = String(x) === String(p),
			a = new Date(s.createdAt),
			i = `${a.toLocaleDateString()} à ${a.toLocaleTimeString()}`,
			g = async () => {
				if (
					window.confirm(
						"Voulez-vous vraiment supprimer ce message pour vous ?",
					)
				)
					try {
						const r = await fetch(
								`http://localhost:5000/messages/${s._id}/deleteForMe`,
								{ method: "DELETE", headers: S() },
							),
							N = await r.json();
						if (!r.ok)
							throw new Error(
								N.error ||
									"Impossible de supprimer le message. Veuillez réesayer à nouveau.",
							);
						alert(N.message), c == null || c();
					} catch (r) {
						console.error(r), alert(r.message);
					}
			},
			l = async () => {
				if (
					window.confirm(
						"Voulez-vous vraiment supprimer ce message pour tous ?",
					)
				)
					try {
						const r = await fetch(
								`http://localhost:5000/messages/${s._id}/deleteForAll`,
								{ method: "DELETE", headers: S() },
							),
							N = await r.json();
						if (!r.ok)
							throw new Error(
								N.error ||
									"Impossible de supprimer le message. Veuillez réesayer à nouveau.",
							);
						alert(N.message), c == null || c();
					} catch (r) {
						console.error(r), alert(r.message);
					}
			},
			k = async () => {
				if (!_) {
					alert("Vous ne pouvez modifier que vos propres messages.");
					return;
				}
				try {
					const d = await fetch(
							`http://localhost:5000/messages/edit/${s._id}`,
							{
								method: "PUT",
								headers: { ...S(), "Content-Type": "application/json" },
								body: JSON.stringify({ title: y, content: h }),
							},
						),
						r = await d.json();
					d.ok
						? (alert("Message mis à jour !"),
							v(!1),
							f == null || f({ ...r, senderId: s.senderId }))
						: alert(r.error);
				} catch (d) {
					console.error(d), alert("Erreur lors de la mise à jour");
				}
			};
		return e.jsxs("div", {
			className: "message",
			children: [
				e.jsxs("div", {
					className: "message__header",
					children: [
						e.jsx("img", {
							src: `http://localhost:5000/assets/img/${((E = o == null ? void 0 : o.image) == null ? void 0 : E.src) || U}`,
							alt:
								((C = o == null ? void 0 : o.image) == null ? void 0 : C.alt) ||
								"Utilisateur",
							className: "message__avatar",
						}),
						e.jsxs("div", {
							className: "message__info",
							children: [
								e.jsx("h4", {
									children:
										(o == null ? void 0 : o.login) || "Utilisateur inconnu",
								}),
								e.jsx("small", { children: i }),
							],
						}),
					],
				}),
				w
					? e.jsxs("div", {
							children: [
								e.jsx("input", {
									value: y,
									onChange: (d) => u(d.target.value),
									className: "message__input-title",
								}),
								e.jsx("textarea", {
									value: h,
									onChange: (d) => m(d.target.value),
									className: "message__input-content",
								}),
								e.jsx("button", {
									type: "button",
									onClick: k,
									className: "btn btn-update",
									children: "Enregistrer",
								}),
								e.jsx("button", {
									type: "button",
									onClick: () => v(!1),
									className: "btn btn-cancel",
									children: "Annuler",
								}),
							],
						})
					: e.jsxs(e.Fragment, {
							children: [
								e.jsx("h3", { className: "message__title", children: s.title }),
								e.jsx("p", {
									className: "message__content",
									children:
										s.content.length > 80
											? `${s.content.slice(0, 80)}...`
											: s.content,
								}),
								e.jsx(R, {
									to: `/messages/conversation/${s._id}`,
									className: "message__link",
									onClick: () => {
										!_ && !s.isRead && (j == null || j(s._id));
									},
									children: "Ouvrir la conversation",
								}),
								_
									? e.jsx("span", {
											className: "badge badge--sent",
											children: "Envoyé",
										})
									: e.jsx("span", {
											className: `badge ${s.isRead ? "badge--read" : "badge--unread"}`,
											children: s.isRead ? "Lu" : "Non lu",
										}),
								e.jsx("div", {
									className: "message__actions mt-2",
									children: _
										? e.jsxs(e.Fragment, {
												children: [
													e.jsx("button", {
														type: "button",
														onClick: () => v(!0),
														className: "btn btn-edit",
														children: "Modifier",
													}),
													e.jsx("button", {
														type: "button",
														onClick: g,
														className: "btn btn-delete",
														children: "Supprimer",
													}),
													e.jsx("button", {
														type: "button",
														onClick: l,
														className: "btn btn-delete-all",
														children: "Supprimer pour tous",
													}),
												],
											})
										: e.jsx("button", {
												type: "button",
												onClick: g,
												className: "btn btn-delete",
												children: "Supprimer",
											}),
								}),
							],
						}),
			],
		});
	},
	D = ({ onMessageSent: s }) => {
		const { user: c } = M(),
			[f, x] = t.useState(null),
			[j, w] = t.useState(null),
			[v, y] = t.useState([]),
			[u, h] = t.useState(""),
			[m, o] = t.useState([]),
			[p, _] = t.useState(""),
			[a, i] = t.useState(""),
			[g, l] = t.useState(!1),
			[k, E] = t.useState(""),
			[C, d] = t.useState(""),
			r = t.useRef(null),
			N = () => {
				I.get("http://localhost:5000/users", { headers: S() }).then((n) => {
					const b = n.data.users.filter((F) => F._id !== c._id);
					y(b), o(b);
				}),
					x("Impossible de charger les utilisateurs.");
			};
		t.useEffect(() => {
			N();
		}, []),
			t.useEffect(() => {
				const n = u.toLowerCase();
				o(v.filter((b) => b.login && b.login.toLowerCase().includes(n)));
			}, [u, v]),
			t.useEffect(() => {
				const n = (b) => {
					r.current && !r.current.contains(b.target) && l(!1);
				};
				return (
					document.addEventListener("mousedown", n),
					() => document.removeEventListener("mousedown", n)
				);
			}, []);
		const L = (n) => {
				_(n._id), i(n.login), h(n.login), l(!1);
			},
			A = (n) => {
				h(n.target.value), _(""), i(""), l(!0);
			},
			z = async (n) => {
				if ((n.preventDefault(), !p)) {
					x("Veuillez choisir un destinataire.");
					return;
				}
				try {
					x(null),
						w(null),
						await I.post(
							"http://localhost:5000/messages/new",
							{ receiverId: p, title: k, content: C },
							{ headers: S() },
						),
						_(""),
						i(""),
						E(""),
						d(""),
						h(""),
						w("Message envoyé avec succès !"),
						s && s();
				} catch {
					x("Impossible d'envoyer le message.");
				}
			};
		return e.jsxs("form", {
			onSubmit: z,
			className: "add-message-form",
			children: [
				e.jsx("h3", {
					className: "add-message-form__title",
					children: "Nouveau message",
				}),
				e.jsxs("div", {
					className: "recipient-search",
					ref: r,
					children: [
						e.jsx("input", {
							type: "text",
							placeholder: "Rechercher un destinataire...",
							value: u,
							onChange: A,
							onFocus: () => l(!0),
							className: p ? "recipient-search__input--selected" : "",
							autoComplete: "off",
						}),
						g &&
							m.length > 0 &&
							e.jsx("ul", {
								className: "recipient-dropdown",
								children: m.map((n) =>
									e.jsxs(
										"li",
										{
											className: `recipient-dropdown__item ${p === n._id ? "recipient-dropdown__item--active" : ""}`,
											onMouseDown: () => L(n),
											children: [
												e.jsx("span", {
													className: "recipient-dropdown__avatar",
													children: n.login.charAt(0).toUpperCase(),
												}),
												n.login,
											],
										},
										n._id,
									),
								),
							}),
						g &&
							m.length === 0 &&
							u.length > 0 &&
							e.jsx("div", {
								className: "recipient-dropdown recipient-dropdown--empty",
								children: "Aucun utilisateur trouvé",
							}),
					],
				}),
				e.jsx("input", {
					type: "text",
					placeholder: "Titre",
					value: k,
					onChange: (n) => E(n.target.value),
				}),
				e.jsx("textarea", {
					placeholder: "Votre message",
					value: C,
					onChange: (n) => d(n.target.value),
				}),
				e.jsx("button", { type: "submit", children: "Envoyer" }),
				f && e.jsx("p", { className: "error-message", children: f }),
				j && e.jsx("p", { className: "success-message", children: j }),
			],
		});
	},
	$ = 3,
	O = () => {
		const [s, c] = t.useState([]),
			[f, x] = t.useState(!1),
			[j, w] = t.useState(!1),
			[v, y] = t.useState(),
			[u, h] = t.useState(1),
			{ user: m } = M();
		t.useEffect(() => {
			const a = () => {
				window.innerWidth >= 1200 && x(!0);
			};
			return (
				a(),
				window.addEventListener("resize", a),
				() => window.removeEventListener("resize", a)
			);
		}, []);
		const o = () => {
			I.get("http://localhost:5000/messages", { headers: S() })
				.then((a) => c(a.data))
				.catch((a) => {
					y("Impossible de charger les messages");
				});
		};
		t.useEffect(() => {
			o();
		}, [j]),
			t.useEffect(() => {
				h(1);
			}, [s.length]);
		const p = Math.ceil(s.length / $),
			_ = s.slice((u - 1) * $, u * $);
		return e.jsxs("main", {
			className: "fond__messages",
			children: [
				e.jsx("img", {
					src: P,
					alt: "fond__messages",
					fetchPriority: "low",
					decoding: "sync",
					className: "books__header-bg",
				}),
				e.jsx("section", {
					className: "messages",
					children: e.jsxs("div", {
						className: "messages__container",
						children: [
							e.jsx("h1", { children: "Messagerie" }),
							e.jsx("button", {
								type: "button",
								onClick: () => x(!f),
								className: "btn-new-message",
								children: "Nouveau message",
							}),
							f && e.jsx(D, { onMessageSent: () => w(!j) }),
							v && e.jsx("p", { className: "error-msg", children: v }),
							e.jsx("div", {
								className: "space-y-2",
								children:
									s.length === 0
										? e.jsxs("div", {
												className: "messages-empty",
												children: [
													e.jsx("span", {
														className: "messages-empty__icon",
														children: "✉",
													}),
													e.jsx("p", {
														className: "messages-empty__title",
														children: "Aucun message pour le moment",
													}),
													e.jsx("p", {
														className: "messages-empty__sub",
														children:
															"Commencez une conversation en envoyant votre premier message.",
													}),
												],
											})
										: _.map((a) =>
												e.jsx(
													T,
													{
														message: a,
														currentUserId:
															(m == null ? void 0 : m._id) ||
															(m == null ? void 0 : m.id),
														onRead: (i) =>
															c((g) =>
																g.map((l) =>
																	l._id === i ? { ...l, isRead: !0 } : l,
																),
															),
														onDeleted: () =>
															c((i) => i.filter((g) => g._id !== a._id)),
														onUpdated: (i) =>
															c((g) => g.map((l) => (l._id === i._id ? i : l))),
													},
													a._id,
												),
											),
							}),
							p > 1 &&
								e.jsxs("div", {
									className: "messages__pagination",
									children: [
										e.jsx("button", {
											type: "button",
											className: "pagination__btn",
											onClick: () => h((a) => Math.max(a - 1, 1)),
											disabled: u === 1,
											children: "←",
										}),
										Array.from({ length: p }, (a, i) => i + 1).map((a) =>
											e.jsx(
												"button",
												{
													type: "button",
													className: `pagination__btn ${u === a ? "pagination__btn--active" : ""}`,
													onClick: () => h(a),
													children: a,
												},
												a,
											),
										),
										e.jsx("button", {
											type: "button",
											className: "pagination__btn",
											onClick: () => h((a) => Math.min(a + 1, p)),
											disabled: u === p,
											children: "→",
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
