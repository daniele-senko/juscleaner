# JusCleaner (ProtocoloFácil) ⚖️

> Sanitização de arquivos jurídicos 100% no navegador.

O JusCleaner é uma ferramenta desenvolvida para advogados e estagiários de direito que precisam adequar nomes de arquivos para upload em tribunais (PJe, e-SAJ) de forma rápida e segura.

## O Problema
Sistemas judiciais rejeitam arquivos com acentos, espaços ou caracteres especiais. Renomear 50 PDFs manualmente é propenso a erros e lento.

## A Solução
- **Processamento Local:** Nenhum arquivo é enviado para servidores. Tudo roda no navegador do usuário (Segurança/LGPD).
- **Sanitização Automática:** Remove acentos, troca espaços por `_` e limita caracteres.
- **Bulk Action:** Arraste 50 arquivos e baixe um único `.zip` pronto para protocolar.

## 🛠️ Stack Tecnológica
- **Core:** React + TypeScript + Vite
- **Estilo:** Tailwind CSS
- **Arquivos:** JSZip + FileSaver + React Dropzone

## Como rodar localmente

```bash
git clone [https://github.com/daniele-senko/juscleaner.git](https://github.com/daniele-senko/juscleaner.git)
cd juscleaner
npm install
npm run dev
```