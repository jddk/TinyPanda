<template>
  <div class="wrap">
    <!-- =====头部==== -->

    <main class="main">
      <img v-show="!happy" class="panda" src="@/assets/img/panda1.png" alt="" />
      <img v-show="happy" class="panda" src="@/assets/img/panda2.png" alt="" />

      <div class="box">
        <img class="box-down" src="@/assets/img/zusun.png" alt="download" />
        <h4>Drop your PNG or JPEG files here!</h4>
        <input
          class="box-input"
          type="file"
          accept=".png, .jpg, .jpeg"
          multiple
          title=""
          @change="changeFile"
        />
      </div>
      <div class="grass"></div>
    </main>

    <main v-show="comp_files.length == 0" class="tip">
      <h3 class="tip-title">Lossless compression of images</h3>
      <div class="imgs">
        <div class="img">
          <img src="@/assets/img1.png" alt="" />
          <p class="img-text">Origina <span class="red">2MB</span></p>
        </div>
        <div class="img-center">VS</div>
        <div class="img">
          <img src="@/assets/img2.png" alt="" />
          <p class="img-text">Compression <span class="red">741KB</span></p>
        </div>
      </div>
    </main>
    <!-- 列表 -->
    <main v-show="comp_files.length != 0" class="content">
      <div class="items">
        <main v-for="(item, i) in comp_files" class="item">
          <div class="item-title">
            {{ item.name }}
          </div>
          <div class="item-size1">{{ formatSize(item.org_size) }}</div>
          <div class="item-press">Finished</div>
          <div class="item-size2">{{ formatSize(item.size) }}</div>
          <div class="item-download" @click="clickDown(item)">Download</div>
          <div class="item-end">
            -{{
              Number.parseInt(
                ((item.org_size - item.size) / item.org_size) * 100
              )
            }}%
          </div>
        </main>
      </div>

      <!-- down -->
      <div class="btns">
        <button @click="clearAll" class="button-download button-clear">
          <img class="icon-down" src="@/assets/img/clear.svg" alt="" />
          Clear All
        </button>
        <button @click="downAll" class="button-download">
          <img class="icon-down" src="@/assets/img/icon-down.svg" alt="" />
          Download All
        </button>
      </div>

      <!-- 统计 -->
      <div class="total">
        <div class="total-title">Panda just saved you</div>
        <div class="total-num">{{ total }}%</div>
        <div class="total-size">{{ saveSpace }} total</div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import JSZip from "jszip";
import {
  downloadFile,
  compressPNGImage,
  formatSize,
  isPNG,
} from "@/utils/utils.js";
import { isJPG, compressJPGImage } from "@/utils/jpg.js";
const org_files = ref([]);
const comp_files = ref([]);
const total = ref(0);
const saveSpace = ref(0);
const happy = ref(false);
const ref_dialog = ref();

async function changeFile(event) {
  happy.value = false;
  // 取出原始文件
  // 取出不同项
  const differentItems = [...event.target.files].filter((item1) => {
    return !org_files.value.some((item2) => {
      let bol = item2.size == item1.size && item2.name == item1.name;
      return bol;
    });
  });
  org_files.value = [...org_files.value, ...differentItems];

  let compressedFile = null;
  //  遍历压缩
  differentItems.forEach(async (file, i) => {
    if (await isPNG(file)) {
      compressedFile = await compressPNGImage(file, {
        quality: 1,
        noCompressIfLarger: true,
      });
    } else if (await isJPG(file)) {
      compressedFile = await compressJPGImage(
        file,
        "browser-image-compression",
        {
          quality: 1,
          noCompressIfLarger: true,
        }
      );
    } else {
      compressedFile = await compressJPGImage(
        file,
        "browser-image-compression",
        {
          quality: 1,
          noCompressIfLarger: true,
        }
      );
    }
    compressedFile.org_size = differentItems[i].size;

    comp_files.value.push(compressedFile);
  });
  event.srcElement.value = null;
  setTimeout(() => {
    calcTotal();
  }, 500);
}

function clickDown(item) {
  downloadFile(item, item.name);
}

function calcTotal() {
  let total_org = 0;
  let total_comp = 0;
  comp_files.value.forEach((item) => {
    total_org += item.org_size;
    total_comp += item.size;
  });
  total.value = Number.parseInt(((total_org - total_comp) / total_org) * 100);
  saveSpace.value = formatSize(total_org - total_comp);
  happy.value = true;
}

function downAll() {
  const zip = new JSZip();

  // 将每个 File 对象添加到 zip 文件中
  comp_files.value.forEach((file, index) => {
    zip.file(file.name, file);
  });

  // 生成 zip 文件
  zip.generateAsync({ type: "blob" }).then((content) => {
    downloadFile(content, `TinyJpg${new Date().getTime()}.zip`);
  });
}

function clearAll() {
  const result = confirm("Clear All");

  if (result) {
    org_files.value = [];
    comp_files.value = [];
    total.value = 0;
    saveSpace.value = 0;
    happy.value = false;
  }
}

function clickVip() {
  ref_dialog.value.toShow();
}
</script>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  position: relative;
  background-image: url("@/assets/img/zuzi.png"), url("@/assets/img/zuzi.png"),
    url("@/assets/img/cloud-left.png"), url("@/assets/img/cloud-right.png");
  background-size: 600px auto, 600px auto, 300px auto, 300px auto, 300px auto;
  background-position: right -150px bottom -60px, right -204px bottom -60px,
    right -100px bottom, top left 20%, top left 60%;
  background-repeat: no-repeat;
  margin-bottom: 18px;
  overflow: hidden;
}

.box {
  width: 384px;
  height: 160px;
  border: 2px dashed #616778;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  position: relative;
}

.box-input {
  position: absolute;
  width: 384px;
  height: 160px;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  opacity: 0;
  z-index: 10;
  cursor: pointer;
}

.box:hover {
  border: 2px dashed #000;
  background: rgba(0, 0, 0, 0.1);
}

.box-down {
  width: 60px;
  margin-bottom: 20px;
}

.panda {
  width: 200px;
  height: auto;
  position: absolute;
  bottom: -20px;
  left: 90px;
  z-index: 0;
  transition: all 0.5s linear;
}

.grass {
  width: 100%;
  height: 40px;
  background-image: url("@/assets/img/grass.png");
  background-size: 120% 100%;
  background-position: center;
  position: absolute;
  bottom: 0;
}

/* imgs */
.tip-title {
  font-size: 30px;
  text-align: center;
  margin-bottom: 18px;
}

.imgs {
  display: grid;
  grid-template-columns: 1fr 100px 1fr;
  align-items: center;
  padding: 0 30px;
}

.img-center {
  text-align: center;
  font-size: 30px;
  font-weight: 600;
  margin-top: -36px;
}

.img-text {
  text-align: center;
  font-size: 20px;
  font-weight: 600;
}

.img img {
  width: 100%;
  height: auto;
  border: 10px solid #fff;
  border-radius: 10px;
}

.red {
  color: #ff0000;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 100px;
}

.items {
  padding: 10px;
  width: 80vw;
  border: 1px solid #bbcbd0;
  background: #fff;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 18px;
  /* transition: all 0.5s linear; */
}

.item {
  width: 100%;
  height: 36px;
  border: 1px solid #e0e0e0;
  background: #f0f0f0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  display: grid;
  grid-template-columns: 1fr 70px 120px 70px 80px 50px;
  gap: 10px;
}

.item-title {
  font-weight: 600;
  text-overflow: ellipsis;
  overflow: hidden;
  text-wrap: nowrap;
}

.item-press {
  height: 30px;
  border-radius: 20px;
  border: 3px solid #fff;
  background: #82ea22;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-size1 {
  font-weight: 600;
  color: #7eb631;
}

.item-size2 {
  font-weight: 600;
  color: #7eb631;
}

.item-download {
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
}

.item-end {
  font-weight: 600;
}

/* button-download */
.btns {
  display: flex;
  align-items: center;
  gap: 40px;
}

.button-download {
  font-weight: 600;
  font-size: 18px;
  background-color: #0aa574;
  border-bottom-color: #029365;
  text-shadow: 2px 2px 2px #018259;
  color: #fff;
  border-radius: 4px;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 18px;
}

.icon-down {
  width: 20px;
}

.button-clear {
  background-color: #a0a0a0;
  border-bottom-color: #a0a0a0;
  text-shadow: 2px 2px 2px #a0a0a0;
}

/* 统计 */
.total {
  color: #505563;
  background: #f0f0f0;
  box-shadow: inset 0.3rem 0.3rem 0 #fff, inset -0.3rem -0.3rem 0 #fff;
  width: 380px;
  display: grid;
  grid-template-columns: 1fr 100px 1fr;
  padding: 16px 18px;
  gap: 10px;
  align-items: center;
}

.total-title {
  font-size: 20px;
  text-align: left;
}

.total-num {
  font-size: 50px;
  font-weight: 600;
}

.total-size {
  font-size: 18px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  height: 100%;
  color: #7eb631;
}

/* 右上角VIP */
.vip {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.6);
  z-index: 10;
  cursor: pointer;
}

.vip-logo {
  width: 40px;
  height: 40px;
}
</style>
