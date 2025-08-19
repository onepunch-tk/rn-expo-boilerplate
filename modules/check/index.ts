// Reexport the native module. On web, it will be resolved to CheckModule.web.ts
// and on native platforms to CheckModule.ts
export { default } from './src/CheckModule';
export { default as CheckView } from './src/CheckView';
export * from  './src/Check.types';
