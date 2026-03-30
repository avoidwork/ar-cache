import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const pkg = require("./package.json");
const year = new Date().getFullYear();
const bannerLong = `/**
 * ${pkg.name}
 *
 * @copyright ${year} ${pkg.author}
 * @license ${pkg.license}
 * @version ${pkg.version}
 */`;
const defaultOutBase = { compact: true, banner: bannerLong, name: pkg.name };
const cjOutBase = { ...defaultOutBase, compact: false, format: "cjs", exports: "named" };
const esmOutBase = { ...defaultOutBase, format: "esm" };

export default [
	{
		input: "./src/arc.js",
		output: [
			{
				...cjOutBase,
				file: `dist/arc.cjs`,
			},
			{
				...esmOutBase,
				file: `dist/arc.js`,
			},
		],
	},
];
