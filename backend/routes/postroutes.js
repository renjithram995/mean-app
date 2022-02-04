const postSchema = require('../models/post')
const multer = require('multer')

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',

}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype]
        const error = isValid ? null : new Error("Invalid mime type")
        cb(error, "backend/images") // relative to index.js file
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-')
        const ext = MIME_TYPE_MAP[file.mimetype]
        cb(null, name + '_' + Date.now() + '.' + ext)
    }
})

module.exports = (router) => {
    router.post('/api/posts', multer({ storage: storage }).single('image'), (req, res) => {
        const url = req.protocol + '://' + req.get("host")
        const postData = new postSchema({
            title: req.body.title,
            content: req.body.content,
            imagePath: url + "/images/" + req.file.filename
        })
        postData.save().then((result) => {
            res.status(201).json({
                message: 'Post added successfully',
                data: {
                    id: result._id,
                    imagePath: result.imagePath
                }
            })
        })
    })
    router.get('/api/posts/count', (req, res) => {
        postSchema.count().then((count) => {
            res.json({
                message: 'Fetching of posts is success',
                data: count
            })

        }).catch((e) => {
            console.log(e)
        })
    })

    router.get('/api/posts', (req, res) => {
        let pageSize = Number(req.query.pagesize)
        let currentPage = Number(req.query.page)
        const postQuery = postSchema.find()
        if (!isNaN(pageSize) && !isNaN(currentPage)) {
            pageSize = pageSize <= 0 ? 1 : pageSize
            currentPage = currentPage <= 0 ? 1 : currentPage
            postQuery.skip(pageSize * (currentPage -1)).limit(pageSize)
        }
        postQuery.find().then((documents) => {
            res.json({
                message: 'Fetching of posts is success',
                data: documents
            })

        }).catch((e) => {
            console.log(e)
        })
    })

    router.get('/api/posts:id', (req, res) => {
        postSchema.findById(req.params.id).then((post) => {
            if (post) {
                res.status(200).json({
                    message: 'Fetching of post is success',
                    data: post
                })

            } else {
                res.status(400).json({
                    message: 'Fetching of posts is failed',
                })
            }

        }).catch((e) => {
            console.log(e)
            res.status(400).json({
                message: 'Fetching of posts is failed',
            })
        })
    })

    router.delete('/api/posts:id', (req, res) => {
        postSchema.deleteOne({
            _id: req.params.id
        }).then((result) => {
            res.status(200).json({
                message: 'Deleted successfully'
            })
        })
    })

    router.patch('/api/posts:id', multer({ storage: storage }).single('image'), (req, res) => {
        const url = req.file ? (req.protocol + '://' + req.get("host") + "/images/" + req.file.filename) : ''
        const post = {
            title: req.body.title,
            content: req.body.content
        }
        if (url) {
            post.imagePath = url
        }
        postSchema.updateOne({ _id: req.params.id }, post).then((result) => {
            res.status(200).json({
                message: 'Updated successfully',
                data: post
            })
        }).catch((error) => {
            console.log(error)
            res.status(400).json({
                message: 'Error while updating'
            })

        })
    })

};