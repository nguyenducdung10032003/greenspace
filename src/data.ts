export const dataFile = {
  user: {
    id: 1,
    name: "Trần Thị B",
    email: "user@greenspace.vn", 
    phone: "0900000002",
    location: "TP. Hồ Chí Minh",
    bio: "Người yêu thiên nhiên và đam mê chăm sóc cây cảnh. Chia sẻ kinh nghiệm và học hỏi từ cộng đồng.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150&q=80",
    joinDate: "2024-01-01",
    level: "Người mới bắt đầu", 
    points: 1250
  },
  plantCombos: [
    {
      id: 1,
      name: "Combo Mini Garden Fairy",
      comboType: "Mini Garden",
      category: "Combo trang trí",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80",
      dateAdded: "2024-01-01",
      lastCared: "2024-01-22",
      nextCare: "2024-01-25",
      careLevel: "Dễ",
      health: 85,
      location: "Phòng khách",
      notes: "Combo mini garden với cây Money Tree và các loại cây nhỏ, trang trí với figurines đôi tình nhân.",
      qrCode: "CMB001",
      plants: ["Money Tree", "Cỏ trang trí", "Cây lá nhỏ"],
      decorations: ["Figurines đôi tình nhân", "Đèn LED mini", "Sỏi trang trí"],
      careSchedule: [
        {
          id: 1,
          type: "watering",
          name: "Tưới nước nhẹ",
          frequency: "2 lần/tuần",
          lastDone: "2024-01-22",
          nextDue: "2024-01-25",
          completed: false,
          notes: "Tưới ít nước, tránh ướt figurines"
        },
        {
          id: 2,
          type: "sunbath",
          name: "Ánh sáng gián tiếp",
          frequency: "7 lần/tuần",
          nextDue: "2024-01-24",
          completed: false,
          notes: "Đặt gần cửa sổ có ánh sáng tự nhiên"
        }
      ]
    },
    {
      id: 2,
      name: "Combo Sen Đá Thần Tài",
      comboType: "Lucky Combo",
      category: "Sen đá phong thủy",
      image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&q=80",
      dateAdded: "2024-01-15",
      lastCared: "2024-01-20",
      nextCare: "2024-01-27",
      careLevel: "Dễ",
      health: 92,
      location: "Bàn làm việc",
      notes: "Combo sen đá với Thần Tài mang lại may mắn, thích hợp đặt bàn làm việc.",
      qrCode: "CMB002",
      plants: ["Sen đá đuôi công", "Sen đá lá dài", "Cỏ Sansevieria mini"],
      decorations: ["Tượng Thần Tài", "Túi vàng mini", "Sỏi trắng"],
      careSchedule: [
        {
          id: 3,
          type: "watering",
          name: "Tưới nước tiết kiệm",
          frequency: "1 lần/tuần",
          lastDone: "2024-01-20",
          nextDue: "2024-01-27",
          completed: false,
          notes: "Tưới ít, chỉ khi đất khô hoàn toàn"
        }
      ]
    },
    {
      id: 3,
      name: "Combo Lưỡi Hổ Zen",
      comboType: "Zen Garden",
      category: "Phong thủy văn phòng",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
      dateAdded: "2024-01-10",
      lastCared: "2024-01-21",
      nextCare: "2024-01-28",
      careLevel: "Dễ",
      health: 88,
      location: "Góc phòng ngủ",
      notes: "Combo Sansevieria với Buddha mang lại bình an, lọc không khí tốt.",
      qrCode: "CMB003",
      plants: ["Sansevieria Trifasciata", "Cây lưỡi hổ mini"],
      decorations: ["Tượng Phật nhỏ", "Sỏi zen", "Chậu gốm hoa văn"],
      careSchedule: [
        {
          id: 4,
          type: "watering",
          name: "Tưới nước định kỳ",
          frequency: "0.5 lần/tuần",
          lastDone: "2024-01-21",
          nextDue: "2024-01-31",
          completed: false,
          notes: "Lưỡi hổ rất chịu hạn"
        }
      ]
    }
  ],
  diaryEntries: [
    {
      id: 1,
      date: "2024-01-23",
      plantName: "Combo Mini Garden Fairy",
      plantId: 1,
      activities: [
        {
          id: 1,
          type: "watering",
          name: "Tưới nước",
          time: "08:00",
          completed: true,
          notes: "Tưới 200ml nước ấm, đất khô hoàn toàn",
          amount: "200ml"
        },
        {
          id: 2,
          type: "sunbath",
          name: "Tắm nắng",
          time: "10:00",
          completed: true,
          notes: "Đặt ngoài ban công trong 2 tiếng, ánh sáng vừa phải",
          duration: "2 tiếng"
        }
      ],
      weather: {
        temperature: "28°C",
        condition: "Nắng",
        humidity: "65%"
      },
      notes: "Cây phát triển rất tốt! Xuất hiện 2 lá mới sau khi thay chậu tuần trước.",
      photos: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80"],
      mood: "good"
    },
    {
      id: 2,
      date: "2024-01-22",
      plantName: "Combo Sen Đá Thần Tài",
      plantId: 2,
      activities: [
        {
          id: 4,
          type: "watering",
          name: "Tưới nước",
          time: "19:00",
          completed: true,
          notes: "Tưới ít nước, chỉ ướt nhẹ bề mặt đất",
          amount: "50ml"
        }
      ],
      weather: {
        temperature: "26°C",
        condition: "Mây",
        humidity: "70%"
      },
      notes: "Đất hơi ẩm do mưa. Kiểm tra kỹ trước khi tưới.",
      mood: "normal"
    }
  ],
  notifications: [
    {
      id: 1,
      type: "care_reminder",
      title: "Đến lúc chăm sóc cây!",
      message: "Combo Mini Garden Fairy cần được tưới nước hôm nay",
      plantComboId: 1,
      dueDate: "2024-01-25",
      read: false,
      createdAt: "2024-01-25T08:00:00Z"
    },
    {
      id: 2,
      type: "care_reminder", 
      title: "Nhắc nhở chăm sóc",
      message: "Combo Sen Đá Thần Tài sắp đến lịch tưới nước",
      plantComboId: 2,
      dueDate: "2024-01-27",
      read: false,
      createdAt: "2024-01-26T18:00:00Z"
    }
  ],
  blogPosts: [
    {
      id: 1,
      title: "5 Cách chăm sóc Monstera hiệu quả",
      content: "Monstera là một trong những loại cây cảnh được yêu thích nhất...",
      author: "Trần Thị B",
      authorId: 1,
      category: "personal",
      tags: ["monstera", "chăm sóc", "kinh nghiệm"],
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
      likes: 156,
      comments: [],
      createdAt: "2024-01-20T10:00:00Z",
      updatedAt: "2024-01-20T10:00:00Z"
    }
  ],
  settings: {
    notifications: {
      email: true,
      push: true,
      careReminders: true,
      communityUpdates: false,
      weeklyReport: true
    },
    privacy: {
      profileVisibility: "public",
      gardenVisibility: "friends",
      activityVisibility: "public"
    },
    preferences: {
      theme: "light",
      language: "vi",
      timezone: "Asia/Ho_Chi_Minh"
    }
  }
};