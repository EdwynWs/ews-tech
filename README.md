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
- script.js: menu mobile, animações ao rolar, efeito de movimento, detalhes expansíveis e barra de progresso.
- hero.png: imagem principal.

## Ajustes comuns

- Textos e Instagram: index.html. Busque por ews_tech para alterar os links de contato.
- Cores: variáveis em :root no início de style.css.
- Layout mobile: regras @media no final de style.css.
- Imagem: substitua hero.png mantendo o nome ou altere o src no HTML.

As fontes DM Sans e Manrope são carregadas pelo Google Fonts e precisam de internet. Sem internet, o navegador utiliza uma fonte alternativa.

Todos os arquivos do site publicado estão incluídos sem minificação. O site é apenas front-end, e o contato abre o Instagram; não há backend nem banco de dados.

Para hospedar em outro provedor, publique estes quatro arquivos juntos, com index.html na raiz. As alterações locais não atualizam automaticamente o site publicado no Sites.
