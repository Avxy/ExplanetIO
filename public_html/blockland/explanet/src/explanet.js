//1. colocar personagem pra correr no mundo hexagonal
//2. criar mecanica dos hexagonos para abrir caminhos ou portas
//3. criar um cenário em cada hexagono sempre que o jogador abre um ciclo mágico

if (!Detector.webgl) Detector.addGetWebGLMessage();
//
const scene = new THREE.Scene();
//
const camera = new THREE.PerspectiveCamera();
//
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

var sphereBox;
var clock, binormal, normal, tube, player, particle;
var envMap;
var startTime = Date.now();
var scrollY = 0;
var _event = {
  y: 0,
  deltaY: 0
};
var t1 = null;
var percentage = 0;
var point;
var point2;
var cube;
var sphere;
var group;
var iGroup;
var iMesh;
var bPlane;
var bBox01;
var createText;
var maxHeight = 7199;
var cameras;
var cameraIndex;
var controls;
var playerPos;
var t_mes;
var text;
var uniforms = {};
//var uniforms;
var tMeta = { begin: 0 };

var planeGeometry, ballSound, ballGeometry, simplex, sound, analyser;

//hexplanet
var container, stats;

var mesh, group1, group2, group3, light;

const mouse = new THREE.Vector2();

var mouseX = 0,
  mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var mouse2D, projector;

var clock = new THREE.Clock();

var gui, guiConfig;

var g_light;

var g_hexoplanetGeometry;

var hexoplanetGeometry;

init();

function init() {
  container = document.getElementById("container");

  // const assetPath = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/2666677/";

  // envMap = new THREE.CubeTextureLoader()
  //   .setPath(`${assetPath}skybox1_`)
  //   .load(["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"]);
  // //scene.background = envMap;
  // //scene.background = new THREE.Color(0xaaaaaa);

  camera.fov = 60;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.near = 0.1;
  camera.far = 1000;

  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 300;
  camera.lookAt(0, 0, 0);

  // renderer.antialias=true;
  // renderer.alpha=true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  //document.body.appendChild(renderer.domElement);
  container.appendChild(renderer.domElement);

  // const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820);
  // scene.add(ambient);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(2, 500, 1000);
  scene.add(light);

  // const light00 = new THREE.DirectionalLight(0xffffff, 1);
  // light00.position.set(0, 0, 0);
  // scene.add(light00);

  //clock = new THREE.Clock();

  //controls = new THREE.OrbitControls(camera, renderer.domElement);

  geod3();
  objMesh();
  //metaMesh();
  tubeMesh();
  playerCam();
  //initTimeline();
  loadFont();
  //metaShader();
  //metaSound();
  //textFF();
  // preload();
  // setupP5();

  var iNumSubdivisions = 3;

  var g_material11 = new THREE.MeshToonMaterial({
    color: 0x223355,
    ambient: 0xbbbbbb
  });

  mouse2D = new THREE.Vector3(0, 10000, 0.5);

  g_hexoplanetGeometry = createHexSphere(iNumSubdivisions);
  mesh = new THREE.Mesh(g_hexoplanetGeometry, g_material11);
  mesh.position.y = 0;
  mesh.position.x = 0;
  scene.add(mesh);

  document.addEventListener("resize", resize, false);

  document.addEventListener("wheel", onWheel, { passive: false });

  //document.addEventListener("mousedown", onMouseDown, false);
  //document.addEventListener("mousemove", onMouseMove, false);

  document.addEventListener("mousemove", onDocumentMouseMove, false);

  document.addEventListener("mousedown", onDocumentMouseDown, false);

  //  // onWindowResize();
  // if ('ontouchstart' in window){
  //   document.addEventListener('mousemove', move);
  // }else{
  //   window.addEventListener( 'resize', onWindowResize, false );
  //   document.addEventListener('touchmove', move);
  // }

  //   function move(evt) {
  //     uniforms.u_mouse.value.x = evt.touches
  //       ? evt.touches[0].clientX
  //       : evt.clientX;
  //     uniforms.u_mouse.value.y = evt.touches
  //       ? evt.touches[0].clientY
  //       : evt.clientY;
  //   }

  update();
}

function loadFont() {
  var loader = new THREE.FontLoader();
  loader.load(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/254249/helvetiker_regular.typeface.json",
    function (res) {
      textMesh(res);
    }
  );
}
function textMesh(font) {
  const textGeo = new THREE.TextGeometry("Blueprint", {
    font: font,
    size: 10,
    height: 0.5,
    curveSegments: 1,
    bevelEnabled: true,
    bevelThickness: 1,
    bevelSize: 0.3,
    bevelOffset: 0,
    bevelSegments: 5
  });
  textGeo.computeBoundingBox();
  textGeo.computeVertexNormals();
  var cubeMat = new THREE.MeshToonMaterial({ color: 0xffffff });
  text = new THREE.Mesh(textGeo, cubeMat);
  text.position.set(0, 250, -50);
  text.castShadow = true;
  text.scale.set(5, 3, 1);
  scene.add(text);
}

function initTimeline() {
  var options = {
    opacityIn: [0, 1],
    scaleIn: [0.2, 1],
    scaleOut: 3,
    durationIn: 800,
    durationOut: 600,
    delay: 500,
    easing: "easeInExpo"
  };
  //timeline = anime.timeline({ loop: true });
  t1 = anime.timeline({
    autoplay: false,
    duration: 64000,
    easing: "linear"
  });

  t1.add({
    targets: ".text-animation .one",
    opacity: options.opacityIn,
    scale: options.scaleIn,
    duration: options.durationIn
  });
  t1.add({
    targets: ".text-animation .one",
    opacity: 0,
    scale: options.scaleOut,
    easing: options.easing,
    duration: options.durationOut,
    delay: options.delay
  });
  t1.add({
    targets: ".text-animation .two",
    opacity: options.opacityIn,
    scale: options.scaleIn,
    duration: options.durationIn
  });
  t1.add({
    targets: ".text-animation .two",
    opacity: 0,
    scale: options.scaleOut,
    easing: options.easing,
    duration: options.durationOut,
    delay: options.delay
  });
  t1.add({
    targets: ".text-animation .three",
    opacity: options.opacityIn,
    scale: options.scaleIn,
    duration: options.durationIn
  });
  t1.add({
    targets: ".text-animation .three",
    opacity: 0,
    scale: options.scaleOut,
    easing: options.easing,
    duration: options.durationOut,
    delay: options.delay
  });

  t1.add({
    targets: player.position,
    x: 0,
    y: 0,
    z: 300,
    duration: 1000,
    update: camera.updateProjectionMatrix()
  });

  // t1.add({
  //   targets: uniforms.u_time,
  //   value: 1.0,
  //   // y: 0,
  //   // z: 0,
  //   duration: 1000,
  //   //update: uniforms.u_time.value += clock.getDelta()
  //   update: uniforms.u_time = (uniforms)
  //  });

  t1.add({
    targets: bPlane.scale,
    x: 10,
    y: 10,
    z: 10,
    duration: 1000,
    update: camera.updateProjectionMatrix()
  });

  t1.add({
    targets: iMesh.scale,
    x: 0.07,
    y: 0.07,
    z: 0.07,
    duration: 1000,
    update: camera.updateProjectionMatrix()
  });

  t1.add({
    targets: iMesh.rotation,
    x: Math.PI / 2,
    y: Math.PI,
    z: (Math.PI * 3) / 2,
    duration: 1000,
    update: camera.updateProjectionMatrix()
  });

  // timeline.add({
  //   targets: uniforms,
  //   meta: 0.5,
  //   duration: 1000,
  //   //update: uniforms.meta.value = 1.0;
  // });

  // timeline.add({
  //   targets: bBox01.position,
  //   x: 0,
  //   y: 0,
  //   z: 0,
  //   duration: 1000,
  //   update: camera.updateProjectionMatrix()
  // });

  // timeline.add({
  //   targets: bBox01.rotation,
  //   x: 0,
  //   y: 0,
  //   z: 0,
  //   duration: 1000,
  //   update: camera.updateProjectionMatrix()
  // });

  t1.add({
    targets: ".text-animation .four",
    opacity: options.opacityIn,
    scale: options.scaleIn,
    duration: options.durationIn
  });
  t1.add({
    targets: ".text-animation .four",
    opacity: 0,
    scale: options.scaleOut,
    easing: options.easing,
    duration: options.durationOut,
    delay: options.delay
  });

  t1.add({
    targets: bBox01.rotation,
    x: 0,
    y: Math.PI / 2,
    z: 0,
    duration: 1000,
    update: camera.updateProjectionMatrix()
  });

  t1.add({
    targets: ".text-animation .five",
    opacity: options.opacityIn,
    scale: options.scaleIn,
    duration: options.durationIn
  });
  t1.add({
    targets: ".text-animation .five",
    opacity: 0,
    scale: options.scaleOut,
    easing: options.easing,
    duration: options.durationOut,
    delay: options.delay
  });

  t1.add({
    targets: bBox01.rotation,
    x: 0,
    y: Math.PI,
    z: 0,
    duration: 1000,
    update: camera.updateProjectionMatrix()
  });

  t1.add({
    targets: ".text-animation .six",
    opacity: options.opacityIn,
    scale: options.scaleIn,
    duration: options.durationIn
  });
  t1.add({
    targets: ".text-animation .six",
    opacity: 0,
    scale: options.scaleOut,
    easing: options.easing,
    duration: options.durationOut,
    delay: options.delay
  });

  t1.add({
    targets: bBox01.rotation,
    x: 0,
    y: (Math.PI * 3) / 2,
    z: 0,
    duration: 1000,
    update: camera.updateProjectionMatrix()
  });

  t1.add({
    targets: ".text-animation .seven",
    opacity: options.opacityIn,
    scale: options.scaleIn,
    duration: options.durationIn
  });
  t1.add({
    targets: ".text-animation .seven",
    opacity: 0,
    scale: options.scaleOut,
    easing: options.easing,
    duration: options.durationOut,
    delay: options.delay
  });

  t1.add({
    targets: bBox01.rotation,
    x: 0,
    y: Math.PI * 2,
    z: 0,
    duration: 1000,
    update: camera.updateProjectionMatrix()
  });

  t1.add({
    targets: ".text-animation .eight",
    opacity: options.opacityIn,
    scale: options.scaleIn,
    duration: options.durationIn
  });
  t1.add({
    targets: ".text-animation .eight",
    opacity: 0,
    scale: options.scaleOut,
    easing: options.easing,
    duration: options.durationOut,
    delay: options.delay
  });
  t1.add({
    targets: bBox01.position,
    x: 0,
    y: -5000,
    z: 0,
    duration: 1000,
    update: camera.updateProjectionMatrix()
  });

  // timeline.add({
  //   targets: camera.position,
  //   x: 0,
  //   y: 300,
  //   z: -100,
  //   duration: 1000,
  //   update: camera.updateProjectionMatrix()
  // });

  t1.add({
    targets: player.position,
    x: 0,
    y: 300,
    z: 0,
    duration: 1000,
    update: camera.updateProjectionMatrix()
  });

  t1.add({
    targets: player.rotation,
    x: (Math.PI / 4) * -1,
    y: 0,
    z: 0,
    duration: 1000,
    update: camera.updateProjectionMatrix()
  });

  t1.add({
    targets: player.position,
    x: 0,
    y: 0,
    z: -140,
    duration: 1000,
    update: camera.updateProjectionMatrix()
  });
  t1.add({
    targets: iMesh.scale,
    x: 1,
    y: 1,
    z: 1,
    duration: 1000,
    update: camera.updateProjectionMatrix()
  });

  t1.add({
    targets: player.position,
    x: 0,
    y: -100,
    z: -150,
    duration: 1000,
    update: camera.updateProjectionMatrix()
  });

  // timeline.add({
  //   targets: player.rotation,
  //   x: 0,
  //   y: 0,
  //   z: Math.PI/2,
  //   duration: 1000,
  //   update: camera.updateProjectionMatrix()
  // });

  t1.add({
    targets: ".text-animation .nine",
    opacity: options.opacityIn,
    scale: options.scaleIn,
    duration: options.durationIn
  });
  t1.add({
    targets: ".text-animation .nine",
    opacity: 0,
    scale: options.scaleOut,
    easing: options.easing,
    duration: options.durationOut,
    delay: options.delay
  });

  //   timeline.add({
  //     targets: cube.rotation,
  //     x: Math.PI / 2,
  //     y: 0,
  //     z: 0,
  //     duration: 4000,
  //     update: camera.updateProjectionMatrix()
  //   });

  //   timeline.add({
  //     targets: cube.rotation,
  //     x: Math.PI,
  //     y: 0,
  //     z: 0,
  //     duration: 4000,
  //     update: camera.updateProjectionMatrix()
  //   });

  //   timeline.add({
  //     targets: cube.rotation,
  //     x: (Math.PI * 3) / 2,
  //     y: 0,
  //     z: 0,
  //     duration: 4000,
  //     update: camera.updateProjectionMatrix()
  //   });

  //   timeline.add({
  //     targets: cube.rotation,
  //     x: Math.PI * 2,
  //     y: 0,
  //     z: 0,
  //     duration: 4000,
  //     update: camera.updateProjectionMatrix()
  //   });
}

function onWheel(e) {
  // for embedded demo
  e.stopImmediatePropagation();
  e.preventDefault();
  e.stopPropagation();

  var evt = _event;
  evt.deltaY = e.wheelDeltaY || e.deltaY * -1;
  // reduce by half the delta amount otherwise it scroll too fast
  evt.deltaY *= 5;

  scroll(e);
}

function scroll(e) {
  var evt = _event;
  // limit scroll top
  if (evt.y + evt.deltaY > 0) {
    evt.y = 0;
    // limit scroll bottom
  } else if (-(evt.y + evt.deltaY) >= maxHeight) {
    evt.y = -maxHeight;
  } else {
    evt.y += evt.deltaY;
  }
  scrollY = -evt.y;
}

//sphere cube circle square
function metaShader() {
  const vshader = `
    #include <noise>

    uniform float u_time;
    uniform float u_radius;
    uniform float u_meta;
    
    float getDelta(){
      return ((sin(u_time)+1.0)/2.0);
    }
    
    void main() {
      float delta = getDelta();
    
      vec3 v = normalize(position) * u_radius;
      vec3 pos = mix(position, v, delta);

      gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 0.5 );
    }
    `;
  const fshader = `
    void main()
    {
      vec3 color = vec3(1.0);
      gl_FragColor = vec4(color, 1.0);
    }
    `;

  const geometry = new THREE.BoxGeometry(140, 140, 140, 10, 10, 10);
  //const uniforms = {};
  uniforms.u_time = { value: 0.0 };
  uniforms.u_mouse = { value: { x: 0.0, y: 0.0 } };
  uniforms.u_resolution = { value: { x: 0, y: 0 } };
  uniforms.u_radius = { value: 40.0 };
  uniforms.u_meta = { value: 0.0 };

  // uniforms = {
  //   u_time: {value: 0.0},
  //   u_radius: {value: 70.0}
  // }

  const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vshader,
    fragmentShader: fshader,
    wireframe: true
  });

  const ballSound = new THREE.Mesh(geometry, material);
  scene.add(ballSound);
}

function metaSound() {
  //plane
  planeGeometry = new THREE.PlaneBufferGeometry(1000, 1000, 10, 10);
  const material1 = new THREE.MeshToonMaterial({
    color: 0xffffff,
    wireframe: true
  });

  const plane = new THREE.Mesh(planeGeometry, material1);
  plane.rotateX(-Math.PI / 3);
  plane.position.set(0, -500, 0);
  scene.add(plane);

  //ball
  ballGeometry = new THREE.IcosahedronBufferGeometry(200, 2);

  const material2 = new THREE.MeshToonMaterial({
    color: 0xffffff,
    wireframe: true
  });

  ballSound = new THREE.Mesh(ballGeometry, material2);
  //ballSound.position.y = 100;
  scene.add(ballSound);

  simplex = new SimplexNoise(4);
}

function playSound() {
  listener = new THREE.AudioListener();
  camera.add(listener);

  sound = new THREE.Audio(listener);

  const loader = new THREE.AudioLoader();
  loader.setPath(assetsPath);
  loader.load("against-the-odds.mp3", (buffer) => {
    sound.setBuffer(buffer);
    sound.play();
  });

  analyser = new THREE.AudioAnalyser(sound, 128);
}

function onMouseDown() {
  if (sound) {
    if (sound.isPlaying) {
      sound.pause();
    } else {
      sound.play();
    }
  }
}

function updateGround(geometry, distortionFr, time) {
  const position = geometry.getAttribute("position");
  const amp = 0.1;
  for (let i = 0; i < position.array.length; i += 3) {
    const offset =
      simplex.noise2D(
        position.array[i] + time * 0.0003,
        position.array[i + 1] + time * 0.0001
      ) *
      distortionFr *
      amp;
    position.array[i + 2] = offset;
  }
  position.needsUpdate = true;
}

function updateBall(geometry, baseFr, trebleFr, time) {
  const amp = 0.08;
  const rf = 0.01;
  const radius = geometry.parameters.radius;
  const position = geometry.getAttribute("position");

  for (let i = 0; i < position.array.length; i += 3) {
    const vertex = new THREE.Vector3(
      position.array[i],
      position.array[i + 1],
      position.array[i + 2]
    );
    vertex.normalize();
    const distance =
      radius +
      baseFr * amp * 0.5 +
      simplex.noise3D(
        vertex.x + time * rf,
        vertex.y + time * rf,
        vertex.z + time * rf
      ) *
        amp *
        trebleFr;
    vertex.multiplyScalar(distance);
    position.array[i] = vertex.x;
    position.array[i + 1] = vertex.y;
    position.array[i + 2] = vertex.z;
  }
  position.needsUpdate = true;
}

//some helper functions here
function fractionate(val, minVal, maxVal) {
  return (val - minVal) / (maxVal - minVal);
}

function modulate(val, minVal, maxVal, outMin, outMax) {
  var fr = fractionate(val, minVal, maxVal);
  var delta = outMax - outMin;
  return outMin + fr * delta;
}

function avg(arr) {
  var total = arr.reduce(function (sum, b) {
    return sum + b;
  });
  return total / arr.length;
}

function max(arr) {
  return arr.reduce(function (a, b) {
    return Math.max(a, b);
  });
}

function tubeMesh() {
  //Add meshes here
  const curve = new THREE.Curves.TrefoilKnot(30);
  const geometry = new THREE.TubeBufferGeometry(curve, 100, 2, 8, true);
  const material = new THREE.MeshBasicMaterial({
    wireframe: true,
    color: 0xffffff,
    side: THREE.DoubleSide,
    visible: false
  });
  tube = new THREE.Mesh(geometry, material);
  scene.add(tube);

  binormal = new THREE.Vector3();
  normal = new THREE.Vector3();
}

function objMesh() {
  // cube = new THREE.Mesh(
  //   new THREE.BoxBufferGeometry(0.1, 0.1, 0.1),
  //   new THREE.MeshToonMaterial({
  //     color: 0xffffff,
  //     side: THREE.DoubleSide
  //   })
  // );
  // cube.position.x = 0;
  // cube.position.y = 140;
  // cube.position.z = 0;
  // scene.add(cube);

  sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 20, 15),
    new THREE.MeshToonMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide
    })
  );
  sphere.position.x = 0;
  sphere.position.y = 140;
  sphere.position.z = 0;
  scene.add(sphere);

  bBox01 = new THREE.Mesh(
    new THREE.BoxGeometry(500, 500, 500),
    new THREE.MeshToonMaterial({
      color: "rgb(9,55,89)",
      side: THREE.DoubleSide
    })
  );
  bBox01.rotation.x = 0.5;
  bBox01.rotation.y = 0.78;
  bBox01.position.x = 0;
  bBox01.position.y = -1000;
  bBox01.position.z = 0;
  scene.add(bBox01);

  bPlane = new THREE.GridHelper(5000, 37);
  bPlane.material.color = new THREE.Color("white");
  bPlane.rotateX(Math.PI / 2);
  bPlane.position.set(0, 0, -200);
  scene.add(bPlane);

  particle = new THREE.Object3D();
  scene.add(particle);
  //
  var geometry = new THREE.TetrahedronGeometry(4, 0);
  var material = new THREE.MeshToonMaterial({
    color: 0xffffff,
    shading: THREE.FlatShading
  });
  for (var i = 0; i < 108; i++) {
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position
      .set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
      .normalize();
    mesh.position.multiplyScalar(90 + Math.random() * 700);
    mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
    particle.add(mesh);
  }
}

function metaMesh() {
  class StarShape extends THREE.Shape {
    constructor(sides, innerRadius, outerRadius) {
      super();
      let theta = 0;
      const inc = ((2 * Math.PI) / sides) * 0.5;

      this.moveTo(Math.cos(theta) * outerRadius, Math.sin(theta) * outerRadius);

      for (let i = 0; i < sides; i++) {
        theta += inc;
        this.lineTo(
          Math.cos(theta) * innerRadius,
          Math.sin(theta) * innerRadius
        );
        theta += inc;
        this.lineTo(
          Math.cos(theta) * outerRadius,
          Math.sin(theta) * outerRadius
        );
      }
    }
  }

  const extrudeSettings = {
    depth: 6,
    bevelEnabled: false
  };
  const shape = new StarShape(5, 5, 12);
  const heartGeometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings);
  const ballGeometry = new THREE.SphereBufferGeometry(10, 30, 30);
  iGroup = new THREE.Group();
  scene.add(iGroup);
  //const geometry = new THREE.IcosahedronBufferGeometry(2010, 1);
  const geometry = new THREE.IcosahedronBufferGeometry(300, 1);
  const mat = new THREE.MeshToonMaterial({ wireframe: true });
  iMesh = new THREE.Mesh(geometry, mat);
  scene.add(iMesh);
  const position = geometry.getAttribute("position");
  const normal = geometry.getAttribute("normal");
  for (let i = 0; i < position.array.length; i += 3) {
    const color = new THREE.Color("skyblue");
    const material = new THREE.MeshPhongMaterial({ color: color });
    const iBall = new THREE.Mesh(ballGeometry, material);
    //const iBall = new THREE.Mesh(heartGeometry, material);
    const pos = new THREE.Vector3(
      position.array[i],
      position.array[i + 1],
      position.array[i + 2]
    );
    const norm = new THREE.Vector3(
      normal.array[i],
      normal.array[i + 1],
      normal.array[i + 2]
    );
    iBall.position.copy(pos);
    const target = pos.clone().add(norm.multiplyScalar(10.0));
    iBall.lookAt(target);
    iGroup.add(iBall);
  }
}

function geod3() {
  //===================================================== add canvas
  // var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  // renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.toneMapping = THREE.LinearToneMapping;
  // document.body.appendChild(renderer.domElement);

  //===================================================== add GLow
  // var renderScene = new THREE.RenderPass(scene, camera);
  // var effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
  // effectFXAA.uniforms["resolution"].value.set(
  //   1 / window.innerWidth,
  //   1 / window.innerHeight
  // );
  // var copyShader = new THREE.ShaderPass(THREE.CopyShader);
  // copyShader.renderToScreen = true;

  // var bloomStrength = 1;
  // var bloomRadius = 0;
  // var bloomThreshold = 0.5;
  // var bloomPass = new THREE.UnrealBloomPass(
  //   new THREE.Vector2(window.innerWidth, window.innerHeight),
  //   bloomStrength,
  //   bloomRadius,
  //   bloomThreshold
  // );

  // var composer = new THREE.EffectComposer(renderer);
  // composer.setSize(window.innerWidth, window.innerHeight);
  // composer.addPass(renderScene);
  // composer.addPass(effectFXAA);
  // composer.addPass(bloomPass);
  // composer.addPass(copyShader);

  //===================================================== resize
  // window.addEventListener("resize", function() {
  //   let width = window.innerWidth;
  //   let height = window.innerHeight;
  //   renderer.setSize(width, height);
  //   camera.aspect = width / height;
  //   camera.updateProjectionMatrix();
  // });

  //===================================================== data
  const our_data = [
    {
      origin: { name: "a", latitude: 90, longitude: 0 },
      destination: { name: "a", latitude: -90, longitude: 0 }
    }

    // {
    //   origin: { name: "a", latitude: 60, longitude: 30 },
    //   destination: { name: "a", latitude: 60, longitude: -30 }
    // },
    // {
    //   origin: { name: "a", latitude: 30, longitude: 30 },
    //   destination: { name: "a", latitude: 30, longitude: -30 }
    // },
    // {
    //   origin: { name: "a", latitude: 0, longitude: 30 },
    //   destination: { name: "a", latitude: 0, longitude: -30 }
    // },
    // {
    //   origin: { name: "a", latitude: -30, longitude: 30 },
    //   destination: { name: "a", latitude: -30, longitude: -30 }
    // },
    // {
    //   origin: { name: "a", latitude: -60, longitude: 30 },
    //   destination: { name: "a", latitude: -60, longitude: -30 }
    // },

    // {
    //   origin: { name: "a", latitude: -60, longitude: 30 },
    //   destination: { name: "a", latitude: -60, longitude: -30 }
    // },
    // {
    //   origin: { name: "a", latitude: 0, longitude: 30 },
    //   destination: { name: "a", latitude: 0, longitude: -30 }
    // },

    // {
    //   origin: { name: "a", latitude: 0, longitude: 30 },
    //   destination: { name: "a", latitude: 0, longitude: 180 }
    // }

    // {
    //   origin: { name: "a", latitude: 0, longitude: 0 },
    //   destination: { name: "a", latitude: 180, longitude: 0 }
    // }
    // {
    //   origin: { name: "a", latitude: 10, longitude: -90 },
    //   destination: { name: "a", latitude: 10, longitude: -90 }
    // },
    // {
    //   origin: { name: "a", latitude: 10, longitude: -90 },
    //   destination: { name: "a", latitude: 20, longitude: -100 }
    // },
    // {
    //   origin: { name: "a", latitude: 20, longitude: -100 },
    //   destination: { name: "a", latitude: 30, longitude: -80 }
    // },
    // {
    //   origin: { name: "a", latitude: 30, longitude: -80 },
    //   destination: { name: "a", latitude: 40, longitude: -80 }
    // },
    // {
    //   origin: { name: "a", latitude: 40, longitude: -80 },
    //   destination: { name: "a", latitude: 40, longitude: -90 }
    // },
    // {
    //   origin: { name: "a", latitude: 40, longitude: -90 },
    //   destination: { name: "a", latitude: 50, longitude: -100 }
    // },
    // {
    //   origin: { name: "a", latitude: 40, longitude: -90 },
    //   destination: { name: "a", latitude: 50, longitude: -70 }
    // },
    // {
    //   origin: { name: "a", latitude: 50, longitude: -70 },
    //   destination: { name: "a", latitude: 60, longitude: -60 }
    // },
    // {
    //   origin: { name: "a", latitude: 50, longitude: -70 },
    //   destination: { name: "a", latitude: 60, longitude: -90 }
    // },
    // {
    //   origin: { name: "a", latitude: 60, longitude: -90 },
    //   destination: { name: "a", latitude: 70, longitude: -100 }
    // },
    // {
    //   origin: { name: "a", latitude: 70, longitude: -100 },
    //   destination: { name: "a", latitude: 70, longitude: -120 }
    // },
    // {
    //   origin: { name: "a", latitude: 70, longitude: -100 },
    //   destination: { name: "a", latitude: 90, longitude: -110 }
    // },
    // {
    //   origin: { name: "a", latitude: 70, longitude: -100 },
    //   destination: { name: "a", latitude: 80, longitude: -90 }
    // },
    // {
    //   origin: { name: "a", latitude: 80, longitude: -90 },
    //   destination: { name: "a", latitude: 100, longitude: -100 }
    // }
  ];

  //===================================================== helper functions
  const clamp = (num, min, max) => (num <= min ? min : num >= max ? max : num);

  const DEGREE_TO_RADIAN = Math.PI / 180;

  function coordinateToPosition(lat, lng, radius) {
    const phi = (90 - lat) * DEGREE_TO_RADIAN;
    const theta = (lng + 180) * DEGREE_TO_RADIAN;

    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }

  //===================================================== d3.json
  d3.json(
    "https://raw.githubusercontent.com/baronwatts/data/master/world.json",
    function (err, data) {
      //===================================================== crate canvas texturefor the globe
      var projection = d3.geo
        .equirectangular()
        .translate([1024, 512])
        .scale(326);

      var countries = topojson.feature(data, data.objects.countries);

      var canvas = d3
        .select("body")
        .append("canvas")
        .style("display", "none")
        .attr("width", "2048px")
        .attr("height", "1024px");

      var context = canvas.node().getContext("2d");

      var path = d3.geo.path().projection(projection).context(context);

      context.strokeStyle = "white";
      context.lineWidth = 0.25;
      context.fillStyle = "#000";

      context.beginPath();

      path(countries);

      context.fill();
      context.stroke();

      var mapTexture = new THREE.Texture(canvas.node());
      mapTexture.needsUpdate = true;

      //===================================================== add globe
      //   <script id="vertexShader" type="x-shader/x-vertex">
      //   varying vec3 vNormal;
      //   void main()
      //   {
      //   vNormal = normalize( normalMatrix * normal );
      //   gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      //   }
      // </script>

      // <!-- fragment shader a.k.a. pixel shader -->
      // <script id="fragmentShader" type="x-shader/x-vertex">
      //   varying vec3 vNormal;
      //   void main()
      //   {
      //   float intensity = pow( 0.7 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), 4.0 );
      //   gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 ) * intensity;
      //   }
      // </script>
      group = new THREE.Object3D();
      scene.add(group);
      //group.rotateZ(Math.PI / 2);
      group.rotateY(3 * (Math.PI / 2));

      var RADIUS = 140;

      const vshader = `
    #include <noise>

    uniform float uTime;

    varying float vNoise;

    void main() {	
      float noise = turbulence(position);
      //float noise = turbulence(normal + uTime * 0.1);
      //vNoise = turbulence(normal*0.9 + uTime * 0.01);
      vec3 pos = position + normal * noise ;
      //vec3 pos = position + normal * vNoise * 30.0;

      gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
    }
    `;
      const fshader = `
    uniform sampler2D uTex;

    varying float vNoise;
    void main() {
      vec2 uv = vec2(0.0, abs(fract(-vNoise*1.3)));
      vec3 color = vec3(0.1,0.3,0.5);
      //vec3 color = texture2D( uTex, uv ).bgr;

      gl_FragColor = vec4( color, 1.0 );
    }
    `;
      const geometry = new THREE.IcosahedronGeometry(150, 3);
      uniforms = {
        uTime: { value: 0.0 }
        //uTex: { value: new THREE.TextureLoader().load("https://s3-us-west-2.amazonaws.com/s.cdpn.io/2666677/explosion.png")}
      };

      const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vshader,
        fragmentShader: fshader,
        wireframe: false
      });
      //sphere icosahedron shader
      const ballNoise = new THREE.Mesh(geometry, material);
      //scene.add(ballNoise);
      //

      var sphereGeometry = new THREE.SphereGeometry(RADIUS, 60, 60);
      var sphereMaterial = new THREE.MeshToonMaterial({
        //  map: mapTexture,
        transparent: true,
        opacity: 0.8,
        color: "rgb(9,55,89)",
        side: THREE.DoubleSide
        // color: new THREE.Color({color:"rgb(9,108,144)"})
      });
      var earthMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
      group.add(earthMesh);

      //===================================================== add glow effect to globe
      // var customMaterial = new THREE.ShaderMaterial({
      //   uniforms: {},
      //   vertexShader: document.getElementById("vertexShader").textContent,
      //   fragmentShader: document.getElementById("fragmentShader").textContent,
      //   side: THREE.BackSide,
      //   blending: THREE.AdditiveBlending,
      //   transparent: true
      // });

      // var ballGeometry = new THREE.SphereGeometry(170, 60, 60);
      // var ball = new THREE.Mesh(ballGeometry, customMaterial);
      // scene.add(ball);

      //===================================================== lng & lat
      function Destination(array) {
        array.map((d, i) => {
          //convert lng & lat coordinates to 3d space
          var startLat = d.origin.latitude;
          var startLng = d.origin.longitude;

          var endLat = d.destination.latitude;
          var endLng = d.destination.longitude;

          var x = -(
            RADIUS *
            Math.sin((90 - startLat) * (Math.PI / 180)) *
            Math.cos((startLng + 180) * (Math.PI / 180))
          );
          var z =
            RADIUS *
            Math.sin((90 - startLat) * (Math.PI / 180)) *
            Math.sin((startLng + 180) * (Math.PI / 180));
          var y = RADIUS * Math.cos((90 - startLat) * (Math.PI / 180));

          var x2 = -(
            RADIUS *
            Math.sin((90 - endLat) * (Math.PI / 180)) *
            Math.cos((endLng + 180) * (Math.PI / 180))
          );
          var z2 =
            RADIUS *
            Math.sin((90 - endLat) * (Math.PI / 180)) *
            Math.sin((endLng + 180) * (Math.PI / 180));
          var y2 = RADIUS * Math.cos((90 - endLat) * (Math.PI / 180));

          //store the starting and ending positions of each location
          var start = new THREE.Vector3(x, y, z);
          var end = new THREE.Vector3(x2, y2, z2);

          //points
          var pointGeom = new THREE.SphereGeometry(16, 15, 15);
          point = new THREE.Mesh(
            pointGeom,
            new THREE.MeshToonMaterial({ color: new THREE.Color("white") })
          );
          var point2 = new THREE.Mesh(
            pointGeom,
            new THREE.MeshToonMaterial({ color: new THREE.Color("white") })
          );

          //spaces out the points
          point.position.set(x, y, z);
          point2.position.set(x2, y2, z2);
          point.lookAt(new THREE.Vector3(0, 0, 0));
          point2.lookAt(new THREE.Vector3(0, 0, 0));
          group.add(point);
          group.add(point2);

          //https://medium.com/@xiaoyangzhao/drawing-curves-on-webgl-globe-using-three-js-and-d3-draft-7e782ffd7ab
          const CURVE_MIN_ALTITUDE = 13;
          const CURVE_MAX_ALTITUDE = 21;
          const altitude = clamp(
            start.distanceTo(end) * 0.75,
            CURVE_MIN_ALTITUDE,
            CURVE_MAX_ALTITUDE
          );

          //get the middle position of each location
          var lat = [startLng, startLat];
          var lng = [endLng, endLat];
          var geoInterpolator = d3.geoInterpolate(lat, lng);

          const midCoord1 = geoInterpolator(0.25);
          const midCoord2 = geoInterpolator(0.75);

          const mid1 = coordinateToPosition(
            midCoord1[1],
            midCoord1[0],
            RADIUS + altitude
          );
          const mid2 = coordinateToPosition(
            midCoord2[1],
            midCoord2[0],
            RADIUS + altitude
          );

          //create bezier curve from the lng & lat positions
          var curve = new THREE.CubicBezierCurve3(start, mid1, mid2, end);
          var g = new THREE.TubeGeometry(curve, 100, 0.35, 10, false);
          var m = new THREE.MeshBasicMaterial({
            color: new THREE.Color(
              "hsl(" + Math.floor(Math.random() * 360) + ",50%,50%)"
            )
          });
          var curveObject = new THREE.Mesh(g, m);
          group.add(curveObject);

          //https://medium.com/@xiaoyangzhao/drawing-curves-on-webgl-globe-using-three-js-and-d3-draft-7e782ffd7ab
          const CURVE_MIN_ALTITUDE00 = -5;
          const CURVE_MAX_ALTITUDE00 = -10;
          const altitude00 = clamp(
            start.distanceTo(end) * 0.75,
            CURVE_MIN_ALTITUDE00,
            CURVE_MAX_ALTITUDE00
          );

          //get the middle position of each location
          // var lat = [startLng, startLat];
          // var lng = [endLng, endLat];
          // var geoInterpolator = d3.geoInterpolate(lat, lng);

          // const midCoord1 = geoInterpolator(0.25);
          // const midCoord2 = geoInterpolator(0.75);

          const mid100 = coordinateToPosition(
            midCoord1[1],
            midCoord1[0],
            RADIUS + altitude00
          );
          const mid200 = coordinateToPosition(
            midCoord2[1],
            midCoord2[0],
            RADIUS + altitude00
          );

          //create bezier curve from the lng & lat positions
          var curve00 = new THREE.CubicBezierCurve3(start, mid100, mid200, end);
          var g00 = new THREE.TubeGeometry(curve00, 100, 0.35, 10, false);
          var m00 = new THREE.MeshBasicMaterial({
            color: new THREE.Color(
              "hsl(" + Math.floor(Math.random() * 360) + ",50%,50%)"
            )
          });
          var curveObject00 = new THREE.Mesh(g00, m00);
          group.add(curveObject00);
        });
      } //end Destination()

      Destination(our_data);

      let om = group.clone();
      om.position.set(0, 100, 0);

      // //===================================================== add Animation
    }
  ); //end d3.json
}

function playerCam() {
  //Add meshes here
  player = new THREE.Group();
  //player.position.set(140, 140, 0);
  player.position.set(0, 0, 300);
  scene.add(player);

  // const bodyGeometry = new THREE.CylinderBufferGeometry(0.5, 0.3, 1.6, 20);
  const material = new THREE.MeshStandardMaterial({ color: 0xffff00 });
  // const body = new THREE.Mesh(bodyGeometry, material);
  // body.position.y = 0.8;
  // body.scale.z = 0.5;
  // player.add(body);
  const headGeometry = new THREE.SphereBufferGeometry(0.3, 20, 15);
  const head = new THREE.Mesh(headGeometry, material);
  head.position.set = (0, 0, 0);
  player.add(head);

  cameras = [];
  cameraIndex = 0;

  const followCam = new THREE.Object3D();
  followCam.position.copy(camera.position);
  player.add(followCam);
  cameras.push(followCam);

  const frontCam = new THREE.Object3D();
  frontCam.position.set(0, 0, -8);
  player.add(frontCam);
  cameras.push(frontCam);

  // const overheadCam = new THREE.Object3D();
  // overheadCam.position.set(0, 20, 0);
  // cameras.push(overheadCam);

  addKeyboardControl();

  const btn = document.getElementById("camera-btn");
  btn.addEventListener("click", changeCamera);
}

function changeCamera() {
  cameraIndex++;
  if (cameraIndex >= cameras.length) cameraIndex = 0;
}

function addKeyboardControl() {
  document.addEventListener("keydown", keyDown);
  document.addEventListener("keyup", keyUp);
}

function keyDown(evt) {
  let forward =
    player.userData !== undefined && player.userData.move !== undefined
      ? player.userData.move.forward
      : 0;
  let turn =
    player.userData != undefined && player.userData.move !== undefined
      ? player.userData.move.turn
      : 0;

  switch (evt.keyCode) {
    case 87: //W
      forward = -1;
      break;
    case 83: //S
      forward = 1;
      break;
    case 65: //A
      turn = 1;
      break;
    case 68: //D
      turn = -1;
      break;
  }

  playerControl(forward, turn);
}

function keyUp(evt) {
  let forward =
    player.userData !== undefined && player.userData.move !== undefined
      ? player.userData.move.forward
      : 0;
  let turn =
    player.move != undefined && player.userData.move !== undefined
      ? player.userData.move.turn
      : 0;

  switch (evt.keyCode) {
    case 87: //W
      forward = 0;
      break;
    case 83: //S
      forward = 0;
      break;
    case 65: //A
      turn = 0;
      break;
    case 68: //D
      turn = 0;
      break;
  }

  playerControl(forward, turn);
}

function playerControl(forward, turn) {
  if (forward == 0 && turn == 0) {
    delete player.userData.move;
  } else {
    if (player.userData === undefined) player.userData = {};
    this.player.userData.move = { forward, turn };
  }
}

// linear interpolation function
function lerp(a, b, t) {
  return (1 - t) * a + t * b;
}

// function init() {
//   initThree();
//   initTimeline();
//   window.addEventListener("resize", resize, { passive: false });
//   //divContainer.addEventListener("wheel", onWheel, { passive: false });
//   window.addEventListener("wheel", onWheel, { passive: false });
//   window.addEventListener("touchstart", touch, {passive: false} );

//   animate();
// }

// function animate() {
//   requestAnimationFrame(animate);
//   render();

//   const dt = clock.getDelta();

//   if (player.userData !== undefined && player.userData.move !== undefined) {
//     player.translateZ(player.userData.move.forward * dt * 5);
//     player.rotateY(player.userData.move.turn * dt);
//   }

//   camera.position.lerp(
//     cameras[cameraIndex].getWorldPosition(new THREE.Vector3()),
//     0.05
//   );
//   const pos = player.position.clone();
//   pos.y += 3;
//   camera.lookAt(pos);

//   //controls.update();
// }

// function render() {
//   var dtime = Date.now() - startTime;
//   // easing with treshold on 0.08 (should be between .14 & .2 for smooth animations)
//   percentage = lerp(percentage, scrollY, 0.08);
//   timeline.seek(percentage * (64000 / maxHeight));

//   // animate the cube
//   //cube.rotation.x += 0.01;
//   //cube.rotation.y += 0.0125;
//   //group.rotateX(Math.PI/3600);
//   particle.rotation.y += 0.001;
//   iMesh.rotation.y += 0.001;
//   //particle.rotation.y += 0.001;

//   renderer.render(scene, camera);
// }

// function resize() {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// }

function perpendicular(vector) {
  // static const Real fSquareZero = (Real)(1e-06 * 1e-06);

  var UNIT_X = new THREE.Vector3(1, 0, 0);
  var UNIT_Y = new THREE.Vector3(0, 1, 0);
  var perp = vector.clone();
  // perp = perp.crossSelf( UNIT_X );
  perp = perp.cross(UNIT_X);

  // Check length
  if (perp.lengthSq() < 0.01) {
    // This vector is the Y axis multiplied by a scalar, so we have
    //   to use another axis.
    perp = vector.clone();
    //perp = perp.crossSelf( UNIT_Y );
    perp = perp.cross(UNIT_Y);
  }

  return perp;
}

function HexData() {
  this.aFaces = new Array();
  this.aTopFaces = new Array();
  this.iCenterId = 0;
  this.vCenter = new THREE.Vector3(0, 0, 0);
  this.aNeighbors = new Array();
  this.fHeight = 100.0;
}

function createHexSphere(iNumSubdiv) {
  var faceIndices = ["a", "b", "c", "d"];

  var color, f, f2, f3, p, n, vertexIndex;

  var radius = 140.0;

  hexoplanetGeometry = new THREE.IcosahedronGeometry(200, 0);
  hexoplanetGeometry.dynamic = true;

  for (var pataticas = 0; pataticas < iNumSubdiv; pataticas++) {
    var aNeighborsInfo = new Array();
    g_HexPlanetData = new Array();

    //hexoplanetGeometry.attributes.normal.count
    for (var i = 0; i < hexoplanetGeometry.faces.length; i++) {
      f = hexoplanetGeometry.faces[i];
      n = f instanceof THREE.Face3 ? 3 : 4;

      var centerVertex = new THREE.Vector3(0, 0, 0);
      var aCurrentVertexID = new Array();

      for (var j = 0; j < n; j++) {
        vertexIndex = f[faceIndices[j]];
        p = hexoplanetGeometry.vertices[vertexIndex];
        //centerVertex.addSelf(p);
        centerVertex.add(p);

        aCurrentVertexID.push(vertexIndex);
      }

      centerVertex.divideScalar(n);

      hexoplanetGeometry.vertices.push(centerVertex);

      //Store neighbords info
      for (var id = 0; id < aCurrentVertexID.length; id++) {
        var directionVector = hexoplanetGeometry.vertices[0].clone();
        directionVector = perpendicular(directionVector);

        //var v1 = directionVector.subSelf(hexoplanetGeometry.vertices[ aCurrentVertexID[id] ]);
        var v1 = directionVector.sub(
          hexoplanetGeometry.vertices[aCurrentVertexID[id]]
        );
        var nrm = centerVertex.clone();
        var v2 = centerVertex.clone();
        //v2 = v2.subSelf(hexoplanetGeometry.vertices[ aCurrentVertexID[id] ]);
        v2 = v2.sub(hexoplanetGeometry.vertices[aCurrentVertexID[id]]);
        nrm = nrm.normalize();
        v1 = v1.normalize();
        v2 = v2.normalize();

        var angle = Math.acos(v1.dot(v2));
        //var dir = nrm.dot( v1.crossSelf( v2 ) );
        var dir = nrm.dot(v1.cross(v2));
        if (dir < 0.0) angle = 3.14 + (3.14 - angle);

        if (aNeighborsInfo[aCurrentVertexID[id]] == undefined)
          aNeighborsInfo[aCurrentVertexID[id]] = new Array();

        var neighbordsObject = new Object();
        neighbordsObject.vertexID = hexoplanetGeometry.vertices.length - 1;
        neighbordsObject.angle = angle;
        aNeighborsInfo[aCurrentVertexID[id]].push(neighbordsObject);
      }
    }

    for (var i = 0; i < hexoplanetGeometry.vertices.length; i++) {
      hexoplanetGeometry.vertices[i].normalize();
      hexoplanetGeometry.vertices[i].multiplyScalar(radius);
    }

    hexoplanetGeometry.faces.splice(0, hexoplanetGeometry.faces.length);
    var colorrrrr = 0;
    for (var i = 0; i < aNeighborsInfo.length; i++) {
      aNeighborsInfo[i].sort(function (a, b) {
        return a.angle > b.angle;
      });
      colorrrrr += 1 / aNeighborsInfo.length;
      var random_length = radius + Math.random() * 50.0;

      var pCurrentHexData = new HexData();
      pCurrentHexData.fHeight = random_length;
      pCurrentHexData.iCenterId = i;
      pCurrentHexData.vCenter = hexoplanetGeometry.vertices[i];
      for (var j = 0; j < aNeighborsInfo[i].length; j++) {
        if (pataticas < iNumSubdiv - 1) {
          pCurrentHexData.aFaces.push(hexoplanetGeometry.faces.length);
          pCurrentHexData.aTopFaces.push(hexoplanetGeometry.faces.length);

// const lbl_fcs = document.getElementById('lbl_fcs')
// const valuelbl_fcs = document.createTextNode(pCurrentHexData.aTopFaces.lastIndexOf(pCurrentHexData.aTopFaces))
// lbl_fcs.appendChild(valuelbl_fcs)

          var newFace = new THREE.Face3(
            i,
            aNeighborsInfo[i][j].vertexID,
            aNeighborsInfo[i][(j + 1) % aNeighborsInfo[i].length].vertexID
          );

          color = new THREE.Color(0xffffff);
          //color.setHSV( colorrrrr, 1.0, 1.0 );
          color.setHSL(colorrrrr, 1.0, 1.0);

          newFace.vertexColors[0] = color;
          newFace.vertexColors[1] = color;
          newFace.vertexColors[2] = color;
          hexoplanetGeometry.faces.push(newFace);

          // hexoplanetGeometry.faceVertexUvs[ 0 ].push( [
          //         new THREE.UV( 0.5, 1 ),
          //         new THREE.UV(0, 0 ),
          //         new THREE.UV( 1, 0 )
          //     ] );
        } else {
          var vert1 = hexoplanetGeometry.vertices[i].clone();
          vert1.normalize();
          vert1.multiplyScalar(random_length);
          var vert2 = hexoplanetGeometry.vertices[
            aNeighborsInfo[i][j].vertexID
          ].clone();
          vert2.normalize();
          vert2.multiplyScalar(random_length);
          var vert3 = hexoplanetGeometry.vertices[
            aNeighborsInfo[i][(j + 1) % aNeighborsInfo[i].length].vertexID
          ].clone();
          vert3.normalize();
          vert3.multiplyScalar(random_length);

          hexoplanetGeometry.vertices.push(vert1);
          hexoplanetGeometry.vertices.push(vert2);
          hexoplanetGeometry.vertices.push(vert3);

          //TOP
          pCurrentHexData.aFaces.push(hexoplanetGeometry.faces.length);
          pCurrentHexData.aTopFaces.push(hexoplanetGeometry.faces.length);
          var newFace2 = new THREE.Face3(
            hexoplanetGeometry.vertices.length - 3,
            hexoplanetGeometry.vertices.length - 2,
            hexoplanetGeometry.vertices.length - 1
          );
          color2 = new THREE.Color(0xffffff);
          //color2.setHSV( /*colorrrrr*/0.0, 1.0, 1.0 );
          color2.setHSL(/*colorrrrr*/ 0.0, 1.0, 1.0);
          newFace2.vertexColors[0] = color2;
          newFace2.vertexColors[1] = color2;
          newFace2.vertexColors[2] = color2;
          hexoplanetGeometry.faces.push(newFace2);
          // hexoplanetGeometry.faceVertexUvs[ 0 ].push( [
          //         new THREE.UV( 0.5, 1 ),
          //         new THREE.UV(0, 0 ),
          //         new THREE.UV( 1, 0 )
          //     ] );

          //BASE
          pCurrentHexData.aFaces.push(hexoplanetGeometry.faces.length);
          var newFace3 = new THREE.Face3(
            hexoplanetGeometry.vertices.length - 2,
            aNeighborsInfo[i][j].vertexID,
            hexoplanetGeometry.vertices.length - 1
          );
          color2 = new THREE.Color(0xffffff);
          //color2.setHSV( colorrrrr, 1.0, 1.0 );
          color2.setHSL(colorrrrr, 1.0, 1.0);
          newFace3.vertexColors[0] = color2;
          newFace3.vertexColors[1] = color2;
          newFace3.vertexColors[2] = color2;
          hexoplanetGeometry.faces.push(newFace3);
          // hexoplanetGeometry.faceVertexUvs[ 0 ].push( [
          //         new THREE.UV( 0.5, 1 ),
          //         new THREE.UV(0, 0 ),
          //         new THREE.UV( 1, 0 )
          //     ] );

          //BASE
          pCurrentHexData.aFaces.push(hexoplanetGeometry.faces.length);
          var newFace4 = new THREE.Face3(
            aNeighborsInfo[i][j].vertexID,
            aNeighborsInfo[i][(j + 1) % aNeighborsInfo[i].length].vertexID,
            hexoplanetGeometry.vertices.length - 1
          );
          color2 = new THREE.Color(0xffffff);
          //color2.setHSV( colorrrrr, 1.0, 1.0 );
          color2.setHSL(colorrrrr, 1.0, 1.0);
          newFace4.vertexColors[0] = color2;
          newFace4.vertexColors[1] = color2;
          newFace4.vertexColors[2] = color2;
          hexoplanetGeometry.faces.push(newFace4);
          // hexoplanetGeometry.faceVertexUvs[ 0 ].push( [
          //         new THREE.UV( 0.5, 1 ),
          //         new THREE.UV(0, 0 ),
          //         new THREE.UV( 1, 0 )
          //     ] );
        }
      }

      g_HexPlanetData.push(pCurrentHexData);
    }
  }

  hexoplanetGeometry.computeFaceNormals();
  hexoplanetGeometry.computeVertexNormals();
  // hexoplanetGeometry.computeCentroids();
  hexoplanetGeometry.center();
  // hexoplanetGeometry.computeTangents();

  hexoplanetGeometry.computeBoundingBox();
  hexoplanetGeometry.computeBoundingSphere();

  //Calculate neighbors
  //------------------
  for (var i = 0; i < g_HexPlanetData.length; i++) {
    var center = g_HexPlanetData[i].vCenter;
    var aClosests = new Array();

    for (var j = 0; j < g_HexPlanetData.length; j++) {
      var newEntry = new Object();
      newEntry.id = j;
      newEntry.distance = center.distanceToSquared(g_HexPlanetData[j].vCenter);
      aClosests.push(newEntry);
    }

    aClosests.sort(function (a, b) {
      return a.distance > b.distance;
    });

    for (var j = 0; j < g_HexPlanetData[i].aTopFaces.length; j++) {
      g_HexPlanetData[i].aNeighbors.push(aClosests[j + 1].id);
    }
    //	console.log(aClosests);
  }
  return hexoplanetGeometry;
}

function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;

  mouse2D.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse2D.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onDocumentMouseDown(event) {
  event.preventDefault();
  
//
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse2D, camera);

  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    console.log(intersects[0].face.centroid);

    var faceID = intersects[0].faceIndex;
    var hexID;
    for (var i = 0; i < g_HexPlanetData.length; i++) {
      for (var j = 0; j < g_HexPlanetData[i].aFaces.length; j++) {
        if (g_HexPlanetData[i].aFaces[j] == faceID) {
          hexID = i;
          console.log("ENCONTRADO " + i);
          break;
        }
      }
    }

    //document.getElementById( "lbl_sel" ).innerHTML = 'Selected: ' + hexID;
    //document.getElementById( "lbl_ngh" ).innerHTML = 'Neighbors: ' + 	g_HexPlanetData[hexID].aNeighbors;

    switch (event.button) {
      case 0:
        g_HexPlanetData[hexID].fHeight += 10;
        break;
      case 2:
        g_HexPlanetData[hexID].fHeight -= 10;
        break;
    }
    doRefreshGeometry();
  }
}

//

function doSmooth() {
  var newHeights = new Array();
  for (var i = 0; i < g_HexPlanetData.length; i++) {
    var neighbordsHeight = 0.0;
    for (var j = 0; j < g_HexPlanetData[i].aNeighbors.length; j++) {
      neighbordsHeight +=
        g_HexPlanetData[g_HexPlanetData[i].aNeighbors[j]].fHeight;
    }
    neighbordsHeight = neighbordsHeight / g_HexPlanetData[i].aNeighbors.length;
    newHeights.push((g_HexPlanetData[i].fHeight + neighbordsHeight) / 2.0);
  }

  // Assign the smooth heights
  for (var i = 0; i < g_HexPlanetData.length; i++) {
    g_HexPlanetData[i].fHeight = newHeights[i];
  }

  doRefreshGeometry();
}

function doRefreshGeometry() {
  //Refresh geometry with the new heights
  for (var i = 0; i < g_HexPlanetData.length; i++) {
    var random_length = 200 + Math.random() * 50;

    for (var j = 0; j < g_HexPlanetData[i].aTopFaces.length; j++) {
      var currentFace =
        g_hexoplanetGeometry.faces[g_HexPlanetData[i].aTopFaces[j]];

      g_hexoplanetGeometry.vertices[currentFace.a].normalize();
      var escalar = g_HexPlanetData[i].fHeight;
      g_hexoplanetGeometry.vertices[currentFace.a].multiplyScalar(escalar);
      g_hexoplanetGeometry.vertices[currentFace.b].normalize();
      g_hexoplanetGeometry.vertices[currentFace.b].multiplyScalar(escalar);
      g_hexoplanetGeometry.vertices[currentFace.c].normalize();
      g_hexoplanetGeometry.vertices[currentFace.c].multiplyScalar(escalar);
    }
  }
  g_hexoplanetGeometry.verticesNeedUpdate = true;

  //	g_hexoplanetGeometry.computeFaceNormals();
  //	g_hexoplanetGeometry.computeVertexNormals();
  //g_hexoplanetGeometry.centroid();
  //g_hexoplanetGeometry.center();
  //	g_hexoplanetGeometry.computeTangents();

  g_hexoplanetGeometry.computeBoundingBox();
  g_hexoplanetGeometry.computeBoundingSphere();
}

function update() {
  const game = this;
  //requestAnimationFrame(function(){game.animate();})
  requestAnimationFrame(update);

  particle.rotation.y += 0.001;
  //group.rotation.x += 0.005;
  //if (uniforms.time!==undefined) uniforms.time.value += clock.getDelta();
  //if (uniforms.meta!==undefined) uniforms.meta.value += tMeta;
  //uniforms.u_time.value += clock.getDelta();
  // uniforms.uTime.value += clock.getDelta();

  if (analyser) {
    const divisor = 32;
    const data = analyser.getFrequencyData();
    const avgFr = analyser.getAverageFrequency();

    // slice the array into two halves
    const lowerHalfArray = data.slice(0, data.length / 2 - 1);
    const upperHalfArray = data.slice(data.length / 2 - 1, data.length - 1);

    const lowerAvgFr = avg(lowerHalfArray) / divisor;
    const upperAvgFr = avg(upperHalfArray) / divisor;

    updateGround(planeGeometry, modulate(avgFr, 0, divisor, 0.5, 3), time);

    updateBall(ballGeometry, lowerAvgFr, upperAvgFr, time);
  }

  render();
}

function resize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  //
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
  
  renderer.render(scene, camera);
  //const dt = clock.getDelta();

  if (player.userData !== undefined && player.userData.move !== undefined) {
    player.translateZ(player.userData.move.forward * clock * 5);
    player.rotateY(player.userData.move.turn * clock);
  }

  camera.position.lerp(
    cameras[cameraIndex].getWorldPosition(new THREE.Vector3()),
    0.05
  );
  const pos = player.position.clone();
  pos.y += 3;
  camera.lookAt(pos);
  //anime
  var dtime = Date.now() - startTime;
  // easing with treshold on 0.08 (should be between .14 & .2 for smooth animations)
  percentage = lerp(percentage, scrollY, 0.08);
  // t1.seek(percentage * (64000 / maxHeight));
  //tube
}
