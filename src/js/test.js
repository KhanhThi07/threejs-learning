import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/orbitcontrols";
import { GLTFLoader } from "three/examples/jsm/loaders/gltfloader";
import gsap from "gsap";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils";

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

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(-10, 2, 10);
// camera.lookAt(0, 0, 0);
orbit.update();

const ambientLight = new THREE.AmbientLight(0xededed, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(directionalLight);
directionalLight.position.set(0, 20, -20);

// const grid = new THREE.GridHelper(30, 30);
// scene.add(grid);

renderer.setClearColor(0x00ffaa);
// const boxGeometry = new THREE.BoxGeometry();
// const boxMaterial = new THREE.MeshBasicMaterial({
//   color: 0x00ff00,
// });
// const box = new THREE.Mesh(boxGeometry, boxMaterial);
// box.position.y = 0.5;
// scene.add(box);

// let z;
// const zFinal = 14;
// const tl = gsap.timeline();
// window.addEventListener("mousedown", function () {
//   //   z = camera.position.z;
//   tl.to(camera.position, {
//     z: 14,
//     duration: 1.5,
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
//       x: 3,
//       duration: 1.5,
//       onUpdate: function () {
//         camera.lookAt(0, 0, 0);
//       },
//     });
// });

const assetLoader = new GLTFLoader();

let mixer;
let mixer2;
let mixer3;

assetLoader.load("./assets/scene.glb", function (gltf) {
  const model = gltf.scene;
  model.scale.set(0.01, 0.01, 0.01);
  // const model2 = SkeletonUtils.clone(model);
  // const model3 = SkeletonUtils.clone(model);

  scene.add(model);
  // scene.add(model2);
  // scene.add(model3);

  // model2.position.set(7, -4, 6);
  // model3.position.set(-7, 4, -2);

  mixer = new THREE.AnimationMixer(model);
  // mixer2 = new THREE.AnimationMixer(model2);
  // mixer3 = new THREE.AnimationMixer(model3);

  const clips = gltf.animations;
  const clip = THREE.AnimationClip.findByName(clips, "Taka 001");

  // const action2 = mixer2.clipAction(clip);
  // const action3 = mixer3.clipAction(clip);

  clips.forEach(function (clip) {
    const action = mixer.clipAction(clip);
    action.timeScale = 0.5;
    action.play();
  });
  // action.play();
  // action.timeScale = 0.5;
  // action2.play();
  // action2.startAt(0.2);
  // action2.timeScale = 0.5;
  // action3.play();
  // action3.startAt(0.35);
  // action3.timeScale = 0.5;

  window.addEventListener("mousedown", cameraAnimation);
});

const tl = gsap.timeline();
const duration = 8;
const ease = "none";
let animationIsFinished = false;

function cameraAnimation() {
  if (!animationIsFinished) {
    animationIsFinished = true;

    tl.to(camera.position, {
      x: 0,
      duration,
      ease,
    });
  }
}

const clock = new THREE.Clock();
function animate() {
  //   z += 0.1;
  //   if (z < zFinal) {
  //     camera.position.z = z;
  //   }
  if (mixer) {
    mixer.update(clock.getDelta());
  }
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
