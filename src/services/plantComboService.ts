// services/plantComboService.ts
const API_BASE_URL = 'http://localhost:3001/api';

export interface PlantCombo {
  id: number;
  userId?: number;
  name: string;
  comboType: string;
  category: string;
  image: string;
  dateAdded: string;
  lastCared: string;
  nextCare: string;
  careLevel: "Dễ" | "Trung bình" | "Khó";
  health: number;
  location: string;
  notes: string;
  qrCode: string;
  careSchedule: CareTask[];
  plants: string[];
  careGuide: CareGuide[];
  decorations: string[];
}

export interface CareGuide {
  step: number;
  title: string;
  description: string;
  frequency: string;
  tips: string[];
}

export interface CareTask {
  id: number;
  type: "watering" | "fertilizing" | "pruning" | "sunbath" | "soil";
  name: string;
  frequency: string;
  lastDone?: string;
  nextDue: string;
  completed: boolean;
  notes?: string;
}

class PlantComboService {
  // GET - Lấy tất cả combos của user
  async getUserCombos(userId: number): Promise<PlantCombo[]> {
    const response = await fetch(`${API_BASE_URL}/plant-combos?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch plant combos');
    }
    const data = await response.json();
    return data.plantCombos || [];
  }

  // POST - Thêm combo mới
  async addCombo(combo: Omit<PlantCombo, 'id'>): Promise<PlantCombo> {
    const response = await fetch(`${API_BASE_URL}/plant-combos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(combo),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add plant combo');
    }
    
    return await response.json();
  }

  // PUT - Cập nhật combo
  async updateCombo(id: number, combo: Partial<PlantCombo>): Promise<PlantCombo> {
    const response = await fetch(`${API_BASE_URL}/plant-combos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(combo),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update plant combo');
    }
    
    return await response.json();
  }

  // DELETE - Xóa combo
  async deleteCombo(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/plant-combos/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete plant combo');
    }
  }

  // PATCH - Cập nhật task
  async updateTask(comboId: number, taskId: number, completed: boolean): Promise<CareTask> {
    const response = await fetch(`${API_BASE_URL}/plant-combos/${comboId}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update task');
    }
    
    return await response.json();
  }
}

export const plantComboService = new PlantComboService();