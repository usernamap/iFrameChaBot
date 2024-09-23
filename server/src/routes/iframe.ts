// src/routes/iframe.ts
import express from 'express';
import { IframeController } from '../controllers/iframeController';

const router = express.Router();

router.get('/', IframeController.getIframe);
router.get('/script', IframeController.getIframeScript);

export default router;