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
  document.head.appendChild(script);
  return new Promise(r => katexQueue.push(r));
}

export function LatexText({ content }) {
  const [html, setHtml] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!/\$/.test(content)) { setHtml(null); return; }
    ensureKatex().then(() => {
      if (cancelled) return;
      try {
        const result = content
          .replace(/\$\$([\s\S]+?)\$\$/g, (_, e) => {
            try { return window.katex.renderToString(e.trim(), { displayMode:true,  throwOnError:false }); }
            catch { return `<code class="katex-fallback">${e}</code>`; }
          })
          .replace(/\$([^$\n]+?)\$/g, (_, e) => {
            try { return window.katex.renderToString(e.trim(), { displayMode:false, throwOnError:false }); }
            catch { return `<code class="katex-fallback">${e}</code>`; }
          });
        setHtml(result);
      } catch { setHtml(null); }
    });
    return () => { cancelled = true; };
  }, [content]);

  if (html) return (
    <span dangerouslySetInnerHTML={{ __html: html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }}
      style={{ lineHeight:1.7 }} />
  );
  return (
    <span>
      {content.split("\n").map((line, i, arr) => (
        <span key={i}>
          <span dangerouslySetInnerHTML={{ __html:
            line
              .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
              .replace(/\$\$?([\s\S]+?)\$?\$/g, (_, e) =>
                `<code style="background:#0d2244;color:#93c5fd;padding:1px 4px;border-radius:4px;font-family:monospace;font-size:.85em">${e}</code>`)
          }} />
          {i < arr.length - 1 && <br />}
        </span>
      ))}
    </span>
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
