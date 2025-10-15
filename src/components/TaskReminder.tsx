import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { X, Droplets, Sun, Calendar, CheckCircle2 } from "lucide-react";

interface TaskReminderProps {
  combos: any[];
  onTaskComplete: (comboId: number, taskId: number) => void;
}

export function TaskReminder({ combos, onTaskComplete }: TaskReminderProps) {
  const [dueTasks, setDueTasks] = useState<any[]>([]);
  const [showReminder, setShowReminder] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    const tasksToday = combos.flatMap((combo) =>
      combo.careSchedule
        .filter((task: any) => task.nextDue <= today && !task.completed)
        .map((task: any) => ({
          ...task,
          comboName: combo.name,
          comboId: combo.id,
        }))
    );

    if (tasksToday.length > 0) {
      setDueTasks(tasksToday);
      setShowReminder(true);
    }
  }, [combos]);

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "watering":
        return <Droplets className="h-5 w-5 text-blue-600" />;
      case "sunbath":
        return <Sun className="h-5 w-5 text-yellow-600" />;
      default:
        return <Calendar className="h-5 w-5 text-green-600" />;
    }
  };

  const handleCompleteTask = (comboId: number, taskId: number) => {
    onTaskComplete(comboId, taskId);
    setDueTasks(dueTasks.filter((task) => task.id !== taskId));

    if (dueTasks.length <= 1) {
      setShowReminder(false);
    }
  };

  if (!showReminder || dueTasks.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="bg-white shadow-xl border border-green-300 rounded-2xl">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-lg text-green-700 flex items-center gap-1">
              🌱 Đến lúc chăm sóc!
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReminder(false)}
              className="text-gray-500 hover:bg-gray-100 h-6 w-6 p-0 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Tasks */}
          <div className="space-y-2">
            {dueTasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className="bg-green-50 border border-green-100 rounded-lg p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getTaskIcon(task.type)}
                    <div>
                      <p className="font-medium text-sm text-green-800">
                        {task.name}
                      </p>
                      <p className="text-xs text-gray-500">{task.comboName}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCompleteTask(task.comboId, task.id)}
                    className="text-green-600 hover:bg-green-100 h-8 w-8 p-0 rounded-full"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {dueTasks.length > 3 && (
              <p className="text-xs text-center text-gray-500">
                và {dueTasks.length - 3} nhiệm vụ khác...
              </p>
            )}
          </div>

          {/* Footer button */}
          <Button
            variant="solid"
            size="sm"
            onClick={() => setShowReminder(false)}
            className="w-full mt-3 bg-green-600 text-white hover:bg-green-700"
          >
            Xem tất cả nhiệm vụ
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
