const { getAllProduct, createProduct } = require("../controllers/productController")
const { uploadProductImage } = require("../controllers/uploadsController")

const router = require("express").Router()



router.route("/").get(getAllProduct).post(createProduct)
router.route("/uploads").post(uploadProductImage)

module.exports = router