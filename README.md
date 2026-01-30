# JusCleaner

O JusCleaner é uma aplicação Full-Stack desenvolvida para auxiliar advogados e profissionais do direito na preparação de documentos para peticionamento eletrônico. A ferramenta resolve os dois maiores problemas de upload nos tribunais (PJe, e-SAJ, Projudi, etc.): o tamanho excessivo dos arquivos e a incompatibilidade de nomes com caracteres especiais.

![Status do Projeto](https://img.shields.io/badge/status-concluído-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue)

## 📋 Sobre o Projeto

Sistemas judiciais frequentemente rejeitam petições devido a anexos pesados ou nomes de arquivos fora do padrão. O JusCleaner atua nessas duas frentes:

1.  **Compressão Inteligente:** Utiliza a API do iLovePDF para reduzir o tamanho do documento mantendo a legibilidade jurídica.
2.  **Sanitização de Nomes:** Renomeia automaticamente o arquivo, removendo acentos, espaços e caracteres especiais (ex: `Procuração do João.pdf` torna-se `procuracao_do_joao.pdf`), garantindo aceitação em qualquer sistema.

A arquitetura híbrida foi desenhada para superar as limitações de tempo de execução de funções serverless, separando o processamento pesado em um serviço dedicado.

https://github.com/user-attachments/assets/4aad5959-30e9-433f-bbee-d7bfeb3b4e40

## 🚀 Tecnologias Utilizadas

O projeto foi construído utilizando conceitos modernos de desenvolvimento web e arquitetura distribuída:

### Frontend (Cliente)
- **React.js (Vite):** Framework para construção de interfaces reativas.
- **TypeScript:** Tipagem estática para maior segurança e manutenibilidade.
- **Tailwind CSS:** Estilização utilitária para um design limpo e responsivo.
- **Hospedagem:** Vercel.

### Backend (API)
- **Node.js & Express:** Servidor robusto para gerenciamento das requisições.
- **iLovePDF SDK:** Integração para processamento e compressão.
- **Multer:** Middleware para manipulação de uploads.
- **Regex:** Algoritmos de sanitização de strings para padronização de nomes.
- **Hospedagem:** Render (Web Service).

## ⚙️ Arquitetura

O sistema opera em duas frentes:
1. **Frontend:** Interface visual hospedada na Vercel. Antes mesmo do envio, o cliente já valida o arquivo.
2. **Backend:** API hospedada no Render que recebe o arquivo, realiza a comunicação com o serviço de compressão, aplica a sanitização final e retorna o binário processado.

## 📦 Como Rodar Localmente

Para executar este projeto na sua máquina, você precisará do [Node.js](https://nodejs.org/) instalado.

### 1. Clonar o repositório
```bash
git clone https://github.com/daniele-senko/juscleaner.git
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

Desenvolvido por [Daniele Senko](https://www.google.com/search?q=https://www.linkedin.com/in/daniele-senko/)
