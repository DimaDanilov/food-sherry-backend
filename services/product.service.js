const db = require("../db");
const fileService = require("../services/file.service");

const PRODUCTS_ON_PAGE = 12;

class ProductService {
  async createProduct(product, pictures) {
    const fileName = fileService.saveFiles(pictures);
    const {
      title,
      author,
      category_id,
      description,
      amount,
      time_created,
      time_to_take,
      location,
      phone,
      images,
      status,
    } = product;
    return db.query(
      `INSERT INTO products (title, author, category_id, description, amount, time_created, time_to_take, location, phone, images, status) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        title,
        author,
        category_id,
        description,
        amount,
        time_created,
        time_to_take,
        location,
        phone,
        fileName,
        status,
      ]
    );
  }
  async getProducts(searchQuery, pageQuery) {
    if (pageQuery === undefined) {
      if (searchQuery) {
        return db.query(
          `SELECT p.id, p.title, p.author, p.description, p.amount, p.location, p.phone, p.images, p.status, p.time_created, p.time_to_take, 
          (SELECT json_build_object('id', c.id, 'name', c.name) FROM category c WHERE c.id = p.category_id) as category
          FROM products p WHERE LOWER(p.title) LIKE '%' || LOWER($1) || '%' ORDER BY p.id`,
          [searchQuery]
        );
      } else {
        return db.query(`SELECT p.id, p.title, p.author, p.description, p.amount, p.location, p.phone, p.images, p.status, p.time_created, p.time_to_take, 
        (SELECT json_build_object('id', c.id, 'name', c.name) FROM category c WHERE c.id = p.category_id) as category
        FROM products p ORDER BY p.id`);
      }
    } else if (Number(pageQuery)) {
      if (searchQuery) {
        return db.query(
          `SELECT p.id, p.title, p.author, p.description, p.amount, p.location, p.phone, p.images, p.status, p.time_created, p.time_to_take, 
          (SELECT json_build_object('id', c.id, 'name', c.name) FROM category c WHERE c.id = p.category_id) as category
          FROM products p WHERE LOWER(p.title) LIKE '%' || LOWER($1) || '%' ORDER BY p.id LIMIT ${PRODUCTS_ON_PAGE} OFFSET ${
            PRODUCTS_ON_PAGE * (pageQuery - 1)
          }`,
          [searchQuery]
        );
      } else {
        return db.query(
          `SELECT p.id, p.title, p.author, p.description, p.amount, p.location, p.phone, p.images, p.status, p.time_created, p.time_to_take, 
          (SELECT json_build_object('id', c.id, 'name', c.name) FROM category c WHERE c.id = p.category_id) as category
          FROM products p ORDER BY p.id LIMIT ${PRODUCTS_ON_PAGE} OFFSET ${
            PRODUCTS_ON_PAGE * (pageQuery - 1)
          }`
        );
      }
    }
  }
  async getTotalCount(searchQuery) {
    if (searchQuery) {
      return db.query(
        `SELECT COUNT(*) FROM products WHERE LOWER(title) LIKE '%' || LOWER($1) || '%'`,
        [searchQuery]
      );
    } else {
      return db.query(`SELECT COUNT(*) FROM products`);
    }
  }
  async getOneProduct(productId) {
    return db.query(
      `SELECT p.id, p.title, p.author, p.description, p.amount, p.location, p.phone, p.images, p.status, p.time_created, p.time_to_take, 
      (SELECT json_build_object('id', c.id, 'name', c.name) FROM category c WHERE c.id = p.category_id) as category
      FROM products p WHERE p.id = $1`,
      [productId]
    );
  }

  async updateProduct(product, pictures) {
    const fileName = fileService.saveFiles(pictures);
    const {
      title,
      author,
      category_id,
      description,
      amount,
      time_created,
      time_to_take,
      location,
      phone,
      images,
      status,
      id,
    } = product;
    return db.query(
      `UPDATE products SET title = $1, author = $2, category_id = $3, description = $4, amount = $5, time_created = $6, time_to_take = $7, location = $8, phone = $9, images = $10, status = $11 where id = $12 RETURNING *`,
      [
        title,
        author,
        category_id,
        description,
        amount,
        time_created,
        time_to_take,
        location,
        phone,
        fileName,
        status,
        id,
      ]
    );
  }
  async deleteProduct(productId) {
    let pictures = await db.query(`SELECT images FROM products where id = $1`, [
      productId,
    ]);
    fileService.deleteFiles(pictures[0].images);
    return db.query(`DELETE FROM products where id = $1`, [productId]);
  }
}

module.exports = new ProductService();
