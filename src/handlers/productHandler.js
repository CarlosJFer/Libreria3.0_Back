const { query } = require("express");
const {
  getAllProductsController,
  createProductController,
  getProductByIdController,
  getProductByTitleController,
  updateProductController,
  deleteProductController,
} = require("../controllers/productsControllers");

const getAllProductsHandler = async (req, res) => {
  try {
    const response = await getAllProductsController();
    res.send(response);
  } catch (error) {
    res.status(418).send({ Error: error.message });
  }
};

const getOneProductHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo } = req.query;
    let response;
    if (titulo) {
      response = await getProductByTitleController(titulo);
    } else if (id) {
      response = await getProductByIdController(id);
    }

    res.send(response);
  } catch (error) {
    res.status(418).send({ Error: error.message });
  }
};

const createProductHandler = async (req, res) => {
  try {
    const {
      ISBN,
      titulo,
      autor,
      editorial,
      genero,
      descripcion,
      imgPortada,
      precio,
      urlLibro,
      downloadUrl
    } = req.body;

    // Añade registros de consola
    console.log("Datos recibidos para crear producto:", req.body);

    const response = await createProductController(
      ISBN,
      titulo,
      autor,
      editorial,
      genero,
      descripcion,
      imgPortada,
      precio,
      urlLibro,
      downloadUrl
    );
    res.send(response);
  } catch (error) {
    console.error("Error al crear el producto:", error);
    res.status(500).send({ Error: error.message });
  }
};


const updateProductHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { ISBN, titulo, autor, editorial, genero, descripcion, imgPortada } =
      req.body;
    const response = await updateProductController(
      id,
      ISBN,
      titulo,
      autor,
      editorial,
      genero,
      descripcion,
      imgPortada
    );
    if (!response) {
      return res
        .status(404)
        .send({ error: `El producto con id ${id} no existe` });
    }
    res.send(response);
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
};

const deleteProductHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await deleteProductController(id);
    if (!response) {
      return res
        .status(404)
        .send({ error: `El producto con id ${id} no existe` });
    }
    res.send(response);
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
};

module.exports = {
  getAllProductsHandler,
  createProductHandler,
  getOneProductHandler,
  updateProductHandler,
  deleteProductHandler,
};