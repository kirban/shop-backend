import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
// import Product from "src/types/Product";
// import schema from './schema';

import { Client, ClientConfig } from 'pg';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;
const dbOptions: ClientConfig = {
  host: PG_HOST,
  port: Number(PG_PORT),
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 5000
};

const pgClient = async () => {
  const client = new Client(dbOptions);
  await client.connect();

  try {
    //make ddl query for creation table
    const ddlResult = await client.query(`
        create table if not exists todo_list (
            id serial primary key,
            list_name text,
            list_description text
        )`);
    const ddlResult2 = await client.query(`  
        create table if not exists todo_item (
            id serial primary key,
            list_id integer,
            item_name text,
            item_description text,
            foreign key ("list_id") references "todo_list" ("id")
        )`);
    // console.log(ddlResult. ddlResult2);


    // make initial dml queries
    const dmlResult = await client.query(`
        insert into todo_list (list_name, list_description) values
            ('Important','Important thing to do'),
            ('Secondary', 'Minor matters')`);
    const dmlResult2 = await client.query(`
        insert into todo_item (list_id, item_name, item_description) values
            (1, 'Learn Lambda', 'Learn how to work with Amazon Lambda.'),
            (1, 'Learn RDS', 'Learn how to work with Amazon Relational Database Service.'),
            (1, 'Learn EC2', 'Learn how to work with Amazon Relational Elastic Compute Cloud.'),
            (2, 'Learn IDE shortcuts', 'Learn how to work with shortcuts in preffered IDE.'),
            (2, 'Learn DBeaver features', 'Learn how to work with DBeaver tool.');`
    );
    // console.log(dmlResult, dmlResult2);

    // make select query
    const { rows: todo_items } = await client.query(`select * from todo_item`);
    console.log(todo_items);
    return formatJSONResponse(200, {todo_items});
  } catch (err) {
      // you can process error here. In this example just log it to console.
      console.error('Error during database request executing:', err);
      return formatJSONResponse(500, {"error": `Error during database request executing: ${err}`});
  } finally {
      // in case if error was occurred, connection will not close automatically
      client.end(); // manual closing of connection
  }
  // try {

  //   return formatJSONResponse(200, products);
  // } catch (error) {
  //   return formatJSONResponse(500, { message: error.toString() });
  // }
}

export const main = middyfy(pgClient);