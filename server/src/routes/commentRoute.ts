import { Router } from 'express';
import { CommentController } from '../controllers/commentController';
import { multerMiddleware } from '../middlewares/multer';
import { avatarValidation, userDataValidation, fileValidation } from '../middlewares/commentValidation';

const router = Router();
const comment = new CommentController()

router.get('/', comment.getAllComments)
router.post('/',
    multerMiddleware.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'userData', maxCount: 1 },
        { name: 'file', maxCount: 1 }
    ]),
    avatarValidation,
    userDataValidation,
    fileValidation,
    comment.createComment)
router.delete('/', () => { })
router.patch('/', () => { })

export default router;