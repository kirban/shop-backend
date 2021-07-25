import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import schema from './schema';
//@ts-ignore
import products from '../../data/productsList.json';

const getAllProducts: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (_event, _context, callback) => {
  try {
    return formatJSONResponse({
      ...products,
    });
  } catch (error) {
    callback(null, { statusCode: 500, body: error.toString() })
  }
}

export const main = middyfy(getAllProducts);