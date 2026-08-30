import { products } from './products.js'

// Única puerta de acceso a datos de producto. Hoy lee el array local;
// cuando se migre a Supabase solo cambia el cuerpo de estas funciones —
// ningún componente de catalog/ o combo/ debería importar products.js directamente.
const productImages = import.meta.glob('../assets/products/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
})

function resolveImageUrl(filename) {
  const match = Object.entries(productImages).find(([path]) => path.endsWith(`/${filename}`))
  return match ? match[1] : null
}

export async function getProducts() {
  return products.map((product) => ({
    ...product,
    imageUrl: resolveImageUrl(product.image),
  }))
}

export async function getProductById(id) {
  const list = await getProducts()
  return list.find((product) => product.id === id) ?? null
}
