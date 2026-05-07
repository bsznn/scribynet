import {
	f as a,
	j as n,
} from "./index-DV15eqUG.js"; /* empty css                           */

const s = "/assets/cancel-BhnsP860.jpg";
function o() {
	return n.jsxs("main", {
		className: "donation-cancel",
		children: [
			n.jsx("img", {
				src: a,
				alt: "fond__donation",
				fetchPriority: "low",
				decoding: "async",
				className: "donation-component__bg",
			}),
			n.jsxs("div", {
				className: "donation-cancel__container",
				children: [
					n.jsx("div", {
						className: "donation-cancel__icon",
						children: n.jsx("img", {
							src: s,
							alt: "Don annulé",
							"aria-label": "Don annulé",
						}),
					}),
					n.jsxs("div", {
						className: "donation-cancel__content",
						children: [
							n.jsx("h1", {
								className: "donation-cancel__title",
								children: "Paiement annulé",
							}),
							n.jsxs("p", {
								className: "donation-cancel__message",
								children: ["Vous pouvez réessayer à tout moment.", " "],
							}),
						],
					}),
				],
			}),
		],
	});
}
export { o as default };
