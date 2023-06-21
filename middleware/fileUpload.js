const multer = require('multer')

const imageStorage = multer.diskStorage({
    destination: (req, file, next) => {
        next(null, 'uploads')
    },
    filename: (req, file, next) => {
        next(null, `${file.fieldname}-${Date.now()}-${file.originalname}`)
    }
})

module.exports = multer({ storage: imageStorage, limits: { fileSize: 1024 * 1024 * 2 } }).single('image')