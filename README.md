# EWS TECH — Experiência de scroll

Site completo em HTML, CSS e JavaScript puro. Sem instalação, build, bibliotecas de animação ou serviços externos obrigatórios. Abra `index.html` no navegador ou use o Live Server do VS Code.

## O que mudou

- Nova direção visual com tipografia grande, tons escuros, azul elétrico e uma seção clara sobre a EWS.
- Abertura com profundidade: a escultura acompanha o ponteiro e se transforma com a rolagem.
- Texto que se ilumina palavra por palavra, com transição gradual do fundo para azul.
- Galeria com os quatro projetos originais: cartões que se sobrepõem e recuam durante a rolagem em computadores com altura suficiente.
- Faixa tipográfica que se desloca com o scroll, entradas de conteúdo e cursor contextual nos previews.
- WhatsApp ao lado do Instagram, usando o número confirmado: **(14) 99827-7583**.
- Menu mobile, acesso por teclado e adaptação automática para `prefers-reduced-motion`.

A rolagem continua sendo a nativa do navegador. Os efeitos não interceptam a roda do mouse nem os gestos de toque. Em telas pequenas ou baixas, os projetos voltam à sequência vertical para manter todo o conteúdo acessível. Sem JavaScript, os conteúdos e links continuam disponíveis.

## Arquivos

- `index.html`: seções, projetos e contatos.
- `style.css`: layout, cores, efeitos e responsividade.
- `script.js`: menu e animações ligadas à rolagem.
- `favicon.svg`: ícone da marca.
- `assets/hero.webp`: escultura azul otimizada.
- `assets/projects/`: imagens dos quatro projetos.

As fontes são do sistema. As imagens são locais, em WebP. Não há dependência de CDN para carregar o site ou executar os efeitos.

## Contatos

O botão do WhatsApp abre `https://wa.me/5514998277583` com uma mensagem pronta. Para trocar o número, pesquise `5514998277583` em `index.html` e altere as duas ocorrências.

O Instagram preserva o destino do site anterior: `https://www.instagram.com/ews_tec/`.

## Projetos

Os quatro projetos publicados preservam suas URLs, descrições, imagens e tecnologias. Para adicionar outro, duplique um `article.work-card` e ajuste o ID, `aria-labelledby`, título, descrição, tecnologias, os dois links e a imagem. Ajuste também a contagem de projetos no cabeçalho e nos cartões.

## Aplicar ao seu projeto

1. Na pasta local de `EdwynWs/ews-tech`, execute `git pull` para obter a versão mais recente.
2. Copie o conteúdo da pasta `ews-tech` deste ZIP para a raiz do projeto, substituindo os arquivos com o mesmo nome.
3. Abra `index.html` para conferir a nova versão.
4. Execute:

```sh
git add index.html style.css script.js favicon.svg assets README.md
git commit -m "Redesenha EWS TECH com efeitos de scroll e contato por WhatsApp"
git push
```

Se o Vercel estiver conectado à branch atualizada, o push iniciará um deploy. Não é necessário instalar dependências ou configurar um comando de build. Os antigos `projects.css` e `hero.png` deixam de ser usados; mantê-los na pasta não interfere na nova versão.

## Validação realizada

- Chromium: 1440×1000, 1366×768, 900×700, 768×1024, 390×844 e 320×740.
- Sem rolagem horizontal nos tamanhos verificados.
- Menu mobile abre, navega e fecha corretamente.
- Todas as imagens carregam; WhatsApp e Instagram permanecem dentro da tela.
- Nenhum erro de execução de JavaScript nos testes.
- Conteúdo disponível sem JavaScript e com movimento reduzido.
- Verificação de sintaxe de JavaScript e de diferenças do Git.

Esta entrega contém os arquivos prontos. Nenhum deploy ou commit remoto foi realizado nesta conversa.
