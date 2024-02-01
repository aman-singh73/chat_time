import { Client,Databases,Account } from 'appwrite';

export const API_ID='https://cloud.appwrite.io/v1'
export const PROJECT_ID='65b144ba872c7ea83a49'
export const DATABASE_ID='65b1464237ef273f3956'
export const COLLECTIONS_ID='65b1465ae853a71cca58'
const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('65b144ba872c7ea83a49');

   export const databases = new Databases(client);
   export const account = new Account(client);
    export default client;