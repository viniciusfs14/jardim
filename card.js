'use strict';

// Prepara o arquivo antes do clique: o compartilhamento precisa do gesto da pessoa.
(() => {
  const button = document.getElementById('shareCard');
  const status = document.getElementById('shareStatus');
  let cardFile = null;
  if (!window.isSecureContext || !navigator.share || !navigator.canShare || !window.File) return;

  fetch('assets/sara-pingo.png')
    .then(response => {
      if (!response.ok) throw new Error('Cartão indisponível');
      return response.blob();
    })
    .then(blob => {
      cardFile = new File([blob], 'um-girassol-para-Sara.png', { type: 'image/png' });
      if (navigator.canShare({ files: [cardFile] })) button.classList.remove('hidden');
    })
    .catch(() => { /* O link de baixar e a prévia continuam disponíveis. */ });

  button.addEventListener('click', async () => {
    if (!cardFile || button.disabled) return;
    button.disabled = true;
    status.textContent = '';
    try {
      await navigator.share({ files: [cardFile], title: 'Um girassol para Sara' });
      status.textContent = 'Seu cartão foi entregue ao compartilhamento do aparelho. ♡';
    } catch (error) {
      if (error.name !== 'AbortError') status.textContent = 'Não foi possível compartilhar agora. Você pode usar “guardar meu cartão” ou salvar a imagem.';
    } finally { button.disabled = false; }
  });
})();
