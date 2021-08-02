import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { getAllProductsService } from "src/services/product-service";
import Product from "src/types/Product";
import schema from './schema';

const getAllProducts: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  try {
    const products: Product[] = getAllProductsService();
    return formatJSONResponse(200, products);
  } catch (error) {
    return formatJSONResponse(500, { message: error.toString() });
  }
}

export const main = middyfy(getAllProducts);