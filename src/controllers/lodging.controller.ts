import { Request, Response, NextFunction } from "express";
import { lodgingService } from "../services/lodging.service";

export const lodgingController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await lodgingService.createLodging(req.body);
      res.status(201).json(data);
    } catch (error) {
      next(error); // Let your error handler process Zod or Supabase errors
    }
  },

  async getByItinerary(req: Request, res: Response, next: NextFunction) {
    try {
      const { id_itit } = req.params;
      const data = await lodgingService.getLodgingByItinerary(
        id_itit as string,
      );
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id_lodg } = req.params;
      const data = await lodgingService.getLodgingById(id_lodg as string);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id_lodg } = req.params;
      const data = await lodgingService.updateLodging(
        id_lodg as string,
        req.body,
      );
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id_lodg } = req.params;
      await lodgingService.deleteLodging(id_lodg as string);
      res.status(204).send(); // Success, no content
    } catch (error) {
      next(error);
    }
  },
};
