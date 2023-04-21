const db = require("../db");
const fileService = require("../services/file.service");

const PRODUCTS_ON_PAGE = 12;

class ProductService {
  async createProduct(product, pictures, userId) {
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
      images,
      status,
    } = product;
    return db.query(
      `INSERT INTO products (title, author_id, category_id, description, amount, time_created, time_to_take, location, images, status) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        title,
        userId,
        category_id,
        description,
        amount,
        time_created,
        time_to_take,
        location,
        fileName,
        status,
      ]
    );
  }
  async getProducts(searchQuery, pageQuery) {
    if (pageQuery === undefined) {
      if (searchQuery) {
        return db.query(
          `SELECT p.id, p.title, p.description, p.amount, p.location, p.images, p.status, p.time_created, p.time_to_take, 
          (SELECT json_build_object('id', c.id, 'name', c.name) FROM category c WHERE c.id = p.category_id) as category,
          (SELECT json_build_object('id', a.id, 'name', a.name, 'surname', a.surname, 'company_name', a.company_name, 'email', a.email, 'phone', a.phone) FROM user_account a WHERE a.id = p.author_id) as author
          FROM products p WHERE LOWER(p.title) LIKE '%' || LOWER($1) || '%' ORDER BY p.id`,
          [searchQuery]
        );
      } else {
        return db.query(`SELECT p.id, p.title, p.description, p.amount, p.location, p.images, p.status, p.time_created, p.time_to_take, 
        (SELECT json_build_object('id', c.id, 'name', c.name) FROM category c WHERE c.id = p.category_id) as category,
        (SELECT json_build_object('id', a.id, 'name', a.name, 'surname', a.surname, 'company_name', a.company_name, 'email', a.email, 'phone', a.phone) FROM user_account a WHERE a.id = p.author_id) as author
        FROM products p ORDER BY p.id`);
      }
    } else if (Number(pageQuery)) {
      if (searchQuery) {
        return db.query(
          `SELECT p.id, p.title, p.description, p.amount, p.location, p.images, p.status, p.time_created, p.time_to_take, 
          (SELECT json_build_object('id', c.id, 'name', c.name) FROM category c WHERE c.id = p.category_id) as category,
          (SELECT json_build_object('id', a.id, 'name', a.name, 'surname', a.surname, 'company_name', a.company_name, 'email', a.email, 'phone', a.phone) FROM user_account a WHERE a.id = p.author_id) as author
          FROM products p WHERE LOWER(p.title) LIKE '%' || LOWER($1) || '%' ORDER BY p.id LIMIT ${PRODUCTS_ON_PAGE} OFFSET ${
            PRODUCTS_ON_PAGE * (pageQuery - 1)
          }`,
          [searchQuery]
        );
      } else {
        return db.query(
          `SELECT p.id, p.title, p.description, p.amount, p.location, p.images, p.status, p.time_created, p.time_to_take, 
          (SELECT json_build_object('id', c.id, 'name', c.name) FROM category c WHERE c.id = p.category_id) as category,
          (SELECT json_build_object('id', a.id, 'name', a.name, 'surname', a.surname, 'company_name', a.company_name, 'email', a.email, 'phone', a.phone) FROM user_account a WHERE a.id = p.author_id) as author
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
      `SELECT p.id, p.title, p.description, p.amount, p.location, p.images, p.status, p.time_created, p.time_to_take, 
      (SELECT json_build_object('id', c.id, 'name', c.name) FROM category c WHERE c.id = p.category_id) as category,
      (SELECT json_build_object('id', a.id, 'name', a.name, 'surname', a.surname, 'company_name', a.company_name, 'email', a.email, 'phone', a.phone) FROM user_account a WHERE a.id = p.author_id) as author
      FROM products p WHERE p.id = $1`,
      [productId]
    );
  }

  async updateProduct(product, pictures, userId) {
    const {
      title,
      author,
      category_id,
      description,
      amount,
      time_created,
      time_to_take,
      location,
      images,
      status,
      id,
    } = product;
    if (Number(author) !== userId) {
      console.log("ERROR AUTH");
    } else {
      // delete pictures before adding new
      let picturesToDelete = await db.query(
        `SELECT images FROM products where id = $1`,
        [id]
      );
      fileService.deleteFiles(picturesToDelete[0].images);

      // add new pictures
      const fileName = fileService.saveFiles(pictures);
      return db.query(
        `UPDATE products SET title = $1, author_id = $2, category_id = $3, description = $4, amount = $5, time_created = $6, time_to_take = $7, location = $8, images = $9, status = $10 where id = $11 RETURNING *`,
        [
          title,
          userId,
          category_id,
          description,
          amount,
          time_created,
          time_to_take,
          location,
          fileName,
          status,
          id,
        ]
      );
    }
  }
  async deleteProduct(productId, userId) {
    let productData = await db.query(
      `SELECT images, author_id FROM products where id = $1`,
      [productId]
    );
    if (Number(productData[0].author_id) !== userId) {
      console.log("ERROR AUTH");
    } else {
      let pictures = await db.query(
        `SELECT images FROM products where id = $1`,
        [productId]
      );
      fileService.deleteFiles(pictures[0].images);
      return db.query(`DELETE FROM products where id = $1`, [productId]);
    }
  }
}

module.exports = new ProductService();
