import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { Pool, PoolConfig } from 'pg';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env
const dbOptions: PoolConfig = {
    host: PG_HOST,
    port: Number(PG_PORT),
    database: PG_DATABASE,
    user: PG_USERNAME,
    password: PG_PASSWORD,
    ssl: {
        rejectUnauthorized: false // to avoid warring in this example
    },
    connectionTimeoutMillis: 5000 // time in millisecond for termination of the database query
}

// cached variable
let pool

const pgPool = async () => {
  // Check if pool already exists. Create new one if not.
  if( !pool ) {
    pool = new Pool(dbOptions);
  }

  // Get client from pool
  const client = await pool.connect();

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
      client.release(); // release connection for other executions
  }
}

export const main = middyfy(pgPool);