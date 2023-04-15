### Installation

\*\*\* install nodejs 18 or higher

1. Clone the repository
2. Run `npm install`
3. Create a .env file in the root of the project with the following environment
   variables:

```
PORT=<port number>
DB_HOST=<localhost>
DB_USER=<your db username>
DB_PASSWORD=<your db password>
DB_NAME=<your db name>
```

### Run the project

```
npx knex migrate:latest  // run migration in db
npx knex seed:run  // make some initial data in db
npm run dev (Development)
```

### API Routes

#### Attributes

```
GET /attributes (get all attributes)

POST /attributes (create new attribute)
{
    "name": "Test Attr"
}

GET /attributes/:id (get attribute by id)
PATCH /attributes/:id (update attribute by id)
DELETE /attributes/:id (delete attribute by id)
```

#### Attribute Values

```
GET /attr-values (get all attribute_values)

POST /attr-values (create new attribute_value)
{
    "attribute_id": 1,
    "value": "XL"
}

GET /attr-values/:id (get attribute_value by id)
PATCH /attr-values/:id (update attribute_value by id)
DELETE /attr-values/:id (delete attribute_value by id)
```

#### Categories

```
GET /categories (get all categories)

POST /categories (create new category)
{
    "name": "Test Category",
    "is_active": true,
    "parent_id": null
}

GET /categories/:id (get category by id)
PATCH /categories/:id (update category by id)
DELETE /categories/:id (delete category by id)
GET /categories/:id/status (update category status by id)
```

#### Products

```
GET /products?cat_id=11&status=true&search=anything (get products by category, status, search)
GET /products/ (get all products)

POST /products (create new product)
{
    "name": "Test Product",
    "cat_id": [8,4,6], // category id in array formate
    "attr_value_id": [1,5], // AttributeValues id in array formate
    "price": 567,
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "is_active": true
}

GET /products/:id (get product by id)
PUT /products/:id (update product by id)
DELETE /products/:id (delete product by id)
GET /products/:id/status (update product status by id)
```
