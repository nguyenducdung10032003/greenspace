// import { useState, useEffect } from "react";
// import { Navbar } from "./components/Navbar";
// import { HomePage } from "./components/HomePage";
// import { GardenManagement } from "./components/GardenManagement";
// import { CareDiary } from "./components/CareDiary";
// import { BlogCommunity } from "./components/BlogCommunity";
// import { ChatbotAI } from "./components/ChatbotAI";
// import { Profile } from "./components/Profile";
// import { NotificationSystem } from "./components/NotificationSystem";
// import { Auth } from "./components/Auth";
// import { dataFile } from "./data";

// export default function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [activeSection, setActiveSection] = useState("home");
//   const [notifications, setNotifications] = useState(dataFile.notifications);
//   const [appData, setAppData] = useState(dataFile);

//   // Check authentication on load
//   useEffect(() => {
//     const savedUser = localStorage.getItem('greenspace_user');
//     const savedData = localStorage.getItem('greenspace_data');
    
//     if (savedUser) {
//       setCurrentUser(JSON.parse(savedUser));
//       setIsAuthenticated(true);
//     }
    
//     if (savedData) {
//       const parsedData = JSON.parse(savedData);
//       setAppData(parsedData);
//       setNotifications(parsedData.notifications || []);
//     }
//   }, []);

//   const handleLogin = (userData: any) => {
//     setCurrentUser(userData);
//     setIsAuthenticated(true);
    
//     // Update app data with new user
//     const updatedData = {
//       ...appData,
//       user: userData
//     };
//     setAppData(updatedData);
//     localStorage.setItem('greenspace_data', JSON.stringify(updatedData));
//   };

//   const handleRegister = (userData: any) => {
//     setCurrentUser(userData);
//     setIsAuthenticated(true);
    
//     // Create new user data structure
//     const newUserData = {
//       ...dataFile,
//       user: userData,
//       plantCombos: [],
//       diaryEntries: [],
//       notifications: [],
//       blogPosts: []
//     };
//     setAppData(newUserData);
//     setNotifications([]);
//     localStorage.setItem('greenspace_data', JSON.stringify(newUserData));
//   };

//   const handleLogout = () => {
//     setIsAuthenticated(false);
//     setCurrentUser(null);
//     setActiveSection("home");
//     localStorage.removeItem('greenspace_user');
//     localStorage.removeItem('greenspace_data');
//   };

//   const updateAppData = (newData: any) => {
//     setAppData(newData);
//     localStorage.setItem('greenspace_data', JSON.stringify(newData));
//   };

//   const handleMarkAsRead = (id: number) => {
//     const updatedNotifications = notifications.map(notification =>
//       notification.id === id ? { ...notification, read: true } : notification
//     );
//     setNotifications(updatedNotifications);
    
//     // Update app data
//     const updatedData = {
//       ...appData,
//       notifications: updatedNotifications
//     };
//     updateAppData(updatedData);
//   };

//   const handleDismissNotification = (id: number) => {
//     const updatedNotifications = notifications.filter(notification => notification.id !== id);
//     setNotifications(updatedNotifications);
    
//     // Update app data
//     const updatedData = {
//       ...appData,
//       notifications: updatedNotifications
//     };
//     updateAppData(updatedData);
//   };

//   const renderSection = () => {
//     switch (activeSection) {
//       case "garden":
//         return <GardenManagement appData={appData} updateAppData={updateAppData} />;
//       case "diary":
//         return <CareDiary appData={appData} updateAppData={updateAppData} />;
//       case "blog":
//         return <BlogCommunity appData={appData} updateAppData={updateAppData} />;
//       case "chatbot":
//         return <ChatbotAI />;
//       case "profile":
//         return <Profile currentUser={currentUser} updateAppData={updateAppData} appData={appData} />;
//       default:
//         return <HomePage setActiveSection={setActiveSection} appData={appData} />;
//     }
//   };

//   // Show auth screen if not authenticated
//   if (!isAuthenticated) {
//     return <Auth onLogin={handleLogin} onRegister={handleRegister} />;
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       <Navbar 
//         activeSection={activeSection} 
//         setActiveSection={setActiveSection}
//         currentUser={currentUser}
//         onLogout={handleLogout}
//       />
//       <NotificationSystem
//         notifications={notifications}
//         onMarkAsRead={handleMarkAsRead}
//         onDismiss={handleDismissNotification}
//       />
//       <main>
//         {renderSection()}
//       </main>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./components/HomePage";
import { GardenManagement } from "./components/GardenManagement";
import { CareDiary } from "./components/CareDiary";
import { BlogCommunity } from "./components/BlogCommunity";
import { ChatbotAI } from "./components/ChatbotAI";
import { Profile } from "./components/Profile";
import { NotificationSystem } from "./components/NotificationSystem";
import { Auth } from "./components/Auth";
import { dataFile } from "./data";

const API_BASE_URL = 'http://localhost:3001/api';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeSection, setActiveSection] = useState("home");
  const [notifications, setNotifications] = useState(dataFile.notifications);
  const [appData, setAppData] = useState(dataFile);
  const [loading, setLoading] = useState(true);

  // Check authentication on load
  useEffect(() => {
    const savedUser = localStorage.getItem('greenspace_user');
    const savedData = localStorage.getItem('greenspace_data');
    
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsAuthenticated(true);
      
      // Load user data from API
      loadUserData(user.id);
    } else {
      setLoading(false);
    }
    
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setAppData(parsedData);
      setNotifications(parsedData.notifications || []);
    }
  }, []);

  // Hàm load dữ liệu user từ API
  const loadUserData = async (userId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user-data/${userId}`);
      if (response.ok) {
        const userData = await response.json();
        setAppData(userData);
        setNotifications(userData.notifications || []);
        localStorage.setItem('greenspace_data', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (userData: any) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
    
    // Load user data from API
    await loadUserData(userData.id);
  };

  const handleRegister = async (userData: any) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
    
    // Create new user data structure
    const newUserData = {
      ...dataFile,
      user: userData,
      plantCombos: [],
      diaryEntries: [],
      notifications: [],
      blogPosts: [],
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
    
    // Save to API
    try {
      const response = await fetch(`${API_BASE_URL}/save-user-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData.id,
          userData: newUserData
        })
      });

      if (response.ok) {
        setAppData(newUserData);
        setNotifications([]);
        localStorage.setItem('greenspace_data', JSON.stringify(newUserData));
      }
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActiveSection("home");
    localStorage.removeItem('greenspace_user');
    localStorage.removeItem('greenspace_data');
  };

  const updateAppData = async (newData: any) => {
    setAppData(newData);
    localStorage.setItem('greenspace_data', JSON.stringify(newData));
    
    // Save to API if user is authenticated
    if (currentUser) {
      try {
        await fetch(`${API_BASE_URL}/save-user-data`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: currentUser.id,
            userData: newData
          })
        });
      } catch (error) {
        console.error('Error saving data to API:', error);
      }
    }
  };

  const handleMarkAsRead = (id: number) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
    
    // Update app data
    const updatedData = {
      ...appData,
      notifications: updatedNotifications
    };
    updateAppData(updatedData);
  };

  const handleDismissNotification = (id: number) => {
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    setNotifications(updatedNotifications);
    
    // Update app data
    const updatedData = {
      ...appData,
      notifications: updatedNotifications
    };
    updateAppData(updatedData);
  };

const renderSection = () => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  switch (activeSection) {
    case "garden":
      return <GardenManagement appData={appData} updateAppData={updateAppData} />;
    case "diary":
      return <CareDiary appData={appData} updateAppData={updateAppData} />;
    case "blog":
      return <BlogCommunity appData={appData} updateAppData={updateAppData} />;
    case "chatbot":
      return <ChatbotAI />;
    case "profile": // THÊM CASE NÀY
      return <Profile currentUser={currentUser} updateAppData={updateAppData} appData={appData} />;
    default:
      return <HomePage setActiveSection={setActiveSection} appData={appData} />;
  }
};

  // Show auth screen if not authenticated
  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} onRegister={handleRegister} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <NotificationSystem
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onDismiss={handleDismissNotification}
      />
      <main>
        {renderSection()}
      </main>
    </div>
  );
}