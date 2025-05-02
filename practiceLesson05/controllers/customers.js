import CustomersModel from "../models/customers.js";

const customersController = {
  getAllCustomers: async (req, res) => {
    try {
      const customers = await CustomersModel.find({});
      res.status(200).send({
        data: customers,
        message: "Get all customers successfully!",
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

  getCustomerById: async (req, res) => {
    try {
      const { id } = req.params;
      const customer = await CustomersModel.findById(id);
      if (!customer) {
        return res.status(404).send({
          message: "Customer not found!",
          data: null,
          success: false,
        });
      }
      res.status(200).send({
        data: customer,
        message: "Get customer successfully!",
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

  createNewCustomer: async (req, res) => {
    try {
      const { name, email, age } = req.body;
      const createdCustomer = await CustomersModel.create({
        name,
        email,
        age,
      });
      res.status(201).send({
        data: createdCustomer,
        message: "Create new customer successfully!",
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

export default customersController;
