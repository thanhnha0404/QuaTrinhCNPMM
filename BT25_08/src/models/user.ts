import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";

// Định nghĩa kiểu dữ liệu cho User
interface UserAttributes {
  id: number;
  name: string;
  email: string;
  age?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Khi tạo user mới, `id`, `createdAt`, `updatedAt` sẽ được Sequelize tự sinh ra
type UserCreationAttributes = Optional<UserAttributes, "id" | "createdAt" | "updatedAt">;

// Định nghĩa model User
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public age!: number | null;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Khởi tạo model
User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
  }
);

export default User;
