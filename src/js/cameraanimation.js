import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js"; //Bộ khung xương

const renderer = new THREE.WebGLRenderer({ antialias: true });

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

// const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(10, 0, 20);
// camera.lookAt(0, 0, 0);
// orbit.update();

const ambientLight = new THREE.AmbientLight(0xededed, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(directionalLight);
directionalLight.position.set(10, 11, 7);

// const grid = new THREE.GridHelper(30, 30);
// scene.add(grid);
//------------------------------------------------

// const box = new THREE.Mesh(
//   new THREE.BoxGeometry(),
//   new THREE.MeshBasicMaterial({ color: 0xffaa00 })
// );
// box.position.y = 0.5;
// scene.add(box);

const assetLoader = new GLTFLoader();

let mixer;
// let mixer2;
// let mixer3;
// let car;
assetLoader.load("./assets/scene.gltf", function (gltf) {
  const model = gltf.scene;
  model.scale.set(0.01, 0.01, 0.01);
  // const model2 = SkeletonUtils.clone(model);
  // const model3 = SkeletonUtils.clone(model);

  scene.add(model);
  // scene.add(model2);
  // scene.add(model3);

  // model2.position.set(7, -4, 6);
  // model3.position.set(7, -4, -2);

  mixer = new THREE.AnimationMixer(model);
  // mixer2 = new THREE.AnimationMixer(model2);
  // mixer3 = new THREE.AnimationMixer(model3);

  const clips = gltf.animations;
  const clip = THREE.AnimationClip.findByName(clips, "Take 001");

  clips.forEach(function (clip) {
    const action = mixer.clipAction(clip);
    // const action2 = mixer2.clipAction(clip);
    // const action3 = mixer3.clipAction(clip);

    action.play();
    action.timeScale = 0.5;
    // action2.play();
    // action2.startAt(0.2);
    // action2.timeScale = 0.5;
    // action3.play();
    // action3.startAt(0.35);
    // action3.timeScale = 0.5;
  });

  window.addEventListener("mousedown", cameraAnimation);
});

const tl = gsap.timeline();
const duration = 8;
const ease = "none";
let animationIsFinished = false;

//Ngăn hoạt ảnh được kích hoạt vào lần khác khi 1 sự kiện nhấp chuột đc ghi lại
function cameraAnimation() {
  if (!animationIsFinished) {
    animationIsFinished = true;
    //Bản dịch camera sang trái nếu ko cập nhật hướng
    tl.to(camera.position, {
      x: 0,
      duration,
      ease,
    });
  }
}
// const tl = gsap.timeline();
// window.addEventListener("mousedown", function () {
//   //Áp dụng hoạt ảnh
//   tl.to(camera.position, {
//     z: 14,
//     duration: 1.5,
//     //Cập nhật hướng khi thay đổi vị trí của máy ảnh
//     onUpdate: function () {
//       camera.lookAt(0, 0, 0);
//     },
//   })
//     .to(camera.position, {
//       y: 10,
//       duration: 1.5,
//       onUpdate: function () {
//         camera.lookAt(0, 0, 0);
//       },
//     })
//     .to(camera.position, {
//       x: 10,
//       y: 5,
//       z: 2,
//       duration: 1.5,
//       onUpdate: function () {
//         camera.lookAt(0, 0, 0);
//       },
//     });
// });

// const loadingManager = new THREE.LoadingManager();

// const progressBar = document.getElementById("progress-bar");
// loadingManager.onProgress = function (url, loaded, total) {
//   progressBar.value = (loaded / total) * 100;
// };
// //Loại bỏ giao diện loading khi quá trình tải đã hoàn tất
// const progressBarContainer = document.querySelector(".progress-bar-container");
// loadingManager.onLoad = function () {
//   progressBarContainer.style.display = "none";
// };
const clock = new THREE.Clock();

//----------------------------------------------------------------

function animate() {
  // if (car) car.rotation.y = -time / 3000;

  if (mixer) mixer.update(clock.getDelta());

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
