/** @format */

const { StatusCodes } = require("http-status-codes");
const path = require("path")
const fs = require("fs")
const CustomError = require("../errors")
const cloudinary = require("cloudinary").v2

const uploadProductImageLocal = async (req, res) => {

    const { name, price, image } = req.body
    
    if (!req.files) {
        throw new CustomError.BadRequestError('No file uploaded')
    } 
    //the key from the form data from postman
    const productImage = req.files.image
    
    if (!productImage.mimetype.startsWith('image')) {
        throw new CustomError.BadRequestError("pls upload an image");
    }

    const maxSize = 1024 * 1024

    if (productImage.size > maxSize) {
        throw new CustomError.BadRequestError(`pls upload an image < 1mb`);
    }
    console.log(productImage)
    //where we want to upload our images
    const imagePath = path.join(__dirname, '../public/uploads/' + `${productImage.name}`)
    //the mv from the library helps us move the image to the specified path
    //so anywhere we upload our images we can make it publicly available using express.static
    await productImage.mv(imagePath)

    //so the path is creted and sent ,and then now we can use it to create image , and now anyone can access the image, so we just have to provide the correct path when we create a product 
    //to have access to that image
  return res.status(StatusCodes.OK).json({image: {src: `/uploads/${productImage.name}`}})
};


const uploadProductImage = async (req, res) => {
  //provide path for the image

  //if we agree to use tempfiles coming from the express file upload , it creates a temporary folder and stores the image we are trying to save for us e.g from postman
  //then we can access the path with req.files.image.tempFilePath , and specify to cloudinary we need to use temp files and add a folder on cloudinary where we want to store
    //image is accessible in the secure_url property and send it to the user as that is what has the image

    //but downside is we are still storing it in server so we can get file module and remove it when we are done uploading
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "fileuploadexpress",
    }
  );
    //so we dont keep it round in the server again
    fs.unlinkSync(req.files.image.tempFilePath);
    res.status(StatusCodes.OK).json({image: {src: result.secure_url}})
}

module.exports = {
    //basically we have set up a pipeline to be able to upload image and give our user the location on frontend
  uploadProductImage,
};
