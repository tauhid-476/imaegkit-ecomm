import { IProduct } from '@/models/Product'
import React from 'react'
import ProductCard from './ProductCard'
import { useNotification } from './Notification'

interface ImageGalleryProps {
  products: IProduct[]
}

export default function ImageGallery({ products }: ImageGalleryProps) {

  if (!Array.isArray(products)) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id?.toString()} product={product} />
      ))}

      {products.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-base-content/70">No products found</p>
        </div>
      )}
    </div>
  )
}
