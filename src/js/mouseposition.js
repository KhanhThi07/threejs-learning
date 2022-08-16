import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon-es";

//Tạo phiên bản của trình kết xuất WebGL
const renderer = new THREE.WebGLRenderer({ antialias: true }); //Khử răng cưa

renderer.setSize(window.innerWidth, window.innerHeight);
//Bật bóng đổ
renderer.shadowMap.enabled = true;

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
camera.position.set(0, 6, 6);
//Gọi phương thức cập nhật mỗi khi thay đổi vị trí camera
orbit.update();

//Ánh sáng xung quanh
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

//Ánh sáng định hướng
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
scene.add(directionalLight);
directionalLight.position.set(0, 50, 0);
//Đổ bóng
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.hight = 1024;

//----------------------------------------------------------------

//Tạo thế giới phys
const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.81, 0) });
//Tạo lưới mặt phẳng đóng vai trò là mặt đất
const planeGeo = new THREE.PlaneGeometry(10, 10);
const planeMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});
const planeMesh = new THREE.Mesh(planeGeo, planeMat);
scene.add(planeMesh);
//Nhận bóng đổ
planeMesh.receiveShadow = true;

const planePhysMat = new CANNON.Material();

const planeBody = new CANNON.Body({
  type: CANNON.Body.STATIC,
  shape: new CANNON.Box(new CANNON.Vec3(5, 5, 0.001)),
  material: planePhysMat,
});
planeBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(planeBody);

//----------------------------------------------------------------

//Vị trí chuẩn hóa của con trỏ mà chúng ta sẽ cần
const mouse = new THREE.Vector2();
//Điểm giao nhau của raycaster-tạm dừng tọa độ của điểm mà mặt phẳng giao với
//Tia tọa độ của cú nhấp chuột chính xác hơn là pháp tuyến
const intersectionPoint = new THREE.Vector3();
//Vector pháp tuyển đơn vị cho biết hướng của mặt phẳng
const planeNormal = new THREE.Vector3();
//Mặt phẳng tạo ra bất cứ khi nào chúng ta thay đổi vị trí của con trỏ
const plane = new THREE.Plane();
//Phát ra tia giữa máy ảnh và con trỏ
const raycaster = new THREE.Raycaster();

//Cập nhật biến chuột với tọa độ chuẩn hóa của con trỏ
window.addEventListener("mousemove", function (e) {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  //Giữ cập nhật pháp tuyến mặt phẳng với tọa độ của vector pháp tuyến đơn
  planeNormal.copy(camera.position).normalize();
  //Thiết lập pháp tuyến trong điểm đồng phẳng trên cá thể mặt phẳng để tạo mặt phẳng
  plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
  //Tạo tia
  raycaster.setFromCamera(mouse, camera);
  //Phương thức mặt phẳng giao nhau(mặt phẳng,biến muốn lưu tọa độ)
  raycaster.ray.intersectPlane(plane, intersectionPoint);
});

const meshes = [];
const bodies = [];

window.addEventListener("click", function (e) {
  const sphereGeo = new THREE.SphereGeometry(0.125, 30, 30);
  const sphereMat = new THREE.MeshStandardMaterial({
    color: Math.random() * 0xffffff,
    metalness: 0, //kim loại
    roughness: 0, //thô
  });
  const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
  scene.add(sphereMesh);
  //Sao chép vị trí từ điểm giao nhau
  // sphereMesh.position.copy(intersectionPoint);
  sphereMesh.castShadow = true;

  const spherePhysMat = new CANNON.Material();

  const sphereBody = new CANNON.Body({
    mass: 0.3,
    shape: new CANNON.Sphere(0.125),
    //Đặt vị trí của lần nhấp chuột làm giá trị
    position: new CANNON.Vec3(
      intersectionPoint.x,
      intersectionPoint.y,
      intersectionPoint.z
    ),
    material: spherePhysMat,
  });
  world.addBody(sphereBody);

  const planeSphereContactMat = new CANNON.ContactMaterial(
    planePhysMat,
    spherePhysMat,
    { restitution: 1 }
  );

  world.addContactMaterial(planeSphereContactMat);

  meshes.push(sphereMesh);
  bodies.push(sphereBody);
});

const timeStep = 1 / 60;

//----------------------------------------------------------------

function animate() {
  world.step(timeStep);

  planeMesh.position.copy(planeBody.position);
  planeMesh.quaternion.copy(planeBody.quaternion);

  //Hợp nhât mesh với body
  for (let i = 0; i < meshes.length; i++) {
    meshes[i].position.copy(bodies[i].position);
    meshes[i].quaternion.copy(bodies[i].quaternion);
  }

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  //Tỉ lệ co của máy ảnh
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
