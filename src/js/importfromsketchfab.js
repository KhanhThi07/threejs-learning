import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

renderer.setClearColor(0xa3a3a3);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(6, 6, 6);
orbit.update();

// const ambientLight = new THREE.AmbientLight(0xededed, 0.8);
// scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// scene.add(directionalLight);
// directionalLight.position.set(10, 11, 7);

const grid = new THREE.GridHelper(30, 30);
scene.add(grid);
//------------------------------------------------

// const gui = new dat.GUI();

// const options = {
//   Circle000_12: 0x000000,
// };

const loadingManager = new THREE.LoadingManager();
//Cung cấp thông tin quá trình tải
// loadingManager.onStart = function (url, item, total) {
//   console.log(`Started loading:${url}`);
// }; //item:chỉ mục đối tượng, total:tổng số đối tượng

const progressBar = document.getElementById("progress-bar");
loadingManager.onProgress = function (url, loaded, total) {
  progressBar.value = (loaded / total) * 100;
};
//Loại bỏ giao diện loading khi quá trình tải đã hoàn tất
const progressBarContainer = document.querySelector(".progress-bar-container");
loadingManager.onLoad = function () {
  progressBarContainer.style.display = "none";
};

const gltfLoader = new GLTFLoader(loadingManager);
const rgbeLoader = new RGBELoader(loadingManager);

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.toneMappingExposure = 4;

let car;

rgbeLoader.load("./assets/MR_INT-005_WhiteNeons_NAD.hdr", function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;

  gltfLoader.load(
    "./assets/mars_one_mission_-_base/monkey.d5659f94.glb",
    function (gltf) {
      const model = gltf.scene;
      scene.add(model);

      // gui.addColor(options, "Circle000_12").onChange(function (e) {
      //   model.getObjectByName("Circle000_12").material.color.setHex(e);
      // });
      car = model;
    }
  );
});

//----------------------------------------------------------------

function animate(time) {
  if (car) car.rotation.y = -time / 3000;
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
