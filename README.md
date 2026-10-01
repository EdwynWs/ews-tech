# EWS TECH — Experiência imersiva

Redesign do portfólio da EWS TECH, com a linguagem de movimento da nova referência adaptada à marca: azul, tipografia ampla, escultura original em 3D, projetos reais e contato direto. Esta entrega não contém vídeo.

O site está pronto em **HTML, CSS e JavaScript**, com as fontes, imagens e a biblioteca 3D hospedadas localmente. **Não precisa instalar dependências ou executar build para publicar.** Abra `index.html` ou use um servidor estático/Live Server para conferir.

## Experiência

- Entrada curta com o logotipo e transição de tela. Ela não bloqueia o acesso ao conteúdo.
- Escultura metálica original em Three.js, com rotação, resposta ao ponteiro e transformação ligada ao scroll. O render pausa fora da área visível e em abas em segundo plano.
- Títulos com revelação, deslocamento e desfoque; texto que se ilumina palavra por palavra.
- Quatro cenas de serviços em uma seção fixa no desktop, com mockups em perspectiva e revelação por máscara.
- Um círculo azul se expande e ocupa a tela, acompanhado pela transformação do símbolo EWS.
- Galeria horizontal dos quatro projetos, guiada pela rolagem no desktop. No celular, deslize ou use as setas.
- Detalhes de cada projeto em um modal com descrição, tecnologias e link para o site.
- Menu em tela cheia, cursor contextual, rastro discreto do ponteiro, botões com deslocamento suave e faixa tipográfica em movimento.
- Tipografia animada no rodapé e música instrumental retrô opcional, desligada por padrão.
- WhatsApp ao lado do Instagram.

A referência orienta os tipos de movimento; o código, a escultura e os elementos gráficos desta versão foram construídos para a EWS. Modelos, textos e arquivos do site de referência não foram incorporados.

## Celular, teclado e movimento reduzido

No celular, a escultura tem uma área própria acima do título. A câmera enquadra toda a peça durante a rotação, sem sobrepor as letras. O enquadramento do desktop permanece igual. Todos os cartões de projetos usam o mesmo fundo azul da EWS.

A rolagem é nativa: não interceptamos a roda do mouse nem os gestos de toque. As cenas fixas e a galeria guiada por scroll funcionam a partir de 900 px de largura e 760 px de altura. Em telas menores ou baixas, os serviços ficam em sequência; os projetos usam uma galeria por toque no celular ou uma grade em desktops baixos.

Os menus e detalhes usam diálogos nativos, com fechamento por Escape e retorno do foco. Os projetos podem ser percorridos pelo teclado. Ao ativar **reduzir movimento** no sistema, o conteúdo fica disponível sem as animações de rolagem e sem rotação contínua do 3D.

Se WebGL não estiver disponível, a imagem local `assets/hero.webp` mantém a abertura visual. Sem JavaScript, os serviços, projetos, navegação e contatos permanecem acessíveis. As descrições expandidas dependem de JavaScript; os links diretos dos projetos continuam funcionando.

## Estrutura

| Arquivo                                    | Função                                                |
| ------------------------------------------ | ----------------------------------------------------- |
| `index.html`                               | Conteúdo, projetos, templates dos detalhes e contatos |
| `style.css`                                | Identidade visual, layouts e animações                |
| `script.js`                                | Scroll, menu, galeria, diálogos e som opcional        |
| `scene.js`                                 | Escultura 3D pronta para uso, incluindo Three.js      |
| `source/scene.mjs`                         | Código editável da escultura                          |
| `source/build.mjs` e `source/package.json` | Build opcional, apenas ao alterar o 3D                |
| `assets/fonts/`                            | Barlow Condensed e Manrope locais                     |
| `assets/projects/`                         | Imagens dos quatro projetos                           |
| `assets/hero.webp`                         | Arte de abertura usada quando não há WebGL            |
| `THIRD-PARTY-NOTICES.txt`                  | Licenças de Three.js e das fontes                     |

Para alterar textos, cores, contatos e animações de scroll, edite os três arquivos principais. O build só é necessário ao editar `source/scene.mjs`:

```sh
npm --prefix source install
npm --prefix source run build
```

Não publique a pasta `source/node_modules`. O arquivo `scene.js` resultante já inclui o necessário para o navegador.

## Música

A faixa é **Twilight Echo**, de **Scott Buckley**, um instrumental de clima retrô. O crédito está no rodapé, com links para o autor e a licença CC BY 4.0.

- Fonte: https://www.scottbuckley.com.au/library/twilight-echo/
- Licença: https://creativecommons.org/licenses/by/4.0/
- Arquivo: `assets/audio/twilight-echo.mp3`, convertido para MP3 de 96 kbps, sem cortes.
- A música só carrega e toca quando o visitante ativa o botão. O volume entra gradualmente e pode ser desligado. Abas em segundo plano pausam a reprodução.

Para substituir a faixa, atualize o `src` do elemento `#background-music` em `index.html`, os créditos no rodapé e as informações em `THIRD-PARTY-NOTICES.txt`.

## Contatos e projetos

WhatsApp: **(14) 99827-7583**, usando `https://wa.me/5514998277583` com mensagem pronta. Para alterar, substitua as duas ocorrências do número em `index.html`.

Instagram: `https://www.instagram.com/ews_tec/`, preservado do site anterior.

Os quatro projetos mantêm suas imagens, descrições, tecnologias e URLs:

1. Sistema de Manuais — https://projeto-jc-gamma.vercel.app/
2. TF Soluções Avícolas — https://tf-solucoes-avicolas.vercel.app/
3. Feito a Mão — https://feito-a-mao-one.vercel.app/
4. Barbershop Du Cortes — https://barbershop-du-cortes.vercel.app/

Cada `article.project-card` corresponde a um `template` com o mesmo índice: `data-project="0"`, `data-details="0"` e `project-template-0`. Para adicionar trabalhos, duplique esse conjunto e atualize IDs, imagens, textos, links e as contagens visíveis. A galeria calcula a movimentação pelo número de cartões.

## Aplicar ao repositório

1. Na pasta local de `EdwynWs/ews-tech`, execute `git pull`.
2. Copie o conteúdo da pasta `ews-tech` deste ZIP para a raiz do projeto, substituindo os arquivos correspondentes.
3. Confira o site no navegador.
4. Envie os arquivos:

```sh
git add index.html style.css script.js scene.js source favicon.svg assets README.md THIRD-PARTY-NOTICES.txt
git commit -m "Ajusta escultura mobile, padroniza projetos e troca trilha sonora"
git push
```

Se o Vercel estiver conectado à branch atualizada, o push iniciará o deploy. O projeto segue estático e não precisa de comando de build. A pasta `source` existe somente para manutenção do 3D.

## Validação

Conferido em Chromium nos tamanhos 1440×1000, 1366×768, 900×700, 768×1024, 390×844 e 320×740. Foram verificados carregamento dos recursos, limites da tela, navegação, galeria, detalhes dos projetos, contatos, teclado, mudança de tamanho e modos sem JavaScript, sem WebGL e com movimento reduzido.

O desempenho do 3D depende do aparelho e do navegador. Os testes locais não substituem uma medição no site publicado e em dispositivos físicos.

Esta entrega atualiza os arquivos. **Nenhum push ou deploy remoto foi realizado.**
