const Product = require("../models/Product");

const createProductController = async (
  ISBN,
  titulo,
  autor,
  editorial,
  genero,
  descripcion,
  imgPortada,
  precio,
  urlLibro, // Parámetro nuevo para la URL del libro
  downloadUrl
) => {
  const newProduct = await Product.create({
    ISBN,
    titulo,
    autor,
    editorial,
    genero,
    descripcion,
    imgPortada,
    precio,
    urlLibro, // Asegúrate de incluirlo aquí
    downloadUrl
  });
  return newProduct;
};

const getAllProductsController = async () => {
  return await Product.find();
};

const getProductByIdController = async (id) => {
  return await Product.findById(id);
};

const getProductByTitleController = async (titulo) => {
  const productByTitle = await Product.find({ titulo });
  if (!productByTitle.length) throw new Error("No hay titulos con ese nombre");
  return productByTitle;
};

const updateProductController = async (
  id,
  ISBN,
  titulo,
  autor,
  editorial,
  genero,
  descripcion,
  imgPortada,
  precio
) => {
  const newProduct = {
    ISBN,
    titulo,
    autor,
    editorial,
    genero,
    descripcion,
    imgPortada,
    precio,
  };
  const updateProduct = await Product.findByIdAndUpdate(id, newProduct, {
    new: true,
  });

  if (!updateProduct) {
    throw new Error(`El producto con id ${id} no existe en la base de datos`);
  }

  return updateProduct;
};

const deleteProductController = async (id) => {
  let deleteProduct = await Product.findByIdAndDelete(id);
  if (!deleteProduct) {
    throw new Error(`El producto con id ${id} no existe en la base de datos`);
  }
  return deleteProduct;
};
module.exports = {
  getAllProductsController,
  getProductByTitleController,
  createProductController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
};