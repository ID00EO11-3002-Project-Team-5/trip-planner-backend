import { Request, Response, NextFunction } from "express";
import { transportService } from "../services/transport.service";

export const transportController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await transportService.createTransport(req.body);
      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  },

  async getByItinerary(req: Request, res: Response, next: NextFunction) {
    try {
      const id_itit = req.params.id_itit as string;
      const data = await transportService.getTransportByItinerary(id_itit);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id_tran = req.params.id_tran as string;
      const data = await transportService.updateTransport(id_tran, req.body);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id_tran = req.params.id_tran as string;
      await transportService.deleteTransport(id_tran);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET BY ID: Useful for fetching a single transport record for an edit modal.
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id_tran = req.params.id_tran as string;
      const data = await transportService.getTransportById(id_tran);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },
};
