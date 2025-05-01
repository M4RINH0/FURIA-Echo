import furiaAvatar from "../assets/avatars/furia.jpg";
import fallenAvatar from "../assets/avatars/fallen.jpg";
import kscAvatar from "../assets/avatars/kscerato.jpg";
import yuurihAvatar from "../assets/avatars/yuurih.jpg";
import siddeAvatar from "../assets/avatars/sidde.jpg";
/* ──────────────────────────────────────────────────────────────────
   1.  ECOs fixos (imagem por caminho relativo)
   ────────────────────────────────────────────────────────────────── */
export const ECHOS = [
  { id: "furia", name: "FURIA", avatar: furiaAvatar },
  { id: "fallen", name: "FalleN", avatar: fallenAvatar },
  { id: "ksc", name: "KSCERATO", avatar: kscAvatar },
  { id: "yuurih", name: "yuurih", avatar: yuurihAvatar },
  { id: "sidde", name: "sidde", avatar: siddeAvatar },
];
/* rota base para o seu Django */
const API_BASE = "/api/chat";

/* ──────────────────────────────────────────────────────────────────
     2.  Histórico local / mock
     ────────────────────────────────────────────────────────────────── */
// eslint-disable-next-line no-unused-vars
export async function fetchMessages(ecoId) {
  // Por enquanto retorna vazio (exceto se você quiser mock local)
  return [];
}

/* ──────────────────────────────────────────────────────────────────
     3.  Eco FURIA — endpoint Django já criado
     ────────────────────────────────────────────────────────────────── */
export async function sendFuriaMessage(text) {
  const res = await fetch(`${API_BASE}/furia/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text }),
  });
  if (!res.ok) throw new Error("Erro na API FURIA");

  const data = await res.json(); // {reply: "..."}
  return {
    id: Date.now(),
    sender: "FURIA",
    content: data.reply,
    isUser: false,
    avatar: ECHOS.find(e => e.id === "furia").avatar,
  };
}

/* ──────────────────────────────────────────────────────────────────
     4.  Outros ecos – placeholder simples
     ────────────────────────────────────────────────────────────────── */
export async function sendMessage(ecoId, text) {
  // “Eco” que apenas devolve o tamanho da mensagem
  return {
    id: Date.now(),
    sender: ECHOS.find((e) => e.id === ecoId)?.name ?? "Eco",
    content: `(recebi ${text.length} caracteres)`,
    isUser: false,
  };
}
