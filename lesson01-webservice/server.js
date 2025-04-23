import http from "http";
import url from "url";

// Mock data for users
var users = [
  {
    id: 1,
    userName: "john_doe",
    email: "john@example.com",
    address: "123 Main St, New York",
    age: 28,
  },
  {
    id: 2,
    userName: "jane_smith",
    email: "jane@example.com",
    address: "456 Elm St, Chicago",
    age: 32,
  },
  {
    id: 3,
    userName: "michael_b",
    email: "michaelb@example.com",
    address: "789 Oak St, Los Angeles",
    age: 24,
  },
  {
    id: 4,
    userName: "emily_r",
    email: "emilyr@example.com",
    address: "321 Pine St, Seattle",
    age: 30,
  },
  {
    id: 5,
    userName: "david_k",
    email: "davidk@example.com",
    address: "654 Maple Ave, Miami",
    age: 55,
  },
  {
    id: 6,
    userName: "sarah_w",
    email: "sarahw@example.com",
    address: "987 Cedar St, Dallas",
    age: 27,
  },
  {
    id: 7,
    userName: "chris_m",
    email: "chrism@example.com",
    address: "135 Birch Rd, Boston",
    age: 59,
  },
  {
    id: 8,
    userName: "olivia_h",
    email: "oliviah@example.com",
    address: "246 Walnut St, Denver",
    age: 26,
  },
  {
    id: 9,
    userName: "daniel_t",
    email: "danielt@example.com",
    address: "369 Chestnut Ave, Houston",
    age: 31,
  },
  {
    id: 10,
    userName: "natalie_j",
    email: "nataliej@example.com",
    address: "741 Spruce Blvd, Atlanta",
    age: 33,
  },
  {
    id: 11,
    userName: "kevin_b",
    email: "kevinb@example.com",
    address: "852 Redwood Dr, Phoenix",
    age: 70,
  },
  {
    id: 12,
    userName: "laura_m",
    email: "lauram@example.com",
    address: "963 Poplar St, San Diego",
    age: 34,
  },
  {
    id: 13,
    userName: "brian_c",
    email: "brianc@example.com",
    address: "159 Palm Way, San Jose",
    age: 22,
  },
  {
    id: 14,
    userName: "zoe_l",
    email: "zoel@example.com",
    address: "753 Cypress Ln, Austin",
    age: 28,
  },
  {
    id: 15,
    userName: "eric_v",
    email: "ericv@example.com",
    address: "357 Magnolia Ave, Orlando",
    age: 30,
  },
  {
    id: 16,
    userName: "grace_s",
    email: "graces@example.com",
    address: "468 Fir Rd, Charlotte",
    age: 27,
  },
  {
    id: 17,
    userName: "jacob_r",
    email: "jacobr@example.com",
    address: "579 Willow Ct, Philadelphia",
    age: 36,
  },
  {
    id: 18,
    userName: "mia_t",
    email: "miat@example.com",
    address: "681 Aspen Blvd, Portland",
    age: 29,
  },
  {
    id: 19,
    userName: "ethan_g",
    email: "ethang@example.com",
    address: "792 Sycamore St, Detroit",
    age: 23,
  },
  {
    id: 20,
    userName: "chloe_p",
    email: "chloep@example.com",
    address: "804 Dogwood Dr, Nashville",
    age: 31,
  },
];

function getRandomUser() {
  const randomId = users.length + 1; // Tạo id mới cho user
  const names = ["alex", "bella", "charlie", "daisy", "ethan"];
  const cities = ["Hanoi", "Saigon", "Tokyo", "London", "Paris"];
  const name = names[Math.floor(Math.random() * names.length)];
  const city = cities[Math.floor(Math.random() * cities.length)];
  const age = Math.floor(Math.random() * (100 - 18 + 1)) + 18; // Độ tuổi từ 18 đến 100
  return {
    id: randomId,
    userName: `${name}`,
    email: `${name}${randomId}@mail.com`,
    address: `${Math.floor(Math.random() * 999)} ${city}`,
    age: age,
  };
}

const requestHandler = (request, response) => {
  const method = request.method;
  const parseUrl = url.parse(request.url, true);
  const path = parseUrl.pathname;
  const query = parseUrl.query;

  console.log("🚀 ~ requestHandler ~ path:", path);
  console.log("🚀 ~ requestHandler ~ method:", method);

  // Routing

  // 1. Viết API endpoint /users để lấy danh sách users.
  if (path === "/users" && method === "GET") {
    response.end(JSON.stringify(users));
    return;
  }

  // 2. Viết API endpoint /users/old để lấy danh sách user mà có tuổi >= 50.
  if (path === "/users/old" && method === "GET") {
    const oldUsers = users.filter((user) => user.age >= 50);
    response.end(JSON.stringify(oldUsers));
    return;
  }

  // 3. Viết API endpoint /users/add-random để thêm một user mới với các thông tin ngẫu nhiên.
  if (path === "/users/add-random" && method === "GET") {
    try {
      const newUser = getRandomUser();
      users.push(newUser);
      console.log("🚀 ~ requestHandler ~ newUser:", newUser);
      response.statusCode = 201;
      response.end(
        JSON.stringify({ message: "User added successfully", newUser }),
      );
    } catch (error) {
      console.log("🚀 ~ requestHandler ~ error:", error);
      response.statusCode = 500;
      response.end(
        JSON.stringify({ error: "Failed to add user", details: error.message }),
      );
    }
    return;
  }

  // 4. Viết API endpoint /users/add/userName={giá trị}&email={giá trị}&address={giá trị}&age={giá trị} để thêm thông tin user được điền trên API (id vẫn lấy ngẫu nhiên).
  if (path.startsWith("/users/add") && method === "GET") {
    const queryParams = query; // Lấy các tham số từ query string

    const { userName, email, address, age } = queryParams;

    if (!userName || !email || !address || !age) {
      response.statusCode = 400;
      response.end(JSON.stringify({ error: "Missing parameters" }));
      return;
    }

    // Tạo một user mới với thông tin từ query string
    const newUser = {
      id: users.length + 1, // Tạo id mới cho user
      userName: userName.replace(/"/g, ""), // Loại bỏ dấu nháy kép
      email: email.replace(/"/g, ""), // Loại bỏ dấu nháy kép
      address: address.replace(/"/g, ""),
      age: parseInt(age), // Chuyển đổi age thành số nguyên
    };

    users.push(newUser); // Thêm user mới vào danh sách
    response.end(JSON.stringify({ message: "User added", newUser }));
    return;
  }

  // 5. Viết API endpoint /users/update/{user id}/tên trường = giá trị cần update. Server sẽ tìm kiếm user có id bằng với id được truyền trên API và cập nhật thông tin
  if (path.startsWith("/users/update/") && method === "GET") {
    const pathParts = path.split("/"); // Tách đường dẫn thành mảng
    const userId = parseInt(pathParts[3]); // Lấy userId từ phần thứ 3

    // Tìm user theo userId
    const userToUpdate = users.find((user) => user.id === userId);

    if (!userToUpdate) {
      response.statusCode = 404;
      response.end(JSON.stringify({ error: "User not found" }));
      return;
    }

    // Cập nhật các trường trong query string (userName, email, address, age, v.v.)
    const { userName, email, address, age } = query;

    if (userName) userToUpdate.userName = userName.replace(/"/g, ""); // Cập nhật userName và loại bỏ dấu nháy kép
    if (email) userToUpdate.email = email.replace(/"/g, ""); // Cập nhật email và loại bỏ dấu nháy kép
    if (address) userToUpdate.address = address.replace(/"/g, ""); // Cập nhật address và loại bỏ dấu nháy kép
    if (age) userToUpdate.age = parseInt(age.replace(/"/g, "")); // Cập nhật age và loại bỏ dấu nháy kép

    response.end(JSON.stringify({ message: "User updated", userToUpdate }));
    return;
  }

  // If no matching route found, return 404
  response.statusCode = 404;
  response.end(JSON.stringify({ error: "Route not found" }));
};

const app = http.createServer(requestHandler);
const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
