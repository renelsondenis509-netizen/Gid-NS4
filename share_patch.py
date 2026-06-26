import re
code = open('src/screens/ExerciceScreen.jsx').read()
old = r'const handleShare = async \(\) => \{.*?\};'
new_fn = '''const handleShare = async () => {
    const note20 = Math.round((score / questions.length) * 20 * 10) / 10;
    const mention = score === questions.length ? "Pafe !" : score >= questions.length / 2 ? "Byen !" : "Kontinye travay !";
    const text = "Gid NS4 - Rezilta Egzesis\\nMatye: " + (scan.subject||"") + "\\nNot: " + score + "/" + questions.length + " (" + note20 + "/20)\\n" + mention + "\\n\\nTelechaje Gid NS4 sou Google Play !";
    if (navigator && navigator.share) {
      try { navigator.share({ title: "Rezilta Gid NS4", text: text }); return; } catch(e) {}
    }
    try { navigator.clipboard.writeText(text).then(function(){ alert("Rezilta kopye ! Ou ka kole li kote ou vle."); }); } catch(e) { alert(text); }
  };'''
result = re.sub(old, new_fn, code, flags=re.DOTALL)
open('src/screens/ExerciceScreen.jsx', 'w').write(result)
print("OK" if result != code else "RIEN CHANGE")
