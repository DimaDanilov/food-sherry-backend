const uuid = require("uuid");
const path = require("path");
const fs = require("fs");

class FileService {
  saveFiles(files) {
    try {
      let filePaths = [];
      files.forEach((file) => {
        const fileName = uuid.v4() + ".jpg";
        const filePath = path.resolve("static/food_images", fileName);
        file.mv(filePath);
        filePaths.push(fileName);
      });
      return filePaths;
    } catch (e) {
      console.log(e);
    }
  }
  deleteFiles(files) {
    try {
      files.forEach((file) => {
        const filePath = path.resolve("static/food_images", file);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    } catch (e) {
      console.log(`Error deleting files: ${e}`);
    }
  }
}

module.exports = new FileService();
