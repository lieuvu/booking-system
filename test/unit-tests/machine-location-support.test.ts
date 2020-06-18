// App
import { convertToMLResponse } from '@controllers/machine-location/machine-locaton-support';

// Mock data
import { machineLocationQueryResponse as mlQueryRes } from '@test/stub/machine-location-stub';

describe('Machine Location Support Functions', () => {
  test('should convert to machine location response', () => {
    const mlResponse = convertToMLResponse(mlQueryRes);

    expect(mlResponse.id).toEqual(mlQueryRes.id);
    expect(mlResponse.machine.id).toEqual(mlQueryRes.machine_id);
    expect(mlResponse.machine.type).toEqual(mlQueryRes.machine_type);
    expect(mlResponse.machine.brand).toEqual(mlQueryRes.machine_brand);
    expect(mlResponse.machine.model).toEqual(mlQueryRes.machine_model);
    expect(mlResponse.machine.description).toEqual(mlQueryRes.machine_description);
    expect(mlResponse.address.id).toEqual(mlQueryRes.building_address_id);
    expect(mlResponse.address.street).toEqual(mlQueryRes.building_address_street);
    expect(mlResponse.address.number).toEqual(mlQueryRes.building_address_number);
    expect(mlResponse.address.building_block_number).toEqual(mlQueryRes.building_address_block_number);
    expect(mlResponse.address.postal_code).toEqual(mlQueryRes.building_address_postal_code);
    expect(mlResponse.address.city).toEqual(mlQueryRes.building_address_city);
  });
});
