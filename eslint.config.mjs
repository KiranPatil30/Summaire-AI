import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = {
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript","prettier"],
    plugins:['prettier'],
    rules:{
      'prettier/prettier': 'error',
      'react/no-escape-entities':'off',
    },
  }),
};

export default eslintConfig;


// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import { FlatCompat } from "@eslint/eslintrc";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
// });

// export default [
//   // Compatibility layer for ESLint plugins/configs that don't yet support flat config
//   ...compat.extends([
//     "next/core-web-vitals",
//     "next",
//     "prettier",
//   ]),
//   {
//     plugins: {
//       prettier: require("eslint-plugin-prettier"),
//     },
//     rules: {
//       "prettier/prettier": "error",
//       "react/no-escape-entities": "off",
//     },
//   },
// ];


// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import { FlatCompat } from "@eslint/eslintrc";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
// });

// export default [
//   ...compat.extends([
//     "next/core-web-vitals",
//     "next",
//     "prettier",
//   ]),
//   {
//     plugins: {
//       prettier: require("eslint-plugin-prettier"),
//     },
//     rules: {
//       "prettier/prettier": "error",
//       "react/no-escape-entities": "off",
//     },
//   },
// ];
