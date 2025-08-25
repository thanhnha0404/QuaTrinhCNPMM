import { Request, Response } from "express";
import * as CRUDService from "../services/CRUDService";

export const getHome = (req: Request, res: Response): void => {
  res.render("home.ejs");
};

export const postCreateUser = async (req: Request, res: Response): Promise<void> => {
  await CRUDService.createUser(req.body);
  res.redirect("/users");
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  const users = await CRUDService.getAllUsers();
  res.render("users/list.ejs", { users });
};

export const getEditUser = async (req: Request, res: Response): Promise<void> => {
  const user = await CRUDService.getUserById(Number(req.params.id));
  res.render("users/edit.ejs", { user });
};

export const postUpdateUser = async (req: Request, res: Response): Promise<void> => {
  await CRUDService.updateUser(Number(req.params.id), req.body);
  res.redirect("/users");
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  await CRUDService.deleteUser(Number(req.params.id));
  res.redirect("/users");
};
