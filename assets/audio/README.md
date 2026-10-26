# Gravações da voz do Pingo

As gravações naturais ainda não foram geradas. Até lá, o site usa a síntese disponível no aparelho.

Direção de voz: masculina jovem adulta, português brasileiro, próxima e gentil, com um leve sorriso e timidez. Ritmo conversado, pausas curtas, sem voz infantil ou tom de locutor. Manter a mesma voz em todos os arquivos.

`lines.json` contém as frases exatas e os nomes previstos dos MP3. Gere um arquivo por entrada. Depois de salvar os arquivos nesta pasta, preencha `recordings.js` com as entradas disponíveis:

```js
window.PINGO_RECORDINGS = {
  welcome: {
    text: 'texto exato da entrada welcome em lines.json',
    src: 'assets/audio/welcome.mp3'
  }
};
```

Copie o texto exato de `lines.json`, incluindo pontuação. O player escolhe a gravação pelo texto e aceita uma migração gradual. Não adicione entradas de arquivos que ainda não existem. Falas sem MP3 e falhas de reprodução usam a síntese do navegador, quando disponível. Se o navegador bloquear o áudio, a interface permite reativar a voz com um toque.

Os áudios ficam locais e nenhuma chave de API é incluída no site. Para gerar as gravações nesta conversa, é necessário conectar uma integração de geração de voz, como Runway.
