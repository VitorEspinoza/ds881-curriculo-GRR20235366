# Currículo Online — Vitor Adriel Deganelli Espinoza Moya

[![CI](https://github.com/VitorEspinoza/ds881-curriculo-GRR20235366/actions/workflows/main.yml/badge.svg)](https://github.com/VitorEspinoza/ds881-curriculo-GRR20235366/actions/workflows/main.yml)

Currículo pessoal em formato de site estático (HTML, CSS e JS puros), publicado no GitHub Pages.

## Site em produção

https://vitorespinoza.github.io/ds881-curriculo-GRR20235366/

A publicação é automática: a cada push/merge na `main`, o workflow de CI/CD gera o build e atualiza o GitHub Pages.

## Rodando localmente com Docker

Não é preciso ter Node.js instalado — tudo roda dentro do container.

Subir o ambiente de desenvolvimento (com hot reload em `http://localhost:8080`):

```bash
docker compose up
```

Em background:

```bash
docker compose up -d
```

Alterações em `src/**/*.html`, `src/assets/css/**/*.css` e `src/assets/js/**/*.js` são refletidas automaticamente no navegador.

Rodar o lint (HTMLHint + Stylelint):

```bash
docker compose exec web npm run lint
```

Gerar o build de produção (saída em `./dist`):

```bash
docker compose exec web npm run build
```

Encerrar:

```bash
docker compose down
```

## CI/CD

O workflow em `.github/workflows/main.yml` roda em pushes e pull requests para a `main`, em três etapas:

- **lint**: HTMLHint + Stylelint sobre o código em `src/`.
- **build**: gera `./dist` (HTML/CSS minificados) e prepara o artefato para o Pages.
- **deploy**: publica `./dist` no GitHub Pages, apenas em pushes na `main` e somente se o build passar.

## Branch protection

A branch `main` é protegida: alterações só entram via Pull Request, com os checks `lint` e `build` obrigatórios e a branch sempre atualizada antes do merge. Force push e exclusão da branch estão bloqueados, inclusive para administradores.

<img width="420" height="514" alt="image" src="https://github.com/user-attachments/assets/6f731c3f-3bf2-41bc-aa1e-478f2deb2055" />

## Estrutura

```
src/
├── index.html
├── favicon.svg
└── assets/
    ├── css/      # reset, variáveis de tema e estilos das seções
    ├── js/       # menu mobile, scroll suave, ano dinâmico, tema claro/escuro
    ├── img/      # imagens e assets de Open Graph
    └── files/    # currículo em PDF
```

