import {
	L as c,
	j as e,
	f as k,
	r as l,
	u as M,
	a as P,
	p as T,
	t as w,
	b as x,
} from "./index-DV15eqUG.js";
import { i as B } from "./quill.snow-BXjwgHAL.js";
import { S as R } from "./react-select.esm-Bb5LWOgu.js";

const g = 500,
	j = [
		{
			key: "book",
			label: "Informations",
			sub: "Titre, couverture, catégories",
		},
		{ key: "chapter", label: "Chapitre", sub: "Titre et contenu" },
		{ key: "review", label: "Publier", sub: "Vérification finale" },
	],
	D = () => {
		const f = M(),
			N = P(),
			[m, v] = l.useState(null),
			[r, n] = l.useState(0),
			[s, b] = l.useState({
				title: "",
				description: "",
				categories: [],
				selectedCategories: [],
				image: null,
				imageName: "",
				chapterTitle: "",
				chapterContent: "",
			}),
			[_, h] = l.useState(!1);
		l.useEffect(() => {
			x.get("http://localhost:5000/categories")
				.then((a) => b((o) => ({ ...o, categories: a.data })))
				.catch((a) => {
					v("Impossible de charger les catégories.");
				});
		}, []);
		const d = (a, o) => b((i) => ({ ...i, [a]: o })),
			t = (a) => {
				var u;
				const { name: o, value: i } = a.target;
				o === "image"
					? (d("image", a.target.files[0]),
						d(
							"imageName",
							((u = a.target.files[0]) == null ? void 0 : u.name) || "",
						))
					: o === "description"
						? i.length <= g
							? (d("description", i), h(!1))
							: h(!0)
						: d(o, i);
			},
			y = (a) => d("chapterContent", a),
			p = () => {
				if (
					r === 0 &&
					(!s.title.trim() ||
						!s.description.trim() ||
						s.selectedCategories.length === 0 ||
						_)
				) {
					alert("Remplissez tous les champs de l'étape 1.");
					return;
				}
				if (r === 1 && (!s.chapterTitle.trim() || !s.chapterContent.trim())) {
					alert("Remplissez le titre et le contenu du chapitre.");
					return;
				}
				n((a) => a + 1);
			},
			C = () => {
				const a = new FormData();
				a.append("title", s.title),
					a.append("description", s.description),
					a.append("categories", JSON.stringify(s.selectedCategories)),
					a.append("image", s.image),
					a.append(
						"chapters",
						JSON.stringify([
							{ title: s.chapterTitle, content: s.chapterContent },
						]),
					),
					x
						.post("http://localhost:5000/books/new", a, { headers: w() })
						.then((o) => {
							alert(o.data.message), N("/profil");
						})
						.catch(() => alert("Erreur lors de la publication."));
			},
			S = `${Math.round((r / j.length) * 100)}%`,
			z = {
				control: (a, o) => ({
					...a,
					border: `1.5px solid ${o.isFocused ? "var(--darkMarron)" : "var(--mediumBeige)"}`,
					borderRadius: "10px",
					background: "var(--lightBeige)",
					boxShadow: o.isFocused ? "0 0 0 3px rgba(66,60,57,0.08)" : "none",
					minHeight: "46px",
					"&:hover": { borderColor: "var(--darkMarron)" },
				}),
				menu: (a) => ({
					...a,
					borderRadius: "10px",
					border: "1px solid var(--mediumBeige)",
					boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
				}),
				option: (a, o) => ({
					...a,
					background: o.isSelected
						? "var(--darkMarron)"
						: o.isFocused
							? "var(--hoverLightBeige)"
							: "transparent",
					color: o.isSelected ? "var(--lightBeige)" : "var(--darkMarron)",
					cursor: "pointer",
				}),
				multiValue: (a) => ({
					...a,
					background: "var(--darkMarron)",
					borderRadius: "6px",
				}),
				multiValueLabel: (a) => ({
					...a,
					color: "var(--lightBeige)",
					fontSize: "0.78rem",
				}),
				multiValueRemove: (a) => ({
					...a,
					color: "var(--lightBeige)",
					"&:hover": {
						background: "var(--mediumMarron)",
						color: "var(--lightBeige)",
					},
				}),
				placeholder: (a) => ({ ...a, color: "var(--darkBeige)", opacity: 0.6 }),
				indicatorSeparator: () => ({ display: "none" }),
				classNamePrefix: "addbook-rs",
			};
		return f.user
			? e.jsxs("main", {
					className: "fond__addbook",
					children: [
						e.jsx("img", {
							src: k,
							alt: "fond__ajoutImage",
							fetchPriority: "low",
							decoding: "async",
							className: "fond__addbook-bg",
						}),
						e.jsx("div", {
							className: "addbook__container",
							children: e.jsxs("div", {
								className: "addbook",
								children: [
									e.jsxs("aside", {
										className: "addbook__sidebar",
										children: [
											e.jsxs("div", {
												className: "addbook__brand",
												children: [
													e.jsx("span", {
														className: "addbook__brand-eyebrow",
														children: "Nouvelle histoire",
													}),
													e.jsxs("h1", {
														className: "addbook__brand-title",
														children: [
															"Écrivez.",
															e.jsx("br", {}),
															e.jsx("span", { children: "Partagez." }),
														],
													}),
													e.jsx("p", {
														className: "addbook__brand-desc",
														children:
															"Chaque grande histoire commence par une première ligne. Donnez vie à votre univers et partagez-le avec nos lecteurs.",
													}),
												],
											}),
											e.jsx("ul", {
												className: "addbook__steps",
												children: j.map((a, o) =>
													e.jsxs(
														"li",
														{
															className: `addbook__step ${o === r ? "is-active" : ""} ${o < r ? "is-done" : ""}`,
															children: [
																e.jsx("div", {
																	className: "addbook__step-dot",
																}),
																e.jsxs("div", {
																	children: [
																		e.jsx("div", {
																			className: "addbook__step-label",
																			children: a.label,
																		}),
																		e.jsx("div", {
																			className: "addbook__step-sub",
																			children: a.sub,
																		}),
																	],
																}),
															],
														},
														a.key,
													),
												),
											}),
											e.jsx(c, {
												to: "/histoires",
												className: "addbook__back",
												children: "← Retour aux histoires",
											}),
										],
									}),
									e.jsxs("div", {
										className: "addbook__main",
										children: [
											e.jsx("div", {
												className: "addbook__progress",
												children: e.jsx("div", {
													className: "addbook__progress-fill",
													style: { width: S },
												}),
											}),
											r === 0 &&
												e.jsxs("div", {
													className: "addbook__panel",
													children: [
														e.jsx("h2", {
															className: "addbook__panel-title",
															children: "Informations générales",
														}),
														e.jsx("p", {
															className: "addbook__panel-sub",
															children:
																"Présentez votre histoire en quelques mots.",
														}),
														e.jsxs("div", {
															className: "addbook__fields",
															children: [
																e.jsxs("div", {
																	className: "addbook__field",
																	children: [
																		e.jsx("label", {
																			for: "image",
																			className: "addbook__field-label",
																			children: "Couverture (optionnel)",
																		}),
																		e.jsxs("div", {
																			className: "addbook__upload",
																			children: [
																				e.jsx("input", {
																					type: "file",
																					name: "image",
																					accept: "image/*",
																					onChange: t,
																				}),
																				e.jsx("span", {
																					className: "addbook__upload-icon",
																					children: "🖼",
																				}),
																				e.jsx("span", {
																					className: "addbook__upload-label",
																					children:
																						s.imageName ||
																						"Glissez ou cliquez pour choisir",
																				}),
																				e.jsx("span", {
																					className: "addbook__upload-sub",
																					children: "JPG, PNG, WebP — max 5 Mo",
																				}),
																			],
																		}),
																	],
																}),
																e.jsxs("div", {
																	className: "addbook__field",
																	children: [
																		e.jsx("label", {
																			for: "title",
																			className: "addbook__field-label",
																			children: "Titre*",
																		}),
																		e.jsx("input", {
																			className: "addbook__field-input",
																			name: "title",
																			value: s.title,
																			onChange: t,
																			placeholder:
																				"Le titre de votre histoire…",
																		}),
																	],
																}),
																e.jsxs("div", {
																	className: "addbook__field",
																	children: [
																		e.jsx("label", {
																			for: "description",
																			className: "addbook__field-label",
																			children: "Description*",
																		}),
																		e.jsx("textarea", {
																			className: "addbook__field-textarea",
																			name: "description",
																			value: s.description,
																			onChange: t,
																			placeholder: "Une courte présentation…",
																		}),
																		e.jsxs("span", {
																			className: "addbook__field-hint",
																			children: [s.description.length, "/", g],
																		}),
																		_ &&
																			e.jsx("span", {
																				className: "addbook__error-msg",
																				children: "500 caractères maximum.",
																			}),
																	],
																}),
																e.jsxs("div", {
																	className: "addbook__field",
																	children: [
																		e.jsx("label", {
																			for: "categories",
																			className: "addbook__field-label",
																			children: "Catégories*",
																		}),
																		e.jsx("div", {
																			className: "addbook__select",
																			children: e.jsx(R, {
																				isMulti: !0,
																				placeholder: "Sélectionnez…",
																				classNamePrefix: "addbook-rs",
																				styles: z,
																				options: s.categories.map((a) => ({
																					value: a._id,
																					label: a.name,
																				})),
																				onChange: (a) =>
																					d(
																						"selectedCategories",
																						a.map((o) => o.value),
																					),
																			}),
																		}),
																		m &&
																			e.jsx("p", {
																				className: "error-message",
																				children: m,
																			}),
																	],
																}),
															],
														}),
														e.jsxs("div", {
															className: "addbook__nav",
															children: [
																e.jsx("span", {}),
																e.jsx("button", {
																	className:
																		"addbook__btn addbook__btn--primary",
																	type: "button",
																	onClick: p,
																	children: "Suivant →",
																}),
															],
														}),
													],
												}),
											r === 1 &&
												e.jsxs("div", {
													className: "addbook__panel",
													children: [
														e.jsx("h2", {
															className: "addbook__panel-title",
															children: "Premier chapitre",
														}),
														e.jsx("p", {
															className: "addbook__panel-sub",
															children:
																"Écrivez le tout premier chapitre de votre histoire.",
														}),
														e.jsxs("div", {
															className: "addbook__fields",
															children: [
																e.jsxs("div", {
																	className: "addbook__field",
																	children: [
																		e.jsx("label", {
																			for: "chapterTitle",
																			className: "addbook__field-label",
																			children: "Titre du chapitre*",
																		}),
																		e.jsx("input", {
																			className: "addbook__field-input",
																			name: "chapterTitle",
																			value: s.chapterTitle,
																			onChange: t,
																			placeholder: "Chapitre 1 — …",
																		}),
																	],
																}),
																e.jsxs("div", {
																	className: "addbook__field",
																	children: [
																		e.jsx("label", {
																			for: "chapterContent",
																			className: "addbook__field-label",
																			children: "Contenu*",
																		}),
																		e.jsx(B, {
																			className: "addbook__quill",
																			theme: "snow",
																			value: s.chapterContent,
																			onChange: y,
																			placeholder: "Il était une fois…",
																		}),
																	],
																}),
															],
														}),
														e.jsxs("div", {
															className: "addbook__nav",
															children: [
																e.jsx("button", {
																	className: "addbook__btn addbook__btn--ghost",
																	type: "button",
																	onClick: () => n(0),
																	children: "← Retour",
																}),
																e.jsx("button", {
																	className:
																		"addbook__btn addbook__btn--primary",
																	type: "button",
																	onClick: p,
																	children: "Vérifier →",
																}),
															],
														}),
													],
												}),
											r === 2 &&
												e.jsxs("div", {
													className: "addbook__panel",
													children: [
														e.jsx("h2", {
															className: "addbook__panel-title",
															children: "Tout est prêt !",
														}),
														e.jsx("p", {
															className: "addbook__panel-sub",
															children:
																"Vérifiez les informations avant de publier.",
														}),
														e.jsxs("div", {
															className: "addbook__fields",
															children: [
																e.jsxs("div", {
																	className: "addbook__field",
																	children: [
																		e.jsx("label", {
																			for: "title",
																			className: "addbook__field-label",
																			children: "Titre",
																		}),
																		e.jsx("p", {
																			style: {
																				fontWeight: 600,
																				color: "var(--darkMarron)",
																				margin: "0.3rem 0 1rem",
																			},
																			children: s.title,
																		}),
																	],
																}),
																e.jsxs("div", {
																	className: "addbook__field",
																	children: [
																		e.jsx("label", {
																			for: "description",
																			className: "addbook__field-label",
																			children: "Description",
																		}),
																		e.jsx("p", {
																			style: {
																				fontSize: "0.88rem",
																				color: "var(--mediumMarron)",
																				lineHeight: 1.6,
																				margin: "0.3rem 0 1rem",
																			},
																			children: s.description,
																		}),
																	],
																}),
																e.jsxs("div", {
																	className: "addbook__field",
																	children: [
																		e.jsx("label", {
																			for: "categories",
																			className: "addbook__field-label",
																			children: "Catégories",
																		}),
																		e.jsx("div", {
																			style: {
																				display: "flex",
																				flexWrap: "wrap",
																				gap: "0.4rem",
																				margin: "0.3rem 0 1.2rem",
																			},
																			children: s.categories
																				.filter((a) =>
																					s.selectedCategories.includes(a._id),
																				)
																				.map((a) =>
																					e.jsxs(
																						"span",
																						{
																							style: {
																								background: "var(--darkMarron)",
																								color: "var(--lightBeige)",
																								borderRadius: "20px",
																								padding: "0.2rem 0.7rem",
																								fontSize: "0.75rem",
																							},
																							children: ["#", a.name],
																						},
																						a._id,
																					),
																				),
																		}),
																	],
																}),
																e.jsxs("div", {
																	className: "addbook__field",
																	children: [
																		e.jsx("label", {
																			for: "chapterTitle",
																			className: "addbook__field-label",
																			children: "Premier chapitre",
																		}),
																		e.jsx("p", {
																			style: {
																				fontWeight: 600,
																				color: "var(--darkMarron)",
																				margin: "0.3rem 0 1rem",
																			},
																			children: s.chapterTitle,
																		}),
																		e.jsx("label", {
																			for: "chapterContent",
																			className: "addbook__field-label",
																			children: "Contenu",
																		}),
																		e.jsx("div", {
																			className: "addbook__chapter-content",
																			style: { margin: "0.3rem 0 1rem" },
																			dangerouslySetInnerHTML: {
																				__html: T.sanitize(
																					s.chapterContent.replace(
																						/&nbsp;/g,
																						" ",
																					),
																				),
																			},
																		}),
																	],
																}),
																s.imageName &&
																	e.jsxs("div", {
																		className: "addbook__field",
																		children: [
																			e.jsx("label", {
																				for: "image",
																				className: "addbook__field-label",
																				children: "Couverture",
																			}),
																			e.jsx("p", {
																				style: {
																					fontSize: "0.82rem",
																					color: "var(--mediumMarron)",
																					fontStyle: "italic",
																				},
																				children: s.imageName,
																			}),
																		],
																	}),
															],
														}),
														e.jsxs("div", {
															className: "addbook__nav",
															children: [
																e.jsx("button", {
																	className: "addbook__btn addbook__btn--ghost",
																	type: "button",
																	onClick: () => n(1),
																	children: "← Modifier",
																}),
																e.jsx("button", {
																	className:
																		"addbook__btn addbook__btn--primary",
																	type: "button",
																	onClick: C,
																	children: "Publier l'histoire ✦",
																}),
															],
														}),
													],
												}),
										],
									}),
								],
							}),
						}),
					],
				})
			: e.jsxs("div", {
					className: "fond__errorbook",
					children: [
						e.jsx("img", {
							src: k,
							alt: "fond__ajoutImage",
							fetchPriority: "low",
							decoding: "async",
							className: "fond__errorbook-bg",
						}),
						e.jsx("main", {
							className: "addbook__gate",
							children: e.jsxs("div", {
								className: "addbook__gate-box",
								children: [
									e.jsx("div", {
										className: "addbook__gate-icon",
										children: "✦",
									}),
									e.jsx("h2", {
										className: "addbook__gate-title",
										children: "Publier une histoire",
									}),
									e.jsx("p", {
										className: "addbook__gate-text",
										children:
											"Pour partager vos histoires avec la communauté, vous devez être connecté(e).",
									}),
									e.jsx("p", {
										className: "addbook__gate-text",
										children: "Pas encore de compte ?",
									}),
									e.jsxs("div", {
										className: "addbook__gate-actions",
										children: [
											e.jsx(c, {
												to: "/se-connecter",
												className: "addbook__btn addbook__btn--primary",
												children: "Se connecter",
											}),
											e.jsx(c, {
												to: "/s-inscrire",
												className: "addbook__btn addbook__btn--ghost",
												children: "S'inscrire",
											}),
										],
									}),
								],
							}),
						}),
					],
				});
	};
export { D as AddBook };
