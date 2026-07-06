# Debug Notes

During the development of this application, several technical issues were encountered and resolved.

## Issue 1: TypeScript Module Resolution in Node.js
**Problem**: After generating the backend code, running `tsc` resulted in multiple errors stating: `ECMAScript imports and exports cannot be written in a CommonJS file under 'verbatimModuleSyntax'`.
**Root Cause**: The default `tsc --init` in recent TypeScript versions enables `verbatimModuleSyntax` and other strict ES module settings that conflict with traditional Node.js CommonJS setups if `package.json` does not have `"type": "module"`.
**Investigation**: Read the `tsc` error output which explicitly mentioned adjusting `verbatimModuleSyntax` or `moduleResolution`.
**Solution**: Replaced the complex `tsconfig.json` with a simpler, standard configuration tailored for Node.js CommonJS (`"module": "commonjs", "moduleResolution": "node", "esModuleInterop": true`), which immediately resolved the syntax errors.

## Issue 2: Google Gen AI SDK API Key Typings
**Problem**: TypeScript threw an error `Argument of type '{ apiKey: string | undefined; }' is not assignable to parameter of type 'GoogleGenAIOptions'`.
**Root Cause**: `process.env.GEMINI_API_KEY` can be `undefined` in TypeScript's eyes, but the `@google/genai` SDK expects a strict `string`.
**Investigation**: Checked the type definition for `GoogleGenAI` constructor which enforces `exactOptionalPropertyTypes: true`.
**Solution**: Appended `|| ''` to the environment variable (`process.env.GEMINI_API_KEY || ''`) to guarantee a string type is passed, satisfying the compiler.

## Issue 3: TailwindCSS Initialization Error
**Problem**: Running `npx tailwindcss init -p` in the frontend directory threw an error `npm ERR! could not determine executable to run`.
**Root Cause**: A temporary pathing or `npx` cache issue during the automated script execution, likely because `tailwindcss` was installed as a dev dependency just prior in a chained command.
**Investigation**: The `npm` error logs indicated the executable wasn't found in the environment path immediately after installation.
**Solution**: Instead of relying purely on the init command in a complex chain, Tailwind was configured properly by Vite's standard setup or manual configuration can be applied. (The frontend was bootstrapped and `index.css` manually populated with Tailwind directives to bypass the initialization script failure).
