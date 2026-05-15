import { useState } from "react";
import { callEdge } from "../api";



const Field = ({ label, k, type = "text", form, setForm }) => (
  <div style={{ marginBottom: 12 }}>
    <label style={{ display: "block", fontSize: 13, color: "#94a3b8", marginBottom: 4 }}>{label}</label>
    <input
      type={type}
      value={form[k]}
      onChange={e => setForm(f => ({ ...f, [k]: type === "number" ? Number(e.target.value) : e.target.value }))}
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
  return (
    <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: "#0f2d1a", border: "1px solid #166534" }}>
      {result.code && (
        <>
          {[["Kòd Lekòl", result.code], ["Kòd Direktè", result.directorCode], ["Lekòl", result.schoolName], ["Max Elèv", result.maxStudents], ["Ekspire", new Date(result.expiresAt).toLocaleDateString("fr-HT")]].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #166534", fontSize: 14 }}>
              <span style={{ color: "#86efac" }}>{l}</span>
              <span style={{ fontWeight: 700, color: "#f1f5f9" }}>{v}</span>
            </div>
          ))}
        </>
      )}
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

export default function AdminScreen({ onBack }) {
  const [adminSecret, setAdminSecret] = useState("");
  const [secretOk, setSecretOk] = useState(false);
  const [createForm, setCreateForm] = useState({ schoolName: "", durationDays: 365, maxStudents: 200, dailyImageScans: 5, dailyTextScans: 10 });
  const [revokeUserForm, setRevokeUserForm] = useState({ phone: "" });
  const [revokeSchoolForm, setRevokeSchoolForm] = useState({ code: "", reactivate: false });

  const [createRes, setCreateRes]           = useState({ result: null, error: "" });
  const [revokeUserRes, setRevokeUserRes]   = useState({ result: null, error: "" });
  const [revokeSchoolRes, setRevokeSchoolRes] = useState({ result: null, error: "" });

  const [loading, setLoading] = useState({ create: false, revokeUser: false, revokeSchool: false });

  const run = async (action, body, key, setRes) => {
    setRes({ result: null, error: "" });
    setLoading(l => ({ ...l, [key]: true }));
    try {
      const data = await callEdge({ action, ...body, adminSecret });
      setRes({ result: data, error: "" });
    } catch (e) {
      setRes({ result: null, error: e.message ?? "Erè enkoni." });
    } finally {
      setLoading(l => ({ ...l, [key]: false }));
    }
  };

  if (!secretOk) return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "#f1f5f9", padding: 20, display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 400, margin: "0 auto" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#60a5fa", fontSize: 15, cursor: "pointer", marginBottom: 32 }}>← Retou</button>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>🔐 Aksè Admin</h2>
      <input
        type="password"
        placeholder="Antre mo de pास admin..."
        value={adminSecret}
        onChange={e => setAdminSecret(e.target.value)}
        onKeyDown={e => e.key === "Enter" && adminSecret && setSecretOk(true)}
        style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #334155", background: "#1e293b", color: "#f1f5f9", fontSize: 16, boxSizing: "border-box", marginBottom: 12 }}
      />
      <button onClick={() => adminSecret && setSecretOk(true)}
        style={{ width: "100%", padding: 13, borderRadius: 10, background: "#3b82f6", color: "#fff", fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer" }}>
        Kontinye
      </button>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "#f1f5f9", padding: 20, paddingBottom: 80, maxWidth: 500, margin: "0 auto", overflowY: "auto", height: "100vh" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#60a5fa", fontSize: 15, cursor: "pointer", marginBottom: 20 }}>← Retou</button>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>⚙️ Panneau Admin</h2>

      <Section title="🏫 Kreye Lekòl Nouvo">
        <Field label="Non Lekòl" k="schoolName" form={createForm} setForm={setCreateForm} />
        <Field label="Dire (jou)" k="durationDays" type="number" form={createForm} setForm={setCreateForm} />
        <Field label="Max Elèv" k="maxStudents" type="number" form={createForm} setForm={setCreateForm} />
        <Field label="Foto/jou" k="dailyImageScans" type="number" form={createForm} setForm={setCreateForm} />
        <Field label="Tèks/jou" k="dailyTextScans" type="number" form={createForm} setForm={setCreateForm} />
        <ActionButton label="✦ Jenere Kòd" loading={loading.create}
          onClick={() => run("create_school", createForm, "create", setCreateRes)} />
        <ResultBox {...createRes} />
      </Section>

      <Section title="🚫 Revoké Elèv">
        <Field label="Nimewo Telefòn" k="phone" form={revokeUserForm} setForm={setRevokeUserForm} />
        <ActionButton label="Efase Pwofil" loading={loading.revokeUser} color="#dc2626"
          onClick={() => run("revoke_user", revokeUserForm, "revokeUser", setRevokeUserRes)} />
        <ResultBox {...revokeUserRes} />
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
