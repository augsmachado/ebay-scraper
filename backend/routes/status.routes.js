import express from "express";
import StatusCtrl from "../controllers/status.controller.js";

const router = express.Router();

router.route("/").get(StatusCtrl.getStatusApi);
router.route("/api").get(StatusCtrl.getStatusApi);

router.route("/server").get(StatusCtrl.getStatusServer);

export default router;
