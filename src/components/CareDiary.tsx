import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar } from "./ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Calendar as CalendarIcon,
  Plus,
  Droplets,
  Sun,
  Scissors,
  Zap,
  Edit,
  Camera,
  CheckCircle2,
  Clock,
  Thermometer,
  Cloud,
  Download,
  AlertCircle,
  Trash2,
  Save,
  X,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface DiaryEntry {
  id: number;
  date: string;
  plantName: string;
  plantId: number;
  activities: Activity[];
  weather: {
    temperature: string;
    condition: string;
    humidity: string;
  };
  notes?: string;
  photos?: string[];
  mood?: "good" | "normal" | "concerning";
  userId?: number;
}

interface Activity {
  id: number;
  type: "watering" | "fertilizing" | "pruning" | "sunbath" | "soil" | "inspection" | "other";
  name: string;
  time: string;
  completed: boolean;
  notes?: string;
  icon: string;
  duration?: string;
  amount?: string;
}

interface PlantCombo {
  id: number;
  userId: number;
  name: string;
  comboType: string;
  category: string;
  image: string;
  careSchedule: CareTask[];
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
}

interface CareDiaryProps {
  appData: any;
}

const API_BASE_URL = "http://localhost:3001";

export function CareDiary({ appData }: CareDiaryProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<"calendar" | "timeline">("calendar");
  const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);
  const [isEditEntryOpen, setIsEditEntryOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [filterPlant, setFilterPlant] = useState("all");
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [plantCombos, setPlantCombos] = useState<PlantCombo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [syncedTasks, setSyncedTasks] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<DiaryEntry | null>(null);

  const activityTypes = [
    { type: "watering", name: "Tưới nước", icon: "Droplets", color: "text-blue-500" },
    { type: "fertilizing", name: "Bón phân", icon: "Zap", color: "text-green-500" },
    { type: "pruning", name: "Cắt tỉa", icon: "Scissors", color: "text-purple-500" },
    { type: "sunbath", name: "Tắm nắng", icon: "Sun", color: "text-yellow-500" },
    { type: "soil", name: "Xới đất", icon: "Edit", color: "text-brown-500" },
    { type: "inspection", name: "Kiểm tra", icon: "Camera", color: "text-gray-500" },
    { type: "other", name: "Khác", icon: "Plus", color: "text-gray-500" }
  ];

  const [newEntry, setNewEntry] = useState({
    plantName: "",
    activities: [] as any[],
    weather: { temperature: "", condition: "", humidity: "" },
    notes: "",
    photos: [] as string[],
  });

  const [editEntry, setEditEntry] = useState<DiaryEntry | null>(null);

  const weatherConditions = ["Nắng", "Mây", "Mưa", "Nắng ít", "Nhiều mây", "Mưa nhẹ"];

  // Hàm kiểm tra trạng thái đăng nhập
  const checkAuthStatus = useCallback((): User | null => {
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
  }, [appData]);

  // Hàm fetch diary entries từ API
  const fetchDiaryEntries = useCallback(async () => {
    try {
      setLoading(true);
      const user = checkAuthStatus();
      if (!user) {
        setError("Vui lòng đăng nhập để xem nhật ký");
        setLoading(false);
        return;
      }
      const response = await fetch(`${API_BASE_URL}/api/diary-entries?userId=${user.id}`);
      if (!response.ok) {
        if (response.status === 404) {
          setDiaryEntries([]);
          return;
        }
        throw new Error("Không thể tải dữ liệu nhật ký");
      }
      const data = await response.json();
      setDiaryEntries(data.diaryEntries || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching diary entries:", err);
      setError(err instanceof Error ? err.message : "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [checkAuthStatus]);

  // Hàm fetch plant combos từ API
  const fetchPlantCombos = useCallback(async () => {
    try {
      const user = checkAuthStatus();
      if (!user) return;
      const response = await fetch(`${API_BASE_URL}/api/plant-combos?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setPlantCombos(data.plantCombos || []);
      }
    } catch (err) {
      console.error("Error fetching plant combos:", err);
    }
  }, [checkAuthStatus]);

  // Hàm đồng bộ hóa các task đã hoàn thành từ Garden Management
  const syncCompletedTasks = useCallback(async () => {
    try {
      const user = checkAuthStatus();
      if (!user) return;
      const today = new Date().toISOString().split("T")[0];
      const completedTasksToday: any[] = [];
      plantCombos.forEach((combo) => {
        combo.careSchedule.forEach((task) => {
          if (task.completed && task.lastDone === today) {
            const taskKey = `${combo.id}-${task.id}-${today}`;
            if (!syncedTasks.has(taskKey)) {
              completedTasksToday.push({
                comboName: combo.name,
                comboId: combo.id,
                task: task,
                taskKey: taskKey,
              });
            }
          }
        });
      });
      const existingEntriesToday = diaryEntries.filter((entry) => entry.date === today);
      for (const { comboName, comboId, task, taskKey } of completedTasksToday) {
        const alreadyRecorded = existingEntriesToday.some(
          (entry) =>
            entry.plantName === comboName &&
            entry.activities.some(
              (activity) =>
                activity.name === task.name &&
                activity.notes?.includes(task.name)
            )
        );
        if (!alreadyRecorded) {
          await createDiaryEntryFromTask(comboName, comboId, task, taskKey);
        }
      }
    } catch (err) {
      console.error("Error syncing completed tasks:", err);
    }
  }, [checkAuthStatus, plantCombos, diaryEntries, syncedTasks]);

  // Hàm tạo diary entry từ task đã hoàn thành
  const createDiaryEntryFromTask = useCallback(
    async (comboName: string, comboId: number, task: CareTask, taskKey: string) => {
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
          plantName: comboName,
          plantId: comboId,
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
              notes: task.notes || `Hoàn thành ${task.name.toLowerCase()} từ lịch chăm sóc`,
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newDiaryEntry),
        });
        if (response.ok) {
          const newEntry = await response.json();
          setSyncedTasks((prev) => new Set([...prev, taskKey]));
          setDiaryEntries((prev) => [newEntry, ...prev]);
        }
      } catch (err) {
        console.error("Error creating diary entry from task:", err);
      }
    },
    [checkAuthStatus]
  );

  // Hàm thêm diary entry mới - ĐÃ SỬA
  const handleAddEntry = useCallback(async () => {
    try {
      const user = checkAuthStatus();
      if (!user) {
        setError("Vui lòng đăng nhập để thêm nhật ký");
        return;
      }
      if (!selectedDate || !newEntry.plantName) {
        setError("Vui lòng chọn ngày và combo cây");
        return;
      }
      const entryData = {
        userId: user.id,
        date: selectedDate.toISOString().split("T")[0],
        plantName: newEntry.plantName,
        plantId: plantCombos.find((p) => p.name === newEntry.plantName)?.id || 1,
        activities: newEntry.activities.map((activity) => ({
          ...activity,
          completed: activity.completed || false, // ✅ SỬA: Mặc định là false
          icon: activity.icon || "Plus",
        })),
        weather: newEntry.weather.temperature ? newEntry.weather : undefined,
        notes: newEntry.notes,
        photos: newEntry.photos.filter((p) => p.trim()),
        mood: "normal" as const,
        createdAt: new Date().toISOString(),
      };
      const response = await fetch(`${API_BASE_URL}/api/diary-entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entryData),
      });
      if (!response.ok) {
        throw new Error("Không thể thêm nhật ký");
      }
      const newEntryData = await response.json();
      setDiaryEntries((prev) => [newEntryData, ...prev]);
      setNewEntry({
        plantName: "",
        activities: [],
        weather: { temperature: "", condition: "", humidity: "" },
        notes: "",
        photos: [],
      });
      setIsAddEntryOpen(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi khi thêm nhật ký");
      console.error("Error adding diary entry:", err);
    }
  }, [checkAuthStatus, selectedDate, newEntry, plantCombos]);

  // Hàm cập nhật diary entry - MỚI THÊM
  const handleUpdateEntry = useCallback(async () => {
    if (!editEntry) return;
    try {
      const user = checkAuthStatus();
      if (!user) {
        setError("Vui lòng đăng nhập để cập nhật nhật ký");
        return;
      }
      const response = await fetch(`${API_BASE_URL}/api/diary-entries/${editEntry.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editEntry),
      });
      if (!response.ok) {
        throw new Error("Không thể cập nhật nhật ký");
      }
      const updatedEntry = await response.json();
      setDiaryEntries((prev) =>
        prev.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry))
      );
      setEditEntry(null);
      setIsEditEntryOpen(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi khi cập nhật nhật ký");
      console.error("Error updating diary entry:", err);
    }
  }, [checkAuthStatus, editEntry]);

  // Hàm xóa diary entry - MỚI THÊM
  const handleDeleteEntry = useCallback(async (entryId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/diary-entries/${entryId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Không thể xóa nhật ký");
      }
      setDiaryEntries((prev) => prev.filter((entry) => entry.id !== entryId));
      setDeleteDialogOpen(false);
      setEntryToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi khi xóa nhật ký");
      console.error("Error deleting diary entry:", err);
    }
  }, []);

  // Hàm mở dialog chỉnh sửa - MỚI THÊM
  const openEditDialog = (entry: DiaryEntry) => {
    setEditEntry(JSON.parse(JSON.stringify(entry))); // Deep copy
    setIsEditEntryOpen(true);
  };

  // Hàm mở dialog xóa - MỚI THÊM
  const openDeleteDialog = (entry: DiaryEntry) => {
    setEntryToDelete(entry);
    setDeleteDialogOpen(true);
  };

  // Các hàm xử lý activities cho form mới
  const addActivityToNewEntry = useCallback((activityType: any) => {
    const activity = {
      id: Date.now(),
      type: activityType.type,
      name: activityType.name,
      time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      completed: false, // ✅ Mặc định là false
      notes: "",
      icon: activityType.icon,
      amount: "",
    };
    setNewEntry((prev) => ({
      ...prev,
      activities: [...prev.activities, activity],
    }));
  }, []);

  const updateActivityInNewEntry = useCallback((activityId: number, field: string, value: any) => {
    setNewEntry((prev) => ({
      ...prev,
      activities: prev.activities.map((activity) =>
        activity.id === activityId ? { ...activity, [field]: value } : activity
      ),
    }));
  }, []);

  const removeActivityFromNewEntry = useCallback((activityId: number) => {
    setNewEntry((prev) => ({
      ...prev,
      activities: prev.activities.filter((a) => a.id !== activityId),
    }));
  }, []);

  // Các hàm xử lý activities cho form chỉnh sửa - MỚI THÊM
  const addActivityToEditEntry = useCallback((activityType: any) => {
    if (!editEntry) return;
    const activity = {
      id: Date.now(),
      type: activityType.type,
      name: activityType.name,
      time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      completed: false,
      notes: "",
      icon: activityType.icon,
      amount: "",
    };
    setEditEntry({
      ...editEntry,
      activities: [...editEntry.activities, activity],
    });
  }, [editEntry]);

  const updateActivityInEditEntry = useCallback((activityId: number, field: string, value: any) => {
    if (!editEntry) return;
    setEditEntry({
      ...editEntry,
      activities: editEntry.activities.map((activity) =>
        activity.id === activityId ? { ...activity, [field]: value } : activity
      ),
    });
  }, [editEntry]);

  const removeActivityFromEditEntry = useCallback((activityId: number) => {
    if (!editEntry) return;
    setEditEntry({
      ...editEntry,
      activities: editEntry.activities.filter((a) => a.id !== activityId),
    });
  }, [editEntry]);

  // Các hàm tiện ích
  const getSelectedDateEntries = () => {
    if (!selectedDate) return [];
    const dateString = selectedDate.toISOString().split("T")[0];
    return diaryEntries.filter((entry) => entry.date === dateString);
  };

  const getMoodColor = (mood?: string) => {
    switch (mood) {
      case "good": return "text-green-600 bg-green-100";
      case "concerning": return "text-red-600 bg-red-100";
      default: return "text-yellow-600 bg-yellow-100";
    }
  };

  const getMoodLabel = (mood?: string) => {
    switch (mood) {
      case "good": return "Tốt";
      case "concerning": return "Lo ngại";
      default: return "Bình thường";
    }
  };

  const getActivityIcon = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      Droplets, Sun, Scissors, Zap, Edit, Camera, Plus,
    };
    return iconMap[iconName] || Plus;
  };

  // Tính toán thống kê
  const totalActivities = diaryEntries.reduce((total, entry) => total + entry.activities.length, 0);
  const completedActivities = diaryEntries.reduce(
    (total, entry) => total + entry.activities.filter((a) => a.completed).length, 0
  );

  const upcomingTasks = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const tasks: any[] = [];
    plantCombos.forEach((combo) => {
      combo.careSchedule.forEach((task) => {
        if (!task.completed && task.nextDue >= today) {
          tasks.push({
            id: task.id,
            comboName: combo.name,
            comboId: combo.id,
            task: task,
            dueDate: task.nextDue,
          });
        }
      });
    });
    return tasks.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [plantCombos]);

  // Effects
  useEffect(() => {
    const user = checkAuthStatus();
    setCurrentUser(user);
  }, [appData, checkAuthStatus]);

  useEffect(() => {
    if (currentUser) {
      Promise.all([fetchDiaryEntries(), fetchPlantCombos()]).then(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
      setError("Vui lòng đăng nhập để xem nhật ký");
    }
  }, [currentUser, fetchDiaryEntries, fetchPlantCombos]);

  useEffect(() => {
    if (plantCombos.length > 0 && diaryEntries.length > 0) {
      const hasNewCompletedTasks = plantCombos.some((combo) =>
        combo.careSchedule.some(
          (task) =>
            task.completed &&
            task.lastDone === new Date().toISOString().split("T")[0] &&
            !syncedTasks.has(`${combo.id}-${task.id}-${new Date().toISOString().split("T")[0]}`)
        )
      );
      if (hasNewCompletedTasks) {
        syncCompletedTasks();
      }
    }
  }, [plantCombos, diaryEntries, syncedTasks, syncCompletedTasks]);

  useEffect(() => {
    const checkNewDay = () => {
      const today = new Date().toISOString().split("T")[0];
      const lastSyncDate = localStorage.getItem("lastSyncDate");
      if (lastSyncDate !== today) {
        setSyncedTasks(new Set());
        localStorage.setItem("lastSyncDate", today);
      }
    };
    checkNewDay();
    const interval = setInterval(checkNewDay, 60000);
    return () => clearInterval(interval);
  }, []);

  // Render loading
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  // Render not authenticated
  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-full p-4 mb-4">
            <AlertCircle className="h-12 w-12 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vui lòng đăng nhập</h2>
          <p className="text-gray-600 mb-6 max-w-md">
            Bạn cần đăng nhập để xem và quản lý nhật ký chăm sóc cây cảnh.
          </p>
          <Button onClick={() => (window.location.href = "/login")} className="bg-green-600 hover:bg-green-700" size="lg">
            Đăng nhập ngay
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nhật ký chăm sóc</h1>
          <p className="text-gray-600 mt-2">
            Ghi lại và theo dõi hoạt động chăm sóc cây hàng ngày
            {currentUser && ` - Chào ${currentUser.name}`}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
          <Dialog open={isAddEntryOpen} onOpenChange={setIsAddEntryOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Thêm nhật ký
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Thêm nhật ký mới</DialogTitle>
                <DialogDescription>Ghi lại hoạt động chăm sóc cây trong ngày</DialogDescription>
              </DialogHeader>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <div className="text-red-700 text-sm">{error}</div>
                </div>
              )}
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Combo cây cảnh</Label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={newEntry.plantName}
                      onChange={(e) => setNewEntry({ ...newEntry, plantName: e.target.value })}
                    >
                      <option value="">Chọn combo</option>
                      {plantCombos.map((combo) => (
                        <option key={combo.id} value={combo.name}>{combo.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Ngày</Label>
                    <Input
                      type="date"
                      value={selectedDate?.toISOString().split("T")[0] || ""}
                      onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    />
                  </div>
                </div>

                {/* Weather */}
                <div>
                  <Label className="mb-3 block">Thời tiết</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-sm">Nhiệt độ</Label>
                      <Input
                        placeholder="28°C"
                        value={newEntry.weather.temperature}
                        onChange={(e) => setNewEntry({ ...newEntry, weather: { ...newEntry.weather, temperature: e.target.value } })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm">Điều kiện</Label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={newEntry.weather.condition}
                        onChange={(e) => setNewEntry({ ...newEntry, weather: { ...newEntry.weather, condition: e.target.value } })}
                      >
                        <option value="">Chọn</option>
                        {weatherConditions.map((condition) => (
                          <option key={condition} value={condition}>{condition}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm">Độ ẩm</Label>
                      <Input
                        placeholder="65%"
                        value={newEntry.weather.humidity}
                        onChange={(e) => setNewEntry({ ...newEntry, weather: { ...newEntry.weather, humidity: e.target.value } })}
                      />
                    </div>
                  </div>
                </div>

                {/* Activities */}
                <div>
                  <Label className="mb-3 block">Hoạt động chăm sóc</Label>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {activityTypes.map((type) => (
                      <Button
                        key={type.type}
                        variant="outline"
                        size="sm"
                        onClick={() => addActivityToNewEntry(type)}
                        className="flex flex-col gap-1 h-auto p-3"
                      >
                        {type.icon === "Droplets" && <Droplets className={`h-4 w-4 ${type.color}`} />}
                        {type.icon === "Sun" && <Sun className={`h-4 w-4 ${type.color}`} />}
                        {type.icon === "Scissors" && <Scissors className={`h-4 w-4 ${type.color}`} />}
                        {type.icon === "Zap" && <Zap className={`h-4 w-4 ${type.color}`} />}
                        {type.icon === "Edit" && <Edit className={`h-4 w-4 ${type.color}`} />}
                        {type.icon === "Camera" && <Camera className={`h-4 w-4 ${type.color}`} />}
                        {type.icon === "Plus" && <Plus className={`h-4 w-4 ${type.color}`} />}
                        <span className="text-xs">{type.name}</span>
                      </Button>
                    ))}
                  </div>

                  {newEntry.activities.length > 0 && (
                    <div className="space-y-3">
                      {newEntry.activities.map((activity) => (
                        <div key={activity.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {activity.icon === "Droplets" && <Droplets className="h-4 w-4 text-blue-500" />}
                              {activity.icon === "Sun" && <Sun className="h-4 w-4 text-yellow-500" />}
                              {activity.icon === "Scissors" && <Scissors className="h-4 w-4 text-purple-500" />}
                              {activity.icon === "Zap" && <Zap className="h-4 w-4 text-green-500" />}
                              {activity.icon === "Edit" && <Edit className="h-4 w-4 text-brown-500" />}
                              {activity.icon === "Camera" && <Camera className="h-4 w-4 text-gray-500" />}
                              {activity.icon === "Plus" && <Plus className="h-4 w-4 text-gray-500" />}
                              <span className="font-medium">{activity.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="flex items-center gap-1 text-sm">
                                <input
                                  type="checkbox"
                                  checked={activity.completed || false}
                                  onChange={(e) => updateActivityInNewEntry(activity.id, "completed", e.target.checked)}
                                  className="rounded border-gray-300"
                                />
                                Hoàn thành
                              </label>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeActivityFromNewEntry(activity.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                ×
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <div>
                              <Label className="text-xs">Thời gian</Label>
                              <Input
                                type="time"
                                value={activity.time}
                                onChange={(e) => updateActivityInNewEntry(activity.id, "time", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Lượng/Thời lượng</Label>
                              <Input
                                placeholder="200ml hoặc 2 tiếng"
                                value={activity.amount || ""}
                                onChange={(e) => updateActivityInNewEntry(activity.id, "amount", e.target.value)}
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs">Ghi chú</Label>
                            <Textarea
                              placeholder="Chi tiết về hoạt động..."
                              value={activity.notes || ""}
                              onChange={(e) => updateActivityInNewEntry(activity.id, "notes", e.target.value)}
                              rows={2}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Photos */}
                <div className="space-y-2">
                  <Label>Hình ảnh (URL)</Label>
                  <Input
                    placeholder="https://..."
                    value={newEntry.photos[0] || ""}
                    onChange={(e) => setNewEntry({ ...newEntry, photos: e.target.value ? [e.target.value] : [] })}
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label>Ghi chú chung</Label>
                  <Textarea
                    placeholder="Nhận xét về tình trạng cây, điều đặc biệt..."
                    value={newEntry.notes}
                    onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setIsAddEntryOpen(false)} className="flex-1">
                    Hủy
                  </Button>
                  <Button onClick={handleAddEntry} className="flex-1 bg-green-600 hover:bg-green-700">
                    Lưu nhật ký
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CalendarIcon className="h-8 w-8 text-blue-600 bg-blue-100 p-2 rounded-lg" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Ngày ghi nhật ký</p>
                <p className="text-2xl font-bold">{diaryEntries.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle2 className="h-8 w-8 text-green-600 bg-green-100 p-2 rounded-lg" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Hoạt động hoàn thành</p>
                <p className="text-2xl font-bold">{completedActivities}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600 bg-orange-100 p-2 rounded-lg" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Công việc sắp tới</p>
                <p className="text-2xl font-bold">{upcomingTasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Tasks */}
      {upcomingTasks.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Công việc chăm sóc sắp tới</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingTasks.slice(0, 4).map(({ comboName, task, dueDate }) => (
                <div key={`${comboName}-${task.id}`} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{comboName}</h4>
                    <Badge variant="outline">{new Date(dueDate).toLocaleDateString("vi-VN")}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{task.name}</p>
                  <p className="text-xs text-gray-500">Tần suất: {task.frequency}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Lịch chăm sóc</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md"
                modifiers={{
                  hasEntry: diaryEntries.map((entry) => new Date(entry.date)),
                }}
                modifiersStyles={{
                  hasEntry: {
                    backgroundColor: "#22c55e",
                    color: "white",
                    borderRadius: "6px",
                  },
                }}
              />
              <div className="mt-4">
                <Label className="text-sm font-medium">Lọc theo combo</Label>
                <select
                  className="w-full mt-1 p-2 border rounded-md"
                  value={filterPlant}
                  onChange={(e) => setFilterPlant(e.target.value)}
                >
                  <option value="all">Tất cả combo</option>
                  {plantCombos.map((combo) => (
                    <option key={combo.id} value={combo.id}>{combo.name}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Diary Entries */}
        <div className="lg:col-span-3">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Nhật ký ngày {selectedDate?.toLocaleDateString("vi-VN")}</h3>
              <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                <TabsList>
                  <TabsTrigger value="calendar">Theo ngày</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {viewMode === "calendar" ? (
              getSelectedDateEntries().length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Chưa có nhật ký</h3>
                    <p className="text-gray-500 mb-4">Bạn chưa ghi nhật ký cho ngày này</p>
                    <Button onClick={() => setIsAddEntryOpen(true)} className="bg-green-600 hover:bg-green-700">
                      Thêm nhật ký đầu tiên
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                getSelectedDateEntries().map((entry) => (
                  <Card key={entry.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg text-green-700">{entry.plantName}</CardTitle>
                          <div className="flex items-center gap-4 mt-2">
                            {entry.weather && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Thermometer className="h-4 w-4" />
                                <span>{entry.weather.temperature}</span>
                                <Cloud className="h-4 w-4" />
                                <span>{entry.weather.condition}</span>
                              </div>
                            )}
                            <Badge className={getMoodColor(entry.mood)}>{getMoodLabel(entry.mood)}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditDialog(entry)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(entry)} className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Activities */}
                        <div>
                          <h4 className="font-medium mb-3">Hoạt động ({entry.activities.length})</h4>
                          <div className="space-y-2">
                            {entry.activities.map((activity) => (
                              <div key={activity.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-start gap-3">
                                  <div className={`p-1 rounded ${activity.completed ? "bg-green-600" : "bg-gray-300"}`}>
                                    {activity.icon === "Droplets" && <Droplets className={`h-4 w-4 ${activity.completed ? "text-white" : "text-gray-600"}`} />}
                                    {activity.icon === "Sun" && <Sun className={`h-4 w-4 ${activity.completed ? "text-white" : "text-gray-600"}`} />}
                                    {activity.icon === "Scissors" && <Scissors className={`h-4 w-4 ${activity.completed ? "text-white" : "text-gray-600"}`} />}
                                    {activity.icon === "Zap" && <Zap className={`h-4 w-4 ${activity.completed ? "text-white" : "text-gray-600"}`} />}
                                    {activity.icon === "Edit" && <Edit className={`h-4 w-4 ${activity.completed ? "text-white" : "text-gray-600"}`} />}
                                    {activity.icon === "Camera" && <Camera className={`h-4 w-4 ${activity.completed ? "text-white" : "text-gray-600"}`} />}
                                    {activity.icon === "Plus" && <Plus className={`h-4 w-4 ${activity.completed ? "text-white" : "text-gray-600"}`} />}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className={`font-medium ${activity.completed ? "" : "text-gray-500"}`}>{activity.name}</span>
                                      <span className="text-sm text-gray-500">{activity.time}</span>
                                      {activity.amount && <Badge variant="outline" className="text-xs">{activity.amount}</Badge>}
                                    </div>
                                    {activity.notes && <p className="text-sm text-gray-600 mt-1">{activity.notes}</p>}
                                  </div>
                                </div>
                                <Badge className={activity.completed ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                                  {activity.completed ? "Hoàn thành" : "Chưa hoàn thành"}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Photos */}
                        {entry.photos && entry.photos.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">Hình ảnh</h4>
                            <div className="grid grid-cols-3 gap-2">
                              {entry.photos.map((photo, index) => (
                                <ImageWithFallback
                                  key={index}
                                  src={photo}
                                  alt={`Photo ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80"
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Notes */}
                        {entry.notes && (
                          <div>
                            <h4 className="font-medium mb-2">Ghi chú</h4>
                            <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border">{entry.notes}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )
            ) : (
              // Timeline View
              <div className="space-y-4">
                {diaryEntries.slice(0, 10).map((entry, index) => (
                  <div key={entry.id} className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-medium">
                        {new Date(entry.date).getDate()}
                      </div>
                      {index < diaryEntries.length - 1 && <div className="w-0.5 h-16 bg-gray-300 mt-2"></div>}
                    </div>
                    <Card className="flex-1 border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{entry.plantName}</h4>
                            <p className="text-sm text-gray-500">
                              {new Date(entry.date).toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long" })}
                            </p>
                          </div>
                          <Badge className={getMoodColor(entry.mood)}>{getMoodLabel(entry.mood)}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <span>{entry.activities.length} hoạt động</span>
                          <span>•</span>
                          <span>{entry.activities.filter((a) => a.completed).length} hoàn thành</span>
                        </div>
                        {entry.notes && <p className="text-sm text-gray-700 line-clamp-2">{entry.notes}</p>}
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditEntryOpen} onOpenChange={setIsEditEntryOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa nhật ký</DialogTitle>
            <DialogDescription>Chỉnh sửa hoạt động chăm sóc cây</DialogDescription>
          </DialogHeader>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="text-red-700 text-sm">{error}</div>
            </div>
          )}
          {editEntry && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Combo cây cảnh</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={editEntry.plantName}
                    onChange={(e) => setEditEntry({ ...editEntry, plantName: e.target.value })}
                  >
                    <option value="">Chọn combo</option>
                    {plantCombos.map((combo) => (
                      <option key={combo.id} value={combo.name}>{combo.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Ngày</Label>
                  <Input
                    type="date"
                    value={editEntry.date}
                    onChange={(e) => setEditEntry({ ...editEntry, date: e.target.value })}
                  />
                </div>
              </div>

              {/* Weather */}
              <div>
                <Label className="mb-3 block">Thời tiết</Label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-sm">Nhiệt độ</Label>
                    <Input
                      placeholder="28°C"
                      value={editEntry.weather?.temperature || ""}
                      onChange={(e) => setEditEntry({ 
                        ...editEntry, 
                        weather: { 
                          ...editEntry.weather, 
                          temperature: e.target.value 
                        } 
                      })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm">Điều kiện</Label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={editEntry.weather?.condition || ""}
                      onChange={(e) => setEditEntry({ 
                        ...editEntry, 
                        weather: { 
                          ...editEntry.weather, 
                          condition: e.target.value 
                        } 
                      })}
                    >
                      <option value="">Chọn</option>
                      {weatherConditions.map((condition) => (
                        <option key={condition} value={condition}>{condition}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm">Độ ẩm</Label>
                    <Input
                      placeholder="65%"
                      value={editEntry.weather?.humidity || ""}
                      onChange={(e) => setEditEntry({ 
                        ...editEntry, 
                        weather: { 
                          ...editEntry.weather, 
                          humidity: e.target.value 
                        } 
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Activities */}
              <div>
                <Label className="mb-3 block">Hoạt động chăm sóc</Label>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {activityTypes.map((type) => (
                    <Button
                      key={type.type}
                      variant="outline"
                      size="sm"
                      onClick={() => addActivityToEditEntry(type)}
                      className="flex flex-col gap-1 h-auto p-3"
                    >
                      {type.icon === "Droplets" && <Droplets className={`h-4 w-4 ${type.color}`} />}
                      {type.icon === "Sun" && <Sun className={`h-4 w-4 ${type.color}`} />}
                      {type.icon === "Scissors" && <Scissors className={`h-4 w-4 ${type.color}`} />}
                      {type.icon === "Zap" && <Zap className={`h-4 w-4 ${type.color}`} />}
                      {type.icon === "Edit" && <Edit className={`h-4 w-4 ${type.color}`} />}
                      {type.icon === "Camera" && <Camera className={`h-4 w-4 ${type.color}`} />}
                      {type.icon === "Plus" && <Plus className={`h-4 w-4 ${type.color}`} />}
                      <span className="text-xs">{type.name}</span>
                    </Button>
                  ))}
                </div>

                {editEntry.activities.length > 0 && (
                  <div className="space-y-3">
                    {editEntry.activities.map((activity) => (
                      <div key={activity.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {activity.icon === "Droplets" && <Droplets className="h-4 w-4 text-blue-500" />}
                            {activity.icon === "Sun" && <Sun className="h-4 w-4 text-yellow-500" />}
                            {activity.icon === "Scissors" && <Scissors className="h-4 w-4 text-purple-500" />}
                            {activity.icon === "Zap" && <Zap className="h-4 w-4 text-green-500" />}
                            {activity.icon === "Edit" && <Edit className="h-4 w-4 text-brown-500" />}
                            {activity.icon === "Camera" && <Camera className="h-4 w-4 text-gray-500" />}
                            {activity.icon === "Plus" && <Plus className="h-4 w-4 text-gray-500" />}
                            <span className="font-medium">{activity.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="flex items-center gap-1 text-sm">
                              <input
                                type="checkbox"
                                checked={activity.completed}
                                onChange={(e) => updateActivityInEditEntry(activity.id, "completed", e.target.checked)}
                                className="rounded border-gray-300"
                              />
                              Hoàn thành
                            </label>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeActivityFromEditEntry(activity.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <div>
                            <Label className="text-xs">Thời gian</Label>
                            <Input
                              type="time"
                              value={activity.time}
                              onChange={(e) => updateActivityInEditEntry(activity.id, "time", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Lượng/Thời lượng</Label>
                            <Input
                              placeholder="200ml hoặc 2 tiếng"
                              value={activity.amount || ""}
                              onChange={(e) => updateActivityInEditEntry(activity.id, "amount", e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs">Ghi chú</Label>
                          <Textarea
                            placeholder="Chi tiết về hoạt động..."
                            value={activity.notes || ""}
                            onChange={(e) => updateActivityInEditEntry(activity.id, "notes", e.target.value)}
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Photos */}
              <div className="space-y-2">
                <Label>Hình ảnh (URL)</Label>
                <Input
                  placeholder="https://..."
                  value={editEntry.photos?.[0] || ""}
                  onChange={(e) => setEditEntry({ 
                    ...editEntry, 
                    photos: e.target.value ? [e.target.value] : [] 
                  })}
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label>Ghi chú chung</Label>
                <Textarea
                  placeholder="Nhận xét về tình trạng cây, điều đặc biệt..."
                  value={editEntry.notes || ""}
                  onChange={(e) => setEditEntry({ ...editEntry, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditEntryOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleUpdateEntry} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  Cập nhật
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa nhật ký này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          {entryToDelete && (
            <div className="py-4">
              <p className="text-sm text-gray-600">
                Nhật ký: <strong>{entryToDelete.plantName}</strong> - {entryToDelete.date}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Số hoạt động: {entryToDelete.activities.length}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Hủy
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => entryToDelete && handleDeleteEntry(entryToDelete.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}