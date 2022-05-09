import express from "express";
import DealsCtrl from "../controllers/deals.controller.js";

const router = express.Router();

router.route("/").get(DealsCtrl.getDeals);

export default router;
