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

module.exports = {
    singleFile: multer({ storage: storage }).single('image')
}