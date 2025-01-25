import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import CategoryModel, { categoryDAO } from "../models/category.model";
import response from "../utils/response";

export default {

  async create(req: IReqUser, res: Response) {
    try {
      await categoryDAO.validate(req.body);
      const result = await CategoryModel.create(req.body);
      response.success(res, result, "Success Create Category");
    } catch (error) {
      response.error(res, error, "failed create category");
    }
  },

  async findAll(req: IReqUser, res: Response) {
    const {
      page = 1,
      limit = 10,
      search,
    } = req.query as unknown as IPaginationQuery;
    try {
      const query = {};
      if (search) {
        Object.assign(query, {
          $or: [
            {
              name: { $regex: search, $options: "i" },
            },
            {
              description: { $regex: search, $options: "i" },
            },
          ],
        });
      }
      const result = await CategoryModel.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();

      const count = await CategoryModel.countDocuments(query);

      response.pagination(
        res,
        result,
        {
          total: count,
          totalPages: Math.ceil(count / limit),
          current: page,
        },
        "Success Find All Category"
      );
    } catch (error) {
      response.error(res, error, "failed find all category");
    }
  },

  async findOne(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await CategoryModel.findById(id);
      response.success(res, result, "Success Find One Category");
    } catch (error) {
      response.error(res, error, "failed find one category");
    }
  },

  async update(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await CategoryModel.findByIdAndUpdate(id, req.body, { new: true });
      response.success(res, result, "Success Update Category");
    } catch (error) {
      response.error(res, error, "failed update category");
    }
  },

  async remove(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await CategoryModel.findByIdAndDelete(id, {
        new: true,
      });
      response.success(res, result, "Success Remove Category");
    } catch (error) {
      response.error(res, error, "failed remove category");
    }
  },

};
