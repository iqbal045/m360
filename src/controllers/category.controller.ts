import { Request, Response } from 'express';
import dbConnect from '../config/db';
import { Category } from '../interfaces/category.interface';
import { success, error } from '../helpers/response';
import { Product } from '../interfaces/product.interface';

const knex = dbConnect();

// get all categories
export const index = async (req: Request, res: Response) => {
  try {
    const categories: Category[] = await knex
      .from('categories as c1')
      .select(
        'c1.id',
        'c1.name',
        'c1.is_active',
        'c1.parent_id',
        'c2.name as parent_category',
        'c1.created_at',
        'c1.updated_at',
      )
      .leftJoin('categories as c2', 'c1.parent_id', 'c2.id');

    return success(res, categories, 'Categories fetched successfully!', 200);
  } catch (err) {
    error(res, err, 'Error Occurred!', 500);
  }
};

// create a category
export const create = async (req: Request, res: Response) => {
  try {
    const { name, parent_id, is_active } = req.body;
    const new_category: Category = await knex.from('categories').insert({
      name,
      parent_id,
      is_active,
    });

    const result = await knex.raw('select LAST_INSERT_ID() as id');
    const id = result[0][0].id;
    const category: Category = await knex
      .from('categories')
      .where({ id })
      .first();

    return success(res, category, 'Category created successfully.', 201);
  } catch (err) {
    console.error(err);
    return error(res, err, 'Error Occurred!', 500);
  }
};

// get category by id
export const show = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category: Category = await knex
      .from('categories')
      .where({ id })
      .first();

    if (!category) {
      error(res, {}, 'Category not found!', 404);
    }

    return success(res, category, 'Category fetched successfully!', 200);
  } catch (err) {
    console.error(err);
    return error(res, err, 'Error Occurred!', 500);
  }
};

// update category by id
export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, parent_id, is_active } = req.body;

    const category: Category = await knex
      .from('categories')
      .where({ id })
      .update({
        name,
        parent_id,
        is_active,
      });

    if (!category) {
      return error(res, {}, 'Category not found!', 404);
    }

    const update_category: Category = await knex
      .from('categories')
      .where({ id })
      .first();

    // update product status
    const products: Product[] = await knex('products')
      .whereIn(
        'id',
        knex('products')
          .select('id')
          .whereRaw(`FIND_IN_SET(${id}, cat_id) > 0`),
      )
      .update('is_active', update_category.is_active);

    return success(res, update_category, 'Category updated successfully!', 200);
  } catch (err) {
    console.error(err);
    return error(res, err, 'Error Occurred!', 500);
  }
};

// delete category by id
export const destroy = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category: Category = await knex
      .from('categories')
      .where({ id })
      .del();

    if (!category) {
      return error(res, {}, 'Category not found!', 404);
    }

    return success(res, null, 'Category deleted successfully!', 200);
  } catch (err) {
    console.error(err);
    return error(res, err, 'Error Occurred!', 500);
  }
};

// category status update
export const status = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // First, retrieve the current value of is_active for the category
    const category: Category = await knex
      .from('categories')
      .where({ id })
      .first();

    // If the category is not found, return an error
    if (!category) {
      return error(res, null, 'Category not found.', 404);
    }

    // Toggle the value of is_active
    const is_active = !category.is_active;

    // Update the category with the new value of is_active
    const updated_category: Category = await knex
      .from('categories')
      .where({ id })
      .update({ is_active });

    // update product status
    const products: Product[] = await knex('products')
      .whereIn(
        'id',
        knex('products')
          .select('id')
          .whereRaw(`FIND_IN_SET(${id}, cat_id) > 0`),
      )
      .update('is_active', category.is_active);

    return success(res, category, 'Category status updated successfully.', 200);
  } catch (err) {
    console.error(err);
    return error(res, err, 'Error Occurred!', 500);
  }
};
