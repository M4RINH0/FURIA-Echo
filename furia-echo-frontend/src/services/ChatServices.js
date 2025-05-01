/*  Avatares locais  ----------------------------------------------------- */
import furiaAvatar   from "../assets/avatars/furia.jpg";
import fallenAvatar  from "../assets/avatars/fallen.jpg";
import kscAvatar     from "../assets/avatars/kscerato.jpg";
import yuurihAvatar  from "../assets/avatars/yuurih.jpg";
import siddeAvatar   from "../assets/avatars/sidde.jpg";

/*  Conversas fixas da UI  ------------------------------------------------ */
export const ECHOS = [
  { id: "furia",  name: "FURIA",     avatar: furiaAvatar  },
  { id: "fallen", name: "FalleN",    avatar: fallenAvatar },
  { id: "ksc",    name: "KSCERATO",  avatar: kscAvatar    },
  { id: "yuurih", name: "yuurih",    avatar: yuurihAvatar },
  { id: "sidde",  name: "sidde",     avatar: siddeAvatar  },
];

/*  Rota base para o backend Django  ------------------------------------- */
const API_BASE = import.meta.env.VITE_API_BASE ?? "/api";

/* ─────────────────────────────────────────────────────────────────────────
   1.  Histórico local  – ainda não usamos
   ────────────────────────────────────────────────────────────────────────*/
export async function fetchMessages(/*ecoId*/) {
  return [];
}

/* ─────────────────────────────────────────────────────────────────────────
   2.  FURIA (menu 1-4)
   ────────────────────────────────────────────────────────────────────────*/
export async function sendFuriaMessage(text) {
  const r = await fetch(`${API_BASE}/chat/furia/`, {
    method : "POST",
    headers: { "Content-Type": "application/json" },
    body   : JSON.stringify({ message: text }),
  });
  if (!r.ok) throw new Error(await r.text());

  const { reply } = await r.json();
  return {
    id     : Date.now(),
    sender : "FURIA",
    content: reply,
    isUser : false,
    avatar : furiaAvatar,
  };
}

/* ─────────────────────────────────────────────────────────────────────────
   3.  Jogadores  – quem conversa é o backend (OpenRouter)
   ────────────────────────────────────────────────────────────────────────*/
export async function sendMessage(playerId, text) {
  const echo = ECHOS.find(e => e.id === playerId);

  const r = await fetch(`${API_BASE}/chat/player/${playerId}/`, {
    method : "POST",
    headers: { "Content-Type": "application/json" },
    body   : JSON.stringify({ message: text }),
  });

  /* fallback em caso de erro HTTP -------------------------------------- */
  if (!r.ok) {
    console.error(await r.text());
    return {
      id     : Date.now(),
      sender : echo?.name ?? "Eco",
      content: "(erro ao falar com o backend 😢)",
      isUser : false,
      avatar : echo?.avatar,
    };
  }

  const { reply } = await r.json();
  return {
    id     : Date.now(),
    sender : echo?.name ?? "Eco",
    content: reply,
    isUser : false,
    avatar : echo?.avatar,
  };
}

/* ─────────────────────────────────────────────────────────────────────────
   4.  Resetar conversa (opção do menu “⋯”)
   ────────────────────────────────────────────────────────────────────────*/
export async function resetChat(ecoId) {
  if (ecoId === "furia") return;      // FURIA não guarda contexto

  await fetch(`${API_BASE}/chat/player/${ecoId}/`, {
    method : "POST",
    headers: { "Content-Type": "application/json" },
    body   : JSON.stringify({ reset: true }),
  });
}
