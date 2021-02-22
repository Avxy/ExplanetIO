var video = document.createElement('video')
video.setAttribute('style', 'position:absolute; display:flex; width:150px;height:150px; padding-left:20px;justify-content:center;')
video.setAttribute('autoplay', '')
video.setAttribute('playinsline', '')
video.setAttribute('id', 'video')

var scene = new THREE.Scene()
var texturee = new THREE.VideoTexture( video );
console.log(video)
var geometryy = new THREE.SphereGeometry(6,30,30);	
var materiall = new THREE.MeshBasicMaterial( { map: texturee } );
var meesh = new THREE.Mesh( geometryy, materiall );
scene.add( meesh );
var body = document.body
body.appendChild(video)