import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import starsTexture from "../img/stars.jpg";
import sunTexture from "../img/sun.jpg";
import mercuryTexture from "../img/mercury.jpg";
import venusTexture from "../img/venus.jpg";
import earthTexture from "../img/earth.jpg";
import marsTexture from "../img/mars.jpg";
import jupiterTexture from "../img/jupiter.jpg";
import saturnTexture from "../img/saturn.jpg";
import saturnRingTexture from "../img/saturnring.png";
import uranusTexture from "../img/uranus.jpg";
import uranusRingTexture from "../img/uranusring.png";
import neptuneTexture from "../img/neptune.jpg";
import plutoTexture from "../img/pluto.jpg";

const renderer = new THREE.WebGLRenderer();

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

camera.position.set(-10, 30, 30);
//Gọi phương thức cập nhật mỗi khi thay đổi vị trí camera
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const cubeTextureLoader = new THREE.CubeTextureLoader();

scene.background = cubeTextureLoader.load([
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
]);
const textureLoader = new THREE.TextureLoader();

const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
  map: textureLoader.load(sunTexture),
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

function createPlanete(size, texture, position, ring) {
  const geo = new THREE.SphereGeometry(size, 30, 30);
  const mat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture),
  });
  const mesh = new THREE.Mesh(geo, mat);
  const obj = new THREE.Object3D();
  obj.add(mesh);
  if (ring) {
    const ringGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      32
    );
    const ringMat = new THREE.MeshBasicMaterial({
      map: textureLoader.load(ring.texture),
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    obj.add(ringMesh);
    ringMesh.position.x = position;
    ringMesh.rotation.x = -0.5 * Math.PI;
  }
  scene.add(obj);
  // sun.add(mercury);
  mesh.position.x = position;
  return { mesh, obj };
}
const mercury = createPlanete(3.2, mercuryTexture, 28);
const venus = createPlanete(5.8, venusTexture, 44);
const earth = createPlanete(6, earthTexture, 62);
const mars = createPlanete(4, marsTexture, 78);
const jupiter = createPlanete(12, jupiterTexture, 100);
const neptune = createPlanete(7, neptuneTexture, 200);
const pluto = createPlanete(2.8, plutoTexture, 216);
const saturn = createPlanete(10, saturnTexture, 138, {
  innerRadius: 10,
  outerRadius: 20,
  texture: saturnRingTexture,
});
const uranus = createPlanete(7, uranusTexture, 176, {
  innerRadius: 7,
  outerRadius: 12,
  texture: uranusRingTexture,
});

//Tạo ánh sáng điểm
const pointLight = new THREE.PointLight(0xffffff, 2, 300);
scene.add(pointLight);

function animate() {
  sun.rotateY(0.004);
  mercury.mesh.rotateY(0.004);
  saturn.mesh.rotateY(0.038);
  venus.mesh.rotateY(0.002);
  mars.mesh.rotateY(0.018);
  jupiter.mesh.rotateY(0.04);
  uranus.mesh.rotateY(0.03);
  neptune.mesh.rotateY(0.032);
  pluto.mesh.rotateY(0.008);
  earth.mesh.rotateY(0.02);

  //Around sun rotation
  mercury.obj.rotateY(0.04);
  saturn.obj.rotateY(0.0009);
  venus.obj.rotateY(0.02);
  mars.obj.rotateY(0.008);
  jupiter.obj.rotateY(0.002);
  uranus.obj.rotateY(0.0004);
  neptune.obj.rotateY(0.0001);
  pluto.obj.rotateY(0.0007);
  earth.obj.rotateY(0.01);

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
