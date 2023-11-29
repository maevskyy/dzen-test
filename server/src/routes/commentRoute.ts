import { Router } from 'express';
import { CommentController } from '../controllers/commentController';
import { multerMiddleware } from '../middlewares/multer';
import { commentValidation } from '../middlewares/commentValidation';

const router = Router();
const comment = new CommentController()

router.get('/', () => { })
router.post('/',
    multerMiddleware.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'userData', maxCount: 1 },
        { name: 'file', maxCount: 1 }
    ]),
    commentValidation,
    comment.createComment)
router.delete('/', () => { })
router.patch('/', () => { })

export default router;