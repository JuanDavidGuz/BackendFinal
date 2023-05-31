const formidable = require('formidable');

const express = require('express');
const router = express.Router();
const {validarJWT} = require('../middlewares/validar-token')
const {listarPosts, crearPost, actualizarPost, eliminarPost} = require('../Controllers/post')

const multer = require('multer');
router.use(formidable);
const upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'public/images');
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
      }
    })
  });

router.get('/', listarPosts)
router.post('/post',upload.single('image'), crearPost)
router.put('/:id', actualizarPost)
router.delete('/:id', eliminarPost)



module.exports = router;