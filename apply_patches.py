#!/usr/bin/env python3
import sys

patches = [

# ── ChatScreen.jsx L303 — EnvelopeIcon vert
("src/screens/ChatScreen.jsx",
 'background:"rgba(37,99,235,0.1)", border:"1px solid rgba(37,99,235,0.25)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#60a5fa", flexShrink:0, opacity:1',
 'background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.25)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#22c55e", flexShrink:0, opacity:1'),

# ── ChatScreen.jsx L312 — cercle SVG vert
("src/screens/ChatScreen.jsx",
 'stroke={allDone ? "#374151" : "#2563eb"}',
 'stroke={allDone ? "#374151" : "#22c55e"}'),

# ── ChatScreen.jsx L321 — chiffres compteur verts
("src/screens/ChatScreen.jsx",
 'color:"#60a5fa",lineHeight:1}}>{scansUsed}</span><span style={{fontSize:13,fontWeight:900,color:"#3b82f6",lineHeight:1}}>/{DAILY_MAX}',
 'color:"#22c55e",lineHeight:1}}>{scansUsed}</span><span style={{fontSize:13,fontWeight:900,color:"#16a34a",lineHeight:1}}>/{DAILY_MAX}'),

# ── ChatScreen.jsx L324 — label REKÈT vert
("src/screens/ChatScreen.jsx",
 'fontSize:10, color:"#4b6cb7", fontWeight:700, letterSpacing:"0.05em" }}>REKÈT',
 'fontSize:10, color:"#22c55e", fontWeight:700, letterSpacing:"0.05em" }}>REKÈT'),

# ── ChatScreen.jsx L253 — TTS chunked
("src/screens/ChatScreen.jsx",
 '  const speak = async (text) => {\n    const cleaned = text.replace(/\\*\\*(.*?)\\*\\*/g,"$1").replace(/[#*_~`]/g,"").replace(/\\$[^$]*\\$/g,"formule").slice(0,500).trim();\n    try { await TextToSpeech.stop(); } catch {}\n    try {\n      await TextToSpeech.speak({ text: cleaned, lang: "fr-FR", rate: 0.9, pitch: 1.0, volume: 1.0 });\n    } catch(e) { console.warn("TTS:", e); }\n  };',
 '  const speak = async (text) => {\n    const cleaned = text.replace(/\\*\\*(.*?)\\*\\*/g,"$1").replace(/[#*_~`]/g,"").replace(/\\$[^$]*\\$/g,"formule").replace(/\\n{2,}/g,". ").replace(/\\n/g,", ").trim();\n    try { await TextToSpeech.stop(); } catch {}\n    const sentences = cleaned.split(/(?<=[.!?;])\\s+/);\n    const chunks = [];\n    let cur = "";\n    for (const s of sentences) {\n      if ((cur + " " + s).length > 200) { if (cur) chunks.push(cur.trim()); cur = s; }\n      else { cur = cur ? cur + " " + s : s; }\n    }\n    if (cur) chunks.push(cur.trim());\n    try {\n      for (const chunk of chunks.slice(0, 15)) {\n        await TextToSpeech.speak({ text: chunk, lang: "fr-FR", rate: 0.85, pitch: 1.05, volume: 1.0 });\n      }\n    } catch(e) { console.warn("TTS:", e); }\n  };'),

# ── HistoryScreen.jsx L274 — handleSpeak chunked
("src/screens/HistoryScreen.jsx",
 '  const handleSpeak = async (text, id) => {\n    if (speakingId === id) {\n      await TextToSpeech.stop().catch(()=>{});\n      setSpeakingId(null);\n    } else {\n      await TextToSpeech.stop().catch(()=>{});\n      setSpeakingId(id);\n      try {\n        await TextToSpeech.speak({ text: cleanForTTS(text).slice(0,500), lang: "fr-FR", rate: 0.9, pitch: 1.0, volume: 1.0 });\n        setSpeakingId(null);\n      } catch { setSpeakingId(null); }\n    }\n  };',
 '  const handleSpeak = async (text, id) => {\n    if (speakingId === id) {\n      await TextToSpeech.stop().catch(()=>{});\n      setSpeakingId(null);\n      return;\n    }\n    await TextToSpeech.stop().catch(()=>{});\n    setSpeakingId(id);\n    const cleaned = cleanForTTS(text);\n    const sentences = cleaned.split(/(?<=[.!?;])\\s+/);\n    const chunks = [];\n    let cur = "";\n    for (const s of sentences) {\n      if ((cur + " " + s).length > 200) { if (cur) chunks.push(cur.trim()); cur = s; }\n      else { cur = cur ? cur + " " + s : s; }\n    }\n    if (cur) chunks.push(cur.trim());\n    try {\n      for (const chunk of chunks.slice(0, 15)) {\n        await TextToSpeech.speak({ text: chunk, lang: "fr-FR", rate: 0.85, pitch: 1.05, volume: 1.0 });\n      }\n    } catch {}\n    setSpeakingId(null);\n  };'),

# ── HistoryScreen.jsx L534 — grouper history par matière
("src/screens/HistoryScreen.jsx",
 '                    Tout rekèt yo\n                  </p>\n                  {history.map(h => (\n                    <HistoryCard key={h.id} h={h}\n                      onSelect={setSelected}\n                      onSpeak={handleSpeak}\n                      onDelete={handleDeleteScan}\n                      speakingId={speakingId}\n                      deleting={deleting}/>\n                  ))}\n                  <div style={{ height: 16 }}/>\n                </>',
 '                    Tout rekèt yo\n                  </p>\n                  {(() => {\n                    const groups = {};\n                    history.forEach(h => {\n                      const sub = h.subject || h.matiere || h.subjectName || "Jeneral";\n                      if (!groups[sub]) groups[sub] = [];\n                      groups[sub].push(h);\n                    });\n                    return Object.entries(groups).map(([sub, items]) => (\n                      <div key={sub}>\n                        <p style={{ color:"#60a5fa", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8, marginTop:8, display:"flex", alignItems:"center", gap:6 }}>\n                          <span style={{ width:7, height:7, borderRadius:"50%", background:"#60a5fa", display:"inline-block", flexShrink:0 }}/>\n                          {sub} ({items.length})\n                        </p>\n                        {items.map(h => (\n                          <HistoryCard key={h.id} h={h}\n                            onSelect={setSelected} onSpeak={handleSpeak}\n                            onDelete={handleDeleteScan} speakingId={speakingId} deleting={deleting}/>\n                        ))}\n                      </div>\n                    ));\n                  })()}\n                  <div style={{ height: 16 }}/>\n                <>'),

# ── HistoryScreen.jsx L568 — grouper exercices par matière
("src/screens/HistoryScreen.jsx",
 '                    Egzèsis sove yo\n                  </p>\n                  {exercices.map(exo => (\n                    <ExerciceCard key={exo.id} exo={exo}\n                      onRedo={onStartExercice}\n                      onDelete={handleDeleteExercice}\n                      deleting={deleting}/>\n                  ))}\n                  <div style={{ height: 16 }}/>\n                <>',
 '                    Egzèsis sove yo\n                  </p>\n                  {(() => {\n                    const groups = {};\n                    exercices.forEach(exo => {\n                      const sub = exo.subject || exo.matiere || "Jeneral";\n                      if (!groups[sub]) groups[sub] = [];\n                      groups[sub].push(exo);\n                    });\n                    return Object.entries(groups).map(([sub, items]) => (\n                      <div key={sub}>\n                        <p style={{ color:"#34d399", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8, marginTop:8, display:"flex", alignItems:"center", gap:6 }}>\n                          <span style={{ width:7, height:7, borderRadius:"50%", background:"#34d399", display:"inline-block", flexShrink:0 }}/>\n                          {sub} ({items.length})\n                        </p>\n                        {items.map(exo => (\n                          <ExerciceCard key={exo.id} exo={exo}\n                            onRedo={onStartExercice} onDelete={handleDeleteExercice} deleting={deleting}/>\n                        ))}\n                      </div>\n                    ));\n                  })()}\n                  <div style={{ height: 16 }}/>\n                <>'),

# ── QuizScreen.jsx L357 — nettoyer tirets
("src/screens/QuizScreen.jsx",
 '<span style={{ flex:1, color: isCorrect ? "#86efac" : isWrong ? "#fca5a5" : "#e2e8ff", fontSize:14, fontWeight:500, lineHeight:1.4 }}>{choice}</span>',
 '<span style={{ flex:1, color: isCorrect ? "#86efac" : isWrong ? "#fca5a5" : "#e2e8ff", fontSize:14, fontWeight:500, lineHeight:1.4 }}>{String(choice).replace(/^[-\u2013\u2014]\s*/, "")}</span>'),

# ── QuizScreen.jsx L167 — ajouter handleShareQuiz avant SELECT
("src/screens/QuizScreen.jsx",
 '  // \u2500\u2500 SELECT \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500',
 '  const handleShareQuiz = (note20, mentionLabel) => {\n    const text = `Gid NS4 \u2014 Quiz ${subject}\\nNot: ${note20}/20 \u2014 ${mentionLabel}\\n${score}/${totalAnswered} k\u00f2rèk \u00b7 Streak max: ${maxStreak}\\nTelechaje Gid NS4 !`;\n    if (navigator?.share) { navigator.share({ title: "Rezilta Quiz NS4", text }).catch(() => {}); return; }\n    navigator.clipboard?.writeText(text).then(() => alert("Rezilta kopye !"));\n  };\n\n  // \u2500\u2500 SELECT \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500'),

# ── QuizScreen.jsx L439 — bouton partage BRAVO
("src/screens/QuizScreen.jsx",
 "            <p style={{ color:\"#fbbf24\", fontSize:12, textAlign:\"center\" }}>\U0001f3c6 Ou fini tout {allCount} kesyon yo !</p>\n          )}\n        </div>\n      </div>\n    );\n  }\n\n  // \u2500\u2500 GAME OVER",
 "            <p style={{ color:\"#fbbf24\", fontSize:12, textAlign:\"center\" }}>\U0001f3c6 Ou fini tout {allCount} kesyon yo !</p>\n          )}\n          <button onClick={() => handleShareQuiz(note20, mention.label)}\n            style={{ width:\"100%\", padding:\"13px\", borderRadius:16, background:\"linear-gradient(135deg,#059669,#10b981)\", color:\"#fff\", fontWeight:800, fontSize:14, border:\"none\", cursor:\"pointer\", display:\"flex\", alignItems:\"center\", justifyContent:\"center\", gap:8 }}>\n            \U0001f4e4 Pataje Rezilta\n          </button>\n        </div>\n      </div>\n    );\n  }\n\n  // \u2500\u2500 GAME OVER"),

# ── QuizScreen.jsx L508 — bouton partage GAME OVER
("src/screens/QuizScreen.jsx",
 "            \u2190 Chwazi l\u00f2t matye\n          </button>\n        </div>\n        <BottomNav active=\"quiz\" onNavigate={onNavigate} />",
 "            \u2190 Chwazi l\u00f2t matye\n          </button>\n          <button onClick={() => handleShareQuiz(note20, mention.label)}\n            style={{ width:\"100%\", padding:\"13px\", borderRadius:16, background:\"linear-gradient(135deg,#059669,#10b981)\", color:\"#fff\", fontWeight:800, fontSize:14, border:\"none\", cursor:\"pointer\", display:\"flex\", alignItems:\"center\", justifyContent:\"center\", gap:8 }}>\n            \U0001f4e4 Pataje Rezilta\n          </button>\n        </div>\n        <BottomNav active=\"quiz\" onNavigate={onNavigate} />"),

# ── ProgressScreen.jsx L220 — handleShareProgress
("src/screens/ProgressScreen.jsx",
 '  const [showEval, setShowEval] = useState(false);',
 '  const [showEval, setShowEval] = useState(false);\n\n  const handleShareProgress = () => {\n    if (!stats) return;\n    const text = `Gid NS4 \u2014 Pwogresyon mwen\\nMway\u00e8n: ${stats.avg}/20 \u00b7 ${stats.total} matye\\nStreak max: ${stats.bestStreak} \u00b7 ${stats.totalExo} egz\u00e8sis\\nTelechaje Gid NS4 !`;\n    if (navigator?.share) { navigator.share({ title: "Pwogresyon Gid NS4", text }).catch(() => {}); return; }\n    navigator.clipboard?.writeText(text).then(() => alert("Rezilta kopye !"));\n  };'),

# ── ProgressScreen.jsx L271 — bouton partage
("src/screens/ProgressScreen.jsx",
 '<button onClick={() => setShowEval(true)} style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", borderRadius:12, background:"linear-gradient(135deg,#4c1d95,#7c3aed)", border:"1px solid rgba(139,92,246,0.4)", color:"#e9d5ff", fontSize:12, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 14px rgba(124,58,237,0.3)" }}><IcoEval/> Evalyasyon</button>',
 '<button onClick={() => setShowEval(true)} style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", borderRadius:12, background:"linear-gradient(135deg,#4c1d95,#7c3aed)", border:"1px solid rgba(139,92,246,0.4)", color:"#e9d5ff", fontSize:12, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 14px rgba(124,58,237,0.3)" }}><IcoEval/> Evalyasyon</button>\n          {stats && <button onClick={handleShareProgress} style={{ display:"flex", alignItems:"center", padding:"8px 10px", borderRadius:12, background:"linear-gradient(135deg,#059669,#10b981)", border:"1px solid rgba(16,185,129,0.4)", color:"#fff", fontSize:16, cursor:"pointer" }}>\U0001f4e4</button>}'),

]

errors = 0
success = 0
for filepath, find, replace in patches:
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        if find not in content:
            print(f"  INTROUVABLE: {filepath}")
            print(f"    -> {repr(find[:70])}")
            errors += 1
            continue
        content = content.replace(find, replace, 1)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"  OK: {filepath}")
        success += 1
    except FileNotFoundError:
        print(f"  ABSENT: {filepath}")
        errors += 1
    except Exception as e:
        print(f"  ERREUR {filepath}: {e}")
        errors += 1

print(f"\n{success} OK, {errors} erreurs.")
if errors:
    sys.exit(1)
