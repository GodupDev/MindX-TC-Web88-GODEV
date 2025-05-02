import express from "express";
import mongoose from "mongoose";
import customersController from "./controllers/customers.js";
import ordersController from "./controllers/orders.js";
import productsController from "./controllers/products.js";

const PORT = 8080;
const DB_URL = "mongodb://localhost:27017/practice05";

mongoose.connect(DB_URL);
const app = express();
app.use(express.json());

// Special rude:  email cần duy nhất, id sẽ sử dụng _id mặc định của MongoDB.
app.use((req, res, next) => {
  console.log("Middleware được chạy!");
  next(); //
});

// 1. Viết API để lấy toàn bộ danh sách khách hàng.
app.get("/customers", customersController.getAllCustomers);

// 2. Lấy thông tin chi tiết của một khách hàng
app.get("/customers/:id", customersController.getCustomerById);

// 3. Lấy danh sách đơn hàng của một khách hàng cụ thể
app.get(
  "/customers/:customerId/orders",
  ordersController.getOrdersByCustomerId,
);

// 4. Lấy thông tin các đơn hàng với tổng giá trị trên 10 triệu
app.get("/orders/highvalue", ordersController.getOrdersHighValue);

// 5.  Lọc danh sách sản phẩm theo khoảng giá
app.get(
  "/products?minPrice=?&maxPrice=?",
  productsController.getProductsByPriceRange,
);

// 6. Thêm mới khách hàng
app.post("/customers", customersController.createNewCustomer);

// 7. Tạo mới đơn hàng
app.post("/orders", ordersController.createNewOrder);

// 8. Cập nhật số lượng sản phẩm trong đơn hàng
app.put("/orders/:orderId", ordersController.updateOrderQuantityById);

// Server listening
app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
