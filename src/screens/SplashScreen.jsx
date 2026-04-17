import { useEffect } from "react";
import { APP_LOGO } from "../config";
import { GLOBAL_STYLES } from "../components/UI";

export function SplashScreen({ onDone }) {
  useEffect(() => { setTimeout(onDone, 2000); }, []);
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ background:"linear-gradient(145deg,#04081A 0%,#080E24 50%,#0D0A1E 100%)" }}>
      <div style={{ position:"absolute", width:320, height:320, borderRadius:"50%", background:"radial-gradient(circle,#2563EB18,transparent 70%)", top:"15%", left:"10%", pointerEvents:"none" }} />
      <div style={{ position:"absolute", width:240, height:240, borderRadius:"50%", background:"radial-gradient(circle,#E8002A14,transparent 70%)", bottom:"20%", right:"5%", pointerEvents:"none" }} />
      <div style={{ animation:"popIn .7s cubic-bezier(.34,1.56,.64,1) both", display:"flex", flexDirection:"column", alignItems:"center" }}>
        <div style={{ position:"relative", marginBottom:24 }}>
          <div style={{ position:"absolute", inset:-8, borderRadius:34, border:"2px solid #2563EB44", animation:"ringPulse 2s 1s ease-out infinite" }} />
          <div style={{ width:120, height:120, borderRadius:26, background:"#fff", boxShadow:"0 0 0 1px #2563EB33, 0 8px 40px #000c, 0 0 60px #2563EB22", overflow:"hidden" }}>
            <img src={APP_LOGO} alt="Gid NS4" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          </div>
        </div>
        <p style={{ color:"#5B7ADB", fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", animation:"fadeUp .5s .5s both" }}>
          Prof Lakay • NS4 Haïti
        </p>
      </div>
      <div style={{ position:"absolute", bottom:52, display:"flex", gap:6, alignItems:"center" }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{ width:i===2?20:6, height:6, borderRadius:3, background:i===2?"linear-gradient(90deg,#E8002A,#FF5C35)":"#1E3A8A", animation:`pulse 1.2s ${i*0.15}s ease-in-out infinite` }} />
        ))}
      </div>
      <style>{GLOBAL_STYLES}</style>
    </div>
  );
}
