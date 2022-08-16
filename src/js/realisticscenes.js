import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
//Trình tải hình hdr
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

const hdrTextureURL = new URL(
  "../img/MR_INT-003_Kitchen_Pierre.hdr",
  import.meta.url
);

const renderer = new THREE.WebGLRenderer({ antialias: true }); //Khử răng cưa

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xa3a3a3);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 0, 7);

orbit.update();

// const ambientLight = new THREE.AmbientLight(0x333333);
// scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// scene.add(directionalLight);
// directionalLight.position.set(3, 3, 3);

//------------------------------------------------
//Ánh xạ màu của nó với không gian màu sRGB(Mã hóa đầu ra)
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping; //Thuật toán ánh xạ tông màu
renderer.toneMappingExposure = 1.8; //Độ phơi sáng

//Tạo phiên bản của trình tải rgb,
const loader = new RGBELoader();
loader.load(hdrTextureURL, function (texture) {
  //Ánh xạ kết cấu thành ánh xạ phản chiếu hình chũ nhật
  texture.mapping = THREE.EquirectangularReflectionMapping;
  //Kết cấu sẽ được tải
  scene.background = texture; //Đặt kết cấu làm nền cho cảnh
  scene.environment = texture; // Lấy thông tin ánh sáng từ kết cấu môi trường

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 50, 50),
    new THREE.MeshStandardMaterial({
      roughness: 0, //giảm độ nhám để có hình ảnh phản chíếu
      metalness: 0.5, //Tăng độ kim loại
      color: 0xffea00,
      //   envMap: texture,
    })
  );
  scene.add(sphere);
  sphere.position.x = 1.5;

  const sphere2 = new THREE.Mesh(
    new THREE.SphereGeometry(1, 50, 50),
    new THREE.MeshStandardMaterial({
      roughness: 0, //giảm độ nhám để có hình ảnh phản chíếu
      metalness: 0.5, //Tăng độ kim loại
      color: 0xff0000,
    })
  );
  scene.add(sphere2);
  sphere2.position.x = -1.5;
});

//------------------------------------------------
function animate(time) {
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  //Tỉ lệ co của máy ảnh
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
