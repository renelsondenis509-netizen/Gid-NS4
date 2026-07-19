// Pile globale de gestionnaires "retour" pour les modales/overlays.
// Permet au bouton retour Android matériel de fermer une modale ouverte
// avant de naviguer entre écrans.

let stack = [];

export function pushBackHandler(handler) {
  stack.push(handler);
}

export function popBackHandler(handler) {
  stack = stack.filter(h => h !== handler);
}

export function triggerTopBackHandler() {
  if (stack.length === 0) return false;
  const top = stack[stack.length - 1];
  top();
  return true;
}
