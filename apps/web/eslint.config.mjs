import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

/* eslint-config-next 16 ships flat config, so no eslintrc compat layer. */
const config = [
  ...coreWebVitals,
  ...typescript,
  { ignores: [".next/**", "public/r/**", "node_modules/**"] },
];

export default config;
