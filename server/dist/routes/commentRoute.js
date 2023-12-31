"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const commentController_1 = require("../controllers/commentController");
const multer_1 = require("../middlewares/multer");
const commentValidation_1 = require("../middlewares/commentValidation");
const router = (0, express_1.Router)();
const comment = new commentController_1.CommentController();
router.get('/', comment.getAllComments);
router.post('/', multer_1.multerMiddleware.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'userData', maxCount: 1 },
    { name: 'file', maxCount: 1 }
]), commentValidation_1.avatarValidation, commentValidation_1.userDataValidation, commentValidation_1.fileValidation, comment.createComment);
router.delete('/', () => { });
router.patch('/', () => { });
exports.default = router;
