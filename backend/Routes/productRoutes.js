const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");

router.post("/addproduct", productController.addProduct);
router.get("/getproduct", productController.getProduct);
router.get("/:id", productController.getProductById);
router.delete("/deleteData/:id", productController.deleteProduct);
router.put("/updateData/:id", productController.updateProduct);

module.exports = router;
