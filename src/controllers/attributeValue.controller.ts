import { Request, Response } from 'express';
import dbConnect from '../config/db';
import { AttributeValue } from '../interfaces/attributeValue.interface';
import { success, error } from '../helpers/response';
import { Attribute } from '../interfaces/attribute.interface';

const knex = dbConnect();

// get all attr_value with attr_name
export const index = async (req: Request, res: Response) => {
  try {
    const attributeValues: AttributeValue[] = await knex
      .from('attribute_values as attr_v')
      .select(
        'attr_v.id',
        'attr_v.value',
        'attr_v.attribute_id',
        'attr.name as attribute_name',
        'attr_v.created_at',
        'attr_v.updated_at',
      )
      .leftJoin('attributes as attr', 'attr_v.attribute_id', 'attr.id');

    return success(
      res,
      attributeValues,
      'Attribute values fetched successfully.',
      200,
    );
  } catch (err) {
    console.error(err);
    return error(res, err, 'Error Occurred!', 500);
  }
};

// create attr_value
export const create = async (req: Request, res: Response) => {
  try {
    const { attribute_id, value } = req.body;

    const new_attributeValue: AttributeValue = await knex
      .from('attribute_values')
      .insert({
        attribute_id,
        value,
      });

    const result = await knex.raw('select LAST_INSERT_ID() as id');
    const id = result[0][0].id;
    const attributeValue: AttributeValue = await knex
      .from('attribute_values')
      .where({ id })
      .first();

    return success(
      res,
      attributeValue,
      'Attribute value created successfully.',
      201,
    );
  } catch (err) {
    console.error(err);
    return error(res, err, 'Error Occurred!', 500);
  }
};

// get attr_value by id with attr_name
export const show = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const attributeValue: AttributeValue = await knex
      .from('attribute_values as attr_v')
      .select(
        'attr_v.id',
        'attr_v.value',
        'attr_v.attribute_id',
        'attr.name as attribute_name',
        'attr_v.created_at',
        'attr_v.updated_at',
      )
      .leftJoin('attributes as attr', 'attr_v.attribute_id', 'attr.id')
      .where('attr_v.id', id)
      .first();

    return success(
      res,
      attributeValue,
      'Attribute value fetched successfully.',
      200,
    );
  } catch (err) {
    console.error(err);
    return error(res, err, 'Error Occurred!', 500);
  }
};

// update attr value by id
export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { attribute_id, value } = req.body;

    const attributeValue: AttributeValue = await knex
      .from('attribute_values')
      .where({ id })
      .update({
        attribute_id,
        value,
      });

    if (!attributeValue) {
      return error(res, {}, 'Attribute value not found!', 404);
    }

    const update_attributeValue: AttributeValue = await knex
      .from('attribute_values as attr_v')
      .select(
        'attr_v.id',
        'attr_v.value',
        'attr_v.attribute_id',
        'attr.name as attribute_name',
        'attr_v.created_at',
        'attr_v.updated_at',
      )
      .leftJoin('attributes as attr', 'attr_v.attribute_id', 'attr.id')
      .where('attr_v.id', id)
      .first();

    return success(
      res,
      update_attributeValue,
      'Attribute value updated successfully.',
      200,
    );
  } catch (err) {
    console.error(err);
    return error(res, err, 'Error Occurred!', 500);
  }
};

// delete attr value by id
export const destroy = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const attributeValue: AttributeValue = await knex
      .from('attribute_values')
      .where({ id })
      .del();

    if (!attributeValue) {
      return error(res, {}, 'Attribute value not found!', 404);
    }

    return success(res, null, 'Attribute value deleted successfully.', 200);
  } catch (err) {
    console.error(err);
    return error(res, err, 'Error Occurred!', 500);
  }
};
