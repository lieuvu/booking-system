// App
import { MachineLocationQueryRes, MachineLocationRes } from '@models/MachineLocation';

/**
 * Convert to machine location response from the database query response.
 * The server will return the machine location response.
 *
 * @param queryRes The machine location query response.
 * @returns The machine location response from the server.
 */
function convertToMLResponse(queryRes: MachineLocationQueryRes): MachineLocationRes {
  const mlRes: MachineLocationRes = {
    id: queryRes.id,
    machine: {
      id: queryRes.machine_id,
      type: queryRes.machine_type,
      brand: queryRes.machine_brand,
      model: queryRes.machine_model,
      description: queryRes.machine_description,
    },
    address: {
      id: queryRes.building_address_id,
      street: queryRes.building_address_street,
      number: queryRes.building_address_number,
      building_block_number: queryRes.building_address_block_number,
      postal_code: queryRes.building_address_postal_code,
      city: queryRes.building_address_city,
    },
  };

  return mlRes;
}

// Export
export { convertToMLResponse };
