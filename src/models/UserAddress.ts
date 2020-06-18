import { User } from '@models/User';
import { BuildingAddress } from '@models/BuildingAddress';

interface UserAddressReq {
  id: number;
  user_id: number;
  building_id: number;
  apartment_number: string;
}

interface UserAddressRes {
  id: number;
  user: Pick<User, 'id' | 'first_name' | 'last_name' | 'email'>;
  address: Pick<BuildingAddress, 'id' | 'street' | 'city' | 'postal_code' | 'number'> & {
    apartment_number: string;
    building_block_number: string
  };
}


// Export
export type {
  UserAddressReq,
  UserAddressRes,
};
