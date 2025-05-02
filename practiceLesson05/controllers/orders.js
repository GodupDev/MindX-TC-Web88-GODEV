import CustomersModel from "../models/customers.js";
import OrdersModel from "../models/orders.js";
import ProductsModel from "../models/products.js";

const ordersController = {
  getOrdersByCustomerId: async (req, res) => {
    try {
      const { customerId } = req.params;
      const customerExists = await CustomersModel.findById(customerId);
      if (!customerExists) {
        return res.status(404).send({
          message: "Customer not found!",
          data: null,
          success: false,
        });
      }

      const orders = await OrdersModel.find({ customerId });
      if (orders.length === 0) {
        return res.status(404).send({
          message: "Orders not found!",
          data: null,
          success: false,
        });
      }

      res.status(200).send({
        data: orders,
        message: "Get all orders successfully!",
        success: true,
      });
    } catch (error) {
      res.status(500).send({
        // Sửa thành 500 (Lỗi server)
        message: error.message,
        data: null,
        success: false,
      });
    }
  },

  getOrdersHighValue: async (req, res) => {
    try {
      const ordersHighValue = await OrdersModel.find({
        totalPrice: { $gt: 10000000 },
      });

      if (ordersHighValue.length === 0) {
        return res.status(404).send({
          message: "No high-value orders found!",
          data: null,
          success: false,
        });
      }

      res.status(200).send({
        data: ordersHighValue,
        message: "Retrieved high-value orders successfully!",
        success: true,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
        success: false,
      });
    }
  },

  createNewOrder: async (req, res) => {
    try {
      const { customerId, productId, quantity } = req.body;

      const [customerExists, productExists] = await Promise.all([
        CustomersModel.findById(customerId),
        ProductsModel.findById(productId),
      ]);

      if (!customerExists) {
        return res.status(404).send({
          message: "Customer not found!",
          data: null,
          success: false,
        });
      }

      if (!productExists) {
        return res.status(404).send({
          message: "Product not found!",
          data: null,
          success: false,
        });
      }
      if (quantity > productExists.quantity) {
        return res.status(400).send({
          message: "Not enough product quantity!",
          data: null,
          success: false,
        });
      }

      const totalPrice = productExists.price * quantity;

      const createdOrder = await OrdersModel.create({
        customerId,
        productId,
        quantity,
        totalPrice,
      });

      const updatedProduct = await ProductsModel.findByIdAndUpdate(
        productId,
        { $inc: { quantity: -quantity } },
        { new: true },
      );

      res.status(201).send({
        data: createdOrder,
        message: "Create new order successfully!",
        success: true,
      });
    } catch (error) {
      res.status(403).send({
        message: error.message,
        data: null,
        success: false,
      });
    }
  },

  updateOrderQuantityById: async (req, res) => {
    try {
      const { orderId } = req.params;
      const { quantity } = req.body;

      const orderExists = await OrdersModel.findById(orderId);
      if (!orderExists) {
        return res.status(404).send({
          message: "Order not found!",
          data: null,
          success: false,
        });
      }

      const productExists = await ProductsModel.findById(orderExists.productId);

      if (quantity > productExists.quantity) {
        return res.status(400).send({
          message: "Not enough product quantity!",
          data: null,
          success: false,
        });
      }

      const totalPrice = productExists.price * quantity;

      const updatedOrder = await OrdersModel.findByIdAndUpdate(
        orderId,
        { quantity, totalPrice },
        { new: true },
      );

      const updatedProduct = await ProductsModel.findByIdAndUpdate(
        productId,
        { $inc: { quantity: -quantity } },
        { new: true },
      );

      res.status(200).send({
        data: updatedOrder,
        message: "Update order successfully!",
        success: true,
      });
    } catch (error) {
      res.status(403).send({
        message: error.message,
        data: null,
        success: false,
      });
    }
  },
};

export default ordersController;
