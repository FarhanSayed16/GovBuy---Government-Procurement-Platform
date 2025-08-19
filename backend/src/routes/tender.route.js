// routes/tender.routes.js
import { Router } from 'express';
import multer from 'multer';
import {
  createTender,
  getTenders,
  getTender,
  updateTender,
  deleteTender,
  getMyTenders
} from '../controllers/tender.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { checkRole } from '../middlewares/roleCheck.middleware.js';

const router = Router();
const upload = multer({ dest: './public/temp' });

// Only gov roles can create/edit tenders
router
  .route('/')
  .post(
    verifyJWT,
    checkRole('procurement_officer','department_head'),
    upload.array('attachments', 5),   // up to 5 files
    createTender
  )
  .get(getTenders);

router
  .route('/mine')
  .get(
    verifyJWT,
    checkRole('procurement_officer','department_head'),
    getMyTenders
  );

router
  .route('/:tenderId')
  .get(getTender)
  .put(
    verifyJWT,
    checkRole('procurement_officer','department_head'),
    upload.array('attachments', 5),
    updateTender
  )
  .delete(
    verifyJWT,
    checkRole('procurement_officer','department_head'),
    deleteTender
  );

export default router;
