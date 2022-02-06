const postSchema = require('../models/post')

const addPost = (req, res) => {
    const url = req.protocol + '://' + req.get("host")
    const postData = new postSchema({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
    })
    postData.save().then((result) => {
        res.status(201).json({
            message: 'Post added successfully',
            data: {
                id: result._id,
                imagePath: result.imagePath
            }
        })
    }).catch((error) => {
        res.status(500).json({
            message: error.message || "Unknown error occured",
            error: error
        })
    })
}

const getCount = (req, res) => {
    postSchema.count().then((count) => {
        res.json({
            message: 'Fetching of posts is success',
            data: count
        })

    }).catch((e) => {
        res.status(500).json({
            message: error.message || "Error while fetching post",
            error: error
        })
        console.log(e)
    })
}

const fetchPosts = (req, res) => {
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
        res.status(500).json({
            message: error.message || "Error while fetching post",
            error: error
        })
        console.log(e)
    })
}

const fetchPostById = (req, res) => {
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
            message: e.message || 'Fetching of posts is failed',
        })
    })
}

const removePost = (req, res) => {
    postSchema.deleteOne({
        _id: req.params.id,
        creator: req.userData.userId
    }).then((result) => {
        console.log(result)
        if (result?.deletedCount > 0) {
            res.status(200).json({
                message: 'Deleted successfully'
            })
        } else {
            res.status(401).json({
                message: 'User authentication Failed'
            })
        }
    }).catch((error) => {
        res.status(500).json({
            message: error.message || "Error while fetching post",
            error: error
        })
        console.log(error)
    })
}

const upsertPost = (req, res) => {
    const url = req.file ? (req.protocol + '://' + req.get("host") + "/images/" + req.file.filename) : ''
    const post = {
        title: req.body.title,
        content: req.body.content
    }
    if (url) {
        post.imagePath = url
    }
    const filter = {
        _id: req.params.id,
        creator: req.userData.userId
    }
    postSchema.updateOne(filter, post).then((result) => {
        if (result.modifiedCount > 0) {
            res.status(200).json({
                message: 'Updated successfully',
                data: post
            })
        } else {
            res.status(401).json({
                message: 'User authentication Failed',
                data: post
            })
        }
    }).catch((error) => {
        console.log(error)
        res.status(400).json({
            message: 'Error while updating'
        })

    })
}
module.exports = {
    addPost,
    getCount,
    fetchPosts,
    fetchPostById,
    removePost,
    upsertPost
}