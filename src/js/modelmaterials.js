import * as THREE from "three";
import * as dat from "dat.gui";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const donkeyUrl = new URL("../assets/Donkey.gltf", import.meta.url);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45, //Góc có thể nhìn được
  window.innerWidth / window.innerHeight, //Tỉ lệ của camera
  0.1, //Điểm cực gần
  1000 //Điểm cực xa
);

renderer.setClearColor(0xa3a3a3);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(10, 10, 10);
//Gọi phương thức cập nhật mỗi khi thay đổi vị trí camera
orbit.update();

//------------------------------------------------
const grid = new THREE.GridHelper(30, 30);
scene.add(grid);

const ambientLight = new THREE.AmbientLight(0xededed);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(directionalLight);
directionalLight.position.set(10, 11, 17);

const gui = new dat.GUI();

const options = {
  Main: 0x2f3130,
  "Main light": 0x7c7c7c,
  "Main dark": 0x0a0a0a,
  Hooves: 0x0f0b0d,
  Hair: 0x0a0a0a,
  Muzzle: 0x0b0804,
  "Eye dard": 0x020202,
  "Eye white": 0xbebebe,
};

const assetLoader = new GLTFLoader();

assetLoader.load(
  donkeyUrl.href,
  //Gọi khi tài nguyên đc tải
  function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    //Thêm công cụ chọn màu cho từng phần
    gui.addColor(options, "Main").onChange(function (e) {
      model.getObjectByName("Cube").material.color.setHex(e);
    });

    gui.addColor(options, "Main light").onChange(function (e) {
      model.getObjectByName("Cube_1").material.color.setHex(e);
    });
    gui.addColor(options, "Main dark").onChange(function (e) {
      model.getObjectByName("Cube_2").material.color.setHex(e);
    });
    gui.addColor(options, "Hooves").onChange(function (e) {
      model.getObjectByName("Cube_3").material.color.setHex(e);
    });
    gui.addColor(options, "Hair").onChange(function (e) {
      model.getObjectByName("Cube_4").material.color.setHex(e);
    });
    gui.addColor(options, "Muzzle").onChange(function (e) {
      model.getObjectByName("Cube_5").material.color.setHex(e);
    });
    gui.addColor(options, "Eye dard").onChange(function (e) {
      model.getObjectByName("Cube_6").material.color.setHex(e);
    });
    gui.addColor(options, "Eye white").onChange(function (e) {
      model.getObjectByName("Cube_7").material.color.setHex(e);
    });
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

//----------------------------------------------------------------
function animate() {
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
