# JusCleaner

> Ferramenta Full-Stack para higienização de documentos jurídicos — resolve os dois principais motivos de rejeição de petições eletrônicas no PJe, e-SAJ e Projudi: **arquivos acima do limite de tamanho** e **nomes com caracteres inválidos**.

🌐 **[Demo ao vivo](https://juscleaner.vercel.app)**

![Status do Projeto](https://img.shields.io/badge/status-ativo-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue)

---

https://github.com/user-attachments/assets/4aad5959-30e9-433f-bbee-d7bfeb3b4e40

---

## 📋 Sobre o Projeto

Sistemas judiciais frequentemente rejeitam petições devido a anexos pesados ou nomes de arquivos fora do padrão. O PJe, por exemplo, recusa arquivos acima de 10MB e rejeita nomes com acentos, espaços ou caracteres especiais. O JusCleaner resolve essas duas frentes de forma automática:

1. **Compressão Inteligente:** Utiliza a API do iLovePDF para reduzir o tamanho do documento mantendo a legibilidade jurídica. Suporta compressão individual ou em lote.
2. **Sanitização de Nomes:** Renomeia automaticamente o arquivo, removendo acentos, espaços e caracteres especiais (ex: `Procuração do João (2024).pdf` torna-se `procuracao_do_joao_2024.pdf`), garantindo aceitação em qualquer sistema judicial.
3. **Edição de Nome:** Permite ajustar o nome gerado antes do download, caso necessário.

A arquitetura híbrida foi desenhada para superar as limitações de tempo de execução de funções serverless, separando o processamento pesado em um serviço dedicado.

## 🚀 Tecnologias Utilizadas

### Frontend
- **React.js (Vite)** — interface reativa com TypeScript
- **Tailwind CSS** — estilização utilitária para um design limpo e responsivo
- **Hospedagem:** Vercel

### Backend
- **Node.js & Express** — servidor para gerenciamento das requisições
- **iLovePDF SDK** — integração para compressão de PDFs
- **Multer** — middleware para upload com validação de tipo e tamanho
- **express-rate-limit** — proteção contra abuso da API
- **Hospedagem:** Render (Web Service)

## ⚙️ Arquitetura

O sistema opera em duas frentes:
1. **Frontend:** Interface visual hospedada na Vercel. Antes mesmo do envio, o cliente já valida e sanitiza o arquivo.
2. **Backend:** API hospedada no Render que recebe o arquivo, realiza a comunicação com o serviço de compressão e retorna o binário processado.

## 📦 Como Rodar Localmente

Para executar este projeto na sua máquina, você precisará do [Node.js](https://nodejs.org/) instalado e de uma conta no [iLovePDF](https://developer.ilovepdf.com) para obter as chaves de API.

### 1. Clonar o repositório
```bash
git clone https://github.com/daniele-senko/juscleaner.git
cd juscleaner
```

### 2. Configurar o Backend

```bash
cd backend
npm install

# Crie um arquivo .env na pasta backend:
# ILOVEPDF_PUBLIC_KEY=sua_chave_publica
# ILOVEPDF_SECRET_KEY=sua_chave_secreta
# PORT=3333
# ALLOWED_ORIGIN=http://localhost:5173

npm run dev
```

### 3. Configurar o Frontend

Abra um novo terminal na raiz do projeto:

```bash
cd frontend
npm install

# Crie um arquivo .env na pasta frontend:
# VITE_API_URL=http://localhost:3333

npm run dev
```

O frontend estará rodando em `http://localhost:5173`.

## 🛠️ Variáveis de Ambiente

Para o deploy funcionar, as seguintes variáveis devem ser configuradas nos serviços de hospedagem:

**No Backend (Render):**

| Variável | Descrição |
|---|---|
| `ILOVEPDF_PUBLIC_KEY` | Chave pública da API iLovePDF |
| `ILOVEPDF_SECRET_KEY` | Chave secreta da API iLovePDF |
| `ALLOWED_ORIGIN` | URL do frontend em produção |

**No Frontend (Vercel):**

| Variável | Descrição |
|---|---|
| `VITE_API_URL` | URL do backend em produção (ex: `https://juscleaner-api.onrender.com`) |

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Desenvolvido por [Daniele Senko](https://www.linkedin.com/in/daniele-senko/)