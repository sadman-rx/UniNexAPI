import { Sequelize } from 'sequelize';
import UserModel from 'src/models/user';
import RoleModel from 'src/models/role';

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'uninex',
});

const db = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    user: UserModel(sequelize),
    role: RoleModel(sequelize),
};

db.user.belongsTo(db.role, { foreignKey: 'roleId', as: 'role' });

export default db;
