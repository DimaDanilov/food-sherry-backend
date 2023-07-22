# Food Sharing Backend

Food Sharing Backend is a backend part of the app, used to create food giveaway posts and reserve food by users.

## Preview

You can check [Food Sharing App](https://food-sherry.vercel.app/) here.

## Technology

This project made on Node.js with usage of Express.js, Cloudinary and PostgreSQL database.

### `API endpoints`

| Route                                    | Method |
| ---------------------------------------- | ------ |
| /product                                 | GET    |
| /product/:id                             | GET    |
| /product/user_products/:profile_id       | GET    |
| /product/user_products_total/:profile_id | GET    |
| /product                                 | POST   |
| /product                                 | PUT    |
| /product/status                          | PUT    |
| /product/:id                             | DELETE |
| /category                                | GET    |
| /auth/register                           | POST   |
| /auth/login                              | POST   |
| /auth/check                              | GET    |
| /user                                    | GET    |
| /user/:id                                | GET    |
| /user                                    | PUT    |
| /user/avatar                             | PUT    |
| /user/avatar/:id                         | DELETE |
