import { APP_LOGO } from "../config";
import { BottomNav } from "../components/UI";

const APP_VERSION = "1.0.0";

export function AboutScreen({ onNavigate }) {
  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "linear-gradient(145deg,#04081A,#080E24)" }}>
      {/* Header */}
      <div style={{ padding: "48px 20px 24px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ width: 80, height: 80, borderRadius: 20, overflow: "hidden", margin: "0 auto 16px", background: "#fff", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
          <img src={APP_LOGO} alt="Gid NS4" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ color: "#E8EEFF", fontSize: 22, fontWeight: 900, letterSpacing: 0.5 }}>Gid NS4</div>
        <div style={{ color: "#4B6ABA", fontSize: 13, marginTop: 4 }}>Asistan Etid pou Klas NS4</div>
        <div style={{ display: "inline-block", marginTop: 10, background: "rgba(37,99,235,0.15)", border: "1px solid rgba(37,99,235,0.30)", borderRadius: 20, padding: "3px 14px", color: "#6B8ADB", fontSize: 12, fontWeight: 700 }}>
          v{APP_VERSION}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-6 space-y-4" style={{ overflowY: "auto", paddingBottom: 90 }}>

        <Card>
          <Row label="Vèsyon" value={`v${APP_VERSION}`} />
          <Row label="Platfòm" value="Android" />
          <Row label="Backend" value="SB" last />
        </Card>

        <Card>
          <Row label="Devlopè" value="Milokan App" />
          <Row label="Peyi" value="Ayiti" last />
        </Card>

        <Card>
          <Row label="Sijè kouvri" value="20+ matyè NS4" />
          <Row label="Modèl IA" value="Prof Lakay" last />
        </Card>

        {/* Privacy */}
        <div style={{ textAlign: "center", paddingTop: 8 }}>
          <a
            href="https://renelsondenis509-netizen.github.io/Gid-NS4/privacy-policy.html"
            target="_blank" rel="noopener noreferrer"
            style={{ color: "#3B5BA8", fontSize: 13, textDecoration: "none" }}
          >
            🔒 Politik Konfidansyalite
          </a>
        </div>

        <div style={{ textAlign: "center", color: "#1e3a6e", fontSize: 11, paddingTop: 4 }}>
          © {new Date().getFullYear()} Gid NS4 · Tout dwa rezève
        </div>
      </div>

      <BottomNav active="menu" onNavigate={onNavigate} />
    </div>
  );
}

function Card({ children }) {
  return (
    <div style={{ background: "rgba(15,28,60,0.70)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, overflow: "hidden" }}>
      {children}
    </div>
  );
}

function Row({ label, value, last }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", borderBottom: last ? "none" : "1px solid rgba(255,255,255,0.06)" }}>
      <span style={{ color: "#4B6ABA", fontSize: 13 }}>{label}</span>
      <span style={{ color: "#C8D8FF", fontSize: 13, fontWeight: 600 }}>{value}</span>
    </div>
  );
}

export default AboutScreen;
