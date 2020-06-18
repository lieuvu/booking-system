// Library
import { Request, Response } from 'express';

/**
 * Get user
 *
 * @param req
 * @param res
 */
const getUser = (req: Request, res: Response) => {
  return res.status(200).json({ 'getUser': 123 });
};

/**
 * Create user
 *
 * @param req
 * @param res
 */
const createUser = (req: Request, res: Response) => {
  return res.status(200).json({ 'createUser': 123 });
}

/**
 * Update user
 *
 * @param req
 * @param res
 */
const updateUser = (req: Request, res: Response) => {
  return res.status(200).json({ 'updateUser': 123 });
};

/**
 * Delete user
 *
 * @param req
 * @param res
 */
const deleteUser = (req: Request, res: Response) => {
  return res.status(200).json({ 'deleteUser': 123 });
};

// Export
export const userController = {
  getUser,
  createUser,
  updateUser,
  deleteUser
};
