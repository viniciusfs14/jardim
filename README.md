# Tem um girassol te esperando 🌻

Um jardim interativo feito com HTML, CSS e JavaScript puro, sem instalação ou etapa de build.

## Abrir

Abra `index.html` no navegador. Os caminhos são relativos e também funcionam em hospedagem estática. As fontes do Google são opcionais: sem conexão, o site usa as fontes alternativas do dispositivo.

## A experiência

- Quatro carinhos, em qualquer ordem: chuva, sol, borboleta e bilhete.
- O girassol cresce a cada nova ação e floresce ao completar as quatro.
- Cada carinho revela uma mensagem; repetir uma ação permite reler o bilhete sem duplicar o progresso.
- Ao florescer, uma mensagem final e um segredo ficam disponíveis.
- O botão de recomeçar limpa o progresso e os efeitos, inclusive mensagens pendentes.

## Personalizar

- `script.js`: textos e ícones no objeto `MESSAGES`.
- `index.html`: convite, mensagem final, assinatura e segredo.
- `style.css`: cores, cenário, responsividade e animações.

O progresso existe apenas durante a visita; recarregar a página começa um novo jardim.

## Acessibilidade

Inclui navegação por teclado, link para pular ao conteúdo, foco nas mudanças de seção, progresso com descrição acessível, estado dos botões e anúncio das mensagens de status. O modal mantém o foco dentro dele, bloqueia o conteúdo de fundo e fecha com Escape. O site respeita a preferência de reduzir movimento.

## Publicar

Envie `index.html`, `style.css`, `script.js`, `pingo.js` e a pasta `assets/` para uma hospedagem estática. Para usar GitHub Pages, configure a publicação da pasta raiz da branch que contém esses arquivos.

## Verificação

A lógica foi verificada em DOM simulado: sequência das quatro ações, repetição sem progresso duplicado, abertura e fechamento do modal, ciclo de foco com Tab, Escape, mensagem final, segredo, retorno e reinício com cancelamento de mensagem pendente. Isso não substitui a conferência visual em um navegador real.

Para conferir antes de compartilhar:

1. Abra o site no computador e em uma tela estreita de celular.
2. Experimente as quatro ações em ordens diferentes.
3. Use Tab, Shift+Tab, Enter e Escape para navegar.
4. Ative a preferência de reduzir movimento no dispositivo.
5. Recomece o jardim durante uma animação e depois da mensagem final.

## Privacidade

Sem rastreamento, cookies ou armazenamento de respostas. O carregamento das fontes faz uma requisição ao Google Fonts. O conteúdo publicado pode ser visto por quem tiver acesso ao site; personalize as mensagens considerando isso.

## Ilustrações SVG

O cenário, as ferramentas, os bilhetes, a mensagem final e o favicon usam SVGs locais da coleção Twemoji, sob CC BY 4.0. Créditos, arquivos de origem e licença em [assets/icons/ATTRIBUTION.md](assets/icons/ATTRIBUTION.md). Inclua a pasta assets ao compartilhar ou publicar o projeto.


## Novos detalhes da experiência

O portão se abre antes de revelar o jardim. Água, sol e borboleta mostram suas mensagens na própria página, enquanto o bilhetinho é apresentado em um envelope interativo. O girassol reage a cada carinho; ao completar os quatro, pequenas flores surgem no cenário. A flor rosa esconde uma mensagem extra, acessível por clique ou teclado, sem interferir no progresso.

O botão de som começa desligado. Ao ativá-lo, o navegador sintetiza uma brisa suave, pequenos cantos de pássaros e notas nos momentos especiais. Nenhum arquivo de áudio é baixado. O áudio pausa quando a aba fica oculta e pode ser desligado a qualquer momento. Navegadores sem suporte continuam oferecendo toda a experiência visual.

A entrada, o envelope e as revelações respeitam a preferência de reduzir movimento. As mensagens pessoais existentes foram preservadas; o texto do segredo da flor pode ser editado em `index.html`, no elemento `flowerSecret`.

As novas interações foram verificadas em DOM e áudio simulados, incluindo teclado, reinício durante a entrada, fechamento da carta durante sua abertura, movimento reduzido e ativação/desativação rápida do som. A aparência e o volume ainda precisam ser conferidos em navegador real.

## Pingo, o girassol que conversa

O Pingo se apresenta ao entrar e tem frases para água, sol, borboleta, bilhete e florescimento. Clique nele ou use Tab e Enter para descobrir outras falas. O balão permanece visível acima do cenário e o bilhete também exibe a fala do Pingo durante sua entrega.

As frases ficam no objeto `PINGO_LINES` de `pingo.js`. O botão **ouvir o Pingo** lê a frase atual; durante a leitura, ele permite parar. A voz começa desligada e nenhuma frase é lida automaticamente. A voz do Pingo e os sons ambientes têm controles independentes.

A leitura usa a síntese de voz do navegador, preferindo uma voz local em português brasileiro, depois outra voz em português. Sem uma voz correspondente, solicita pt-BR ao sintetizador padrão. A disponibilidade e o resultado dependem do aparelho. Não há gravação de microfone. O navegador pode usar serviços de voz do sistema ou de rede; o projeto não envia os textos para uma API própria. Documentação: https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis

Trocar a frase, sair do jardim, recomeçar ou ocultar a aba interrompe a leitura atual. Sem suporte ou em caso de falha, as falas continuam disponíveis por escrito. A boca do Pingo acompanha a leitura, respeitando a preferência de reduzir movimento.

Testes em DOM e voz simulados cobriram as falas, teclado por botão nativo, progresso, reinício, suporte ausente, seleção de voz pt-BR, interrupção, troca rápida de frases, eventos antigos de síntese e erros de voz. Ainda é necessário ouvir e conferir o resultado em navegador real.

## A surpresa da Sara

A chegada e as falas do Pingo foram personalizadas para Sara. A flor rosa guarda a lembrança do primeiro girassol interativo, baseada na história que já constava na carta original, sem acrescentar datas ou acontecimentos.

O progresso aquece a luz do cenário; ao receber os quatro carinhos, surgem flores e uma segunda borboleta. O botão final leva à despedida do Pingo, onde Sara pode ouvir o recado, voltar ao jardim ou abrir sua carta. A carta tem acabamento de papel e assinatura em destaque.

Ao final, Sara pode visualizar e baixar `assets/sara-pingo.svg`, um cartão vetorial independente com o Pingo e o nome dela. O desenho do cartão foi criado para este projeto e não precisa de fontes, imagens ou serviços externos. Em navegadores que abrirem o arquivo em vez de baixá-lo, use a opção de salvar. A pasta `assets/` deve ser publicada junto com o site.

Verificação: o percurso completo foi executado em DOM simulado, com e sem movimento reduzido, incluindo despedida, retorno, carta e reinício. O cartão passou pela validação XML e pela conferência de ausência de dependências externas. A renderização final no celular e a reprodução da voz ainda precisam ser conferidas em navegador real.

## Carta, PNG e conversa automática

A carta para Sara foi reescrita com um tom mais romântico. O cartão exibido e baixado agora é `assets/sara-pingo.png`, em 1440 × 1920 pixels, pronto para salvar como imagem no celular. O SVG original permanece como fonte alternativa; o PNG foi renderizado e conferido visualmente. `tools/render-card.ps1` recria a versão raster no Windows com System.Drawing.

O Pingo agora fala automaticamente ao entrar no jardim e a cada interação, quando a síntese estiver disponível. O clique de entrada inicia a experiência; os controles permitem silenciar e reativar a voz. Alguns navegadores podem bloquear a fala automática: nesse caso, o site explica como ativá-la com um toque. As respostas variam ao repetir carinhos e clicar no personagem, sem duplicar o progresso. A opção de silenciar é mantida durante a visita, inclusive ao recomeçar. Não há falas iniciadas antes de entrar.

As frases foram encurtadas e pontuadas para soar mais conversadas, mas a voz ainda usa o sintetizador do aparelho. Isso não equivale a áudio gerado por um serviço de voz natural. Sem suporte, o Pingo continua conversando por escrito. Testes simulados cobriram fala automática, variação de respostas, silenciar/reativar, eventos antigos, bilhete, despedida, carta e reinício. A reprodução real da voz ainda precisa ser ouvida no navegador do celular.

## Ritmo, gravações e compartilhamento

O Pingo termina uma fala antes de iniciar a próxima. Até quatro próximas falas são guardadas; ao ultrapassar esse limite, a última é substituída para evitar uma fila longa. Os botões de pular fala interrompem a atual e seguem para a próxima. Navegar, silenciar, recomeçar ou ocultar a aba limpa a fila. Um prazo de segurança evita travamento quando o aparelho não envia os eventos de fim da voz.

As mensagens extras dos carinhos agora ficam em detalhes recolhidos. O balão é o foco da conversa. O girassol acompanha a borboleta com os olhos, fecha os olhos ao receber água e reage ao toque. As animações respeitam movimento reduzido.

`assets/audio/recordings.js` permite cadastrar gravações naturais, preferidas em relação à síntese. Ele começa vazio: nenhum MP3 é solicitado até haver gravações reais cadastradas. `assets/audio/lines.json` prepara as 19 falas e os nomes de arquivos; a direção de voz e instruções estão em `assets/audio/README.md`. A integração de geração de voz Runway foi localizada, mas ainda precisa ser conectada para gerar os arquivos. A voz natural permanece pendente.

O botão de compartilhar o PNG aparece apenas quando o aparelho permite compartilhar arquivos e o arquivo foi preparado. O compartilhamento só ocorre ao tocar no botão e escolher o destino. Sem suporte, o download e a imagem para salvar continuam disponíveis. A funcionalidade exige um contexto seguro e depende do navegador: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share

A carta final e o segredo foram comparados ao conteúdo anterior e permanecem idênticos. Testes em DOM, áudio e compartilhamento simulados cobriram fila, interrupção, ordem, eventos antigos, gravações, falhas, reinício e compartilhamento. O teste visual em celular real continua pendente porque não havia navegador conectado na sessão.

## Redesign botânico

O site ganhou uma composição nova em tons de papel, verde sálvia e dourado, com tipografia Cormorant Garamond e DM Sans, uma capa ilustrada em `assets/garden-vignette.svg` e um jardim em duas colunas no computador. No celular, cenário e conversa se organizam em sequência. A folha `style.css` foi reescrita para substituir as regras acumuladas dos ciclos anteriores.

A carta, assinatura e segredo foram preservados exatamente. As interações, o áudio opcional, a fila de falas, o cartão PNG, o compartilhamento, o envelope e o reinício continuam disponíveis.

A verificação do redesign foi feita em Chrome real com larguras de 1440, 900, 390 e 320 pixels (as duas menores simulam telas de celular). Foram conferidos: ausência de rolagem horizontal, alvos de toque, quatro carinhos, flor secreta, envelope, Tab/Shift+Tab/Escape, carta, cartão carregado e reinício. Não houve erros de JavaScript. O modo de movimento reduzido foi exercitado em 320 pixels. As prévias estão em `artifacts/redesign/`.

Para repetir a verificação, tenha Node.js e Playwright disponíveis e execute `node tools/verify-design.cjs`. O teste usa o Chrome instalado no caminho padrão do Windows; defina `SARA_BROWSER` para outro executável. O servidor HTTP temporário é aberto apenas durante o teste e encerrado ao final. A verificação não gera falas naturais nem substitui ouvir o áudio num celular real.
