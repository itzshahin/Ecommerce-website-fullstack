const express = require("express");
const router = express.Router();

const userController = require("../controller/userController");

router.post("/adduser", userController.createUser);
router.post("/loginuser", userController.loginUser);
router.get("/getuser", userController.getUser);
router.post("/addToCart", userController.addToCart);
router.post("/getCart", userController.getCart);
router.delete("/removeCart", userController.removeCart);
router.post("/toggleWishlist", userController.toggleWishlist);
router.post("/getWishlist", userController.getWishlist);
router.put("/updateCartQuantity", userController.updateCartQuantity);
router.delete('/removeWishlist', userController.removeWishlist);
router.put("/banUser/:id", userController.banUser);
router.put("/unbanUser/:id", userController.unbanUser);
router.post("/placeOrder/:email", userController.placeOrder)
router.post("/buyNow/:email", userController.buyNow)
router.get("/getUserOrders/:userId", userController.getUserOrders)
router.delete('/deleteOrder/:orderId', userController.deleteOrder);
router.post("/userForgotPassword", userController.userForgotPassword);
router.post("/userResetPassword/:id/:token", userController.userResetPassword);
router.get("/getUserOrdersByEmail/:email", userController.getUserOrdersByEmail);

module.exports = router;
