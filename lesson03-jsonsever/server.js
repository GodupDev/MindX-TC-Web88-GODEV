import e from "express";
import express from "express";
import fetch from "node-fetch";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(express.json());

const PORT = 8080;
const jsonSever_endpoint = "http://localhost:8081";

app.get("/", (req, res) => {
  res.send("Welcome to our Server lesson 03");
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const jsonObj = await fetch(`${jsonSever_endpoint}/users`);
    const data = await jsonObj.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 1. Viết API việc đăng ký user với userName, id sẽ được là một string ngẫu nhiên, không được phép trùng, bắt đầu từ ký tự US (ví dụ: US8823).
app.post("/users", async (req, res) => {
  const { userName } = req.body;

  try {
    if (!userName) {
      throw new Error("Missing username field");
    }

    const endpoint = `${jsonSever_endpoint}/users`;

    const newUser = {
      userName,
      id: `US${uuidv4()}`,
    };

    const newUserJson = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const newUserData = await newUserJson.json();
    return res.status(201).json({
      message: "Create new user successfully",
      data: newUserData,
    });
  } catch (error) {
    console.log("[ERROR]: ", error);
    res.status(400).json({
      success: false,
      error: error?.message,
    });
  }
});

// 2. Viết API cho phép user tạo bài post (thêm bài post, xử lý id tương tự user).
app.post("/posts/:userId", async (req, res) => {
  const userId = req.params.userId;
  const { content } = req.body;

  try {
    if (!content || !userId) {
      throw new Error("Missing required fields: content, userId");
    }

    const userRes = await fetch(`${jsonSever_endpoint}/users/${userId}`);
    if (!userRes.ok) throw new Error("User not found");

    const newPost = {
      id: `PS${uuidv4()}`,
      content,
      userId,
      views: 0,
    };

    const createdPostJson = await fetch(`${jsonSever_endpoint}/posts`, {
      method: "POST",
      body: JSON.stringify(newPost),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const createdPostData = await createdPostJson.json();
    res.status(201).json({
      message: "Create new post successfully",
      data: createdPostData,
    });
  } catch (error) {
    console.log("[ERROR]: ", error);
    res.status(400).json({
      success: false,
      error: error?.message,
    });
  }
});

// 3. Viết API cho phép user chỉnh sửa lại bài post (chỉ user tạo bài viết mới được phép chỉnh sửa).
app.put("/posts/:postId", async (req, res) => {
  const postId = req.params.postId;
  const { views, content, userId } = req.body;

  try {
    const existingPostJson = await fetch(
      `${jsonSever_endpoint}/posts/${postId}`,
    );
    const existingPost = await existingPostJson.json();

    if (!existingPost || Object.keys(existingPost).length === 0) {
      throw new Error("Post not found");
    }

    if (!userId || !content) {
      throw new Error("Missing required fields: userId, content");
    }
    if (existingPost.userId !== userId) {
      throw new Error("You are not authorized to update this post");
    }

    existingPost.views = views || existingPost.views;

    const updatingPost = { ...existingPost, content };

    const updatedPostJson = await fetch(
      `${jsonSever_endpoint}/posts/${postId}`,
      {
        method: "PUT",
        body: JSON.stringify(updatingPost),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const updatedPostData = await updatedPostJson.json();
    res.json({
      message: "Post is updated successfully",
      data: updatedPostData,
    });
  } catch (error) {
    console.log("[ERROR]: ", error);
    res.status(400).json({
      success: false,
      error: error?.message,
    });
  }
});

// 4. Viết API cho phép user được comment vào bài post
app.post("/posts/:postId/comments", async (req, res) => {
  const postId = req.params.postId;
  const { userId, content } = req.body;

  try {
    if (!userId || !content) {
      throw new Error("Missing required fields: userId, content");
    }

    const postRes = await fetch(`${jsonSever_endpoint}/posts/${postId}`);
    if (!postRes.ok) throw new Error("Post not found");

    const userRes = await fetch(`${jsonSever_endpoint}/users/${userId}`);
    if (!userRes.ok) throw new Error("User not found");

    const newComment = {
      id: `CMT${uuidv4()}`,
      postId,
      userId,
      content,
    };

    const commentRes = await fetch(`${jsonSever_endpoint}/comments`, {
      method: "POST",
      body: JSON.stringify(newComment),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const commentData = await commentRes.json();

    res.status(201).json({
      message: "Comment added successfully",
      data: commentData,
    });
  } catch (error) {
    res.status(400).json({ error: error?.message, success: false });
  }
});

// 5. Viết API cho phép user chỉnh sửa comment (chỉ user tạo comment mới được sửa)
app.put("/comments/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const { userId, content } = req.body;

  try {
    if (!userId || !content) {
      throw new Error("Missing required fields: userId, content");
    }

    const commentRes = await fetch(
      `${jsonSever_endpoint}/comments/${commentId}`,
    );
    if (!commentRes.ok) throw new Error("Comment not found");

    const comment = await commentRes.json();

    if (comment.userId !== userId) {
      throw new Error("You are not authorized to update this comment");
    }

    const updatedComment = { ...comment, content };

    const updatedRes = await fetch(
      `${jsonSever_endpoint}/comments/${commentId}`,
      {
        method: "PUT",
        body: JSON.stringify(updatedComment),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const updatedData = await updatedRes.json();

    res.json({
      message: "Comment updated successfully",
      data: updatedData,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 6. Viết API lấy tất cả comment của một bài post.
app.get("/comments/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const postRes = await fetch(`${jsonSever_endpoint}/posts/${postId}`);
    if (!postRes.ok) throw new Error("Post not found");

    const commentsRes = await fetch(
      `${jsonSever_endpoint}/comments?postId=${postId}`,
    );
    const comments = await commentsRes.json();

    res.json(comments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 7. Viết API lấy tất cả các bài post, 3 comment đầu (dựa theo index) của tất cả user .
app.get("/posts", async (req, res) => {
  const { topComment } = req.query;
  try {
    const postsRes = await fetch(`${jsonSever_endpoint}/posts`);
    const posts = await postsRes.json();

    const commentsRes = await fetch(`${jsonSever_endpoint}/comments`);
    const comments = await commentsRes.json();

    const result = posts.map((post) => {
      const postComments = comments.filter(
        (comment) => comment.postId === post.id,
      );
      return {
        ...post,
        comments: postComments.slice(0, topComment),
      };
    });

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 8. Viết API lấy một bài post và tất cả comment của bài post đó thông qua postId
app.get("/posts/:postId/comments", async (req, res) => {
  const { postId } = req.params;

  try {
    const postRes = await fetch(`${jsonSever_endpoint}/posts/${postId}`);
    if (!postRes.ok) throw new Error("Post not found");

    const commentsRes = await fetch(
      `${jsonSever_endpoint}/comments?postId=${postId}`,
    );
    const comments = await commentsRes.json();

    const post = await postRes.json();
    res.json({ ...post, comments });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Server listening
app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
