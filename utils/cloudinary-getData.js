const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

const data = require("./new_data.json");

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: "dzrvu3h8s",
  api_key: "331443986822223",
  api_secret: "iChWRhqUAuAn6kcQ5Hw_gR4Ey-w",
  secure: true,
});
// Hàm tải lên
async function upload() {
  const results = await cloudinary.search
    .expression(`folder:loi-kinh-gia-dinh-2/*`)
    .sort_by("public_id", "desc")
    .max_results(400)
    .execute();
    if(!results){
      console.log('Stop')
      return;
    }
  console.log(results.resources.length);
    
  data.section.forEach((s,ri) => {
    s.public_id?.forEach(async (p, ci) => {
      // tìm
      updateData(p, s, results.resources,ri);
    });

    if (s.chap) {
      s.chap.forEach((c,si) => {
        c.public_id?.forEach(async (p, i) => {
          updateData(p, c, results.resources,si);
        });
      });
    }
  });

  try {
    // Đường dẫn đến file JSON mới
    const newFilePath = "./update_data.json";

    // Ghi dữ liệu mới vào file JSON
   await fs.writeFileSync(newFilePath, JSON.stringify(data, null, 2));
    console.log("All files processed successfully:");
  } catch (error) {
    console.error("Error processing files:", error);
  }
}

function updateData(public_id, node, results,id) {
  let data = results.find(m => m.public_id == public_id);
  if (data) {
    node["asset_ids"] = [...node["asset_id"]??[], data?.asset_id];
    node["data"] = [...node["data"]??[], data];
    node['id'] = id
  }
}

upload();


