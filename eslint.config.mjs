import next from "eslint-config-next";

const config = [
  ...next,
  { rules: { "@next/next/no-page-custom-font": "off" } },
  { ignores: [".next/**", "public/**"] },
];

export default config;
