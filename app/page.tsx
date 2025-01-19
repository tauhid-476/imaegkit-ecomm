"use client"
import { apiClient } from '@/lib/api-client'
import { IProduct } from '@/models/Product'
import React, { useEffect, useState } from 'react'
import ImageGallery from './components/ImageGallery'

export default function Page() {
  const [products, setProducts] = useState<IProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const response = await apiClient.getProducts()
        console.log("API Response:", response)
        // Ensure response is an array
        if (Array.isArray(response)) {
          setProducts(response)
        } else {
          console.error("Invalid response format:", response)
          setError("Invalid data format received")
          setProducts([])
        }
      } catch (error) {
        console.error("Error fetching products:", error)
        setError("Failed to fetch products")
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">ImageKit Shop</h1>
        <div className="flex justify-center items-center min-h-screen">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">ImageKit Shop</h1>
        <div className="alert alert-error">
          <p>{error}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">ImageKit Shop</h1>
      <ImageGallery products={products} />
    </main>
  )
}