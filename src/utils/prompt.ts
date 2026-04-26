import promptSync from "prompt-sync";

const prompt = promptSync({ sigint: true });

export function promptHidden(question: string): string {
  return prompt(question, { echo: "" });
}

export function promptVisible(question: string): string {
  return prompt(question);
}