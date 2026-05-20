export function OfflineBanner() {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999,
      background: "#7f1d1d", color: "#fca5a5",
      fontSize: 12, fontWeight: 700,
      textAlign: "center", padding: "6px",
      letterSpacing: "0.03em",
    }}>
      📶 Pa gen koneksyon entènèt
    </div>
  );
}
