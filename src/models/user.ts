import { DataTypes, Model, Sequelize } from 'sequelize';

interface UserAttributes {
  id: number;
  displayName: string;
  email: string;
  password: string;
  photoURL: string | null;
  phoneNumber: string | null;
  country: string | null;
  address: string | null;
  state: string | null;
  city: string | null;
  zipCode: string | null;
  about: string | null;
  role: string;
  isAdmin: boolean;
  isBanned: boolean;
  isVerified: boolean; 
  isApproved: boolean;
  token: string | null;
  tokenExpiry: Date | null;
  callbackUrl: string | null;
}

interface UserModel extends Model<UserAttributes>, UserAttributes {}

const defineUser = (sequelize: Sequelize) => {
  const User = sequelize.define<UserModel>('users', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    displayName: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    photoURL: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    about: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isBanned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tokenExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    callbackUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return User;
};

export default defineUser;
