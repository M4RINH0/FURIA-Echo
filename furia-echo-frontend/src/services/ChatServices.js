/*  Avatares locais  ----------------------------------------------------- */
import furiaAvatar   from "../assets/avatars/furia.jpg";
import fallenAvatar  from "../assets/avatars/fallen.jpg";
import kscAvatar     from "../assets/avatars/kscerato.jpg";
import yuurihAvatar  from "../assets/avatars/yuurih.jpg";
import siddeAvatar   from "../assets/avatars/sidde.jpg";

/*  Conversas fixas da UI  ---------------------------------------------- */
export const ECHOS = [
  { id: "furia",  name: "FURIA",     avatar: furiaAvatar  },
  { id: "fallen", name: "FalleN",    avatar: fallenAvatar },
  { id: "ksc",    name: "KSCERATO",  avatar: kscAvatar    },
  { id: "yuurih", name: "yuurih",    avatar: yuurihAvatar },
  { id: "sidde",  name: "sidde",     avatar: siddeAvatar  },
];

/*  rota base do backend Django  ---------------------------------------- */
const API_BASE = "/api/chat";

/*  (1) histórico – deixamos vazio por enquanto  ------------------------ */
export async function fetchMessages(/*ecoId*/) {
  return [];         // se depois quiser guardar histórico, implemente aqui
}

/*  (2) FURIA (menu 1-4)  ------------------------------------------------ */
export async function sendFuriaMessage(text) {
  const r = await fetch(`${API_BASE}/furia/`, {
    method : "POST",
    headers: { "Content-Type": "application/json" },
    body   : JSON.stringify({ message: text }),
  });
  if (!r.ok) throw new Error("Falha na API FURIA");

  const data = await r.json();                // { reply: "..." }
  return {
    id     : Date.now(),
    sender : "FURIA",
    content: data.reply,
    isUser : false,
    avatar : furiaAvatar,
  };
}

/*  (3) Demais jogadores – backend resolve via OpenRouter  -------------- */
export async function sendMessage(playerId, text) {
  const echo = ECHOS.find(e => e.id === playerId);

  /* --- chamada ao endpoint --- */
  const r = await fetch(`/api/chat/player/${playerId}/`, {
    method : "POST",
    headers: { "Content-Type": "application/json" },
    body   : JSON.stringify({ message: text }),
  });

  
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

  const data = await r.json();            

  return {
    id     : Date.now(),
    sender : echo?.name ?? "Eco",
    content: data.reply,
    isUser : false,
    avatar : echo?.avatar,
  };
}


export async function resetChat(ecoId) {
  if (ecoId === 'furia') return;

  await fetch(`/api/chat/player/${ecoId}/`, {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify({ reset: true }),
  });
}

