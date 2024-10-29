import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import GUI from 'lil-gui'; 
/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

// Scene
const scene = new THREE.Scene();


const textureLoader = new THREE.TextureLoader();
//bump mapping
const bumpMapTexture = textureLoader.load('bump1.jpg');

// Object (example mesh, you can customize or remove this)
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
  new THREE.MeshBasicMaterial({ color: 0xff0000,bumpMap: bumpMapTexture, 
    bumpScale: 0.1 })
);
// scene.add(mesh);

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(2, 2, 2);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Simulating sunlight
directionalLight.position.set(5, 5, 5); // Position of the light
directionalLight.castShadow = true; // Enable shadows if required
scene.add(directionalLight);

// lil-gui
const gui = new GUI();

// Add controls for ambient light
const ambientFolder = gui.addFolder('Ambient Light');
ambientFolder.add(ambientLight, 'intensity', 0, 1, 0.01).name('Intensity');
ambientFolder.close();  // Close the ambient folder by default

// Add controls for directional light
const dirLightFolder = gui.addFolder('Directional Light');
dirLightFolder.add(directionalLight.position, 'x', -10, 10, 0.1).name('Position X');
dirLightFolder.add(directionalLight.position, 'y', -10, 10, 0.1).name('Position Y');
dirLightFolder.add(directionalLight.position, 'z', -10, 10, 0.1).name('Position Z');
dirLightFolder.add(directionalLight, 'intensity', 0, 2, 0.01).name('Intensity');
dirLightFolder.close();


// Orbit controls
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableDamping = true; // Enable damping for smooth movement
orbit.dampingFactor = 0.25; // Adjust the damping factor for smoother transitions

// GLTF Loader (example loading a 3D model)
const loader = new GLTFLoader();

function loadModels(src) {
  loader.load(src, function (gltf) {
    scene.add(gltf.scene);
  }, undefined, function (error) {
    console.error(error);
  });
}

loadModels('scene.glb');

// Animation loop
const tick = () => {
  orbit.update();  // Update controls with damping
  renderer.render(scene, camera);  // Render the scene
  requestAnimationFrame(tick);  // Call tick on the next frame
};

// Start the animation loop
tick();

// Keyboard input handler
function handleKeyboardInput(event) {
  const key = event.key.toLowerCase(); // Get the pressed key and make it lowercase

  switch (key) {
    case "w": camera.position.z += 0.1; break;  // Move camera forward
    case "s": camera.position.z -= 0.1; break;  // Move camera backward
    case "a": camera.position.x += 0.1; break;  // Move camera left
    case "d": camera.position.x -= 0.1; break;  // Move camera right
    case "q": camera.position.y -= 0.1; break;  // Move camera up
    case "e": camera.position.y += 0.1; break;  // Move camera down
    case "r":  // Reset camera position
      camera.position.set(2, 2, 2);
      break;
  }

  orbit.update();  // Update the OrbitControls smoothly
}

// Add event listener for keydown events
window.addEventListener("keydown", handleKeyboardInput);


// Set background color
scene.background = new THREE.Color(0x87CEEB); // Light blue color for the sky

const backgroundColorControl = { color: scene.background.getHex() }; // Use a hex value for the initial color
gui.addColor(backgroundColorControl, 'color')
   .name('Background Color')
   .onChange((value) => {
       scene.background.set(value); // Update the scene background color
   });
   