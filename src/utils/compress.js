import { isPNG, compressPNGImage, formatSize } from "./utils.js";

export async function compress(file) {
  if (!file) {
    return;
  }

  const ops = {
    quality: 1,
    noCompressIfLarger: true,
  };

  // 压缩图片
  const compressedFile = await compressPNGImage(file, ops);
  console.log(
    compressedFile,
    "===压缩后的图片===",
    formatSize(compressedFile.size)
  );
  console.log(URL.createObjectURL(compressedFile), "转URL");
 
