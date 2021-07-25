import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
//@ts-ignore
import products from '../../data/productsList.json';
import Product from 'src/types/Product';


const getProductById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event, _context, callback) => {
  try {
    const { id: productId="" } = event.pathParameters;

    const product: Product = products.find((product: Product) => product.id === productId)

    if (!product) {
      throw new Error(`Failed to find product with id "${productId}"`);
    } else {
      return formatJSONResponse({
        ...product
      });
    }
  } catch (error) {
    callback(null, { statusCode: 404, body: error.toString() });
  }
}

export const main = middyfy(getProductById);
