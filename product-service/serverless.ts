import type { AWS } from '@serverless/typescript';

import dotenv from "dotenv";
const stage = (process.env.NODE_ENV === "dev") ? "dev" : (process.env.NODE_ENV === "production") ? "production" : ""
dotenv.config({ path: `./.env.${stage}` });
import getProductById from '@functions/get-product-by-id';
import getAllProducts from '@functions/get-all-products';
import pgClient from '@functions/pg-client';
import pgPool from '@functions/pg-pool';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      PG_HOST: process.env.PG_HOST,
      PG_PORT: process.env.PG_PORT,
      PG_DATABASE: process.env.PG_DATABASE,
      PG_USERNAME: process.env.PG_USERNAME,
      PG_PASSWORD: process.env.PG_PASSWORD
    },
    lambdaHashingVersion: '20201221',
    stage: 'dev',
    region: 'eu-west-1',
  },
  // import the function via paths
  functions: { getProductById, getAllProducts, pgClient, pgPool },
};

module.exports = serverlessConfiguration;
