import UsersModel from "../models/models.users.js";

const usersController = {
  createNewUser: async (req, res) => {
    try {
      const { userName, userEmail } = req.body;

      const createdUser = await UsersModel.create({
        userName,
        userEmail,
      });

      res.status(201).send({
        data: createdUser,
        message: "Register successful!",
        success: true,
      });
    } catch (err) {
      if (err.name === "ValidationError") {
        const errors = {};
        for (const key in err.errors) {
          errors[key] = err.errors[key].message;
        }

        return res.status(400).json({
          status: 400,
          error: "ValidationError",
          message: "Validation failed",
          details: errors,
          success: false,
        });
      }

      return res.status(500).json({
        status: 500,
        error: "InternalServerError",
        message: "An unexpected error occurred",
        success: false,
      });
    }
  },
};

export default usersController;
