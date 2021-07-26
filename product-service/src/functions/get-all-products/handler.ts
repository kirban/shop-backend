import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import schema from './schema';
//@ts-ignore
import products from '../../data/productsList.json';

const getAllProducts: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  try {
    return formatJSONResponse(200, products);
  } catch (error) {
    return formatJSONResponse(500, { message: error.toString() });
  }
}

export const main = middyfy(getAllProducts);