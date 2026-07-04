function cleanLatexExpr(expr) {
  return expr
    .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, "$1 sur $2")
    .replace(/\\sqrt\{([^}]*)\}/g, "racine de $1")
    .replace(/\\times/g, " fois ").replace(/\\cdot/g, " fois ")
    .replace(/\\pm/g, " plus ou moins ").replace(/\\geq/g, " supérieur ou égal à ")
    .replace(/\\leq/g, " inférieur ou égal à ").replace(/\\neq/g, " différent de ")
    .replace(/\\infty/g, " infini ").replace(/\\alpha/g, " alpha ")
    .replace(/\\beta/g, " bêta ").replace(/\\pi/g, " pi ")
    .replace(/\\theta/g, " thêta ").replace(/\\[a-zA-Z]+/g, " ")
    .replace(/\^2/g, " au carré").replace(/\^3/g, " au cube")
    .replace(/\^\{([^}]*)\}/g, " exposant $1 ").replace(/\_\{([^}]*)\}/g, " indice $1 ")
    .replace(/[{}]/g, "").replace(/\s+/g, " ").trim();
}

export function cleanForTTS(text) {
  if (!text) return "";
  return text
    .replace(/\$\$([\s\S]*?)\$\$/g, (_, e) => " " + cleanLatexExpr(e) + " ")
    .replace(/\$(.*?)\$/g,           (_, e) => " " + cleanLatexExpr(e) + " ")
    .replace(/\*\*(.*?)\*\*/g, "$1") // gras → texte nu
    .replace(/\*(.*?)\*/g, "$1")     // italique → texte nu
    .replace(/[#*_~`>]/g, "")        // résidus Markdown
    .replace(/\n{2,}/g, ". ")
    .replace(/\n/g, ", ")
    .replace(/\s{2,}/g, " ")
    .trim();
}
