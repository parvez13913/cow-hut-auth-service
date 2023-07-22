import { IAdmin, ILoginAdmin } from './admin.interface';
import { Admin } from './admin.model';

const createAdmin = async (payload: IAdmin): Promise<IAdmin> => {
  const result = await Admin.create(payload);
  return result;
};

const loginAdmin = async (payload: ILoginAdmin) => {
  const { phoneNumber, password } = payload;
};

export const AdminService = {
  createAdmin,
  loginAdmin,
};
