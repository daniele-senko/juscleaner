```markdown
# JusCleaner

O JusCleaner é uma aplicação Full-Stack desenvolvida para auxiliar advogados e profissionais do direito na compressão de arquivos PDF para atender aos limites rígidos dos sistemas de peticionamento eletrônico (PJe, e-SAJ, Projudi, etc.), mantendo a legibilidade dos documentos.

![Status do Projeto](https://img.shields.io/badge/status-concluído-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue)

## 📋 Sobre o Projeto

Sistemas judiciais frequentemente rejeitam petições devido ao tamanho dos anexos. O JusCleaner resolve esse problema oferecendo uma interface simples para compressão inteligente de documentos, utilizando a API do iLovePDF para garantir a máxima redução com a menor perda de qualidade visual possível.

A arquitetura foi desenhada para superar as limitações de tempo de execução de funções serverless, separando o processamento pesado em um serviço dedicado.

## 🚀 Tecnologias Utilizadas

O projeto foi construído utilizando conceitos modernos de desenvolvimento web e arquitetura distribuída:

### Frontend (Cliente)
- **React.js (Vite):** Framework para construção de interfaces reativas e performáticas.
- **TypeScript:** Tipagem estática para maior segurança e manutenibilidade do código.
- **Tailwind CSS:** Estilização utilitária para um design limpo e responsivo.
- **Hospedagem:** Vercel.

### Backend (API)
- **Node.js & Express:** Servidor robusto para gerenciamento das requisições.
- **iLovePDF SDK:** Integração para processamento e compressão de arquivos.
- **Multer:** Middleware para manipulação de uploads (multipart/form-data).
- **Hospedagem:** Render (Web Service).

## ⚙️ Arquitetura

O sistema opera em duas frentes:
1. **Frontend:** Interface visual hospedada na Vercel, responsável pela interação com o usuário.
2. **Backend:** API hospedada no Render, responsável por receber o arquivo, comunicar-se com o serviço de compressão e retornar o binário processado.

## 📦 Como Rodar Localmente

Para executar este projeto na sua máquina, você precisará do [Node.js](https://nodejs.org/) instalado.

### 1. Clonar o repositório
```bash
git clone [https://github.com/daniele-senko/juscleaner.git](https://github.com/daniele-senko/juscleaner.git)
cd juscleaner

```

### 2. Configurar o Backend

```bash
cd backend
npm install

# Crie um arquivo .env na pasta backend com as chaves do iLovePDF:
# ILOVEPDF_PUBLIC_KEY=sua_chave_publica
# ILOVEPDF_SECRET_KEY=sua_chave_secreta
# PORT=3333

npm run dev

```

### 3. Configurar o Frontend

Abra um novo terminal na raiz do projeto:

```bash
cd frontend
npm install

# Crie um arquivo .env na pasta frontend apontando para o backend local:
# VITE_API_URL=http://localhost:3333

npm run dev

```

O frontend estará rodando em `http://localhost:5173`.

## 🛠️ Variáveis de Ambiente

Para o deploy funcionar, as seguintes variáveis devem ser configuradas nos serviços de hospedagem:

**No Backend (Render):**

* `ILOVEPDF_PUBLIC_KEY`: Chave pública da API.
* `ILOVEPDF_SECRET_KEY`: Chave secreta da API.

**No Frontend (Vercel):**

* `VITE_API_URL`: URL do backend em produção (ex: `https://juscleaner-api.onrender.com`).

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](https://www.google.com/search?q=LICENSE) para mais detalhes.

---

Desenvolvido por [Seu Nome](https://www.google.com/search?q=https://www.linkedin.com/in/daniele-senko/)

```