import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * Architecture rules (see docs/BACKEND.md, "Camadas"):
 *   domain  ← pure rules and types; knows nothing about the database, React or Next
 *   server  ← database, services and integrations; only used by routes, pages and actions
 *   lib / components ← browser code; must never reach into the server layer
 */
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/domain/**/*.ts"],
    ignores: ["**/*.test.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            { group: ["@/server/*", "@/components/*", "@/lib/*", "@/app/*"], message: "O domínio é puro: não importa servidor, interface nem utilitários do navegador." },
            { group: ["react", "react-dom", "next", "next/*"], message: "O domínio não depende de React nem de Next." },
          ],
        },
      ],
    },
  },
  {
    files: ["src/components/**/*.{ts,tsx}", "src/lib/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [{ group: ["@/server/*"], message: "Código do navegador não pode importar a camada do servidor (@/server)." }],
        },
      ],
    },
  },
  {
    files: ["src/server/**/*.ts"],
    ignores: ["**/*.test.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [{ group: ["@/components/*", "@/app/*"], message: "O servidor não depende da interface nem das rotas." }],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
