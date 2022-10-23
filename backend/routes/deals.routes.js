import express from "express";
import DealsCtrl from "../controllers/deals.controller.js";

const router = express.Router();

router.route("/").get(DealsCtrl.getFeaturedDeals);
router.route("/tech").get(DealsCtrl.getTechDeals);
router.route("/fashion").get(DealsCtrl.getFashionDeals);
router.route("/home").get(DealsCtrl.getHomeDeals);

export default router;
