const fs = require("fs");
const path = require("path");
const uuid = require("uuid");

class FileService {
  saveFile(file, folderName) {
    try {
      const fileName = uuid.v4() + ".jpg";
      const filePath = path.resolve(`static/${folderName}`, fileName);
      file.mv(filePath);
      return fileName;
    } catch (e) {
      console.log(`Error saving file: ${e.message}`);
    }
  }
  saveFiles(files, folderName) {
    try {
      let filePaths = [];
      if (Array.isArray(files)) {
        files.forEach((file) => {
          filePaths.push(this.saveFile(file, folderName));
        });
      } else {
        filePaths.push(this.saveFile(files, folderName));
      }
      return filePaths;
    } catch (e) {
      console.log(`Error saving files: ${e.message}`);
    }
  }
  deleteFile(file, folderName) {
    try {
      const filePath = path.resolve(`static/${folderName}`, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (e) {
      console.log(`Error deleting file: ${e.message}`);
    }
  }
  deleteFiles(files, folderName) {
    try {
      files.forEach((file) => {
        this.deleteFile(file, folderName);
      });
    } catch (e) {
      console.log(`Error deleting files: ${e.message}`);
    }
  }
}

module.exports = new FileService();
