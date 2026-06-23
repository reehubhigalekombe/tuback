import express from "express";
import { syncContacts } from "../controlls/contactController.js";

const router = express.Router();

router.post("/sync", syncContacts);
export default router