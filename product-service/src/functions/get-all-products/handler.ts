import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import schema from './schema';
//@ts-ignore
import products from '../../data/productsList.json';

const getAllProducts: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  return formatJSONResponse({
    products,
  })
}

export const main = middyfy(getAllProducts);