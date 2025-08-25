import { Router } from "express";
import {
  getHome,
  postCreateUser,
  getUsers,
  getEditUser,
  postUpdateUser,
  deleteUser,
} from "../controllers/homeController";

const router = Router();

// Home
router.get("/", getHome);

// CREATE
router.post("/create-user", postCreateUser);

// READ
router.get("/users", getUsers);

// UPDATE
router.get("/edit-user/:id", getEditUser);
router.post("/update-user/:id", postUpdateUser);

// DELETE
router.get("/delete-user/:id", deleteUser);

export default router;
