#!/usr/bin/env node
/*
 * Extract all Puck builder components and their editor configuration source
 * into a single JSON artifact.
 */

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();

function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

function readFile(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function toPosixRelative(filePath) {
  return path.relative(ROOT, filePath).split(path.sep).join("/");
}

function ensurePosix(filePath) {
  return filePath.split(path.sep).join("/");
}

function walk(dir) {
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(full));
    } else {
      out.push(full);
    }
  }
  return out;
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function skipWhitespace(source, index) {
  let i = index;
  while (i < source.length && /\s/.test(source[i])) i += 1;
  return i;
}

function stripLeadingComments(text) {
  let out = text;
  while (true) {
    const before = out;
    out = out.replace(/^\s*\/\/[^\n]*\n?/, "");
    out = out.replace(/^\s*\/\*[\s\S]*?\*\/\s*/, "");
    if (out === before) break;
  }
  return out.trim();
}

function findMatchingBracket(source, startIndex) {
  const open = source[startIndex];
  const pairs = { "{": "}", "[": "]", "(": ")", "<": ">" };
  const close = pairs[open];
  if (!close) return -1;

  let depth = 0;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let inLineComment = false;
  let inBlockComment = false;
  let escaped = false;

  for (let i = startIndex; i < source.length; i += 1) {
    const ch = source[i];
    const next = source[i + 1];

    if (inLineComment) {
      if (ch === "\n") inLineComment = false;
      continue;
    }

    if (inBlockComment) {
      if (ch === "*" && next === "/") {
        inBlockComment = false;
        i += 1;
      }
      continue;
    }

    if (inSingle) {
      if (!escaped && ch === "'") inSingle = false;
      escaped = !escaped && ch === "\\";
      continue;
    }

    if (inDouble) {
      if (!escaped && ch === '"') inDouble = false;
      escaped = !escaped && ch === "\\";
      continue;
    }

    if (inTemplate) {
      if (!escaped && ch === "`") inTemplate = false;
      escaped = !escaped && ch === "\\";
      continue;
    }

    if (ch === "/" && next === "/") {
      inLineComment = true;
      i += 1;
      continue;
    }

    if (ch === "/" && next === "*") {
      inBlockComment = true;
      i += 1;
      continue;
    }

    if (ch === "'") {
      inSingle = true;
      escaped = false;
      continue;
    }

    if (ch === '"') {
      inDouble = true;
      escaped = false;
      continue;
    }

    if (ch === "`") {
      inTemplate = true;
      escaped = false;
      continue;
    }

    if (ch === open) {
      depth += 1;
      continue;
    }

    if (ch === close) {
      depth -= 1;
      if (depth === 0) return i;
      continue;
    }
  }

  return -1;
}

function findExpressionTerminator(source, startIndex, stopChar = ";") {
  let curly = 0;
  let square = 0;
  let paren = 0;

  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let inLineComment = false;
  let inBlockComment = false;
  let escaped = false;

  for (let i = startIndex; i < source.length; i += 1) {
    const ch = source[i];
    const next = source[i + 1];

    if (inLineComment) {
      if (ch === "\n") inLineComment = false;
      continue;
    }

    if (inBlockComment) {
      if (ch === "*" && next === "/") {
        inBlockComment = false;
        i += 1;
      }
      continue;
    }

    if (inSingle) {
      if (!escaped && ch === "'") inSingle = false;
      escaped = !escaped && ch === "\\";
      continue;
    }

    if (inDouble) {
      if (!escaped && ch === '"') inDouble = false;
      escaped = !escaped && ch === "\\";
      continue;
    }

    if (inTemplate) {
      if (!escaped && ch === "`") inTemplate = false;
      escaped = !escaped && ch === "\\";
      continue;
    }

    if (ch === "/" && next === "/") {
      inLineComment = true;
      i += 1;
      continue;
    }

    if (ch === "/" && next === "*") {
      inBlockComment = true;
      i += 1;
      continue;
    }

    if (ch === "'") {
      inSingle = true;
      escaped = false;
      continue;
    }

    if (ch === '"') {
      inDouble = true;
      escaped = false;
      continue;
    }

    if (ch === "`") {
      inTemplate = true;
      escaped = false;
      continue;
    }

    if (ch === "{") curly += 1;
    else if (ch === "}") curly -= 1;
    else if (ch === "[") square += 1;
    else if (ch === "]") square -= 1;
    else if (ch === "(") paren += 1;
    else if (ch === ")") paren -= 1;

    if (ch === stopChar && curly === 0 && square === 0 && paren === 0) {
      return i;
    }
  }

  return source.length - 1;
}

function splitTopLevel(text, delimiter = ",") {
  const parts = [];
  let start = 0;

  let curly = 0;
  let square = 0;
  let paren = 0;

  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let inLineComment = false;
  let inBlockComment = false;
  let escaped = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];

    if (inLineComment) {
      if (ch === "\n") inLineComment = false;
      continue;
    }

    if (inBlockComment) {
      if (ch === "*" && next === "/") {
        inBlockComment = false;
        i += 1;
      }
      continue;
    }

    if (inSingle) {
      if (!escaped && ch === "'") inSingle = false;
      escaped = !escaped && ch === "\\";
      continue;
    }

    if (inDouble) {
      if (!escaped && ch === '"') inDouble = false;
      escaped = !escaped && ch === "\\";
      continue;
    }

    if (inTemplate) {
      if (!escaped && ch === "`") inTemplate = false;
      escaped = !escaped && ch === "\\";
      continue;
    }

    if (ch === "/" && next === "/") {
      inLineComment = true;
      i += 1;
      continue;
    }

    if (ch === "/" && next === "*") {
      inBlockComment = true;
      i += 1;
      continue;
    }

    if (ch === "'") {
      inSingle = true;
      escaped = false;
      continue;
    }

    if (ch === '"') {
      inDouble = true;
      escaped = false;
      continue;
    }

    if (ch === "`") {
      inTemplate = true;
      escaped = false;
      continue;
    }

    if (ch === "{") curly += 1;
    else if (ch === "}") curly -= 1;
    else if (ch === "[") square += 1;
    else if (ch === "]") square -= 1;
    else if (ch === "(") paren += 1;
    else if (ch === ")") paren -= 1;

    if (ch === delimiter && curly === 0 && square === 0 && paren === 0) {
      parts.push(text.slice(start, i));
      start = i + 1;
    }
  }

  parts.push(text.slice(start));
  return parts;
}

function findTopLevelColon(text) {
  let curly = 0;
  let square = 0;
  let paren = 0;

  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let inLineComment = false;
  let inBlockComment = false;
  let escaped = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];

    if (inLineComment) {
      if (ch === "\n") inLineComment = false;
      continue;
    }

    if (inBlockComment) {
      if (ch === "*" && next === "/") {
        inBlockComment = false;
        i += 1;
      }
      continue;
    }

    if (inSingle) {
      if (!escaped && ch === "'") inSingle = false;
      escaped = !escaped && ch === "\\";
      continue;
    }

    if (inDouble) {
      if (!escaped && ch === '"') inDouble = false;
      escaped = !escaped && ch === "\\";
      continue;
    }

    if (inTemplate) {
      if (!escaped && ch === "`") inTemplate = false;
      escaped = !escaped && ch === "\\";
      continue;
    }

    if (ch === "/" && next === "/") {
      inLineComment = true;
      i += 1;
      continue;
    }

    if (ch === "/" && next === "*") {
      inBlockComment = true;
      i += 1;
      continue;
    }

    if (ch === "'") {
      inSingle = true;
      escaped = false;
      continue;
    }

    if (ch === '"') {
      inDouble = true;
      escaped = false;
      continue;
    }

    if (ch === "`") {
      inTemplate = true;
      escaped = false;
      continue;
    }

    if (ch === "{") curly += 1;
    else if (ch === "}") curly -= 1;
    else if (ch === "[") square += 1;
    else if (ch === "]") square -= 1;
    else if (ch === "(") paren += 1;
    else if (ch === ")") paren -= 1;

    if (ch === ":" && curly === 0 && square === 0 && paren === 0) {
      return i;
    }
  }

  return -1;
}

function normalizeObjectKey(keyRaw) {
  const k = keyRaw.trim();

  if ((k.startsWith('"') && k.endsWith('"')) || (k.startsWith("'") && k.endsWith("'"))) {
    return k.slice(1, -1);
  }

  return k;
}

function parseObjectLiteral(objectSource) {
  if (!objectSource) return null;
  const text = objectSource.trim();
  if (!text.startsWith("{") || !text.endsWith("}")) return null;

  const inner = text.slice(1, -1);
  const entries = splitTopLevel(inner, ",");
  const properties = [];

  for (const entry of entries) {
    let part = stripLeadingComments(entry).trim();
    if (!part) continue;

    if (part.startsWith("...")) {
      properties.push({ kind: "spread", raw: part, key: null, value: part.slice(3).trim() });
      continue;
    }

    const colonIndex = findTopLevelColon(part);

    if (colonIndex === -1) {
      const methodMatch = part.match(/^([A-Za-z_$][\w$]*)\s*\(/);
      if (methodMatch) {
        properties.push({
          kind: "method",
          raw: part,
          key: methodMatch[1],
          value: part,
        });
      } else {
        properties.push({
          kind: "shorthand",
          raw: part,
          key: normalizeObjectKey(part),
          value: part,
        });
      }
      continue;
    }

    const keyRaw = part.slice(0, colonIndex).trim();
    const valueRaw = part.slice(colonIndex + 1).trim();

    properties.push({
      kind: "property",
      raw: part,
      key: normalizeObjectKey(keyRaw),
      value: valueRaw,
    });
  }

  return properties;
}

function resolveImportPath(fromFile, specifier) {
  if (!specifier.startsWith(".")) return null;

  const base = path.resolve(path.dirname(fromFile), specifier);
  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.js`,
    `${base}.jsx`,
    path.join(base, "index.ts"),
    path.join(base, "index.tsx"),
    path.join(base, "index.js"),
    path.join(base, "index.jsx"),
  ];

  for (const candidate of candidates) {
    if (fileExists(candidate)) return candidate;
  }

  return null;
}

function parseImportClause(clause, sourcePath) {
  const map = {};
  let c = clause.trim();
  let globalTypeOnly = false;

  if (c.startsWith("type ")) {
    globalTypeOnly = true;
    c = c.slice(5).trim();
  }

  function addImport(local, imported, typeOnly) {
    if (!local) return;
    map[local] = {
      localName: local,
      importedName: imported,
      source: sourcePath,
      typeOnly: Boolean(typeOnly),
    };
  }

  function parseNamed(namedText, inheritedTypeOnly) {
    const trimmed = namedText.trim();
    const body = trimmed.slice(1, -1);
    const specs = splitTopLevel(body, ",");

    for (const specRaw of specs) {
      let spec = specRaw.trim();
      if (!spec) continue;

      let typeOnly = inheritedTypeOnly;
      if (spec.startsWith("type ")) {
        typeOnly = true;
        spec = spec.slice(5).trim();
      }

      const asMatch = spec.match(/^([^\s]+)\s+as\s+([^\s]+)$/);
      if (asMatch) {
        addImport(asMatch[2], asMatch[1], typeOnly);
      } else {
        addImport(spec, spec, typeOnly);
      }
    }
  }

  if (c.startsWith("{")) {
    parseNamed(c, globalTypeOnly);
    return map;
  }

  if (c.startsWith("*")) {
    const nsMatch = c.match(/^\*\s+as\s+([A-Za-z_$][\w$]*)$/);
    if (nsMatch) {
      addImport(nsMatch[1], "*", globalTypeOnly);
    }
    return map;
  }

  const parts = splitTopLevel(c, ",").map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) return map;

  const defaultPart = parts[0];
  if (defaultPart && defaultPart !== "{" && !defaultPart.startsWith("{") && !defaultPart.startsWith("*")) {
    addImport(defaultPart, "default", globalTypeOnly);
  }

  if (parts.length > 1) {
    const rest = parts.slice(1).join(",").trim();
    if (rest.startsWith("{")) {
      parseNamed(rest, globalTypeOnly);
    } else if (rest.startsWith("*")) {
      const nsMatch = rest.match(/^\*\s+as\s+([A-Za-z_$][\w$]*)$/);
      if (nsMatch) {
        addImport(nsMatch[1], "*", globalTypeOnly);
      }
    }
  }

  return map;
}

function parseModule(filePath) {
  const source = readFile(filePath);

  const imports = {};
  const importRegex = /import\s+([\s\S]*?)\s+from\s+["']([^"']+)["'];/g;
  let importMatch;
  while ((importMatch = importRegex.exec(source))) {
    const clause = importMatch[1];
    const sourcePath = importMatch[2];
    const parsed = parseImportClause(clause, sourcePath);
    Object.assign(imports, parsed);
  }

  const exportFrom = [];
  const exportFromRegex = /export\s+\{([\s\S]*?)\}\s+from\s+["']([^"']+)["'];/g;
  let exportFromMatch;
  while ((exportFromMatch = exportFromRegex.exec(source))) {
    const specsRaw = exportFromMatch[1];
    const sourcePath = exportFromMatch[2];
    const specs = splitTopLevel(specsRaw, ",");

    for (let raw of specs) {
      raw = raw.trim();
      if (!raw) continue;

      let typeOnly = false;
      if (raw.startsWith("type ")) {
        typeOnly = true;
        raw = raw.slice(5).trim();
      }

      const asMatch = raw.match(/^([^\s]+)\s+as\s+([^\s]+)$/);
      if (asMatch) {
        exportFrom.push({
          exportedName: asMatch[2],
          importedName: asMatch[1],
          source: sourcePath,
          typeOnly,
        });
      } else {
        exportFrom.push({
          exportedName: raw,
          importedName: raw,
          source: sourcePath,
          typeOnly,
        });
      }
    }
  }

  const exportStars = [];
  const exportStarRegex = /export\s+\*\s+from\s+["']([^"']+)["'];/g;
  let exportStarMatch;
  while ((exportStarMatch = exportStarRegex.exec(source))) {
    exportStars.push({ source: exportStarMatch[1] });
  }

  return {
    filePath,
    source,
    imports,
    exportFrom,
    exportStars,
  };
}

const moduleCache = new Map();
function getModule(filePath) {
  if (!moduleCache.has(filePath)) {
    moduleCache.set(filePath, parseModule(filePath));
  }
  return moduleCache.get(filePath);
}

function findConstDeclaration(source, name) {
  const regex = new RegExp(`(?:export\\s+)?const\\s+${escapeRegExp(name)}\\b`, "g");
  let match;

  while ((match = regex.exec(source))) {
    const start = match.index;
    let i = start + match[0].length;

    let inSingle = false;
    let inDouble = false;
    let inTemplate = false;
    let inLineComment = false;
    let inBlockComment = false;
    let escaped = false;
    let curly = 0;
    let square = 0;
    let paren = 0;

    let eqIndex = -1;

    for (; i < source.length; i += 1) {
      const ch = source[i];
      const next = source[i + 1];

      if (inLineComment) {
        if (ch === "\n") inLineComment = false;
        continue;
      }

      if (inBlockComment) {
        if (ch === "*" && next === "/") {
          inBlockComment = false;
          i += 1;
        }
        continue;
      }

      if (inSingle) {
        if (!escaped && ch === "'") inSingle = false;
        escaped = !escaped && ch === "\\";
        continue;
      }

      if (inDouble) {
        if (!escaped && ch === '"') inDouble = false;
        escaped = !escaped && ch === "\\";
        continue;
      }

      if (inTemplate) {
        if (!escaped && ch === "`") inTemplate = false;
        escaped = !escaped && ch === "\\";
        continue;
      }

      if (ch === "/" && next === "/") {
        inLineComment = true;
        i += 1;
        continue;
      }

      if (ch === "/" && next === "*") {
        inBlockComment = true;
        i += 1;
        continue;
      }

      if (ch === "'") {
        inSingle = true;
        escaped = false;
        continue;
      }

      if (ch === '"') {
        inDouble = true;
        escaped = false;
        continue;
      }

      if (ch === "`") {
        inTemplate = true;
        escaped = false;
        continue;
      }

      if (ch === "{") curly += 1;
      else if (ch === "}") curly -= 1;
      else if (ch === "[") square += 1;
      else if (ch === "]") square -= 1;
      else if (ch === "(") paren += 1;
      else if (ch === ")") paren -= 1;

      if (ch === "=" && curly === 0 && square === 0 && paren === 0) {
        eqIndex = i;
        break;
      }

      if (ch === ";" && curly === 0 && square === 0 && paren === 0) {
        break;
      }
    }

    if (eqIndex === -1) continue;

    const typeAnnotation = source.slice(start + match[0].length, eqIndex).trim();
    const exprStart = eqIndex + 1;
    const exprEnd = findExpressionTerminator(source, exprStart, ";");
    const initializer = source.slice(exprStart, exprEnd).trim();
    const declarationSource = source.slice(start, Math.min(source.length, exprEnd + 1)).trim();

    return {
      name,
      start,
      end: exprEnd,
      typeAnnotation,
      initializer,
      declarationSource,
    };
  }

  return null;
}

function findFunctionDeclaration(source, name) {
  const regex = new RegExp(`(?:export\\s+)?function\\s+${escapeRegExp(name)}\\b`, "g");
  const match = regex.exec(source);
  if (!match) return null;

  const start = match.index;
  const braceIndex = source.indexOf("{", start);
  if (braceIndex === -1) return null;

  const endBrace = findMatchingBracket(source, braceIndex);
  if (endBrace === -1) return null;

  const declarationSource = source.slice(start, endBrace + 1).trim();
  return {
    name,
    start,
    end: endBrace,
    declarationSource,
  };
}

function findDefaultExport(source) {
  const idx = source.search(/export\s+default\s+/);
  if (idx === -1) return null;

  const start = idx;
  const exprStart = source.indexOf("default", start) + "default".length;
  const realExprStart = skipWhitespace(source, exprStart);
  const exprEnd = findExpressionTerminator(source, realExprStart, ";");
  const expression = source.slice(realExprStart, exprEnd).trim();
  const declarationSource = source.slice(start, Math.min(source.length, exprEnd + 1)).trim();

  return {
    expression,
    declarationSource,
    start,
    end: exprEnd,
  };
}

function findTypeAliasDeclaration(source, name) {
  const regex = new RegExp(`(?:export\\s+)?type\\s+${escapeRegExp(name)}\\b`, "g");
  const match = regex.exec(source);
  if (!match) return null;

  const start = match.index;
  const eqIndex = source.indexOf("=", start);
  if (eqIndex === -1) return null;

  const end = findExpressionTerminator(source, eqIndex + 1, ";");
  const declarationSource = source.slice(start, Math.min(source.length, end + 1)).trim();

  return {
    name,
    start,
    end,
    declarationSource,
  };
}

function findInterfaceDeclaration(source, name) {
  const regex = new RegExp(`(?:export\\s+)?interface\\s+${escapeRegExp(name)}\\b`, "g");
  const match = regex.exec(source);
  if (!match) return null;

  const start = match.index;
  const braceIndex = source.indexOf("{", start);
  if (braceIndex === -1) return null;

  const endBrace = findMatchingBracket(source, braceIndex);
  if (endBrace === -1) return null;

  const declarationSource = source.slice(start, endBrace + 1).trim();
  return {
    name,
    start,
    end: endBrace,
    declarationSource,
  };
}

function stripOuterParens(text) {
  let out = text.trim();
  while (out.startsWith("(") && out.endsWith(")")) {
    const end = findMatchingBracket(out, 0);
    if (end === out.length - 1) {
      out = out.slice(1, -1).trim();
    } else {
      break;
    }
  }
  return out;
}

function findLastTopLevelAsIndex(text) {
  let last = -1;

  let curly = 0;
  let square = 0;
  let paren = 0;

  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let inLineComment = false;
  let inBlockComment = false;
  let escaped = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];

    if (inLineComment) {
      if (ch === "\n") inLineComment = false;
      continue;
    }

    if (inBlockComment) {
      if (ch === "*" && next === "/") {
        inBlockComment = false;
        i += 1;
      }
      continue;
    }

    if (inSingle) {
      if (!escaped && ch === "'") inSingle = false;
      escaped = !escaped && ch === "\\";
      continue;
    }

    if (inDouble) {
      if (!escaped && ch === '"') inDouble = false;
      escaped = !escaped && ch === "\\";
      continue;
    }

    if (inTemplate) {
      if (!escaped && ch === "`") inTemplate = false;
      escaped = !escaped && ch === "\\";
      continue;
    }

    if (ch === "/" && next === "/") {
      inLineComment = true;
      i += 1;
      continue;
    }

    if (ch === "/" && next === "*") {
      inBlockComment = true;
      i += 1;
      continue;
    }

    if (ch === "'") {
      inSingle = true;
      escaped = false;
      continue;
    }

    if (ch === '"') {
      inDouble = true;
      escaped = false;
      continue;
    }

    if (ch === "`") {
      inTemplate = true;
      escaped = false;
      continue;
    }

    if (ch === "{") curly += 1;
    else if (ch === "}") curly -= 1;
    else if (ch === "[") square += 1;
    else if (ch === "]") square -= 1;
    else if (ch === "(") paren += 1;
    else if (ch === ")") paren -= 1;

    if (curly === 0 && square === 0 && paren === 0) {
      if (text.slice(i, i + 2) === "as") {
        const prev = i === 0 ? "" : text[i - 1];
        const after = i + 2 >= text.length ? "" : text[i + 2];
        const prevOk = !/[A-Za-z0-9_$]/.test(prev || "");
        const afterOk = !/[A-Za-z0-9_$]/.test(after || "");
        if (prevOk && afterOk) {
          last = i;
        }
      }
    }
  }

  return last;
}

function stripTrailingTypeAssertion(text) {
  let out = text.trim();

  while (true) {
    const asIndex = findLastTopLevelAsIndex(out);
    if (asIndex === -1) break;

    const before = out.slice(0, asIndex).trimEnd();
    const after = out.slice(asIndex + 2).trimStart();

    if (!before || !after) break;

    out = before;
  }

  return out;
}

function tryExtractObjectLiteral(expression) {
  const stripped = stripTrailingTypeAssertion(stripOuterParens(expression));
  const text = stripped.trim();
  if (!text.startsWith("{")) return null;
  const end = findMatchingBracket(text, 0);
  if (end === -1) return null;
  if (end !== text.length - 1) return null;
  return text;
}

function parseSimpleCallExpression(expression) {
  const text = stripTrailingTypeAssertion(stripOuterParens(expression));
  const open = text.indexOf("(");
  if (open === -1 || !text.endsWith(")")) return null;

  const callee = text.slice(0, open).trim();
  if (!/^[A-Za-z_$][\w$]*$/.test(callee)) return null;

  const close = findMatchingBracket(text, open);
  if (close !== text.length - 1) return null;

  const argText = text.slice(open + 1, close);
  const args = splitTopLevel(argText, ",").map((s) => s.trim()).filter(Boolean);

  return { callee, args };
}

function extractGenericArgument(typeText, genericName) {
  const idx = typeText.indexOf(`${genericName}<`);
  if (idx === -1) return null;

  const start = idx + genericName.length;
  if (typeText[start] !== "<") return null;

  let depth = 0;
  for (let i = start; i < typeText.length; i += 1) {
    const ch = typeText[i];
    if (ch === "<") depth += 1;
    if (ch === ">") {
      depth -= 1;
      if (depth === 0) {
        return typeText.slice(start + 1, i).trim();
      }
    }
  }

  return null;
}

function extractTypeIdentifiers(typeExpression) {
  if (!typeExpression) return [];

  const ids = new Set();
  const regex = /\b[A-Za-z_$][\w$]*\b/g;
  const blacklist = new Set([
    "type",
    "interface",
    "extends",
    "keyof",
    "readonly",
    "partial",
    "record",
    "string",
    "number",
    "boolean",
    "null",
    "undefined",
    "unknown",
    "any",
    "never",
    "true",
    "false",
    "infer",
    "as",
    "const",
    "Pick",
    "Omit",
    "Required",
    "Partial",
    "Record",
    "Array",
    "Promise",
    "ReactNode",
  ]);

  let m;
  while ((m = regex.exec(typeExpression))) {
    const token = m[0];
    if (blacklist.has(token)) continue;
    if (!/^[A-Z]/.test(token)) continue;
    ids.add(token);
  }

  return [...ids];
}

function findTypePropertyFromObjectType(typeDeclarationSource, propertyName) {
  const eq = typeDeclarationSource.indexOf("=");
  if (eq === -1) return null;
  const rhs = typeDeclarationSource.slice(eq + 1).trim();
  const obj = tryExtractObjectLiteral(rhs.endsWith(";") ? rhs.slice(0, -1) : rhs);
  if (!obj) return null;

  const props = parseObjectLiteral(obj);
  if (!props) return null;

  for (const p of props) {
    if (p.key === propertyName) {
      return p.value;
    }
  }

  return null;
}

function resolveTypeSymbol(filePath, typeName, visited = new Set()) {
  const key = `${filePath}::type::${typeName}`;
  if (visited.has(key)) {
    return { file: toPosixRelative(filePath), typeName, circular: true };
  }
  visited.add(key);

  const mod = getModule(filePath);

  const typeAlias = findTypeAliasDeclaration(mod.source, typeName);
  if (typeAlias) {
    return {
      file: toPosixRelative(filePath),
      typeName,
      declarationSource: typeAlias.declarationSource,
    };
  }

  const iface = findInterfaceDeclaration(mod.source, typeName);
  if (iface) {
    return {
      file: toPosixRelative(filePath),
      typeName,
      declarationSource: iface.declarationSource,
    };
  }

  const importInfo = mod.imports[typeName];
  if (importInfo) {
    const target = resolveImportPath(filePath, importInfo.source);
    if (target) {
      return {
        file: toPosixRelative(filePath),
        typeName,
        importedFrom: {
          source: importInfo.source,
          importedName: importInfo.importedName,
          targetFile: toPosixRelative(target),
        },
        resolved: resolveTypeSymbol(target, importInfo.importedName, visited),
      };
    }
  }

  for (const exp of mod.exportFrom) {
    if (exp.exportedName !== typeName) continue;
    const target = resolveImportPath(filePath, exp.source);
    if (!target) continue;

    return {
      file: toPosixRelative(filePath),
      typeName,
      reExportFrom: {
        source: exp.source,
        importedName: exp.importedName,
        targetFile: toPosixRelative(target),
      },
      resolved: resolveTypeSymbol(target, exp.importedName, visited),
    };
  }

  for (const star of mod.exportStars) {
    const target = resolveImportPath(filePath, star.source);
    if (!target) continue;
    const resolved = resolveTypeSymbol(target, typeName, new Set(visited));
    if (!resolved || resolved.unresolved) continue;

    return {
      file: toPosixRelative(filePath),
      typeName,
      reExportStarFrom: {
        source: star.source,
        targetFile: toPosixRelative(target),
      },
      resolved,
    };
  }

  return {
    file: toPosixRelative(filePath),
    typeName,
    unresolved: true,
  };
}

function resolvePropsTypesForDeclaration(filePath, symbolName, typeAnnotation, expression, visited) {
  const details = {
    propsTypeExpression: null,
    propsTypeDeclarations: [],
  };

  const typeText = (typeAnnotation || "").trim();
  let propsTypeExpression =
    extractGenericArgument(typeText, "ComponentConfig") ||
    extractGenericArgument(typeText, "PuckComponent");

  if (!propsTypeExpression) {
    const fallbackName = `${symbolName}Props`;
    const tryLocal = resolveTypeSymbol(filePath, fallbackName);
    if (tryLocal && !tryLocal.unresolved) {
      propsTypeExpression = fallbackName;
    }
  }

  if (!propsTypeExpression) {
    const call = parseSimpleCallExpression(expression || "");
    if (call && call.args.length > 0 && /^[A-Za-z_$][\w$]*$/.test(call.args[0])) {
      const nested = resolveValueSymbol(filePath, call.args[0], visited);
      if (nested && nested.propsTypeExpression) {
        propsTypeExpression = nested.propsTypeExpression;
      }
    }
  }

  details.propsTypeExpression = propsTypeExpression;

  const identifiers = extractTypeIdentifiers(propsTypeExpression || "");
  for (const id of identifiers) {
    details.propsTypeDeclarations.push(resolveTypeSymbol(filePath, id));
  }

  return details;
}

function resolveValueSymbol(filePath, symbolName, visited = new Set()) {
  const key = `${filePath}::value::${symbolName}`;
  if (visited.has(key)) {
    return {
      file: toPosixRelative(filePath),
      symbolName,
      circular: true,
    };
  }
  visited.add(key);

  const mod = getModule(filePath);

  if (symbolName === "default") {
    const def = findDefaultExport(mod.source);
    if (def) {
      const info = {
        file: toPosixRelative(filePath),
        symbolName,
        declarationSource: def.declarationSource,
        definitionExpression: def.expression,
        moduleSource: mod.source,
      };

      if (/^[A-Za-z_$][\w$]*$/.test(def.expression)) {
        info.aliasTarget = resolveValueSymbol(filePath, def.expression, visited);
      }

      return info;
    }
  }

  const constDecl = findConstDeclaration(mod.source, symbolName);
  if (constDecl) {
    const objectLiteral = tryExtractObjectLiteral(constDecl.initializer);
    const objectProperties = objectLiteral
      ? parseObjectLiteral(objectLiteral)?.map((p) => ({
          kind: p.kind,
          key: p.key,
          valueExpression: p.value,
          raw: p.raw,
        }))
      : null;

    const props = resolvePropsTypesForDeclaration(
      filePath,
      symbolName,
      constDecl.typeAnnotation,
      constDecl.initializer,
      visited
    );

    const info = {
      file: toPosixRelative(filePath),
      symbolName,
      declarationSource: constDecl.declarationSource,
      typeAnnotation: constDecl.typeAnnotation,
      definitionExpression: constDecl.initializer,
      componentConfigObjectSource: objectLiteral,
      componentConfigProperties: objectProperties,
      propsTypeExpression: props.propsTypeExpression,
      propsTypeDeclarations: props.propsTypeDeclarations,
      moduleSource: mod.source,
    };

    const initExpr = stripTrailingTypeAssertion(stripOuterParens(constDecl.initializer));

    if (/^[A-Za-z_$][\w$]*$/.test(initExpr)) {
      info.aliasTarget = resolveValueSymbol(filePath, initExpr, visited);
      return info;
    }

    const call = parseSimpleCallExpression(initExpr);
    if (call) {
      info.wrapperCall = call;
      if (call.args.length > 0 && /^[A-Za-z_$][\w$]*$/.test(call.args[0])) {
        info.wrapperBase = resolveValueSymbol(filePath, call.args[0], visited);
      }
    }

    return info;
  }

  const functionDecl = findFunctionDeclaration(mod.source, symbolName);
  if (functionDecl) {
    return {
      file: toPosixRelative(filePath),
      symbolName,
      declarationSource: functionDecl.declarationSource,
      moduleSource: mod.source,
      kind: "function",
    };
  }

  const importInfo = mod.imports[symbolName];
  if (importInfo && !importInfo.typeOnly) {
    const target = resolveImportPath(filePath, importInfo.source);
    if (target) {
      return {
        file: toPosixRelative(filePath),
        symbolName,
        importedFrom: {
          source: importInfo.source,
          importedName: importInfo.importedName,
          targetFile: toPosixRelative(target),
        },
        resolved: resolveValueSymbol(target, importInfo.importedName, visited),
      };
    }
  }

  for (const exp of mod.exportFrom) {
    if (exp.exportedName !== symbolName || exp.typeOnly) continue;
    const target = resolveImportPath(filePath, exp.source);
    if (!target) continue;

    return {
      file: toPosixRelative(filePath),
      symbolName,
      reExportFrom: {
        source: exp.source,
        importedName: exp.importedName,
        targetFile: toPosixRelative(target),
      },
      resolved: resolveValueSymbol(target, exp.importedName, visited),
    };
  }

  for (const star of mod.exportStars) {
    const target = resolveImportPath(filePath, star.source);
    if (!target) continue;

    const resolved = resolveValueSymbol(target, symbolName, new Set(visited));
    if (!resolved || resolved.unresolved) continue;

    return {
      file: toPosixRelative(filePath),
      symbolName,
      reExportStarFrom: {
        source: star.source,
        targetFile: toPosixRelative(target),
      },
      resolved,
    };
  }

  return {
    file: toPosixRelative(filePath),
    symbolName,
    unresolved: true,
  };
}

function findConfigDeclaration(filePath) {
  const mod = getModule(filePath);
  const source = mod.source;

  const constNames = [];
  const constRegex = /(?:export\s+)?const\s+([A-Za-z_$][\w$]*)\b/g;
  let m;
  while ((m = constRegex.exec(source))) {
    const constName = m[1];
    if (!constNames.includes(constName)) constNames.push(constName);
  }

  const prioritized = ["config", "conf", ...constNames.filter((n) => n !== "config" && n !== "conf")];

  for (const name of prioritized) {
    const decl = findConstDeclaration(source, name);
    if (!decl) continue;

    const objectLiteral = tryExtractObjectLiteral(decl.initializer);
    if (!objectLiteral) continue;

    const props = parseObjectLiteral(objectLiteral);
    if (!props) continue;

    const hasComponents = props.some((p) => p.key === "components");
    if (!hasComponents) continue;

    return {
      name,
      declaration: decl,
      objectLiteral,
      properties: props,
    };
  }

  return null;
}

function findProperty(properties, key) {
  return properties.find((p) => p.key === key && p.kind !== "spread") || null;
}

function buildComponentEntry(configFile, componentProp, configContext) {
  const name = componentProp.key;
  const referenceExpression = componentProp.value;

  const entry = {
    componentName: name,
    referenceExpression,
  };

  const ref = stripTrailingTypeAssertion(stripOuterParens(referenceExpression));

  if (/^[A-Za-z_$][\w$]*$/.test(ref)) {
    const imp = configContext.module.imports[ref];
    if (imp && !imp.typeOnly) {
      const target = resolveImportPath(configFile, imp.source);
      entry.reference = {
        kind: "import",
        source: imp.source,
        importedName: imp.importedName,
        localName: imp.localName,
        resolvedFile: target ? toPosixRelative(target) : null,
      };
      if (target) {
        entry.definition = resolveValueSymbol(target, imp.importedName);
      }
    } else {
      entry.reference = {
        kind: "local",
        symbolName: ref,
      };
      entry.definition = resolveValueSymbol(configFile, ref);
    }
  } else {
    entry.reference = {
      kind: "inline-expression",
    };
    entry.inlineDefinitionExpression = referenceExpression;

    const inlineObject = tryExtractObjectLiteral(referenceExpression);
    if (inlineObject) {
      entry.inlineDefinitionObjectSource = inlineObject;
      entry.inlineDefinitionProperties = parseObjectLiteral(inlineObject)?.map((p) => ({
        kind: p.kind,
        key: p.key,
        valueExpression: p.value,
        raw: p.raw,
      }));
    }
  }

  if (!entry.definition) {
    const configTypeArg =
      extractGenericArgument(configContext.configDeclaration.typeAnnotation || "", "Config") ||
      extractGenericArgument(configContext.configDeclaration.typeAnnotation || "", "UserConfig");

    if (configTypeArg && /^[A-Za-z_$][\w$]*$/.test(configTypeArg)) {
      const typeDecl = resolveTypeSymbol(configFile, configTypeArg);
      entry.propsTypeFromConfig = {
        configTypeExpression: configTypeArg,
        declaration: typeDecl,
      };

      if (typeDecl && typeDecl.declarationSource) {
        entry.propsTypeFromConfig.componentPropertyTypeExpression = findTypePropertyFromObjectType(
          typeDecl.declarationSource,
          name
        );
      }
    }
  }

  return entry;
}

function collectConfigFiles() {
  const files = [];

  const recipesRoot = path.join(ROOT, "recipes");
  if (fs.existsSync(recipesRoot)) {
    const recipeFiles = walk(recipesRoot).filter(
      (f) => path.basename(f) === "puck.config.tsx"
    );
    files.push(...recipeFiles);
  }

  const demoIndex = path.join(ROOT, "apps", "demo", "config", "index.tsx");
  const demoServer = path.join(ROOT, "apps", "demo", "config", "server.tsx");

  if (fileExists(demoIndex)) files.push(demoIndex);
  if (fileExists(demoServer)) files.push(demoServer);

  const unique = [...new Set(files)];
  unique.sort((a, b) => ensurePosix(a).localeCompare(ensurePosix(b)));
  return unique;
}

function main() {
  const configFiles = collectConfigFiles();

  const output = {
    generatedAt: new Date().toISOString(),
    workspaceRoot: ensurePosix(ROOT),
    extractionStrategy:
      "Source-preserving extraction of Puck config/component/type declarations with import/re-export resolution.",
    configFiles: configFiles.map((f) => toPosixRelative(f)),
    configs: [],
    summary: {
      configCount: 0,
      componentCount: 0,
    },
  };

  let totalComponents = 0;

  for (const configFile of configFiles) {
    const configDecl = findConfigDeclaration(configFile);
    if (!configDecl) {
      output.configs.push({
        configFile: toPosixRelative(configFile),
        error: "No config declaration with top-level components found",
      });
      continue;
    }

    const mod = getModule(configFile);

    const rootProp = findProperty(configDecl.properties, "root");
    const categoriesProp = findProperty(configDecl.properties, "categories");
    const componentsProp = findProperty(configDecl.properties, "components");

    let components = [];
    if (componentsProp) {
      const componentObj = tryExtractObjectLiteral(componentsProp.value);
      if (componentObj) {
        const componentProps = parseObjectLiteral(componentObj) || [];
        components = componentProps
          .filter((p) => p.key && p.kind !== "spread")
          .map((p) => buildComponentEntry(configFile, p, {
            module: mod,
            configDeclaration: configDecl.declaration,
          }));
      }
    }

    totalComponents += components.length;

    output.configs.push({
      configFile: toPosixRelative(configFile),
      configVariable: configDecl.name,
      configDeclarationSource: configDecl.declaration.declarationSource,
      configTypeAnnotation: configDecl.declaration.typeAnnotation,
      configObjectSource: configDecl.objectLiteral,
      rootExpression: rootProp ? rootProp.value : null,
      categoriesExpression: categoriesProp ? categoriesProp.value : null,
      categoriesObjectSource: categoriesProp
        ? tryExtractObjectLiteral(categoriesProp.value)
        : null,
      componentsExpression: componentsProp ? componentsProp.value : null,
      componentsObjectSource: componentsProp
        ? tryExtractObjectLiteral(componentsProp.value)
        : null,
      components,
    });
  }

  output.summary.configCount = output.configs.length;
  output.summary.componentCount = totalComponents;

  const outPath = path.join(ROOT, "puck-components.extracted.json");
  fs.writeFileSync(outPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");

  process.stdout.write(
    `Wrote ${toPosixRelative(outPath)} with ${output.summary.componentCount} components across ${output.summary.configCount} configs.\n`
  );
}

main();
