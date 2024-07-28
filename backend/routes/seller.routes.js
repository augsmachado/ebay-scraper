import express from "express";
import SellersCtrl from "../controllers/seller.controller.js";

const router = express.Router();

router.route("/").get(SellersCtrl.getSellerProducts);

export default router;
