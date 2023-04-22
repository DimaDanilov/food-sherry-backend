const db = require("../db");
const fileService = require("../services/file.service");

const PRODUCTS_ON_PAGE = 12;
const PRODUCTS_ON_PROFILE = 6;

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
          `SELECT p.id, p.title, p.client_id, p.description, p.amount, p.location, p.images, p.status, p.time_created, p.time_to_take, 
          (SELECT json_build_object('id', c.id, 'name', c.name) FROM category c WHERE c.id = p.category_id) as category,
          (SELECT json_build_object('id', a.id, 'name', a.name, 'surname', a.surname, 'company_name', a.company_name, 'email', a.email, 'phone', a.phone) FROM user_account a WHERE a.id = p.author_id) as author
          FROM products p WHERE LOWER(p.title) LIKE '%' || LOWER($1) || '%' ORDER BY p.id`,
          [searchQuery]
        );
      } else {
        return db.query(`SELECT p.id, p.title, p.client_id, p.description, p.amount, p.location, p.images, p.status, p.time_created, p.time_to_take, 
        (SELECT json_build_object('id', c.id, 'name', c.name) FROM category c WHERE c.id = p.category_id) as category,
        (SELECT json_build_object('id', a.id, 'name', a.name, 'surname', a.surname, 'company_name', a.company_name, 'email', a.email, 'phone', a.phone) FROM user_account a WHERE a.id = p.author_id) as author
        FROM products p ORDER BY p.id`);
      }
    } else if (Number(pageQuery)) {
      if (searchQuery) {
        return db.query(
          `SELECT p.id, p.title, p.client_id, p.description, p.amount, p.location, p.images, p.status, p.time_created, p.time_to_take, 
          (SELECT json_build_object('id', c.id, 'name', c.name) FROM category c WHERE c.id = p.category_id) as category,
          (SELECT json_build_object('id', a.id, 'name', a.name, 'surname', a.surname, 'company_name', a.company_name, 'email', a.email, 'phone', a.phone) FROM user_account a WHERE a.id = p.author_id) as author
          FROM products p WHERE LOWER(p.title) LIKE '%' || LOWER($1) || '%' ORDER BY p.id LIMIT ${PRODUCTS_ON_PAGE} OFFSET ${
            PRODUCTS_ON_PAGE * (pageQuery - 1)
          }`,
          [searchQuery]
        );
      } else {
        return db.query(
          `SELECT p.id, p.title, p.description, p.client_id, p.amount, p.location, p.images, p.status, p.time_created, p.time_to_take, 
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
      `SELECT p.id, p.title, p.client_id, p.description, p.amount, p.location, p.images, p.status, p.time_created, p.time_to_take, 
      (SELECT json_build_object('id', c.id, 'name', c.name) FROM category c WHERE c.id = p.category_id) as category,
      (SELECT json_build_object('id', a.id, 'name', a.name, 'surname', a.surname, 'company_name', a.company_name, 'email', a.email, 'phone', a.phone) FROM user_account a WHERE a.id = p.author_id) as author
      FROM products p WHERE p.id = $1`,
      [productId]
    );
  }
  async getCurrentProducts(authorId, pageQuery) {
    if (pageQuery === undefined) {
      return db.query(
        `SELECT id, title, images, status
      FROM products WHERE author_id = $1 AND (status = 'open' OR status = 'reserved') ORDER BY id DESC`,
        [authorId]
      );
    } else if (Number(pageQuery)) {
      return db.query(
        `SELECT id, title, images, status
      FROM products WHERE author_id = $1 AND (status = 'open' OR status = 'reserved') ORDER BY id DESC 
      LIMIT ${PRODUCTS_ON_PROFILE} OFFSET ${
          PRODUCTS_ON_PROFILE * (pageQuery - 1)
        }`,
        [authorId]
      );
    }
  }
  async getCurrentTotalCount(authorId) {
    return db.query(
      `SELECT COUNT(*) FROM products WHERE author_id = $1 AND (status = 'open' OR status = 'reserved')`,
      [authorId]
    );
  }
  async getClosedProducts(authorId, pageQuery) {
    if (pageQuery === undefined) {
      return db.query(
        `SELECT id, title, images, status
      FROM products WHERE author_id = $1 AND status = 'closed' ORDER BY id DESC`,
        [authorId]
      );
    } else if (Number(pageQuery)) {
      return db.query(
        `SELECT id, title, images, status
      FROM products WHERE author_id = $1 AND status = 'closed' ORDER BY id DESC
      LIMIT ${PRODUCTS_ON_PROFILE} OFFSET ${
          PRODUCTS_ON_PROFILE * (pageQuery - 1)
        }`,
        [authorId]
      );
    }
  }
  async getClosedTotalCount(authorId) {
    return db.query(
      `SELECT COUNT(*) FROM products WHERE author_id = $1 AND status = 'closed'`,
      [authorId]
    );
  }
  async getTakenProducts(authorId, pageQuery) {
    if (pageQuery === undefined) {
      return db.query(
        `SELECT id, title, images, status
      FROM products WHERE client_id = $1 AND (status = 'reserved' OR status = 'closed') ORDER BY id DESC`,
        [authorId]
      );
    } else if (Number(pageQuery)) {
      return db.query(
        `SELECT id, title, images, status
      FROM products WHERE client_id = $1 AND (status = 'reserved' OR status = 'closed') ORDER BY id DESC
      LIMIT ${PRODUCTS_ON_PROFILE} OFFSET ${
          PRODUCTS_ON_PROFILE * (pageQuery - 1)
        }`,
        [authorId]
      );
    }
  }
  async getTakenTotalCount(authorId) {
    return db.query(
      `SELECT COUNT(*) FROM products WHERE client_id = $1 AND (status = 'reserved' OR status = 'closed')`,
      [authorId]
    );
  }
  async getCreatedProductsByUser(authorId) {
    return db.query(
      `SELECT COUNT(*) FROM products WHERE author_id = ${authorId}`
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
        `UPDATE products SET title = $1, author_id = $2, category_id = $3, description = $4, amount = $5, time_created = $6, time_to_take = $7, location = $8, images = $9, status = $10 WHERE id = $11 RETURNING *`,
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
  async updateProductStatus(product, userId) {
    const { id, status } = product;
    let productToChange = await db.query(
      `SELECT author_id, client_id, status FROM products where id = $1`,
      [id]
    );

    switch (productToChange[0].status) {
      case status:
        console.log("You cant change status on the same status.");
        break;
      case "closed":
        console.log("Status is closed. You can't change it anymore.");
        break;
      case "open":
        if (status === "reserved") {
          if (userId !== productToChange[0].author_id) {
            return db.query(
              `UPDATE products SET client_id = $1, status = $2 WHERE id = $3 RETURNING id, status, client_id`,
              [userId, status, id]
            );
          } else {
            console.log("You can't reserve product on yourself.");
          }
        } else if (status === "closed") {
          console.log(
            "You cant change status from open to closed. Reserve it first."
          );
        }
        break;
      case "reserved":
        if (status === "open") {
          if (
            userId === productToChange[0].client_id ||
            userId === productToChange[0].author_id
          ) {
            return db.query(
              `UPDATE products SET client_id = $1, status = $2 WHERE id = $3 RETURNING id, status, client_id`,
              [null, status, id]
            );
          } else {
            console.log("Error. You are not an author or reserver.");
          }
        } else if (status === "closed") {
          if (
            userId === productToChange[0].client_id ||
            userId === productToChange[0].author_id
          ) {
            return db.query(
              `UPDATE products SET client_id = $1, status = $2 WHERE id = $3 RETURNING id, status, client_id`,
              [productToChange[0].client_id, status, id]
            );
          } else {
            console.log("Error. You are not an author or reserver.");
          }
        }
        break;
      default:
        console.log("Status to change unknown.");
        break;
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
