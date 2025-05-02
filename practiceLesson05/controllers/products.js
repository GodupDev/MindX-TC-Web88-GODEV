import ProductsModel from "../models/products.js";

const productsController = {
  getProductsByPriceRange: async (req, res) => {
    try {
      const { minPrice, maxPrice } = req.query;

      const priceFilter = {};
      if (minPrice) priceFilter.$gte = Number(minPrice);
      if (maxPrice) priceFilter.$lte = Number(maxPrice);

      const filter =
        Object.keys(priceFilter).length > 0 ? { price: priceFilter } : {};

      const FilteredProducts = await ProductsModel.find(filter);

      res.status(200).send({
        data: FilteredProducts,
        message: "Filtered products successfully!",
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

  createNewProduct: async (req, res) => {
    try {
      const { name, price, description } = req.body;
      const createdProduct = await ProductsModel.create({
        name,
        price,
        description,
      });
      res.status(201).send({
        data: createdProduct,
        message: "Create new product successfully!",
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
};

export default productsController;
