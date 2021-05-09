//1. colocar personagem pra correr no mundo hexagonal
//2. criar mecanica dos hexagonos para abrir caminhos ou portas
//3. criar um cenário em cada hexagono sempre que o jogador abre um ciclo mágico
class Explanet{
  constructor(){
if (!Detector.webgl) Detector.addGetWebGLMessage();

this.sphereBox;
this.binormal
this.normal
this.tube
this.player 
this.particle
this.envMap;
this.startTime = Date.now();
this.scrollY = 0;
this._event = {
  y: 0,
  deltaY: 0
};
this.t1 = null;
this.percentage = 0;
this.point;
this.point2;
this.cube;
this.sphere;
this.group;
this.iGroup;
this.iMesh;
this.bPlane;
this.bBox01;
this.createText;
this.maxHeight = 7199;
this.cameras;
this.cameraIndex;
this.controls;
this.playerPos;
this.t_mes;
this.text;
// this.uniforms = {};
//var uniforms;
this.tMeta = { begin: 0 };
this.planeGeometry
this.ballSound
this.ballGeometry
this.simplex
this.sound,
this.analyser
//hexplanet
this.container
this.stats
this.mesh
this.group1
this.group2
this.group3
this.light
this.mouse = new THREE.Vector2();
this.mouseX = 0,
this.mouseY = 0;
this.windowHalfX = window.innerWidth / 2;
this.windowHalfY = window.innerHeight / 2;
this.mouse2D
this.projector;
// this.clock = new THREE.clock();
this.gui
this.guiConfig;
this.g_light;
this.g_hexoplanetGeometry;
this.hexoplanetGeometry;
this.renderer
this.scene
this.camera
this.explanet = this
this.explanet.init()
  }

  
init() {

  this.scene = new THREE.Scene();
  this.camera = new THREE.PerspectiveCamera();
  this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  
    this.container = document.getElementById("container");
    this.camera.fov = 60;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.near = 0.1;
    this.camera.far = 1000;
  
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 300;
    this.camera.lookAt(0, 0, 0);
  
    // renderer.antialias=true;
    // renderer.alpha=true;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    //document.body.appendChild(renderer.domElement);
    this.container.appendChild(this.renderer.domElement);
  
    // const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820);
    // scene.add(ambient);
  
    this.light = new THREE.DirectionalLight(0xffffff, 1);
    this.light.position.set(2, 500, 1000);
    this.scene.add(this.light);
  
    // const light00 = new THREE.DirectionalLight(0xffffff, 1);
    // light00.position.set(0, 0, 0);
    // scene.add(light00);
  
    //this.clock = new THREE.this.clock();
  
    //controls = new THREE.OrbitControls(camera, renderer.domElement);
  
    this.geod3();
    this.objMesh();
    //metaMesh();
    this.tubeMesh();
    this.playerCam();
    loadFont()
    //initTimeline();
    // this.loadFont();
    //metaShader();
    //metaSound();
    //textFF();
    // preload();
    // setupP5();
  
    this.iNumSubdivisions = 3;
  
    this.g_material11 = new THREE.MeshToonMaterial({
      color: 0x223355,
      ambient: 0xbbbbbb
    });

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
      const text = new THREE.Mesh(textGeo, cubeMat);
      text.position.set(0, 250, -50);
      text.castShadow = true;
      text.scale.set(5, 3, 1);
      
      
    }
  
  
    this.g_hexoplanetGeometry = this.createHexSphere(this.iNumSubdivisions);
    this.mesh = new THREE.Mesh(this.g_hexoplanetGeometry, this.g_material11);
    this.mesh.position.y = 0;
    this.mesh.position.x = 0;
    this.scene.add(this.mesh);
    document.addEventListener("resize", this.resize, false);
    document.addEventListener("wheel", this.onWheel, { passive: false });
    //document.addEventListener("mousedown", onMouseDown, false);
    //document.addEventListener("mousemove", onMouseMove, false);
    document.addEventListener("mousemove", this.onDocumentMouseMove, false);
  
    document.addEventListener("mousedown", this.onDocumentMouseDown, false);
    this.update()
  }


  
  
  
   onWheel(e) {
    // for embedded demo
    e.stopImmediatePropagation();
    e.preventDefault();
    e.stopPropagation();

    let _event = {
      y: 0,
      deltaY: 0
    };
  
    var evt = _event;
    evt.deltaY = e.wheelDeltaY || e.deltaY * -1;
    // reduce by half the delta amount otherwise it scroll too fast
    evt.deltaY *= 5;
  
    scroll(e);
  }
  
   scroll(e) {
    let _event = {
      y: 0,
      deltaY: 0
    };
    var evt = _event;
    // limit scroll top
    if (evt.y + evt.deltaY > 0) {
      evt.y = 0;
      // limit scroll bottom
    } else if (-(evt.y + evt.deltaY) >= this.maxHeight) {
      evt.y = - this.maxHeight;
    } else {
      evt.y += evt.deltaY;
    }
    this.scrollY = -evt.y;
  }
  
  //sphere cube circle square
   metaShader() {
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
    const uniforms = {};
    uniforms.u_time = { value: 0.0 };
    uniforms.u_mouse = { value: { x: 0.0, y: 0.0 } };
    uniforms.u_resolution = { value: { x: 0, y: 0 } };
    uniforms.u_radius = { value: 40.0 };
    uniforms.u_meta = { value: 0.0 };
  
    uniforms = {
      u_time: {value: 0.0},
      u_radius: {value: 70.0}
    }
  
    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vshader,
      fragmentShader: fshader,
      wireframe: true
    });
  
    const ballSound = new THREE.Mesh(geometry, material);
    scene.ad
    d(ballSound);
  }

  metaSound() {
    //plane
    this.planeGeometry = new THREE.PlaneBufferGeometry(1000, 1000, 10, 10);
    const material1 = new THREE.MeshToonMaterial({
      color: 0xffffff,
      wireframe: true
    });
  
    const plane = new THREE.Mesh(this.planeGeometry, material1);
    plane.rotateX(-Math.PI / 3);
    plane.position.set(0, -500, 0);
    scene.add(plane);
  
    //ball
    this.ballGeometry = new THREE.IcosahedronBufferGeometry(200, 2);
  
    const material2 = new THREE.MeshToonMaterial({
      color: 0xffffff,
      wireframe: true
    });
  
    this.ballSound = new THREE.Mesh(this.ballGeometry, material2);
    //ballSound.position.y = 100;
    this.scene.add(this.ballSound);
  
    this.simplex = new SimplexNoise(4);
  }
  
   playSound() {
    this.listener = new THREE.AudioListener();
    this.camera.add(listener);
  
    this.sound = new THREE.Audio(this.listener);
  
    const loader = new THREE.AudioLoader();
    loader.setPath(assetsPath);
    loader.load("against-the-odds.mp3", (buffer) => {
      this.sound.setBuffer(buffer);
      this.sound.play();
    });
  
    this.analyser = new THREE.AudioAnalyser(this.sound, 128);
  }
  
   onMouseDown() {
    if (this.sound) {
      if (this.sound.isPlaying) {
        this.sound.pause();
      } else {
        this.sound.play();
      }
    }
  }
  
   updateGround(geometry, distortionFr, time) {
    const position = geometry.getAttribute("position");
    const amp = 0.1;
    for (let i = 0; i < position.array.length; i += 3) {
      const offset =
        this.simplex.noise2D(
          position.array[i] + time * 0.0003,
          position.array[i + 1] + time * 0.0001
        ) *
        distortionFr *
        amp;
      position.array[i + 2] = offset;
    }
    position.needsUpdate = true;
  }
  
   updateBall(geometry, baseFr, trebleFr, time) {
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
        this.simplex.noise3D(
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
   fractionate(val, minVal, maxVal) {
    return (val - minVal) / (maxVal - minVal);
  }
  
   modulate(val, minVal, maxVal, outMin, outMax) {
    var fr = fractionate(val, minVal, maxVal);
    var delta = outMax - outMin;
    return outMin + fr * delta;
  }
  
   avg(arr) {
    var total = arr.reduce(function (sum, b) {
      return sum + b;
    });
    return total / arr.length;
  }
  
   max(arr) {
    return arr.reduce(function (a, b) {
      return Math.max(a, b);
    });
  }
  
   tubeMesh() {
    //Add meshes here
    const curve = new THREE.Curves.TrefoilKnot(30);
    const geometry = new THREE.TubeBufferGeometry(curve, 100, 2, 8, true);
    const material = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: 0xffffff,
      side: THREE.DoubleSide,
      visible: false
    });
    this.tube = new THREE.Mesh(geometry, material);
    this.scene.add(this.tube);
  
    this.binormal = new THREE.Vector3();
    this.normal = new THREE.Vector3();
  }
  
   objMesh() {
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
  
    this.sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 20, 15),
      new THREE.MeshToonMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide
      })
    );
    this.sphere.position.x = 0;
    this.sphere.position.y = 140;
    this.sphere.position.z = 0;
    this.scene.add(this.sphere);
  
    this.bBox01 = new THREE.Mesh(
      new THREE.BoxGeometry(500, 500, 500),
      new THREE.MeshToonMaterial({
        color: "rgb(9,55,89)",
        side: THREE.DoubleSide
      })
    );
    this.bBox01.rotation.x = 0.5;
    this.bBox01.rotation.y = 0.78;
    this.bBox01.position.x = 0;
    this.bBox01.position.y = -1000;
    this.bBox01.position.z = 0;
    this. scene.add(this.bBox01);
  
    this.bPlane = new THREE.GridHelper(5000, 37);
    this.bPlane.material.color = new THREE.Color("white");
    this.bPlane.rotateX(Math.PI / 2);
    this.bPlane.position.set(0, 0, -200);
    this.scene.add(this.bPlane);
  
    this.particle = new THREE.Object3D();
    this.scene.add(this.particle);
    //
    var geometry = new THREE.TetrahedronGeometry(4, 0);
    var material = new THREE.MeshToonMaterial({
      color: 0xffffff,
      shading: THREE.FlatShading
    });
    for (var i = 0; i < 108; i++) {
      this.mesh = new THREE.Mesh(geometry, material);
      this.mesh.position
        .set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
        .normalize();
        this.mesh.position.multiplyScalar(90 + Math.random() * 700);
      this.mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
      this.particle.add(this.mesh);
    }
  }
  
   metaMesh() {
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
    this.iGroup = new THREE.Group();
    this.scene.add(this.iGroup);
    //const geometry = new THREE.IcosahedronBufferGeometry(2010, 1);
    const geometry = new THREE.IcosahedronBufferGeometry(300, 1);
    const mat = new THREE.MeshToonMaterial({ wireframe: true });
    this.iMesh = new THREE.Mesh(geometry, mat);
    this.scene.add(this.iMesh);
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
      this.iGroup.add(iBall);
    }
  }

   geod3() {
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
        const group = new THREE.Object3D();
        
        // this.scene.add(group);
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
       let uniforms = {
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
            var point = new THREE.Mesh(
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
  
   playerCam() {
    //Add meshes here
    this.player = new THREE.Group();
    //player.position.set(140, 140, 0);
    this.player.position.set(0, 0, 300);
    this.scene.add(this.player);
  
    // const bodyGeometry = new THREE.CylinderBufferGeometry(0.5, 0.3, 1.6, 20);
    const material = new THREE.MeshStandardMaterial({ color: 0xffff00 });
    // const body = new THREE.Mesh(bodyGeometry, material);
    // body.position.y = 0.8;
    // body.scale.z = 0.5;
    // player.add(body);
    const headGeometry = new THREE.SphereBufferGeometry(0.3, 20, 15);
    const head = new THREE.Mesh(headGeometry, material);
    head.position.set = (0, 0, 0);
    this.player.add(head);
  
    this.cameras = [];
    this.cameraIndex = 0;
  
    const followCam = new THREE.Object3D();
    followCam.position.copy(this.camera.position);
    this.player.add(followCam);
    this.cameras.push(followCam);
  
    const frontCam = new THREE.Object3D();
    frontCam.position.set(0, 0, -8);
    this.player.add(frontCam);
    this.cameras.push(frontCam);
  
    // const overheadCam = new THREE.Object3D();
    // overheadCam.position.set(0, 20, 0);
    // cameras.push(overheadCam);
  
    this.addKeyboardControl();
  
    const btn = document.getElementById("camera-btn");
    btn.addEventListener("click", this.changeCamera);
  }
  
   changeCamera() {
    this.cameraIndex++;
    if (this.cameraIndex >= this.cameras.length) this.cameraIndex = 0;
  }
  
   addKeyboardControl() {
    document.addEventListener("keydown", this.keyDown);
    document.addEventListener("keyup", this.keyUp);
  }
  
   keyDown(evt) {
    let forward =
    this.player.userData !== undefined && this.player.userData.move !== undefined
        ? this.player.userData.move.forward
        : 0;
    let turn =
    this.player.userData != undefined && this.player.userData.move !== undefined
        ? this.player.userData.move.turn
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
  
   keyUp(evt) {
    let forward =
    this.player.userData !== undefined && this.player.userData.move !== undefined
        ? this.player.userData.move.forward
        : 0;
    let turn =
    this.player.move != undefined && this.player.userData.move !== undefined
        ? this.player.userData.move.turn
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
  
   playerControl(forward, turn) {
    if (forward == 0 && turn == 0) {
      delete player.userData.move;
    } else {
      if (player.userData === undefined) player.userData = {};
      this.player.userData.move = { forward, turn };
    }
  }
  
  // linear interpolation function
   lerp(a, b, t) {
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
  
  //   const dt = this.clock.getDelta();
  
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
  
   perpendicular(vector) {
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
  
  
  
   createHexSphere(iNumSubdiv) {
    var faceIndices = ["a", "b", "c", "d"];
  
    var color, f, f2, f3, p, n, vertexIndex;
  
    var radius = 140.0;
  
    this.hexoplanetGeometry = new THREE.IcosahedronGeometry(200, 0);
    this.hexoplanetGeometry.dynamic = true;
  
    for (var pataticas = 0; pataticas < iNumSubdiv; pataticas++) {
      var aNeighborsInfo = new Array();
      var g_HexPlanetData = new Array();
  
      //hexoplanetGeometry.attributes.normal.count
      for (var i = 0; i < this.hexoplanetGeometry.faces.length; i++) {
        f = this.hexoplanetGeometry.faces[i];
        n = f instanceof THREE.Face3 ? 3 : 4;
  
        var centerVertex = new THREE.Vector3(0, 0, 0);
        var aCurrentVertexID = new Array();
  
        for (var j = 0; j < n; j++) {
          vertexIndex = f[faceIndices[j]];
          p = this.hexoplanetGeometry.vertices[vertexIndex];
          //centerVertex.addSelf(p);
          centerVertex.add(p);
  
          aCurrentVertexID.push(vertexIndex);
        }
  
        centerVertex.divideScalar(n);
  
        this.hexoplanetGeometry.vertices.push(centerVertex);
  
        //Store neighbords info
        for (var id = 0; id < aCurrentVertexID.length; id++) {
          var directionVector = this.hexoplanetGeometry.vertices[0].clone();
          directionVector = this.perpendicular(directionVector);
  
          //var v1 = directionVector.subSelf(hexoplanetGeometry.vertices[ aCurrentVertexID[id] ]);
          var v1 = directionVector.sub(
            this.hexoplanetGeometry.vertices[aCurrentVertexID[id]]
          );
          var nrm = centerVertex.clone();
          var v2 = centerVertex.clone();
          //v2 = v2.subSelf(hexoplanetGeometry.vertices[ aCurrentVertexID[id] ]);
          v2 = v2.sub(this.hexoplanetGeometry.vertices[aCurrentVertexID[id]]);
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
          neighbordsObject.vertexID = this.hexoplanetGeometry.vertices.length - 1;
          neighbordsObject.angle = angle;
          aNeighborsInfo[aCurrentVertexID[id]].push(neighbordsObject);
        }
      }
  
      for (var i = 0; i < this.hexoplanetGeometry.vertices.length; i++) {
        this.hexoplanetGeometry.vertices[i].normalize();
        this.hexoplanetGeometry.vertices[i].multiplyScalar(radius);
      }
  
      this.hexoplanetGeometry.faces.splice(0, this.hexoplanetGeometry.faces.length);
      var colorrrrr = 0;
      for (var i = 0; i < aNeighborsInfo.length; i++) {
        aNeighborsInfo[i].sort(function (a, b) {
          return a.angle > b.angle;
        });
        colorrrrr += 1 / aNeighborsInfo.length;
        var random_length = radius + Math.random() * 50.0;

       function HexData() {
          this.aFaces = new Array();
          this.aTopFaces = new Array();
          this.iCenterId = 0;
          this.vCenter = new THREE.Vector3(0, 0, 0);
          this.aNeighbors = new Array();
          this.fHeight = 100.0;
        }
  
        var pCurrentHexData = new HexData();
        pCurrentHexData.fHeight = random_length;
        pCurrentHexData.iCenterId = i;
        pCurrentHexData.vCenter = this.hexoplanetGeometry.vertices[i];
        for (var j = 0; j < aNeighborsInfo[i].length; j++) {
          if (pataticas < iNumSubdiv - 1) {
            pCurrentHexData.aFaces.push(this.hexoplanetGeometry.faces.length);
            pCurrentHexData.aTopFaces.push(this.hexoplanetGeometry.faces.length);
  
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
            this.hexoplanetGeometry.faces.push(newFace);
  
            // hexoplanetGeometry.faceVertexUvs[ 0 ].push( [
            //         new THREE.UV( 0.5, 1 ),
            //         new THREE.UV(0, 0 ),
            //         new THREE.UV( 1, 0 )
            //     ] );
          } else {
            var vert1 = this.hexoplanetGeometry.vertices[i].clone();
            vert1.normalize();
            vert1.multiplyScalar(random_length);
            var vert2 = this.hexoplanetGeometry.vertices[
              aNeighborsInfo[i][j].vertexID
            ].clone();
            vert2.normalize();
            vert2.multiplyScalar(random_length);
            var vert3 = this.hexoplanetGeometry.vertices[
              aNeighborsInfo[i][(j + 1) % aNeighborsInfo[i].length].vertexID
            ].clone();
            vert3.normalize();
            vert3.multiplyScalar(random_length);
  
            this.hexoplanetGeometry.vertices.push(vert1);
            this.hexoplanetGeometry.vertices.push(vert2);
            this.hexoplanetGeometry.vertices.push(vert3);
  
            //TOP
            pCurrentHexData.aFaces.push(this.hexoplanetGeometry.faces.length);
            pCurrentHexData.aTopFaces.push(this.hexoplanetGeometry.faces.length);
            var newFace2 = new THREE.Face3(
              this.hexoplanetGeometry.vertices.length - 3,
              this.hexoplanetGeometry.vertices.length - 2,
              this.hexoplanetGeometry.vertices.length - 1
            );
            this.color2 = new THREE.Color(0xffffff);
            //color2.setHSV( /*colorrrrr*/0.0, 1.0, 1.0 );
            this.color2.setHSL(/*colorrrrr*/ 0.0, 1.0, 1.0);
            newFace2.vertexColors[0] = this.color2;
            newFace2.vertexColors[1] = this.color2;
            newFace2.vertexColors[2] = this.color2;
            this.hexoplanetGeometry.faces.push(newFace2);
            // hexoplanetGeometry.faceVertexUvs[ 0 ].push( [
            //         new THREE.UV( 0.5, 1 ),
            //         new THREE.UV(0, 0 ),
            //         new THREE.UV( 1, 0 )
            //     ] );
  
            //BASE
            pCurrentHexData.aFaces.push(this.hexoplanetGeometry.faces.length);
            var newFace3 = new THREE.Face3(
              this.hexoplanetGeometry.vertices.length - 2,
              aNeighborsInfo[i][j].vertexID,
              this.hexoplanetGeometry.vertices.length - 1
            );
            this.color2 = new THREE.Color(0xffffff);
            //color2.setHSV( colorrrrr, 1.0, 1.0 );
            this.color2.setHSL(colorrrrr, 1.0, 1.0);
            newFace3.vertexColors[0] = this.color2;
            newFace3.vertexColors[1] = this.color2;
            newFace3.vertexColors[2] = this.color2;
            this.hexoplanetGeometry.faces.push(newFace3);
            // hexoplanetGeometry.faceVertexUvs[ 0 ].push( [
            //         new THREE.UV( 0.5, 1 ),
            //         new THREE.UV(0, 0 ),
            //         new THREE.UV( 1, 0 )
            //     ] );
  
            //BASE
            pCurrentHexData.aFaces.push(this.hexoplanetGeometry.faces.length);
            var newFace4 = new THREE.Face3(
              aNeighborsInfo[i][j].vertexID,
              aNeighborsInfo[i][(j + 1) % aNeighborsInfo[i].length].vertexID,
              this.hexoplanetGeometry.vertices.length - 1
            );
            this.color2 = new THREE.Color(0xffffff);
            //color2.setHSV( colorrrrr, 1.0, 1.0 );
            this.color2.setHSL(colorrrrr, 1.0, 1.0);
            newFace4.vertexColors[0] = this.color2;
            newFace4.vertexColors[1] = this.color2;
            newFace4.vertexColors[2] = this.color2;
            this.hexoplanetGeometry.faces.push(newFace4);
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
  
    this.hexoplanetGeometry.computeFaceNormals();
    this.hexoplanetGeometry.computeVertexNormals();
    // hexoplanetGeometry.computeCentroids();
    this.hexoplanetGeometry.center();
    // hexoplanetGeometry.computeTangents();
  
    this.hexoplanetGeometry.computeBoundingBox();
    this.hexoplanetGeometry.computeBoundingSphere();
  
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
    return this.hexoplanetGeometry;
  }
  
   onDocumentMouseMove(event) {
     let mouseX , mouseY
     let mouse2D = new THREE.Vector3(0, 10000, 0.5);

    mouseX = event.clientX - this.windowHalfX;
    mouseY = event.clientY - this.windowHalfY;
  
    mouse2D.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse2D.y = - (event.clientY / window.innerHeight) * 2 + 1;
  }
  
   onDocumentMouseDown(event) {
    event.preventDefault();
    
  //
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(this.mouse2D, this.camera);
  console.log(this)
    const intersects = raycaster.intersectObjects(this.scene);
  
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
  
   doSmooth() {
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
  
   doRefreshGeometry() {
    //Refresh geometry with the new heights
    for (var i = 0; i < g_HexPlanetData.length; i++) {
      var random_length = 200 + Math.random() * 50;
  
      for (var j = 0; j < g_HexPlanetData[i].aTopFaces.length; j++) {
        var currentFace =
        this.g_hexoplanetGeometry.faces[g_HexPlanetData[i].aTopFaces[j]];
  
        this.g_hexoplanetGeometry.vertices[currentFace.a].normalize();
        var escalar = g_HexPlanetData[i].fHeight;
        this.g_hexoplanetGeometry.vertices[currentFace.a].multiplyScalar(escalar);
        this.g_hexoplanetGeometry.vertices[currentFace.b].normalize();
        this.g_hexoplanetGeometry.vertices[currentFace.b].multiplyScalar(escalar);
        this.g_hexoplanetGeometry.vertices[currentFace.c].normalize();
        this.g_hexoplanetGeometry.vertices[currentFace.c].multiplyScalar(escalar);
      }
    }
    this.g_hexoplanetGeometry.verticesNeedUpdate = true;
  
    //	g_hexoplanetGeometry.computeFaceNormals();
    //	g_hexoplanetGeometry.computeVertexNormals();
    //g_hexoplanetGeometry.centroid();
    //g_hexoplanetGeometry.center();
    //	g_hexoplanetGeometry.computeTangents();
  
    this.g_hexoplanetGeometry.computeBoundingBox();
    this.g_hexoplanetGeometry.computeBoundingSphere();
  }
  
   update() {
    let game = this
    //requestAnimationFrame(function(){game.animate();})
    requestAnimationFrame(function(){
      game.update()
    })
  
    this.particle.rotation.y += 0.001
    //group.rotation.x += 0.005;
    //if (uniforms.time!==undefined) uniforms.time.value += this.clock.getDelta();
    //if (uniforms.meta!==undefined) uniforms.meta.value += tMeta;
    //uniforms.u_time.value += this.clock.getDelta();
    // uniforms.uTime.value += this.clock.getDelta();
  
    if (this.analyser) {
      const divisor = 32;
      const data = this.analyser.getFrequencyData();
      const avgFr = this.analyser.getAverageFrequency();
  
      // slice the array into two halves
      const lowerHalfArray = data.slice(0, data.length / 2 - 1);
      const upperHalfArray = data.slice(data.length / 2 - 1, data.length - 1);
  
      const lowerAvgFr = avg(lowerHalfArray) / divisor;
      const upperAvgFr = avg(upperHalfArray) / divisor;
  
      updateGround(this.planeGeometry, modulate(avgFr, 0, divisor, 0.5, 3), time);
  
      updateBall(this.ballGeometry, lowerAvgFr, upperAvgFr, time);
    }
  
    this.render();
  }
  
   resize() {
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;
  
    this.camera.aspect = window.innerWidth / window.innerHeight;
    //
    this.camera.updateProjectionMatrix();
  
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
   render() {
    
    this.renderer.render(this.scene, this.camera);
    //const dt = this.clock.getDelta();
  
    if (this.player.userData !== undefined && this.player.userData.move !== undefined) {
      this.player.translateZ(this.player.userData.move.forward * this.clock * 5);
      this.player.rotateY(this.player.userData.move.turn * this.clock);
    }
  
    this.camera.position.lerp(
      this.cameras[this.cameraIndex].getWorldPosition(new THREE.Vector3()),
      0.05
    );
    const pos = this.player.position.clone();
    pos.y += 3;
    this.camera.lookAt(pos);
    //anime
    var dtime = Date.now() - this.startTime;
    // easing with treshold on 0.08 (should be between .14 & .2 for smooth animations)
    this.percentage = this.lerp(this.percentage, this.scrollY, 0.08);
    // this.t1.seek(percentage * (64000 / maxHeight));
    //tube
  }

}






 