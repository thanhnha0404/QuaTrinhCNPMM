const CRUDService = require('../services/CRUDService');

const getHome = (req, res) => {
  res.render('home.ejs');
};

const postCreateUser = async (req, res) => {
  await CRUDService.createUser(req.body);
  res.redirect('/users');
};

const getUsers = async (req, res) => {
  const users = await CRUDService.getAllUsers();
  res.render('users/list.ejs', { users });
};

const getEditUser = async (req, res) => {
  const user = await CRUDService.getUserById(req.params.id);
  res.render('users/edit.ejs', { user });
};

const postUpdateUser = async (req, res) => {
  await CRUDService.updateUser(req.params.id, req.body);
  res.redirect('/users');
};

const deleteUser = async (req, res) => {
  await CRUDService.deleteUser(req.params.id);
  res.redirect('/users');
};

module.exports = { getHome, postCreateUser, getUsers, getEditUser, postUpdateUser, deleteUser };
