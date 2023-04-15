import { Knex } from 'knex';
import { faker } from '@faker-js/faker';
import { Category } from '../../interfaces/category.interface';
import { Product } from '../../interfaces/product.interface';
import { Attribute } from '../../interfaces/attribute.interface';
import { AttributeValue } from '../../interfaces/attributeValue.interface';

const NUM_CATEGORIES = 10;
const NUM_PRODUCTS = 50;
const NUM_ATTRIBUTES = 5;
const NUM_ATTRIBUTE_VALUES = 15;

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries

  // Insert categories
  const categories: Category[] = [];
  for (let i = 1; i <= NUM_CATEGORIES; i++) {
    const category: Category = {
      id: i,
      name: faker.commerce.department(),
      parent_id: i > 1 ? faker.datatype.number({ min: 1, max: i - 1 }) : null,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };
    categories.push(category);
  }
  await knex('categories').insert(categories);

  // Insert attributes
  const attributes: Attribute[] = [];
  for (let i = 1; i <= NUM_ATTRIBUTES; i++) {
    const attribute: Attribute = {
      id: i,
      name: faker.lorem.word(),
      created_at: new Date(),
      updated_at: new Date(),
    };
    attributes.push(attribute);
  }
  await knex('attributes').insert(attributes);

  // Insert attribute_values
  const attributeValues: AttributeValue[] = [];
  for (let i = 1; i <= NUM_ATTRIBUTE_VALUES; i++) {
    const attributeValue: AttributeValue = {
      id: i,
      attribute_id: faker.datatype.number({ min: 1, max: NUM_ATTRIBUTES }),
      value: faker.color.human(),
      created_at: new Date(),
      updated_at: new Date(),
    };
    attributeValues.push(attributeValue);
  }
  await knex('attribute_values').insert(attributeValues);

  // Insert products
  const products: Product[] = [];
  for (let p = 1; p <= NUM_PRODUCTS; p++) {
    // make cat_id
    const cat_id = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const random_cats = [];
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * cat_id.length);
      const randomCat = cat_id[randomIndex];
      random_cats.push(randomCat);
    }

    // make attribute_id
    const attribute_id = [1, 2, 3, 4, 5];
    const random_attributes = [];
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * attribute_id.length);
      const randomAttribute = attribute_id[randomIndex];
      random_attributes.push(randomAttribute);
    }
    const product: Product = {
      id: p,
      name: faker.commerce.productName(),
      cat_id: `[${Array.from(new Set(random_cats))}]`,
      attribute_id: `[${Array.from(new Set(random_attributes))}]`,
      price: parseFloat(faker.commerce.price()),
      description: faker.commerce.productDescription(),
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };
    products.push(product);
  }
  await knex('products').insert(products);
}
