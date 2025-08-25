import User from "../models/user";

// Tạo user mới
export const createUser = async (data: {
  name: string;
  email: string;
  age?: number | null;
}) => {
  return await User.create(data);
};

// Lấy tất cả user
export const getAllUsers = async () => {
  return await User.findAll();
};

// Lấy user theo id
export const getUserById = async (id: number) => {
  return await User.findByPk(id);
};

// Cập nhật user
export const updateUser = async (id: number, data: Partial<{ name: string; email: string; age?: number | null }>) => {
  const user = await User.findByPk(id);
  if (!user) return null;
  return await user.update(data);
};

// Xóa user
export const deleteUser = async (id: number) => {
  const user = await User.findByPk(id);
  if (!user) return null;
  await user.destroy();
  return user;
};
