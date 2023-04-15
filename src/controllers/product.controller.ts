import { Request, Response } from 'express';
import dbConnect from '../config/db';
import { Product } from '../interfaces/product.interface';
import { success, error } from '../helpers/response';
import { Attribute } from '../interfaces/attribute.interface';
import { Category } from '../interfaces/category.interface';
import { AttributeValue } from '../interfaces/attributeValue.interface';

const knex = dbConnect();

// get all product # http://localhost:3000/products?cat_id=7&status=1&search=anyThing
export const index = async (req: Request, res: Response) => {
  try {
    // extract query parameters
    const { cat_id, status, search } = req.query;

    let productsQuery = knex.from('products');

    // filter by cat_id
    if (cat_id) {
      const categoryIds = cat_id;
      productsQuery = productsQuery.whereRaw(
        `JSON_CONTAINS(cat_id, '[${categoryIds}]')`,
      );
    }

    // filter by status
    if (status) {
      productsQuery = productsQuery.where('is_active', status);
    }

    // search by name or description
    if (search) {
      productsQuery = productsQuery.where(function () {
        this.where('name', 'like', `%${search}%`).orWhere(
          'description',
          'like',
          `%${search}%`,
        );
      });
    }

    const products: Product[] = await productsQuery;

    // make product json
    const productJson = await Promise.all(
      products.map(async product => {
        // category ids array
        const categoryIds = JSON.parse(product.cat_id);
        const categories: Category[] = [];
        await Promise.all(
          categoryIds.map(async (id: number) => {
            const category: Category = await knex
              .from('categories')
              .select('id', 'name')
              .where({ id })
              .first();
            categories.push(category);
          }),
        );

        // attribute ids array
        const attributeIds = JSON.parse(product.attribute_id);
        const attributes: Attribute[] = [];
        await Promise.all(
          attributeIds.map(async (id: number) => {
            const attribute: Attribute = await knex
              .from('attributes')
              .select('id', 'name')
              .where({ id })
              .first();

            // attribute values array
            const attr_values: AttributeValue[] = await knex
              .from('attribute_values')
              .select('id', 'value')
              .where({ attribute_id: id });

            const new_obj = {
              ...attribute,
              attr_values,
            };
            attributes.push(new_obj);
          }),
        );

        return {
          ...product,
          categories,
          attributes,
        };
      }),
    );

    return success(res, productJson, 'Products fetched successfully.', 200);
  } catch (err) {
    console.error(err);
    return error(res, err, 'Error Occurred!', 500);
  }
};

// create new product
export const create = async (req: Request, res: Response) => {
  try {
    const { name, cat_id, price, is_active, description, attr_value_id } =
      req.body;

    //formate attr_value_ids
    // const attr_value_ids = JSON.parse(attr_value_id);

    // get attribute ids
    const attr_id: number[] = [];
    const attr_value = await knex
      .from('attribute_values')
      .select('attribute_id')
      .whereIn('id', attr_value_id);

    await Promise.all(
      attr_value.map(async item => attr_id.push(item.attribute_id)),
    );

    const productCreate: Product = await knex.from('products').insert({
      name,
      cat_id: JSON.stringify(cat_id),
      attribute_id: JSON.stringify(attr_id),
      price,
      is_active,
      description,
    });

    const result = await knex.raw('select LAST_INSERT_ID() as id');
    const id = result[0][0].id;
    const product: Product = await knex.from('products').where({ id }).first();

    return success(res, product, 'Product created successfully.', 201);
  } catch (err) {
    console.error(err);
    return error(res, err, 'Error Occurred!', 500);
  }
};

// get product by id
export const show = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // assuming the product ID is passed as a parameter in the request

    const product: Product = await knex.from('products').where({ id }).first();

    if (!product) {
      return error(res, null, 'Product not found.', 404);
    }

    // category ids array
    const categoryIds = JSON.parse(product.cat_id);
    const categories: Category[] = [];
    await Promise.all(
      categoryIds.map(async (id: number) => {
        const category: Category = await knex
          .from('categories')
          .select('id', 'name')
          .where({ id })
          .first();
        categories.push(category);
      }),
    );

    // attribute ids array
    const attributeIds = JSON.parse(product.attribute_id);
    const attributes: Attribute[] = [];
    await Promise.all(
      attributeIds.map(async (id: number) => {
        const attribute: Attribute = await knex
          .from('attributes')
          .select('id', 'name')
          .where({ id })
          .first();

        // attribute values array
        const attr_values: AttributeValue[] = await knex
          .from('attribute_values')
          .select('id', 'value')
          .where({ attribute_id: id });

        const new_obj = {
          ...attribute,
          attr_values,
        };
        attributes.push(new_obj);
      }),
    );

    const productJson = {
      ...product,
      categories,
      attributes,
    };

    return success(res, productJson, 'Product fetched successfully.', 200);
  } catch (err) {
    console.error(err);
    return error(res, err, 'Error Occurred!', 500);
  }
};

// update product by id
export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // assuming the product ID is passed as a parameter in the request
    const { name, cat_id, price, is_active, description, attr_value_id } =
      req.body;

    // get attribute ids
    const attr_id: number[] = [];
    const attr_value = await knex
      .from('attribute_values')
      .select('attribute_id')
      .whereIn('id', attr_value_id);

    await Promise.all(
      attr_value.map(async item => attr_id.push(item.attribute_id)),
    );

    const update_product: Product = await knex
      .from('products')
      .where({ id })
      .update({
        name,
        cat_id: JSON.stringify(cat_id),
        attribute_id: JSON.stringify(attr_id),
        price,
        is_active,
        description,
      });

    const product: Product = await knex.from('products').where({ id }).first();

    return success(res, product, 'Product updated successfully.', 200);
  } catch (err) {
    console.error(err);
    return error(res, err, 'Error Occurred!', 500);
  }
};

// delete product by id
export const destroy = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // assuming the product ID is passed as a parameter in the request

    const product: Product = await knex
      .from('products')
      .where({ id })
      .first()
      .del();

    if (!product) {
      return error(res, null, 'Product not found.', 404);
    }

    return success(res, null, 'Product deleted successfully.', 200);
  } catch (err) {
    console.error(err);
    return error(res, err, 'Error Occurred!', 500);
  }
};

// product status update
export const status = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // First, retrieve the current value of is_active for the product
    const product: Product = await knex.from('products').where({ id }).first();

    // If the product is not found, return an error
    if (!product) {
      return error(res, null, 'Product not found.', 404);
    }

    // Toggle the value of is_active
    const is_active = !product.is_active;

    // Update the product with the new value of is_active
    const updated_product: Product = await knex
      .from('products')
      .where({ id })
      .update({ is_active });

    return success(res, product, 'Product status updated successfully.', 200);
  } catch (err) {
    console.error(err);
    return error(res, err, 'Error Occurred!', 500);
  }
};
