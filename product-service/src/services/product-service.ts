import Product from 'src/types/Product';
import productsListJson from '../data/productsList.json';

export function getProductByIdService(productId: string): Product {
  return productsListJson.find(product => product.id === productId);
}
export function getAllProductsService(): Product[] {
  return productsListJson;
}
