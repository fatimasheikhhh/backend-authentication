import { Router } from "express";
import authRouter from "./user.routes.js";
import categoryRouter from "./category.routes.js";
import employeeRouter from "./employee.routes.js";
import productRouter from "./product.routes.js";
import orderRouter from "./order.routes.js";
import transactionRouter from "./transaction.routes.js";
import reviewRouter from "./review.routes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/employee", employeeRouter);
router.use("/category", categoryRouter);
router.use("/product", productRouter);
router.use("/order", orderRouter);
router.use("/transaction", transactionRouter);
router.use("/review", reviewRouter);

export default router;
