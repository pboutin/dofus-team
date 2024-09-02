export default function getAdditionalArgument<T>(key: string) {
  const argFlag = `--${key}=`;
  const match = window.process.argv.find((arg) => arg.startsWith(argFlag));

  if (!match) {
    throw new Error(`Additional argument "${key} not found. Be sure to add it to _base.window.ts"`);
  }

  return match[1] as T;
}
