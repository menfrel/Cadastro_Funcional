import { createClient } from "@supabase/supabase-js";
// Inicializa o cliente Supabase (usado como alternativa ao SQL Server Express no ambiente web)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseKey);

// Interface para produtos
export interface Product {
  id?: number;
  titulo: string;
  tipo: string;
  ingredientes?: string;
  fabricante?: string;
  local?: string;
  selos?: string;
  variacao?: string;
  exportacao?: string;
  macro?: string;
  imagem_front?: string;
  imagem_verso?: string;
  imagem_adicional?: string;
  observacoes?: string;
  data_cadastro?: string;
}

// Funções para operações CRUD de produtos
export const productService = {
  // Obter todos os produtos
  async getProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from("produtos")
        .select("*")
        .order("id", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      return [];
    }
  },

  // Obter um produto pelo ID
  async getProductById(id: number): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from("produtos")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erro ao buscar produto com ID ${id}:`, error);
      return null;
    }
  },

  // Criar um novo produto
  async createProduct(product: Product): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from("produtos")
        .insert([{ ...product, data_cadastro: new Date().toISOString() }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      return null;
    }
  },

  // Atualizar um produto existente
  async updateProduct(
    id: number,
    product: Partial<Product>,
  ): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from("produtos")
        .update(product)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erro ao atualizar produto com ID ${id}:`, error);
      return null;
    }
  },

  // Excluir um produto
  async deleteProduct(id: number): Promise<boolean> {
    try {
      const { error } = await supabase.from("produtos").delete().eq("id", id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Erro ao excluir produto com ID ${id}:`, error);
      return false;
    }
  },
};
