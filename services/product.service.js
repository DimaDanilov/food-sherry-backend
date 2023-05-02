const fileService = require("../services/file.service");
const { Product, Category, UserAccount } = require("../models/models");
const { Op } = require("sequelize");

const PRODUCTS_ON_PRODUCTS_PAGE = 12;
const PRODUCTS_ON_PROFILE = 8;

class ProductService {
  async createProduct(product, pictures, userId) {
    const fileNames = fileService.saveFiles(pictures, "food_images");
    return await Product.create({
      title: product.title,
      author_id: userId,
      category_id: product.category_id,
      description: product.description,
      amount: product.amount,
      time_to_take: product.time_to_take,
      location: product.location,
      images: fileNames,
      status: product.status,
    });
  }

  async getProducts(
    searchQuery,
    pageQuery,
    statusQuery,
    sortQuery,
    categoriesQuery
  ) {
    return await Product.findAndCountAll({
      attributes: [
        "id",
        "title",
        "client_id",
        "description",
        "amount",
        "location",
        "images",
        "status",
        "time_created",
        "time_to_take",
      ],
      where: {
        [Op.and]: [
          statusQuery && { status: statusQuery },
          searchQuery && {
            title: { [Op.iLike]: `%${searchQuery}%` },
          },
          categoriesQuery && {
            category_id: {
              [Op.in]: categoriesQuery,
            },
          },
        ],
      },
      limit: Number(pageQuery) ? PRODUCTS_ON_PRODUCTS_PAGE : undefined,
      offset: Number(pageQuery)
        ? PRODUCTS_ON_PRODUCTS_PAGE * (pageQuery - 1)
        : undefined,
      order:
        sortQuery === "datedown"
          ? [["time_to_take", "DESC"]]
          : [["time_to_take"]],
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
        {
          model: UserAccount,
          as: "author",
          attributes: [
            "id",
            "name",
            "surname",
            "company_name",
            "email",
            "phone",
            "avatar",
            "time_created",
          ],
        },
      ],
    });
  }

  async getOneProduct(productId) {
    return Product.findOne({
      where: {
        id: productId,
      },
      attributes: [
        "id",
        "title",
        "client_id",
        "description",
        "amount",
        "location",
        "images",
        "status",
        "time_created",
        "time_to_take",
      ],
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
        {
          model: UserAccount,
          as: "author",
          attributes: [
            "id",
            "name",
            "surname",
            "company_name",
            "email",
            "phone",
            "avatar",
            "time_created",
          ],
        },
      ],
    });
  }

  async getUserProducts(userId, pageQuery, statuses, userRole) {
    if (statuses && userRole) {
      return await Product.findAndCountAll({
        attributes: ["id", "title", "images", "status"],
        where: {
          [userRole]: userId,
          status: statuses,
        },
        limit: Number(pageQuery) ? PRODUCTS_ON_PROFILE : undefined,
        offset: Number(pageQuery)
          ? PRODUCTS_ON_PROFILE * (pageQuery - 1)
          : undefined,
        order: [["time_created", "DESC"]],
      });
    } else {
      console.log("You didn't pass statuses or role.");
    }
  }

  async getProductsCountByUser(authorId) {
    return await Product.count({
      where: {
        author_id: authorId,
      },
    });
  }

  async updateProduct(product, userId) {
    const existProduct = await Product.findOne({
      attributes: ["id", "status", "author_id"],
      where: { id: product.id },
    });
    if (!existProduct) {
      console.log("THERE IS NO SUCH PRODUCT");
    } else if (Number(existProduct.author_id) !== userId) {
      console.log("ERROR AUTH");
    } else if (existProduct.status === "closed") {
      console.log("STATUS IS CLOSED. YOU CANT CHANGE PRODUCT ANYMORE");
    } else {
      return await Product.update(
        {
          title: product.title,
          author_id: userId,
          category_id: product.category_id,
          description: product.description,
          amount: product.amount,
          time_to_take: product.time_to_take,
          location: product.location,
        },
        {
          where: { id: product.id },
        }
      );
    }
  }

  async updateProductStatus(product, userId) {
    const productToChange = await Product.findOne({
      attributes: ["author_id", "client_id", "status"],
      where: { id: product.id },
    });

    if (!productToChange) {
      console.log("No product found");
    } else {
      switch (productToChange.status) {
        case product.status:
          console.log("You cant change status on the same status.");
          break;
        case "closed":
          console.log("Status is closed. You can't change it anymore.");
          break;
        case "open":
          if (product.status === "reserved") {
            if (userId !== productToChange.author_id) {
              return await Product.update(
                {
                  client_id: userId,
                  status: product.status,
                },
                {
                  where: { id: product.id },
                  returning: true,
                  plain: true,
                }
              );
            } else {
              console.log("You can't reserve product on yourself.");
            }
          } else if (product.status === "closed") {
            console.log(
              "You cant change status from open to closed. Reserve it first."
            );
          }
          break;
        case "reserved":
          if (
            userId === productToChange.client_id ||
            userId === productToChange.author_id
          ) {
            if (product.status === "open" || product.status === "closed") {
              return await Product.update(
                {
                  client_id:
                    product.status === "open"
                      ? null
                      : productToChange.client_id,
                  status: product.status,
                },
                {
                  where: { id: product.id },
                  returning: true,
                  plain: true,
                }
              );
            }
          } else {
            console.log("Error. You are not an author or reserver.");
          }
          break;
        default:
          console.log("Status to change unknown.");
          break;
      }
    }
  }

  async deleteProduct(productId, userId) {
    const product = await Product.findOne({
      attributes: ["images", "author_id"],
      where: { id: productId },
    });

    if (Number(product.author_id) !== userId) {
      console.log("ERROR AUTH");
    } else {
      fileService.deleteFiles(product.images, "food_images");

      return await Product.destroy({
        where: { id: productId },
      });
    }
  }
}

module.exports = new ProductService();
