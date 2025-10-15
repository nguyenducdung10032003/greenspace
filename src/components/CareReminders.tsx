// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import { Button } from "./ui/button";
// import { Badge } from "./ui/badge";
// import { Calendar } from "./ui/calendar";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
// import { Input } from "./ui/input";
// import { Label } from "./ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
// import { Switch } from "./ui/switch";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
// import { 
//   Calendar as CalendarIcon, 
//   Plus, 
//   Bell, 
//   Droplets, 
//   Scissors, 
//   Zap, 
//   RotateCcw,
//   Check,
//   X,
//   Settings
// } from "lucide-react";

// export function CareReminders() {
//   const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
//   const [isAddReminderOpen, setIsAddReminderOpen] = useState(false);
//   const [notifications, setNotifications] = useState({
//     email: true,
//     browser: true,
//     mobile: false
//   });

//   const [reminders, setReminders] = useState([
//     {
//       id: 1,
//       plantName: "Monstera của tôi",
//       task: "Tưới nước",
//       icon: Droplets,
//       dueDate: "2024-01-23",
//       time: "08:00",
//       frequency: "Mỗi 3 ngày",
//       priority: "high",
//       completed: false,
//       nextOccurrence: "2024-01-26"
//     },
//     {
//       id: 2,
//       plantName: "Sen đá cute",
//       task: "Tưới nước",
//       icon: Droplets,
//       dueDate: "2024-01-25",
//       time: "09:00",
//       frequency: "Mỗi tuần",
//       priority: "medium",
//       completed: false,
//       nextOccurrence: "2024-02-01"
//     },
//     {
//       id: 3,
//       plantName: "Lan Ý phòng ngủ",
//       task: "Bón phân",
//       icon: Zap,
//       dueDate: "2024-01-28",
//       time: "10:00",
//       frequency: "Mỗi tháng",
//       priority: "low",
//       completed: false,
//       nextOccurrence: "2024-02-28"
//     },
//     {
//       id: 4,
//       plantName: "Trầu bà",
//       task: "Cắt tỉa",
//       icon: Scissors,
//       dueDate: "2024-01-30",
//       time: "15:00",
//       frequency: "Mỗi 2 tuần",
//       priority: "medium",
//       completed: false,
//       nextOccurrence: "2024-02-13"
//     },
//     {
//       id: 5,
//       plantName: "Monstera của tôi",
//       task: "Thay chậu",
//       icon: RotateCcw,
//       dueDate: "2024-02-15",
//       time: "14:00",
//       frequency: "Mỗi 6 tháng",
//       priority: "low",
//       completed: false,
//       nextOccurrence: "2024-08-15"
//     }
//   ]);

//   const [newReminder, setNewReminder] = useState({
//     plantName: "",
//     task: "",
//     dueDate: "",
//     time: "",
//     frequency: "",
//     priority: "medium"
//   });

//   const taskTypes = [
//     { value: "watering", label: "Tưới nước", icon: Droplets },
//     { value: "fertilizing", label: "Bón phân", icon: Zap },
//     { value: "pruning", label: "Cắt tỉa", icon: Scissors },
//     { value: "repotting", label: "Thay chậu", icon: RotateCcw }
//   ];

//   const frequencies = [
//     "Hàng ngày",
//     "Mỗi 2 ngày",
//     "Mỗi 3 ngày",
//     "Mỗi tuần",
//     "Mỗi 2 tuần",
//     "Mỗi tháng",
//     "Mỗi 3 tháng",
//     "Mỗi 6 tháng"
//   ];

//   const plants = ["Monstera của tôi", "Sen đá cute", "Lan Ý phòng ngủ", "Trầu bà"];

//   const getPriorityColor = (priority: string) => {
//     switch (priority) {
//       case "high": return "bg-red-100 text-red-800";
//       case "medium": return "bg-yellow-100 text-yellow-800";
//       case "low": return "bg-green-100 text-green-800";
//       default: return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getPriorityLabel = (priority: string) => {
//     switch (priority) {
//       case "high": return "Cao";
//       case "medium": return "Trung bình";
//       case "low": return "Thấp";
//       default: return "Trung bình";
//     }
//   };

//   const isOverdue = (dueDate: string) => {
//     return new Date(dueDate) < new Date();
//   };

//   const isToday = (dueDate: string) => {
//     const today = new Date();
//     const due = new Date(dueDate);
//     return today.toDateString() === due.toDateString();
//   };

//   const handleCompleteTask = (id: number) => {
//     setReminders(reminders.map(reminder => {
//       if (reminder.id === id) {
//         return { ...reminder, completed: true };
//       }
//       return reminder;
//     }));
//   };

//   const handleAddReminder = () => {
//     if (newReminder.plantName && newReminder.task && newReminder.dueDate) {
//       const taskType = taskTypes.find(t => t.value === newReminder.task);
//       const reminder = {
//         id: reminders.length + 1,
//         ...newReminder,
//         icon: taskType?.icon || Droplets,
//         task: taskType?.label || newReminder.task,
//         completed: false,
//         nextOccurrence: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
//       };
//       setReminders([...reminders, reminder]);
//       setNewReminder({ plantName: "", task: "", dueDate: "", time: "", frequency: "", priority: "medium" });
//       setIsAddReminderOpen(false);
//     }
//   };

//   const todayReminders = reminders.filter(r => isToday(r.dueDate) && !r.completed);
//   const overdueReminders = reminders.filter(r => isOverdue(r.dueDate) && !r.completed);
//   const upcomingReminders = reminders.filter(r => !isOverdue(r.dueDate) && !isToday(r.dueDate) && !r.completed);

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="mb-8">
//         <div className="flex justify-between items-center mb-6">
//           <div>
//             <h1 className="text-3xl font-bold mb-2">Lịch chăm sóc cây</h1>
//             <p className="text-muted-foreground">
//               Quản lý lịch tưới nước, bón phân và chăm sóc cây tự động
//             </p>
//           </div>
//           <div className="flex gap-2">
//             <Dialog>
//               <DialogTrigger asChild>
//                 <Button variant="outline">
//                   <Settings className="h-4 w-4 mr-2" />
//                   Cài đặt
//                 </Button>
//               </DialogTrigger>
//               <DialogContent>
//                 <DialogHeader>
//                   <DialogTitle>Cài đặt thông báo</DialogTitle>
//                 </DialogHeader>
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <Label htmlFor="email-notifications">Thông báo email</Label>
//                     <Switch
//                       id="email-notifications"
//                       checked={notifications.email}
//                       onCheckedChange={(checked) => 
//                         setNotifications({...notifications, email: checked})
//                       }
//                     />
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <Label htmlFor="browser-notifications">Thông báo trình duyệt</Label>
//                     <Switch
//                       id="browser-notifications"
//                       checked={notifications.browser}
//                       onCheckedChange={(checked) => 
//                         setNotifications({...notifications, browser: checked})
//                       }
//                     />
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <Label htmlFor="mobile-notifications">Thông báo di động</Label>
//                     <Switch
//                       id="mobile-notifications"
//                       checked={notifications.mobile}
//                       onCheckedChange={(checked) => 
//                         setNotifications({...notifications, mobile: checked})
//                       }
//                     />
//                   </div>
//                 </div>
//               </DialogContent>
//             </Dialog>
            
//             <Dialog open={isAddReminderOpen} onOpenChange={setIsAddReminderOpen}>
//               <DialogTrigger asChild>
//                 <Button className="bg-green-600 hover:bg-green-700">
//                   <Plus className="h-4 w-4 mr-2" />
//                   Thêm lịch nhắc
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="sm:max-w-[425px]">
//                 <DialogHeader>
//                   <DialogTitle>Thêm lịch nhắc mới</DialogTitle>
//                 </DialogHeader>
//                 <div className="grid gap-4 py-4">
//                   <div className="grid gap-2">
//                     <Label htmlFor="plant">Cây cảnh</Label>
//                     <Select onValueChange={(value) => setNewReminder({...newReminder, plantName: value})}>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Chọn cây" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {plants.map((plant) => (
//                           <SelectItem key={plant} value={plant}>{plant}</SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="grid gap-2">
//                     <Label htmlFor="task">Công việc</Label>
//                     <Select onValueChange={(value) => setNewReminder({...newReminder, task: value})}>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Chọn công việc" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {taskTypes.map((task) => (
//                           <SelectItem key={task.value} value={task.value}>{task.label}</SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="grid grid-cols-2 gap-2">
//                     <div className="grid gap-2">
//                       <Label htmlFor="date">Ngày</Label>
//                       <Input
//                         id="date"
//                         type="date"
//                         value={newReminder.dueDate}
//                         onChange={(e) => setNewReminder({...newReminder, dueDate: e.target.value})}
//                       />
//                     </div>
//                     <div className="grid gap-2">
//                       <Label htmlFor="time">Giờ</Label>
//                       <Input
//                         id="time"
//                         type="time"
//                         value={newReminder.time}
//                         onChange={(e) => setNewReminder({...newReminder, time: e.target.value})}
//                       />
//                     </div>
//                   </div>
//                   <div className="grid gap-2">
//                     <Label htmlFor="frequency">Tần suất</Label>
//                     <Select onValueChange={(value) => setNewReminder({...newReminder, frequency: value})}>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Chọn tần suất" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {frequencies.map((freq) => (
//                           <SelectItem key={freq} value={freq}>{freq}</SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="grid gap-2">
//                     <Label htmlFor="priority">Mức độ ưu tiên</Label>
//                     <Select onValueChange={(value) => setNewReminder({...newReminder, priority: value})}>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Chọn mức độ" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="low">Thấp</SelectItem>
//                         <SelectItem value="medium">Trung bình</SelectItem>
//                         <SelectItem value="high">Cao</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//                 <div className="flex justify-end gap-2">
//                   <Button variant="outline" onClick={() => setIsAddReminderOpen(false)}>
//                     Hủy
//                   </Button>
//                   <Button onClick={handleAddReminder} className="bg-green-600 hover:bg-green-700">
//                     Thêm lịch nhắc
//                   </Button>
//                 </div>
//               </DialogContent>
//             </Dialog>
//           </div>
//         </div>

//         {/* Quick Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Hôm nay</p>
//                   <p className="text-2xl font-bold text-blue-600">{todayReminders.length}</p>
//                 </div>
//                 <CalendarIcon className="h-8 w-8 text-blue-500" />
//               </div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Quá hạn</p>
//                   <p className="text-2xl font-bold text-red-600">{overdueReminders.length}</p>
//                 </div>
//                 <Bell className="h-8 w-8 text-red-500" />
//               </div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Sắp tới</p>
//                   <p className="text-2xl font-bold text-green-600">{upcomingReminders.length}</p>
//                 </div>
//                 <Droplets className="h-8 w-8 text-green-500" />
//               </div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Hoàn thành</p>
//                   <p className="text-2xl font-bold text-gray-600">
//                     {reminders.filter(r => r.completed).length}
//                   </p>
//                 </div>
//                 <Check className="h-8 w-8 text-gray-500" />
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       <Tabs defaultValue="list" className="w-full">
//         <TabsList className="grid w-full grid-cols-2">
//           <TabsTrigger value="list">Danh sách</TabsTrigger>
//           <TabsTrigger value="calendar">Lịch</TabsTrigger>
//         </TabsList>
        
//         <TabsContent value="list" className="space-y-6">
//           {/* Overdue */}
//           {overdueReminders.length > 0 && (
//             <div>
//               <h3 className="text-lg font-semibold mb-4 text-red-600">Quá hạn</h3>
//               <div className="space-y-3">
//                 {overdueReminders.map((reminder) => {
//                   const Icon = reminder.icon;
//                   return (
//                     <Card key={reminder.id} className="border-red-200">
//                       <CardContent className="p-4">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-3">
//                             <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
//                               <Icon className="h-5 w-5 text-red-600" />
//                             </div>
//                             <div>
//                               <h4 className="font-medium">{reminder.plantName}</h4>
//                               <p className="text-sm text-muted-foreground">{reminder.task}</p>
//                             </div>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <Badge className={getPriorityColor(reminder.priority)}>
//                               {getPriorityLabel(reminder.priority)}
//                             </Badge>
//                             <div className="text-right">
//                               <p className="text-sm font-medium text-red-600">
//                                 {new Date(reminder.dueDate).toLocaleDateString('vi-VN')}
//                               </p>
//                               <p className="text-xs text-muted-foreground">{reminder.time}</p>
//                             </div>
//                             <Button
//                               size="sm"
//                               onClick={() => handleCompleteTask(reminder.id)}
//                               className="bg-green-600 hover:bg-green-700"
//                             >
//                               <Check className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   );
//                 })}
//               </div>
//             </div>
//           )}

//           {/* Today */}
//           {todayReminders.length > 0 && (
//             <div>
//               <h3 className="text-lg font-semibold mb-4 text-blue-600">Hôm nay</h3>
//               <div className="space-y-3">
//                 {todayReminders.map((reminder) => {
//                   const Icon = reminder.icon;
//                   return (
//                     <Card key={reminder.id} className="border-blue-200">
//                       <CardContent className="p-4">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-3">
//                             <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                               <Icon className="h-5 w-5 text-blue-600" />
//                             </div>
//                             <div>
//                               <h4 className="font-medium">{reminder.plantName}</h4>
//                               <p className="text-sm text-muted-foreground">{reminder.task}</p>
//                             </div>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <Badge className={getPriorityColor(reminder.priority)}>
//                               {getPriorityLabel(reminder.priority)}
//                             </Badge>
//                             <div className="text-right">
//                               <p className="text-sm font-medium text-blue-600">Hôm nay</p>
//                               <p className="text-xs text-muted-foreground">{reminder.time}</p>
//                             </div>
//                             <Button
//                               size="sm"
//                               onClick={() => handleCompleteTask(reminder.id)}
//                               className="bg-green-600 hover:bg-green-700"
//                             >
//                               <Check className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   );
//                 })}
//               </div>
//             </div>
//           )}

//           {/* Upcoming */}
//           <div>
//             <h3 className="text-lg font-semibold mb-4">Sắp tới</h3>
//             <div className="space-y-3">
//               {upcomingReminders.map((reminder) => {
//                 const Icon = reminder.icon;
//                 return (
//                   <Card key={reminder.id}>
//                     <CardContent className="p-4">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
//                             <Icon className="h-5 w-5 text-gray-600" />
//                           </div>
//                           <div>
//                             <h4 className="font-medium">{reminder.plantName}</h4>
//                             <p className="text-sm text-muted-foreground">{reminder.task}</p>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Badge className={getPriorityColor(reminder.priority)}>
//                             {getPriorityLabel(reminder.priority)}
//                           </Badge>
//                           <div className="text-right">
//                             <p className="text-sm font-medium">
//                               {new Date(reminder.dueDate).toLocaleDateString('vi-VN')}
//                             </p>
//                             <p className="text-xs text-muted-foreground">{reminder.time}</p>
//                           </div>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 );
//               })}
//             </div>
//           </div>
//         </TabsContent>
        
//         <TabsContent value="calendar" className="space-y-6">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="lg:col-span-1">
//               <Calendar
//                 mode="single"
//                 selected={selectedDate}
//                 onSelect={setSelectedDate}
//                 className="rounded-md border"
//               />
//             </div>
//             <div className="lg:col-span-2">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>
//                     Lịch chăm sóc ngày{" "}
//                     {selectedDate?.toLocaleDateString('vi-VN') || 'chưa chọn'}
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-muted-foreground">
//                     Chọn một ngày trên lịch để xem chi tiết các công việc chăm sóc cây.
//                   </p>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }