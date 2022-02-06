const express = require('express');

const router = express.Router();

const authenticatorMiddleware = require('../middlewares/authenticator')
const { singleFile } = require('../middlewares/fileupload')
const { addPost, getCount, fetchPosts, fetchPostById, removePost, upsertPost } = require('../controllers/posts')


router.post('/', authenticatorMiddleware, singleFile, addPost)

router.get('/count', getCount)

router.get('/', fetchPosts)

router.get('/:id', fetchPostById)

router.delete('/:id', authenticatorMiddleware, removePost)

router.patch('/:id', authenticatorMiddleware, singleFile, upsertPost)

module.exports = router;