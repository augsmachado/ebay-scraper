import express from "express";
import ProductsCtrl from "../controllers/seller.controller.js";

const router = express.Router();

router.route("/").get(ProductsCtrl.getSellerProducts);

export default router;
