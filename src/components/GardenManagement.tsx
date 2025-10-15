import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Label } from "./ui/label";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  Edit,
  QrCode,
  Calendar,
  Eye,
  LogIn,
  Trash2,
  Printer,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { TaskReminder } from "./TaskReminder";

interface PlantCombo {
  id: number;
  userId: number;
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

interface CareGuide {
  step: number;
  title: string;
  description: string;
  frequency: string;
  tips: string[];
}

interface CareTask {
  id: number;
  type: "watering" | "fertilizing" | "pruning" | "sunbath" | "soil";
  name: string;
  frequency: string;
  lastDone?: string;
  nextDue: string;
  completed: boolean;
  notes?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  location: string;
  bio: string;
  avatar: string;
  joinDate: string;
  level: string;
  points: number;
}

interface GardenManagementProps {
  appData: any;
  setActiveSection?: (section: string) => void;
}

const API_BASE_URL = "http://localhost:3001";

export function GardenManagement({
  appData,
  setActiveSection,
}: GardenManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isAddPlantOpen, setIsAddPlantOpen] = useState(false);
  const [isEditComboOpen, setIsEditComboOpen] = useState(false);
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState<PlantCombo | null>(null);
  const [plantCombos, setPlantCombos] = useState<PlantCombo[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCombo, setEditingCombo] = useState<PlantCombo | null>(null);

  const [newCombo, setNewCombo] = useState({
    name: "",
    comboType: "",
    category: "",
    image: "",
    location: "",
    notes: "",
    plants: [] as string[],
    decorations: [] as string[],
  });

  const [newTask, setNewTask] = useState({
    type: "watering" as const,
    name: "",
    frequency: "",
    nextDue: "",
    notes: "",
  });

  const taskTypes = [
    { value: "watering", label: "Tưới nước" },
    { value: "fertilizing", label: "Bón phân" },
    { value: "pruning", label: "Tỉa cây" },
    { value: "sunbath", label: "Phơi nắng" },
    { value: "soil", label: "Thay đất" },
  ];

  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "Combo trang trí", name: "Combo trang trí" },
    { id: "Phong thủy", name: "Phong thủy" },
    { id: "Văn phòng", name: "Văn phòng" },
    { id: "Zen Garden", name: "Zen Garden" },
  ];

  const comboTypes = [
    "Combo Tình Yêu & Gắn Kết",
    "Combo Thu Hút Tài Lộc",
    "Combo Ổn Định và Thành Công",
    "Combo Đặc Biệt 20/10",
    "Combo Bình Yên & Gắn Kết Gia Đình",
    "Combo Bảo Vệ & Bình An",
  ];

  const plantOptions = [
    "Cây sống đời",
    "Cây kim tiền",
    "Cây kim ngân",
    "Cây trầu bà",
    "Lưỡi hổ mini",
    "Cây dollar",
    "Cây ngũ gia bì",
    "Sen đá",
  ];

  const decorationOptions = [
    "Figurines đôi tình nhân",
    "Tượng Thần Tài",
    "Tượng Phật nhỏ",
    "Tượng mèo thần tài",
    "Tượng vịt cute",
    "Sỏi trang trí",
    "Túi vàng mini",
    "Chậu gốm",
  ];

  const locations = [
    "Phòng khách",
    "Phòng ngủ",
    "Ban công",
    "Bàn làm việc",
    "Phòng bếp",
    "Phòng tắm",
  ];

  // Hàm kiểm tra trạng thái đăng nhập
  const checkAuthStatus = (): User | null => {
    if (appData?.user) {
      return appData.user;
    }

    try {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("currentUser");

      if (token && userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch (error) {
      console.error("Lỗi khi kiểm tra trạng thái đăng nhập:", error);
      return null;
    }
  };

  // Hàm fetch plant combos từ API
  const fetchPlantCombos = async () => {
    try {
      setLoading(true);
      const user = checkAuthStatus();

      if (!user) {
        setError("Vui lòng đăng nhập để xem combo");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/plant-combos?userId=${user.id}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          setPlantCombos([]);
          return;
        }
        throw new Error("Không thể tải dữ liệu combo");
      }

      const data = await response.json();
      setPlantCombos(data.plantCombos || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching plant combos:", err);
      if (currentUser) {
        setPlantCombos([]);
        setError("Không thể kết nối đến server, sử dụng dữ liệu cục bộ");
      } else {
        setError(err instanceof Error ? err.message : "Lỗi khi tải dữ liệu");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddCombo = async () => {
    try {
      const user = checkAuthStatus();
      if (!user) {
        setError("Vui lòng đăng nhập để thêm combo");
        window.location.href = "/login";
        return;
      }

      if (!newCombo.name || !newCombo.comboType) {
        setError("Vui lòng điền đầy đủ thông tin bắt buộc");
        return;
      }

      const comboData = {
        userId: user.id,
        name: newCombo.name,
        comboType: newCombo.comboType,
        category: newCombo.category || "Combo trang trí",
        image: newCombo.image || "/images/default-combo.jpg",
        location: newCombo.location,
        notes: newCombo.notes,
        plants: newCombo.plants,
        decorations: newCombo.decorations,
        careLevel: "Dễ",
        health: 85,
        careSchedule: [
          {
            id: Date.now(),
            type: "watering" as const,
            name: "Tưới nước",
            frequency: "3 ngày/lần",
            nextDue: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
            completed: false,
            notes: "Tưới nước cho combo",
          },
        ],
        careGuide: [],
        qrCode: `COMBO-${Date.now()}`,
        dateAdded: new Date().toISOString().split("T")[0],
        lastCared: new Date().toISOString().split("T")[0],
        nextCare: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      };

      const response = await fetch(`${API_BASE_URL}/api/plant-combos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(comboData),
      });

      if (!response.ok) {
        throw new Error("Không thể thêm combo mới");
      }

      const newComboData = await response.json();
      setPlantCombos([...plantCombos, newComboData]);
      setNewCombo({
        name: "",
        comboType: "",
        category: "",
        image: "",
        location: "",
        notes: "",
        plants: [],
        decorations: [],
      });
      setIsAddPlantOpen(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi khi thêm combo");
      console.error("Error adding combo:", err);
    }
  };

  const handleUpdateCombo = async () => {
    if (!editingCombo) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/plant-combos/${editingCombo.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingCombo),
        }
      );

      if (!response.ok) {
        throw new Error("Không thể cập nhật combo");
      }

      const updatedCombo = await response.json();
      setPlantCombos(
        plantCombos.map((combo) =>
          combo.id === editingCombo.id ? updatedCombo : combo
        )
      );
      // Cập nhật selectedCombo nếu nó đang được chọn
      if (selectedCombo && selectedCombo.id === editingCombo.id) {
        setSelectedCombo(updatedCombo);
      }
      setIsEditComboOpen(false);
      setEditingCombo(null); // Reset editingCombo
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi khi cập nhật combo");
      console.error("Error updating combo:", err);
    }
  };

  const handleAddTask = async () => {
    if (!selectedCombo) return;

    try {
      const taskData = {
        id: Date.now(),
        type: newTask.type,
        name:
          newTask.name ||
          taskTypes.find((t) => t.value === newTask.type)?.label ||
          "Công việc mới",
        frequency: newTask.frequency,
        nextDue: newTask.nextDue,
        notes: newTask.notes,
        completed: false,
      };

      const updatedCombo = {
        ...selectedCombo,
        careSchedule: [...selectedCombo.careSchedule, taskData],
      };

      const response = await fetch(
        `${API_BASE_URL}/api/plant-combos/${selectedCombo.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCombo),
        }
      );

      if (!response.ok) {
        throw new Error("Không thể thêm lịch chăm sóc");
      }

      const updatedComboData = await response.json();
      setPlantCombos(
        plantCombos.map((combo) =>
          combo.id === selectedCombo.id ? updatedComboData : combo
        )
      );
      setSelectedCombo(updatedComboData);
      setNewTask({
        type: "watering",
        name: "",
        frequency: "",
        nextDue: "",
        notes: "",
      });
      setIsScheduleDialogOpen(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi khi thêm lịch");
      console.error("Error adding task:", err);
    }
  };

  // Hàm tạo diary entry từ task
  const createDiaryEntryForTask = async (combo: PlantCombo, task: CareTask) => {
    try {
      const user = checkAuthStatus();
      if (!user) return;

      const today = new Date().toISOString().split("T")[0];
      const activityIconMap: { [key: string]: string } = {
        watering: "Droplets",
        fertilizing: "Zap",
        pruning: "Scissors",
        sunbath: "Sun",
        soil: "Edit",
      };

      const newDiaryEntry = {
        userId: user.id,
        date: today,
        plantName: combo.name,
        plantId: combo.id,
        activities: [
          {
            id: Date.now(),
            type: task.type,
            name: task.name,
            time: new Date().toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            completed: true,
            notes:
              task.notes ||
              `Hoàn thành ${task.name.toLowerCase()} từ lịch chăm sóc`,
            icon: activityIconMap[task.type] || "Plus",
            amount: task.type === "watering" ? "200ml" : undefined,
          },
        ],
        notes: `Tự động ghi nhận từ lịch chăm sóc: ${task.name}`,
        mood: "good" as const,
        createdAt: new Date().toISOString(),
      };

      const response = await fetch(`${API_BASE_URL}/api/diary-entries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDiaryEntry),
      });

      if (!response.ok) {
        throw new Error("Không thể tạo nhật ký");
      }

      // Có thể cập nhật state diaryEntries nếu cần, nhưng vì đang ở GardenManagement nên không cần
      console.log("Đã tạo diary entry cho task");
    } catch (err) {
      console.error("Error creating diary entry for task:", err);
    }
  };

  const handleToggleCareTask = async (comboId: number, taskId: number) => {
    try {
      const combo = plantCombos.find((c) => c.id === comboId);
      if (!combo) return;

      const task = combo.careSchedule.find((t) => t.id === taskId);
      if (!task) return;

      const updatedCompleted = !task.completed;

      const response = await fetch(
        `${API_BASE_URL}/api/plant-combos/${comboId}/tasks/${taskId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ completed: updatedCompleted }),
        }
      );

      if (response.ok) {
        // Nếu task được đánh dấu là hoàn thành, thì tạo diary entry
        if (updatedCompleted) {
          await createDiaryEntryForTask(combo, task);
        }
      }
      if (!response.ok) {
        throw new Error("Không thể cập nhật task");
      }

      const updatedTask = await response.json();

      setPlantCombos(
        plantCombos.map((combo) => {
          if (combo.id === comboId) {
            return {
              ...combo,
              careSchedule: combo.careSchedule.map((task) =>
                task.id === taskId ? updatedTask : task
              ),
            };
          }
          return combo;
        })
      );
    } catch (err) {
      console.error("Error updating task:", err);
      // Fallback to local update
      setPlantCombos(
        plantCombos.map((combo) => {
          if (combo.id === comboId) {
            return {
              ...combo,
              careSchedule: combo.careSchedule.map((task) =>
                task.id === taskId
                  ? {
                      ...task,
                      completed: !task.completed,
                      lastDone: !task.completed
                        ? new Date().toISOString().split("T")[0]
                        : task.lastDone,
                    }
                  : task
              ),
            };
          }
          return combo;
        })
      );
    }
  };

  const handleDeleteCombo = async (comboId: number) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/plant-combos/${comboId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Không thể xóa combo");
      }

      setPlantCombos(plantCombos.filter((combo) => combo.id !== comboId));
      setSelectedCombo(null);
    } catch (err) {
      console.error("Error deleting combo:", err);
      setError("Lỗi khi xóa combo");
    }
  };

  const handlePrintQrCode = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow && selectedCombo) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${selectedCombo.name}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 20px;
              }
              .qr-container { 
                margin: 20px auto; 
                max-width: 300px;
              }
              .combo-info { 
                margin: 20px 0;
                text-align: left;
              }
              @media print {
                body { padding: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <h1>${selectedCombo.name}</h1>
            <div class="qr-container">
              <div style="padding: 20px; border: 2px solid #000; display: inline-block;">
                <div style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">QR CODE</div>
                <div style="font-size: 18px; margin-bottom: 10px;">${
                  selectedCombo.qrCode
                }</div>
                <div style="font-size: 14px; color: #666;">Quét QR code để xem thông tin combo</div>
              </div>
            </div>
            <div class="combo-info">
              <p><strong>Loại combo:</strong> ${selectedCombo.comboType}</p>
              <p><strong>Vị trí:</strong> ${selectedCombo.location}</p>
              <p><strong>Ngày tạo:</strong> ${new Date(
                selectedCombo.dateAdded
              ).toLocaleDateString("vi-VN")}</p>
            </div>
            <button class="no-print" onclick="window.print()">In trang</button>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleLoginRedirect = () => {
    window.location.href = "/login";
  };

  useEffect(() => {
    const user = checkAuthStatus();
    if (user) {
      setCurrentUser(user);
      fetchPlantCombos();
    } else {
      setLoading(false);
      setError("Vui lòng đăng nhập để xem combo");
    }
  }, [appData]);

  const calculateComboHealth = (combo: PlantCombo) => {
    return combo.health;
  };

  const getHealthColor = (health: number) => {
    if (health >= 80) return "text-green-600";
    if (health >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getCareStatusColor = (nextCare: string) => {
    const today = new Date();
    const careDate = new Date(nextCare);
    const diffDays = Math.ceil(
      (careDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) return "text-red-600";
    if (diffDays <= 1) return "text-yellow-600";
    return "text-green-600";
  };

  // Sửa lỗi filter - sử dụng category id thay vì name
  const filteredCombos = plantCombos.filter((combo) => {
    const matchesSearch =
      combo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      combo.comboType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      combo.plants.some((plant) =>
        plant.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      filterCategory === "all" || combo.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-full p-4 mb-4">
            <LogIn className="h-12 w-12 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Vui lòng đăng nhập
          </h2>
          <p className="text-gray-600 mb-6 max-w-md">
            Bạn cần đăng nhập để xem và quản lý các combo cây cảnh của mình.
          </p>
          <Button
            onClick={handleLoginRedirect}
            className="bg-green-600 hover:bg-green-700"
            size="lg"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Đăng nhập ngay
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <TaskReminder
        combos={plantCombos}
        onTaskComplete={handleToggleCareTask}
      />

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý combo cây cảnh
          </h1>
          <p className="text-gray-600 mt-2">
            Theo dõi và chăm sóc {plantCombos.length} combo cây cảnh trong không
            gian của bạn
            {currentUser && ` - Chào ${currentUser.name}`}
          </p>
        </div>

        <Dialog open={isAddPlantOpen} onOpenChange={setIsAddPlantOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Thêm combo mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Tạo combo cây cảnh mới</DialogTitle>
              <DialogDescription>
                Điền thông tin combo để tạo bộ sưu tập cây cảnh đẹp mắt
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên combo</Label>
                  <Input
                    id="name"
                    value={newCombo.name}
                    onChange={(e) =>
                      setNewCombo({ ...newCombo, name: e.target.value })
                    }
                    placeholder="Ví dụ: Combo Mini Garden Fairy"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comboType">Loại combo</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={newCombo.comboType}
                    onChange={(e) =>
                      setNewCombo({ ...newCombo, comboType: e.target.value })
                    }
                  >
                    <option value="">Chọn loại combo</option>
                    {comboTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Danh mục</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={newCombo.category}
                    onChange={(e) =>
                      setNewCombo({ ...newCombo, category: e.target.value })
                    }
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.slice(1).map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Vị trí</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={newCombo.location}
                    onChange={(e) =>
                      setNewCombo({ ...newCombo, location: e.target.value })
                    }
                  >
                    <option value="">Chọn vị trí</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cây trong combo</Label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {plantOptions.map((plant) => (
                    <label key={plant} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newCombo.plants.includes(plant)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewCombo({
                              ...newCombo,
                              plants: [...newCombo.plants, plant],
                            });
                          } else {
                            setNewCombo({
                              ...newCombo,
                              plants: newCombo.plants.filter(
                                (p) => p !== plant
                              ),
                            });
                          }
                        }}
                      />
                      <span className="text-sm">{plant}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Đồ trang trí</Label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {decorationOptions.map((decoration) => (
                    <label
                      key={decoration}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        checked={newCombo.decorations.includes(decoration)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewCombo({
                              ...newCombo,
                              decorations: [
                                ...newCombo.decorations,
                                decoration,
                              ],
                            });
                          } else {
                            setNewCombo({
                              ...newCombo,
                              decorations: newCombo.decorations.filter(
                                (d) => d !== decoration
                              ),
                            });
                          }
                        }}
                      />
                      <span className="text-sm">{decoration}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">URL hình ảnh</Label>
                <Input
                  id="image"
                  value={newCombo.image}
                  onChange={(e) =>
                    setNewCombo({ ...newCombo, image: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Ghi chú</Label>
                <Textarea
                  id="notes"
                  value={newCombo.notes}
                  onChange={(e) =>
                    setNewCombo({ ...newCombo, notes: e.target.value })
                  }
                  placeholder="Mô tả về combo..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsAddPlantOpen(false)}
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleAddCombo}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Tạo combo
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm combo theo tên..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            className="px-3 py-2 border rounded-md"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && plantCombos.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <div className="text-yellow-700 text-sm">{error}</div>
        </div>
      )}

      {/* Combo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCombos.map((combo) => (
          <Card
            key={combo.id}
            className="hover:shadow-lg transition-shadow overflow-hidden"
          >
            <div className="relative">
              <ImageWithFallback
                src={combo.image}
                alt={combo.name}
                className="w-full h-48 object-cover"
              />
              <Badge className="absolute top-2 right-2 bg-white/90 text-gray-700">
                {combo.careLevel}
              </Badge>
              <div className="absolute top-2 left-2">
                <Badge
                  className={`${getCareStatusColor(
                    combo.nextCare
                  )} bg-white/90`}
                >
                  {(() => {
                    const diffDays = Math.ceil(
                      (new Date(combo.nextCare).getTime() -
                        new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                    );
                    if (diffDays < 0) return "Quá hạn";
                    if (diffDays === 0) return "Hôm nay";
                    if (diffDays === 1) return "Ngày mai";
                    return `${diffDays} ngày nữa`;
                  })()}
                </Badge>
              </div>
            </div>

            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{combo.name}</CardTitle>
                  <p className="text-sm text-gray-600 italic">
                    {combo.comboType}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {combo.plants.slice(0, 2).map((plant, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {plant}
                      </Badge>
                    ))}
                    {combo.plants.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{combo.plants.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCombo(combo)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                {/* Health Status */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Sức khỏe combo</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          calculateComboHealth(combo) >= 80
                            ? "bg-green-500"
                            : calculateComboHealth(combo) >= 60
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${calculateComboHealth(combo)}%` }}
                      ></div>
                    </div>
                    <span
                      className={`text-sm font-medium ${getHealthColor(
                        calculateComboHealth(combo)
                      )}`}
                    >
                      {calculateComboHealth(combo)}%
                    </span>
                  </div>
                </div>

                {/* Location and Components */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Vị trí</span>
                    <span className="text-sm font-medium">
                      {combo.location}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Số cây</span>
                    <span className="text-sm font-medium">
                      {combo.plants.length} cây
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Trang trí</span>
                    <span className="text-sm font-medium">
                      {combo.decorations.length} món
                    </span>
                  </div>
                </div>

                {/* Care Tasks */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">
                      Công việc hôm nay
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {
                        combo.careSchedule.filter((task) => {
                          const today = new Date().toISOString().split("T")[0];
                          return task.nextDue <= today && !task.completed;
                        }).length
                      }{" "}
                      việc
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    {combo.careSchedule
                      .filter((task) => {
                        const today = new Date().toISOString().split("T")[0];
                        return task.nextDue <= today;
                      })
                      .slice(0, 2)
                      .map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleToggleCareTask(combo.id, task.id)
                              }
                              className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                task.completed
                                  ? "bg-green-600 border-green-600"
                                  : "border-gray-300 hover:border-green-400"
                              }`}
                            >
                              {task.completed && (
                                <CheckCircle2 className="h-3 w-3 text-white" />
                              )}
                            </button>
                            <span
                              className={
                                task.completed
                                  ? "line-through text-gray-500"
                                  : ""
                              }
                            >
                              {task.name}
                            </span>
                          </div>
                          {!task.completed && (
                            <Clock className="h-3 w-3 text-gray-400" />
                          )}
                        </div>
                      ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <QrCode className="h-3 w-3 mr-1" />
                    QR: {combo.qrCode}
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => setSelectedCombo(combo)}
                  >
                    Xem hướng dẫn
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCombos.length === 0 &&
        plantCombos.length === 0 &&
        currentUser && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">Chưa có combo nào được tạo</div>
            <Button
              onClick={() => setIsAddPlantOpen(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tạo combo đầu tiên
            </Button>
          </div>
        )}

      {/* Combo Detail Dialog */}
      <Dialog
        open={!!selectedCombo}
        onOpenChange={() => setSelectedCombo(null)}
      >
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedCombo?.name}</DialogTitle>
            <DialogDescription>
              Chi tiết thông tin và hướng dẫn chăm sóc combo cây cảnh
            </DialogDescription>
          </DialogHeader>
          {selectedCombo && (
            <div className="space-y-6">
              {/* Combo Image */}
              <ImageWithFallback
                src={selectedCombo.image}
                alt={selectedCombo.name}
                className="w-full h-64 object-cover rounded-lg"
              />

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Thông tin combo</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loại combo:</span>
                      <span className="font-medium">
                        {selectedCombo.comboType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Danh mục:</span>
                      <span className="font-medium">
                        {selectedCombo.category}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vị trí:</span>
                      <span className="font-medium">
                        {selectedCombo.location}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngày tạo:</span>
                      <span className="font-medium">
                        {new Date(selectedCombo.dateAdded).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Tình trạng</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sức khỏe:</span>
                      <Badge
                        className={`${getHealthColor(
                          calculateComboHealth(selectedCombo)
                        )} bg-transparent border`}
                      >
                        {calculateComboHealth(selectedCombo)}% -{" "}
                        {calculateComboHealth(selectedCombo) >= 80
                          ? "Tốt"
                          : calculateComboHealth(selectedCombo) >= 60
                          ? "Bình thường"
                          : "Cần chăm sóc"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Chăm sóc cuối:</span>
                      <span className="font-medium">
                        {new Date(selectedCombo.lastCared).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Chăm sóc tiếp:</span>
                      <span
                        className={`font-medium ${getCareStatusColor(
                          selectedCombo.nextCare
                        )}`}
                      >
                        {new Date(selectedCombo.nextCare).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mã QR:</span>
                      <span className="font-medium">
                        {selectedCombo.qrCode}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Components */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">🌱 Cây trong combo</h4>
                  <div className="space-y-1">
                    {selectedCombo.plants.map((plant, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        {plant}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">🎨 Đồ trang trí</h4>
                  <div className="space-y-1">
                    {selectedCombo.decorations.map((decoration, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        {decoration}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Care Guide */}
              {selectedCombo.careGuide &&
                selectedCombo.careGuide.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">
                      📋 Hướng dẫn chăm sóc chi tiết
                    </h4>
                    <div className="space-y-4">
                      {selectedCombo.careGuide.map((guide) => (
                        <div
                          key={guide.step}
                          className="border rounded-lg p-4 bg-green-50"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                              {guide.step}
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-green-800 mb-1">
                                {guide.title}
                              </h5>
                              <p className="text-sm text-gray-700 mb-2">
                                {guide.description}
                              </p>
                              <div className="flex items-center gap-2 mb-3">
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-white"
                                >
                                  {guide.frequency}
                                </Badge>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-600">
                                  💡 Mẹo hay:
                                </p>
                                {guide.tips.map((tip, index) => (
                                  <div
                                    key={index}
                                    className="flex items-start gap-2 text-sm text-gray-600"
                                  >
                                    <span className="text-green-600 mt-1">
                                      •
                                    </span>
                                    <span>{tip}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Current Care Tasks */}
              <div>
                <h4 className="font-medium mb-3">Lịch chăm sóc hiện tại</h4>
                <div className="space-y-3">
                  {selectedCombo.careSchedule.map((task) => (
                    <div key={task.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              handleToggleCareTask(selectedCombo.id, task.id)
                            }
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              task.completed
                                ? "bg-green-600 border-green-600"
                                : "border-gray-300 hover:border-green-400"
                            }`}
                          >
                            {task.completed && (
                              <CheckCircle2 className="h-4 w-4 text-white" />
                            )}
                          </button>
                          <div>
                            <span
                              className={`font-medium ${
                                task.completed
                                  ? "line-through text-gray-500"
                                  : ""
                              }`}
                            >
                              {task.name}
                            </span>
                            <p className="text-sm text-gray-600">
                              {task.frequency}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {new Date(task.nextDue).toLocaleDateString("vi-VN")}
                          </p>
                          {task.lastDone && (
                            <p className="text-xs text-gray-500">
                              Làm lần cuối:{" "}
                              {new Date(task.lastDone).toLocaleDateString(
                                "vi-VN"
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                      {task.notes && (
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {task.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedCombo.notes && (
                <div>
                  <h4 className="font-medium mb-2">Ghi chú</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {selectedCombo.notes}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 flex-wrap">
                <Button
                  variant="outline"
                  className="flex-1 min-w-[120px]"
                  onClick={() => {
                    setEditingCombo(selectedCombo);
                    setIsEditComboOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh sửa combo
                </Button>

                <Button
                  variant="outline"
                  className="flex-1 min-w-[120px]"
                  onClick={() => setIsScheduleDialogOpen(true)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Thêm lịch
                </Button>

                <Button
                  variant="outline"
                  className="flex-1 min-w-[120px]"
                  onClick={() => setIsQrDialogOpen(true)}
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  In QR Code
                </Button>

                <Button
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => {
                    if (
                      confirm(
                        `Bạn có chắc muốn xóa combo "${selectedCombo.name}"?`
                      )
                    ) {
                      handleDeleteCombo(selectedCombo.id);
                    }
                  }}
                >
                  Xóa combo
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog chỉnh sửa combo */}
      <Dialog open={isEditComboOpen} onOpenChange={setIsEditComboOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa combo</DialogTitle>
          </DialogHeader>
          {editingCombo && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Tên combo</Label>
                  <Input
                    id="edit-name"
                    value={editingCombo.name}
                    onChange={(e) =>
                      setEditingCombo({
                        // Sửa từ setSelectedCombo thành setEditingCombo
                        ...editingCombo,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-comboType">Loại combo</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={editingCombo.comboType}
                    onChange={(e) =>
                      setEditingCombo({
                        // Sửa từ setSelectedCombo thành setEditingCombo
                        ...editingCombo,
                        comboType: e.target.value,
                      })
                    }
                  >
                    {comboTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Danh mục</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={editingCombo.category}
                    onChange={(e) =>
                      setEditingCombo({
                        // Sửa từ setSelectedCombo thành setEditingCombo
                        ...editingCombo,
                        category: e.target.value,
                      })
                    }
                  >
                    {categories.slice(1).map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-location">Vị trí</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={editingCombo.location}
                    onChange={(e) =>
                      setEditingCombo({
                        ...editingCombo,
                        location: e.target.value,
                      })
                    }
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-notes">Ghi chú</Label>
                <Textarea
                  id="edit-notes"
                  value={editingCombo.notes}
                  onChange={(e) =>
                    setEditingCombo({
                      ...editingCombo,
                      notes: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsEditComboOpen(false)}
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleUpdateCombo}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Lưu thay đổi
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog thêm lịch chăm sóc */}
      <Dialog
        open={isScheduleDialogOpen}
        onOpenChange={setIsScheduleDialogOpen}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Thêm lịch chăm sóc</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="task-type">Loại công việc</Label>
              <select
                id="task-type"
                className="w-full p-2 border rounded-md"
                value={newTask.type}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    type: e.target.value as any,
                  })
                }
              >
                {taskTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-name">Tên công việc</Label>
              <Input
                id="task-name"
                value={newTask.name}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    name: e.target.value,
                  })
                }
                placeholder="Nhập tên công việc"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-frequency">Tần suất</Label>
              <Input
                id="task-frequency"
                value={newTask.frequency}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    frequency: e.target.value,
                  })
                }
                placeholder="Ví dụ: 3 ngày/lần"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-nextDue">Ngày tiếp theo</Label>
              <Input
                id="task-nextDue"
                type="date"
                value={newTask.nextDue}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    nextDue: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-notes">Ghi chú</Label>
              <Textarea
                id="task-notes"
                value={newTask.notes}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    notes: e.target.value,
                  })
                }
                rows={2}
              />
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsScheduleDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button
                onClick={handleAddTask}
                className="bg-green-600 hover:bg-green-700"
              >
                Thêm lịch
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog QR Code */}
      <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>QR Code - {selectedCombo?.name}</DialogTitle>
          </DialogHeader>
          {selectedCombo && (
            <div className="space-y-4 text-center">
              <div className="border-2 border-gray-300 p-4 inline-block">
                <div className="text-xl font-bold mb-2">QR CODE</div>
                <div className="text-2xl font-mono mb-2">
                  {selectedCombo.qrCode}
                </div>
                <div className="text-sm text-gray-600">
                  Quét để xem thông tin combo
                </div>
              </div>

              <div className="text-left space-y-2">
                <p>
                  <strong>Combo:</strong> {selectedCombo.name}
                </p>
                <p>
                  <strong>Loại:</strong> {selectedCombo.comboType}
                </p>
                <p>
                  <strong>Vị trí:</strong> {selectedCombo.location}
                </p>
                <p>
                  <strong>Mã:</strong> {selectedCombo.qrCode}
                </p>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsQrDialogOpen(false)}
                >
                  Đóng
                </Button>
                <Button
                  onClick={handlePrintQrCode}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  In QR Code
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
