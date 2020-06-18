import { Machine } from '@models/Machine';
import { BuildingAddress } from '@models/BuildingAddress';

enum MachineLocationStatus {
  Active = 'active',
  Broken = 'broken',
  Storage = 'storage',
}

interface MachineLocation {
  id: number;
  machine_id: number;
  building_id: number;
  number: number | null;
  status: MachineLocationStatus;
}

interface MachineLocationQueryRes {
  id: number;
  machine_number: number;
  machine_id: number;
  machine_type: string;
  machine_brand: string;
  machine_model: string;
  machine_description: string;
  building_address_id: number;
  building_address_street: string;
  building_address_number: string | null;
  building_address_block_number: string | null,
  building_address_city: string;
  building_address_postal_code: string;
}

interface MachineLocationRes {
  id: number;
  machine: Pick<Machine, 'id' | 'brand' | 'model' | 'description'> & {
    type: string;
  };
  address: Pick<BuildingAddress, 'id' | 'street' | 'number' | 'postal_code' | 'city'> & {
    building_block_number: string
  };
}

// Export
export type { MachineLocation, MachineLocationQueryRes, MachineLocationRes };
export { MachineLocationStatus };
