import { useState } from "react";
import { callAPI } from "../api";

const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET ?? "";

export default function AdminScreen({ onBack }) {
  const [form, setForm] = useState({ schoolName: "", durationDays: 365, maxStudents: 200, dailyImageScans: 5, dailyTextScans: 10 });
  const [result, setResult] = useState(null);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setError(""); setResult(null);
    if (!form.schoolName.trim()) return setError("Non lekòl la obligatwa.");
    setLoading(true);
    try {
      const data = await callAPI("create_school", { ...form, adminSecret: ADMIN_SECRET });
      setResult(data);
    } catch (e) {
      setError(e.message ?? "Erè enkoni.");
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, k, type = "text" }) => (
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

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "#f1f5f9", padding: 20 }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#60a5fa", fontSize: 15, cursor: "pointer", marginBottom: 20 }}>← Retou</button>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>🏫 Kreye Lekòl Nouvo</h2>

      <Field label="Non Lekòl" k="schoolName" />
      <Field label="Dire (jou)" k="durationDays" type="number" />
      <Field label="Max Elèv" k="maxStudents" type="number" />
      <Field label="Foto/jou" k="dailyImageScans" type="number" />
      <Field label="Tèks/jou" k="dailyTextScans" type="number" />

      <button
        onClick={handleCreate}
        disabled={loading}
        style={{ width: "100%", padding: "14px", borderRadius: 10, background: loading ? "#334155" : "#3b82f6", color: "#fff", fontWeight: 700, fontSize: 16, border: "none", cursor: loading ? "not-allowed" : "pointer", marginTop: 8 }}
      >
        {loading ? "Chajman..." : "✦ Jenere Kòd"}
      </button>

      {error && <div style={{ marginTop: 16, padding: 12, borderRadius: 8, background: "#450a0a", color: "#fca5a5", fontSize: 14 }}>{error}</div>}

      {result && (
        <div style={{ marginTop: 20, padding: 16, borderRadius: 10, background: "#0f2d1a", border: "1px solid #166534" }}>
          <p style={{ color: "#4ade80", fontWeight: 700, marginBottom: 12 }}>✅ Lekòl kreye!</p>
          {[["Kòd Lekòl", result.code], ["Kòd Direktè", result.directorCode], ["Lekòl", result.schoolName], ["Max Elèv", result.maxStudents], ["Ekspire", new Date(result.expiresAt).toLocaleDateString("fr-HT")]].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #166534", fontSize: 14 }}>
              <span style={{ color: "#86efac" }}>{l}</span>
              <span style={{ fontWeight: 700, color: "#f1f5f9", letterSpacing: 1 }}>{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
