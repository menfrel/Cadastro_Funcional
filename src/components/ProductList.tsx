import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "@/contexts/ProductContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Eye,
  Pencil,
  Trash2,
  Search,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { Product } from "@/services/database";

const ProductList = () => {
  const navigate = useNavigate();
  const { products, loading, error, deleteProduct, refreshProducts } =
    useProducts();

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    tipo: "",
    fabricante: "",
    local: "",
  });
  const itemsPerPage = 5;

  // Filter products based on search term and filters
  const filteredProducts = products.filter(
    (product) =>
      (searchTerm === "" ||
        product.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.fabricante?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filters.tipo === "" || product.tipo === filters.tipo) &&
      (filters.fabricante === "" ||
        product.fabricante === filters.fabricante) &&
      (filters.local === "" || product.local === filters.local),
  );

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Reset to first page when filters or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (deleteProductId !== null) {
      try {
        const success = await deleteProduct(deleteProductId);
        if (success) {
          setDeleteProductId(null);
        } else {
          alert("Erro ao excluir o produto. Tente novamente.");
        }
      } catch (error) {
        console.error("Erro ao excluir produto:", error);
        alert("Erro ao excluir o produto. Tente novamente.");
      }
    }
  };

  // Função para atualizar os dados
  const handleRefresh = async () => {
    await refreshProducts();
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="w-full bg-background p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={handleBack} className="mr-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold flex-1">Lista de Produtos</h1>
        <Button onClick={handleRefresh} className="mr-2">
          <RefreshCw className="mr-2 h-4 w-4" />
          Atualizar
        </Button>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Lista de Produtos</CardTitle>
            <Link to="/productform">
              <Button>Novo Produto</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center relative">
              <Input
                placeholder="Buscar por título ou fabricante"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
              <Search className="absolute right-3 h-5 w-5 text-muted-foreground" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Tipo</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={filters.tipo}
                  onChange={(e) =>
                    setFilters({ ...filters, tipo: e.target.value })
                  }
                >
                  <option value="">Todos</option>
                  <option value="Alimento">Alimento</option>
                  <option value="Bebida">Bebida</option>
                  <option value="Higiene">Higiene</option>
                  <option value="Limpeza">Limpeza</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Fabricante
                </label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={filters.fabricante}
                  onChange={(e) =>
                    setFilters({ ...filters, fabricante: e.target.value })
                  }
                >
                  <option value="">Todos</option>
                  {Array.from(new Set(products.map((p) => p.fabricante))).map(
                    (fab) => (
                      <option key={fab} value={fab}>
                        {fab}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Local</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={filters.local}
                  onChange={(e) =>
                    setFilters({ ...filters, local: e.target.value })
                  }
                >
                  <option value="">Todos</option>
                  {Array.from(new Set(products.map((p) => p.local))).map(
                    (loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <svg
                className="animate-spin h-8 w-8 text-primary"
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
              <span className="ml-2">Carregando produtos...</span>
            </div>
          ) : error ? (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md">
              {error}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Fabricante</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead>Data de Cadastro</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length > 0 ? (
                    currentItems.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.id}</TableCell>
                        <TableCell className="font-medium">
                          <Link
                            to={`/products/${product.id}`}
                            className="hover:underline text-primary"
                          >
                            {product.titulo}
                          </Link>
                        </TableCell>
                        <TableCell>{product.tipo}</TableCell>
                        <TableCell>{product.fabricante}</TableCell>
                        <TableCell>{product.local}</TableCell>
                        <TableCell>
                          {new Date(
                            product.data_cadastro || "",
                          ).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Detalhes do Produto</DialogTitle>
                                  <DialogDescription>
                                    Visualizando informações do produto{" "}
                                    {product.titulo}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm font-medium">ID:</p>
                                      <p>{product.id}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">
                                        Título:
                                      </p>
                                      <p>{product.titulo}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">
                                        Tipo:
                                      </p>
                                      <p>{product.tipo}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">
                                        Fabricante:
                                      </p>
                                      <p>{product.fabricante}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">
                                        Local:
                                      </p>
                                      <p>{product.local}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">
                                        Data de Cadastro:
                                      </p>
                                      <p>
                                        {new Date(
                                          product.data_cadastro || "",
                                        ).toLocaleDateString("pt-BR")}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      const dialogElement =
                                        document.querySelector(
                                          '[role="dialog"]',
                                        );
                                      const closeButton =
                                        dialogElement?.querySelector(
                                          'button[aria-label="Close"]',
                                        );
                                      if (closeButton instanceof HTMLElement) {
                                        closeButton.click();
                                      }
                                    }}
                                  >
                                    Fechar
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            <Link to={`/products/${product.id}`}>
                              <Button variant="ghost" size="icon">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </Link>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setDeleteProductId(product.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Confirmar exclusão
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir o produto "
                                    {product.titulo}"? Esta ação não pode ser
                                    desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={handleDeleteConfirm}
                                    className="bg-destructive text-destructive-foreground"
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        Nenhum produto encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={currentPage === page}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductList;
