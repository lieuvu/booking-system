interface BuildingAddress {
  id: number;
  street: string;
  number?: string | null;
  block_number?: string | null;
  city: string;
  postal_code: string;
}

// Export
export type { BuildingAddress };
