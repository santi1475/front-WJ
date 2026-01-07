"use client"

import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, Star } from "lucide-react"

const products = [
    { id: 1, name: "Vestido Elegante", price: "$89.99", rating: 4.8, image: "👗", category: "Vestidos" },
    { id: 2, name: "Blusa Casual", price: "$45.99", rating: 4.6, image: "👕", category: "Blusas" },
    { id: 3, name: "Pantalón Premium", price: "$75.99", rating: 4.9, image: "👖", category: "Pantalones" },
    { id: 4, name: "Chaqueta Moderna", price: "$125.99", rating: 4.7, image: "🧥", category: "Chaquetas" },
    { id: 5, name: "Falda Midi", price: "$65.99", rating: 4.5, image: "👗", category: "Faldas" },
    { id: 6, name: "Sudadera Cómoda", price: "$55.99", rating: 4.8, image: "🧦", category: "Sudaderas" },
    { id: 7, name: "Jeans Ajustado", price: "$79.99", rating: 4.7, image: "👖", category: "Jeans" },
    { id: 8, name: "Top Deportivo", price: "$39.99", rating: 4.6, image: "👕", category: "Deportivo" },
]

export default function ProductGrid() {
    return (
        <section id="productos" className="py-16 md:py-24 lg:py-32 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">Productos Destacados</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Selección curada de prendas de moda para cada ocasión
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="group bg-card rounded-xl overflow-hidden border border-border hover:border-primary transition-all duration-300 flex flex-col hover:shadow-lg hover:-translate-y-1"
                        >
                            <div className="relative h-48 bg-linear-to-br from-secondary/30 to-accent/30 flex items-center justify-center overflow-hidden">
                                <div className="text-6xl group-hover:scale-110 transition-transform duration-300">{product.image}</div>
                                <button className="absolute top-3 right-3 bg-white/90 dark:bg-black/90 p-2 rounded-full hover:bg-primary hover:text-primary-foreground opacity-0 group-hover:opacity-100 transform -translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                    <Heart className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-4 flex-1 flex flex-col">
                                <p className="text-xs font-semibold text-primary mb-1 uppercase tracking-wider">{product.category}</p>
                                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{product.name}</h3>

                                <div className="flex items-center gap-1 mb-3">
                                    {Array(5)
                                        .fill(0)
                                        .map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-muted-foreground"}`}
                                            />
                                        ))}
                                    <span className="text-xs text-muted-foreground ml-1">({product.rating})</span>
                                </div>

                                <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                                    <span className="text-2xl font-bold text-primary">{product.price}</span>
                                    <Button size="sm" className="gap-2">
                                        <ShoppingCart className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Button size="lg" variant="outline">
                        Ver Todos los Productos
                    </Button>
                </div>
            </div>
        </section>
    )
}
