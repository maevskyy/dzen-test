import { Router } from 'express';
import { CommentController } from '../controllers/commentController';
import { multerMiddleware } from '../middlewares/multer';

const router = Router();
const comment = new CommentController()

router.get('/', () => { })
router.post('/',
    multerMiddleware.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'text', maxCount: 1 },
        { name: 'file', maxCount: 1 }
    ]),
    comment.createComment)
router.delete('/', () => { })
router.patch('/', () => { })

export default router;