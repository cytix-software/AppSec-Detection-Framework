/// <reference types="vite/client" />

declare module '*.yml' {
  const content: any;
  export default content;
}

declare module '*.json' {
  const content: any;
  export default content;
}
