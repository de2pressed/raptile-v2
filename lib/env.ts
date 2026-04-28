function stripWrappingQuotes(value: string) {
  if (value.length >= 2) {
    const first = value[0];
    const last = value[value.length - 1];

    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      return value.slice(1, -1).trim();
    }
  }

  return value;
}

export function readEnv(name: string) {
  const value = process.env[name];

  if (typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  return stripWrappingQuotes(trimmed);
}

export function readEnvNumber(name: string) {
  const value = readEnv(name);

  return value ? Number(value) : undefined;
}
