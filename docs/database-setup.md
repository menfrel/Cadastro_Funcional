# Configuração do Banco de Dados SQL Server Express

Este documento fornece instruções para configurar o banco de dados SQL Server Express para o Sistema de Gerenciamento de Produtos.

## Pré-requisitos

1. SQL Server Express instalado (versão 2019 ou superior)
2. SQL Server Management Studio (SSMS) ou Azure Data Studio

## Passos para Configuração

### 1. Instalação do SQL Server Express

Se você ainda não tem o SQL Server Express instalado:

1. Baixe o SQL Server Express no site oficial da Microsoft: [Download SQL Server Express](https://www.microsoft.com/pt-br/sql-server/sql-server-downloads)
2. Execute o instalador e selecione a opção "Básica"
3. Siga as instruções do assistente de instalação
4. Anote o nome da instância (geralmente `SQLEXPRESS`) e a senha do usuário `sa`

### 2. Criação do Banco de Dados

1. Abra o SQL Server Management Studio (SSMS)
2. Conecte-se à instância do SQL Server Express usando autenticação do Windows ou as credenciais configuradas durante a instalação
3. Execute o seguinte script SQL para criar o banco de dados e as tabelas necessárias:

```sql
-- Criar o banco de dados
CREATE DATABASE GerenciamentoProdutos;
GO

-- Usar o banco de dados criado
USE GerenciamentoProdutos;
GO

-- Criar tabela de produtos
CREATE TABLE Produtos (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Titulo NVARCHAR(100) NOT NULL,
    Tipo NVARCHAR(50),
    Ingredientes NVARCHAR(MAX),
    Fabricante NVARCHAR(100),
    Local NVARCHAR(100),
    Selos NVARCHAR(200),
    Variacao NVARCHAR(100),
    Exportacao NVARCHAR(100),
    Macro NVARCHAR(200),
    Imagem_Front NVARCHAR(500),
    Imagem_Verso NVARCHAR(500),
    Imagem_Adicional NVARCHAR(500),
    Observacoes NVARCHAR(MAX),
    Data_Cadastro DATETIME DEFAULT GETDATE()
);
GO

-- Inserir alguns dados de exemplo
INSERT INTO Produtos (Titulo, Tipo, Ingredientes, Fabricante, Local, Selos, Variacao, Exportacao, Macro, Observacoes)
VALUES 
('Cereal Matinal Integral', 'Alimento', 'Aveia, trigo integral, mel, açúcar mascavo.', 'Nutrifoods', 'São Paulo', 'Orgânico, Sem Conservantes', 'Tradicional', 'Sim - América Latina', 'Carboidratos: 25g, Proteínas: 5g, Gorduras: 2g', 'Produto rico em fibras e vitaminas.'),
('Bebida Láctea Fermentada', 'Bebida', 'Leite, fermento lácteo, açúcar.', 'Lacticínios Puro', 'Minas Gerais', 'Sem Glúten, Fonte de Cálcio', 'Morango', 'Não', 'Carboidratos: 15g, Proteínas: 3g, Gorduras: 2g', 'Contém probióticos benéficos para a flora intestinal.'),
('Biscoito Integral', 'Alimento', 'Farinha integral, açúcar, óleo vegetal, ovos.', 'Nutrifoods', 'Rio de Janeiro', 'Fonte de Fibras, Baixo Sódio', 'Tradicional', 'Sim - Mercosul', 'Carboidratos: 18g, Proteínas: 2g, Gorduras: 5g', 'Ideal para lanches saudáveis.'),
('Suco Natural de Laranja', 'Bebida', 'Laranja, água, conservantes naturais.', 'Sucos Naturais', 'Bahia', 'Sem Açúcar Adicionado, 100% Natural', 'Com Polpa', 'Não', 'Carboidratos: 10g, Proteínas: 1g, Gorduras: 0g', 'Rico em vitamina C.'),
('Barra de Cereal', 'Alimento', 'Aveia, mel, frutas secas, castanhas.', 'Nutrifoods', 'São Paulo', 'Sem Glúten, Vegano', 'Frutas Vermelhas', 'Sim - Global', 'Carboidratos: 20g, Proteínas: 3g, Gorduras: 4g', 'Fonte de energia para atividades físicas.');
GO
```

### 3. Configuração da String de Conexão

Para conectar a aplicação ao banco de dados, você precisará configurar a string de conexão no arquivo `.env` do projeto:

```
DB_CONNECTION_STRING=Server=localhost\SQLEXPRESS;Database=GerenciamentoProdutos;Trusted_Connection=True;
```

Se você estiver usando autenticação SQL Server em vez de autenticação do Windows, use:

```
DB_CONNECTION_STRING=Server=localhost\SQLEXPRESS;Database=GerenciamentoProdutos;User Id=sa;Password=SuaSenha;
```

### 4. Configuração de Firewall (se necessário)

Se o banco de dados estiver em um servidor diferente da aplicação:

1. Abra o Firewall do Windows no servidor SQL
2. Adicione uma regra de entrada para permitir conexões na porta 1433 (porta padrão do SQL Server)
3. No SQL Server Configuration Manager, habilite o protocolo TCP/IP para a instância do SQL Server

## Alternativa: Usando Supabase

Como alternativa ao SQL Server Express, este projeto também suporta o uso do Supabase como backend. Para configurar:

1. Crie uma conta no [Supabase](https://supabase.com/)
2. Crie um novo projeto
3. No SQL Editor, execute o seguinte script para criar a tabela:

```sql
CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    titulo TEXT NOT NULL,
    tipo TEXT,
    ingredientes TEXT,
    fabricante TEXT,
    local TEXT,
    selos TEXT,
    variacao TEXT,
    exportacao TEXT,
    macro TEXT,
    imagem_front TEXT,
    imagem_verso TEXT,
    imagem_adicional TEXT,
    observacoes TEXT,
    data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inserir alguns dados de exemplo
INSERT INTO produtos (titulo, tipo, ingredientes, fabricante, local, selos, variacao, exportacao, macro, observacoes)
VALUES 
('Cereal Matinal Integral', 'Alimento', 'Aveia, trigo integral, mel, açúcar mascavo.', 'Nutrifoods', 'São Paulo', 'Orgânico, Sem Conservantes', 'Tradicional', 'Sim - América Latina', 'Carboidratos: 25g, Proteínas: 5g, Gorduras: 2g', 'Produto rico em fibras e vitaminas.'),
('Bebida Láctea Fermentada', 'Bebida', 'Leite, fermento lácteo, açúcar.', 'Lacticínios Puro', 'Minas Gerais', 'Sem Glúten, Fonte de Cálcio', 'Morango', 'Não', 'Carboidratos: 15g, Proteínas: 3g, Gorduras: 2g', 'Contém probióticos benéficos para a flora intestinal.'),
('Biscoito Integral', 'Alimento', 'Farinha integral, açúcar, óleo vegetal, ovos.', 'Nutrifoods', 'Rio de Janeiro', 'Fonte de Fibras, Baixo Sódio', 'Tradicional', 'Sim - Mercosul', 'Carboidratos: 18g, Proteínas: 2g, Gorduras: 5g', 'Ideal para lanches saudáveis.'),
('Suco Natural de Laranja', 'Bebida', 'Laranja, água, conservantes naturais.', 'Sucos Naturais', 'Bahia', 'Sem Açúcar Adicionado, 100% Natural', 'Com Polpa', 'Não', 'Carboidratos: 10g, Proteínas: 1g, Gorduras: 0g', 'Rico em vitamina C.'),
('Barra de Cereal', 'Alimento', 'Aveia, mel, frutas secas, castanhas.', 'Nutrifoods', 'São Paulo', 'Sem Glúten, Vegano', 'Frutas Vermelhas', 'Sim - Global', 'Carboidratos: 20g, Proteínas: 3g, Gorduras: 4g', 'Fonte de energia para atividades físicas.');
```

4. Configure as variáveis de ambiente no arquivo `.env`:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

## Suporte e Solução de Problemas

Se encontrar problemas durante a configuração do banco de dados:

1. Verifique se o serviço SQL Server está em execução
2. Confirme se as credenciais de conexão estão corretas
3. Verifique se o firewall não está bloqueando as conexões
4. Certifique-se de que o usuário tem permissões adequadas no banco de dados

Para problemas com o Supabase:

1. Verifique se as chaves de API estão corretas
2. Confirme se a tabela foi criada corretamente
3. Verifique as políticas de segurança do Row Level Security (RLS)
