// server.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const dataFile = path.join(__dirname, "data.json");
const userDataFile = path.join(__dirname, "user-data.json");

// Hàm đọc dữ liệu từ file JSON
function readData() {
  try {
    if (!fs.existsSync(dataFile)) {
      // Tạo file data.json mới nếu chưa tồn tại
      fs.writeFileSync(
        dataFile,
        JSON.stringify({ users: [], plantCombos: [] })
      );
    }
    const data = fs.readFileSync(dataFile, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return { users: [], plantCombos: [] };
  }
}

// Hàm ghi dữ liệu vào file JSON
function writeData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

// Hàm đọc/ghi user data (tách riêng từng user)
function readUserData() {
  try {
    if (!fs.existsSync(userDataFile)) {
      return {};
    }
    const data = fs.readFileSync(userDataFile, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

function writeUserData(data) {
  fs.writeFileSync(userDataFile, JSON.stringify(data, null, 2));
}

// ========== USER APIs ==========
// API đăng ký user mới
app.post("/api/register", (req, res) => {
  const { name, email, password, phone, location } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng điền đầy đủ thông tin bắt buộc",
    });
  }

  const data = readData();

  // Kiểm tra email đã tồn tại chưa
  const existingUser = data.users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "Email đã được sử dụng",
    });
  }

  // Tạo user mới
  const newUser = {
    id: Date.now(),
    name,
    email,
    password, // Trong thực tế nên mã hóa password
    phone: phone || "",
    location: location || "TP. Hồ Chí Minh",
    bio: "Người yêu thiên nhiên và đam mê chăm sóc cây cảnh.",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150&q=80",
    joinDate: new Date().toISOString().split("T")[0],
    level: "Người mới bắt đầu",
    points: 0,
  };

  data.users.push(newUser);
  writeData(data);

  res.json({
    success: true,
    message: "Đăng ký thành công",
    user: newUser,
  });
});

// API đăng nhập
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng điền email và mật khẩu",
    });
  }

  const data = readData();

  // Tìm user theo email và password
  const user = data.users.find(
    (user) => user.email === email && user.password === password
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Email hoặc mật khẩu không đúng",
    });
  }

  // Tạo bản copy không chứa password để trả về client
  const { password: _, ...userWithoutPassword } = user;

  res.json({
    success: true,
    message: "Đăng nhập thành công",
    user: userWithoutPassword,
  });
});

// API cập nhật thông tin user
app.put("/api/update-profile", (req, res) => {
  const { userId, updates } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "Thiếu thông tin user ID",
    });
  }

  const data = readData();
  const userIndex = data.users.findIndex((user) => user.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "User không tồn tại",
    });
  }

  // Cập nhật thông tin user
  data.users[userIndex] = { ...data.users[userIndex], ...updates };
  writeData(data);

  // Trả về user đã được cập nhật (không bao gồm password)
  const { password, ...updatedUser } = data.users[userIndex];

  res.json({
    success: true,
    message: "Cập nhật hồ sơ thành công",
    user: updatedUser,
  });
});

// ========== PLANT COMBO APIs ==========
// GET - Lấy tất cả combos của user
app.get("/api/plant-combos", (req, res) => {
  const { userId } = req.query;
  const data = readData();

  if (userId) {
    // Lọc combos theo userId
    const userCombos = data.plantCombos.filter(
      (combo) => combo.userId === parseInt(userId)
    );
    res.json({ plantCombos: userCombos });
  } else {
    res.json({ plantCombos: data.plantCombos });
  }
});

// GET - Lấy combo theo ID
app.get("/api/plant-combos/:id", (req, res) => {
  const { id } = req.params;
  const data = readData();

  const combo = data.plantCombos.find((combo) => combo.id === parseInt(id));
  if (!combo) {
    return res.status(404).json({ error: "Combo không tồn tại" });
  }

  res.json(combo);
});

// POST - Thêm combo mới
app.post("/api/plant-combos", (req, res) => {
  const combo = req.body;
  const data = readData();

  // Tạo ID mới
  const newId =
    data.plantCombos.length > 0
      ? Math.max(...data.plantCombos.map((c) => c.id)) + 1
      : 1;

  const newCombo = {
    id: newId,
    ...combo,
    dateAdded: new Date().toISOString().split("T")[0],
    lastCared: new Date().toISOString().split("T")[0],
    nextCare: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    health: 85,
    qrCode: `CMB${String(newId).padStart(3, "0")}`,
  };

  data.plantCombos.push(newCombo);
  writeData(data);

  res.json(newCombo);
});

// PUT - Cập nhật combo
app.put("/api/plant-combos/:id", (req, res) => {
  const { id } = req.params;
  const updatedCombo = req.body;
  const data = readData();

  const comboIndex = data.plantCombos.findIndex(
    (combo) => combo.id === parseInt(id)
  );
  if (comboIndex === -1) {
    return res.status(404).json({ error: "Combo không tồn tại" });
  }

  data.plantCombos[comboIndex] = {
    ...data.plantCombos[comboIndex],
    ...updatedCombo,
  };
  writeData(data);

  res.json(data.plantCombos[comboIndex]);
});

// DELETE - Xóa combo
app.delete("/api/plant-combos/:id", (req, res) => {
  const { id } = req.params;
  const data = readData();

  const comboIndex = data.plantCombos.findIndex(
    (combo) => combo.id === parseInt(id)
  );
  if (comboIndex === -1) {
    return res.status(404).json({ error: "Combo không tồn tại" });
  }

  data.plantCombos.splice(comboIndex, 1);
  writeData(data);

  res.json({ success: true, message: "Combo đã được xóa" });
});

// PATCH - Cập nhật task chăm sóc
app.patch("/api/plant-combos/:id/tasks/:taskId", (req, res) => {
  const { id, taskId } = req.params;
  const { completed } = req.body;
  const data = readData();

  const comboIndex = data.plantCombos.findIndex(
    (combo) => combo.id === parseInt(id)
  );
  if (comboIndex === -1) {
    return res.status(404).json({ error: "Combo không tồn tại" });
  }

  const taskIndex = data.plantCombos[comboIndex].careSchedule.findIndex(
    (task) => task.id === parseInt(taskId)
  );

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task không tồn tại" });
  }

  data.plantCombos[comboIndex].careSchedule[taskIndex] = {
    ...data.plantCombos[comboIndex].careSchedule[taskIndex],
    completed: completed,
    lastDone: completed ? new Date().toISOString().split("T")[0] : undefined,
  };

  writeData(data);
  res.json(data.plantCombos[comboIndex]);
});
// Thêm vào server.js sau các endpoint hiện có

// ========== DIARY ENTRIES APIs ==========
// GET - Lấy tất cả diary entries của user
app.get("/api/diary-entries", (req, res) => {
  const { userId } = req.query;
  const data = readData();

  // Khởi tạo diaryEntries nếu chưa có
  if (!data.diaryEntries) {
    data.diaryEntries = [];
    writeData(data);
  }

  if (userId) {
    const userEntries = data.diaryEntries.filter(
      (entry) => entry.userId === parseInt(userId)
    );
    res.json({ diaryEntries: userEntries });
  } else {
    res.json({ diaryEntries: data.diaryEntries });
  }
});

// POST - Thêm diary entry mới
app.post("/api/diary-entries", (req, res) => {
  const entry = req.body;
  const data = readData();

  // Khởi tạo diaryEntries nếu chưa có
  if (!data.diaryEntries) {
    data.diaryEntries = [];
  }

  // Tạo ID mới
  const newId =
    data.diaryEntries.length > 0
      ? Math.max(...data.diaryEntries.map((e) => e.id)) + 1
      : 1;

  const newEntry = {
    id: newId,
    ...entry,
    createdAt: new Date().toISOString(),
  };

  data.diaryEntries.push(newEntry);
  writeData(data);

  res.json(newEntry);
});

// PUT - Cập nhật diary entry
app.put("/api/diary-entries/:id", (req, res) => {
  const { id } = req.params;
  const updatedEntry = req.body;
  const data = readData();

  if (!data.diaryEntries) {
    return res.status(404).json({ error: "Không tìm thấy diary entries" });
  }

  const entryIndex = data.diaryEntries.findIndex(
    (entry) => entry.id === parseInt(id)
  );
  if (entryIndex === -1) {
    return res.status(404).json({ error: "Diary entry không tồn tại" });
  }

  data.diaryEntries[entryIndex] = {
    ...data.diaryEntries[entryIndex],
    ...updatedEntry,
  };
  writeData(data);

  res.json(data.diaryEntries[entryIndex]);
});

// DELETE - Xóa diary entry
app.delete("/api/diary-entries/:id", (req, res) => {
  const { id } = req.params;
  const data = readData();

  if (!data.diaryEntries) {
    return res.status(404).json({ error: "Không tìm thấy diary entries" });
  }

  const entryIndex = data.diaryEntries.findIndex(
    (entry) => entry.id === parseInt(id)
  );
  if (entryIndex === -1) {
    return res.status(404).json({ error: "Diary entry không tồn tại" });
  }

  data.diaryEntries.splice(entryIndex, 1);
  writeData(data);

  res.json({ success: true, message: "Diary entry đã được xóa" });
});

// ========== USER DATA APIs ==========
app.get("/api/user-data/:userId", (req, res) => {
  const userId = parseInt(req.params.userId);
  const data = readData();
  const userDataFile = readUserData();

  // Tìm user data theo userId
  const userData = userDataFile[userId] || {
    plantCombos: [],
    diaryEntries: [],
    notifications: [],
    blogPosts: [],
    settings: {
      notifications: { email: true, push: true, careReminders: true },
      privacy: { profileVisibility: "public" },
      preferences: { theme: "light", language: "vi" },
    },
  };

  // Thêm thông tin user
  const user = data.users.find((u) => u.id === userId);
  if (user) {
    userData.user = user;
  }

  res.json(userData);
});

app.post("/api/save-user-data", (req, res) => {
  const { userId, userData } = req.body;
  const userDataFile = readUserData();

  userDataFile[userId] = userData;
  writeUserData(userDataFile);

  res.json({ success: true, message: "Dữ liệu đã được lưu" });
});

// API lấy danh sách users (cho testing)
app.get("/api/users", (req, res) => {
  const data = readData();
  const usersWithoutPasswords = data.users.map((user) => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
  res.json(usersWithoutPasswords);
});

// ========== LOGOUT API ==========
app.post("/api/logout", (req, res) => {
  // Trong ứng dụng thực tế, bạn có thể xử lý token blacklist ở đây
  // Nhưng với phiên bản hiện tại, client sẽ tự xử lý xóa thông tin user

  res.json({
    success: true,
    message: "Đăng xuất thành công",
  });
});

// ========== BLOG POST APIs ==========

// GET - Lấy tất cả bài viết
app.get("/api/blog/posts", (req, res) => {
  const { userId, category, search } = req.query;
  const data = readData();

  // Khởi tạo blogPosts nếu chưa có
  if (!data.blogPosts) {
    data.blogPosts = [];
    writeData(data);
  }

  let posts = data.blogPosts;

  // Lọc theo user nếu có userId
  if (userId) {
    posts = posts.filter((post) => post.author.id === parseInt(userId));
  }

  // Lọc theo category
  if (category && category !== "all") {
    posts = posts.filter(
      (post) =>
        post.category &&
        post.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  // Tìm kiếm
  if (search) {
    const searchTerm = search.toLowerCase();
    posts = posts.filter(
      (post) =>
        post.content.toLowerCase().includes(searchTerm) ||
        (post.title && post.title.toLowerCase().includes(searchTerm)) ||
        post.author.name.toLowerCase().includes(searchTerm) ||
        (post.tags &&
          post.tags.some((tag) => tag.toLowerCase().includes(searchTerm)))
    );
  }

  res.json({ posts });
});

// GET - Lấy bài viết theo ID
app.get("/api/blog/posts/:id", (req, res) => {
  const { id } = req.params;
  const data = readData();

  if (!data.blogPosts) {
    return res.status(404).json({ error: "Không tìm thấy bài viết" });
  }

  const post = data.blogPosts.find((post) => post.id === parseInt(id));
  if (!post) {
    return res.status(404).json({ error: "Bài viết không tồn tại" });
  }

  res.json(post);
});

// POST - Tạo bài viết mới
app.post("/api/blog/posts", (req, res) => {
  const post = req.body;
  const data = readData();

  // Khởi tạo blogPosts nếu chưa có
  if (!data.blogPosts) {
    data.blogPosts = [];
  }

  // Tạo ID mới
  const newId =
    data.blogPosts.length > 0
      ? Math.max(...data.blogPosts.map((p) => p.id)) + 1
      : 1;

  const newPost = {
    id: newId,
    ...post,
    timestamp: "Vừa xong",
    likes: 0,
    comments: [],
    shares: 0,
    bookmarks: 0,
  };

  data.blogPosts.push(newPost);
  writeData(data);

  res.json(newPost);
});

// PUT - Cập nhật bài viết
app.put("/api/blog/posts/:id", (req, res) => {
  const { id } = req.params;
  const updatedPost = req.body;
  const data = readData();

  if (!data.blogPosts) {
    return res.status(404).json({ error: "Không tìm thấy bài viết" });
  }

  const postIndex = data.blogPosts.findIndex(
    (post) => post.id === parseInt(id)
  );
  if (postIndex === -1) {
    return res.status(404).json({ error: "Bài viết không tồn tại" });
  }

  data.blogPosts[postIndex] = { ...data.blogPosts[postIndex], ...updatedPost };
  writeData(data);

  res.json(data.blogPosts[postIndex]);
});

// DELETE - Xóa bài viết
app.delete("/api/blog/posts/:id", (req, res) => {
  const { id } = req.params;
  const data = readData();

  if (!data.blogPosts) {
    return res.status(404).json({ error: "Không tìm thấy bài viết" });
  }

  const postIndex = data.blogPosts.findIndex(
    (post) => post.id === parseInt(id)
  );
  if (postIndex === -1) {
    return res.status(404).json({ error: "Bài viết không tồn tại" });
  }

  data.blogPosts.splice(postIndex, 1);
  writeData(data);

  res.json({ success: true, message: "Bài viết đã được xóa" });
});

// ========== COMMENT APIs ==========

// POST - Thêm bình luận mới
app.post("/api/blog/posts/:postId/comments", (req, res) => {
  const { postId } = req.params;
  const comment = req.body;
  const data = readData();

  if (!data.blogPosts) {
    return res.status(404).json({ error: "Không tìm thấy bài viết" });
  }

  const postIndex = data.blogPosts.findIndex(
    (post) => post.id === parseInt(postId)
  );
  if (postIndex === -1) {
    return res.status(404).json({ error: "Bài viết không tồn tại" });
  }

  // Tạo ID mới cho comment
  const postComments = data.blogPosts[postIndex].comments;
  const newCommentId =
    postComments.length > 0
      ? Math.max(...postComments.map((c) => c.id)) + 1
      : 1;

  const newComment = {
    id: newCommentId,
    ...comment,
    timestamp: "Vừa xong",
    likes: 0,
    replies: [],
  };

  data.blogPosts[postIndex].comments.push(newComment);
  writeData(data);

  res.json(newComment);
});

// PATCH - Like bài viết
app.patch("/api/blog/posts/:postId/like", (req, res) => {
  const { postId } = req.params;
  const data = readData();

  if (!data.blogPosts) {
    return res.status(404).json({ error: "Không tìm thấy bài viết" });
  }

  const postIndex = data.blogPosts.findIndex(
    (post) => post.id === parseInt(postId)
  );
  if (postIndex === -1) {
    return res.status(404).json({ error: "Bài viết không tồn tại" });
  }

  data.blogPosts[postIndex].likes += 1;
  writeData(data);

  res.json({ likes: data.blogPosts[postIndex].likes });
});

// PATCH - Bookmark bài viết
app.patch("/api/blog/posts/:postId/bookmark", (req, res) => {
  const { postId } = req.params;
  const data = readData();

  if (!data.blogPosts) {
    return res.status(404).json({ error: "Không tìm thấy bài viết" });
  }

  const postIndex = data.blogPosts.findIndex(
    (post) => post.id === parseInt(postId)
  );
  if (postIndex === -1) {
    return res.status(404).json({ error: "Bài viết không tồn tại" });
  }

  data.blogPosts[postIndex].bookmarks += 1;
  writeData(data);

  res.json({ bookmarks: data.blogPosts[postIndex].bookmarks });
});

// PATCH - Like bình luận
app.patch("/api/blog/posts/:postId/comments/:commentId/like", (req, res) => {
  const { postId, commentId } = req.params;
  const data = readData();

  if (!data.blogPosts) {
    return res.status(404).json({ error: "Không tìm thấy bài viết" });
  }

  const postIndex = data.blogPosts.findIndex(
    (post) => post.id === parseInt(postId)
  );
  if (postIndex === -1) {
    return res.status(404).json({ error: "Bài viết không tồn tại" });
  }

  const commentIndex = data.blogPosts[postIndex].comments.findIndex(
    (comment) => comment.id === parseInt(commentId)
  );

  if (commentIndex === -1) {
    return res.status(404).json({ error: "Bình luận không tồn tại" });
  }

  data.blogPosts[postIndex].comments[commentIndex].likes += 1;
  writeData(data);

  res.json({ likes: data.blogPosts[postIndex].comments[commentIndex].likes });
});

app.listen(PORT, () => {
  console.log(`Server đang chạy trên http://localhost:${PORT}`);
});
