# 💻 Setup do Projeto Python/Django

Este documento explica como configurar o ambiente, instalar dependências e executar o projeto utilizando qualquer uma das seguintes tecnologias de sua escolha:

- **[UV](https://github.com/astral-sh/uv)** (com `pyproject.toml` e `uv.lock`)
- **Pip** (com `requirements.txt`)
- **[Docker](https://www.docker.com/)**

## 🛠️ Próximos passos

### 1.1 Clone o projeto

```bash
git clone https://github.com/mdsreq-fga-unb/2025.1-T01-LFBagYourDreams.git

cd "2025.1-T01-LFBagYourDreams"
```

### 1.2 Instalando dependências e executando o projeto

- 1.2.1 Se estiver utilizando o **[UV](https://github.com/astral-sh/uv)**

📁 Caminho: `./2025.1-T01-LFBagYourDreams/`

```bash
uv init
uv sync

cd "backend/"
```

```bash
uv run manage.py runserver
```

- 1.2.2 Se estiver utilizando o `pip`

📁 Caminho: `./2025.1-T01-LFBagYourDreams/`

```bash
pip install -r requirements.txt
cd "backend/"
```

```bash
python3 manage.py runserver
```

- 1.2.3 Se estiver utilizando o **[Docker](https://www.docker.com/)**

📁 Caminho: `./2025.1-T01-LFBagYourDreams/`

```bash
docker-compose up -d --build
```
