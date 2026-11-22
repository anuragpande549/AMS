import { Router } from 'express';
import { ReportController } from './report.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';

const router = Router();

// Reports are accessible to all authenticated users (scoped by role inside service)
router.use(verifyJWT);

router.get('/daily', ReportController.getAttendanceReport);
router.get('/export', ReportController.getExportData);

export default router;
