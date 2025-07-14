from supabase import create_client, Client
import os
import uuid

# === Leitura das variáveis de ambiente ===
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise Exception("Variáveis de ambiente SUPABASE_URL e SUPABASE_KEY não estão configuradas.")

# === Inicialização do cliente Supabase ===
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# === Função para buscar dados de uma tabela ===
def fetch_from_supabase(table_name: str):
    try:
        response = supabase.table(table_name).select("*").execute()
        return response.data
    except Exception as e:
        print(f"Erro ao buscar dados da tabela {table_name}: {e}")

# === Função para inserir dados em uma tabela ===
def insert_to_supabase(table_name: str, data: dict):
    try:
        response = supabase.table(table_name).insert(data).execute()
        return response.data
    except Exception as e:
        print(f"Erro ao inserir dados na tabela {table_name}: {e}")

# === Função NOVA para upload via objeto de arquivo (Django request.FILES['imagem']) ===
def upload_file_object_to_supabase(file_obj, content_type: str) -> str | None:
    bucket_name = 'imagens-produtos'
    nome_arquivo = f"media/produtos/{uuid.uuid4()}.{file_obj.name.split('.')[-1]}"

    try:
        data = file_obj.read()

        result = supabase.storage.from_(bucket_name).upload(
            path=nome_arquivo,
            file=data,
            file_options={"content-type": content_type}
        )

        print("Resultado do upload:", result)

        #  Checagem segura agora
        if hasattr(result, "error") and result.error:
            print("Erro no upload:", result.error)
            return None

        # Gera a URL pública corretamente
        url = supabase.storage.from_(bucket_name).get_public_url(nome_arquivo)
        print("URL pública gerada:", url)
        return url

    except Exception as e:
        print(f"Erro ao fazer upload do arquivo para Supabase: {e}")
        return None

# === (Opcional) Obter URL pública de um arquivo já existente ===
def get_public_url_from_supabase(file_name: str) -> str | None:
    """
    Retorna a URL pública de um arquivo no Supabase Storage.

    Args:
        file_name: Caminho do arquivo no bucket (ex: media/produtos/imagem.jpg)

    Returns:
        str | None: URL pública ou None em caso de erro.
    """
    bucket_name = 'imagens-produtos'
    try:
        return supabase.storage.from_(bucket_name).get_public_url(file_name)
    except Exception as e:
        print(f"Erro ao obter URL pública: {e}")
        return None


