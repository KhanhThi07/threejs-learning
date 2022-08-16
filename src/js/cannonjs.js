import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import * as CANNON from "cannon-es";

//Tạo phiên bản của trình kết xuất WebGL
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

//Chèn ko gian vừa tạo vào trang
document.body.appendChild(renderer.domElement);

//Tạo scene
const scene = new THREE.Scene();
//Thêm camera
const camera = new THREE.PerspectiveCamera(
  45, //Góc có thể nhìn được
  window.innerWidth / window.innerHeight, //Tỉ lệ của camera
  0.1, //Điểm cực gần
  1000 //Điểm cực xa
);
//Tạo lớp điều khiển quỹ đạo
const orbit = new OrbitControls(camera, renderer.domElement);

//Trường nhìn
camera.position.set(-10, 30, 30);

//Gọi phương thức cập nhật mỗi khi thay đổi vị trí camera
orbit.update();

// --Tạo hình hộp--
const boxGeo = new THREE.BoxGeometry(2, 2, 2); //đối số chiều cao, chiều rộng,...
const boxMat = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
});
const boxMesh = new THREE.Mesh(boxGeo, boxMat); // Hợp nhât
//Thêm lưới vào cảnh
scene.add(boxMesh);

// Tạo hình cầu
const sphereGeo = new THREE.SphereGeometry(2);
const sphereMat = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
});
const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat); // Hợp nhât
scene.add(sphereMesh);

//Tạo mặt phẳng
const groundGeo = new THREE.PlaneGeometry(30, 30);
const groundMat = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  //Xác định mặt nào sẽ đc hiển thị
  side: THREE.DoubleSide,
  wireframe: true,
});
const groundMesh = new THREE.Mesh(groundGeo, groundMat); // Hợp nhât
scene.add(groundMesh);

const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.81, 0), //Lực hấp dẫn, giá trị phải là vector 3
  //đặt -9.81 để các vật thể đi theo chiều âm của trục y
});

//Tạo material cho mặt bằng đất
const groundPhysMat = new CANNON.Material();

//Tạo biến cho lớp Body
const groundBody = new CANNON.Body({
  // shape: new CANNON.Plane(), //Tạo mặt bằng vô hạn
  // mass: 5, // Đặt khối lượng cho phần thân của lưới
  shape: new CANNON.Box(new CANNON.Vec3(15, 15, 0.1)),
  type: CANNON.Body.STATIC,
  //Chuyển material dưới dạng giá trị bên trong đối tượng cấu hình phần thân cơ sở
  material: groundPhysMat,
});
//Add vào cannon world
world.addBody(groundBody);
//Xoay plane
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

//Tạo material cho thân hộp
const boxPhysMat = new CANNON.Material();

//Tạo body cho box
const boxBody = new CANNON.Body({
  mass: 1,
  shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)), //giá trị bằng nữa boxGeometry
  //Định vị lại hộp
  position: new CANNON.Vec3(5, 20, 0),
  material: boxPhysMat,
});
//Thêm phần thân vào world
world.addBody(boxBody);

//---Quay Box
//Gọi phương thức đặt từ vận tốc góc, giá trị là tốc độ của vòng quay(vận tốc)
boxBody.angularVelocity.set(0, 10, 0);
//Làm chậm độ quay
boxBody.angularDamping = 0.5;

const groundBoxContactMat = new CANNON.ContactMaterial(
  groundPhysMat,
  boxPhysMat,
  //Xác định điều gì sẽ xảy ra khi hai vật liệu tiếp xúc với nhau
  { friction: 0 } //ma sát với mặt đất
);
//Thêm vật liệu vào tường
world.addContactMaterial(groundBoxContactMat);

//Tạo material cho khối cầu
const spherePhysMat = new CANNON.Material();

//Tạo body cho sphere
const sphereBody = new CANNON.Body({
  mass: 10,
  shape: new CANNON.Sphere(2), //giá trị bằng sphereGeometry
  position: new CANNON.Vec3(0, 15, 0),
  material: spherePhysMat,
});
world.addBody(sphereBody);
//Giảm xóc (sức cản của không khí)
sphereBody.linearDamping = 0.31; //đặt giá trị từ 0-1 cho thuộc tính tắt dần tuyến tính

const groundSphereContactMat = new CANNON.ContactMaterial(
  groundPhysMat,
  spherePhysMat,
  { restitution: 0.9 }
);
world.addContactMaterial(groundSphereContactMat);

//Thời gian với physics world
const timeStep = 1 / 60;

function animate() {
  world.step(timeStep);

  //---Hợp nhật của lưới với physics body
  //Định vị bộ sao chép và tiếp tục cập nhật vị trí của lưới
  //bằng cách sao chép vị trí từ phần thân cannonjs
  groundMesh.position.copy(groundBody.position);
  //Cập nhật hướng của lưới bằng cách sao chép hướng từ phần thân cannonjs
  groundMesh.quaternion.copy(groundBody.quaternion);
  //Quaternion đại diện cho phép quay

  boxMesh.position.copy(boxBody.position);
  boxMesh.quaternion.copy(boxBody.quaternion);

  sphereMesh.position.copy(sphereBody.position);
  sphereMesh.quaternion.copy(sphereBody.quaternion);

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  //Tỉ lệ co của máy ảnh
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
