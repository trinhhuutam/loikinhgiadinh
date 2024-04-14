const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

const data = require('./new_data.json');

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: 'dzrvu3h8s',
  api_key: '331443986822223',
  api_secret: 'iChWRhqUAuAn6kcQ5Hw_gR4Ey-w',
  secure: true,
});

// Kiểm tra xem đường dẫn có phải là một tập tin hay không
function isFile(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

// Hàm tải lên tệp
async function uploadFile(directoryPath, p, root, parent, index = 0) {
  const filePath = path.join(directoryPath, p);
  
  if (isFile(filePath)) {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'loi-kinh-gia-dinh-2', 
        use_filename: true, 
        use_filename_as_display_name: true,
        resource_type: 'image', 
        tags: [parent.title, root?.title, ...parent.page], 
        context: `alt=${p}|caption=${root?.title} - ${parent.title}|page-number=${parent.page.toString()}`
      });

      console.log(`${p} : ${result.public_id}`);
      
      if (!parent['public_id']) {
        parent['public_id'] = [];
      }
      
      parent['public_id'][index] = result.public_id;
      
      return result;
    } catch (uploadErr) {
      console.error(`Error uploading ${p}:`, uploadErr);
      throw uploadErr;
    }
  } else {
    console.error(`File not found: ${filePath}`);
    return null;
  }
}

// Hàm tải lên
async function upload() {
  const directoryPath = '/Users/khoidang/Downloads/ilovepdf_pages-to-jpg';
  let promises = [];

  data.section.forEach(s => {
    s.url.forEach(async (p, i) => {
      promises.push(uploadFile(directoryPath, p, null, s, i));
    });
    
    if (s.chap) {
      s.chap.forEach(c => {
        c.url.forEach(async (p, i) => {
          promises.push(uploadFile(directoryPath, p, s, c, i));
        });
      });
    }
  });

  try {
    // Chờ cho tất cả các promises hoàn thành và lấy kết quả
    const results = await Promise.all(promises);
    // Đường dẫn đến file JSON mới
const newFilePath = './new_data.json';

// Ghi dữ liệu mới vào file JSON
fs.writeFileSync(newFilePath, JSON.stringify(data, null, 2));
    console.log('All files processed successfully:', results);
  } catch (error) {
    console.error('Error processing files:', error);
  }
}

// Gọi hàm tải lên
upload();
