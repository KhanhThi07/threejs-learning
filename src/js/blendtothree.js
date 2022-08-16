import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const dogUrl = new URL("../assets/doggo2.glb", import.meta.url);

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

const grid = new THREE.GridHelper(30, 30);
scene.add(grid);

const assetLoader = new GLTFLoader();

let mixer;

assetLoader.load(
  dogUrl.href,
  function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    mixer = new THREE.AnimationMixer(model);
    const clips = gltf.animations;
    // const clip = THREE.AnimationClip.findByName(clips, "HeadAction");
    // const action = mixer.clipAction(clip);
    // action.play();
    clips.forEach(function (clip) {
      const action = mixer.clipAction(clip);
      action.play();
    });
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

const clock = new THREE.Clock();

function animate() {
  if (mixer) mixer.update(clock.getDelta());
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
