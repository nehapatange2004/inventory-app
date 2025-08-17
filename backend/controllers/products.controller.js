import Product from "../models/Product.js";
import Asset from "../models/Asset.js";
import path from "path"

export const getAllListedProducts = async (req, res) => {
  try {
    const allProducts = await Product.find();
    res.send(allProducts);

  } catch (err) {
    console.log(`error: ${err}`);
    res.status(500).send({ "message": "Internal server error", "error": err })
  }
}
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById({ _id: req.params.id });

    return res.send(product);

  } catch (err) {
    console.log(`error: ${err}`);
    res.status(500).send({ "message": "Internal server error", "error": err })
  }
}

export const listProduct = async (req, res) => {
  try {
    // if (!req.body) {
    //   console.log(`req body not found! \n${req}`)
    //     return res.status(304).send({ "message": "No data recieved", "error": req })
    // }
    const file = req.file; // multer puts file info here
    if (!file) return res.status(400).send('No file uploaded');
    const asset = new Asset({
      // ownerId: req.user._id,             // Assuming you have user auth
      // ownerId: req.user._id,
      originalName: file.originalname,
      storedName: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      path: path.resolve(file.path),
      // isPublic: req.params.isPublic=="true"?true:false,                   // visibility /access control
      createdAt: new Date(),
    });

    await asset.save();
    const newProduct = new Product({
      name: req.body.name,
      category: req.body.category.trim().toLowerCase(),
      imgURL: asset._id,
      quantity: req.body.quantity,
      price: req.body.price,
      expiryDate: new Date(req.body.expiryDate),
    })
    newProduct.save();
    console.log("Product listed! ")
    res.status(200).send(newProduct);

  } catch (err) {
    console.log(`error: ${err}`);
    res.status(500).send({ "message": "Internal server error", "error": err })
  }
}
export const editProduct = async (req, res) => {
  try {
    // if (!req.body) {
    //   console.log(`req body not found! \n${req}`)
    //     return res.status(304).send({ "message": "No data recieved", "error": req })
    // }

    // const newProduct = new Product({
    //   name: req.body.name,
    //   category: req.body.category.trim().toLowerCase(),
    //   imgURL: asset._id,
    //   quantity: req.body.quantity,
    //   price: req.body.price,
    //   expiryDate: new Date(req.body.expiryDate),
    // })
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(400).send({ "message": "Product not found" });

    }
    const file = req.file; // multer puts file info here
    if (file) {
      const asset = new Asset({
        // ownerId: req.user._id,             // Assuming you have user auth
        // ownerId: req.user._id,
        originalName: file.originalname,
        storedName: file.filename,
        mimeType: file.mimetype,
        size: file.size,
        path: path.resolve(file.path),
        // isPublic: req.params.isPublic=="true"?true:false,                   // visibility /access control
        createdAt: new Date(),
      });
      await asset.save();
      product.imgURL = asset._id;
    }
    const { name, category, quantity, price, expiryDate } = req.body;
    if (name) product.name = name;
    if (category) product.category = category.trim().toLowerCase();
    if (quantity) product.quantity = Number(quantity);
    if (price) product.price = Number(price);
    if (expiryDate) product.expiryDate = new Date(expiryDate);

    await product.save();

    // editedProduct.save();
    console.log("Product listed! ")
    res.status(200).send(product);

  } catch (err) {
    console.log(`error in edit: ${err}`);
    res.status(500).send({ "message": "Internal server error", "error": err })
  }
}
export const deleteProduct = async(req, res) =>{
  try{
    await Product.deleteOne({_id: req.params.id})
    console.log("Product deleted!")
  }catch(err) {
     console.log(`error: ${err}`);
    res.status(500).send({ "message": "Internal server error", "error": err })
  }
}
export const imgPreview = async (req, res) => {
  try {
    const file = await Asset.findById(req.params.id);
    if (!file) return res.status(404).send('Asset not found');

    // Access control: check if user owns file or file is public
    // if (!file.isPublic && (!req.user || req.user._id.toString() !== file.ownerId.toString())) {
    //   return res.status(403).send('Not authorized to access this file');
    // }

    // Absolute file path
    const absolutePath = path.resolve(file.path);


    // res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);

    res.setHeader('Content-Disposition', 'inline');   //to avoid automatic downloading of the file.
    res.setHeader('Content-Type', file.mimeType);     //type of file being sent eg imge/png etc...

    // Stream send the file to the client
    res.sendFile(absolutePath);

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

