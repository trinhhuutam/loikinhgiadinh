const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

const data = require("./update_data.json");

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: "dzrvu3h8s",
  api_key: "331443986822223",
  api_secret: "iChWRhqUAuAn6kcQ5Hw_gR4Ey-w",
  secure: true,
});
// Hàm tải lên
async function upload() {

  data.section.forEach((s,ri) => {
    s.public_id?.forEach(async (p, ci) => {
      // tìm
      updateData( s,ri);
    });

    if (s.chap) {
      s.chap.forEach((c,si) => {
        c.public_id?.forEach(async (p, i) => {
          updateData( c,ri*100+si);
        });
      });
    }
  });

  try {
    // Đường dẫn đến file JSON mới
    const newFilePath = "./update_data2.json";

    // Ghi dữ liệu mới vào file JSON
   await fs.writeFileSync(newFilePath, JSON.stringify(data, null, 2));
    console.log("All files processed successfully:");
  } catch (error) {
    console.error("Error processing files:", error);
  }
}

function updateData(node,id) {
    node['id'] = id
}

upload();


