import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import Product from 'src/types/Product';
import { getProductByIdService } from 'src/services/product-service';


const getProductById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const { id: productId="" } = event.pathParameters;

    const product: Product = getProductByIdService(productId)

    if (!product) {
      throw new Error(`Failed to find product with id "${productId}"`);
    } else {
      return formatJSONResponse(200, {
        ...product
      });
    }
  } catch (error) {
    return formatJSONResponse(404, { message: error.toString() });
  }
}

export const main = middyfy(getProductById);
