# EWS TECH — Código-fonte completo

Site estático em HTML, CSS e JavaScript puro. Não precisa de Node.js, npm ou compilação.

## Abrir e editar

1. Extraia o ZIP.
2. Abra a pasta ews-tech no VS Code.
3. Abra index.html no navegador, ou use a extensão Live Server no VS Code.
4. Edite os arquivos e atualize o navegador para ver as alterações.

## Arquivos

- index.html: conteúdo, seções, navegação, links de contato e favicon embutido.
- style.css: cores, fontes, layout, responsividade e animações.
- projects.css: apresentação dos projetos, previews e adaptação para celular.
- assets/projects/: imagens dos projetos em WebP, carregadas sob demanda.
- script.js: menu mobile, animações ao rolar, efeito de movimento, detalhes expansíveis e barra de progresso.
- hero.png: imagem principal.

## Ajustes comuns

- Textos e Instagram: index.html. Busque por ews_tech para alterar os links de contato.
- Cores: variáveis em :root no início de style.css.
- Layout mobile: regras @media no final de style.css.
- Imagem: substitua hero.png mantendo o nome ou altere o src no HTML.

As fontes DM Sans e Manrope são carregadas pelo Google Fonts e precisam de internet. Sem internet, o navegador utiliza uma fonte alternativa.

Todos os arquivos do site publicado estão incluídos sem minificação. O site é apenas front-end, e o contato abre o Instagram; não há backend nem banco de dados.

Para hospedar, publique os arquivos HTML, CSS e JavaScript, hero.png e a pasta assets juntos, com index.html na raiz. No Vercel, mantenha a configuração de site estático, sem comando de build.

## Atualizar o portfólio

A seção `#projetos` em `index.html` reúne os quatro projetos publicados do portfólio pessoal, com as mesmas descrições, tecnologias e URLs. Os demais projetos aparecem em cartões compactos, sem links porque não há URLs cadastradas na origem.

Para adicionar um projeto, duplique um `article.project`, atribua um número e um ID exclusivos, atualize o título, a descrição, as tecnologias e os dois links (preview e botão). Salve a captura em `assets/projects/` e ajuste `src`, `alt`, `width` e `height` da imagem. O layout e o carregamento das imagens continuam funcionando sem JavaScript.

As imagens foram copiadas de `EdwynWs/edwyn-portfolio` e otimizadas em WebP. Não dependem do domínio do portfólio pessoal. Esta migração não altera o repositório de origem.


## Aplicar esta atualização ao GitHub

1. Na sua cópia local de `EdwynWs/ews-tech`, execute `git pull` antes de copiar os arquivos.
2. Copie `index.html`, `projects.css`, `README.md` e a pasta `assets/projects/` deste pacote para a raiz do projeto. Os arquivos `style.css`, `script.js` e `hero.png` não foram alterados.
3. Abra `index.html` no navegador e confira a seção Projetos no computador e no celular.
4. Execute:

```sh
git add index.html projects.css README.md assets/projects
git commit -m "Adiciona projetos do portfolio pessoal ao site da EWS TECH"
git push
```

Se o Vercel estiver conectado à branch atualizada, ele iniciará um novo deploy. A integração desta conversa retornou HTTP 403 ao tentar gravar no GitHub; nenhum commit remoto ou deploy foi realizado.

### Validação

- Quatro projetos publicados e quatro projetos adicionais conferidos com o código de origem.
- Descrições, tecnologias e URLs de origem preservadas.
- Âncoras únicas, arquivos estáticos servidos com HTTP 200 e dimensões das imagens verificadas.
- `node --check script.js` e `git diff --check` sem erros.
- Validação visual no navegador pendente: o ambiente não conseguiu instalar o Chromium nem abrir a prévia local.
