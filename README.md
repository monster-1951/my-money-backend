# Personal Finance Management Application | Full stack project

A full stack personal finance management application with transactional balance integrity , db level constraints and CSRF protected authentication.

## Core Features

- Records
- Accounts
- Categories
- Authentication

## Tech Stack

### Backend

- Nodejs
- Express
- Typescript
- Prisma ORM
- Postgresql

### Frontend

- Typescript
- Vite + React
- Tailwind
- Axios

### Deployment

- Vercel (Frontend)
- Render (Backend)
- Neon (Database)

## Local Setup

Let's go through how to run this project locally .

This project has 2 seperate repos for frontend and backend .

### Follow these steps

1. Create a folder "Personal Finance Manager" or any name of your choice

   Clone the frontend

   `  git clone https://github.com/monster-1951/my-money.git  `

   Clone the backend

   ` git clone https://github.com/monster-1951/my-money-backend.git`

2. Open 2 different terminals , and cd into the frontend code and backend code respectively .

3. Open VS code in the frontend repo , create a .env file and add this env variable

   `VITE_URL_FOR_BACKEND=http://localhost:8080`

4. Save it and do npm i and npm run dev in it's terminal

5. Now , open the backend repo in vs code , set the following env variables by creating a .env folder in the project .

   > You will need to have a postgres db url to move forward with this backend , you can use your local postgresdb url also.

```
    PORT = 8080

    CSRF_TOKEN_SECRET = "Your value"

    COOKIE_SECURE = "true"

    DATABASE_URL="your postgres db url"

    JWT_SECRET_KEY = "Your value"

    TOKEN_HEADER_KEY = token_header
```

6. Now do npm i and npm run dev in terminal

- Navigate to localhost:5173 on browser ( that's where the frontend is running)

- You can start by creating a new account by clicking register button .

## Architecture overview

The project has 3 major entities , accounts - it has money , records - the transactions that you make from that account, categories - transactions belong to a category

- ### Account
  - User Creates a new account , initialized it with some amount , simulating an account which he/she already has in bank or in form of cash or any real account .
  - User can have multiple accounts

- ### Record
  - Records are of 3 kinds . Income , expense , transfer .
  - If user has recieved some money , it is income , if he spends , it is expense and if he transfers money from his account to one of his accounts , it is transfer .
  - Each record could be tagged to a category like salary , food , diet , discount , shopping , refund etc . ( Except for transfer)
  - It involves Record type , the account involved ( two accounts in case of transfer ), amount , date and time of the transaction .
  - Creating or updating or deleting the transaction will auto update the balance in the concerned accounts and the balance will be reflected there itself .
- ### Categories
  - These are of 2 kinds , Income categories and Expense Categories .
  - User can assign the category to a record based on the record type .

> To create a transfer record , the user must own both from account and to account. Because the purpose it to maintain personal finances .

## Database

The database Schema is inside the prsima/schema.prisma file .
The db was evolved throughout the project development and the one you are seeing is the final version .
You can track it's evolution in prisma/migrations folder.

There are 5 tables in our db .

- users -
  - id
  - name
  - email
  - password hash
    > email id column is set as unique because no 2 users must have same email, all the columns are required

- accounts -
  - id
  - name
  - balance ( Decimal type value )
  - user_id ( foreign key which links this acccount to the id of user who owns this account )
  - icon ( foreign key which links the id of icon of this account from icons table ) .

  > - Here , amount / balance is set as Decimal type because we are dealing with financial data and Decimal is the preferred and suitable type for it .
  > - On frontend it is handled using decimaljs library because js doesn't support decimal datatype

- categories -
  - id
  - name
  - category_type ( if it is expense type or income type )
  - user_id ( foreign key linking this category with it's owner's id ) - icon ( foreign key which links the id of icon of this category from icons table )

  > category_type is actually an enum . It only has "Income" or "Expense" values

- records -
  - id
  - type - as record_type which is an enum .
    - It allows "Income" , "Expense" , "Transfer" values .

  - amount - Decimal type
  - time -
    - DateTime string which interprets the timestamp of the transaction including the timezone
  - category - id of the category it belongs to
  - notes - user can optionally write some notes for their transaction
  - user_id - the id of the user who owns this transaction .

  This table has check constraints and triggers .
  1. Suppose the user is creating a transfer transaction , the from account and to account can't be same

  2. If the trasaction type is transfer , category column should be null because transfer doesn't have any categories . If transaction type is not transfer , then category must not be null , it should be of some value .

  3. The category type and record type should match. If the record type is Income , it's category type should also be of Income type. This was enforced with the help of a trigger .

  ## Data Integrity Strategy

- When user creates / updates / deletes a record , it's concerned account's balance must get updated .
- This is handled in backend . Create record is done by calculating the delta value ( the change in account ) to update the account balance .
- If it is delete , the transaction will be undone .
- If it is updating , the transaction will be undone and new transaction is implemented .
- Here we use db Transaction . Each transaction will update the records table , then accounts table . If anything fails in mid process , the transaction get's rolled back.

- Reflecting the updated balance after a record update operation has multiple possiblile cases , they were enumerated and handled .

            |Previous Record Type | Updated Record Type |
            |----------------------|--------------------|
            | TRANSFER             | TRANSFER           |
            | TRANSFER             | EXPENSE            |
            | TRANSFER             | INCOME             |
            | EXPENSE              | EXPENSE            |
            | EXPENSE              | TRANSFER           |
            | EXPENSE              | INCOME             |
            | INCOME               | INCOME             |
            | INCOME               | TRANSFER           |
            | INCOME               | EXPENSE            |

- The reason for enumerating is , the columsn existing in one type of record might not have to be null or required in the updated record type . So , each one was handled seperately .

## Authentication

### HTTP only Auth

- We use http only cookie based jwt tokens authentication system , to mitigate token theft via XSS.

- Here our frontend and backend were deployed on different domains , so we had to set samesite as none .

## CSRF
- This samesite-none configuration invites CSRF attacks because browser auto attaches the token on every request being made to backend irrespective of request origin domain.
- To prevent this , we added a x-csrf token header authentication . Backend only allows those requests who has both jwt token in their cookie and the x-csrf token in their header .
- This prevents the CSRF attack also .

- The token verifications , authorizations happen in middlewares . All the routes are protected with this middleware except register , login .

### CORS

- Only localhost 5173 and the frontend url are allowed to read the responses from backend
- Browser makes an options request before making any request user wants to make ( like post , delete , put ) , to check if that request is allowed or not.
- It is called preflight request . For that preflight request we set the succes response status code as 204

### Proxy configuration

- ` app.set("trust proxy", 1);`

- The reason is , backend is deployed on render , where the browser requests don't directly reach the backend but through a proxy which render uses to manage backend servers .
- Though the browser makes the https request and proxy informs the backend through a 'http' request that the request from browser was https.
- The backend doesn't trust the proxy and considers it as http because proxy is informing through http request to backend .
- In our authentication layer , we need secure to be true that means requests and responses must happen through https .
- In this case , secure becomes false and if backends sends cookie with secure being false , browser discards the cookie and the authentication fails .
- This is a security feature , but for our use case , we set the trust proxy , 1 to let our backend trust only 1 proxy previoius to it .
- So , if the proxy says it was https , backend trusts it as https and sets the cookie with secure as true .

> config - This directory has env.ts file and auth.ts file. env.ts file defines zod schema for environment variables for backend . If any environment variables are missing , the application fails on startup itself

> Technical note -

> - In backend , all the id columns of tables are of bigint type . 
>  - But , JSON doesn't support bigint types . 
> - So , on backend , we convert them into Number type and handle them . > - We have helper functions in lib directory of our project , which are used to construct the parameters to send into a function , to typecast the data etc .


## Request Flow

- Each request made on a route , is validated against it's concerned zod schema .
- Then the request is sent to it's concerned controller which sends the relevent data to the relevant service . 
- The service layer directly talks to the database , sends back the response to controller and controller sends the relevant response back .
- All the functions , have their input params and responses as defined typescript interfaces . This ensures type safety .

```
CLIENT ---> MIDDLEWARE ---> ROUTE ---> CONTROLLER ---> SERVICE ---> PRISMA --> DATABASE
```

## Pagination and filtering -

> The get records endpoint on backend, allows the request to have query params in it's request where user can send filters to filter records and get their desired records , like records filtered by time period , or record_type , or amount . We also implemented pagination here using take skip parameters in prisma . The page number can be passed in the request body as query param

> user_id is used on all tables to get the rows to ensure the user sees only his data , not other user's data .

# Fronted 

> - We used Vite+React in typescript, tailwind for styling . 
> - The design was made mobile first , it's not for desktop usage .


## Axios
- We use axios instances and interceptors here .
- To make an api call , to different routes on backend , we have relevant axios instances . 
- To hit the routes related to accounts , we have accounts axios instance , same for auth , records , categories .
- All have their relevant request and response interceptors
- We have functions that take the required request data and makes axios api calls to backend . 
- The frontend components only call those functions , they don't use axios directly .

- User will be redirected to login page if unauthorized . 
- User can either register with a new account or login . Remaining all routes are protected on frontend . 



## App structure
- The app is organized page wise . 
- Routes are managed by react-router-dom. 
- Each page is a component , Each component has it's subcomponents . - Components are defined in the components directory , in organized way . 
- Related components are kept in related directory inside the main components directory .
