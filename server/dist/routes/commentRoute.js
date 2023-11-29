"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const commentController_1 = require("../controllers/commentController");
const multer_1 = require("../middlewares/multer");
const router = (0, express_1.Router)();
const comment = new commentController_1.CommentController();
router.get('/', () => { });
router.post('/', multer_1.multerMiddleware.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'userData', maxCount: 1 },
    { name: 'file', maxCount: 1 }
]), comment.createComment);
router.delete('/', () => { });
router.patch('/', () => { });
exports.default = router;
