
import { useState, useRef, useEffect } from "react";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY;
const API = `${SUPABASE_URL}/functions/v1/ask-prof-lakay`;

// ─── SYSTÈME DE NOTIFICATIONS ────────────────────────────────────────────────
const getNotifications = () => {
  // Récupère les données depuis localStorage
  const history = JSON.parse(localStorage.getItem('gidns4_history') || '[]');
  const quizzes = JSON.parse(localStorage.getItem('gidns4_quizzes') || '[]');
  const messages = JSON.parse(localStorage.getItem('gidns4_messages') || '[]');
  
  // Calcule les notifications
  return {
    chat: messages.filter(m => !m.read).length || 0,
    quiz: quizzes.filter(q => !q.completed).length || 0,
    leaderboard: 0,
    history: history.filter(h => {
      const date = new Date(h.date);
      const now = new Date();
      const diffDays = (now - date) / (1000 * 60 * 60 * 24);
      return diffDays < 7; // Scans des 7 derniers jours
    }).length || 0,
    menu: 0
  };
};

// ─── APPEL EDGE FUNCTION ──────────────────────────────────────────────────────
async function callEdge(payload) {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SUPABASE_ANON}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw { status: res.status, ...data };
  return data;
}

// ─── GESTION D'ERREURS CENTRALISÉE ───────────────────────────────────────────
function parseApiError(err) {
  if (err instanceof TypeError && err.message.includes("fetch")) {
    return { type: "network", message: "Koneksyon an pa bon, eseye ankò !", detail: "Verifye entènèt ou epi eseye ankò.", icon: "📶", retry: true };
  }
  if (err?.status === 429 || err?.quotaExceeded) {
    return { type: "quota", message: "Ou rive nan limit scan ou pou jodi a !", detail: "Tounen demen pou kontinye.", icon: "🔒", retry: false };
  }
  if (err?.status === 403) {
    return { type: "auth", message: err?.error || "Aksè refize. Kontakte direksyon lekòl ou.", detail: null, icon: "🚫", retry: false };
  }
  if (err?.status >= 500) {
    return { type: "server", message: "Koneksyon an pa bon, eseye ankò !", detail: "Sèvè a gen yon pwoblèm. Eseye nan kèk minit.", icon: "🔧", retry: true };
  }
  if (err?.name === "AbortError") {
    return { type: "timeout", message: "Koneksyon an pa bon, eseye ankò !", detail: "Demann an pran twò lontan. Verifye entènèt ou.", icon: "⏱️", retry: true };
  }
  if (err?.error) {
    return { type: "api", message: err.error, detail: null, icon: "⚠️", retry: false };
  }
  return { type: "unknown", message: "Koneksyon an pa bon, eseye ankò !", detail: null, icon: "⚠️", retry: true };
}

// ─── COMPOSANT TOAST D'ERREUR ─────────────────────────────────────────────────
function ErrorToast({ error, onRetry, onDismiss }) {
  if (!error) return null;
  const canRetry = error.retry && onRetry;
  return (
    <div className="mx-3 mb-2 px-4 py-3 rounded-2xl flex gap-3 items-start"
      style={{ background: error.type === "quota" ? "#1e3a8a22" : "#7f1d1d33", border: `1px solid ${error.type === "quota" ? "#3b82f644" : "#ef444444"}`, animation: "fadeIn .3s ease both" }}>
      <span style={{ fontSize: 20, flexShrink: 0 }}>{error.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm" style={{ color: error.type === "quota" ? "#93c5fd" : "#fca5a5" }}>{error.message}</p>
        {error.detail && <p className="text-xs mt-0.5" style={{ color: error.type === "quota" ? "#6080c0" : "#f87171" }}>{error.detail}</p>}
        <div className="flex gap-2 mt-2">
          {canRetry && (
            <button onClick={onRetry} className="px-3 py-1 rounded-lg text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg,#d4002a,#ff6b35)" }}>🔄 Eseye Ankò</button>
          )}
          <button onClick={onDismiss} className="px-3 py-1 rounded-lg text-xs font-semibold"
            style={{ background: "#ffffff15", color: "#94a3b8" }}>Fèmen</button>
        </div>
      </div>
    </div>
  );
}

import { QUIZ_DATA } from "./quizData.js";
// ─── LOGO ────────────────────────────────────────────────────────────────────
const APP_LOGO = "data:image/webp;base64,UklGRo4WAABXRUJQVlA4IIIWAACQWQCdASoAAQABPikUiEMhoSER2nyoGAKEpu4Xar2k+k/kz3/1fuc/jJ+KXyn1J+xf1r88/uj/mfkRz4c4+Sf5F+m/37+wftl/d///8o/897DPyz/rPcF/TL/Ef3z9yv778U3qb/q/+p9Qn9B/rH+d/vn71/L1/g/8B/jPdL/Y/73/mP7h/jvkA/ov8+6x39s/YF/l/9c9MD/yf5P4Nf2d/93+U+BL+Z/2v/l/n/8gHoAf/brX+tf837bv7h+O/n34cvEX7B+2X7rc+7qXzE/kf3F+9f3P9oPyb+Y/9t4b/GT+39Qj8M/kv9k/K78xOaFAP+Uf0j/K/m//lvJp9Efmm/G76AP5j/Nf8h+Sn7/++B4p9AD+Zf0j/R/4T8s/jZ/yv9R+ZnuM/P/73/2f8x8BP8l/pv+t/uv71/5n/////7yPYz6Kv67DK3fJhUu+HZZUaxyKjWORUaxyKjWORUaxyKjWORUaxx3iW+ApeORrG3rc3GsRIxuQ5zcEsIjto8L11phGEJpfOPAiJXhRfTvuyGdNvLCIVXMy03Kdeu8KlsrAEHsAdL1CnuMburLqSRDhwAfRCEVeGxacbsvD0JPRMUZfQPsB5aYKTigR4ZcXp15Mc+M5ssVwXIMFwPO8ENcsRFlIAlNKwrG0Vgr+nqy2LIDeFomB+PoE9GKh8OZfjlOPwP+LJctw+9pjiuASHSkXIDYHl+IpQ+Thcsxq5DRZx2Hz4nYuW+ThzOuY/s9nY3WGqNs5EmQe6QH+2CGupAGcgsWKIbc3ARlixA9ISqB/PIGr4xGPo6HDm/S0BO+TcFbMeALuafCm9+Ul8xVYTH9DjXn437QG1xATbnfL/0agIn50q6fzjA21+Q4r7lrfkOibQpbeMkQi+I8Vpf/dnt5FDsc2GJjIdkTFVwiXZZUaxyKjWORUaxyKjWORUaxyKjWORUaxyKjWORUaxyKjWORUaxx0AAD+//S5wAABGOalqnKd+OTbT1ZkdkYqlZmGrCXW1VlLWoinkN6Aja1GvAxbjVWMDauISSUYn3tO2MErxWM0uNkAZ0RBsOmc2RsZMSYXOc+iPLXDNV/oslIgqRwWJXXQJAHweKGVPvBv5R97XBDA6cwasIxNeEYse+N6qpOzPCyNyucMgr3sQQfngHXVjoI0QgSH/vhUukwaIKXRbrhspisjZhDctVFo7/qfJJzl4GkOmtI95LNyNbk4ovDERW0y80u9wEZK4BH/NTJswN+la3OMOMRx8uG6LUoK0YLfprgupvpuKfu3eOWAzfZTw97G441G35dMtVj8I6DU4cOfefLQC2qX9fYdH491VX21RMGibUSopb5IPt34brZH0zY//LNWvDtkzW25GxBd2RhdvsSjr5kkwBsojxB7yn+sr7/rvIc9kmlGOrL8U6do7I4WzMOdxgXrWTzo5FiU1z0m4PNgE7vWYcX9D4GFvv3uePBexg+ylS49J8apbf2TCFhmWbZGjpTXV11ae0EOTFes6x9G2SSZ3iQF6G2fHksGI3DH3Hs/KDOpH4tADlTArYY2fXADMLzlvgs6MiKlb/NsCh5LkquFKRuPbhfWlEYnsClb/rXQfLPUVfGsyt3xbXn+Jvup0OD30qoQ1y2yB3BZiyr+NxZY+bcP7ZqgT+mKGXakNM/x0r9wImDckFeIKTsIcKa0d3cRyYHw8Gqox7G9jdL5I23WuxYC7z6WNIOgkYH8eFsuR2pls5T73Z6ZbOIWaDvPCI5D5gr+HMMRgZyPFJ1Q5BYimaDm9eNlXYx1CPaGHCZ7caBz9uBysky35oo1qjeHvNmmq+AnfDKHg4xjOIjtx1fUTn/iwwnnTkJ++1thYEf40Ys2QHgUKrd+EjLjYjMYYKL3RxDmrXr0B3SA0ecFP63hMO7TZWdo9GvyJ+eQH4cFFpoyPHp9ZZQjHiLVFJhwWdBTexZ/AZcI1P0faJiSyhl4OfW0P2CwYe6mRekO3bZ4v/5F4iRF4NmNdIKz2KlB7ck+o1xK4/HUIukpSnJE53b2M860koA4apsTHHcgFn41DRFiZK/cPZCa4R+Q/I5XnZE2YiT7DK1Fh7uwj9bvC3WAa2wRW5Ll/AzwmnfXYOQtLbbRMbrfqQGHr9Si+Gd5Hnv1sc2/90DAdGE8EzXicE28Jm6qw5RK1rbFNFlbjKbCCI5p2wSJGSMILHjuUNlW2TgMaing0JgtiDMu/zuKMeUNCRKxGKRg3+6WeIbnNJMRdvRIW4MP7q06NOApSLnLdNAumuFEa+crG9KKup4eMtFJsmfBAm0IrWjIRmR0eQCmJWzp7qoMwFExnRnM6SJie0hve8ifEqfj9zx9spnw195nfIRbszAOTg8ATOJ/I1X9p7Dss1+n1wVn9D68dQ/ZN6Kisx4V82G6UHz/YmqlDMyW4MF4K8CoC6RDpsi9tX2QvWzt85u3GvsRKHvZ0UYx7GyH6jo586PwIPMxbK2JrVLQ9T/2h0d+MsX3B6VDTdxwqGCmBEGq5Qd4RygvjcpNiZgrYx2yJptcH06Lb2Spj+QiEm93wUyK2KUS05c/qDU5g7XRdQ8pMp+wUJgtnh2EtkUV80YHGizlIZ3Zj/t6osrIoGHoukZyPhM41etlv9hPlrlJu7XfyYqyxLl+01UT72q1/hfjO7ryOIeKMF2U0qrM5n34p0z9ybOGcDt5LXU6xOU5/90RJNsgqLZFraQuE6t9HcAK0aMbFk673I2p87xj8DFdpPUay/dbhPMtM+m7mFMByhFU/Tvpe5qVQTAefMpjZTwPv7sjiIw2BVXbetcG83HYcS8jwPP3/XmYhruhKQGK7o08VCpI8qN8aI4nmUuCI0pItHj8Bb+5eR8+9ycL8XU+ClNFFLLJJbSlGAaUJOxscgmn7MgWgTRqbcktfPzfndqf2kjqdw4FcgWYJfbqg9mWtk1ZIouXtZs6i6HLqSpjA+icibv8d6o25+tf3XEsAD1lhjcgVVsrjaN/w8RNctNsWiTZgWoO8CG2/BnfVHaUOzblpFwqXAY/cJWIeeLnFu6Jj1EjI5oNcbkRiXkbgD+n5aqU+tzESbfrZgz4XsP12kucU4VOKBd5Cz/uKgmRwZKbxXYwo30AnUvd+O5hSbr67Jpu7i/9wEAZsdaPMuRsW0z6Qml6z1nxlLhr/vEA64Y0R758APZvkV6tAI3DqaI+tb2nM8IC/Z3Yc4cYqiqJRmD2W+hiKLz4JsqKgQKPHoZdN+MzSors3BHYwowdTA86/sclDzSRNEZpYJ4i1LQhg/qA4SV0t/OAooSS/Ut/5JWkVynl6UzRRdSBFqhuX+W86vuOsjKhWN7j6aYgdI2EMHEtNb1hHUoW3LvZqQwFOMSbj7Rq8Kl/WLj96jhBu5k5F2pxCkF/v/2YVaGIwSZ3xBV/Vr3noF6dNoz4vOf3cDRpuWzKoUx0g4ZSpgQ+t+nUuskVxShV6FSk0gzdxppDlSHzmGqY/LFih9740Xlriynbj93b31CHfWF85jxaTvwpNrwajny76gpjVX+BOSz8GXk1j8JmSrBdlYlAGTKBhhqHe4G6qshrLB1x6razl5srwc7z37PybnQyVi3mXlQrj4L3LbTKxlhGIP2wqM6ymsdouRsRZEq4FxkIUXKqoY5jMIqs2i37QBYUiMXAn/gfcTrwiIGWvhrhF/DmaXbuoaoCoYuoIk0sMMSiYCMqlkhqnKWTi2FeTx7SLEPVgtiXHc4OSNa63pIdYtpKXhEqLI7D1n9rC2EoXi8p+HwZZcU0rTuk7DEigDSN9uyuG0L+vJe8/Gyd4JBCIu9GqSE2BeGmk/rm/pgTgnPIx3FMgMKDx3Jyga4kEu3yGkPGZ4BD0ZbMhuTbxMVT6bBWFXf1eMbwWcklgSn+qLs0dP5mnE+d7CXJtgykOK2QlPU1N792bjoi37ytIMlIwg4rt4DTiWwxXBs2XVSzhEshPTtAb0zMG8xYDQ8uazIUHDM8zmGyFfuI705cAfVswxtQS/1Bw5GkdJ9CJWvXlp5eLgSAGLgO7DuqYPCx9b19MicebSGH3sCWxBIlgRnOopxv9Uhk0t0Gz7X136FyRo3/EvxcA7Z6PAFJFzX6F6suvEMZcQNFddFb047rSS46C3orC5UmtahKLNUClicGxRn/dO7HnHlhV9ff+hhAES2OOgEFWZsgxg08+gTPpVgbZNy5dHoCVtg4jKvhZupzAQVzB47XH/58Pclocn3sOSmVbn2VzlCnTH0Q9+aSp7kqP597GIlY4php3D1Q254cK/zTmyF90gKga/8Ojk9OCVWHN9Et0tyovCm6fDcHXT00Jk8tnT9B8SzBD4N09RUcWSBe8OtK0+L+aaspclHWm+6tqI6HLErQkJ2r/bzFrdL73gTtyf/l1J/ZvnzELMru+Kn08iwl7B8VOJbFGcXrP1XT0s0OL+K/0DJ99rCcisAREy4GPZkmfDKSZGLFqnrZkWk1a+akp4gk1GWRb0m9AzvJLVv20q51VL3T++3tx6Y/IjEohRaHvFcAuH5lwBnhjJY0zqv0924g3qLR+rlMi+OgD+H0kOI7OrjLgGRFiptkoxfZBJNx5pyPv7BEvmRxF2K3ek2Xj8v+GkSpg9+NPKSzIx4kPWOHiMvLbk5Eh0hUKpYPdbucSFErf4lKGAHjsr0f5VWJHHKjpXvamsyRcXbBl+4SdJHdLfvmh9Ao39okuFfDWC2oweqrtgpG/DjANu7v6vlkQ0iSX0CSJTH3EM8OSFbfD+81XMoN7uCHGJsiICx5gaSAZryjFD/Z/37Zsh28tw6Du8co1VP68l5B6tNU6CP0kZ2lCKLyBdo9FMOW237cxANlpmGf4+UwkDE7O7wIGjtvSS6rP/Bl7lHCQqj2GcFeqR3j/iJZgeOrpbd7nGN2xqsCSwuIGB2V71brf5ccY+c4rKUXVNkjaBSwjzghAvBLUBceDkZgthUVPekxLnD0K0auWEmcIQdV4lBPhkQ3/OHBfoJyXsz7TbvcdIHPBc0BzIwoRc3eI9G/boZ/KNA8GUd5Qb64zGAZ7Zz8mUxw8EhBq97ILP8rnKYVFYnHMoZWAIwRcseJa7EolWnt/SlgaYWW5jRntjHgRn0v9fiYEc+xI67+nkXZBVYyq3LnJ35ueqdt6hCaJoeQ5ZId+LUWmF8p4TI+j+4jfUh8U2Khj+zfrCMGM793VUsvLG2aOBKT81jG5cIxjVNFb5aQxhuOPTfSQzco//E6nZCmb8Zs582yee9sB4EVhxNdGJp6CXv6b8JHGtXoeIJLBVEvOrS51LF7augxEV+hm+SFtG6iHukslEpZZUjPD/9/v21ZDP/ixR6iqlshIeXkF4wyv145Yxgf9jcYOrGTAE4JzdaCw/v8PkDSmQD2tlZ0JeQ3GxLXREBIyeWD/QT+pJU8XA5+D8xza7BxeoQZFxlNB1O4ZFHw/hPY6/qUDU/H8hFRK1aAeJGVth0nmRtyZ8/O0wXX+A03lj641Eutw8Z34cF4hKdoyriww1B3ZwOFR4jrs0LiSV1vbSkKj65nmTyYUZ/wwCCOOkVqyBHHDyPRs8Pmf63By+ym1jlXQKfnH0rTus4Hx2a6xXSvF6+QOxaUNxOqfqnf2iGNxlG+lgDNYYEmjwTilim2Vj/tnvpsijn/ZZDq1p2mGQ8MSrHVxGlJBNisHQI0dBULZUcTmdsKL2REK9cx9DlQOG0HhMJDExuIV8O6uTj//918IpkBac9eKCovFOMHDMyAE11i87iyHwhcc4JqUV7Oi7RQOlaYzQYwQt6zh16Su6Ls8+r+A5l47gNl95vQPuwppsoRU7lpjrdEr4Hv/Qx6Hh61/9MIGYRYXtlOxl8nhJwIgdk5d/UXvcVvwmhKFgS7FTGXSmLnxK4/BfkvAoTcNwHEI0KaLSFRtzL3Idt7ldB3rlyJkRmoqq4Lc0dtX4p6eYkt8ypfjMbwB34QfCejlv6Puvua14Z9hFxKrIDd9tm5s40S+cD2htHSNiY26F1xpSxnMdU5hmcx+8osaT8RGiEhQiu2CUE59RGMAK6IcVxktkTYoZsxdvrmiFcUkDT1X7Bp+UVeTS8C+aaKb4YoPbzVI5U4fRhB5iOFystAqaekBLszefBCZtfk8tgTjBYyBd4t4I2BNUOfO2Hs0upKp6+McdxtbjW1F2ZuuK76ClSGQgvBxtogbxm2FJVstWqiggoCa/RKOc3aSKRrwtNSvIJArcE/UvlSx7bagcQ6bmhAFkhHZdvW1bVtUwiYnwLi8QvUEnXNLElgufwiFpzRw6YO5EEF5pVONQJZs/x/KhhYUXiDApNG6s8ii3lRMiM2mNcxdavGyt5DBavbCtT6MGnBPQPkbLZHT0FocmPM4l9XJGtUn5qDrITdBw4eZXIek+C7e9q8MyLw3kkK0svBGTYUN5nBbuIPTAvhGTmd/hfXGCAMEObZU2SLZcngN6py0NQvAYEsSPhvI1u9lGgv6vPMKvsOifW8XEygSAVXg0d+vBU705qL+hkx+EzZ4JPc64gq1CKFgXf/Os81yEpG+C4ePQy/iBZX8WDVTzGq0yjqIiJzx0k1of03Rz8d1+uoW8JXWADmufAo633eij4z+piv6PdeyNZ9zNMVWww3z5iinbr9qsjUfsjH15m2b4viAo7HUm8uDC1c1fBJPQSzahYGsfdEvcYYoC43uRcWXxPJZ4UTEf5LykaW49BbjQRJIuk864KX7vxzuQxWAFF6+GnoH2zvZeVRcAGYQJtWX7N34/lAZRIpNQFHv+xT1f4+Iq50XehwxOFD/QrHGUhaJC1JZI6fH+569DyyGe/o/LGEei5lf7We6DBSxDtreTw1AmenaPW/ts+toeQZOWg6Z8Y+k/17yXkQTE4Xzpk+wwctJRAfIvRnBtEAF6BGUUUoSeIpg8MF5L+JpIdSJoP5jYMtdIrqt/4LUoNpQzILygF+v/opcTY8wRQLw5U2tip6taK5g/9dp/EY3NHS7lx74HXoqnkcyFVrodVP7pxlujHgdRX+78OwbYMutWNSrFHtwSLAeHIjhQuI3bVtxhvAoL9IHQ2SIQCOUmllX/vmZODNTtU17KIDKdDtmDqhGkEi6aYoYD+wiZ9rY4KSkMOtZd6aWjZ8sypIbK2MDHR/4QbCicPQvHrVTwLqHb6MInyiKz6+ACd0PJInIXaq92lhGWcWJCyxAmp3iyNp58+M4kMeej7tgdOS2jMncXzfv3/rDdt1i79Dr8xtbIfqTusH+SvThm8COZHrN9K/l2eLqeQBb9nn84QL2CzFmCbHNnEjw+2KiV3K9MPz8oQgvgdD9iFIVRTkcHsK2NON+lC0Ltj/9sUhlROObqQ5XnD5HCKbE5w4mMlCbfan24Ie75QqVUSAqwrZEGpwVGKTSln6y2u6RiOCFBDZ8gmaqF13oGc1WiHzty983e91elh//MQTky9q4EW+Nc+UZ8ENGevA2dBeYSLHLKel/WJ6yXrwGHF7q25p+RUpn587v1zTG8KM14I8HccndMLSjTPY+WgPTCPkYVOxMVia5QUJfy0AAAN7y0fYjvjVQ+0ab8vRkrIWLBoVraldyqPwvk48oYcDUu99DERvg+KEk+B2zObq2gAwPd312WhXOWSbGkjT+wB7SQCdK520sm0dFE9QqgFbS07it9zhKHsx3Skr7X8OUPbWsqvomQIUEQIh/xJ/4l7K6jgm33eCQLMWGz9Yp+ve8PAAAAAAAA==";
const PROF_LAKAY_PHOTO = "https://i.postimg.cc/MH8V3LKv/Jpgpro-out-bfea41d353cc11eb57c8fc16e3b40ffa.jpg";


// ─── SHUFFLE ──────────────────────────────────────────────────────────────────
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Mélange les choix d'une question et retourne la nouvelle position de la bonne réponse
function shuffleChoices(q) {
  const indexed = q.choices.map((c, i) => ({ c, correct: i === q.answer }));
  for (let i = indexed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
  }
  return {
    ...q,
    choices: indexed.map(x => x.c),
    answer: indexed.findIndex(x => x.correct),
  };
}

// ─── INDEXEDDB ────────────────────────────────────────────────────────────────
const DB_NAME = "GidNS4DB";
const DB_VERSION = 1;
const STORE_SCANS = "scans";

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_SCANS)) {
        const store = db.createObjectStore(STORE_SCANS, { keyPath: "id", autoIncrement: true });
        store.createIndex("phone", "phone", { unique: false });
        store.createIndex("phone_date", ["phone", "scanDate"], { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbSaveScan(phone, entry) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_SCANS, "readwrite");
      tx.objectStore(STORE_SCANS).add({ ...entry, phone });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn("IndexedDB indisponible, fallback localStorage", err);
    idbFallbackSave(phone, entry);
  }
}

async function idbGetScans(phone, limit = 50) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_SCANS, "readonly");
      const store = tx.objectStore(STORE_SCANS);
      const results = [];
      // Curseur en ordre inverse (id décroissant = plus récent en premier)
      // On filtre par phone sans charger tout en mémoire
      const req = store.openCursor(null, "prev");
      req.onsuccess = (e) => {
        const cursor = e.target.result;
        if (!cursor || results.length >= limit) { resolve(results); return; }
        if (cursor.value.phone === phone) results.push(cursor.value);
        cursor.continue();
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("IndexedDB lecture échouée, fallback localStorage", err);
    return idbFallbackGet(phone);
  }
}

async function idbDeleteScan(id) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_SCANS, "readwrite");
      tx.objectStore(STORE_SCANS).delete(id);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn("IndexedDB suppression échouée", err);
  }
}

function idbFallbackSave(phone, entry) {
  try {
    const hist = idbFallbackGet(phone);
    hist.unshift({ ...entry, image: null, _fallback: true, id: Date.now() });
    localStorage.setItem(`history_${phone}`, JSON.stringify(hist.slice(0, 20)));
  } catch {}
}
function idbFallbackGet(phone) {
  try { return JSON.parse(localStorage.getItem(`history_${phone}`) || "[]"); } catch { return []; }
}

// ─── NOTES QUIZ /20 ───────────────────────────────────────────────────────────
function scoreToNote20(score, total) {
  if (total === 0) return 0;
  return Math.round((score / total) * 20 * 10) / 10;
}

function getMention(note20) {
  if (note20 >= 16) return { label: "Excellent", color: "#22c55e", bg: "#14532d33", border: "#22c55e44", emoji: "🏆" };
  if (note20 >= 14) return { label: "Bien", color: "#3b82f6", bg: "#1e3a8a33", border: "#3b82f644", emoji: "⭐" };
  if (note20 >= 12) return { label: "Assez Bien", color: "#f59e0b", bg: "#78350f33", border: "#f59e0b44", emoji: "👍" };
  if (note20 >= 10) return { label: "Passable", color: "#f97316", bg: "#7c2d1233", border: "#f9731644", emoji: "📖" };
  return { label: "Insuffisant", color: "#ef4444", bg: "#7f1d1d33", border: "#ef444444", emoji: "📚" };
}

function getQuizGrades(phone) {
  try { return JSON.parse(localStorage.getItem(`grades_${phone}`) || "{}"); } catch { return {}; }
}

function saveQuizGrade(phone, subject, note20, score, total) {
  try {
    const grades = getQuizGrades(phone);
    if (!grades[subject]) grades[subject] = [];
    grades[subject].push({
      note20, score, total,
      date: new Date().toLocaleDateString("fr-HT", { timeZone: "America/Port-au-Prince" }),
      ts: Date.now(),
    });
    grades[subject] = grades[subject].slice(-10);
    localStorage.setItem(`grades_${phone}`, JSON.stringify(grades));
  } catch {}
}

// ─── COMPRESSION D'IMAGE ──────────────────────────────────────────────────────
function compressImage(base64, maxSize = 800, quality = 0.6) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > height && width > maxSize) { height = Math.round((height * maxSize) / width); width = maxSize; }
      else if (height > maxSize) { width = Math.round((width * maxSize) / height); height = maxSize; }
      const canvas = document.createElement("canvas");
      canvas.width = width; canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => resolve(base64);
    img.src = base64;
  });
}

// ─── KATEX LOADER (CDN, chargé une seule fois) ────────────────────────────────
let katexReady = false;
let katexQueue = [];
function ensureKatex() {
  if (katexReady) return Promise.resolve();
  if (document.getElementById("katex-css")) {
    // CSS déjà injecté, attendre le script
    return new Promise(r => katexQueue.push(r));
  }
  // Injecter la CSS
  const link = document.createElement("link");
  link.id = "katex-css";
  link.rel = "stylesheet";
  link.href = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css";
  document.head.appendChild(link);
  // Injecter le script
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js";
  script.onload = () => {
    katexReady = true;
    katexQueue.forEach(r => r());
    katexQueue = [];
  };
  document.head.appendChild(script);
  return new Promise(r => katexQueue.push(r));
}

// ─── LATEX RENDERER ───────────────────────────────────────────────────────────
function LatexText({ content }) {
  const [html, setHtml] = useState(null);

  useEffect(() => {
    let cancelled = false;
    // Si pas de formule LaTeX → rendu simple
    if (!/\$/.test(content)) { setHtml(null); return; }
    ensureKatex().then(() => {
      if (cancelled) return;
      try {
        const result = content.replace(/\$\$([\s\S]+?)\$\$/g, (_, expr) => {
          try { return window.katex.renderToString(expr.trim(), { displayMode: true, throwOnError: false }); }
          catch { return `<code class="katex-fallback">${expr}</code>`; }
        }).replace(/\$([^$\n]+?)\$/g, (_, expr) => {
          try { return window.katex.renderToString(expr.trim(), { displayMode: false, throwOnError: false }); }
          catch { return `<code class="katex-fallback">${expr}</code>`; }
        });
        setHtml(result);
      } catch { setHtml(null); }
    });
    return () => { cancelled = true; };
  }, [content]);

  // Rendu KaTeX disponible → HTML brut
  if (html) return (
    <span dangerouslySetInnerHTML={{ __html: html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }}
      style={{ lineHeight: 1.7 }} />
  );

  // Fallback : rendu texte avec formatage minimal (pendant chargement ou sans formule)
  return (
    <span>
      {content.split("\n").map((line, i, arr) => (
        <span key={i}>
          <span dangerouslySetInnerHTML={{ __html:
            line
              .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
              .replace(/\$\$?([\s\S]+?)\$?\$/g, (_, e) =>
                `<code style="background:#0d2244;color:#93c5fd;padding:1px 4px;border-radius:4px;font-family:monospace;font-size:.85em">${e}</code>`)
          }} />
          {i < arr.length - 1 && <br />}
        </span>
      ))}
    </span>
  );
}
function MdText({ text }) {
  return (
    <>
      {text.split("\n").map((line, i, arr) => (
        <span key={i}>
          <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }} />
          {i < arr.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

// ─── SPLASH ───────────────────────────────────────────────────────────────────
function SplashScreen({ onDone }) {
  useEffect(() => { setTimeout(onDone, 2000); }, []);
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(145deg,#04081A 0%,#080E24 50%,#0D0A1E 100%)" }}>
      {/* Ambient glows */}
      <div style={{ position:"absolute", width:320, height:320, borderRadius:"50%", background:"radial-gradient(circle,#2563EB18,transparent 70%)", top:"15%", left:"10%", pointerEvents:"none" }} />
      <div style={{ position:"absolute", width:240, height:240, borderRadius:"50%", background:"radial-gradient(circle,#E8002A14,transparent 70%)", bottom:"20%", right:"5%", pointerEvents:"none" }} />
      
      <div style={{ animation: "popIn .7s cubic-bezier(.34,1.56,.64,1) both", display:"flex", flexDirection:"column", alignItems:"center" }}>
        {/* Logo avec ring animé */}
        <div style={{ position:"relative", marginBottom:24 }}>
          <div style={{
            position:"absolute", inset:-8,
            borderRadius:34, border:"2px solid #2563EB44",
            animation:"ringPulse 2s 1s ease-out infinite"
          }} />
          <div style={{
            width:120, height:120, borderRadius:26,
            background:"#fff",
            boxShadow:"0 0 0 1px #2563EB33, 0 8px 40px #000c, 0 0 60px #2563EB22",
            overflow:"hidden",
          }}>
            <img src={APP_LOGO} alt="Gid NS4" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          </div>
        </div>
        <p style={{ color:"#5B7ADB", fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", animation:"fadeUp .5s .5s both" }}>
          Prof Lakay • NS4 Haïti
        </p>
      </div>

      {/* Loader elegant */}
      <div style={{ position:"absolute", bottom:52, display:"flex", gap:6, alignItems:"center" }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{
            width: i === 2 ? 20 : 6, height:6, borderRadius:3,
            background: i === 2 ? "linear-gradient(90deg,#E8002A,#FF5C35)" : "#1E3A8A",
            animation:`pulse 1.2s ${i*0.15}s ease-in-out infinite`,
            transition:"width .3s"
          }} />
        ))}
      </div>
      <style>{`
        @keyframes popIn{from{opacity:0;transform:scale(.5)}to{opacity:1;transform:scale(1)}}
        @keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}
        @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
        @keyframes heartPop{0%{transform:scale(1)}50%{transform:scale(1.4)}100%{transform:scale(1)}}
      `}</style>
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin, onNavigate }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!name.trim() || name.trim().length < 2) { setError("Antre non ou ki valid (omwen 2 lèt)."); return; }
    if (!phone.trim() || phone.length < 8) { setError("Antre yon nimewo telefòn valid."); return; }
    if (!code.trim()) { setError("Antre kòd lekòl ou a."); return; }
    setLoading(true);
    try {
      const result = await callEdge({ action: "validate_code", phone: phone.trim(), schoolCode: code.toUpperCase().trim() });
      if (!result.valid) { setError(result.reason || "Kòd la pa valid."); setLoading(false); return; }
      onLogin({
  name: name.trim(),
  phone: phone.trim(),
  code: code.toUpperCase().trim(),
  school: result.school.name,
  subjects: result.school.subjects,
  dailyScans:      result.school.dailyScans,
  dailyImageScans: result.school.dailyImageScans ?? 1,
  dailyTextScans:  result.school.dailyTextScans  ?? 4,
  daysRemaining:   result.school.daysRemaining,
  expiresAt:       result.school.expiresAt,
  scansToday:      result.scansToday,
});
    } catch (e) {
      setError(parseApiError(e).message);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden"
      style={{ background: "linear-gradient(145deg,#04081A 0%,#080E24 60%,#0D0A1E 100%)" }}>
      {/* Background glows */}
      <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,#2563EB0F,transparent 65%)", top:"-10%", right:"-20%", pointerEvents:"none" }} />
      <div style={{ position:"absolute", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle,#E8002A0A,transparent 65%)", bottom:"0%", left:"-15%", pointerEvents:"none" }} />

      <div className="flex-1 flex flex-col items-center justify-center px-5" style={{ animation:"fadeUp .5s ease both" }}>
        {/* Logo */}
        <div style={{ width:80, height:80, borderRadius:20, background:"#fff", overflow:"hidden", boxShadow:"0 0 0 1px #2563EB22, 0 12px 40px #00000055", marginBottom:14 }}>
          <img src={APP_LOGO} alt="Gid NS4" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        </div>
        <p style={{ color:"#4B6ABA", fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", marginBottom:24 }}>Asistan IA pou elèv NS4</p>

        {/* Glass Card */}
        <div className="w-full" style={{
          maxWidth:380,
          background:"rgba(15,28,60,0.80)",
          backdropFilter:"blur(20px)",
          border:"1px solid rgba(255,255,255,0.12)",
          borderRadius:24,
          padding:"28px 24px",
          boxShadow:"0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)"
        }}>
          {/* Inputs */}
          {[
            { label:"Non Konplè", type:"text", val:name, fn:e=>setName(e.target.value), ph:"Marie Joseph", extra:{} },
            { label:"Nimewo Telefòn", type:"tel", val:phone, fn:e=>setPhone(e.target.value), ph:"50934567890", extra:{} },
            { label:"Kòd Etablisman", type:"text", val:code, fn:e=>setCode(e.target.value.toUpperCase()), ph:"DEMO-2026", extra:{fontFamily:"monospace", letterSpacing:"0.12em", fontWeight:700} },
          ].map(({label, type, val, fn, ph, extra}, i) => (
            <div key={i} style={{ marginBottom:16 }}>
              <label style={{ display:"block", color:"#5B7ADB", fontSize:11, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:8 }}>{label}</label>
              <input type={type} value={val} onChange={fn} placeholder={ph}
                style={{
                  width:"100%", background:"rgba(255,255,255,0.04)",
                  border:"1px solid rgba(255,255,255,0.1)",
                  borderRadius:12, padding:"13px 16px",
                  color:"#E8EEFF", fontSize:15, outline:"none",
                  transition:"border-color .2s, box-shadow .2s",
                  boxSizing:"border-box",
                  ...extra
                }}
                onFocus={e => { e.target.style.borderColor="#2563EB66"; e.target.style.boxShadow="0 0 0 3px #2563EB18"; }}
                onBlur={e => { e.target.style.borderColor="rgba(255,255,255,0.1)"; e.target.style.boxShadow="none"; }}
              />
            </div>
          ))}

          {error && (
            <div style={{ background:"#E8002A15", border:"1px solid #E8002A33", borderRadius:10, padding:"10px 14px", marginBottom:16, color:"#FF7070", fontSize:13 }}>
              ⚠️ {error}
            </div>
          )}

          <button onClick={handleLogin} disabled={loading}
            style={{
              width:"100%", padding:"15px", borderRadius:14,
              background: loading ? "#2E4080" : "linear-gradient(135deg,#E8002A,#FF5C35)",
              color:"white", fontWeight:800, fontSize:15, border:"none",
              boxShadow: loading ? "none" : "0 6px 24px #E8002A33",
              transition:"all .2s", cursor: loading ? "not-allowed" : "pointer",
              letterSpacing:"0.02em"
            }}>
            {loading ? "⏳ Ap verifye..." : "Konekte →"}
          </button>

          <div style={{ textAlign:"center", marginTop:16 }}>
            <span style={{ color:"#4b5ea8", fontSize:12 }}>Pa gen kòd ? </span>
            <span style={{ color:"#4B6ABA", fontSize:12 }}>Pale ak direksyon lekòl ou a.</span>
          </div>
        </div>
      </div>

      <div style={{ paddingBottom:24, display:"flex", justifyContent:"center", gap:24 }}>
        <button onClick={() => onNavigate("payment")} style={{ color:"#3B5BA8", fontSize:12, background:"none", border:"none" }}>Peman</button>
        <span style={{ color:"#2E4080", fontSize:12 }}>·</span>
        <button onClick={() => onNavigate("partner")} style={{ color:"#3B5BA8", fontSize:12, background:"none", border:"none" }}>Vin Patnè</button>
      </div>
    </div>
  );
}

// ─── BOTTOM NAV (5 tabs) ──────────────────────────────────────────────────────
function BottomNav({ active, onNavigate }) {
const notifications = getNotifications();
    const tabs = [
    {
  id: "chat",
  icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  label: "Chat",
  badge: notifications.chat
},
    {
  id: "quiz",
  icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  label: "Quiz",
  badge: notifications.quiz
},
    {
  id: "leaderboard",
  icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  ),
  label: "Klasman",
  badge: notifications.leaderboard
},
    {
  id: "history",
  icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v5h5" />
      <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
      <path d="M12 7v5l4 2" />
    </svg>
  ),
  label: "Istwa",
  badge: notifications.history
},
    {
  id: "menu",
  icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  label: "Meni",
  badge: notifications.menu
},
  ];
  
  return (
    <div style={{
      display:"flex",
      background:"rgba(10,15,46,0.97)",
      backdropFilter:"blur(20px)",
      borderTop:"1px solid rgba(255,255,255,0.10)",
      paddingBottom:"env(safe-area-inset-bottom, 0px)",
    }}>
      {tabs.map(tab => {
        const isActive = active === tab.id;
        return (
          <button key={tab.id} onClick={() => onNavigate(tab.id)}
            style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"10px 0 8px", border:"none", background:"none", position:"relative", transition:"transform .15s" }}
            onTouchStart={e => e.currentTarget.style.transform="scale(0.88)"}
            onTouchEnd={e => e.currentTarget.style.transform="scale(1)"}>
            {isActive && (
              <div style={{
                position:"absolute", top:0, left:"50%", transform:"translateX(-50%)",
                width:32, height:2, borderRadius:2,
                background:"linear-gradient(90deg,#E8002A,#FF5C35)",
              }} />
            )}
            <span style={{ color: isActive ? "#FF5C35" : "#4B5EA8", position: "relative" }}>
  {tab.icon}
  {tab.badge > 0 && (
    <div style={{
      position: "absolute",
      top: -8,
      right: -8,
      background: "linear-gradient(135deg, #EF4444, #DC2626)",
      color: "#fff",
      fontSize: 10,
      fontWeight: 800,
      minWidth: 18,
      height: 18,
      borderRadius: 9,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 5px",
      boxShadow: "0 2px 8px rgba(239, 68, 68, 0.4)",
      border: "2px solid #0a0f2e"
    }}>
      {tab.badge > 9 ? "9+" : tab.badge}
    </div>
  )}
</span>
            <span style={{
              fontSize:9, fontWeight: isActive ? 700 : 500,
              color: isActive ? "#FF5C35" : "#4B5EA8",
              marginTop:2, letterSpacing:"0.03em"
            }}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── EXPIRY BANNER ────────────────────────────────────────────────────────────
function ExpiryBanner({ daysRemaining }) {
  if (!daysRemaining || daysRemaining > 7) return null;
  const isUrgent = daysRemaining <= 2;
  return (
    <div className="px-4 py-2 text-xs text-center font-semibold" style={{ background: isUrgent ? "#d4002a" : "#92400e", color: "white" }}>
      {isUrgent ? "🚨" : "⚠️"} Kòd ou a ekspire nan {daysRemaining} jou — Kontakte direksyon lekòl ou
    </div>
  );
}

// ─── CHAT ─────────────────────────────────────────────────────────────────────
function ChatScreen({ user, onNavigate }) {
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: `Bonjou **${user.name || ""}** ! Mwen se **Prof Lakay** \n\nJe suis ton assistant IA pour le **Bac NS4**.\n\n📚 Matières disponibles pour toi :\n${user.subjects.map(s => `• ${s}`).join("\n")}\n\n**Ann al travay ! **`
  }]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [lastPayload, setLastPayload] = useState(null);
  const [activeSubject, setActiveSubject] = useState(user.subjects[0] || null);
  const bottomRef = useRef(null);
  const fileRef = useRef(null);

  // ── Limites depuis Supabase (fallback hardcodé) ──
  const [IMG_MAX, setImgMax]   = useState(user.dailyImageScans ?? 1);
const [TEXT_MAX, setTextMax] = useState(user.dailyTextScans  ?? 4);

useEffect(() => {
  callEdge({ action: "validate_code", phone: user.phone, schoolCode: user.code })
    .then(result => {
      if (result?.school) {
        setImgMax(result.school.dailyImageScans ?? 1);
        setTextMax(result.school.dailyTextScans ?? 4);
      }
    })
    .catch(() => {});
}, []);

  // ── Compteurs par jour (heure Haïti) ──
  const today    = new Date().toLocaleDateString("fr-HT", { timeZone: "America/Port-au-Prince" });
  const _imgKey  = `gid_img_${user.phone}_${today}`;
  const _txtKey  = `gid_txt_${user.phone}_${today}`;

  const [imgUsed, setImgUsed] = useState(() => {
    try { return parseInt(localStorage.getItem(_imgKey) || "0"); } catch { return 0; }
  });
  const [textUsed, setTextUsed] = useState(() => {
    try { return parseInt(localStorage.getItem(_txtKey) || "0"); } catch { return 0; }
  });

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const detectSubject = (text) => {
    const t = text.toLowerCase();
    if (t.includes("bio") || t.includes("cellule") || t.includes("adn")) return "Biologie";
    if (t.includes("chim") || t.includes("molécule") || t.includes("acide")) return "Chimie";
    if (t.includes("physi") || t.includes("vitesse") || t.includes("force")) return "Physique";
    if (t.includes("philo") || t.includes("socrate")) return "Philosophie";
    if (t.includes("social") || t.includes("haïti")) return "Sciences Sociales";
    if (t.includes("littér") || t.includes("roman")) return "Littérature Haïtienne";
    return user.subjects[0] || "Général";
  };

  const sendMessage = async (retryPayload = null) => {
    const isImage = retryPayload ? !!retryPayload.isImage : !!image;
    const payload = retryPayload || {
      userMsg: { role: "user", content: input.trim() || "Analyse cet exercice.", image },
      currentInput: input.trim(),
      isImage: !!image,
    };

    if (!payload.currentInput && !payload.userMsg.image) return;
    if (loading) return;
    if (isImage  && imgUsed  >= IMG_MAX)  return;
    if (!isImage && textUsed >= TEXT_MAX) return;

    if (!retryPayload) { setMessages(p => [...p, payload.userMsg]); setInput(""); setImage(null); }
    setApiError(null); setLoading(true);

    try {
      const detectedSubject = activeSubject || detectSubject(payload.currentInput);
      const result = await callEdge({
        action: "ask", phone: user.phone, schoolCode: user.code,
        message: payload.userMsg.content,
        imageBase64: payload.userMsg.image ? payload.userMsg.image.split(",")[1] : null,
        history: messages.slice(-6), subject: detectedSubject,
      });
      setMessages(p => [...p, { role: "assistant", content: result.reply }]);

      if (isImage) {
        setImgUsed(n => {
          const next = n + 1;
          try { localStorage.setItem(_imgKey, String(next)); } catch {}
          return next;
        });
      } else {
        setTextUsed(n => {
          const next = n + 1;
          try { localStorage.setItem(_txtKey, String(next)); } catch {}
          return next;
        });
      }
      setLastPayload(null);

      await idbSaveScan(user.phone, {
        date: new Date().toLocaleString("fr-HT", { timeZone: "America/Port-au-Prince" }),
        scanDate: new Date().toISOString().split("T")[0],
        subject: detectedSubject, image: payload.userMsg.image || null,
        response: result.reply, dailyLimit: IMG_MAX + TEXT_MAX,
      });
    } catch (e) {
      const parsed = parseApiError(e);
      setApiError(parsed);
      if (parsed.retry) setLastPayload(payload);
    }
    setLoading(false);
  };

  const handleImage = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => { setImage(await compressImage(ev.target.result)); };
    reader.readAsDataURL(file);
  };

  const imgDone  = imgUsed  >= IMG_MAX;
  const textDone = textUsed >= TEXT_MAX;
  const allDone  = imgDone && textDone;

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "#0a0f2e" }}>
      <ExpiryBanner daysRemaining={user.daysRemaining} />

      {/* ── HEADER ── */}
      <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:"rgba(10,15,46,0.98)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.10)" }}>
        <div style={{ width:40, height:40, borderRadius:10, overflow:"hidden", flexShrink:0, background:"#fff", boxShadow:"0 2px 12px #00000044" }}>
          <img src={APP_LOGO} alt="Gid NS4" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        </div>
        <div style={{ flex:1 }}>
          <div style={{ color:"#E8EEFF", fontWeight:700, fontSize:14, letterSpacing:"0.01em" }}>Prof Lakay</div>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:1 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"#22C55E", display:"inline-block", boxShadow:"0 0 6px #22C55E" }} />
            <span style={{ color:"#22C55E", fontSize:11, fontWeight:500 }}>En ligne</span>
          </div>
        </div>

        {/* ── 2 CARDS COMPTEURS ── */}
        <div style={{ display:"flex", gap:6 }}>
          {/* Card SCAN IMAGE */}
          <div style={{
            display:"flex", flexDirection:"column", alignItems:"center",
            padding:"5px 9px", borderRadius:12,
            background: imgDone ? "rgba(255,255,255,0.04)" : "rgba(37,99,235,0.15)",
            border: `1px solid ${imgDone ? "rgba(255,255,255,0.08)" : "rgba(37,99,235,0.35)"}`,
            minWidth:48,
          }}>
            <div style={{ display:"flex", gap:2 }}>
              {Array.from({ length: IMG_MAX }).map((_, i) => (
                <span key={i} style={{ fontSize:15, opacity: i < imgUsed ? 0.2 : 1, filter: i < imgUsed ? "grayscale(1)" : "none" }}>📷</span>
              ))}
            </div>
            <span style={{ fontSize:8, fontWeight:700, marginTop:2, color: imgDone ? "#3B4A6B" : "#60A5FA" }}>
              {imgDone ? "✓ Itilize" : `${IMG_MAX - imgUsed} scan`}
            </span>
          </div>

          {/* Card TEXTE */}
          <div style={{
            display:"flex", flexDirection:"column", alignItems:"center",
            padding:"5px 9px", borderRadius:12,
            background: textDone ? "rgba(255,255,255,0.04)" : "rgba(37,99,235,0.15)",
            border: `1px solid ${textDone ? "rgba(255,255,255,0.08)" : "rgba(37,99,235,0.35)"}`,
            minWidth:60,
          }}>
            <div style={{ display:"flex", gap:2 }}>
              {Array.from({ length: TEXT_MAX }).map((_, i) => (
                <span key={i} style={{ fontSize:12, opacity: i < textUsed ? 0.2 : 1, filter: i < textUsed ? "grayscale(1)" : "none" }}>🖋️</span>
              ))}
            </div>
            <span style={{ fontSize:8, fontWeight:700, marginTop:2, color: textDone ? "#3B4A6B" : "#60A5FA" }}>
              {textDone ? "✓ Fini" : `${TEXT_MAX - textUsed} kesyon`}
            </span>
          </div>
        </div>
      </div>

      {/* ── TABS MATIÈRES ── */}
      <div style={{ padding:"8px 14px", display:"flex", gap:8, overflowX:"auto", background:"rgba(10,15,46,0.92)", borderBottom:"1px solid rgba(255,255,255,0.05)", scrollbarWidth:"none" }}>
        {user.subjects.map((s, i) => (
          <button key={i} onClick={() => setActiveSubject(s)}
            style={{
              flexShrink:0, padding:"4px 11px", borderRadius:20,
              background: activeSubject === s ? "linear-gradient(135deg,#2563EB,#3B82F6)" : "rgba(37,99,235,0.08)",
              color: activeSubject === s ? "#fff" : "#4B6ABA",
              border: activeSubject === s ? "none" : "1px solid rgba(37,99,235,0.2)",
              fontSize:11, fontWeight: activeSubject === s ? 700 : 500,
              boxShadow: activeSubject === s ? "0 3px 12px #2563EB33" : "none",
              transition:"all .2s", whiteSpace:"nowrap"
            }}>
            {s}
          </button>
        ))}
      </div>

      {/* ── MESSAGES ── */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className="flex gap-2" style={{ justifyContent: msg.role === "user" ? "flex-end" : "flex-start", animation: "fadeIn .3s ease both" }}>
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-xl flex-shrink-0 overflow-hidden" style={{ background: "#fff" }}>
                <img src={PROF_LAKAY_PHOTO} alt="Prof Lakay" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              </div>
            )}
            <div style={{ maxWidth:"82%" }}>
              {msg.image && <img src={msg.image} alt="scan" style={{ borderRadius:14, marginBottom:6, maxHeight:140, objectFit:"contain", border:"1px solid rgba(255,255,255,0.1)" }} />}
              <div style={{
                padding:"11px 15px", fontSize:14, lineHeight:1.65,
                background: msg.role === "user" ? "linear-gradient(135deg,#2563EB,#1D4ED8)" : "rgba(15,28,60,0.95)",
                border: msg.role === "assistant" ? "1px solid rgba(37,99,235,0.15)" : "none",
                color:"#E8EEFF",
                borderRadius: msg.role === "user" ? "18px 18px 5px 18px" : "5px 18px 18px 18px",
                boxShadow: msg.role === "user" ? "0 4px 20px #2563EB33" : "0 2px 12px rgba(0,0,0,0.3)",
              }}>
                <LatexText content={msg.content} />
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2 items-start">
            <div className="w-8 h-8 rounded-xl flex-shrink-0 overflow-hidden" style={{ background: "#fff" }}>
              <img src={PROF_LAKAY_PHOTO} alt="Prof Lakay" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            </div>
            <div className="px-4 py-3 rounded-2xl" style={{ background: "#0f1e4a" }}>
              <div className="flex gap-1.5 items-center">
                {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-blue-400" style={{ animation: `bounce 1s ${i*0.2}s infinite` }} />)}
                <span className="text-blue-400 text-xs ml-2">Prof Lakay ap ekri...</span>
              </div>
            </div>
          </div>
        )}

        {allDone && (
          <div className="mx-2 px-4 py-3 rounded-2xl text-sm text-center" style={{ background: "#d4002a22", border: "1px solid #d4002a44", color: "#ff8080" }}>
            🔒 Ou itilize tout scan ak kesyon ou yo pou jodi a. Tounen demen !
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <ErrorToast error={apiError} onRetry={lastPayload ? () => sendMessage(lastPayload) : null} onDismiss={() => { setApiError(null); setLastPayload(null); }} />

      {/* ── INPUT ZONE ── */}
      <div style={{ padding:"10px 12px", background:"rgba(10,15,46,0.98)", backdropFilter:"blur(20px)", borderTop:"1px solid rgba(255,255,255,0.10)" }}>
        {image && (
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8, padding:"6px 8px", background:"rgba(37,99,235,0.1)", borderRadius:10, border:"1px solid rgba(37,99,235,0.2)" }}>
            <img src={image} alt="" style={{ width:36, height:36, borderRadius:8, objectFit:"cover" }} />
            <span style={{ color:"#6B8ADB", fontSize:11, flex:1 }}>✅ Image prête</span>
            <button onClick={() => setImage(null)} style={{ color:"#E8002A", background:"none", border:"none", fontSize:16, cursor:"pointer" }}>✕</button>
          </div>
        )}
        <div style={{ display:"flex", gap:8, alignItems:"flex-end" }}>

          {/* Bouton caméra */}
          <button
            onClick={() => { if (!imgDone) fileRef.current?.click(); }}
            disabled={imgDone}
            style={{
              width:48, height:48, borderRadius:14, flexShrink:0,
              display:"flex", alignItems:"center", justifyContent:"center",
              background: imgDone ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg,#2563EB,#3B82F6)",
              border:"none",
              cursor: imgDone ? "not-allowed" : "pointer",
              boxShadow: imgDone ? "none" : "0 4px 16px rgba(37,99,235,0.3)",
              transition:"all 0.15s ease",
            }}
            onMouseDown={e => { if (!imgDone) e.currentTarget.style.transform = "scale(0.9)"; }}
            onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            onTouchStart={e => { if (!imgDone) e.currentTarget.style.transform = "scale(0.9)"; }}
            onTouchEnd={e => e.currentTarget.style.transform = "scale(1)"}
          >
            <svg width="24" height="24" viewBox="0 0 24 24"
              fill="none" stroke={imgDone ? "#3B4A6B" : "white"} strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </button>

          <input ref={fileRef} type="file" accept="image/*" onChange={handleImage}
            style={{ position:"absolute", width:0, height:0, opacity:0, pointerEvents:"none" }} />

          <textarea value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder={allDone ? "Limit ou a rive..." : imgDone ? "Poze yon kesyon tèks..." : "Poze yon kesyon oswa analize yon egzèsis..."}
            rows={1}
            disabled={allDone}
            className="flex-1 rounded-xl px-4 py-3 text-sm outline-none resize-none"
            style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.12)", maxHeight:80, color:"#E8EEFF", borderRadius:12, transition:"border-color .2s" }}
            onFocus={e => e.target.style.borderColor="rgba(37,99,235,0.4)"}
            onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"} />

          <button onClick={() => sendMessage()} disabled={loading || allDone}
            style={{
              width:48, height:48, borderRadius:14, flexShrink:0,
              display:"flex", alignItems:"center", justifyContent:"center",
              background: (loading || allDone) ? "rgba(59,130,246,0.4)" : "linear-gradient(135deg,#2563EB,#3B82F6)",
              border:"none",
              cursor: (loading || allDone) ? "not-allowed" : "pointer",
              boxShadow: (loading || allDone) ? "none" : "0 4px 16px rgba(37,99,235,0.4)",
              transition:"all 0.15s ease",
            }}
            onMouseDown={e => { if (!(loading || allDone)) e.currentTarget.style.transform = "scale(0.9)"; }}
            onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            onTouchStart={e => { if (!(loading || allDone)) e.currentTarget.style.transform = "scale(0.9)"; }}
            onTouchEnd={e => e.currentTarget.style.transform = "scale(1)"}
          >
            <svg width="22" height="22" viewBox="0 0 24 24"
              fill="none" stroke="white" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
      <BottomNav active="chat" onNavigate={onNavigate} />
    </div>
  );
}
// ─── QUIZ ────────────────────
function QuizScreen({ user, onNavigate }) {
  const [phase, setPhase] = useState("select");
  const [subject, setSubject] = useState(null);
  const [shuffledQs, setShuffledQs] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [shaking, setShaking] = useState(false);
  const [round, setRound] = useState(1);
  const [roundScore, setRoundScore] = useState(0);
  const [usedQKeys, setUsedQKeys] = useState(new Set());


  const availableSubjects = Object.keys(QUIZ_DATA).filter(s => user.subjects.includes(s));
  const currentQ = shuffledQs[qIndex];

  const startQCM = (sub) => {
    const all = shuffleArray(QUIZ_DATA[sub]);
    const first10 = all.slice(0, 10).map(shuffleChoices);
    const used = new Set(first10.map(q => q.q));
    setSubject(sub);
    setShuffledQs(first10);
    setUsedQKeys(used);
    setPhase("qcm");
    setQIndex(0); setScore(0); setTotalAnswered(0); setRoundScore(0);
    setHearts(3); setStreak(0); setMaxStreak(0);
    setWrongAnswers([]); setSelected(null); setRound(1);
  };

  const saveScoreToSupabase = async (finalScore, finalTotal, finalStreak) => {
    if (finalTotal === 0 || !subject) return;
    const note20 = scoreToNote20(finalScore, finalTotal);
    saveQuizGrade(user.phone, subject, note20, finalScore, finalTotal);
    try {
      await callEdge({
        action: "save_quiz_score",
        phone: user.phone, schoolCode: user.code,
        name: user.name || user.phone,
        subject, score: finalScore, total: finalTotal,
        note20, streak: finalStreak,
      });
    } catch (e) { console.warn("Score save failed", e); }
  };

  const handleChoice = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === currentQ.answer;
    setTotalAnswered(t => t + 1);
    if (correct) {
      setScore(s => s + 1);
      setRoundScore(r => r + 1);
      setStreak(s => {
        const ns = s + 1;
        setMaxStreak(m => Math.max(m, ns));
        return ns;
      });
    } else {
      // handleChoice décrémente hearts — handleNext lira la valeur déjà mise à jour
      setHearts(h => h - 1);
      setStreak(0);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      setWrongAnswers(p => [...p.slice(-4), {
        q: currentQ.q, selected: idx, correctIdx: currentQ.answer,
        choices: currentQ.choices, note: currentQ.note,
      }]);
    }
  };

  // handleNext utilise hearts tel qu'il est après handleChoice (valeur déjà décrémentée)
  const handleNext = async () => {
    // hearts est déjà à jour : si handleChoice a perdu le dernier cœur, hearts === 0 ici
    if (hearts <= 0) {
      await saveScoreToSupabase(score, totalAnswered, maxStreak);
      setPhase("gameover");
      return;
    }
    const next = qIndex + 1;
    // Fin du round de 10 questions → écran Bravo
    if (next >= shuffledQs.length) {
      await saveScoreToSupabase(score, totalAnswered, maxStreak);
      setPhase("bravo");
      return;
    }
    setQIndex(next);
    setSelected(null);
  };

  // Continuer avec 10 nouvelles questions différentes
  const continueQuiz = () => {
    const all = QUIZ_DATA[subject] || [];
    // Filtrer les questions déjà vues
    const unseen = all.filter(q => !usedQKeys.has(q.q));
    // Si toutes vues, repartir depuis zéro
    const pool = unseen.length >= 10 ? unseen : shuffleArray(all);
    const next10 = shuffleArray(pool).slice(0, 10).map(shuffleChoices);
    const newUsed = new Set([...usedQKeys, ...next10.map(q => q.q)]);
    setShuffledQs(next10);
    setUsedQKeys(newUsed);
    setQIndex(0);
    setSelected(null);
    setRoundScore(0);
    setRound(r => r + 1);
    setPhase("qcm");
  };



  const allIcons = {
    "SVT (Sciences de la Vie et de la Terre)": "🧬",
    "Physique": "⚡",
    "Chimie": "⚗️",
    "Philosophie & Dissertation": "🧠",
    "Sciences Sociales & Citoyenneté": "🌍",
    "Littérature Haïtienne": "🇭🇹",
    "Littérature Française": "🗼",
    "Mathématiques": "📐",
    "Kreyòl Ayisyen": "🗣️",
    "Art & Mizik Ayisyen": "🎵",
    "Anglais": "🇬🇧",
    "Espagnol": "🇪🇸",
    "Entrepreneuriat Scolaire": "💼",
    "Informatique, Technologie & Arts": "💻",
  };

  // ── SELECT ──
  if (phase === "select") return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "#0a0f2e" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 16px", background:"rgba(10,15,46,0.98)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.10)" }}>
        <div style={{ width:38, height:38, borderRadius:9, overflow:"hidden", flexShrink:0, background:"#fff", boxShadow:"0 2px 10px #00000044" }}>
          <img src={APP_LOGO} alt="Gid NS4" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        </div>
        <div>
          <h2 style={{ color:"#E8EEFF", fontWeight:800, fontSize:15, margin:0 }}>Quiz NS4</h2>
          <p style={{ color:"#4B6ABA", fontSize:11, margin:0, marginTop:1 }}>{availableSubjects.length} matière{availableSubjects.length > 1 ? "s" : ""} disponib</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {/* Mode infini info */}
        <div style={{ background:"linear-gradient(135deg,rgba(232,0,42,0.12),rgba(255,92,53,0.08))", border:"1px solid rgba(232,0,42,0.2)", borderRadius:16, padding:"12px 16px", display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:22 }}>❤️❤️❤️</span>
          <div>
            <div style={{ color:"#E8EEFF", fontWeight:700, fontSize:12 }}>Mode Duolingo — 3 kè</div>
            <div style={{ color:"#5B7ADB", fontSize:11, marginTop:2 }}>Kesyon enfini • Jwe jouk ou pèdi 3 kè</div>
          </div>
        </div>
        <p style={{ color:"#4B5EA8", fontSize:11, textAlign:"center", padding:"4px 0", letterSpacing:"0.08em", textTransform:"uppercase" }}>— Chwazi yon matière —</p>
        {availableSubjects.map(sub => (
          <button key={sub} onClick={() => startQCM(sub)}
            style={{
              width:"100%", padding:"14px 16px", borderRadius:16, textAlign:"left",
              display:"flex", alignItems:"center", gap:14, border:"none",
              background:"rgba(15,28,60,0.90)", border:"1px solid rgba(37,99,235,0.12)",
              boxShadow:"0 2px 12px rgba(0,0,0,0.2)", cursor:"pointer",
              transition:"all .2s", animation:"slideIn .3s ease both",
            }}
            onTouchStart={e => { e.currentTarget.style.transform="scale(0.97)"; e.currentTarget.style.borderColor="rgba(37,99,235,0.4)"; }}
            onTouchEnd={e => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.borderColor="rgba(37,99,235,0.12)"; }}>
            <div style={{ width:44, height:44, borderRadius:12, background:"rgba(37,99,235,0.12)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <span style={{ fontSize:24 }}>{allIcons[sub]}</span>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ color:"#E8EEFF", fontWeight:700, fontSize:13 }}>{sub}</div>
              <div style={{ color:"#4B5EA8", fontSize:11, marginTop:3 }}>{QUIZ_DATA[sub].length} kesyon • Mode infini 🔄</div>
            </div>
            <span style={{ color:"#4B5EA8", fontSize:18 }}>›</span>
          </button>
        ))}
        {Object.keys(QUIZ_DATA).filter(s => !user.subjects.includes(s)).map(sub => (
          <div key={sub} style={{
            width:"100%", padding:"14px 16px", borderRadius:16,
            display:"flex", alignItems:"center", gap:14,
            background:"rgba(12,21,48,0.4)", border:"1px solid rgba(37,99,235,0.05)",
            opacity:0.3, boxSizing:"border-box"
          }}>
            <div style={{ width:44, height:44, borderRadius:12, background:"rgba(37,99,235,0.06)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <span style={{ fontSize:22 }}>{allIcons[sub]}</span>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ color:"#E8EEFF", fontWeight:600, fontSize:13 }}>{sub}</div>
              <div style={{ color:"#4B5EA8", fontSize:11, marginTop:2 }}>Pa disponib ak kòd lekòl ou</div>
            </div>
            <span style={{ fontSize:14 }}>🔒</span>
          </div>
        ))}
      </div>
      <BottomNav active="quiz" onNavigate={onNavigate} />
    </div>
  );



  // ── QCM ──
  if (phase === "qcm" && currentQ) return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "#0a0f2e" }}>
      {/* Header avec cœurs + streak */}
      <div className="px-4 py-3 border-b" style={{ background: "rgba(10,15,46,0.98)", borderColor: "#ffffff10" }}>
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => setPhase("select")} className="text-blue-400 text-xl">←</button>
          <h2 className="text-white font-bold flex-1 text-sm">{subject}</h2>
          {/* Streak */}
          {streak >= 2 && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: "#f97316" + "33", border: "1px solid #f9731644" }}>
              <span style={{ fontSize: 14 }}>🔥</span>
              <span className="text-orange-400 font-black text-sm">{streak}</span>
            </div>
          )}
          {/* Cœurs */}
          <div className="flex gap-1" style={{ animation: shaking ? "shake .4s ease" : "none" }}>
            {[0,1,2].map(i => (
              <span key={i} style={{ fontSize: 20, opacity: i < hearts ? 1 : 0.15, filter: i < hearts ? "none" : "grayscale(1)" }}>❤️</span>
            ))}
          </div>
        </div>
        {/* Score compact */}
        <div className="flex items-center justify-between">
          <span className="text-blue-500 text-xs">Wònn {round} • {totalAnswered} kesyon</span>
          <span className="text-green-400 text-xs font-bold">{score} ✅</span>
        </div>
        {/* Barre de progression de la session (score/total) */}
        <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: "#0f1e4a" }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: totalAnswered > 0 ? `${(score / totalAnswered) * 100}%` : "0%", background: "linear-gradient(90deg,#22c55e,#86efac)" }} />
        </div>
      </div>

      <div className="flex-1 px-4 py-5 flex flex-col gap-4 overflow-y-auto">
        <div style={{ background:"rgba(15,28,60,0.95)", border:"1px solid rgba(37,99,235,0.15)", borderRadius:18, padding:"18px 18px", boxShadow:"0 4px 24px rgba(0,0,0,0.3)" }}>
          <p style={{ color:"#E8EEFF", fontWeight:600, fontSize:15, lineHeight:1.6, margin:0 }}>{currentQ.q}</p>
        </div>
        <div className="space-y-3">
          {currentQ.choices.map((choice, idx) => {
            const isCorrect = selected !== null && idx === currentQ.answer;
            const isWrong = selected !== null && idx === selected && idx !== currentQ.answer;
            const isNeutral = selected === null;
            const letters = ["A","B","C","D"];
            const letterColors = ["#2563EB","#7C3AED","#059669","#D97706"];
            return (
              <button key={idx} onClick={() => handleChoice(idx)}
                style={{
                  width:"100%", padding:"14px 16px", borderRadius:14, textAlign:"left",
                  display:"flex", alignItems:"center", gap:12,
                  background: isCorrect ? "rgba(34,197,94,0.12)" : isWrong ? "rgba(239,68,68,0.1)" : "rgba(15,28,60,0.90)",
                  border: `1.5px solid ${isCorrect ? "rgba(34,197,94,0.5)" : isWrong ? "rgba(239,68,68,0.4)" : "rgba(37,99,235,0.12)"}`,
                  color: isCorrect ? "#4ADE80" : isWrong ? "#FC8181" : "#E8EEFF",
                  cursor: selected !== null ? "default" : "pointer",
                  transform: isNeutral ? "none" : "none",
                  transition:"all .2s",
                  animation: `fadeIn .2s ${idx*0.05}s ease both`,
                  fontSize:14, fontWeight:500,
                  boxShadow: isCorrect ? "0 4px 20px rgba(34,197,94,0.15)" : isWrong ? "0 4px 20px rgba(239,68,68,0.1)" : "none"
                }}
                onTouchStart={e => { if(selected===null) e.currentTarget.style.transform="scale(0.97)"; }}
                onTouchEnd={e => { e.currentTarget.style.transform="scale(1)"; }}>
                <span style={{
                  width:28, height:28, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center",
                  fontWeight:800, fontSize:12, flexShrink:0,
                  background: isCorrect ? "#22C55E" : isWrong ? "#EF4444" : `${letterColors[idx]}22`,
                  color: isCorrect || isWrong ? "white" : letterColors[idx],
                  border: `1px solid ${isCorrect ? "#22C55E" : isWrong ? "#EF4444" : `${letterColors[idx]}44`}`
                }}>
                  {letters[idx]}
                </span>
                <span style={{ flex:1, lineHeight:1.4 }}>{choice}</span>
                {isCorrect && <span style={{ fontSize:16, flexShrink:0 }}>✅</span>}
                {isWrong && <span style={{ fontSize:16, flexShrink:0 }}>❌</span>}
              </button>
            );
          })}
        </div>

        {/* Explication + bouton suivant */}
        {selected !== null && (
          <div style={{ animation: "fadeIn .3s ease both" }}>
            {currentQ.note && (
              <div style={{
                background: selected === currentQ.answer ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.07)",
                border: `1px solid ${selected === currentQ.answer ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.2)"}`,
                borderRadius:14, padding:"12px 14px", marginBottom:12
              }}>
                <p style={{ color: selected === currentQ.answer ? "#86EFAC" : "#FCA5A5", fontSize:12, lineHeight:1.6, margin:0 }}>
                  💡 {currentQ.note}
                </p>
              </div>
            )}
            <button onClick={handleNext}
              className="w-full py-4 rounded-2xl font-bold text-white active:scale-95 transition-transform"
              style={{
              background: hearts <= 0 ? "linear-gradient(135deg,#E8002A,#EF4444)" : "linear-gradient(135deg,#2563EB,#3B82F6)",
              boxShadow: hearts <= 0 ? "0 4px 20px rgba(232,0,42,0.3)" : "0 4px 20px rgba(37,99,235,0.3)",
              borderRadius:14, border:"none"
            }}>
              {hearts <= 0 ? "💔 Gade Rezilta" : "Kesyon ki vini apre →"}
            </button>
          </div>
        )}
      </div>
      <BottomNav active="quiz" onNavigate={onNavigate} />
    </div>
  );

  // ── GAME OVER ──
  // ── BRAVO (fin d'un round de 10 questions) ──
  if (phase === "bravo") {
    const note20 = scoreToNote20(roundScore, 10);
    const mention = getMention(note20);
    const allCount = (QUIZ_DATA[subject] || []).length;
    const seenCount = usedQKeys.size;
    const hasMore = (allCount - seenCount) >= 5;
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center px-6" style={{ background: "linear-gradient(160deg,#0a0f2e,#0d1b4b,#1a0505)" }}>
        <div className="w-full max-w-sm space-y-5" style={{ animation: "popIn .5s cubic-bezier(.34,1.56,.64,1) both" }}>
          {/* Emoji + titre */}
          <div className="text-center">
            <div style={{ fontSize: 64 }}>🎉</div>
            <h2 className="text-white font-black text-3xl mt-2">Bravo !</h2>
            <p className="text-blue-300 text-sm mt-1">{subject} • Wònn {round}</p>
          </div>

          {/* Score du round */}
          <div className="rounded-3xl px-5 py-5 text-center" style={{ background: mention.bg, border: `2px solid ${mention.border}` }}>
            <div style={{ fontSize: 40 }}>{mention.emoji}</div>
            <div className="font-black mt-1" style={{ fontSize: 48, color: mention.color, lineHeight: 1 }}>
              {note20}<span className="text-xl" style={{ color: mention.color + "99" }}>/20</span>
            </div>
            <div className="text-white font-bold text-lg mt-1">{mention.label}</div>
            <div className="text-blue-300 text-sm mt-1">{roundScore}/10 kòrèk • {streak > 0 ? `🔥 Streak ${streak}` : ""}</div>
          </div>

          {/* Stats globales */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: "✅", val: score, label: "Total kòrèk" },
              { icon: "🔥", val: maxStreak, label: "Max streak" },
              { icon: "📚", val: `${seenCount}/${allCount}`, label: "Kesyon wè" },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl p-3 text-center" style={{ background: "#0f1e4a", border: "1px solid #1e3a8a33" }}>
                <div style={{ fontSize: 18 }}>{s.icon}</div>
                <div className="text-white font-black text-base">{s.val}</div>
                <div className="text-blue-500 text-xs">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Question */}
          <p className="text-white font-bold text-center text-lg">Ou vle kontinye ?</p>

          {/* Boutons */}
          <div className="flex gap-3">
            <button onClick={continueQuiz} disabled={!hasMore && seenCount >= allCount}
              className="flex-1 py-4 rounded-2xl font-black text-white text-lg active:scale-95 transition-transform"
              style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)", boxShadow: "0 4px 20px #22c55e44" }}>
              ✅ Wi
            </button>
            <button onClick={() => setPhase("select")}
              className="flex-1 py-4 rounded-2xl font-black text-lg active:scale-95 transition-transform"
              style={{ background: "#0f1e4a", color: "#93c5fd", border: "1px solid #1e3a8a33" }}>
              ❌ Non
            </button>
          </div>

          {!hasMore && seenCount >= allCount && (
            <p className="text-yellow-400 text-xs text-center">🏆 Ou fini tout {allCount} kesyon yo ! Bravo !</p>
          )}
        </div>
      </div>
    );
  }

  if (phase === "gameover") {
    const note20 = scoreToNote20(score, totalAnswered);
    const mention = getMention(note20);
    return (
      <div className="fixed inset-0 flex flex-col" style={{ background: "#0a0f2e" }}>
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {/* Header Game Over */}
          <div className="text-center" style={{ animation: "popIn .5s cubic-bezier(.34,1.56,.64,1) both" }}>
            <div style={{ fontSize: 64 }}>💔</div>
            <h2 className="text-white font-black text-3xl mt-2">Game Over</h2>
            <p className="text-blue-400 text-sm mt-1">{subject}</p>
          </div>

          {/* Note principale */}
          <div className="rounded-3xl px-5 py-5 text-center"
            style={{ background: mention.bg, border: `2px solid ${mention.border}` }}>
            <div style={{ fontSize: mention.emoji === "🏆" ? 40 : 36 }}>{mention.emoji}</div>
            <div className="font-black mt-1" style={{ fontSize: 52, color: mention.color, lineHeight: 1 }}>
              {note20}<span className="text-xl font-bold" style={{ color: mention.color + "99" }}>/20</span>
            </div>
            <div className="text-white font-bold text-lg mt-1">{mention.label}</div>
            <div className="text-blue-300 text-sm mt-1">{score}/{totalAnswered} kòrèk • {subject}</div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: "🔥", val: maxStreak, label: "Max Streak" },
              { icon: "✅", val: score, label: "Kòrèk" },
              { icon: "❓", val: totalAnswered, label: "Total" },
            ].map((stat, i) => (
              <div key={i} className="rounded-2xl p-3 text-center" style={{ background: "#0f1e4a", border: "1px solid #1e3a8a33" }}>
                <div style={{ fontSize: 22 }}>{stat.icon}</div>
                <div className="text-white font-black text-xl">{stat.val}</div>
                <div className="text-blue-500 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Dernières erreurs */}
          {wrongAnswers.length > 0 && (
            <div className="rounded-2xl p-4" style={{ background: "#0f1e4a", border: "1px solid #1e3a8a33" }}>
              <h3 className="text-white font-bold text-sm mb-3">📝 Dènye Erè Ou :</h3>
              <div className="space-y-3">
                {wrongAnswers.slice(-3).map((a, i) => (
                  <div key={i} className="rounded-xl px-3 py-2" style={{ background: "#7f1d1d22", border: "1px solid #ef444433" }}>
                    <p className="text-white text-xs font-medium mb-1">{a.q}</p>
                    <p className="text-xs" style={{ color: "#fca5a5" }}>❌ {a.choices[a.selected]}</p>
                    <p className="text-xs text-green-400">✅ {a.choices[a.correctIdx]}</p>
                    {a.note && <p className="text-xs mt-1" style={{ color: "#93c5fd" }}>💡 {a.note}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button onClick={() => startQCM(subject)} className="w-full py-4 rounded-2xl font-bold text-white"
            style={{ background: "linear-gradient(135deg,#d4002a,#ff6b35)" }}>🔄 Eseye Ankò</button>
          <button onClick={() => setPhase("select")} className="w-full py-4 rounded-2xl font-bold"
            style={{ background: "#0f1e4a", color: "#93c5fd", border: "1px solid #1e3a8a33" }}>← Chwazi lòt matyè</button>
        </div>
        <BottomNav active="quiz" onNavigate={onNavigate} />
      </div>
    );
  }

  return null;
}

// ─── LEADERBOARD ──────────────────────────────────────────────────────────────
function LeaderboardScreen({ user, onNavigate }) {
  const [tab, setTab] = useState("bestNote");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    callEdge({ action: "get_leaderboard", phone: user.phone, schoolCode: user.code })
      .then(d => setData(d))
      .catch(e => setError(parseApiError(e).message))
      .finally(() => setLoading(false));
  }, []);

  const tabs = [
    { id: "bestNote", icon: "🏆", label: "Pi bon nòt", valueLabel: "/20" },
    { id: "totalCorrect", icon: "🔥", label: "Total Kòrèk", valueLabel: " pts" },
    { id: "thisWeek", icon: "📅", label: "Semèn Sa", valueLabel: " pts" },
  ];

  const currentTab = tabs.find(t => t.id === tab);
  const board = data ? data[tab] : [];
  const colors = ["#fbbf24","#94a3b8","#cd7c32","#3b82f6","#22c55e","#a855f7","#f97316","#14b8a6","#ec4899","#6366f1"];
  const medalEmojis = ["🥇","🥈","🥉"];

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "#0a0f2e" }}>
      {/* Header */}
      <div className="px-4 py-4 border-b" style={{ background: "rgba(10,15,46,0.98)", borderColor: "#ffffff10" }}>
        <div className="flex items-center gap-3 mb-3">
          <span style={{ fontSize: 24 }}>🏆</span>
          <div>
            <h2 className="text-white font-bold">Klasman</h2>
            <p className="text-blue-400 text-xs">{user.school}</p>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex gap-2">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
              style={{
                background: tab === t.id ? "linear-gradient(135deg,#d4002a,#ff6b35)" : "#0f1e4a",
                color: tab === t.id ? "white" : "#4b5ea8",
                border: tab === t.id ? "none" : "1px solid #1e3a8a33",
              }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="flex gap-2">
              {[0,1,2].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-blue-400" style={{ animation: `bounce 1s ${i*0.2}s infinite` }} />)}
            </div>
            <p className="text-blue-500 text-sm">Chajman Klasman an...</p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl px-4 py-4 text-center" style={{ background: "#7f1d1d22", border: "1px solid #ef444433" }}>
            <p className="text-red-400 text-sm">⚠️ {error}</p>
            <button onClick={() => { setLoading(true); setError(null); callEdge({ action: "get_leaderboard", phone: user.phone, schoolCode: user.code }).then(d => setData(d)).catch(e => setError(parseApiError(e).message)).finally(() => setLoading(false)); }}
              className="mt-3 px-4 py-2 rounded-xl text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg,#d4002a,#ff6b35)" }}>
              🔄 Eseye Ankò
            </button>
          </div>
        )}

        {!loading && !error && board?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <span style={{ fontSize: 56 }}>📊</span>
            <p className="text-blue-400 text-center text-sm">Pa gen done ankò.<br />Fè kèk quiz pou parèt nan klasman an !</p>
            <button onClick={() => onNavigate("quiz")} className="px-6 py-3 rounded-xl font-bold text-white text-sm"
              style={{ background: "linear-gradient(135deg,#d4002a,#ff6b35)" }}>→ Ale nan Quiz</button>
          </div>
        )}

        {!loading && !error && board?.length > 0 && (
          <>
            {/* Top 3 podium */}
            {board.length >= 3 && (
              <div className="flex items-end justify-center gap-3 py-4" style={{ animation: "fadeIn .5s ease both" }}>
                {/* 2nd */}
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:1 }}>
                  <div style={{ fontSize:28, marginBottom:6 }}>🥈</div>
                  <div style={{
                    width:"100%", borderRadius:"14px 14px 0 0", display:"flex", flexDirection:"column", alignItems:"center",
                    padding:"12px 8px", height:80, background:"linear-gradient(180deg,rgba(148,163,184,0.15),rgba(148,163,184,0.05))",
                    border:"1px solid rgba(148,163,184,0.25)", borderBottom:"none"
                  }}>
                    <div style={{ color:"#E8EEFF", fontWeight:700, fontSize:11, textAlign:"center", lineHeight:1.3 }}>{board[1].name || board[1].phone}</div>
                    <div style={{ fontWeight:900, marginTop:6, color:"#94A3B8", fontSize:15 }}>{board[1].value}{currentTab.valueLabel}</div>
                  </div>
                </div>
                {/* 1st */}
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:1 }}>
                  <div style={{ fontSize:36, marginBottom:6, filter:"drop-shadow(0 0 12px #F59E0B)" }}>🥇</div>
                  <div style={{
                    width:"100%", borderRadius:"14px 14px 0 0", display:"flex", flexDirection:"column", alignItems:"center",
                    padding:"14px 8px", height:100, background:"linear-gradient(180deg,rgba(251,191,36,0.2),rgba(251,191,36,0.05))",
                    border:"1px solid rgba(251,191,36,0.35)", borderBottom:"none",
                    boxShadow:"0 -4px 20px rgba(251,191,36,0.15)"
                  }}>
                    <div style={{ color:"#FDE68A", fontWeight:800, fontSize:11, textAlign:"center", lineHeight:1.3 }}>{board[0].name || board[0].phone}</div>
                    <div style={{ fontWeight:900, marginTop:6, color:"#FBD04A", fontSize:20 }}>{board[0].value}{currentTab.valueLabel}</div>
                    {board[0].isMe && <div style={{ color:"#F59E0B", fontSize:10, marginTop:4 }}>← Ou</div>}
                  </div>
                </div>
                {/* 3rd */}
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:1 }}>
                  <div style={{ fontSize:26, marginBottom:6 }}>🥉</div>
                  <div style={{
                    width:"100%", borderRadius:"14px 14px 0 0", display:"flex", flexDirection:"column", alignItems:"center",
                    padding:"10px 6px", height:65, background:"linear-gradient(180deg,rgba(205,124,50,0.15),rgba(205,124,50,0.05))",
                    border:"1px solid rgba(205,124,50,0.25)", borderBottom:"none"
                  }}>
                    <div style={{ color:"#E8EEFF", fontWeight:700, fontSize:10, textAlign:"center", lineHeight:1.3 }}>{board[2].name || board[2].phone}</div>
                    <div style={{ fontWeight:900, marginTop:5, color:"#CD7C32", fontSize:14 }}>{board[2].value}{currentTab.valueLabel}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Liste complète */}
            <div className="space-y-2">
              {board.map((entry, i) => (
                <div key={i} style={{
                    display:"flex", alignItems:"center", gap:12, padding:"12px 14px", borderRadius:14,
                    background: entry.isMe ? "rgba(37,99,235,0.15)" : "rgba(15,28,60,0.80)",
                    border: entry.isMe ? "1.5px solid rgba(37,99,235,0.5)" : "1px solid rgba(255,255,255,0.10)",
                    animation: `slideIn .3s ${i * 0.04}s ease both`,
                    boxShadow: entry.isMe ? "0 4px 20px rgba(37,99,235,0.15)" : "0 2px 8px rgba(0,0,0,0.15)"
                  }}>
                  <div style={{
                    width:32, height:32, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center",
                    fontWeight:900, fontSize:12, flexShrink:0,
                    background:`${colors[i % colors.length]}20`, color:colors[i % colors.length]
                  }}>
                    {i < 3 ? medalEmojis[i] : `#${entry.rank}`}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ color:"#E8EEFF", fontWeight:700, fontSize:13, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{entry.name || entry.phone}</span>
                      {entry.isMe && (
                        <span style={{ padding:"2px 7px", borderRadius:20, fontSize:10, fontWeight:700, background:"#2563EB", color:"white", flexShrink:0 }}>Ou</span>
                      )}
                    </div>
                  </div>
                  <div style={{ fontWeight:900, fontSize:17, color:colors[i % colors.length], flexShrink:0 }}>
                    {entry.value}<span style={{ fontSize:10, fontWeight:400, opacity:0.6 }}>{currentTab.valueLabel}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Ma position si pas dans top 10 */}
            {data && !board.find(e => e.isMe) && (
              <div className="rounded-2xl px-4 py-3 text-center" style={{ background: "#1a4fd622", border: "1px solid #3b82f633" }}>
                <p className="text-blue-300 text-xs">Fè plis quiz pou parèt nan top 10 lan ! 💪</p>
              </div>
            )}

            {data?.currentWeek && tab === "thisWeek" && (
              <p className="text-blue-800 text-xs text-center">Semèn : {data.currentWeek}</p>
            )}
          </>
        )}
      </div>
      <BottomNav active="leaderboard" onNavigate={onNavigate} />
    </div>
  );
}

// ─── HISTORY ──────────────────────────────────────────────────────────────────
function HistoryScreen({ user, onNavigate }) {
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    idbGetScans(user.phone).then(data => setHistory(data)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (entry) => {
    setDeleting(entry.id);
    await idbDeleteScan(entry.id);
    setHistory(h => h.filter(x => x.id !== entry.id));
    if (selected?.id === entry.id) setSelected(null);
    setDeleting(null);
  };

  const dailyMap = {};
  history.forEach(h => {
    const day = h.scanDate || h.date?.split(",")[0] || "?";
    if (!dailyMap[day]) dailyMap[day] = 0;
    dailyMap[day]++;
  });

  if (selected) return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "#0a0f2e" }}>
      <div className="px-4 py-4 border-b flex items-center gap-3" style={{ background: "rgba(10,15,46,0.98)", borderColor: "#ffffff10" }}>
        <button onClick={() => setSelected(null)} className="text-blue-400 text-xl">←</button>
        <div className="flex-1">
          <h2 className="text-white font-bold">Detay Scan</h2>
          <p className="text-blue-400 text-xs">{selected.subject} • {selected.date}</p>
        </div>
        <button onClick={() => handleDelete(selected)} disabled={deleting === selected.id}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1"
          style={{ background: "#d4002a22", color: "#ff8080", border: "1px solid #d4002a33" }}>
          {deleting === selected.id ? "⏳" : "🗑️"} Efase
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {!selected._fallback ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "#14532d22", border: "1px solid #22c55e22" }}>
            <span>🗄️</span>
            <span className="text-green-300 text-xs">Stocké dans IndexedDB • Image disponible hors-ligne</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "#78350f22", border: "1px solid #f59e0b22" }}>
            <span>⚠️</span>
            <span className="text-yellow-300 text-xs">Mode fallback — image non disponible hors-ligne</span>
          </div>
        )}
        {selected.image ? (
          <div>
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">📷 Imaj ki analize</p>
            <img src={selected.image} alt="scan" className="w-full rounded-2xl object-contain max-h-56" style={{ border: "1px solid #1e3a8a44" }} />
          </div>
        ) : (
          <div className="rounded-2xl px-4 py-3 flex items-center gap-3" style={{ background: "#1e3a8a11", border: "1px solid #1e3a8a22" }}>
            <span>💬</span>
            <span className="text-blue-600 text-xs">Kesyon tèks — pa gen imaj</span>
          </div>
        )}
        <div className="rounded-2xl p-4" style={{ background: "#0f1e4a", border: "1px solid #1e3a8a33" }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-xl overflow-hidden" style={{ background: "#fff" }}>
  <img 
    src={PROF_LAKAY_PHOTO} 
    alt="Prof Lakay" 
    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
  />
</div>
            <span className="text-white font-bold text-sm">Repons Prof Lakay</span>
          </div>
          <div className="text-sm leading-relaxed" style={{ color: "#e0e8ff" }}>
            <LatexText content={selected.response} />
          </div>
        </div>
        <div className="rounded-2xl px-4 py-3 flex justify-between" style={{ background: "#0f1e4a", border: "1px solid #1e3a8a22" }}>
          <span className="text-blue-400 text-xs">Scan itilize jou sa</span>
          <span className="text-orange-300 font-bold text-xs">{selected.scansUsed}/{selected.dailyLimit || user.dailyScans}</span>
        </div>
      </div>
      <BottomNav active="history" onNavigate={onNavigate} />
    </div>
  );

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "#0a0f2e" }}>
      <div className="px-4 py-4 border-b" style={{ background: "rgba(10,15,46,0.98)", borderColor: "#ffffff10" }}>
        <h2 className="text-white font-bold">📋 Istwa Scan Ou</h2>
        <div className="flex items-center gap-3 mt-0.5">
          <p className="text-blue-400 text-xs">{history.length} scan{history.length !== 1 ? "s" : ""} total</p>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#14532d22", color: "#86efac", border: "1px solid #22c55e22" }}>
            🗄️ IndexedDB • hors-ligne
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="flex gap-2">
              {[0,1,2].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-blue-400" style={{ animation: `bounce 1s ${i*0.2}s infinite` }} />)}
            </div>
            <p className="text-blue-500 text-sm">Chajman istwa ou depi IndexedDB...</p>
          </div>
        )}
        {!loading && Object.keys(dailyMap).length > 0 && (
          <div className="rounded-2xl p-4" style={{ background: "#0f1e4a", border: "1px solid #1e3a8a33" }}>
            <h3 className="text-white font-bold text-sm mb-3">📊 Scan pa Jou</h3>
            <div className="space-y-2">
              {Object.entries(dailyMap).slice(0, 7).map(([day, count]) => (
                <div key={day} className="flex items-center gap-3">
                  <span className="text-blue-400 text-xs w-24 flex-shrink-0">{day}</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "#1e3a8a44" }}>
                    <div className="h-full rounded-full" style={{ width: `${(count / user.dailyScans) * 100}%`, background: count >= user.dailyScans ? "#ef4444" : "linear-gradient(90deg,#d4002a,#ff6b35)" }} />
                  </div>
                  <span className="text-orange-300 text-xs font-bold w-10 text-right">{count}/{user.dailyScans}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {!loading && history.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <span style={{ fontSize: 56 }}>📭</span>
            <p className="text-blue-400 text-center text-sm">Pa gen istwa encore.<br />Fè premye scan ou nan Chat !</p>
            <button onClick={() => onNavigate("chat")} className="px-6 py-3 rounded-xl font-bold text-white text-sm"
              style={{ background: "linear-gradient(135deg,#d4002a,#ff6b35)" }}>→ Ale nan Chat</button>
          </div>
        )}
        {!loading && history.length > 0 && (
          <>
            <h3 className="text-blue-400 text-xs font-semibold uppercase tracking-wider">Tout Scan Ou Yo</h3>
            {history.map(h => (
              <div key={h.id} className="rounded-2xl overflow-hidden" style={{ background: "#0f1e4a", border: "1px solid #1e3a8a33" }}>
                <button onClick={() => setSelected(h)} className="w-full text-left active:scale-95 transition-transform">
                  <div className="flex gap-3 p-4">
                    {h.image ? (
                      <img src={h.image} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" style={{ border: "1px solid #1e3a8a44" }} />
                    ) : (
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#1e3a8a33" }}>
                        <span style={{ fontSize: 24 }}>💬</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "#d4002a22", color: "#ff8080" }}>{h.subject}</span>
                        {h.image && <span className="text-green-700 text-xs">🗄️</span>}
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: "#93c5fd", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {h.response?.slice(0, 100)}...
                      </p>
                      <p className="text-blue-800 text-xs mt-1">{h.date}</p>
                    </div>
                    <span className="text-blue-700 text-lg self-center">›</span>
                  </div>
                </button>
                <div className="px-4 pb-3 flex justify-end">
                  <button onClick={() => handleDelete(h)} disabled={deleting === h.id}
                    className="px-3 py-1 rounded-lg text-xs font-semibold"
                    style={{ background: "#d4002a15", color: "#ff8080", border: "1px solid #d4002a22" }}>
                    {deleting === h.id ? "⏳" : "🗑️ Efase"}
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <BottomNav active="history" onNavigate={onNavigate} />
    </div>
  );
}

// ─── MENU ─────────────────────────────────────────────────────────────────────
function MenuScreen({ user, onNavigate, onLogout }) {
  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "linear-gradient(145deg,#04081A,#080E24)" }}>
      <div style={{ padding:"32px 20px 20px", borderBottom:"1px solid rgba(255,255,255,0.10)" }}>
        {/* Profile Card */}
        <div style={{
          background:"rgba(15,28,60,0.80)", backdropFilter:"blur(20px)",
          border:"1px solid rgba(255,255,255,0.12)", borderRadius:20,
          padding:"16px", display:"flex", alignItems:"center", gap:14,
          boxShadow:"0 8px 32px rgba(0,0,0,0.3)"
        }}>
          <div style={{ width:52, height:52, borderRadius:14, overflow:"hidden", flexShrink:0, background:"#fff", boxShadow:"0 4px 16px rgba(0,0,0,0.3)" }}>
            <img src={APP_LOGO} alt="Gid NS4" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ color:"#E8EEFF", fontWeight:800, fontSize:15, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.name || user.phone}</div>
            <div style={{ color:"#4B6ABA", fontSize:11, marginTop:2 }}>{user.phone}</div>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:4 }}>
              <span style={{ background:"rgba(37,99,235,0.15)", border:"1px solid rgba(37,99,235,0.25)", borderRadius:20, padding:"2px 8px", color:"#6B8ADB", fontSize:10, fontWeight:600 }}>
                🔑 {user.code}
              </span>
            </div>
          </div>
        </div>
        <div style={{ color:"#3B5BA8", fontSize:11, textAlign:"center", marginTop:10 }}>{user.school}</div>
        <div className="mt-4 rounded-xl px-4 py-3 flex justify-between items-center"
          style={{ background: user.daysRemaining <= 7 ? "#d4002a22" : "#14532d22", border: `1px solid ${user.daysRemaining <= 7 ? "#d4002a44" : "#22c55e33"}` }}>
          <div>
            <div className="text-xs font-bold" style={{ color: user.daysRemaining <= 7 ? "#ff8080" : "#86efac" }}>
              {user.daysRemaining <= 7 ? "⚠️ Ekspire byento" : "✅ Kòd Aktif"}
            </div>
            <div className="text-xs mt-0.5" style={{ color: user.daysRemaining <= 7 ? "#ff6060" : "#6ee7b7" }}>
              {user.daysRemaining} jou rete • {user.dailyScans} scan/jou
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-blue-400">{user.subjects.length} matière{user.subjects.length > 1 ? "s" : ""}</div>
          </div>
        </div>
      </div>
      <div className="flex-1 px-4 py-4 space-y-2">
        {[
          { icon: "📊", label: "Dashboard Direksyon", screen: "dashboard" },
          { icon: "💳", label: "Pèman", screen: "payment" },
          { icon: "🤝", label: "Vin Patnè", screen: "partner" },
        ].map(item => (
          <button key={item.screen} onClick={() => onNavigate(item.screen)}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left active:scale-95 transition-transform"
            style={{ background: "#ffffff08", border: "1px solid #ffffff10" }}>
            <span style={{ fontSize: 24 }}>{item.icon}</span>
            <span className="text-white font-medium">{item.label}</span>
            <span className="ml-auto text-blue-600">›</span>
          </button>
        ))}
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl" style={{ background: "#14532d15", border: "1px solid #22c55e22" }}>
          <span>🔒</span>
          <div>
            <div className="text-green-300 text-sm font-semibold">Koneksyon Sekirize</div>
            <div className="text-green-800 text-xs">Kle API pwoteje</div>
          </div>
        </div>
      </div>
      <div className="px-4 pb-4">
        <button onClick={onLogout} className="w-full py-4 rounded-2xl text-red-400 font-semibold"
          style={{ background: "#d4002a15", border: "1px solid #d4002a30" }}>Dekonekte</button>
      </div>
      <BottomNav active="menu" onNavigate={onNavigate} />
    </div>
  );
}

// ─── PAYMENT ──────────────────────────────────────────────────────────────────
function PaymentScreen({ onBack }) {
  const [payments, setPayments] = useState([]);
  const [copied, setCopied] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    callEdge({ action: "get_payment_numbers" })
      .then(d => setPayments(d.payments || []))
      .catch(() => setPayments([{ method: "MonCash", number: "50948695079" }, { method: "NatCash", number: "50940669105" }]))
      .finally(() => setLoading(false));
  }, []);

  const copy = (num, key) => {
    navigator.clipboard?.writeText(num).catch(() => {});
    setCopied(key); setTimeout(() => setCopied(null), 2500);
  };

  const cardStyle = {
    MonCash: { grad: "linear-gradient(135deg,#c0392b,#e74c3c)", icon: "https://i.postimg.cc/J4h15HZC/telechargement.jpg", sub: "Digicel Haiti" },
    NatCash: { grad: "linear-gradient(135deg,#e67e22,#f39c12)", icon: "https://i.postimg.cc/1zXmJhDn/file-00000000ae3c71f788921fb0d044db44.jpg", sub: "Natcom Haiti" },
  };

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "linear-gradient(145deg,#04081A,#080E24)" }}>
      <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor: "#ffffff10" }}>
        <button onClick={onBack} className="text-blue-400 text-xl">←</button>
        <h2 className="text-white font-bold text-lg">Pèman & Aktivasyon</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="flex gap-2">{[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-blue-400" style={{ animation: `bounce 1s ${i*0.2}s infinite` }} />)}</div>
          </div>
        ) : payments.map(p => {
          const style = cardStyle[p.method] || { grad: "linear-gradient(135deg,#333,#555)", icon: "💳", sub: "" };
          return (
            <div key={p.method} className="rounded-3xl" style={{ background: style.grad }}>
              <div className="px-5 py-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center" style={{ overflow: "hidden" }}>
  <img 
    src={style.icon} 
    alt={p.method}
    style={{ width: "70%", height: "70%", objectFit: "contain" }}
  />
</div>
                  <div><div className="text-white font-black text-xl">{p.method}</div><div className="text-white/70 text-xs">{style.sub}</div></div>
                </div>
                <div className="bg-white/15 rounded-2xl px-4 py-3 mb-4">
                  <div className="text-white/70 text-xs mb-1">Nimewo {p.method}</div>
                  <div className="text-white font-black text-2xl tracking-widest">{p.number}</div>
                </div>
                <button onClick={() => copy(p.number, p.method)}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2"
                  style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)" }}>
                  {copied === p.method ? "✅ Kopye !" : "📋 Kopye Nimewo a"}
                </button>
                <p className="text-white/60 text-xs text-center mt-3">⚡ Aktivasyon garanti an mwens 30 minit</p>
              </div>
            </div>
          );
        })}
        <button onClick={() => window.open("https://wa.me/50900000000?text=Bonjou%2C%20mwen%20vle%20aktive%20Gid%20NS4.", "_blank")}
          className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-3"
          style={{ background: "linear-gradient(135deg,#25d366,#128c7e)" }}>
          <span style={{ fontSize: 22 }}>💬</span> Konfime Pèman sou WhatsApp
        </button>
      </div>
    </div>
  );
}


// ─── GÉNÉRATION PDF RAPPORT ───────────────────────────────────────────────────
async function generateAndSharePDF(school, stats) {
  // Charger jsPDF dynamiquement depuis CDN
  if (!window.jspdf) {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const date = new Date().toLocaleDateString("fr-HT", { timeZone: "America/Port-au-Prince", day: "2-digit", month: "long", year: "numeric" });
  const W = 210, margin = 18;

  // ── Fond header ──
  doc.setFillColor(10, 15, 46);
  doc.rect(0, 0, W, 50, "F");

  // ── Titre ──
  doc.setTextColor(255, 107, 53);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("GID NS4", margin, 22);

  doc.setTextColor(147, 197, 253);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Rapò Pèfòmans Etablisman", margin, 30);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(school.name, margin, 40);

  doc.setTextColor(147, 197, 253);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Dat rapò : ${date}`, margin, 47);

  // ── Section statistiques ──
  let y = 62;
  doc.setTextColor(30, 58, 138);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("STATISTIQUES GLOBALES", margin, y);
  y += 2;
  doc.setDrawColor(212, 0, 42);
  doc.setLineWidth(0.8);
  doc.line(margin, y, W - margin, y);
  y += 8;

  const statItems = [
    { label: "Total Scans Réalisés", val: String(stats.totalScans || 0) },
    { label: "Élèves Actifs", val: String(stats.totalStudents || 0) },
    { label: "Scans Aujourd'hui", val: String(stats.scansToday || 0) },
    { label: "Quota Journalier", val: `${school.dailyScans} scan/jour` },
    { label: "Abonnement", val: `${school.daysRemaining} jours restants` },
    { label: "Matières Autorisées", val: String(school.subjects.length) },
    { label: "Limite Élèves", val: String(school.maxStudents || "—") },
  ];

  statItems.forEach(({ label, val }, i) => {
    const rowY = y + i * 9;
    if (i % 2 === 0) {
      doc.setFillColor(241, 245, 249);
      doc.rect(margin - 2, rowY - 5, W - 2 * margin + 4, 8, "F");
    }
    doc.setTextColor(30, 30, 60);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(label, margin, rowY);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(212, 0, 42);
    doc.text(val, W - margin, rowY, { align: "right" });
  });

  y += statItems.length * 9 + 10;

  // ── Section matières scannées ──
  const subjectEntries = Object.entries(stats.subjectBreakdown || {}).sort((a, b) => b[1] - a[1]);
  if (subjectEntries.length > 0) {
    doc.setTextColor(30, 58, 138);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("MATIÈRES LES PLUS UTILISÉES", margin, y);
    y += 2;
    doc.setDrawColor(212, 0, 42);
    doc.line(margin, y, W - margin, y);
    y += 8;

    const maxCount = Math.max(...subjectEntries.map(e => e[1]), 1);
    const barW = W - 2 * margin - 40;
    const colors = [[34,197,94],[59,130,246],[245,158,11],[168,85,247],[236,72,153],[20,184,166]];

    subjectEntries.slice(0, 10).forEach(([sub, count], i) => {
      const rowY = y + i * 11;
      const pct = count / maxCount;
      const [r, g, b] = colors[i % colors.length];
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(30, 30, 60);
      doc.text(sub.length > 30 ? sub.slice(0,28)+"…" : sub, margin, rowY);
      // Barre
      doc.setFillColor(220, 230, 245);
      doc.roundedRect(margin, rowY + 1.5, barW, 4, 1, 1, "F");
      doc.setFillColor(r, g, b);
      doc.roundedRect(margin, rowY + 1.5, barW * pct, 4, 1, 1, "F");
      // Valeur
      doc.setFont("helvetica", "bold");
      doc.setTextColor(r, g, b);
      doc.text(`${count}`, W - margin, rowY + 4.5, { align: "right" });
    });

    y += subjectEntries.slice(0,10).length * 11 + 8;
  }

  // ── Section matières autorisées ──
  if (school.subjects && school.subjects.length > 0) {
    doc.setTextColor(30, 58, 138);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("MATIÈRES AUTORISÉES", margin, y);
    y += 2;
    doc.setDrawColor(212, 0, 42);
    doc.line(margin, y, W - margin, y);
    y += 8;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 30, 60);
    school.subjects.forEach((sub, i) => {
      doc.text(`• ${sub}`, margin + 3, y + i * 7);
    });
    y += school.subjects.length * 7 + 8;
  }

  // ── Pied de page ──
  const footerY = 285;
  doc.setFillColor(10, 15, 46);
  doc.rect(0, footerY - 6, W, 20, "F");
  doc.setTextColor(147, 197, 253);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Gid NS4 — Asistan IA pou Elèv NS4 Haïti", W / 2, footerY, { align: "center" });
  doc.setTextColor(255, 107, 53);
  doc.text(`Généré le ${date}`, W / 2, footerY + 5, { align: "center" });

  // ── Téléchargement ──
  const filename = `GidNS4_Rapport_${school.name.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0,10)}.pdf`;
  doc.save(filename);

  // ── Partage WhatsApp ──
  const msg = encodeURIComponent(
    `📊 *Rapò Gid NS4 — ${school.name}*\n` +
    `📅 ${date}\n\n` +
    `🔍 Total scans : ${stats.totalScans || 0}\n` +
    `👥 Élèves actifs : ${stats.totalStudents || 0}\n` +
    `📅 Scans d'aujourd'hui : ${stats.scansToday || 0}\n` +
    `⏳ ${school.daysRemaining} jou rete\n\n` +
    `_Rapò PDF téléchargé — Gid NS4_`
  );
  window.open(`https://wa.me/?text=${msg}`, "_blank");
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function DashboardScreen({ onBack, userCode }) {
  const [dirCode, setDirCode] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const handleAuth = async () => {
    setLoading(true); setError("");
    try {
      const result = await callEdge({ action: "dashboard", schoolCode: userCode, directorCode: dirCode.trim() });
      setStats(result); setAuthorized(true);
    } catch (e) { setError(parseApiError(e).message); }
    setLoading(false);
  };

  if (!authorized) return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "linear-gradient(145deg,#04081A,#080E24)" }}>
      <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor: "#ffffff10" }}>
        <button onClick={onBack} className="text-blue-400 text-xl">←</button>
        <h2 className="text-white font-bold">Dashboard Direction</h2>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <span style={{ fontSize: 56 }}>🔐</span>
        <h3 className="text-white font-bold text-xl mt-4 mb-2">Aksè Direksyon Sèlman</h3>
        <p className="text-blue-400 text-sm text-center mb-6">Antre kòd espesyal direktè a pou wè rapò a</p>
        <input type="text" value={dirCode} onChange={e => setDirCode(e.target.value.toUpperCase())}
          placeholder="Kòd Direktè"
          className="w-full max-w-xs rounded-xl px-4 py-3.5 text-white placeholder-blue-800 font-mono font-bold outline-none tracking-widest mb-3"
          style={{ background: "#ffffff0d", border: "1.5px solid #ffffff18" }} />
        {error && <p className="text-red-400 text-sm mb-3">⚠️ {error}</p>}
        <button onClick={handleAuth} disabled={loading}
          className="w-full max-w-xs py-4 rounded-xl font-bold text-white"
          style={{ background: loading ? "#333" : "linear-gradient(135deg,#1a4fd6,#2563eb)" }}>
          {loading ? "⏳ Verifikasyon..." : "Valide"}
        </button>
      </div>
    </div>
  );

  const { school, stats: s } = stats;
  const subjectEntries = Object.entries(s.subjectBreakdown || {}).sort((a, b) => b[1] - a[1]);
  const maxScans = Math.max(...subjectEntries.map(e => e[1]), 1);
  const colors = ["#22c55e","#3b82f6","#f59e0b","#a855f7","#ec4899","#14b8a6","#f97316"];

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "linear-gradient(145deg,#04081A,#080E24)" }}>
      <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor: "#ffffff10" }}>
        <button onClick={onBack} className="text-blue-400 text-xl">←</button>
        <div className="flex-1">
          <h2 className="text-white font-bold">Dashboard</h2>
          <p className="text-blue-400 text-xs">{school.name}</p>
        </div>
        <button onClick={() => generateAndSharePDF(school, s)} className="px-3 py-2 rounded-xl text-xs font-bold text-white active:scale-95 transition-transform" style={{ background: "linear-gradient(135deg,#d4002a,#ff6b35)" }}>📄 PDF</button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <div className="rounded-2xl px-4 py-3 flex justify-between items-center"
          style={{ background: school.daysRemaining <= 7 ? "#d4002a22" : "#14532d22", border: `1px solid ${school.daysRemaining <= 7 ? "#d4002a44" : "#22c55e33"}` }}>
          <div>
            <div className="font-bold text-sm" style={{ color: school.daysRemaining <= 7 ? "#ff8080" : "#86efac" }}>
              {school.daysRemaining <= 0 ? "🔴 Kòd Ekspire" : school.daysRemaining <= 7 ? "⚠️ Ekspire byento" : "✅ Kòd Aktif"}
            </div>
            <div className="text-xs mt-0.5" style={{ color: "#93c5fd" }}>
              {school.daysRemaining} jou rete • {school.dailyScans} scan/jou • max {school.maxStudents} elèv
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Scan Total", val: s.totalScans, icon: "🔍", color: "#3b82f6" },
            { label: "Élèves Actifs", val: s.totalStudents, icon: "👥", color: "#22c55e" },
            { label: "Scan d'aujourd'hui", val: s.scansToday, icon: "📅", color: "#f59e0b" },
            { label: "Matières", val: school.subjects.length, icon: "📚", color: "#a855f7" },
          ].map((item, i) => (
            <div key={i} className="rounded-2xl p-4" style={{ background: "#ffffff08", border: "1px solid #ffffff10" }}>
              <div style={{ fontSize: 24 }}>{item.icon}</div>
              <div className="font-black text-2xl mt-1" style={{ color: item.color }}>{item.val}</div>
              <div className="text-blue-400 text-xs mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
        <div className="rounded-2xl p-4" style={{ background: "#ffffff08", border: "1px solid #ffffff10" }}>
          <h3 className="text-white font-bold text-sm mb-3">📚 Matières Autorisées</h3>
          <div className="flex flex-wrap gap-2">
            {school.subjects.map((s, i) => (
              <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: colors[i % colors.length] + "33", color: colors[i % colors.length], border: `1px solid ${colors[i % colors.length]}44` }}>
                {s}
              </span>
            ))}
          </div>
        </div>
        {subjectEntries.length > 0 && (
          <div className="rounded-2xl p-5" style={{ background: "#ffffff08", border: "1px solid #ffffff10" }}>
            <h3 className="text-white font-bold mb-4">📊 Matières les Plus Scannées</h3>
            <div className="space-y-3">
              {subjectEntries.map(([sub, count], i) => (
                <div key={sub}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-blue-200">{sub}</span>
                    <span className="text-blue-400 font-bold">{count} scan{count > 1 ? "s" : ""}</span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "#ffffff10" }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${(count/maxScans)*100}%`, background: colors[i % colors.length] }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <button onClick={() => generateAndSharePDF(school, s)}
          className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-3 active:scale-95 transition-transform"
          style={{ background: "linear-gradient(135deg,#25d366,#128c7e)" }}>
          <span style={{ fontSize: 22 }}>💬</span> Pataje Rapò PDF sou WhatsApp
        </button>
      </div>
    </div>
  );
}

// ─── PARTNER ──────────────────────────────────────────────────────────────────
function PartnerScreen({ onBack }) {
  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "linear-gradient(145deg,#04081A,#080E24)" }}>
      <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor: "#ffffff10" }}>
        <button onClick={onBack} className="text-blue-400 text-xl">←</button>
        <h2 className="text-white font-bold">Vin Patnè</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <div className="rounded-3xl px-6 py-6" style={{ background: "linear-gradient(135deg,#1a1a5e,#2a2a8e)", border: "1px solid #3b82f633" }}>
          <div className="text-5xl mb-4">🏫</div>
          <h3 className="text-white font-black text-xl mb-2">Ofri Aksè IA a Elèv Ou Yo</h3>
          <p className="text-blue-300 text-sm leading-relaxed">Gid NS4 bay chak elèv yon asistan IA pèsonèl 24h/24,7/7 pou prepare egzamen NS4 yo.</p>
        </div>
        {[
          { icon:"✅", title:"Kòd ak Dat Ekspirasyon", desc:"Kontwole dire aksè yo" },
          { icon:"🎛️", title:"Quota Modifyab", desc:"Chwazi 3, 5 oswa 10 scan pa jou" },
          { icon:"👥", title:"Limit Elèv", desc:"Defini kantite maksimòm elèv pa kòd" },
          { icon:"📚", title:"Matyè Seleksyone", desc:"Aktivasyon matyè yo" },
          { icon:"🏆", title:"Klasman Reyèl", desc:"Elèv yo wè pwogresyon yo pa rapò ak lòt yo" },
          { icon:"🔒", title:"Sékirité Maksimòm", desc:"Kle API pwoteje" },
        ].map((f, i) => (
          <div key={i} className="flex gap-4 px-5 py-4 rounded-2xl" style={{ background: "#ffffff08", border: "1px solid #ffffff10" }}>
            <span style={{ fontSize: 26 }}>{f.icon}</span>
            <div>
              <div className="text-white font-bold text-sm">{f.title}</div>
              <div className="text-blue-400 text-xs mt-0.5">{f.desc}</div>
            </div>
          </div>
        ))}
        <button onClick={() => window.open("https://wa.me/50900000000?text=Bonjou%2C%20mwen%20vle%20vin%20patnè%20Gid%20NS4.", "_blank")}
          className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-3"
          style={{ background: "linear-gradient(135deg,#25d366,#128c7e)" }}>
          <span style={{ fontSize: 22 }}>💬</span> Kontakte nou sou WhatsApp
        </button>
      </div>
    </div>
  );
}

// ─── SESSION HELPERS ──────────────────────────────────────────────────────────
const SESSION_KEY = "gid_ns4_session";
function sessionSave(u) { try { localStorage.setItem(SESSION_KEY, JSON.stringify(u)); } catch {} }
function sessionLoad() { try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); } catch { return null; } }
function sessionClear() { try { localStorage.removeItem(SESSION_KEY); } catch {} }

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("splash");
  const [user, setUser] = useState(null);
  const nav = (s) => setScreen(s);

  // ── Restaure la session au démarrage (évite déconnexion après refresh) ──
  useEffect(() => {
    const saved = sessionLoad();
    if (saved?.phone && saved?.code) setUser(saved);
  }, []);

  const handleLogin = (u) => {
    sessionSave(u);
    setUser(u);
    setScreen("chat");
  };

  const handleLogout = () => {
    sessionClear();
    setUser(null);
    setScreen("login");
  };

  // onDone lit sessionLoad() directement — évite le stale closure sur user
  if (screen === "splash") return <SplashScreen onDone={() => {
    const saved = sessionLoad();
    setScreen(saved?.phone && saved?.code ? "chat" : "login");
  }} />;
  if (screen === "login") return <LoginScreen onLogin={handleLogin} onNavigate={nav} />;
  if (screen === "chat") return <ChatScreen user={user} onNavigate={nav} />;
  if (screen === "quiz") return <QuizScreen user={user} onNavigate={nav} />;
  if (screen === "leaderboard") return <LeaderboardScreen user={user} onNavigate={nav} />;
  if (screen === "history") return <HistoryScreen user={user} onNavigate={nav} />;
  if (screen === "menu") return <MenuScreen user={user} onNavigate={nav} onLogout={handleLogout} />;
  if (screen === "payment") return <PaymentScreen onBack={() => nav(user ? "menu" : "login")} />;
  if (screen === "dashboard") return <DashboardScreen onBack={() => nav("menu")} userCode={user?.code} />;
  if (screen === "partner") return <PartnerScreen onBack={() => nav(user ? "menu" : "login")} />;
}

// ─── EXPORTS NOMMÉS — utilisés par les tests ─────────────────────────────────
export {
  parseApiError,
  scoreToNote20,
  getMention,
  getQuizGrades,
  saveQuizGrade,
  idbSaveScan,
  idbGetScans,
  idbDeleteScan,
  LoginScreen,
  ChatScreen,
  QuizScreen,
};

    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw { status: res.status, ...data };
  return data;
}

// ─── GESTION D'ERREURS CENTRALISÉE ───────────────────────────────────────────
function parseApiError(err) {
  if (err instanceof TypeError && err.message.includes("fetch")) {
    return { type: "network", message: "Koneksyon an pa bon, eseye ankò !", detail: "Verifye entènèt ou epi eseye ankò.", icon: "📶", retry: true };
  }
  if (err?.status === 429 || err?.quotaExceeded) {
    return { type: "quota", message: "Ou rive nan limit scan ou pou jodi a !", detail: "Tounen demen pou kontinye.", icon: "🔒", retry: false };
  }
  if (err?.status === 403) {
    return { type: "auth", message: err?.error || "Aksè refize. Kontakte direksyon lekòl ou.", detail: null, icon: "🚫", retry: false };
  }
  if (err?.status >= 500) {
    return { type: "server", message: "Koneksyon an pa bon, eseye ankò !", detail: "Sèvè a gen yon pwoblèm. Eseye nan kèk minit.", icon: "🔧", retry: true };
  }
  if (err?.name === "AbortError") {
    return { type: "timeout", message: "Koneksyon an pa bon, eseye ankò !", detail: "Demann an pran twò lontan. Verifye entènèt ou.", icon: "⏱️", retry: true };
  }
  if (err?.error) {
    return { type: "api", message: err.error, detail: null, icon: "⚠️", retry: false };
  }
  return { type: "unknown", message: "Koneksyon an pa bon, eseye ankò !", detail: null, icon: "⚠️", retry: true };
}

// ─── COMPOSANT TOAST D'ERREUR ─────────────────────────────────────────────────
function ErrorToast({ error, onRetry, onDismiss }) {
  if (!error) return null;
  const canRetry = error.retry && onRetry;
  return (
    <div className="mx-3 mb-2 px-4 py-3 rounded-2xl flex gap-3 items-start"
      style={{ background: error.type === "quota" ? "#1e3a8a22" : "#7f1d1d33", border: `1px solid ${error.type === "quota" ? "#3b82f644" : "#ef444444"}`, animation: "fadeIn .3s ease both" }}>
      <span style={{ fontSize: 20, flexShrink: 0 }}>{error.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm" style={{ color: error.type === "quota" ? "#93c5fd" : "#fca5a5" }}>{error.message}</p>
        {error.detail && <p className="text-xs mt-0.5" style={{ color: error.type === "quota" ? "#6080c0" : "#f87171" }}>{error.detail}</p>}
        <div className="flex gap-2 mt-2">
          {canRetry && (
            <button onClick={onRetry} className="px-3 py-1 rounded-lg text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg,#d4002a,#ff6b35)" }}>🔄 Eseye Ankò</button>
          )}
          <button onClick={onDismiss} className="px-3 py-1 rounded-lg text-xs font-semibold"
            style={{ background: "#ffffff15", color: "#94a3b8" }}>Fèmen</button>
        </div>
      </div>
    </div>
  );
}

import { QUIZ_DATA } from "./quizData.js";
// ─── LOGO ────────────────────────────────────────────────────────────────────
const APP_LOGO = "/logo.png?v=2";
const PROF_LAKAY_PHOTO = "https://i.postimg.cc/MH8V3LKv/Jpgpro-out-bfea41d353cc11eb57c8fc16e3b40ffa.jpg";


// ─── SHUFFLE ──────────────────────────────────────────────────────────────────
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Mélange les choix d'une question et retourne la nouvelle position de la bonne réponse
function shuffleChoices(q) {
  const indexed = q.choices.map((c, i) => ({ c, correct: i === q.answer }));
  for (let i = indexed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
  }
  return {
    ...q,
    choices: indexed.map(x => x.c),
    answer: indexed.findIndex(x => x.correct),
  };
}

// ─── INDEXEDDB ────────────────────────────────────────────────────────────────
const DB_NAME = "GidNS4DB";
const DB_VERSION = 1;
const STORE_SCANS = "scans";

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_SCANS)) {
        const store = db.createObjectStore(STORE_SCANS, { keyPath: "id", autoIncrement: true });
        store.createIndex("phone", "phone", { unique: false });
        store.createIndex("phone_date", ["phone", "scanDate"], { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbSaveScan(phone, entry) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_SCANS, "readwrite");
      tx.objectStore(STORE_SCANS).add({ ...entry, phone });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn("IndexedDB indisponible, fallback localStorage", err);
    idbFallbackSave(phone, entry);
  }
}

async function idbGetScans(phone, limit = 50) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_SCANS, "readonly");
      const store = tx.objectStore(STORE_SCANS);
      const results = [];
      // Curseur en ordre inverse (id décroissant = plus récent en premier)
      // On filtre par phone sans charger tout en mémoire
      const req = store.openCursor(null, "prev");
      req.onsuccess = (e) => {
        const cursor = e.target.result;
        if (!cursor || results.length >= limit) { resolve(results); return; }
        if (cursor.value.phone === phone) results.push(cursor.value);
        cursor.continue();
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("IndexedDB lecture échouée, fallback localStorage", err);
    return idbFallbackGet(phone);
  }
}

async function idbDeleteScan(id) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_SCANS, "readwrite");
      tx.objectStore(STORE_SCANS).delete(id);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn("IndexedDB suppression échouée", err);
  }
}

function idbFallbackSave(phone, entry) {
  try {
    const hist = idbFallbackGet(phone);
    hist.unshift({ ...entry, image: null, _fallback: true, id: Date.now() });
    localStorage.setItem(`history_${phone}`, JSON.stringify(hist.slice(0, 20)));
  } catch {}
}
function idbFallbackGet(phone) {
  try { return JSON.parse(localStorage.getItem(`history_${phone}`) || "[]"); } catch { return []; }
}

// ─── NOTES QUIZ /20 ───────────────────────────────────────────────────────────
function scoreToNote20(score, total) {
  if (total === 0) return 0;
  return Math.round((score / total) * 20 * 10) / 10;
}

function getMention(note20) {
  if (note20 >= 16) return { label: "Excellent", color: "#22c55e", bg: "#14532d33", border: "#22c55e44", emoji: "🏆" };
  if (note20 >= 14) return { label: "Bien", color: "#3b82f6", bg: "#1e3a8a33", border: "#3b82f644", emoji: "⭐" };
  if (note20 >= 12) return { label: "Assez Bien", color: "#f59e0b", bg: "#78350f33", border: "#f59e0b44", emoji: "👍" };
  if (note20 >= 10) return { label: "Passable", color: "#f97316", bg: "#7c2d1233", border: "#f9731644", emoji: "📖" };
  return { label: "Insuffisant", color: "#ef4444", bg: "#7f1d1d33", border: "#ef444444", emoji: "📚" };
}

function getQuizGrades(phone) {
  try { return JSON.parse(localStorage.getItem(`grades_${phone}`) || "{}"); } catch { return {}; }
}

function saveQuizGrade(phone, subject, note20, score, total) {
  try {
    const grades = getQuizGrades(phone);
    if (!grades[subject]) grades[subject] = [];
    grades[subject].push({
      note20, score, total,
      date: new Date().toLocaleDateString("fr-HT", { timeZone: "America/Port-au-Prince" }),
      ts: Date.now(),
    });
    grades[subject] = grades[subject].slice(-10);
    localStorage.setItem(`grades_${phone}`, JSON.stringify(grades));
  } catch {}
}

// ─── COMPRESSION D'IMAGE ──────────────────────────────────────────────────────
function compressImage(base64, maxSize = 800, quality = 0.6) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > height && width > maxSize) { height = Math.round((height * maxSize) / width); width = maxSize; }
      else if (height > maxSize) { width = Math.round((width * maxSize) / height); height = maxSize; }
      const canvas = document.createElement("canvas");
      canvas.width = width; canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => resolve(base64);
    img.src = base64;
  });
}

// ─── KATEX LOADER (CDN, chargé une seule fois) ────────────────────────────────
let katexReady = false;
let katexQueue = [];
function ensureKatex() {
  if (katexReady) return Promise.resolve();
  if (document.getElementById("katex-css")) {
    // CSS déjà injecté, attendre le script
    return new Promise(r => katexQueue.push(r));
  }
  // Injecter la CSS
  const link = document.createElement("link");
  link.id = "katex-css";
  link.rel = "stylesheet";
  link.href = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css";
  document.head.appendChild(link);
  // Injecter le script
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js";
  script.onload = () => {
    katexReady = true;
    katexQueue.forEach(r => r());
    katexQueue = [];
  };
  document.head.appendChild(script);
  return new Promise(r => katexQueue.push(r));
}

// ─── LATEX RENDERER ───────────────────────────────────────────────────────────
function LatexText({ content }) {
  const [html, setHtml] = useState(null);

  useEffect(() => {
    let cancelled = false;
    // Si pas de formule LaTeX → rendu simple
    if (!/\$/.test(content)) { setHtml(null); return; }
    ensureKatex().then(() => {
      if (cancelled) return;
      try {
        const result = content.replace(/\$\$([\s\S]+?)\$\$/g, (_, expr) => {
          try { return window.katex.renderToString(expr.trim(), { displayMode: true, throwOnError: false }); }
          catch { return `<code class="katex-fallback">${expr}</code>`; }
        }).replace(/\$([^$\n]+?)\$/g, (_, expr) => {
          try { return window.katex.renderToString(expr.trim(), { displayMode: false, throwOnError: false }); }
          catch { return `<code class="katex-fallback">${expr}</code>`; }
        });
        setHtml(result);
      } catch { setHtml(null); }
    });
    return () => { cancelled = true; };
  }, [content]);

  // Rendu KaTeX disponible → HTML brut
  if (html) return (
    <span dangerouslySetInnerHTML={{ __html: html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }}
      style={{ lineHeight: 1.7 }} />
  );

  // Fallback : rendu texte avec formatage minimal (pendant chargement ou sans formule)
  return (
    <span>
      {content.split("\n").map((line, i, arr) => (
        <span key={i}>
          <span dangerouslySetInnerHTML={{ __html:
            line
              .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
              .replace(/\$\$?([\s\S]+?)\$?\$/g, (_, e) =>
                `<code style="background:#0d2244;color:#93c5fd;padding:1px 4px;border-radius:4px;font-family:monospace;font-size:.85em">${e}</code>`)
          }} />
          {i < arr.length - 1 && <br />}
        </span>
      ))}
    </span>
  );
}
function MdText({ text }) {
  return (
    <>
      {text.split("\n").map((line, i, arr) => (
        <span key={i}>
          <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }} />
          {i < arr.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

// ─── SPLASH ───────────────────────────────────────────────────────────────────
function SplashScreen({ onDone }) {
  useEffect(() => { setTimeout(onDone, 2000); }, []);
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(145deg,#04081A 0%,#080E24 50%,#0D0A1E 100%)" }}>
      {/* Ambient glows */}
      <div style={{ position:"absolute", width:320, height:320, borderRadius:"50%", background:"radial-gradient(circle,#2563EB18,transparent 70%)", top:"15%", left:"10%", pointerEvents:"none" }} />
      <div style={{ position:"absolute", width:240, height:240, borderRadius:"50%", background:"radial-gradient(circle,#E8002A14,transparent 70%)", bottom:"20%", right:"5%", pointerEvents:"none" }} />
      
      <div style={{ animation: "popIn .7s cubic-bezier(.34,1.56,.64,1) both", display:"flex", flexDirection:"column", alignItems:"center" }}>
        {/* Logo avec ring animé */}
        <div style={{ position:"relative", marginBottom:24 }}>
          <div style={{
            position:"absolute", inset:-8,
            borderRadius:34, border:"2px solid #2563EB44",
            animation:"ringPulse 2s 1s ease-out infinite"
          }} />
          <div style={{
            width:120, height:120, borderRadius:26,
            background:"#fff",
            boxShadow:"0 0 0 1px #2563EB33, 0 8px 40px #000c, 0 0 60px #2563EB22",
            overflow:"hidden",
          }}>
            <img src={APP_LOGO} alt="Gid NS4" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          </div>
        </div>
        <p style={{ color:"#5B7ADB", fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", animation:"fadeUp .5s .5s both" }}>
          Prof Lakay • NS4 Haïti
        </p>
      </div>

      {/* Loader elegant */}
      <div style={{ position:"absolute", bottom:52, display:"flex", gap:6, alignItems:"center" }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{
            width: i === 2 ? 20 : 6, height:6, borderRadius:3,
            background: i === 2 ? "linear-gradient(90deg,#E8002A,#FF5C35)" : "#1E3A8A",
            animation:`pulse 1.2s ${i*0.15}s ease-in-out infinite`,
            transition:"width .3s"
          }} />
        ))}
      </div>
      <style>{`
        @keyframes popIn{from{opacity:0;transform:scale(.5)}to{opacity:1;transform:scale(1)}}
        @keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}
        @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
        @keyframes heartPop{0%{transform:scale(1)}50%{transform:scale(1.4)}100%{transform:scale(1)}}
      `}</style>
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin, onNavigate }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!name.trim() || name.trim().length < 2) { setError("Antre non ou ki valid (omwen 2 lèt)."); return; }
    if (!phone.trim() || phone.length < 8) { setError("Antre yon nimewo telefòn valid."); return; }
    if (!code.trim()) { setError("Antre kòd lekòl ou a."); return; }
    setLoading(true);
    try {
      const result = await callEdge({ action: "validate_code", phone: phone.trim(), schoolCode: code.toUpperCase().trim() });
      if (!result.valid) { setError(result.reason || "Kòd la pa valid."); setLoading(false); return; }
      onLogin({
  name: name.trim(),
  phone: phone.trim(),
  code: code.toUpperCase().trim(),
  school: result.school.name,
  subjects: result.school.subjects,
  dailyScans:      result.school.dailyScans,
  dailyImageScans: result.school.dailyImageScans ?? 1,
  dailyTextScans:  result.school.dailyTextScans  ?? 4,
  daysRemaining:   result.school.daysRemaining,
  expiresAt:       result.school.expiresAt,
  scansToday:      result.scansToday,
});
    } catch (e) {
      setError(parseApiError(e).message);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden"
      style={{ background: "linear-gradient(145deg,#04081A 0%,#080E24 60%,#0D0A1E 100%)" }}>
      {/* Background glows */}
      <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,#2563EB0F,transparent 65%)", top:"-10%", right:"-20%", pointerEvents:"none" }} />
      <div style={{ position:"absolute", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle,#E8002A0A,transparent 65%)", bottom:"0%", left:"-15%", pointerEvents:"none" }} />

      <div className="flex-1 flex flex-col items-center justify-center px-5" style={{ animation:"fadeUp .5s ease both" }}>
        {/* Logo */}
        <div style={{ width:80, height:80, borderRadius:20, background:"#fff", overflow:"hidden", boxShadow:"0 0 0 1px #2563EB22, 0 12px 40px #00000055", marginBottom:14 }}>
          <img src={APP_LOGO} alt="Gid NS4" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        </div>
        <p style={{ color:"#4B6ABA", fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", marginBottom:24 }}>Asistan IA pou elèv NS4</p>

        {/* Glass Card */}
        <div className="w-full" style={{
          maxWidth:380,
          background:"rgba(15,28,60,0.80)",
          backdropFilter:"blur(20px)",
          border:"1px solid rgba(255,255,255,0.12)",
          borderRadius:24,
          padding:"28px 24px",
          boxShadow:"0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)"
        }}>
          {/* Inputs */}
          {[
            { label:"Non Konplè", type:"text", val:name, fn:e=>setName(e.target.value), ph:"Marie Joseph", extra:{} },
            { label:"Nimewo Telefòn", type:"tel", val:phone, fn:e=>setPhone(e.target.value), ph:"50934567890", extra:{} },
            { label:"Kòd Etablisman", type:"text", val:code, fn:e=>setCode(e.target.value.toUpperCase()), ph:"DEMO-2026", extra:{fontFamily:"monospace", letterSpacing:"0.12em", fontWeight:700} },
          ].map(({label, type, val, fn, ph, extra}, i) => (
            <div key={i} style={{ marginBottom:16 }}>
              <label style={{ display:"block", color:"#5B7ADB", fontSize:11, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:8 }}>{label}</label>
              <input type={type} value={val} onChange={fn} placeholder={ph}
                style={{
                  width:"100%", background:"rgba(255,255,255,0.04)",
                  border:"1px solid rgba(255,255,255,0.1)",
                  borderRadius:12, padding:"13px 16px",
                  color:"#E8EEFF", fontSize:15, outline:"none",
                  transition:"border-color .2s, box-shadow .2s",
                  boxSizing:"border-box",
                  ...extra
                }}
                onFocus={e => { e.target.style.borderColor="#2563EB66"; e.target.style.boxShadow="0 0 0 3px #2563EB18"; }}
                onBlur={e => { e.target.style.borderColor="rgba(255,255,255,0.1)"; e.target.style.boxShadow="none"; }}
              />
            </div>
          ))}

          {error && (
            <div style={{ background:"#E8002A15", border:"1px solid #E8002A33", borderRadius:10, padding:"10px 14px", marginBottom:16, color:"#FF7070", fontSize:13 }}>
              ⚠️ {error}
            </div>
          )}

          <button onClick={handleLogin} disabled={loading}
            style={{
              width:"100%", padding:"15px", borderRadius:14,
              background: loading ? "#2E4080" : "linear-gradient(135deg,#E8002A,#FF5C35)",
              color:"white", fontWeight:800, fontSize:15, border:"none",
              boxShadow: loading ? "none" : "0 6px 24px #E8002A33",
              transition:"all .2s", cursor: loading ? "not-allowed" : "pointer",
              letterSpacing:"0.02em"
            }}>
            {loading ? "⏳ Ap verifye..." : "Rantre"}
          </button>

          <div style={{ textAlign:"center", marginTop:16 }}>
            <span style={{ color:"#4b5ea8", fontSize:12 }}>Pa gen kòd ? </span>
            <span style={{ color:"#4B6ABA", fontSize:12 }}>Pale ak direksyon lekòl ou a.</span>
          </div>
        </div>
      </div>

      <div style={{ paddingBottom:24, display:"flex", justifyContent:"center", gap:24 }}>
        <button onClick={() => onNavigate("payment")} style={{ color:"#3B5BA8", fontSize:12, background:"none", border:"none" }}>Pèman</button>
        <span style={{ color:"#2E4080", fontSize:12 }}>·</span>
        <button onClick={() => onNavigate("partner")} style={{ color:"#3B5BA8", fontSize:12, background:"none", border:"none" }}>Vin Patnè</button>
      </div>
    </div>
  );
}

// ─── BOTTOM NAV (5 tabs) ──────────────────────────────────────────────────────
function BottomNav({ active, onNavigate }) {
const notifications = getNotifications();
    const tabs = [
    {
  id: "chat",
  icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  label: "Chat",
  badge: notifications.chat
},
    {
  id: "quiz",
  icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  label: "Quiz",
  badge: notifications.quiz
},
    {
  id: "leaderboard",
  icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  ),
  label: "Klasman",
  badge: notifications.leaderboard
},
    {
  id: "history",
  icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v5h5" />
      <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
      <path d="M12 7v5l4 2" />
    </svg>
  ),
  label: "Istwa",
  badge: notifications.history
},
    {
  id: "menu",
  icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  label: "Meni",
  badge: notifications.menu
},
  ];
  
  return (
    <div style={{
      display:"flex",
      background:"rgba(10,15,46,0.97)",
      backdropFilter:"blur(20px)",
      borderTop:"1px solid rgba(255,255,255,0.10)",
      paddingBottom:"env(safe-area-inset-bottom, 0px)",
    }}>
      {tabs.map(tab => {
        const isActive = active === tab.id;
        return (
          <button key={tab.id} onClick={() => onNavigate(tab.id)}
            style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"10px 0 8px", border:"none", background:"none", position:"relative", transition:"transform .15s" }}
            onTouchStart={e => e.currentTarget.style.transform="scale(0.88)"}
            onTouchEnd={e => e.currentTarget.style.transform="scale(1)"}>
            {isActive && (
              <div style={{
                position:"absolute", top:0, left:"50%", transform:"translateX(-50%)",
                width:32, height:2, borderRadius:2,
                background:"linear-gradient(90deg,#E8002A,#FF5C35)",
              }} />
            )}
            <span style={{ color: isActive ? "#FF5C35" : "#4B5EA8", position: "relative" }}>
  {tab.icon}
  {tab.badge > 0 && (
    <div style={{
      position: "absolute",
      top: -8,
      right: -8,
      background: "linear-gradient(135deg, #EF4444, #DC2626)",
      color: "#fff",
      fontSize: 10,
      fontWeight: 800,
      minWidth: 18,
      height: 18,
      borderRadius: 9,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 5px",
      boxShadow: "0 2px 8px rgba(239, 68, 68, 0.4)",
      border: "2px solid #0a0f2e"
    }}>
      {tab.badge > 9 ? "9+" : tab.badge}
    </div>
  )}
</span>
            <span style={{
              fontSize:9, fontWeight: isActive ? 700 : 500,
              color: isActive ? "#FF5C35" : "#4B5EA8",
              marginTop:2, letterSpacing:"0.03em"
            }}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── EXPIRY BANNER ────────────────────────────────────────────────────────────
function ExpiryBanner({ daysRemaining }) {
  if (!daysRemaining || daysRemaining > 7) return null;
  const isUrgent = daysRemaining <= 2;
  return (
    <div className="px-4 py-2 text-xs text-center font-semibold" style={{ background: isUrgent ? "#d4002a" : "#92400e", color: "white" }}>
      {isUrgent ? "🚨" : "⚠️"} Kòd ou a ekspire nan {daysRemaining} jou — Kontakte direksyon lekòl ou
    </div>
  );
}

// ─── CHAT ─────────────────────────────────────────────────────────────────────
function ChatScreen({ user, onNavigate }) {
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: `Bonjou **${user.name || ""}** ! Mwen se **Prof Lakay** \n\nJe suis ton assistant IA pour le **Bac NS4**.\n\n📚 Matières disponibles pour toi :\n${user.subjects.map(s => `• ${s}`).join("\n")}\n\n**Ann al travay ! **`
  }]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [lastPayload, setLastPayload] = useState(null);
  const [activeSubject, setActiveSubject] = useState(user.subjects[0] || null);
  
  // ─── SCROLL-TO-BOTTOM LOGIC (NOUVEAU) ────────────────────────────────────
  const bottomRef = useRef(null);
  const fileRef = useRef(null);
  const chatContainerRef = useRef(null);  // ← NOUVEAU : pour détecter le scroll
  const [showScrollBtn, setShowScrollBtn] = useState(false);  // ← NOUVEAU

  // Fonction pour scroller vers le bas
  const scrollToBottom = () => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth'
    });
  };

  // Détecte si l'utilisateur est près du bas
  const handleScroll = () => {
    const el = chatContainerRef.current;
    if (!el) return;
    // Si on est à plus de 120px du bas, on affiche le bouton
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    setShowScrollBtn(!isNearBottom);
  };

  // Auto-scroll quand un nouveau message arrive (TON CODE EXISTANT + nettoyage)
  useEffect(() => { 
    bottomRef.current?.scrollIntoView({ behavior: "smooth" }); 
  }, [messages, loading]);

  // Nettoyage de l'écouteur scroll (NOUVEAU)
  useEffect(() => {
    const el = chatContainerRef.current;
    el?.addEventListener('scroll', handleScroll);
    return () => el?.removeEventListener('scroll', handleScroll);
  }, []);
  // ─────────────────────────────────────────────────────────────────────────

  // ── Limites depuis Supabase (fallback hardcodé) ──
  const IMG_MAX  = user.dailyImageScans ?? 1;  const TEXT_MAX = user.dailyTextScans  ?? 4;

  // ── Compteurs par jour (heure Haïti) ──
  const today    = new Date().toLocaleDateString("fr-HT", { timeZone: "America/Port-au-Prince" });
  const _imgKey  = `gid_img_${user.phone}_${today}`;
  const _txtKey  = `gid_txt_${user.phone}_${today}`;

  const [imgUsed, setImgUsed] = useState(() => {
    try { return parseInt(localStorage.getItem(_imgKey) || "0"); } catch { return 0; }
  });
  const [textUsed, setTextUsed] = useState(() => {
    try { return parseInt(localStorage.getItem(_txtKey) || "0"); } catch { return 0; }
  });

  const detectSubject = (text) => {
    const t = text.toLowerCase();
    if (t.includes("bio") || t.includes("cellule") || t.includes("adn")) return "Biologie";
    if (t.includes("chim") || t.includes("molécule") || t.includes("acide")) return "Chimie";
    if (t.includes("physi") || t.includes("vitesse") || t.includes("force")) return "Physique";
    if (t.includes("philo") || t.includes("socrate")) return "Philosophie";
    if (t.includes("social") || t.includes("haïti")) return "Sciences Sociales";
    if (t.includes("littér") || t.includes("roman")) return "Littérature Haïtienne";
    return user.subjects[0] || "Général";
  };

  const sendMessage = async (retryPayload = null) => {
    const isImage = retryPayload ? !!retryPayload.isImage : !!image;
    const payload = retryPayload || {
      userMsg: { role: "user", content: input.trim() || "Analyse cet exercice.", image },
      currentInput: input.trim(),
      isImage: !!image,
    };

    if (!payload.currentInput && !payload.userMsg.image) return;
    if (loading) return;
    if (isImage  && imgUsed  >= IMG_MAX)  return;
    if (!isImage && textUsed >= TEXT_MAX) return;

    if (!retryPayload) { setMessages(p => [...p, payload.userMsg]); setInput(""); setImage(null); }
    setApiError(null); setLoading(true);

    try {
      const detectedSubject = activeSubject || detectSubject(payload.currentInput);
      const result = await callEdge({
        action: "ask", phone: user.phone, schoolCode: user.code,
        message: payload.userMsg.content,
        imageBase64: payload.userMsg.image ? payload.userMsg.image.split(",")[1] : null,
        history: messages.slice(-6), subject: detectedSubject,
      });
      setMessages(p => [...p, { role: "assistant", content: result.reply }]);
      if (isImage) {
        setImgUsed(n => {
          const next = n + 1;
          try { localStorage.setItem(_imgKey, String(next)); } catch {}
          return next;
        });
      } else {
        setTextUsed(n => {
          const next = n + 1;
          try { localStorage.setItem(_txtKey, String(next)); } catch {}
          return next;
        });
      }
      setLastPayload(null);

      await idbSaveScan(user.phone, {
        date: new Date().toLocaleString("fr-HT", { timeZone: "America/Port-au-Prince" }),
        scanDate: new Date().toISOString().split("T")[0],
        subject: detectedSubject, image: payload.userMsg.image || null,
        response: result.reply, dailyLimit: IMG_MAX + TEXT_MAX,
      });
    } catch (e) {
      const parsed = parseApiError(e);
      setApiError(parsed);
      if (parsed.retry) setLastPayload(payload);
    }
    setLoading(false);
  };

  const handleImage = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => { setImage(await compressImage(ev.target.result)); };
    reader.readAsDataURL(file);
  };

  const imgDone  = imgUsed  >= IMG_MAX;
  const textDone = textUsed >= TEXT_MAX;
  const allDone  = imgDone && textDone;

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "#0a0f2e" }}>
      <ExpiryBanner daysRemaining={user.daysRemaining} />

      {/* ── HEADER ── */}
      <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:"rgba(10,15,46,0.98)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.10)" }}>
        <div style={{ width:40, height:40, borderRadius:10, overflow:"hidden", flexShrink:0, background:"#fff", boxShadow:"0 2px 12px #00000044" }}>
          <img src={APP_LOGO} alt="Gid NS4" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        </div>        <div style={{ flex:1 }}>
          <div style={{ color:"#E8EEFF", fontWeight:700, fontSize:14, letterSpacing:"0.01em" }}>Prof Lakay</div>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:1 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"#22C55E", display:"inline-block", boxShadow:"0 0 6px #22C55E" }} />
            <span style={{ color:"#22C55E", fontSize:11, fontWeight:500 }}>En ligne</span>
          </div>
        </div>

        {/* ── 2 CARDS COMPTEURS ── */}
        <div style={{ display:"flex", gap:6 }}>
          {/* Card SCAN IMAGE */}
          <div style={{
            display:"flex", flexDirection:"column", alignItems:"center",
            padding:"5px 9px", borderRadius:12,
            background: imgDone ? "rgba(255,255,255,0.04)" : "rgba(37,99,235,0.15)",
            border: `1px solid ${imgDone ? "rgba(255,255,255,0.08)" : "rgba(37,99,235,0.35)"}`,
            minWidth:48,
          }}>
            <div style={{ display:"flex", gap:2 }}>
              {Array.from({ length: IMG_MAX }).map((_, i) => (
                <span key={i} style={{ fontSize:15, opacity: i < imgUsed ? 0.2 : 1, filter: i < imgUsed ? "grayscale(1)" : "none" }}>📷</span>
              ))}
            </div>
            <span style={{ fontSize:8, fontWeight:700, marginTop:2, color: imgDone ? "#3B4A6B" : "#60A5FA" }}>
              {imgDone ? "✓ Itilize" : `${IMG_MAX - imgUsed} scan`}
            </span>
          </div>

          {/* Card TEXTE */}
          <div style={{
            display:"flex", flexDirection:"column", alignItems:"center",
            padding:"5px 9px", borderRadius:12,
            background: textDone ? "rgba(255,255,255,0.04)" : "rgba(37,99,235,0.15)",
            border: `1px solid ${textDone ? "rgba(255,255,255,0.08)" : "rgba(37,99,235,0.35)"}`,
            minWidth:60,
          }}>
            <div style={{ display:"flex", gap:2 }}>
              {Array.from({ length: TEXT_MAX }).map((_, i) => (
                <span key={i} style={{ fontSize:12, opacity: i < textUsed ? 0.2 : 1, filter: i < textUsed ? "grayscale(1)" : "none" }}>🖋️</span>
              ))}
            </div>
            <span style={{ fontSize:8, fontWeight:700, marginTop:2, color: textDone ? "#3B4A6B" : "#60A5FA" }}>
              {textDone ? "✓ Fini" : `${TEXT_MAX - textUsed} kesyon`}
            </span>
          </div>
        </div>
      </div>

      {/* ── TABS MATIÈRES ── */}
      <div style={{ padding:"8px 14px", display:"flex", gap:8, overflowX:"auto", background:"rgba(10,15,46,0.92)", borderBottom:"1px solid rgba(255,255,255,0.05)", scrollbarWidth:"none" }}>        {user.subjects.map((s, i) => (
          <button key={i} onClick={() => setActiveSubject(s)}
            style={{
              flexShrink:0, padding:"4px 11px", borderRadius:20,
              background: activeSubject === s ? "linear-gradient(135deg,#2563EB,#3B82F6)" : "rgba(37,99,235,0.08)",
              color: activeSubject === s ? "#fff" : "#4B6ABA",
              border: activeSubject === s ? "none" : "1px solid rgba(37,99,235,0.2)",
              fontSize:11, fontWeight: activeSubject === s ? 700 : 500,
              boxShadow: activeSubject === s ? "0 3px 12px #2563EB33" : "none",
              transition:"all .2s", whiteSpace:"nowrap"
            }}>
            {s}
          </button>
        ))}
      </div>

      {/* ── MESSAGES (SCROLLABLE) ── */}
      {/* ⚠️ J'ai ajouté ref={chatContainerRef} et onScroll={handleScroll} ici ↓ */}
      <div 
        ref={chatContainerRef} 
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-3 py-4 space-y-4"
      >
        {messages.map((msg, i) => (
          <div key={i} className="flex gap-2" style={{ justifyContent: msg.role === "user" ? "flex-end" : "flex-start", animation: "fadeIn .3s ease both" }}>
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-xl flex-shrink-0 overflow-hidden" style={{ background: "#fff" }}>
                <img src={PROF_LAKAY_PHOTO} alt="Prof Lakay" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              </div>
            )}
            <div style={{ maxWidth:"82%" }}>
              {msg.image && <img src={msg.image} alt="scan" style={{ borderRadius:14, marginBottom:6, maxHeight:140, objectFit:"contain", border:"1px solid rgba(255,255,255,0.1)" }} />}
              <div style={{
                padding:"11px 15px", fontSize:14, lineHeight:1.65,
                background: msg.role === "user" ? "linear-gradient(135deg,#2563EB,#1D4ED8)" : "rgba(15,28,60,0.95)",
                border: msg.role === "assistant" ? "1px solid rgba(37,99,235,0.15)" : "none",
                color:"#E8EEFF",
                borderRadius: msg.role === "user" ? "18px 18px 5px 18px" : "5px 18px 18px 18px",
                boxShadow: msg.role === "user" ? "0 4px 20px #2563EB33" : "0 2px 12px rgba(0,0,0,0.3)",
              }}>
                <LatexText content={msg.content} />
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2 items-start">
            <div className="w-8 h-8 rounded-xl flex-shrink-0 overflow-hidden" style={{ background: "#fff" }}>
              <img src={PROF_LAKAY_PHOTO} alt="Prof Lakay" style={{ width:"100%", height:"100%", objectFit:"cover" }} />            </div>
            <div className="px-4 py-3 rounded-2xl" style={{ background: "#0f1e4a" }}>
              <div className="flex gap-1.5 items-center">
                {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-blue-400" style={{ animation: `bounce 1s ${i*0.2}s infinite` }} />)}
                <span className="text-blue-400 text-xs ml-2">Prof Lakay ap ekri...</span>
              </div>
            </div>
          </div>
        )}

        {allDone && (
          <div className="mx-2 px-4 py-3 rounded-2xl text-sm text-center" style={{ background: "#d4002a22", border: "1px solid #d4002a44", color: "#ff8080" }}>
            🔒 Ou itilize tout scan ak kesyon ou yo pou jodi a. Tounen demen !
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ─── BOUTON SCROLL-TO-BOTTOM (POSITION HAUTE) ───────────────────── */}
{showScrollBtn && (
  <button
    onClick={scrollToBottom}
    style={{
      position: "absolute",
      bottom: 130,    // ← ENCORE PLUS HAUT (était 100)
      right: 16,
      zIndex: 40,
      width: 34,      // ← Encore un peu plus compact
      height: 34,
      borderRadius: "50%",
      background: "linear-gradient(135deg, #2563EB, #1E40AF)",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 3px 10px rgba(37, 99, 235, 0.3)",
      border: "none",
      cursor: "pointer",
      transition: "all 0.2s ease",
      backdropFilter: "blur(6px)",
      padding: 0
    }}
    aria-label="Retour en bas"
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12l7 7 7-7" />
    </svg>
  </button>
)}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <ErrorToast error={apiError} onRetry={lastPayload ? () => sendMessage(lastPayload) : null} onDismiss={() => { setApiError(null); setLastPayload(null); }} />

      {/* ── INPUT ZONE ── */}
      <div style={{ padding:"10px 12px", background:"rgba(10,15,46,0.98)", backdropFilter:"blur(20px)", borderTop:"1px solid rgba(255,255,255,0.10)" }}>
        {image && (
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8, padding:"6px 8px", background:"rgba(37,99,235,0.1)", borderRadius:10, border:"1px solid rgba(37,99,235,0.2)" }}>
            <img src={image} alt="" style={{ width:36, height:36, borderRadius:8, objectFit:"cover" }} />
            <span style={{ color:"#6B8ADB", fontSize:11, flex:1 }}>✅ Image prête</span>
            <button onClick={() => setImage(null)} style={{ color:"#E8002A", background:"none", border:"none", fontSize:16, cursor:"pointer" }}>✕</button>
          </div>
        )}
        <div style={{ display:"flex", gap:8, alignItems:"flex-end" }}>

          {/* Bouton caméra */}
          <button
            onClick={() => { if (!imgDone) fileRef.current?.click(); }}
            disabled={imgDone}
            style={{
              width:48, height:48, borderRadius:14, flexShrink:0,
              display:"flex", alignItems:"center", justifyContent:"center",
              background: imgDone ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg,#2563EB,#3B82F6)",
              border:"none",
              cursor: imgDone ? "not-allowed" : "pointer",
              boxShadow: imgDone ? "none" : "0 4px 16px rgba(37,99,235,0.3)",
              transition:"all 0.15s ease",
            }}
            onMouseDown={e => { if (!imgDone) e.currentTarget.style.transform = "scale(0.9)"; }}
            onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            onTouchStart={e => { if (!imgDone) e.currentTarget.style.transform = "scale(0.9)"; }}
            onTouchEnd={e => e.currentTarget.style.transform = "scale(1)"}
          >
            <svg width="24" height="24" viewBox="0 0 24 24"
              fill="none" stroke={imgDone ? "#3B4A6B" : "white"} strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </button>

          <input ref={fileRef} type="file" accept="image/*" onChange={handleImage}
            style={{ position:"absolute", width:0, height:0, opacity:0, pointerEvents:"none" }} />

          <textarea value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                sendMessage();
              }            }}
            placeholder={allDone ? "Limit ou a rive..." : imgDone ? "Poze yon kesyon tèks..." : "Poze yon kesyon oswa analize yon egzèsis..."}
            rows={1}
            disabled={allDone}
            className="flex-1 rounded-xl px-4 py-3 text-sm outline-none resize-none"
            style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.12)", maxHeight:80, color:"#E8EEFF", borderRadius:12, transition:"border-color .2s" }}
            onFocus={e => e.target.style.borderColor="rgba(37,99,235,0.4)"}
            onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"} />

          <button onClick={() => sendMessage()} disabled={loading || allDone}
            style={{
              width:48, height:48, borderRadius:14, flexShrink:0,
              display:"flex", alignItems:"center", justifyContent:"center",
              background: (loading || allDone) ? "rgba(59,130,246,0.4)" : "linear-gradient(135deg,#2563EB,#3B82F6)",
              border:"none",
              cursor: (loading || allDone) ? "not-allowed" : "pointer",
              boxShadow: (loading || allDone) ? "none" : "0 4px 16px rgba(37,99,235,0.4)",
              transition:"all 0.15s ease",
            }}
            onMouseDown={e => { if (!(loading || allDone)) e.currentTarget.style.transform = "scale(0.9)"; }}
            onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            onTouchStart={e => { if (!(loading || allDone)) e.currentTarget.style.transform = "scale(0.9)"; }}
            onTouchEnd={e => e.currentTarget.style.transform = "scale(1)"}
          >
            <svg width="22" height="22" viewBox="0 0 24 24"
              fill="none" stroke="white" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
      <BottomNav active="chat" onNavigate={onNavigate} />
    </div>
  );
}
// ─── QUIZ ────────────────────
function QuizScreen({ user, onNavigate }) {
  const [phase, setPhase] = useState("select");
  const [subject, setSubject] = useState(null);
  const [shuffledQs, setShuffledQs] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [shaking, setShaking] = useState(false);
  const [round, setRound] = useState(1);
  const [roundScore, setRoundScore] = useState(0);
  const [usedQKeys, setUsedQKeys] = useState(new Set());


  const availableSubjects = Object.keys(QUIZ_DATA).filter(s => user.subjects.includes(s));
  const currentQ = shuffledQs[qIndex];

  const startQCM = (sub) => {
    const all = shuffleArray(QUIZ_DATA[sub]);
    const first10 = all.slice(0, 10).map(shuffleChoices);
    const used = new Set(first10.map(q => q.q));
    setSubject(sub);
    setShuffledQs(first10);
    setUsedQKeys(used);
    setPhase("qcm");
    setQIndex(0); setScore(0); setTotalAnswered(0); setRoundScore(0);
    setHearts(3); setStreak(0); setMaxStreak(0);
    setWrongAnswers([]); setSelected(null); setRound(1);
  };

  const saveScoreToSupabase = async (finalScore, finalTotal, finalStreak) => {
    if (finalTotal === 0 || !subject) return;
    const note20 = scoreToNote20(finalScore, finalTotal);
    saveQuizGrade(user.phone, subject, note20, finalScore, finalTotal);
    try {
      await callEdge({
        action: "save_quiz_score",
        phone: user.phone, schoolCode: user.code,
        name: user.name || user.phone,
        subject, score: finalScore, total: finalTotal,
        note20, streak: finalStreak,
      });
    } catch (e) { console.warn("Score save failed", e); }
  };

  const handleChoice = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === currentQ.answer;
    setTotalAnswered(t => t + 1);
    if (correct) {
      setScore(s => s + 1);
      setRoundScore(r => r + 1);
      setStreak(s => {
        const ns = s + 1;
        setMaxStreak(m => Math.max(m, ns));
        return ns;
      });
    } else {
      // handleChoice décrémente hearts — handleNext lira la valeur déjà mise à jour
      setHearts(h => h - 1);
      setStreak(0);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      setWrongAnswers(p => [...p.slice(-4), {
        q: currentQ.q, selected: idx, correctIdx: currentQ.answer,
        choices: currentQ.choices, note: currentQ.note,
      }]);
    }
  };

  // handleNext utilise hearts tel qu'il est après handleChoice (valeur déjà décrémentée)
  const handleNext = async () => {
    // hearts est déjà à jour : si handleChoice a perdu le dernier cœur, hearts === 0 ici
    if (hearts <= 0) {
      await saveScoreToSupabase(score, totalAnswered, maxStreak);
      setPhase("gameover");
      return;
    }
    const next = qIndex + 1;
    // Fin du round de 10 questions → écran Bravo
    if (next >= shuffledQs.length) {
      await saveScoreToSupabase(score, totalAnswered, maxStreak);
      setPhase("bravo");
      return;
    }
    setQIndex(next);
    setSelected(null);
  };

  // Continuer avec 10 nouvelles questions différentes
  const continueQuiz = () => {
    const all = QUIZ_DATA[subject] || [];
    // Filtrer les questions déjà vues
    const unseen = all.filter(q => !usedQKeys.has(q.q));
    // Si toutes vues, repartir depuis zéro
    const pool = unseen.length >= 10 ? unseen : shuffleArray(all);
    const next10 = shuffleArray(pool).slice(0, 10).map(shuffleChoices);
    const newUsed = new Set([...usedQKeys, ...next10.map(q => q.q)]);
    setShuffledQs(next10);
    setUsedQKeys(newUsed);
    setQIndex(0);
    setSelected(null);
    setRoundScore(0);
    setRound(r => r + 1);
    setPhase("qcm");
  };



  const allIcons = {
    "SVT (Sciences de la Vie et de la Terre)": "🧬",
    "Physique": "⚡",
    "Chimie": "⚗️",
    "Philosophie & Dissertation": "🧠",
    "Sciences Sociales & Citoyenneté": "🌍",
    "Littérature Haïtienne": "🇭🇹",
    "Littérature Française": "🗼",
    "Mathématiques": "📐",
    "Kreyòl Ayisyen": "🗣️",
    "Art & Mizik Ayisyen": "🎵",
    "Anglais": "🇬🇧",
    "Espagnol": "🇪🇸",
    "Entrepreneuriat Scolaire": "💼",
    "Informatique, Technologie & Arts": "💻",
  };

  // ── SELECT ──
  if (phase === "select") return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "#0a0f2e" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 16px", background:"rgba(10,15,46,0.98)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.10)" }}>
        <div style={{ width:38, height:38, borderRadius:9, overflow:"hidden", flexShrink:0, background:"#fff", boxShadow:"0 2px 10px #00000044" }}>
          <img src={APP_LOGO} alt="Gid NS4" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        </div>
        <div>
          <h2 style={{ color:"#E8EEFF", fontWeight:800, fontSize:15, margin:0 }}>Quiz NS4</h2>
          <p style={{ color:"#4B6ABA", fontSize:11, margin:0, marginTop:1 }}>{availableSubjects.length} matière{availableSubjects.length > 1 ? "s" : ""} disponib</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {/* Mode infini info */}
        <div style={{ background:"linear-gradient(135deg,rgba(232,0,42,0.12),rgba(255,92,53,0.08))", border:"1px solid rgba(232,0,42,0.2)", borderRadius:16, padding:"12px 16px", display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:22 }}>❤️❤️❤️</span>
          <div>
            <div style={{ color:"#E8EEFF", fontWeight:700, fontSize:12 }}>Mode Duolingo — 3 kè</div>
            <div style={{ color:"#5B7ADB", fontSize:11, marginTop:2 }}>Kesyon enfini • Jwe jouk ou pèdi 3 kè</div>
          </div>
        </div>
        <p style={{ color:"#4B5EA8", fontSize:11, textAlign:"center", padding:"4px 0", letterSpacing:"0.08em", textTransform:"uppercase" }}>— Chwazi yon matière —</p>
        {availableSubjects.map(sub => (
          <button key={sub} onClick={() => startQCM(sub)}
            style={{
              width:"100%", padding:"14px 16px", borderRadius:16, textAlign:"left",
              display:"flex", alignItems:"center", gap:14, border:"none",
              background:"rgba(15,28,60,0.90)", border:"1px solid rgba(37,99,235,0.12)",
              boxShadow:"0 2px 12px rgba(0,0,0,0.2)", cursor:"pointer",
              transition:"all .2s", animation:"slideIn .3s ease both",
            }}
            onTouchStart={e => { e.currentTarget.style.transform="scale(0.97)"; e.currentTarget.style.borderColor="rgba(37,99,235,0.4)"; }}
            onTouchEnd={e => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.borderColor="rgba(37,99,235,0.12)"; }}>
            <div style={{ width:44, height:44, borderRadius:12, background:"rgba(37,99,235,0.12)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <span style={{ fontSize:24 }}>{allIcons[sub]}</span>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ color:"#E8EEFF", fontWeight:700, fontSize:13 }}>{sub}</div>
              <div style={{ color:"#4B5EA8", fontSize:11, marginTop:3 }}>{QUIZ_DATA[sub].length} kesyon • Mode infini 🔄</div>
            </div>
            <span style={{ color:"#4B5EA8", fontSize:18 }}>›</span>
          </button>
        ))}
        {Object.keys(QUIZ_DATA).filter(s => !user.subjects.includes(s)).map(sub => (
          <div key={sub} style={{
            width:"100%", padding:"14px 16px", borderRadius:16,
            display:"flex", alignItems:"center", gap:14,
            background:"rgba(12,21,48,0.4)", border:"1px solid rgba(37,99,235,0.05)",
            opacity:0.3, boxSizing:"border-box"
          }}>
            <div style={{ width:44, height:44, borderRadius:12, background:"rgba(37,99,235,0.06)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <span style={{ fontSize:22 }}>{allIcons[sub]}</span>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ color:"#E8EEFF", fontWeight:600, fontSize:13 }}>{sub}</div>
              <div style={{ color:"#4B5EA8", fontSize:11, marginTop:2 }}>Pa disponib ak kòd lekòl ou</div>
            </div>
            <span style={{ fontSize:14 }}>🔒</span>
          </div>
        ))}
      </div>
      <BottomNav active="quiz" onNavigate={onNavigate} />
    </div>
  );



  // ── QCM ──
  if (phase === "qcm" && currentQ) return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "#0a0f2e" }}>
      {/* Header avec cœurs + streak */}
      <div className="px-4 py-3 border-b" style={{ background: "rgba(10,15,46,0.98)", borderColor: "#ffffff10" }}>
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => setPhase("select")} className="text-blue-400 text-xl">←</button>
          <h2 className="text-white font-bold flex-1 text-sm">{subject}</h2>
          {/* Streak */}
          {streak >= 2 && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: "#f97316" + "33", border: "1px solid #f9731644" }}>
              <span style={{ fontSize: 14 }}>🔥</span>
              <span className="text-orange-400 font-black text-sm">{streak}</span>
            </div>
          )}
          {/* Cœurs */}
          <div className="flex gap-1" style={{ animation: shaking ? "shake .4s ease" : "none" }}>
            {[0,1,2].map(i => (
              <span key={i} style={{ fontSize: 20, opacity: i < hearts ? 1 : 0.15, filter: i < hearts ? "none" : "grayscale(1)" }}>❤️</span>
            ))}
          </div>
        </div>
        {/* Score compact */}
        <div className="flex items-center justify-between">
          <span className="text-blue-500 text-xs">Wònn {round} • {totalAnswered} kesyon</span>
          <span className="text-green-400 text-xs font-bold">{score} ✅</span>
        </div>
        {/* Barre de progression de la session (score/total) */}
        <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: "#0f1e4a" }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: totalAnswered > 0 ? `${(score / totalAnswered) * 100}%` : "0%", background: "linear-gradient(90deg,#22c55e,#86efac)" }} />
        </div>
      </div>

      <div className="flex-1 px-4 py-5 flex flex-col gap-4 overflow-y-auto">
        <div style={{ background:"rgba(15,28,60,0.95)", border:"1px solid rgba(37,99,235,0.15)", borderRadius:18, padding:"18px 18px", boxShadow:"0 4px 24px rgba(0,0,0,0.3)" }}>
          <p style={{ color:"#E8EEFF", fontWeight:600, fontSize:15, lineHeight:1.6, margin:0 }}>{currentQ.q}</p>
        </div>
        <div className="space-y-3">
          {currentQ.choices.map((choice, idx) => {
            const isCorrect = selected !== null && idx === currentQ.answer;
            const isWrong = selected !== null && idx === selected && idx !== currentQ.answer;
            const isNeutral = selected === null;
            const letters = ["A","B","C","D"];
            const letterColors = ["#2563EB","#7C3AED","#059669","#D97706"];
            return (
              <button key={idx} onClick={() => handleChoice(idx)}
                style={{
                  width:"100%", padding:"14px 16px", borderRadius:14, textAlign:"left",
                  display:"flex", alignItems:"center", gap:12,
                  background: isCorrect ? "rgba(34,197,94,0.12)" : isWrong ? "rgba(239,68,68,0.1)" : "rgba(15,28,60,0.90)",
                  border: `1.5px solid ${isCorrect ? "rgba(34,197,94,0.5)" : isWrong ? "rgba(239,68,68,0.4)" : "rgba(37,99,235,0.12)"}`,
                  color: isCorrect ? "#4ADE80" : isWrong ? "#FC8181" : "#E8EEFF",
                  cursor: selected !== null ? "default" : "pointer",
                  transform: isNeutral ? "none" : "none",
                  transition:"all .2s",
                  animation: `fadeIn .2s ${idx*0.05}s ease both`,
                  fontSize:14, fontWeight:500,
                  boxShadow: isCorrect ? "0 4px 20px rgba(34,197,94,0.15)" : isWrong ? "0 4px 20px rgba(239,68,68,0.1)" : "none"
                }}
                onTouchStart={e => { if(selected===null) e.currentTarget.style.transform="scale(0.97)"; }}
                onTouchEnd={e => { e.currentTarget.style.transform="scale(1)"; }}>
                <span style={{
                  width:28, height:28, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center",
                  fontWeight:800, fontSize:12, flexShrink:0,
                  background: isCorrect ? "#22C55E" : isWrong ? "#EF4444" : `${letterColors[idx]}22`,
                  color: isCorrect || isWrong ? "white" : letterColors[idx],
                  border: `1px solid ${isCorrect ? "#22C55E" : isWrong ? "#EF4444" : `${letterColors[idx]}44`}`
                }}>
                  {letters[idx]}
                </span>
                <span style={{ flex:1, lineHeight:1.4 }}>{choice}</span>
                {isCorrect && <span style={{ fontSize:16, flexShrink:0 }}>✅</span>}
                {isWrong && <span style={{ fontSize:16, flexShrink:0 }}>❌</span>}
              </button>
            );
          })}
        </div>

        {/* Explication + bouton suivant */}
        {selected !== null && (
          <div style={{ animation: "fadeIn .3s ease both" }}>
            {currentQ.note && (
              <div style={{
                background: selected === currentQ.answer ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.07)",
                border: `1px solid ${selected === currentQ.answer ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.2)"}`,
                borderRadius:14, padding:"12px 14px", marginBottom:12
              }}>
                <p style={{ color: selected === currentQ.answer ? "#86EFAC" : "#FCA5A5", fontSize:12, lineHeight:1.6, margin:0 }}>
                  💡 {currentQ.note}
                </p>
              </div>
            )}
            <button onClick={handleNext}
              className="w-full py-4 rounded-2xl font-bold text-white active:scale-95 transition-transform"
              style={{
              background: hearts <= 0 ? "linear-gradient(135deg,#E8002A,#EF4444)" : "linear-gradient(135deg,#2563EB,#3B82F6)",
              boxShadow: hearts <= 0 ? "0 4px 20px rgba(232,0,42,0.3)" : "0 4px 20px rgba(37,99,235,0.3)",
              borderRadius:14, border:"none"
            }}>
              {hearts <= 0 ? "💔 Gade Rezilta" : "Kesyon ki vini apre →"}
            </button>
          </div>
        )}
      </div>
      <BottomNav active="quiz" onNavigate={onNavigate} />
    </div>
  );

  // ── GAME OVER ──
    // ── BRAVO (fin d'un round de 10 questions) ──
  if (phase === "bravo") {
    const note20 = scoreToNote20(roundScore, 10);
    const mention = getMention(note20);
    const allCount = (QUIZ_DATA[subject] || []).length;
    const seenCount = usedQKeys.size;
    const hasMore = (allCount - seenCount) >= 5;
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center px-6" style={{ background: "linear-gradient(160deg,#0a0f2e,#0d1b4b,#1a0505)" }}>
        <div className="w-full max-w-sm space-y-5" style={{ animation: "popIn .5s cubic-bezier(.34,1.56,.64,1) both" }}>
          {/* Emoji + titre */}
          <div className="text-center">
            <div style={{ fontSize: 64 }}>🎉</div>
            <h2 className="text-white font-black text-3xl mt-2">Bravo !</h2>
            <p className="text-blue-300 text-sm mt-1">{subject} • Wònn {round}</p>
          </div>

          {/* Score du round */}
          <div className="rounded-3xl px-5 py-5 text-center" style={{ background: mention.bg, border: `2px solid ${mention.border}` }}>
            <div style={{ fontSize: 40 }}>{mention.emoji}</div>
            <div className="font-black mt-1" style={{ fontSize: 48, color: mention.color, lineHeight: 1 }}>
              {note20}<span className="text-xl" style={{ color: mention.color + "99" }}>/20</span>
            </div>
            <div className="text-white font-bold text-lg mt-1">{mention.label}</div>
            <div className="text-blue-300 text-sm mt-1">{roundScore}/10 kòrèk • {streak > 0 ? `🔥 Streak ${streak}` : ""}</div>
          </div>

          {/* Stats globales */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: "✅", val: score, label: "Total kòrèk" },
              { icon: "🔥", val: maxStreak, label: "Max streak" },
              { icon: "📚", val: `${seenCount}/${allCount}`, label: "Kesyon wè" },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl p-3 text-center" style={{ background: "#0f1e4a", border: "1px solid #1e3a8a33" }}>
                <div style={{ fontSize: 18 }}>{s.icon}</div>
                <div className="text-white font-black text-base">{s.val}</div>
                <div className="text-blue-500 text-xs">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Question */}
          <p className="text-white font-bold text-center text-lg">Ou vle kontinye ?</p>

          {/* Boutons */}
          <div className="flex gap-3">
            <button onClick={continueQuiz} disabled={!hasMore && seenCount >= allCount}
              className="flex-1 py-4 rounded-2xl font-black text-white text-lg active:scale-95 transition-transform"
              style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)", boxShadow: "0 4px 20px #22c55e44" }}>
              ✅ Wi
            </button>
            <button onClick={() => setPhase("select")}
              className="flex-1 py-4 rounded-2xl font-black text-lg active:scale-95 transition-transform"
              style={{ background: "#0f1e4a", color: "#93c5fd", border: "1px solid #1e3a8a33" }}>
              ❌ Non
            </button>
          </div>

          {!hasMore && seenCount >= allCount && (
            <p className="text-yellow-400 text-xs text-center">🏆 Ou fini tout {allCount} kesyon yo ! Bravo !</p>
          )}
        </div>
      </div>
    );
  }

// ─── LEADERBOARD ──────────────────────────────────────────────────────────────
function LeaderboardScreen({ user, onNavigate }) {
  const [tab, setTab] = useState("bestNote");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    callEdge({ action: "get_leaderboard", phone: user.phone })
      .then(d => setData(d))
      .catch(e => setError(parseApiError(e).message))
      .finally(() => setLoading(false));
  }, []);

  // ─── SVG ICONS ───────────────────────────────────────────────────────────
  const TrophyIcon = ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
  const FireIcon = ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
  const CalendarIcon = ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
  const AlertIcon = ({ size = 16, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" /><path d="M12 17h.01" />
    </svg>
  );
  const RefreshIcon = ({ size = 14, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 21h5v-5" />
    </svg>
  );
  const ChartBarIcon = ({ size = 48, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" />
    </svg>
  );  const MedalIcon = ({ color, size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
      <circle cx="12" cy="8" r="6" />
      <path d="M12 14v4M9 20l3-2 3 2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const tabs = [
    { id: "bestNote", icon: <TrophyIcon size={14} />, label: "Pi bon nòt", valueLabel: "/20" },
    { id: "totalCorrect", icon: <FireIcon size={14} />, label: "Total Kòrèk", valueLabel: " pts" },
    { id: "thisWeek", icon: <CalendarIcon size={14} />, label: "Semèn Sa", valueLabel: " pts" },
  ];

  const currentTab = tabs.find(t => t.id === tab);
  const board = data ? data[tab] : [];
  const colors = ["#fbbf24","#94a3b8","#cd7c32","#3b82f6","#22c55e","#a855f7","#f97316","#14b8a6","#ec4899","#6366f1"];

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "#0a0f2e" }}>
      {/* Header */}
      <div className="px-4 py-4 border-b" style={{ background: "rgba(10,15,46,0.98)", borderColor: "#ffffff10" }}>
        <div className="flex items-center gap-3 mb-3">
          <TrophyIcon size={24} color="#F59E0B" />
          <div>
            <h2 className="text-white font-bold">Klasman</h2>
            <p className="text-blue-400 text-xs">{user.school}</p>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex gap-2">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              style={{
                background: tab === t.id ? "linear-gradient(135deg,#d4002a,#ff6b35)" : "#0f1e4a",
                color: tab === t.id ? "white" : "#4b5ea8",
                border: tab === t.id ? "none" : "1px solid #1e3a8a33",
              }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="flex gap-2">
              {[0,1,2].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-blue-400" style={{ animation: `bounce 1s ${i*0.2}s infinite` }} />)}
            </div>            <p className="text-blue-500 text-sm">Chajman Klasman an...</p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl px-4 py-4 text-center" style={{ background: "#7f1d1d22", border: "1px solid #ef444433" }}>
            <p className="text-red-400 text-sm flex items-center justify-center gap-2">
              <AlertIcon color="#F87171" /> {error}
            </p>
            <button onClick={() => { setLoading(true); setError(null); callEdge({ action: "get_leaderboard", phone: user.phone }).then(d => setData(d)).catch(e => setError(parseApiError(e).message)).finally(() => setLoading(false)); }}
              className="mt-3 px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 mx-auto"
              style={{ background: "linear-gradient(135deg,#d4002a,#ff6b35)" }}>
              <RefreshIcon /> Eseye Ankò
            </button>
          </div>
        )}

        {!loading && !error && board?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <ChartBarIcon color="#3B82F6" />
            <p className="text-blue-400 text-center text-sm">Pa gen done ankò.<br />Fè kèk quiz pou parèt nan klasman an !</p>
            <button onClick={() => onNavigate("quiz")} className="px-6 py-3 rounded-xl font-bold text-white text-sm"
              style={{ background: "linear-gradient(135deg,#d4002a,#ff6b35)" }}>→ Ale nan Quiz</button>
          </div>
        )}

        {!loading && !error && board?.length > 0 && (
          <>
            {/* Top 3 podium */}
            {board.length >= 3 && (
              <div className="flex items-end justify-center gap-3 py-4" style={{ animation: "fadeIn .5s ease both" }}>
                {/* 2nd */}
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:1 }}>
                  <div style={{ marginBottom:6 }}><MedalIcon color="#94a3b8" size={28} /></div>
                  <div style={{
                    width:"100%", borderRadius:"14px 14px 0 0", display:"flex", flexDirection:"column", alignItems:"center",
                    padding:"12px 8px", height:80, background:"linear-gradient(180deg,rgba(148,163,184,0.15),rgba(148,163,184,0.05))",
                    border:"1px solid rgba(148,163,184,0.25)", borderBottom:"none"
                  }}>
                    <div style={{ color:"#E8EEFF", fontWeight:700, fontSize:11, textAlign:"center", lineHeight:1.3 }}>{board[1].name || board[1].phone}</div>
                    <div style={{ fontWeight:900, marginTop:6, color:"#94A3B8", fontSize:15 }}>{board[1].value}{currentTab.valueLabel}</div>
                  </div>
                </div>
                {/* 1st */}
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:1 }}>
                  <div style={{ marginBottom:6, filter:"drop-shadow(0 0 12px #F59E0B)" }}><MedalIcon color="#fbbf24" size={36} /></div>
                  <div style={{
                    width:"100%", borderRadius:"14px 14px 0 0", display:"flex", flexDirection:"column", alignItems:"center",
                    padding:"14px 8px", height:100, background:"linear-gradient(180deg,rgba(251,191,36,0.2),rgba(251,191,36,0.05))",
                    border:"1px solid rgba(251,191,36,0.35)", borderBottom:"none",                    boxShadow:"0 -4px 20px rgba(251,191,36,0.15)"
                  }}>
                    <div style={{ color:"#FDE68A", fontWeight:800, fontSize:11, textAlign:"center", lineHeight:1.3 }}>{board[0].name || board[0].phone}</div>
                    <div style={{ fontWeight:900, marginTop:6, color:"#FBD04A", fontSize:20 }}>{board[0].value}{currentTab.valueLabel}</div>
                    {board[0].isMe && <div style={{ color:"#F59E0B", fontSize:10, marginTop:4 }}>← Ou</div>}
                  </div>
                </div>
                {/* 3rd */}
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:1 }}>
                  <div style={{ marginBottom:6 }}><MedalIcon color="#cd7c32" size={26} /></div>
                  <div style={{
                    width:"100%", borderRadius:"14px 14px 0 0", display:"flex", flexDirection:"column", alignItems:"center",
                    padding:"10px 6px", height:65, background:"linear-gradient(180deg,rgba(205,124,50,0.15),rgba(205,124,50,0.05))",
                    border:"1px solid rgba(205,124,50,0.25)", borderBottom:"none"
                  }}>
                    <div style={{ color:"#E8EEFF", fontWeight:700, fontSize:10, textAlign:"center", lineHeight:1.3 }}>{board[2].name || board[2].phone}</div>
                    <div style={{ fontWeight:900, marginTop:5, color:"#CD7C32", fontSize:14 }}>{board[2].value}{currentTab.valueLabel}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Liste complète */}
            <div className="space-y-2">
              {board.map((entry, i) => (
                <div key={i} style={{
                    display:"flex", alignItems:"center", gap:12, padding:"12px 14px", borderRadius:14,
                    background: entry.isMe ? "rgba(37,99,235,0.15)" : "rgba(15,28,60,0.80)",
                    border: entry.isMe ? "1.5px solid rgba(37,99,235,0.5)" : "1px solid rgba(255,255,255,0.10)",
                    animation: `slideIn .3s ${i * 0.04}s ease both`,
                    boxShadow: entry.isMe ? "0 4px 20px rgba(37,99,235,0.15)" : "0 2px 8px rgba(0,0,0,0.15)"
                  }}>
                  <div style={{
                    width:32, height:32, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center",
                    fontWeight:900, fontSize:12, flexShrink:0,
                    background:`${colors[i % colors.length]}20`, color:colors[i % colors.length]
                  }}>
                    {i === 0 ? <MedalIcon color="#fbbf24" size={16} /> :
                     i === 1 ? <MedalIcon color="#94a3b8" size={16} /> :
                     i === 2 ? <MedalIcon color="#cd7c32" size={16} /> : `#${entry.rank}`}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ color:"#E8EEFF", fontWeight:700, fontSize:13, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{entry.name || entry.phone}</span>
                      {entry.isMe && (
                        <span style={{ padding:"2px 7px", borderRadius:20, fontSize:10, fontWeight:700, background:"#2563EB", color:"white", flexShrink:0 }}>Ou</span>
                      )}
                    </div>
                    {entry.school && (
                      <div style={{ color:"#4b5ea8", fontSize:10, marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{entry.school}</div>
                    )}
                  </div>
                  <div style={{ fontWeight:900, fontSize:17, color:colors[i % colors.length], flexShrink:0 }}>                    {entry.value}<span style={{ fontSize:10, fontWeight:400, opacity:0.6 }}>{currentTab.valueLabel}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Ma position si pas dans top 10 */}
            {data && !board.find(e => e.isMe) && (
              <div className="rounded-2xl px-4 py-3 text-center" style={{ background: "#1a4fd622", border: "1px solid #3b82f633" }}>
                <p className="text-blue-300 text-xs">Fè plis quiz pou parèt nan top 10 lan ! </p>
              </div>
            )}

            {data?.currentWeek && tab === "thisWeek" && (
              <p className="text-blue-800 text-xs text-center">Semèn : {data.currentWeek}</p>
            )}
          </>
        )}
      </div>
      <BottomNav active="leaderboard" onNavigate={onNavigate} />
    </div>
  );
}

// ─── HISTORY ──────────────────────────────────────────────────────────────────
function HistoryScreen({ user, onNavigate }) {
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    idbGetScans(user.phone).then(data => setHistory(data)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (entry) => {
    setDeleting(entry.id);
    await idbDeleteScan(entry.id);
    setHistory(h => h.filter(x => x.id !== entry.id));
    if (selected?.id === entry.id) setSelected(null);
    setDeleting(null);
  };

  const dailyMap = {};
  history.forEach(h => {
    const day = h.scanDate || h.date?.split(",")[0] || "?";
    if (!dailyMap[day]) dailyMap[day] = 0;
    dailyMap[day]++;
  });

  // ─── SVG ICONS ───────────────────────────────────────────────────────────
  const ClipboardIcon = ({size=18, color="currentColor"}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>
  );
  const DatabaseIcon = ({size=12, color="currentColor"}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>
  );
  const TrashIcon = ({size=12, color="currentColor"}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
  );
  const LoaderIcon = ({size=12, color="currentColor"}) => (
    <svg className="animate-spin" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
  );
  const AlertTriangleIcon = ({size=14, color="currentColor"}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
  );
  const ImageIcon = ({size=16, color="currentColor"}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
  );
  const FileTextIcon = ({size=24, color="currentColor"}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
  );
  const InboxIcon = ({size=48, color="currentColor"}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
  );  const BarChartIcon = ({size=18, color="currentColor"}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>
  );
  // ─────────────────────────────────────────────────────────────────────────

  if (selected) return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "#0a0f2e" }}>
      <div className="px-4 py-4 border-b flex items-center gap-3" style={{ background: "rgba(10,15,46,0.98)", borderColor: "#ffffff10" }}>
        <button onClick={() => setSelected(null)} className="text-blue-400 text-xl">←</button>
        <div className="flex-1">
          <h2 className="text-white font-bold">Detay Scan</h2>
          <p className="text-blue-400 text-xs">{selected.subject} • {selected.date}</p>
        </div>
        <button onClick={() => handleDelete(selected)} disabled={deleting === selected.id}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
          style={{ background: "#d4002a22", color: "#ff8080", border: "1px solid #d4002a33" }}>
          {deleting === selected.id ? <LoaderIcon color="#ff8080" /> : <TrashIcon color="#ff8080" />} Efase
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {!selected._fallback ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "#14532d22", border: "1px solid #22c55e22" }}>
            <DatabaseIcon color="#86efac" />
            <span className="text-green-300 text-xs">Stocké dans IndexedDB • Image disponible hors-ligne</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "#78350f22", border: "1px solid #f59e0b22" }}>
            <AlertTriangleIcon color="#fbbf24" />
            <span className="text-yellow-300 text-xs">Mode fallback — image non disponible hors-ligne</span>
          </div>
        )}
        {selected.image ? (
          <div>
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ImageIcon color="#60A5FA" /> Imaj ki analize
            </p>
            <img src={selected.image} alt="scan" className="w-full rounded-2xl object-contain max-h-56" style={{ border: "1px solid #1e3a8a44" }} />
          </div>
        ) : (
          <div className="rounded-2xl px-4 py-3 flex items-center gap-3" style={{ background: "#1e3a8a11", border: "1px solid #1e3a8a22" }}>
            <FileTextIcon size={18} color="#3B82F6" />
            <span className="text-blue-400 text-xs">Kesyon tèks — pa gen imaj</span>
          </div>
        )}
        <div className="rounded-2xl p-4" style={{ background: "#0f1e4a", border: "1px solid #1e3a8a33" }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-xl overflow-hidden" style={{ background: "#fff" }}>
              <img src={PROF_LAKAY_PHOTO} alt="Prof Lakay" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <span className="text-white font-bold text-sm">Repons Prof Lakay</span>          </div>
          <div className="text-sm leading-relaxed" style={{ color: "#e0e8ff" }}>
            <LatexText content={selected.response} />
          </div>
        </div>
        <div className="rounded-2xl px-4 py-3 flex justify-between" style={{ background: "#0f1e4a", border: "1px solid #1e3a8a22" }}>
          <span className="text-blue-400 text-xs">Scan itilize jou sa</span>
          <span className="text-orange-300 font-bold text-xs">{selected.scansUsed}/{selected.dailyLimit || user.dailyScans}</span>
        </div>
      </div>
      <BottomNav active="history" onNavigate={onNavigate} />
    </div>
  );

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "#0a0f2e" }}>
      <div className="px-4 py-4 border-b" style={{ background: "rgba(10,15,46,0.98)", borderColor: "#ffffff10" }}>
        <h2 className="text-white font-bold flex items-center gap-2">
          <ClipboardIcon color="#60A5FA" /> Istwa Scan Ou
        </h2>
        <div className="flex items-center gap-3 mt-0.5">
          <p className="text-blue-400 text-xs">{history.length} scan{history.length !== 1 ? "s" : ""} total</p>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1.5" style={{ background: "#14532d22", color: "#86efac", border: "1px solid #22c55e22" }}>
            <DatabaseIcon color="#86efac" /> IndexedDB • hors-ligne
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="flex gap-2">
              {[0,1,2].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-blue-400" style={{ animation: `bounce 1s ${i*0.2}s infinite` }} />)}
            </div>
            <p className="text-blue-500 text-sm">Chajman istwa ou depi IndexedDB...</p>
          </div>
        )}
        {!loading && Object.keys(dailyMap).length > 0 && (
          <div className="rounded-2xl p-4" style={{ background: "#0f1e4a", border: "1px solid #1e3a8a33" }}>
            <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
              <BarChartIcon color="#60A5FA" /> Scan pa Jou
            </h3>
            <div className="space-y-2">
              {Object.entries(dailyMap).slice(0, 7).map(([day, count]) => (
                <div key={day} className="flex items-center gap-3">
                  <span className="text-blue-400 text-xs w-24 flex-shrink-0">{day}</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "#1e3a8a44" }}>
                    <div className="h-full rounded-full" style={{ width: `${(count / user.dailyScans) * 100}%`, background: count >= user.dailyScans ? "#ef4444" : "linear-gradient(90deg,#d4002a,#ff6b35)" }} />
                  </div>
                  <span className="text-orange-300 text-xs font-bold w-10 text-right">{count}/{user.dailyScans}</span>
                </div>              ))}
            </div>
          </div>
        )}
        {!loading && history.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <InboxIcon color="#3B82F6" />
            <p className="text-blue-400 text-center text-sm">Pa gen istwa encore.<br />Fè premye scan ou nan Chat !</p>
            <button onClick={() => onNavigate("chat")} className="px-6 py-3 rounded-xl font-bold text-white text-sm"
              style={{ background: "linear-gradient(135deg,#d4002a,#ff6b35)" }}>→ Ale nan Chat</button>
          </div>
        )}
        {!loading && history.length > 0 && (
          <>
            <h3 className="text-blue-400 text-xs font-semibold uppercase tracking-wider">Tout Scan Ou Yo</h3>
            {history.map(h => (
              <div key={h.id} className="rounded-2xl overflow-hidden" style={{ background: "#0f1e4a", border: "1px solid #1e3a8a33" }}>
                <button onClick={() => setSelected(h)} className="w-full text-left active:scale-95 transition-transform">
                  <div className="flex gap-3 p-4">
                    {h.image ? (
                      <img src={h.image} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" style={{ border: "1px solid #1e3a8a44" }} />
                    ) : (
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#1e3a8a33" }}>
                        <FileTextIcon size={20} color="#64748b" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "#d4002a22", color: "#ff8080" }}>{h.subject}</span>
                        {h.image && <DatabaseIcon color="#166534" />}
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: "#93c5fd", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {h.response?.slice(0, 100)}...
                      </p>
                      <p className="text-blue-800 text-xs mt-1">{h.date}</p>
                    </div>
                    <span className="text-blue-700 text-lg self-center">›</span>
                  </div>
                </button>
                <div className="px-4 pb-3 flex justify-end">
                  <button onClick={() => handleDelete(h)} disabled={deleting === h.id}
                    className="px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                    style={{ background: "#d4002a15", color: "#ff8080", border: "1px solid #d4002a22" }}>
                    {deleting === h.id ? <LoaderIcon color="#ff8080" /> : <TrashIcon color="#ff8080" />} Efase
                  </button>
                </div>
              </div>
            ))}
          </>
        )}      </div>
      <BottomNav active="history" onNavigate={onNavigate} />
    </div>
  );
}

// ─── MENU ─────────────────────────────────────────────────────────────────────
function MenuScreen({ user, onNavigate, onLogout }) {
  // ─── SVG ICONS ───────────────────────────────────────────────────────────
  const KeyIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#6B8ADB" }}>
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="m21 2-9.6 9.6" />
      <path d="m15.5 7.5 3 3L22 7l-3-3" />
    </svg>
  );

  const AlertIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#ff8080" }}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );

  const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#86efac" }}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );

  const ChartBarIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#3b82f6" }}>
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
      <rect x="2" y="20" width="20" height="2" rx="1" />
    </svg>
  );

  const CreditCardIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#fbbf24" }}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );

  const HandshakeIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#f59e0b" }}>
      <path d="m11 17 2 2a1 1 0 1 0 3-1.732l-9.163-9.163a3 3 0 0 1 4.243 0l.132.132a1 1 0 0 0 1.414 0l.132-.132a3 3 0 0 1 4.243 0L20 11.268" />
      <path d="m13 7-2-2a1 1 0 1 0-3 1.732l9.163 9.163a3 3 0 0 1-4.243 0l-.132-.132a1 1 0 0 0-1.414 0l-.132.132a3 3 0 0 1-4.243 0L4 12.732" />
    </svg>
  );

  const LockIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#22c55e" }}>      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );

  // ─── MENU ITEMS DATA ─────────────────────────────────────────────────────
  const menuItems = [
    { icon: <ChartBarIcon />, label: "Dashboard Direksyon", screen: "dashboard" },
    { icon: <CreditCardIcon />, label: "Pèman", screen: "payment" },
    { icon: <HandshakeIcon />, label: "Vin Patnè", screen: "partner" },
  ];

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "linear-gradient(145deg,#04081A,#080E24)" }}>
      <div style={{ padding:"32px 20px 20px", borderBottom:"1px solid rgba(255,255,255,0.10)" }}>
        {/* Profile Card */}
        <div style={{
          background:"rgba(15,28,60,0.80)", backdropFilter:"blur(20px)",
          border:"1px solid rgba(255,255,255,0.12)", borderRadius:20,
          padding:"16px", display:"flex", alignItems:"center", gap:14,
          boxShadow:"0 8px 32px rgba(0,0,0,0.3)"
        }}>
          <div style={{ width:52, height:52, borderRadius:14, overflow:"hidden", flexShrink:0, background:"#fff", boxShadow:"0 4px 16px rgba(0,0,0,0.3)" }}>
            <img src={APP_LOGO} alt="Gid NS4" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ color:"#E8EEFF", fontWeight:800, fontSize:15, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.name || user.phone}</div>
            <div style={{ color:"#4B6ABA", fontSize:11, marginTop:2 }}>{user.phone}</div>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:4 }}>
              <span style={{ 
                background:"rgba(37,99,235,0.15)", 
                border:"1px solid rgba(37,99,235,0.25)", 
                borderRadius:20, 
                padding:"2px 8px", 
                color:"#6B8ADB", 
                fontSize:10, 
                fontWeight:600,
                display: "flex",
                alignItems: "center",
                gap: 4
              }}>
                <KeyIcon /> {user.code}
              </span>
            </div>
          </div>
        </div>
        <div style={{ color:"#3B5BA8", fontSize:11, textAlign:"center", marginTop:10 }}>{user.school}</div>
        <div className="mt-4 rounded-xl px-4 py-3 flex justify-between items-center"
          style={{ background: user.daysRemaining <= 7 ? "#d4002a22" : "#14532d22", border: `1px solid ${user.daysRemaining <= 7 ? "#d4002a44" : "#22c55e33"}` }}>
          <div>            <div className="text-xs font-bold flex items-center gap-2" style={{ color: user.daysRemaining <= 7 ? "#ff8080" : "#86efac" }}>
              {user.daysRemaining <= 7 ? <><AlertIcon /> Ekspire byento</> : <><CheckIcon /> Kòd Aktif</>}
            </div>
            <div className="text-xs mt-0.5" style={{ color: user.daysRemaining <= 7 ? "#ff6060" : "#6ee7b7" }}>
              {user.daysRemaining} jou rete • {user.dailyScans} scan/jou
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-blue-400">{user.subjects.length} matière{user.subjects.length > 1 ? "s" : ""}</div>
          </div>
        </div>
      </div>
      <div className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item, i) => (
          <button key={item.screen} onClick={() => onNavigate(item.screen)}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left active:scale-95 transition-transform"
            style={{ background: "#ffffff08", border: "1px solid #ffffff10" }}>
            <div style={{ flexShrink: 0 }}>{item.icon}</div>
            <span className="text-white font-medium">{item.label}</span>
            <span className="ml-auto text-blue-600">›</span>
          </button>
        ))}
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl" style={{ background: "#14532d15", border: "1px solid #22c55e22" }}>
          <div style={{ flexShrink: 0 }}><LockIcon /></div>
          <div>
            <div className="text-green-300 text-sm font-semibold">Koneksyon Sekirize</div>
            <div className="text-green-800 text-xs">Kle API pwoteje</div>
          </div>
        </div>
      </div>
      <div className="px-4 pb-4">
        <button onClick={onLogout} className="w-full py-4 rounded-2xl text-red-400 font-semibold"
          style={{ background: "#d4002a15", border: "1px solid #d4002a30" }}>Dekonekte</button>
      </div>
      <BottomNav active="menu" onNavigate={onNavigate} />
    </div>
  );
}
// ─── PAYMENT ──────────────────────────────────────────────────────────────────
function PaymentScreen({ onBack }) {
  const [payments, setPayments] = useState([]);
  const [copied, setCopied] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    callEdge({ action: "get_payment_numbers" })
      .then(d => setPayments(d.payments || []))
      .catch(() => setPayments([{ method: "MonCash", number: "50948695079" }, { method: "NatCash", number: "50940669105" }]))
      .finally(() => setLoading(false));
  }, []);

  const copy = (num, key) => {
    navigator.clipboard?.writeText(num).catch(() => {});
    setCopied(key); setTimeout(() => setCopied(null), 2500);
  };

  // ─── SVG ICONS ───────────────────────────────────────────────────────────
  const CopyIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );

  const CheckIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );

  const LightningIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );

  const WhatsAppIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );

  const CreditCardIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#666" }}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
  const cardStyle = {
    MonCash: { grad: "linear-gradient(135deg,#c0392b,#e74c3c)", icon: "https://i.postimg.cc/J4h15HZC/telechargement.jpg", sub: "Digicel Haiti" },
    NatCash: { grad: "linear-gradient(135deg,#e67e22,#f39c12)", icon: "https://i.postimg.cc/1zXmJhDn/file-00000000ae3c71f788921fb0d044db44.jpg", sub: "Natcom Haiti" },
  };

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "linear-gradient(145deg,#04081A,#080E24)" }}>
      <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor: "#ffffff10" }}>
        <button onClick={onBack} className="text-blue-400 text-xl">←</button>
        <h2 className="text-white font-bold text-lg">Pèman & Aktivasyon</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="flex gap-2">{[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-blue-400" style={{ animation: `bounce 1s ${i*0.2}s infinite` }} />)}</div>
          </div>
        ) : payments.map(p => {
          const style = cardStyle[p.method] || { grad: "linear-gradient(135deg,#333,#555)", icon: null, sub: "" };
          return (
            <div key={p.method} className="rounded-3xl" style={{ background: style.grad }}>
              <div className="px-5 py-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center" style={{ overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                    {style.icon ? (
                      <img 
                        src={style.icon} 
                        alt={p.method}
                        style={{ width: "70%", height: "70%", objectFit: "contain" }}
                      />
                    ) : (
                      <CreditCardIcon />
                    )}
                  </div>
                  <div><div className="text-white font-black text-xl">{p.method}</div><div className="text-white/70 text-xs">{style.sub}</div></div>
                </div>
                <div className="bg-white/15 rounded-2xl px-4 py-3 mb-4">
                  <div className="text-white/70 text-xs mb-1">Nimewo {p.method}</div>
                  <div className="text-white font-black text-2xl tracking-widest">{p.number}</div>
                </div>
                <button onClick={() => copy(p.number, p.method)}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all"
                  style={{ 
                    background: copied === p.method ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.2)", 
                    border: "1px solid rgba(255,255,255,0.3)",
                    backdropFilter: "blur(8px)"
                  }}>
                  {copied === p.method ? (
                    <><CheckIcon /> Kopye !</>
                  ) : (
                    <><CopyIcon /> Kopye Nimewo a</>                  )}
                </button>
                <p className="text-white/60 text-xs text-center mt-3 flex items-center justify-center gap-1">
                  <LightningIcon /> Aktivasyon garanti an mwens 30 minit
                </p>
              </div>
            </div>
          );
        })}
        <button onClick={() => window.open("https://wa.me/50900000000?text=Bonjou%2C%20mwen%20vle%20aktive%20Gid%20NS4.", "_blank")}
          className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-3 active:scale-95 transition-transform"
          style={{ background: "linear-gradient(135deg,#25d366,#128c7e)", boxShadow: "0 4px 16px rgba(37,211,102,0.3)" }}>
          <WhatsAppIcon /> Konfime Pèman sou WhatsApp
        </button>
      </div>
    </div>
  );
}

// ─── GÉNÉRATION PDF RAPPORT ───────────────────────────────────────────────────
async function generateAndSharePDF(school, stats) {
  // Charger jsPDF dynamiquement depuis CDN
  if (!window.jspdf) {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const date = new Date().toLocaleDateString("fr-HT", { timeZone: "America/Port-au-Prince", day: "2-digit", month: "long", year: "numeric" });
  const W = 210, margin = 18;

  // ── Fond header ──
  doc.setFillColor(10, 15, 46);
  doc.rect(0, 0, W, 50, "F");

  // ── Titre ──
  doc.setTextColor(255, 107, 53);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("GID NS4", margin, 22);

  doc.setTextColor(147, 197, 253);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Rapò Pèfòmans Etablisman", margin, 30);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(school.name, margin, 40);

  doc.setTextColor(147, 197, 253);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Dat rapò : ${date}`, margin, 47);

  // ── Section statistiques ──
  let y = 62;
  doc.setTextColor(30, 58, 138);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("STATISTIQUES GLOBALES", margin, y);
  y += 2;
  doc.setDrawColor(212, 0, 42);
  doc.setLineWidth(0.8);
  doc.line(margin, y, W - margin, y);
  y += 8;

  const statItems = [
    { label: "Total Scans Réalisés", val: String(stats.totalScans || 0) },
    { label: "Élèves Actifs", val: String(stats.totalStudents || 0) },
    { label: "Scans Aujourd'hui", val: String(stats.scansToday || 0) },
    { label: "Quota Journalier", val: `${school.dailyScans} scan/jour` },
    { label: "Abonnement", val: `${school.daysRemaining} jours restants` },
    { label: "Matières Autorisées", val: String(school.subjects.length) },
    { label: "Limite Élèves", val: String(school.maxStudents || "—") },
  ];

  statItems.forEach(({ label, val }, i) => {
    const rowY = y + i * 9;
    if (i % 2 === 0) {
      doc.setFillColor(241, 245, 249);
      doc.rect(margin - 2, rowY - 5, W - 2 * margin + 4, 8, "F");
    }
    doc.setTextColor(30, 30, 60);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(label, margin, rowY);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(212, 0, 42);
    doc.text(val, W - margin, rowY, { align: "right" });
  });

  y += statItems.length * 9 + 10;

  // ── Section matières scannées ──
  const subjectEntries = Object.entries(stats.subjectBreakdown || {}).sort((a, b) => b[1] - a[1]);
  if (subjectEntries.length > 0) {
    doc.setTextColor(30, 58, 138);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("MATIÈRES LES PLUS UTILISÉES", margin, y);
    y += 2;
    doc.setDrawColor(212, 0, 42);
    doc.line(margin, y, W - margin, y);
    y += 8;

    const maxCount = Math.max(...subjectEntries.map(e => e[1]), 1);
    const barW = W - 2 * margin - 40;
    const colors = [[34,197,94],[59,130,246],[245,158,11],[168,85,247],[236,72,153],[20,184,166]];

    subjectEntries.slice(0, 10).forEach(([sub, count], i) => {
      const rowY = y + i * 11;
      const pct = count / maxCount;
      const [r, g, b] = colors[i % colors.length];
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(30, 30, 60);
      doc.text(sub.length > 30 ? sub.slice(0,28)+"…" : sub, margin, rowY);
      // Barre
      doc.setFillColor(220, 230, 245);
      doc.roundedRect(margin, rowY + 1.5, barW, 4, 1, 1, "F");
      doc.setFillColor(r, g, b);
      doc.roundedRect(margin, rowY + 1.5, barW * pct, 4, 1, 1, "F");
      // Valeur
      doc.setFont("helvetica", "bold");
      doc.setTextColor(r, g, b);
      doc.text(`${count}`, W - margin, rowY + 4.5, { align: "right" });
    });

    y += subjectEntries.slice(0,10).length * 11 + 8;
  }

  // ── Section matières autorisées ──
  if (school.subjects && school.subjects.length > 0) {
    doc.setTextColor(30, 58, 138);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("MATIÈRES AUTORISÉES", margin, y);
    y += 2;
    doc.setDrawColor(212, 0, 42);
    doc.line(margin, y, W - margin, y);
    y += 8;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 30, 60);
    school.subjects.forEach((sub, i) => {
      doc.text(`• ${sub}`, margin + 3, y + i * 7);
    });
    y += school.subjects.length * 7 + 8;
  }

  // ── Pied de page ──
  const footerY = 285;
  doc.setFillColor(10, 15, 46);
  doc.rect(0, footerY - 6, W, 20, "F");
  doc.setTextColor(147, 197, 253);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Gid NS4 — Asistan IA pou Elèv NS4 Haïti", W / 2, footerY, { align: "center" });
  doc.setTextColor(255, 107, 53);
  doc.text(`Généré le ${date}`, W / 2, footerY + 5, { align: "center" });

  // ── Téléchargement ──
  const filename = `GidNS4_Rapport_${school.name.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0,10)}.pdf`;
  doc.save(filename);

  // ── Partage WhatsApp ──
  const msg = encodeURIComponent(
    `📊 *Rapò Gid NS4 — ${school.name}*\n` +
    `📅 ${date}\n\n` +
    `🔍 Total scans : ${stats.totalScans || 0}\n` +
    `👥 Élèves actifs : ${stats.totalStudents || 0}\n` +
    `📅 Scans d'aujourd'hui : ${stats.scansToday || 0}\n` +
    `⏳ ${school.daysRemaining} jou rete\n\n` +
    `_Rapò PDF téléchargé — Gid NS4_`
  );
  window.open(`https://wa.me/?text=${msg}`, "_blank");
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function DashboardScreen({ onBack, userCode }) {
  const [dirCode, setDirCode] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const handleAuth = async () => {
    setLoading(true); setError("");
    try {
      const result = await callEdge({ action: "dashboard", schoolCode: userCode, directorCode: dirCode.trim() });
      setStats(result); setAuthorized(true);
    } catch (e) { setError(parseApiError(e).message); }
    setLoading(false);
  };

  // ─── SVG ICONS ───────────────────────────────────────────────────────────
  const LockIcon = () => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
  const AlertIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
  const LoaderIcon = () => (
    <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
  const FileIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
  const SearchIcon = ({ color }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
  const UsersIcon = ({ color }) => (    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
  const CalendarIcon = ({ color }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
  const BookIcon = ({ color }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
  const ChartIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );
  const CheckIcon = ({ color }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
  const WhatsAppIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );

  if (!authorized) return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "linear-gradient(145deg,#04081A,#080E24)" }}>
      <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor: "#ffffff10" }}>
        <button onClick={onBack} className="text-blue-400 text-xl">←</button>
        <h2 className="text-white font-bold">Dashboard Direction</h2>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <LockIcon />
        <h3 className="text-white font-bold text-xl mt-4 mb-2">Aksè Direksyon Sèlman</h3>
        <p className="text-blue-400 text-sm text-center mb-6">Antre kòd espesyal direktè a pou wè rapò a</p>
        <input type="text" value={dirCode} onChange={e => setDirCode(e.target.value.toUpperCase())}          placeholder="Kòd Direktè"
          className="w-full max-w-xs rounded-xl px-4 py-3.5 text-white placeholder-blue-800 font-mono font-bold outline-none tracking-widest mb-3"
          style={{ background: "#ffffff0d", border: "1.5px solid #ffffff18" }} />
        {error && (
          <p className="text-red-400 text-sm mb-3 flex items-center gap-2">
            <AlertIcon /> {error}
          </p>
        )}
        <button onClick={handleAuth} disabled={loading}
          className="w-full max-w-xs py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2"
          style={{ background: loading ? "#333" : "linear-gradient(135deg,#1a4fd6,#2563eb)" }}>
          {loading ? <><LoaderIcon /> Verifikasyon...</> : "Valide"}
        </button>
      </div>
    </div>
  );

  const { school, stats: s } = stats;
  const subjectEntries = Object.entries(s.subjectBreakdown || {}).sort((a, b) => b[1] - a[1]);
  const maxScans = Math.max(...subjectEntries.map(e => e[1]), 1);
  const colors = ["#22c55e","#3b82f6","#f59e0b","#a855f7","#ec4899","#14b8a6","#f97316"];

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "linear-gradient(145deg,#04081A,#080E24)" }}>
      <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor: "#ffffff10" }}>
        <button onClick={onBack} className="text-blue-400 text-xl">←</button>
        <div className="flex-1">
          <h2 className="text-white font-bold">Dashboard</h2>
          <p className="text-blue-400 text-xs">{school.name}</p>
        </div>
        <button onClick={() => generateAndSharePDF(school, s)} className="px-3 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 active:scale-95 transition-transform" style={{ background: "linear-gradient(135deg,#d4002a,#ff6b35)" }}>
          <FileIcon /> PDF
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <div className="rounded-2xl px-4 py-3 flex justify-between items-center"
          style={{ background: school.daysRemaining <= 7 ? "#d4002a22" : "#14532d22", border: `1px solid ${school.daysRemaining <= 7 ? "#d4002a44" : "#22c55e33"}` }}>
          <div>
            <div className="font-bold text-sm flex items-center gap-2" style={{ color: school.daysRemaining <= 7 ? "#ff8080" : "#86efac" }}>
              {school.daysRemaining <= 0 ? (
                <><span style={{color:"#ef4444"}}>●</span> Kòd Ekspire</>
              ) : school.daysRemaining <= 7 ? (
                <><span style={{color:"#f59e0b"}}>●</span> Ekspire byento</>
              ) : (
                <><CheckIcon color="#86efac" /> Kòd Aktif</>
              )}
            </div>
            <div className="text-xs mt-0.5" style={{ color: "#93c5fd" }}>
              {school.daysRemaining} jou rete • {school.dailyScans} scan/jou • max {school.maxStudents} elèv
            </div>          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Scan Total", val: s.totalScans, Icon: SearchIcon, color: "#3b82f6" },
            { label: "Élèves Actifs", val: s.totalStudents, Icon: UsersIcon, color: "#22c55e" },
            { label: "Scan d'aujourd'hui", val: s.scansToday, Icon: CalendarIcon, color: "#f59e0b" },
            { label: "Matières", val: school.subjects.length, Icon: BookIcon, color: "#a855f7" },
          ].map((item, i) => (
            <div key={i} className="rounded-2xl p-4" style={{ background: "#ffffff08", border: "1px solid #ffffff10" }}>
              <item.Icon color={item.color} />
              <div className="font-black text-2xl mt-1" style={{ color: item.color }}>{item.val}</div>
              <div className="text-blue-400 text-xs mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
        <div className="rounded-2xl p-4" style={{ background: "#ffffff08", border: "1px solid #ffffff10" }}>
          <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
            <BookIcon color="#a855f7" /> Matières Autorisées
          </h3>
          <div className="flex flex-wrap gap-2">
            {school.subjects.map((s, i) => (
              <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: colors[i % colors.length] + "33", color: colors[i % colors.length], border: `1px solid ${colors[i % colors.length]}44` }}>
                {s}
              </span>
            ))}
          </div>
        </div>
        {subjectEntries.length > 0 && (
          <div className="rounded-2xl p-5" style={{ background: "#ffffff08", border: "1px solid #ffffff10" }}>
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <ChartIcon /> Matières les Plus Scannées
            </h3>
            <div className="space-y-3">
              {subjectEntries.map(([sub, count], i) => (
                <div key={sub}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-blue-200">{sub}</span>
                    <span className="text-blue-400 font-bold">{count} scan{count > 1 ? "s" : ""}</span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "#ffffff10" }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${(count/maxScans)*100}%`, background: colors[i % colors.length] }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <button onClick={() => generateAndSharePDF(school, s)}          className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-3 active:scale-95 transition-transform"
          style={{ background: "linear-gradient(135deg,#25d366,#128c7e)", boxShadow: "0 4px 16px rgba(37,211,102,0.3)" }}>
          <WhatsAppIcon /> Pataje Rapò PDF sou WhatsApp
        </button>
      </div>
    </div>
  );
}

// ─── PARTNER ──────────────────────────────────────────────────────────────────
function PartnerScreen({ onBack }) {
  // ─── SVG ICONS (Components) ──────────────────────────────────────────────
  const SchoolIcon = () => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#fbbf24" }}>
      <path d="M3 21h18M5 21v-7l8-4 8 4v7M9 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
      <path d="M10 21v-2h4v2" />
    </svg>
  );

  const KeyIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#22c55e" }}>
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="m21 2-9.6 9.6" />
      <path d="m15.5 7.5 3 3L22 7l-3-3" />
    </svg>
  );

  const SlidersIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#3b82f6" }}>
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );

  const UsersIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#3b82f6" }}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );

  const BookOpenIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#ef4444" }}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );

  const TrophyIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#fbbf24" }}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );

  const ShieldLockIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#eab308" }}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
      <path d="M12 15v-2" />
    </svg>
  );

  const WhatsAppIcon = () => (
    <svg 
