'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/client'

interface LazyLoadingSupabaseImageProps {
  fullPath: string
  alt: string
  width: number
  height: number
  className?: string
  skeleton?: React.ReactNode
}

export default function LazyLoadingSupabaseImage({
  fullPath,
  alt,
  width,
  height,
  className = '',
  skeleton
}: LazyLoadingSupabaseImageProps) {

  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const supabase = createClient();

  const fetchImage = useCallback(async () => {
    try {
      const { data, error } = await supabase.storage
        .from('') // Replace with your actual bucket name
        .createSignedUrl(fullPath, 60) // 60 seconds expiration

      if (error) throw error

      setImageUrl(data.signedUrl)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching image:', error)
      setError('Failed to load image')
      setIsLoading(false)
    }
  }, [fullPath, supabase.storage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchImage()
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '100px' }
    )

    const currentImageRef = imageRef.current;
    if (currentImageRef) {
      observer.observe(currentImageRef)
    }

    return () => {
      if (currentImageRef) {
        observer.unobserve(currentImageRef)
      }
    }
  }, [fetchImage]);

  const DefaultSkeleton = () => (
    <div 
      className={`animate-pulse bg-gray-200 rounded ${className}`} 
      style={{ width, height }}
      aria-hidden="true"
    />
  )

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div ref={imageRef}>
      {isLoading ? (
        skeleton || <DefaultSkeleton />
      ) : (
        imageUrl && (
          <Image
            src={imageUrl}
            alt={alt}
            width={width}
            height={height}
            className={className}
          />
        )
      )}
    </div>
  )
}