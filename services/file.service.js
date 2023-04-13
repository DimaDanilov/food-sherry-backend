const uuid = require("uuid");
const path = require("path");
const fs = require("fs");

class FileService {
  _saveFile(file) {
    const fileName = uuid.v4() + ".jpg";
    const filePath = path.resolve("static/food_images", fileName);
    file.mv(filePath);
    return fileName;
  }
  saveFiles(files) {
    try {
      let filePaths = [];
      if (Array.isArray(files)) {
        files.forEach((file) => {
          filePaths.push(this._saveFile(file));
        });
      } else {
        filePaths.push(this._saveFile(files));
      }
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
