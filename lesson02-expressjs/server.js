import express from "express";
import { v4 as uuidv4 } from "uuid";
import { users, posts } from "./data.js";

// Mock data for users and posts
var usersServer = users;
var postsServer = posts;

const app = express();
const PORT = 8080;

// Middleware to passe JSON request body
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to our Server");
});

// 1. Viết API lấy thông tin của user với id được truyền trên params.
app.get("/users/:id", (req, res) => {
  const { id } = req.params;

  const existingUser = usersServer.find((user) => user.id === id);

  if (existingUser) {
    res.json(existingUser);
  } else {
    res.status(404).json({
      message: "User not found",
    });
  }
});

// 2. Viết API tạo user với các thông tin như trên users, với id là random (uuid), email là duy nhất, phải kiểm tra được trùng email khi tạo user.
app.post("/users/", (req, res) => {
  const { userName, email, avatar } = req.body;

  // 1.  Validation
  if (!userName || email) {
    return res.status(400).json({
      message: "Missing required fields: userName, email",
    });
  }
  const existingEmail = usersServer.find((user) => user.email === email);
  if (existingEmail) {
    return res.status(409).json({
      message: "Email already exists",
    });
  }

  // 2. Logic create new student
  const newStudent = {
    id: uuidv4(),
    userName,
    email,
    avatar:
      avatar ||
      "https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png",
  };

  students.push(newStudent);

  res.status(201).json({
    message: "Student is created successfully",
  });
});

// 3. Viết API lấy ra các bài post của user được truyền userId trên params.
app.get("/posts/:userId", (req, res) => {
  const { userId } = req.params;

  const userPosts = postsServer.filter((post) => post.userId === userId);

  if (userPosts) {
    res.json(userPosts);
  } else {
    res.status(404).json({
      message: "User not found",
    });
  }
});

// 4. Viết API thực hiện tạo bài post với id của user được truyền trên params.
app.post("/posts/:userId", (req, res) => {
  const { userId } = req.params;
  const { content, isPublic } = req.body;

  // 1. Validation
  if (!content) {
    return res.status(400).json({
      message: "Missing required fields: content",
    });
  }

  // 2. Logic create new post
  const newPost = {
    userId: userId,
    postId: uuidv4(),
    content,
    createdAt: new Date().toISOString(),
    isPublic: isPublic || false,
  };

  postsServer.push(newPost);

  res.status(201).json({
    message: "Post is created successfully",
  });
});

// 5. Viết API cập nhật thông tin bài post với postId được truyền trên params, chỉ có user tạo bài mới được phép.
app.patch("/posts/:postId", (req, res) => {
  const { postId } = req.params;
  const { userId, content } = req.body;

  // 1. Tìm post theo ID
  const postIndex = postsServer.findIndex((post) => post.postId === postId);

  if (postIndex === -1) {
    return res.status(404).json({ message: "Post not found" });
  }

  // 2. Kiểm tra quyền cập nhật
  if (postsServer[postIndex].userId !== userId) {
    return res
      .status(403)
      .json({ message: "You do not have permission to update this post" });
  }

  postsServer = postsServer.map((post) => {
    if (post.postId === postId)
      return {
        ...post,
        content: content || post.content,
      };
    else return post;
  });

  res.json({
    message: "Post updated successfully",
    post: postsServer.find((post) => post.postId === postId),
  });
});

// 6. Viết API xoá bài post với postId được truyền trên params, chỉ có user tạo bài mới được phép.
app.delete("/posts/:postId", (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  // 1. Tìm post theo ID
  const postIndex = postsServer.findIndex((post) => post.postId === postId);
  if (postIndex === -1) {
    return res.status(404).json({ message: "Post not found" });
  }

  // 2. Kiểm tra quyền xoá
  if (postsServer[postIndex].userId !== userId) {
    return res
      .status(403)
      .json({ message: "You do not have permission to delete this post" });
  }

  postsServer = postsServer.filter((post) => post.postId !== postId);

  res.json({
    message: "Post deleted successfully",
    postId: postId,
  });
});

// 7. Viết API tìm kiếm các bài post với content tương ứng được gửi lên từ query params.
app.get("/posts", (req, res) => {
  const { content } = req.query;

  if (!content) {
    return res.status(400).json({
      message: "Missing required field: content",
    });
  }

  const filteredPosts = postsServer.filter((post) =>
    post.content.toLowerCase().includes(content.toLowerCase()),
  );

  if (filteredPosts.length > 0) {
    res.json(filteredPosts);
  } else {
    res.status(404).json({
      message: "No posts found with the given content",
    });
  }
});

// 8. Viết API lấy tất cả các bài post với isPublic là true, false thì sẽ không trả về
app.get("/posts/isPublic/:isPublic", (req, res) => {
  const { isPublic } = req.params;
  const isPublicBoolean = isPublic === "true"; // Chuyển 'true' thành boolean true, 'false' thành false

  // Lọc các bài post có trường isPublic giống với giá trị isPublicBoolean
  const publicPosts = postsServer.filter(
    (post) => post.isPublic === isPublicBoolean,
  );

  if (publicPosts.length > 0) {
    res.json(publicPosts);
  } else {
    res.status(404).json({
      message: "No public posts found",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
