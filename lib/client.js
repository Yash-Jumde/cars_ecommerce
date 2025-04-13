import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
    projectId: "5ltqa63p",
    dataset: "production",
    apiVersion: "2025-04-13", // Use a more recent API version
    useCdn: true,
    token: process.env.NEXT_PUBLIC_SANITY_TOKEN
  })
  
  const builder = imageUrlBuilder(client)
  export const urlFor = (source) => builder.image(source)