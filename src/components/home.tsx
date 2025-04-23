import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "@/contexts/ProductContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, ListFilter, BarChart3 } from "lucide-react";

const Home = () => {
  const { products, loading, error, refreshProducts } = useProducts();
  const [recentActivity, setRecentActivity] = useState<
    { id: number; title: string; time: string }[]
  >([]);

  // Dados reais para o resumo de produtos
  const productSummary = {
    total: products.length,
    recent: products.filter((p) => {
      const date = new Date(p.data_cadastro || new Date());
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date > weekAgo;
    }).length,
    pending: 0, // Poderia ser implementado com um status no produto
  };

  // Gerar atividades recentes baseadas nos produtos reais
  useEffect(() => {
    if (products.length > 0) {
      const sortedProducts = [...products].sort((a, b) => {
        const dateA = new Date(a.data_cadastro || new Date());
        const dateB = new Date(b.data_cadastro || new Date());
        return dateB.getTime() - dateA.getTime();
      });

      const recent = sortedProducts.slice(0, 3).map((product, index) => {
        const date = new Date(product.data_cadastro || new Date());
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        let timeText = "";
        if (diffDays > 0) {
          timeText = `${diffDays} dia${diffDays > 1 ? "s" : ""} atrás`;
        } else if (diffHours > 0) {
          timeText = `${diffHours} hora${diffHours > 1 ? "s" : ""} atrás`;
        } else {
          timeText = "Agora mesmo";
        }

        return {
          id: product.id || index + 1,
          title: product.titulo,
          time: timeText,
        };
      });

      setRecentActivity(recent);
    }
  }, [products]);

  // Função para atualizar os dados
  const handleRefresh = async () => {
    await refreshProducts();
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Sistema de Gerenciamento de Produtos
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie seu catálogo de produtos com facilidade
          </p>
        </div>
        <Button onClick={handleRefresh}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4"
          >
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            <path d="M3 3v5h5"></path>
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
            <path d="M16 21h5v-5"></path>
          </svg>
          Atualizar Dados
        </Button>
      </header>

      <nav className="mb-8 flex gap-4">
        <Link to="/products">
          <Button variant="outline" className="flex items-center gap-2">
            <ListFilter size={18} />
            Listar Produtos
          </Button>
        </Link>
        <Link to="/productform">
          <Button className="flex items-center gap-2">
            <PlusCircle size={18} />
            Cadastrar Produto
          </Button>
        </Link>
        <Link to="/settings">
          <Button variant="outline" className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            Configurações
          </Button>
        </Link>
      </nav>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Resumo de Produtos</CardTitle>
            <CardDescription>
              Visão geral do seu catálogo de produtos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total de Produtos</span>
                <span className="text-xl font-bold">
                  {productSummary.total}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Adicionados esta Semana
                </span>
                <span className="text-xl font-bold">
                  {productSummary.recent}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Pendentes de Revisão
                </span>
                <span className="text-xl font-bold">
                  {productSummary.pending}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/products">
              <Button variant="outline" className="w-full">
                Ver Estatísticas Detalhadas
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Tarefas comuns para gerenciamento de produtos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/productform">
              <Button variant="secondary" className="w-full justify-start">
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Novo Produto
              </Button>
            </Link>
            <Link to="/products">
              <Button variant="secondary" className="w-full justify-start">
                <ListFilter className="mr-2 h-4 w-4" />
                Navegar Produtos
              </Button>
            </Link>
            <Link to="/settings">
              <Button variant="secondary" className="w-full justify-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                Configurações
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>
              Últimas alterações no seu catálogo
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <svg
                  className="animate-spin h-6 w-6 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="ml-2">Carregando atividades...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-4 border-b pb-4 last:border-0"
                    >
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xs font-medium">P{item.id}</span>
                      </div>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.time}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Nenhuma atividade recente
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Link to="/products">
              <Button variant="outline" className="w-full">
                Ver Todas as Atividades
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Home;
