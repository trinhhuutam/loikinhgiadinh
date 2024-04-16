module.exports = {
  output: "export",
  images: {
    formats: ["image/avif", "image/webp"],
    loader: "cloudinary",
    path: "",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};
