const fs = require("fs");
const path = require("path");
const uuid = require("uuid");

class FileService {
  saveFile(file, folderName) {
    const fileName = uuid.v4() + ".jpg";
    const filePath = path.resolve(`static/${folderName}`, fileName);
    file.mv(filePath);
    return fileName;
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
      console.log(e);
    }
  }
  deleteFile(file, folderName) {
    const filePath = path.resolve(`static/${folderName}`, file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
  deleteFiles(files, folderName) {
    try {
      files.forEach((file) => {
        deleteFile(file, folderName);
      });
    } catch (e) {
      console.log(`Error deleting files: ${e}`);
    }
  }
}

module.exports = new FileService();
