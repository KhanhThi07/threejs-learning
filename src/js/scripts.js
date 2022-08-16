//Tạo không gian tên
import * as THREE from "three";
//Module điều khiển quỹ đạo
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import * as dat from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import nebula from "../img/nebula.jpg";
import stars from "../img/stars.jpg";

const monkeyUrl = new URL("../assets/monkey.glb", import.meta.url);

//Tạo phiên bản của trình kết xuất WebGL
const renderer = new THREE.WebGLRenderer();
//Bật bản đồ bóng
renderer.shadowMap.enabled = true;

//Đặt kích thước của không gian đó chiếm toàn bộ trang
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75, //Góc có thể nhìn được
  window.innerWidth / window.innerHeight, //Tỉ lệ của camera
  0.1, //Điểm cực gần
  1000 //Điểm cực xa
);

const orbit = new OrbitControls(camera, renderer.domElement);

//Trình trợ giúp trục, 5: độ dài trục
const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

camera.position.set(-10, 30, 30);
//Gọi phương thức cập nhật mỗi khi thay đổi vị trí camera
orbit.update();

//Tạo box
const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

//Tạo một mặt phẳng
const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  //Mặt sau
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

//Trình trợ giúp lưới
//(đối số 1: tăng bề mặt của lưới,đối số 2: chia lưới thành các ô vuông nhỏ hơn)
const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

//Tạo khối cầu
const sphereGeometry = new THREE.SphereGeometry(4);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0x0000ff,
  //Hiển thị khung xương
  wireframe: false,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.position.set(-10, 10, 0);
sphere.castShadow = true;

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
// scene.add(directionalLight);
// directionalLight.position.set(-30, 50, 0);
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.bottom = -12;

// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(dLightHelper);

// const dLightShadowHelper = new THREE.CameraHelper(
//   directionalLight.shadow.camera
// );
// scene.add(dLightShadowHelper);

const spotLight = new THREE.SpotLight(0xffffff);
scene.add(spotLight);
spotLight.position.set(-100, 100, 0);
spotLight.castShadow = true;
spotLight.angle = 0.2;

const sLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(sLightHelper);

// scene.fog = new THREE.Fog(0xffffff, 0, 200);
scene.fog = new THREE.FogExp2(0xffffff, 0.01);

//Tạo background
// renderer.setClearColor(0xffea00);
const textureLoader = new THREE.TextureLoader();
// scene.background = textureLoader.load(stars);
const cubeTextureLoader = new THREE.CubeTextureLoader();

scene.background = cubeTextureLoader.load([
  nebula,
  nebula,
  stars,
  stars,
  stars,
  stars,
]);

const box2Geometry = new THREE.BoxGeometry(4, 4, 4);
const box2Material = new THREE.MeshBasicMaterial({
  //   color: 0x00ff00,
  //   map: textureLoader.load(nebula),
});

const box2MultiMaterial = [
  new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(nebula) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(nebula) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
];

const box2 = new THREE.Mesh(box2Geometry, box2MultiMaterial);
scene.add(box2);
box2.position.set(0, 15, 10);
// box2.material.map = textureLoader.load(nebula);

//--Thay đổi hình dạng của lưới
//Tạo một mặt phẳng 10 10 10 10

const plane2Geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
const plane2Material = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true,
});
const plane2 = new THREE.Mesh(plane2Geometry, plane2Material);
scene.add(plane2);
plane2.position.set(10, 10, 15);

plane2.geometry.attributes.position.array[0] -= 10 * Math.random();
plane2.geometry.attributes.position.array[1] -= 10 * Math.random();
plane2.geometry.attributes.position.array[2] -= 10 * Math.random();
const lastPointZ = plane2.geometry.attributes.position.array.length - 1;
plane2.geometry.attributes.position.array[lastPointZ] -= 10 * Math.random();

//Đổ bóng
const sphere2Geometry = new THREE.SphereGeometry(4);

//Mã đổ bóng
// const vShader = `
//     void main(){
//         gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
//     }
// `;

// const fShader = `
//     void main(){
//         gl_FragColor = vec4(0.5, 0.5, 1.0,1.0);
//     }
// `;

const sphere2Material = new THREE.ShaderMaterial({
  vertexShader: document.getElementById("vertexShader").textContent,
  fragmentShader: document.getElementById("fragmentShader").textContent,
});
const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);
scene.add(sphere2);
sphere2.position.set(-5, 10, 10);

//3D models
const assetLoader = new GLTFLoader();
assetLoader.load(
  monkeyUrl.href,
  function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    model.position.set(-12, 4, 10);
  },
  undefined,
  function (error) {
    console.erre(error);
  }
);

const gui = new dat.GUI();

const options = {
  sphereColor: "#ffea00",
  wireframe: false,
  speed: 0.01,
  angle: 0.2,
  penumbra: 0,
  intensity: 1,
};

gui.addColor(options, "sphereColor").onChange(function (e) {
  sphere.material.color.set(e);
});

gui.add(options, "wireframe").onChange(function (e) {
  sphere.material.wireframe = e;
});

gui.add(options, "speed", 0, 0.1);
gui.add(options, "angle", 0, 1);
gui.add(options, "penumbra", 0, 1);
gui.add(options, "intensity", 0, 1);

let step = 0;

const mousePosition = new THREE.Vector2();

window.addEventListener("mousemove", function (e) {
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
});
const rayCaster = new THREE.Raycaster();

const sphereId = sphere.id;
box2.name = "theBox";

//Thực hiện phép biến đổi hình học: phép quay
function animate(time) {
  box.rotation.x = time / 1000;
  box.rotation.y = time / 1000;

  step += options.speed;
  sphere.position.y = 10 * Math.abs(Math.sin(step));

  spotLight.angle = options.angle;
  spotLight.penumbra = options.penumbra;
  spotLight.intensity = options.intensity;
  sLightHelper.update();

  rayCaster.setFromCamera(mousePosition, camera);
  const intersects = rayCaster.intersectObjects(scene.children);
  //   console.log(intersects);

  for (let i = 0; i < intersects.length; i++) {
    if (intersects[i].object.id === sphereId)
      intersects[i].object.material.color.set(0xff0000);
    //Xoay hộp nếu nó được di chuột qua
    if (intersects[i].object.name === "theBox") {
      intersects[i].object.rotation.x = time / 1000;
      intersects[i].object.rotation.y = time / 1000;
    }
  }

  plane2.geometry.attributes.position.array[0] = 10 * Math.random();
  plane2.geometry.attributes.position.array[1] = 10 * Math.random();
  plane2.geometry.attributes.position.array[2] = 10 * Math.random();
  plane2.geometry.attributes.position.array[lastPointZ] = 10 * Math.random();
  //Hoạt ảnh hoạt động
  plane2.geometry.attributes.position.needsUpdate = true;

  //Liên kết scene với camera
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
