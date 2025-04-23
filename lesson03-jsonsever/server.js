import express from "express";

const app = express();

app.use(express.json());

const PORT = 8080;

app.get("/", (req, res) => {
  res.send("Welcome to our Server lesson 03");
});

// Get all users
app.get("/users", async (req, res) => {
  const endpoint = "http://localhost:8082/users";
  const jsonObj = await fetch(endpoint);
  const data = await jsonObj.json();

  res.json(data);
});

// Create new user
app.post("/users", async (req, res) => {
  const { userName } = req.body;

  try {
    if (!userName) {
      throw new Error("Missing username filed");
    }

    // Get user data
    const endpoint = "http://localhost:8082/users";
    const jsonObj = await fetch(endpoint);
    const usersData = await jsonObj.json();
    const nextUserId = usersData?.length + 1;

    const newUsers = {
      userName,
      id: `US00${nextUserId}`,
    };

    const newUserJson = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(newUsers),
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
      data: null,
      success: false,
      error: error?.message,
    });
  }
});

app.post("/posts", async (req, res) => {
  const { content, userId, views } = req.body;

  try {
    // 1. Validation
    if (!content || !userId) {
      throw new Error("Missing required fields: content, userId");
    }

    // 2. Prepare data
    const postsJson = await fetch("http://localhost:8081/posts");
    const postsData = await postsJson.json();

    const newPostId =
      postsData > 9
        ? `PS0${postsData.length + 1}`
        : `PS00${postsData.length + 1}`;
    const newPost = {
      id: newPostId,
      content,
      userId,
      views: !views ? 1 : views,
    };

    //3. Insert to db
    const createdPostJson = await fetch("http://localhost:8081/posts", {
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
      data: null,
      success: false,
      error: error?.message,
    });
  }
});

app.put("/posts/:id", async (req, res) => {
  const postId = req.params?.id;
  const { views, content, userId } = req.body;

  try {
    const existingPostJson = await fetch(
      `http://localhost:8081/posts/${postId}`,
    );
    const existingPost = await existingPostJson.json();

    if (!existingPost) {
      throw new Error("Post not found");
    }

    if (existingPost.userId !== userId) {
      throw new Error("You are not authorized to update this post"); // status code 403
    }

    const updatingPost = {
      views,
      content,
      userId,
    };

    // Update to database
    const updatedPostJson = await fetch(
      `http://localhost:8081/posts/${postId}`,
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
      data: null,
      success: false,
      error: error?.message,
    });
  }
});

// HOC: Higher Order Function: wrapped handler function
// => handle error throw from PROMISE

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
