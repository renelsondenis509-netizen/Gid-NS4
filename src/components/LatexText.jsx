import { useState, useEffect } from "react";

let katexReady = false;
let katexQueue = [];

function ensureKatex() {
  if (katexReady) return Promise.resolve();
  if (document.getElementById("katex-css")) return new Promise(r => katexQueue.push(r));
  const link = document.createElement("link");
  link.id = "katex-css"; link.rel = "stylesheet";
  link.href = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css";
  document.head.appendChild(link);
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js";
  script.onload = () => { katexReady = true; katexQueue.forEach(r => r()); katexQueue = []; };
  script.onerror = () => { katexQueue = []; };
  document.head.appendChild(script);
  return new Promise(r => katexQueue.push(r));
}

function sanitizeHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .replace(/<img[^>]+onerror[^>]*>/gi, "")
    .replace(/<object[\s\S]*?<\/object>/gi, "")
    .replace(/<embed[^>]*>/gi, "");
}

function inlineFormat(text) {
  return text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function isTableSeparator(line) {
  return /^\s*\|?[\s:\-|]+\|?\s*$/.test(line) && /-/.test(line);
}

function isTableRow(line) {
  return /^\s*\|.*\|\s*$/.test(line.trim());
}

function splitRow(line) {
  const trimmed = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  return trimmed.split("|").map(c => c.trim());
}

function renderTable(lines) {
  const header = splitRow(lines[0]);
  const rows = lines.slice(2).map(splitRow);
  let html = '<table style="width:100%;border-collapse:collapse;margin:10px 0;font-size:0.92em">';
  html += "<thead><tr>";
  header.forEach(h => { html += `<th style="text-align:left;padding:6px 8px;border-bottom:2px solid #ffffff33;color:#93c5fd">${inlineFormat(h)}</th>`; });
  html += "</tr></thead><tbody>";
  rows.forEach(r => {
    html += "<tr>";
    r.forEach(c => { html += `<td style="padding:6px 8px;border-bottom:1px solid #ffffff15;vertical-align:top">${inlineFormat(c)}</td>`; });
    html += "</tr>";
  });
  html += "</tbody></table>";
  return html;
}

// Convertit le Markdown léger (titres, séparateurs, tableaux) + normalise le LaTeX
// \[...\] / \(...\) vers $$...$$ / $...$, en préservant les blocs math multi-lignes intacts.
function buildHtml(content) {
  const withMath = content
    .replace(/\\\[([\s\S]+?)\\\]/g, (_, e) => `$$${e}$$`)
    .replace(/\\\(([\s\S]+?)\\\)/g, (_, e) => `$${e}$`);

  const mathBlocks = [];
  const withPlaceholders = withMath.replace(/\$\$([\s\S]+?)\$\$/g, (_, e) => {
    mathBlocks.push(e);
    return `\u0000MATHBLOCK${mathBlocks.length - 1}\u0000`;
  });

  const lines = withPlaceholders.split("\n");
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (isTableRow(line) && lines[i + 1] && isTableSeparator(lines[i + 1])) {
      const tableLines = [line, lines[i + 1]];
      let j = i + 2;
      while (j < lines.length && isTableRow(lines[j])) {
        tableLines.push(lines[j]);
        j++;
      }
      out.push(renderTable(tableLines));
      i = j;
      continue;
    }

    if (/^\s*-{3,}\s*$/.test(line)) {
      out.push('<hr style="border:none;border-top:1px solid #ffffff22;margin:12px 0">');
      i++;
      continue;
    }

    const headerMatch = line.match(/^\s*#{1,6}\s+(.+)$/);
    if (headerMatch) {
      out.push(`<div style="font-weight:700;margin:8px 0 4px">${inlineFormat(headerMatch[1])}</div>`);
      i++;
      continue;
    }

    out.push(inlineFormat(line) + (i < lines.length - 1 ? "<br>" : ""));
    i++;
  }

  return out.join("\n").replace(/\u0000MATHBLOCK(\d+)\u0000/g, (_, idx) => `$$${mathBlocks[Number(idx)]}$$`);
}

export function LatexText({ content }) {
  const [html, setHtml] = useState(null);
  const base = buildHtml(content);

  useEffect(() => {
    let cancelled = false;
    if (!/\$/.test(base)) { setHtml(sanitizeHtml(base)); return; }
    ensureKatex().then(() => {
      if (cancelled) return;
      try {
        const result = base
          .replace(/\$\$([\s\S]+?)\$\$/g, (_, e) => {
            try { return window.katex.renderToString(e.trim(), { displayMode:true,  throwOnError:false }); }
            catch { return `<code class="katex-fallback">${e}</code>`; }
          })
          .replace(/\$([^$\n]+?)\$/g, (_, e) => {
            try { return window.katex.renderToString(e.trim(), { displayMode:false, throwOnError:false }); }
            catch { return `<code class="katex-fallback">${e}</code>`; }
          });
        setHtml(sanitizeHtml(result));
      } catch { setHtml(sanitizeHtml(base)); }
    });
    return () => { cancelled = true; };
  }, [base]);

  return (
    <span
      dangerouslySetInnerHTML={{ __html: html ?? sanitizeHtml(base) }}
      style={{ lineHeight: 1.7, display: "block", overflowX: "auto", maxWidth: "100%" }}
    />
  );
}

export function MdText({ text }) {
  return (
    <>
      {text.split("\n").map((line, i, arr) => (
        <span key={i}>
          <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }} />
          {i < arr.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}
