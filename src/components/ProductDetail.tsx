import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "@/contexts/ProductContext";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Save,
  X,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Product } from "../services/database";

interface ProductDetailProps {
    product?: Product
}


const ProductDetail = ({ product: propProduct }: ProductDetailProps) => {
  const { id } = useParams();
  const productId = Number(id);
  const navigate = useNavigate();
  const { getProduct, updateProduct, deleteProduct, products } = useProducts();
  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedProduct, setLoadedProduct] = useState<
    ProductDetailProps["product"] | null
  >(null);

  // Mock data for when no product is provided
  const defaultProduct: Product = {
    id: productId || 1,
    titulo: "Produto Exemplo",
    tipo: "Alimento",
    ingredientes:
      "Água, açúcar, conservantes, corantes artificiais, aromatizantes.",
    fabricante: "Indústria Alimentícia ABC",
    local: "São Paulo, Brasil",
    selos: "Orgânico, Sem Glúten, Vegano",
    variacao: "Tradicional",
    exportacao: "Sim - América Latina",
    macro: "Carboidratos: 25g, Proteínas: 5g, Gorduras: 2g",
    imagem_front:
      "https://images.unsplash.com/photo-1553456558-aff63285bdd1?w=800&q=80",
    imagem_verso:
      "https://images.unsplash.com/photo-1553456558-aff63285bdd1?w=800&q=80",
    imagem_adicional:
      "https://images.unsplash.com/photo-1553456558-aff63285bdd1?w=800&q=80",
    observacoes: "Este é um produto exemplo para demonstração do sistema.",
    data_cadastro: new Date().toISOString(),
  };

  // Fetch product data if ID is provided
  useEffect(() => {
    const fetchProduct = async () => {
      if (productId && !propProduct) {
        setIsLoading(true);
        try {
          const data = await getProduct(productId);
          if (data) {
            setLoadedProduct(data);
          }
        } catch (error) {
          console.error("Erro ao carregar produto:", error);
          setFormError("Não foi possível carregar os dados do produto.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProduct();
  }, [productId, propProduct, getProduct]);

  // Determine which product data to use
  const actualProduct = propProduct || loadedProduct || defaultProduct;
  const [editedProduct, setEditedProduct] = useState(actualProduct);

  // Update editedProduct when actualProduct changes
  useEffect(() => {
    setEditedProduct(actualProduct);
  }, [actualProduct]);

  const productData = isEditing ? editedProduct : actualProduct;
  const selosArray =
    productData.selos?.split(",").map((selo) => selo.trim()) || [];

  // Função para atualizar os dados
  const handleRefresh = async () => {
    if (productId) {
      setIsLoading(true);
      try {
        const data = await getProduct(productId);
        if (data) {
          setLoadedProduct(data);
          setFormSuccess("Dados atualizados com sucesso!");
          setTimeout(() => setFormSuccess(null), 3000);
        }
      } catch (error) {
        console.error("Erro ao atualizar produto:", error);
        setFormError("Não foi possível atualizar os dados do produto.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (isEditing) {
      // If in edit mode, ask for confirmation before navigating away
      if (
        window.confirm(
          "Deseja sair do modo de edição? Alterações não salvas serão perdidas.",
        )
      ) {
        setIsEditing(false);
        setEditedProduct(actualProduct);
      }
    } else {
      navigate(-1);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setFormError(null);
    setFormSuccess(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedProduct(actualProduct);
    setFormError(null);
    setFormSuccess(null);
  };

  const handleSave = async () => {
    if (!editedProduct.id) return;

    setIsSaving(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      const result = await updateProduct(editedProduct.id, editedProduct);

      if (result) {
        setFormSuccess("Produto atualizado com sucesso!");
        setIsEditing(false);
        setLoadedProduct(result);
      } else {
        throw new Error("Falha ao atualizar o produto");
      }
    } catch (error) {
      setFormError("Erro ao salvar o produto. Tente novamente.");
      console.error("Error saving product:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDelete = async () => {
    if (!productData.id) return;

    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        const success = await deleteProduct(productData.id);
        if (success) {
          navigate("/products");
        } else {
          setFormError("Não foi possível excluir o produto. Tente novamente.");
        }
      } catch (error) {
        console.error("Erro ao excluir produto:", error);
        setFormError("Erro ao excluir o produto. Tente novamente.");
      }
    }
  };

  // Navegação entre produtos
  const navigateToPreviousProduct = () => {
    if (productId > 1) {
      navigate(`/products/${productId - 1}`);
    }
  };

  const navigateToNextProduct = () => {
    navigate(`/products/${productId + 1}`);
  };

  return (
    <motion.div
      className="container mx-auto py-8 bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={handleBack} className="mr-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {isEditing ? "Cancelar" : "Voltar"}
        </Button>
        <h1 className="text-2xl font-bold flex-1">
          {isEditing ? "Editando Produto" : "Detalhes do Produto"}
        </h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancelEdit}>
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Salvando..." : "Salvar"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </Button>
            </>
          )}
        </div>
      </div>

      {formError && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}

      {formSuccess && (
        <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
          <AlertDescription>{formSuccess}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
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
          <span className="ml-2">Carregando detalhes do produto...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Imagens do Produto</CardTitle>
              </CardHeader>
              <CardContent>
                <Carousel className="w-full">
                  <CarouselContent>
                    {[
                      productData.imagem_front,
                      productData.imagem_verso,
                      productData.imagem_adicional,
                    ]
                      .filter(Boolean)
                      .map((image, index) => (
                        <CarouselItem key={index}>
                          <div className="p-1">
                            <div className="overflow-hidden rounded-lg">
                              <img
                                src={image}
                                alt={`Imagem ${index + 1} do produto`}
                                className="w-full h-64 object-cover"
                              />
                            </div>
                            <p className="text-center mt-2 text-sm text-muted-foreground">
                              {index === 0
                                ? "Frente"
                                : index === 1
                                  ? "Verso"
                                  : "Adicional"}
                            </p>
                          </div>
                        </CarouselItem>
                      ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </Carousel>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{productData.titulo}</CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selosArray.map((selo, index) => (
                    <Badge key={index} variant="secondary">
                      {selo}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Tipo
                    </h3>
                    {isEditing ? (
                      <Select
                        value={editedProduct.tipo}
                        onValueChange={(value) =>
                          handleInputChange("tipo", value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Alimento">Alimento</SelectItem>
                          <SelectItem value="Bebida">Bebida</SelectItem>
                          <SelectItem value="Higiene">Higiene</SelectItem>
                          <SelectItem value="Limpeza">Limpeza</SelectItem>
                          <SelectItem value="Outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p>{productData.tipo}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Fabricante
                    </h3>
                    {isEditing ? (
                      <Input
                        value={editedProduct.fabricante}
                        onChange={(e) =>
                          handleInputChange("fabricante", e.target.value)
                        }
                      />
                    ) : (
                      <p>{productData.fabricante}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Local
                    </h3>
                    {isEditing ? (
                      <Input
                        value={editedProduct.local}
                        onChange={(e) =>
                          handleInputChange("local", e.target.value)
                        }
                      />
                    ) : (
                      <p>{productData.local}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Variação
                    </h3>
                    {isEditing ? (
                      <Input
                        value={editedProduct.variacao}
                        onChange={(e) =>
                          handleInputChange("variacao", e.target.value)
                        }
                      />
                    ) : (
                      <p>{productData.variacao}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Exportação
                    </h3>
                    {isEditing ? (
                      <Input
                        value={editedProduct.exportacao}
                        onChange={(e) =>
                          handleInputChange("exportacao", e.target.value)
                        }
                      />
                    ) : (
                      <p>{productData.exportacao}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Macro
                    </h3>
                    {isEditing ? (
                      <Input
                        value={editedProduct.macro}
                        onChange={(e) =>
                          handleInputChange("macro", e.target.value)
                        }
                      />
                    ) : (
                      <p>{productData.macro}</p>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Ingredientes
                  </h3>
                  {isEditing ? (
                    <Textarea
                      value={editedProduct.ingredientes}
                      onChange={(e) =>
                        handleInputChange("ingredientes", e.target.value)
                      }
                      className="min-h-[120px]"
                    />
                  ) : (
                    <div className="bg-muted p-3 rounded-md whitespace-pre-line">
                      {productData.ingredientes}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Observações
                  </h3>
                  {isEditing ? (
                    <Textarea
                      value={editedProduct.observacoes}
                      onChange={(e) =>
                        handleInputChange("observacoes", e.target.value)
                      }
                      className="min-h-[120px]"
                    />
                  ) : (
                    <div className="bg-muted p-3 rounded-md whitespace-pre-line">
                      {productData.observacoes}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="text-sm text-muted-foreground">
                  Data de Cadastro:{" "}
                  {new Date(
                    productData.data_cadastro || new Date(),
                  ).toLocaleDateString("pt-BR")}
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <Button
          variant="outline"
          onClick={navigateToPreviousProduct}
          disabled={productId <= 1}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Produto Anterior
        </Button>

        <Button onClick={handleRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Atualizar
        </Button>

        <Button variant="outline" onClick={navigateToNextProduct}>
          Próximo Produto
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductDetail;
