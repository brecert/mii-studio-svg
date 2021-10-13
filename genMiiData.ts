const transformName = (name: string) => {
  return `--mii${name.charAt(0).toUpperCase()}${name.slice(1)}`;
};

const transformValue = (value: number | boolean): number => {
  if (typeof value === "boolean") {
    console.log("e");
    return value === true ? 1 : -1;
  }

  return value;
};

export function toCSSVars(mii: Record<string, number | boolean>) {
  Object.entries(mii)
    .map(([name, value]) =>
      [transformName(name), transformValue(value)].join(": ")
    )
    .join(";\n") + ";";
}
