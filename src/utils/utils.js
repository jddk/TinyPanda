import UPNG from "upng-js";

export async function isPNG(file) {
  // 提取前8个字节
  const arraybuffer = await file.slice(0, 8).arrayBuffer();

  // PNG 的前8字节16进制表示
  const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  // const signature = [137, 80, 78, 71, 13, 10, 26, 10]

  // 转为 8位无符号整数数组 方便对比
  // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
  const source = new Uint8Array(arraybuffer);

  // 逐个字节对比
  for (let i = 0; i < signature.length; i++) {
    if (source[i] !== signature[i]) {
      return false;
    }
  }
  return true;
}

export async function compressPNGImage(file, ops = {}) {
  const { quality = 1, noCompressIfLarger = true } = ops;
  let { width, height } = ops;
  const arrayBuffer = await file.arrayBuffer();
  const decoded = UPNG.decode(arrayBuffer);
  const rgba8 = UPNG.toRGBA8(decoded);

  // 如果只指定了宽度或高度，则按比例缩放
  if (width && !height) {
    height = Math.round(decoded.height * (width / decoded.width));
  } else if (!width && height) {
    width = Math.round(decoded.width * (height / decoded.height));
  }

  // TODO：尺寸缩放，使用 canvas 先缩放

  width = width || decoded.width;
  height = height || decoded.height;

  const compressed = UPNG.encode(rgba8, width, height, 256 * quality);

  const newFile = new File([compressed], file.name || `${date.now()}.png`, {
    type: "image/png",
  });

  if (!noCompressIfLarger) {
    return newFile;
  }

  return file.size > newFile.size ? newFile : file;
}

export function formatSize(size, pointLength, units) {
  let unit;
  units = units || ["B", "K", "M", "G", "TB"];
  // eslint-disable-next-line no-cond-assign
  while ((unit = units.shift()) && size > 1024) {
    size /= 1024;
  }
  return (
    (unit === "B"
      ? size
      : size.toFixed(pointLength === undefined ? 2 : pointLength)) + unit
  );
}

export function downloadFile(file, name) {
  const a = document.createElement("a");
  const url = URL.createObjectURL(file);
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
