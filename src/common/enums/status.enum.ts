// Status values used by production lines and machines (Lab 04 / Lab 05)
export enum LineStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Maintenance = 'Maintenance',
}

export enum MachineStatus {
  Active = 'Active',
  Idle = 'Idle',
  Maintenance = 'Maintenance',
  Fault = 'Fault',
  Offline = 'Offline',
}

export enum UnitOfMeasure {
  Piece = 'Piece',
  Pack = 'Pack',
  Box = 'Box',
  Kilogram = 'Kilogram',
  Liter = 'Liter',
}