#!/usr/bin/env python3
"""
Corrige l'erreur "localStorage.clear is not a function" observée sous
Termux/Android : jsdom n'y fournit pas un localStorage complet.
Ajoute un localStorage de test en mémoire (déterministe, indépendant
de la plateforme) et le branche dans vite.config.js.

À exécuter APRES apply_test_fixes.py, depuis la racine du dépôt Gid-NS4 :
  python3 apply_localstorage_fix.py
"""
import os
import sys

patches = [
("vite.config.js",
 '  test: {\n    // supabase/functions/** contient des tests Deno (run_tests.sh), pas Vitest.\n    exclude: ["**/node_modules/**", "supabase/functions/**"],\n    environment: "jsdom",\n  },',
 '  test: {\n    // supabase/functions/** contient des tests Deno (run_tests.sh), pas Vitest.\n    exclude: ["**/node_modules/**", "supabase/functions/**"],\n    environment: "jsdom",\n    setupFiles: ["./src/tests/setup.js"],\n  },'),
]

new_files = {
"src/tests/setup.js": r"""// Fournit un localStorage en mémoire, complet et déterministe, pour les tests.
// Évite de dépendre de l'implémentation fournie par jsdom/Node, qui varie
// selon la plateforme (observé incomplet — sans .clear() — sous Termux/Android).
class MemoryStorage {
  constructor() {
    this._store = new Map();
  }
  getItem(key) {
    return this._store.has(key) ? this._store.get(key) : null;
  }
  setItem(key, value) {
    this._store.set(String(key), String(value));
  }
  removeItem(key) {
    this._store.delete(key);
  }
  clear() {
    this._store.clear();
  }
  key(index) {
    return Array.from(this._store.keys())[index] ?? null;
  }
  get length() {
    return this._store.size;
  }
}

globalThis.localStorage = new MemoryStorage();
""",
}

success, errors = 0, 0

for filepath, find, replace in patches:
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        if find not in content:
            print(f"  DEJA APPLIQUE OU INTROUVABLE: {filepath}")
            errors += 1
            continue
        content = content.replace(find, replace, 1)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"  OK (patch): {filepath}")
        success += 1
    except FileNotFoundError:
        print(f"  ABSENT: {filepath}")
        errors += 1
    except Exception as e:
        print(f"  ERREUR {filepath}: {e}")
        errors += 1

for filepath, content in new_files.items():
    try:
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"  OK (nouveau fichier): {filepath}")
        success += 1
    except Exception as e:
        print(f"  ERREUR {filepath}: {e}")
        errors += 1

print(f"\n{success} OK, {errors} erreurs.")
if errors:
    sys.exit(1)
