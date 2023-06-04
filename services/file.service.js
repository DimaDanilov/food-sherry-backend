const cloudinary = require("../cloudinary");

class FileService {
  async saveFile(file, folder, folderPlaceholder, id) {
    try {
      const result = await cloudinary.uploader.upload(file, {
        public_id: id ? `${folderPlaceholder}_${id}` : undefined,
        folder: folder,
        width: 250,
        height: 250,
        quality: 100,
        crop: "fit",
      });
      return result.url;
    } catch (e) {
      console.log(`Error saving file: ${e.message}`);
    }
  }
  async saveFiles(files, folder, folderPlaceholder, id) {
    try {
      let filePaths = [];
      if (Array.isArray(files)) {
        for (const file of files) {
          const filePath = await this.saveFile(
            file,
            folder,
            folderPlaceholder,
            id
          );
          filePaths.push(filePath);
        }
      } else {
        filePaths.push(
          await this.saveFile(files, folder, folderPlaceholder, id)
        );
      }
      return filePaths;
    } catch (e) {
      console.log(`Error saving files: ${e.message}`);
    }
  }
  async deleteFile(folder, folderPlaceholder, id) {
    try {
      console.log(`${folder}/${folderPlaceholder}_${id}`);
      await cloudinary.uploader.destroy(`${folder}/${folderPlaceholder}_${id}`);
    } catch (e) {
      console.log(`Error deleting file: ${e.message}`);
    }
  }
  async deleteFiles(files, folder, folderPlaceholder, id) {
    try {
      for (const file of files) {
        await this.deleteFile(folder, folderPlaceholder, file);
      }
    } catch (e) {
      console.log(`Error deleting files: ${e.message}`);
    }
  }
}

module.exports = new FileService();
