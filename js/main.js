const chat = document.getElementById('chat');
const input = document.getElementById('input');

const DB_URL = "https://chatxbox-pro-default-rtdb.firebaseio.com/games.json";

async function fetchGame(query) {
  try {
    const res = await fetch(DB_URL);
    const data = await res.json();
    const jogos = Object.values(data);
    return jogos.find(j => 
      j.name?.toLowerCase().includes(query) ||
      j.tags?.includes(query)
    ) || { name: query, tip: "Use NAT Aberta + cabo Ethernet", youtube: "xbox suporte" };
  } catch {
    return { name: query, tip: "Erro de rede. Tente novamente.", youtube: "xbox dica" };
  }
}

async function send() {
  const q = input.value.trim();
  if (!q) return;

  addMsg(q, 'user');
  input.value = '';
  addMsg('IA está analisando...', 'ai');

  // 1. PUXA DADOS DO DATABASE PRÓPRIO
  const game = await fetchGame(q.toLowerCase());

  // 2. IA REAL (Puter.js - SEM TOKEN)
  const resposta = await puter.ai.chat(`
    Pergunta: ${q}
    Jogo: ${game.name}
    Dica: ${game.tip || 'Reinicie o Xbox'}
    Update 2025: ${game.update || 'Versão mais recente'}
    Responda em português com:
    - Dica prática
    - Solução de erro
    - Link YouTube
  `);

  // Remove "pensando"
  chat.lastChild.remove();

  // RESPOSTA FINAL COM LINK
  const final = `
    <b>${game.name.toUpperCase()}</b><br>
    ${resposta.content}<br><br>
    <a href="https://youtube.com/results?search_query=${q}+xbox+2025" target="_blank" style="color:#107C10; font-weight:bold;">
      TUTORIAL NO YOUTUBE
    </a>
  `;
  addMsg(final, 'ai');
}

function addMsg(text, type) {
  const div = document.createElement('div');
  div.className = `msg ${type}`;
  div.innerHTML = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

// MENSAGEM INICIAL
setTimeout(() => {
  addMsg("Olá! Pergunte sobre qualquer jogo de 2000 até 2025!<br>Ex: 'Lag no Fortnite?'", 'ai');
}, 1500);

// ENTER ENVIA
input.addEventListener('keypress', e => {
  if (e.key === 'Enter') send();
});