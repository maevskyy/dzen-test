import { Router } from 'express';
import { UserController } from '../controllers/userController';

const router = Router();
const user = new UserController()

router.get('/', () => {})
router.post('/', user.createUser)
router.delete('/', () => {})
router.patch('/', () => {})

export default router