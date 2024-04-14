const cloudinary = require('cloudinary')
const fs = require('fs');
const path = require('path');

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

function upload(){
  // Đường dẫn đến thư mục chứa các tệp cần tải lên
const directoryPath = '/Users/khoidang/Downloads/ilovepdf_pages-to-jpg/test';
let array =[]
// Đọc tất cả các tệp trong thư mục
fs.readdir(directoryPath, async (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  // Lặp qua mỗi tệp và tải lên lên Cloudinary
  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    try {
      const result = await cloudinary.v2.uploader.upload(filePath,{folder: 'loi-kinh-gia-dinh', use_filename: true, use_filename_as_display_name: true,
      resource_type: 'image'});
      array.push({url: file, public_id:result.public_id})
      console.log(` ${file} : ${result.public_id}`);
    } catch (uploadErr) {
      console.error(`Error uploading ${file}:`, uploadErr);
    }
  }
});
console.log(array);
}

upload();