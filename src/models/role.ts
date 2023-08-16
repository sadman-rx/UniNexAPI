import { DataTypes, Model, Sequelize } from 'sequelize';

interface RoleAttributes {
  id: number;
  name: string;
  slug: string;
}

interface RoleModel extends Model<RoleAttributes>, RoleAttributes {}

const defineRole = (sequelize: Sequelize) => {
  const Role = sequelize.define<RoleModel>('roles', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    label: DataTypes.STRING,
    value: {
      type: DataTypes.STRING,
      unique: true,
    },
    icon: DataTypes.STRING,
    requireUIUEmail: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, {
    timestamps: false,
  });

  return Role;
};

export default defineRole;
