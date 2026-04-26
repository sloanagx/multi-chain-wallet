declare module "prompt-sync" {
  interface PromptOptions {
    sigint?: boolean;
  }

  interface PromptCallback {
    (query?: string, options?: { echo?: string }): string;
  }

  function promptSync(options?: PromptOptions): PromptCallback;
  export default promptSync;
}
