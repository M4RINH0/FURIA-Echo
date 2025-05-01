// src/services/ChatServices.js
const URL_BASE = 'http://localhost:8000/api/chat';

// ──────── Ecos fixos ─────────────────────────────────────────────────
export const ECHOS = [
  { id: 'furia',   name: 'FURIA',    avatar: '/src/assets/avatars/furia.jpg'   },
  { id: 'fallen',  name: 'FalleN',   avatar: '/src/assets/avatars/fallen.jpg'  },
  { id: 'ksc',     name: 'KSCERATO', avatar: '/src/assets/avatars/kscerato.jpg'},
  { id: 'yuurih',  name: 'yuurih',   avatar: '/src/assets/avatars/yuurih.jpg'  },
  { id: 'sidde',   name: 'sidde',    avatar: '/src/assets/avatars/sidde.jpg'   },
];

// ──────── REST auxiliares (histórico salvo em Django) ───────────────
export async function fetchMessages(ecoId) {
  const r = await fetch(`${URL_BASE}/${ecoId}/messages`);
  if (!r.ok) return [];           // primeira vez: vazio
  return r.json();
}

// ──────── Enviar mensagem (rota interna + IA externa) ───────────────
export async function sendMessage(ecoId, text) {
  // 1) salva no histórico local do back (para manter consistência)
  await fetch(`${URL_BASE}/${ecoId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: text, from_user: true }),
  });

  // 2) gera resposta
  if (ecoId === 'furia') {
    // ---- usa seu endpoint Django que consulta HLTV ----
    const r = await fetch(`${URL_BASE}/furia/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: text }),
    });
    const { reply, avatar } = await r.json();
    return { reply, avatar };
  }

  // ---- jogadores ► HuggingFace Inference API (modelo free) ----
  const HF_TOKEN = import.meta.env.VITE_HF_TOKEN;          // coloque no .env
  const systemPrompt = `Você é ${ecoId} (pro-player da FURIA). \
Responda em português, tom descontraído, sem exceder 2 frases.`;

  const r = await fetch('https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `<s>[INST] ${systemPrompt}\nUsuário: ${text} [/INST]`,
        parameters: { max_new_tokens: 80, temperature: 0.8 },
      }),
    });

  const data = await r.json();
  const replyTxt = Array.isArray(data) ? data[0]?.generated_text?.split('[/INST]')[1] : '...';

  return { reply: replyTxt?.trim() ?? '(sem resposta)', avatar: ECHOS.find(e => e.id === ecoId).avatar };
}
