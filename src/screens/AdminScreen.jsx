import { useState } from "react";
import { QUIZ_BRANCHES as FILIERES } from "../data/quizData";
import { callEdge } from "../api";

const Field = ({ label, k, type = "text", form, setForm }) => (
  <div style={{ marginBottom: 12 }}>
    <label style={{ display: "block", fontSize: 13, color: "#94a3b8", marginBottom: 4 }}>{label}</label>
    <input
      type={type}
      value={form[k]}
      onChange={e => setForm(f => ({ ...f, [k]: type === "number" && e.target.value !== "" ? Number(e.target.value) : e.target.value }))}
      style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #334155", background: "#1e293b", color: "#f1f5f9", fontSize: 15, boxSizing: "border-box" }}
    />
  </div>
);

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 28, padding: 16, borderRadius: 12, border: "1px solid #1e293b", background: "#0f172a" }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: "#94a3b8", marginBottom: 16 }}>{title}</h3>
      {children}
    </div>
  );
}

function ResultBox({ result, error }) {
  if (error) return <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: "#450a0a", color: "#fca5a5", fontSize: 14 }}>{error}</div>;
  if (!result) return null;
if (result.success && result.code) return (
    <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: "#0f2d1a", border: "1px solid #166534" }}>
      {[["Kòd Lekòl", result.code], ["Kòd Direktè", result.directorCode], ["Lekòl", result.schoolName], ["Max Elèv", result.maxStudents], ["Ekspire", new Date(result.expiresAt).toLocaleDateString("fr-HT")]].map(([l, v]) => (
        <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #166534", fontSize: 14 }}>
          <span style={{ color: "#86efac" }}>{l}</span>
          <span style={{ fontWeight: 700, color: "#f1f5f9" }}>{v}</span>
        </div>
      ))}
    </div>
  );
  if (result.success) return (
    <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: "#0f2d1a", border: "1px solid #166534" }}>
      <p style={{ color: "#4ade80", fontSize: 14, margin: "0 0 8px" }}>✅ Mizajou reyisi !</p>
      {Object.entries(result.updated || {}).map(([k, v]) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid #166634", fontSize: 13 }}>
          <span style={{ color: "#86efac" }}>{k}</span>
          <span style={{ color: "#f1f5f9", fontWeight: 700 }}>{String(v)}</span>
        </div>
      ))}
    </div>
  );
  return (
    <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: "#0f2d1a", border: "1px solid #166534" }}>
      {result.code && [["Kòd Lekòl", result.code], ["Kòd Direktè", result.directorCode], ["Lekòl", result.schoolName], ["Max Elèv", result.maxStudents], ["Ekspire", new Date(result.expiresAt).toLocaleDateString("fr-HT")]].map(([l, v]) => (
        <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #166534", fontSize: 14 }}>
          <span style={{ color: "#86efac" }}>{l}</span>
          <span style={{ fontWeight: 700, color: "#f1f5f9" }}>{v}</span>
        </div>
      ))}
      {result.message && <p style={{ color: "#4ade80", fontSize: 14, margin: 0 }}>✅ {result.message}</p>}
    </div>
  );
}

function ActionButton({ label, loading, onClick, color = "#3b82f6" }) {
  return (
    <button onClick={onClick} disabled={loading}
      style={{ width: "100%", padding: 13, borderRadius: 10, background: loading ? "#334155" : color, color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: loading ? "not-allowed" : "pointer" }}>
      {loading ? "Chajman..." : label}
    </button>
  );
}

function ListSchools({ adminSecret }) {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const data = await callEdge({ action: "list_schools", adminSecret });
      setSchools(data.schools ?? []);
    } catch (e) {
      setError(e.error ?? "Erè.");
    } finally { setLoading(false); }
  };

  return (
    <div>
      <button onClick={load} disabled={loading}
        style={{ width:"100%", padding:10, borderRadius:8, background:"#1e293b", color:"#94a3b8", border:"1px solid #334155", cursor:"pointer", marginBottom:12 }}>
        {loading ? "Chajman..." : "🔄 Chaje Lis Lekòl"}
      </button>
      {error && <p style={{ color:"#fca5a5", fontSize:13 }}>{error}</p>}
      {schools.map(s => (
        <div key={s.code} style={{ padding:"10px 12px", borderRadius:8, background:"#1e293b", marginBottom:8, fontSize:13 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
            <span style={{ color:"#60a5fa", fontWeight:700 }}>{s.school_name}</span>
            <span style={{ color: s.active ? "#4ade80" : "#ef4444", fontWeight:700 }}>{s.active ? "Aktif" : "Revoké"}</span>
          </div>
          <div style={{ color:"#94a3b8" }}>Kòd : <span style={{ color:"#f1f5f9", fontFamily:"monospace" }}>{s.code}</span></div>
          <div style={{ color:"#94a3b8" }}>Max : {s.max_students} elèv • Ekspire : {new Date(s.expires_at).toLocaleDateString("fr-HT")}</div>
        </div>
      ))}
    </div>
  );
}


function ReportedMessages({ adminSecret }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const data = await callEdge({ action: "get_reported_messages", adminSecret });
      setReports(data.reports ?? []);
    } catch (e) {
      setError(e.error ?? "Erè.");
    } finally { setLoading(false); }
  };

  return (
    <div>
      <button onClick={load} disabled={loading}
        style={{ width:"100%", padding:10, borderRadius:8, background:"#1e293b", color:"#94a3b8", border:"1px solid #334155", cursor:"pointer", marginBottom:12 }}>
        {loading ? "Chajman..." : "Chaje rapo yo"}
      </button>
      {error && <p style={{ color:"#fca5a5", fontSize:13 }}>{error}</p>}
      {reports.length === 0 && !loading && <p style={{ color:"#475569", fontSize:13, textAlign:"center" }}>Pa gen rapo ankò.</p>}
      {reports.map(r => (
        <div key={r.id} style={{ padding:"10px 12px", borderRadius:8, background:"#1e293b", marginBottom:8, fontSize:13 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
            <span style={{ color:"#f87171", fontWeight:700 }}>{r.target || "Jeneral"}</span>
            <span style={{ color:"#475569", fontSize:11 }}>{new Date(r.created_at).toLocaleString("fr-HT")}</span>
          </div>
          <div style={{ color:"#94a3b8", marginBottom:2 }}>Rezon : <span style={{ color:"#fca5a5" }}>{r.details?.reason || "-"}</span></div>
          <div style={{ color:"#e2e8f0", background:"#0f172a", borderRadius:6, padding:"6px 8px", marginTop:4 }}>{r.details?.message?.slice(0, 200) || "-"}</div>
          <div style={{ color:"#475569", fontSize:11, marginTop:4 }}>Telefòn : {r.performed_by}</div>
        </div>
      ))}
    </div>
  );
}

export default function AdminScreen({ onBack }) {
  const [adminSecret, setAdminSecret] = useState("");
  const [secretOk, setSecretOk] = useState(false);
  const [secretError, setSecretError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [createForm, setCreateForm] = useState({ schoolName: "", durationDays: 365, maxStudents: 200, dailyImageScans: 5, dailyTextScans: 10 });
  const [selectedFilieres, setSelectedFilieres] = useState([]);
  const [revokeUserForm, setRevokeUserForm] = useState({ phone: "" });
  const [revokeSchoolForm, setRevokeSchoolForm] = useState({ code: "" });
  const [updateForm, setUpdateForm] = useState({ code: "", dailyImageScans: "", dailyTextScans: "", maxStudents: "", durationDays: "" });
  const [updateRes, setUpdateRes] = useState({ result: null, error: "" });
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [createRes, setCreateRes] = useState({ result: null, error: "" });
  const [revokeUserRes, setRevokeUserRes] = useState({ result: null, error: "" });
  const [revokeSchoolRes, setRevokeSchoolRes] = useState({ result: null, error: "" });
  const [loading, setLoading] = useState({ create: false, revokeUser: false, revokeSchool: false, update: false });

  const run = async (action, body, key, setRes) => {
    setRes({ result: null, error: "" });
    setLoading(l => ({ ...l, [key]: true }));
    try {
      const data = await callEdge({ action, ...body, adminSecret });
      setRes({ result: data, error: "" });
    } catch (e) {
      setRes({ result: null, error: e.message ?? e.error ?? "Erè enkoni." });
    } finally {
      setLoading(l => ({ ...l, [key]: false }));
    }
  };

  if (!secretOk) return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "#f1f5f9", padding: 20, display: "flex", flexDirection: "column", maxWidth: 400, margin: "0 auto" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#60a5fa", fontSize: 15, cursor: "pointer", alignSelf: "flex-start", marginBottom: 0 }}>← Retou</button>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>🔐 Aksè Admin</h2>
        <input
          type="password"
          placeholder="Antre kòd admin lan..."
          value={adminSecret}
          onChange={e => setAdminSecret(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && adminSecret) document.getElementById("btn-admin-continue").click(); }}
          style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #334155", background: "#1e293b", color: "#f1f5f9", fontSize: 16, boxSizing: "border-box", marginBottom: 12 }}
        />
        {secretError && <div style={{ color: "#fca5a5", fontSize: 13, marginBottom: 8 }}>{secretError}</div>}
        <button onClick={async () => {
          if (!adminSecret) return;
          setVerifying(true); setSecretError("");
          try {
            await callEdge({ action: "verify_admin", adminSecret });
            setSecretOk(true);
          } catch (e) {
            setSecretError(e.error ?? "Kòd la pa kòrèk.");
          } finally { setVerifying(false); }
        }}
          id="btn-admin-continue" style={{ width: "100%", padding: 13, borderRadius: 10, background: verifying ? "#334155" : "#3b82f6", color: "#fff", fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer" }}>
          {verifying ? "Verifikasyon..." : "Kontinye"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="scrollable-screen" style={{ background: "#0f172a", color: "#f1f5f9", padding: 20, paddingBottom: 80, maxWidth: 500, margin: "0 auto" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#60a5fa", fontSize: 15, cursor: "pointer", marginBottom: 20 }}>← Retou</button>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>⚙️ Panneau Admin</h2>

      <Section title="🏫 Kreye Lekòl Nouvo">
        <Field label="Non Lekòl" k="schoolName" form={createForm} setForm={setCreateForm} />
        <Field label="Dire (jou)" k="durationDays" type="number" form={createForm} setForm={setCreateForm} />
        <Field label="Max Elèv" k="maxStudents" type="number" form={createForm} setForm={setCreateForm} />
        <Field label="Foto/jou" k="dailyImageScans" type="number" form={createForm} setForm={setCreateForm} />
        <Field label="Tèks/jou" k="dailyTextScans" type="number" form={createForm} setForm={setCreateForm} />
        <div style={{ marginBottom: 12 }}>
          <label style={{ display:"block", fontSize:13, color:"#94a3b8", marginBottom:8 }}>Filiè (matye)</label>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {Object.entries(FILIERES).map(([key, f]) => (
              <button key={key} type="button"
                onClick={() => setSelectedFilieres(prev => prev.includes(key) ? prev.filter(k=>k!==key) : [...prev, key])}
                style={{ padding:"6px 14px", borderRadius:20, fontSize:13, fontWeight:700, border:"2px solid " + (selectedFilieres.includes(key) ? f.color : "#334155"), background: selectedFilieres.includes(key) ? f.color+"22" : "#1e293b", color: selectedFilieres.includes(key) ? f.color : "#94a3b8", cursor:"pointer" }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <ActionButton label="✦ Jenere Kòd" loading={loading.create}
          onClick={() => { const subjects = Object.entries(FILIERES).filter(([k]) => selectedFilieres.includes(k)).flatMap(([,f]) => f.subjects); run("create_school", { ...createForm, subjects }, "create", setCreateRes); }} />
        <ResultBox {...createRes} />
      </Section>

      
        <Section title="✏️ Modifye Lekol Egzistan">
          <Field label="Kod Lekol"  k="code"            form={updateForm} setForm={setUpdateForm} />
          <Field label="Foto/jou"   k="dailyImageScans" type="number" form={updateForm} setForm={setUpdateForm} />
          <Field label="Teks/jou"   k="dailyTextScans"  type="number" form={updateForm} setForm={setUpdateForm} />
          <Field label="Max Elev"   k="maxStudents"     type="number" form={updateForm} setForm={setUpdateForm} />
          <Field label="Dire (jou)" k="durationDays"    type="number" form={updateForm} setForm={setUpdateForm} />
          <ActionButton label="Mete Ajou" loading={loading.update}
            onClick={() => run("update_school", {
              ...updateForm,
              dailyImageScans: updateForm.dailyImageScans ? Number(updateForm.dailyImageScans) : undefined,
              dailyTextScans:  updateForm.dailyTextScans  ? Number(updateForm.dailyTextScans)  : undefined,
              maxStudents:     updateForm.maxStudents     ? Number(updateForm.maxStudents)     : undefined,
              durationDays:    updateForm.durationDays    ? Number(updateForm.durationDays)    : undefined,
            }, "update", setUpdateRes)} />
          <ResultBox result={updateRes.result} error={updateRes.error} />
        </Section>

        <Section title="🚫 Revoké Elèv">
        <Field label="Nimewo Telefòn" k="phone" form={revokeUserForm} setForm={setRevokeUserForm} />
        <ActionButton label="Efase Pwofil" loading={loading.revokeUser} color="#dc2626"
          onClick={() => run("revoke_user", revokeUserForm, "revokeUser", setRevokeUserRes)} />
        <ResultBox {...revokeUserRes} />
      </Section>

      <Section title="Rapo Kontni Siyale">
        <ReportedMessages adminSecret={adminSecret} />
      </Section>

      <Section title="📋 Jounal Odyit">
        <button onClick={async () => {
          setLogsLoading(true);
          try {
            const data = await callEdge({ action: "get_audit_logs", adminSecret });
            setLogs(data.logs ?? []);
          } catch (e) {
            setLogs([]);
          } finally { setLogsLoading(false); }
        }} style={{ width: "100%", padding: 10, borderRadius: 8, background: "#1e293b", color: "#94a3b8", border: "1px solid #334155", cursor: "pointer", marginBottom: 12 }}>
          {logsLoading ? "Chajman..." : "🔄 Rafraîchi"}
        </button>
        {logs.length === 0 && !logsLoading && <p style={{ color: "#475569", fontSize: 13, textAlign: "center" }}>Pa gen jounal ankò.</p>}
        {logs.map(log => (
          <div key={log.id} style={{ padding: "8px 10px", borderRadius: 8, background: "#1e293b", marginBottom: 8, fontSize: 13 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ color: "#60a5fa", fontWeight: 700 }}>{log.action}</span>
              <span style={{ color: "#475569" }}>{new Date(log.created_at).toLocaleString("fr-HT")}</span>
            </div>
            {log.target && <div style={{ color: "#94a3b8" }}>Sib : <span style={{ color: "#f1f5f9" }}>{log.target}</span></div>}
          </div>
        ))}
      </Section>

      <Section title="📋 Lis Lekòl Yo">
        <ListSchools adminSecret={adminSecret} />
      </Section>

      <Section title="🔒 Revoké / Reaktive Lekòl">
        <Field label="Kòd Lekòl" k="code" form={revokeSchoolForm} setForm={setRevokeSchoolForm} />
        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <ActionButton label="Revoké" loading={loading.revokeSchool} color="#dc2626"
            onClick={() => run("revoke_school", { ...revokeSchoolForm, reactivate: false }, "revokeSchool", setRevokeSchoolRes)} />
          <ActionButton label="Reaktive" loading={loading.revokeSchool} color="#16a34a"
            onClick={() => run("revoke_school", { ...revokeSchoolForm, reactivate: true }, "revokeSchool", setRevokeSchoolRes)} />
        </div>
        <ResultBox {...revokeSchoolRes} />
      </Section>
    </div>
  );
}
