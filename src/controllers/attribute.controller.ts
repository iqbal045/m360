import { Request, Response } from 'express';
import dbConnect from '../config/db';
import { Attribute } from '../interfaces/attribute.interface';
import { success, error } from '../helpers/response';
import { AttributeValue } from '../interfaces/attributeValue.interface';

const knex = dbConnect();

// get all attributes
export const index = async (req: Request, res: Response) => {
  try {
    const attributes: Attribute[] = await knex.from('attributes');

    // attach attribute values
    for (const attribute of attributes) {
      const attributeValues: AttributeValue[] = await knex
        .from('attribute_values')
        .select('id', 'value')
        .where({ attribute_id: attribute.id });
      attribute.attributeValues = attributeValues;
    }

    return success(res, attributes, 'Attributes fetched successfully.', 200);
  } catch (err) {
    console.error(err);
    return error(res, err, 'Error Occurred!', 500);
  }
};

// create new attribute
export const create = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const new_attribute: Attribute = await knex.from('attributes').insert({
      name,
    });

    const result = await knex.raw('select LAST_INSERT_ID() as id');
    const id = result[0][0].id;
    const attribute: Attribute = await knex
      .from('attributes')
      .where({ id })
      .first();

    return success(res, attribute, 'Attribute created successfully.', 201);
  } catch (err) {
    console.error(err);
    return error(res, err, 'Error Occurred!', 500);
  }
};

// get attribute by id
export const show = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const attribute: Attribute = await knex
      .from('attributes')
      .where({ id })
      .first();

    if (!attribute) {
      return error(res, 'Attribute not found.', 'Error Occurred!', 404);
    }

    // attach attribute values
    const attributeValues: AttributeValue[] = await knex
      .from('attribute_values')
      .select('id', 'value')
      .where({ attribute_id: id });
    attribute.attributeValues = attributeValues;

    return success(res, attribute, 'Attribute fetched successfully.', 200);
  } catch (err) {
    console.error(err);
    return error(res, err, 'Error Occurred!', 500);
  }
};

// update attribute by id
export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const attribute: Attribute = await knex
      .from('attributes')
      .where({ id })
      .update({
        name,
      });

    if (!attribute) {
      return error(res, {}, 'Attribute not found!', 404);
    }

    const update_attribute: Attribute = await knex
      .from('attributes')
      .where({ id })
      .first();

    return success(
      res,
      update_attribute,
      'Attribute updated successfully.',
      200,
    );
  } catch (err) {
    console.error(err);
    return error(res, err, 'Error Occurred!', 500);
  }
};

// delete attribute by id
export const destroy = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const attribute: Attribute = await knex
      .from('attributes')
      .where({ id })
      .del();

    if (!attribute) {
      return error(res, {}, 'Attribute not found!', 404);
    }

    return success(res, null, 'Attribute deleted successfully!', 200);
  } catch (err) {
    console.error(err);
    return error(res, err, 'Error Occurred!', 500);
  }
};
