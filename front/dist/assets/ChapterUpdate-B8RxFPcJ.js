import {
	e as b,
	j as e,
	c as f,
	b as h,
	r as l,
	a as N,
	L as o,
	t as v,
} from "./index-DV15eqUG.js";
import { i as g } from "./quill.snow-BXjwgHAL.js";

const $ = () => {
	const [s, i] = l.useState({ chapterContent: "", chapterTitle: "" }),
		[d, n] = l.useState(""),
		{ bookId: r, chapterId: p } = f(),
		u = N();
	l.useEffect(() => {
		h.get(`http://localhost:5000/books/${r}`)
			.then((t) => {
				const a = t.data.chapters.find((c) => c._id === p);
				a
					? i({ chapterTitle: a.title, chapterContent: a.content })
					: n("Chapitre non trouvé.");
			})
			.catch(() =>
				n("Une erreur est survenue lors de la récupération du chapitre."),
			);
	}, [r, p]);
	const _ = (t) => {
			const { name: a, value: c } = t.target;
			i((j) => ({ ...j, [a]: c })), n("");
		},
		m = (t) => i((a) => ({ ...a, chapterContent: t })),
		x = () => {
			if (!s.chapterTitle.trim() || !s.chapterContent.trim()) {
				n("Veuillez remplir tous les champs.");
				return;
			}
			h.put(
				`http://localhost:5000/books/chapter/edit/${r}/${p}`,
				{ chapters: [{ title: s.chapterTitle, content: s.chapterContent }] },
				{ headers: { ...v(), "Content-Type": "application/json" } },
			)
				.then(() => u(`/histoire/${r}`))
				.catch((t) => {
					var a, c;
					return n(
						((c = (a = t.response) == null ? void 0 : a.data) == null
							? void 0
							: c.message) || "Une erreur est survenue.",
					);
				});
		};
	return e.jsxs("main", {
		className: "fond__updatechapter",
		children: [
			e.jsx("img", {
				src: b,
				alt: "fond__chapitre",
				fetchPriority: "low",
				decoding: "async",
				className: "fond__updatechapter-bg",
			}),
			e.jsx("div", {
				className: "updatechapter__container",
				children: e.jsxs("div", {
					className: "updatechapter",
					children: [
						e.jsxs("aside", {
							className: "updatechapter__sidebar",
							children: [
								e.jsxs("div", {
									className: "updatechapter__brand",
									children: [
										e.jsx("span", {
											className: "updatechapter__brand-eyebrow",
											children: "Édition",
										}),
										e.jsxs("h1", {
											className: "updatechapter__brand-title",
											children: [
												"Retouchez.",
												e.jsx("br", {}),
												e.jsx("span", { children: "Perfectionnez." }),
											],
										}),
										e.jsx("p", {
											className: "updatechapter__brand-desc",
											children:
												"Chaque mot compte. Affinez votre chapitre et offrez à vos lecteurs la meilleure version de votre histoire.",
										}),
									],
								}),
								e.jsx(o, {
									to: `/histoire/${r}`,
									className: "updatechapter__back",
									children: "← Retour à l'histoire",
								}),
							],
						}),
						e.jsx("div", {
							className: "updatechapter__main",
							children: e.jsxs("div", {
								className: "updatechapter__panel",
								children: [
									e.jsx("h2", {
										className: "updatechapter__panel-title",
										children: "Modifier le chapitre",
									}),
									e.jsx("p", {
										className: "updatechapter__panel-sub",
										children: "Apportez vos modifications, puis sauvegardez.",
									}),
									e.jsxs("div", {
										className: "updatechapter__fields",
										children: [
											e.jsxs("div", {
												className: "updatechapter__field",
												children: [
													e.jsx("label", {
														className: "updatechapter__field-label",
														children: "Titre du chapitre",
													}),
													e.jsx("input", {
														className: "updatechapter__field-input",
														name: "chapterTitle",
														value: s.chapterTitle,
														onChange: _,
														placeholder: "Titre du chapitre…",
													}),
												],
											}),
											e.jsxs("div", {
												className: "updatechapter__field",
												children: [
													e.jsx("label", {
														className: "updatechapter__field-label",
														children: "Contenu",
													}),
													e.jsx(g, {
														className: "updatechapter__quill",
														theme: "snow",
														value: s.chapterContent,
														onChange: m,
													}),
												],
											}),
										],
									}),
									d &&
										e.jsx("p", {
											className: "updatechapter__error",
											children: d,
										}),
									e.jsxs("div", {
										className: "updatechapter__nav",
										children: [
											e.jsx(o, {
												to: `/histoire/${r}`,
												className:
													"updatechapter__btn updatechapter__btn--ghost",
												children: "← Annuler",
											}),
											e.jsx("button", {
												className:
													"updatechapter__btn updatechapter__btn--primary",
												type: "button",
												onClick: x,
												children: "Sauvegarder ✦",
											}),
										],
									}),
								],
							}),
						}),
					],
				}),
			}),
		],
	});
};
export { $ as default };
