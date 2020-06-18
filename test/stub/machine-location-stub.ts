// App
import { MachineLocationQueryRes } from '@models/MachineLocation';

const machineLocationQueryResponse: MachineLocationQueryRes = {
  id: 1,
  machine_id: 1,
  machine_type: 'Washing Machine',
  machine_number: 2,
  machine_brand: 'Bosh',
  machine_model: 'B123',
  machine_description: 'Bosh washing machine',
  building_address_id: 1,
  building_address_street: 'Siltakuja',
  building_address_number: '4',
  building_address_block_number: 'B',
  building_address_postal_code: '02350',
  building_address_city: 'Espoo',
};

// Export
export { machineLocationQueryResponse };
