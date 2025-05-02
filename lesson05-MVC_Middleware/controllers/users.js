import UsersModel from "../models/users.js";

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
    } catch (error) {
      res.status(403).send({
        message: error.message,
        data: null,
        success: false,
      });
    }
  },
};

export default usersController;
