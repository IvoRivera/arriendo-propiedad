export interface InventoryItem {
  id: string;
  category: string;
  name: string;
  condition: string;
}

export const BASE_INVENTORY: InventoryItem[] = [
  { id: "kitchen-1", category: "Cocina", name: "Refrigerador", condition: "Excelente" },
  { id: "kitchen-2", category: "Cocina", name: "Microondas", condition: "Limpio/Operativo" },
  { id: "kitchen-3", category: "Cocina", name: "Encimera Eléctrica", condition: "Operativa" },
  { id: "kitchen-4", category: "Cocina", name: "Set de loza (4 pers.)", condition: "Completo" },
  { id: "living-1", category: "Living", name: "Smart TV 55\"", condition: "Operativo con control" },
  { id: "living-2", category: "Living", name: "Sofá principal", condition: "Sin manchas" },
  { id: "living-3", category: "Living", name: "Ventanal terraza", condition: "Limpio/Cierra bien" },
  { id: "bed-1", category: "Dormitorio Principal", name: "Cama Queen", condition: "Ropa blanca limpia" },
  { id: "bed-2", category: "Dormitorio 2", name: "2 Camas Single", condition: "Ropa blanca limpia" },
  { id: "bath-1", category: "Baño", name: "Ducha/Grifería", condition: "Sin fugas/Limpio" },
];
