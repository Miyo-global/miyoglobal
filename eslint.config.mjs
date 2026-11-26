import next from "eslint-config-next";

const config = [
  ...next,
  { rules: { "@next/next/no-img-element": "off" } },
  { ignores: [".next/", "public/"] },
];

export default config;
