/**
 * @fileOverview N5-kanji-grid, main.js, dev
 * @version 1.0
 */
 
 //
////'use strict';



var vrCamera, 
		orbitCamera,
		sceneCSS,				   // for THREE.CSS3DRenderer()
		sceneGL,					// for THREE.WebGLRenderer()
		rendererCSS,			// for THREE.CSS3DRenderer()
		rendererGL,				// for THREE.WebGLRenderer()
		effect,					 	  // VREffect.js
		vrDisplay,
		orbitControls,		  // OrbitControls.js			
//	    vrControls,				// VRControls.js	
		objects = [],
		targets = {N5KanjiTable: []},			// N5Kanji.js
	    cube,
		gridPadding = 220,
		duration = 2000,
		fov = 40,
		near = 1,
		far = 10000,
//		mouse = { x: 0, y: 0 }, 
		mouse = new THREE.Vector2(),
		intersectionObject;


init();
animate(); 

// ================================================================================================================
//  init(): common
//
// ================================================================================================================

/**
 * @description 			 	common init() method
 *
 * @method init()
 * 
 */ 
function init() { 
	
	//	if (window.console) console.log('console.log init');
	
	sceneCSS = new THREE.Scene();
	sceneGL = new THREE.Scene(); 

	/**
	 * PerspectiveCamera(fov, aspect, near, far)
    */
//	vrCamera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
//	vrCamera.position.z = 3000;
	orbitCamera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, near, far);
	orbitCamera.position.z = 3000;

	setN5KanjiTable();
	
	
	// ================================================================================================================
	//  init(): 
	//
	// set the two renderers for:
	// THREE.WebGLRenderer, and
	// THREE.CSS3DRenderer()
	// ================================================================================================================
	
	
//	rendererGL = new THREE.WebGLRenderer({ alpha: true, antialiasing: true } ); // required: alpha: true
	// use Detector.js to check webGL support, otherwise use the (deprecated)  CanvasRenderer from https://threejs.org/docs/#examples/renderers/CanvasRenderer
	rendererGL = Detector.webgl? new THREE.WebGLRenderer({ alpha: true, antialiasing: true } ): new THREE.CanvasRenderer();		
	rendererGL.setClearColor(0x000000, 0); // required
	rendererGL.setPixelRatio(window.devicePixelRatio);
	rendererGL.setSize(window.innerWidth, window.innerHeight);
////	rendererGL.domElement.style.position = 'absolute'; 
////	rendererGL.domElement.style.top = 0;
////	rendererGL.domElement.style.zIndex = "1";
	 document.getElementById('container').appendChild(rendererGL.domElement); 
	//rendereGL.autoClear = false;

	rendererCSS = new THREE.CSS3DRenderer();
	rendererCSS.setSize(window.innerWidth, window.innerHeight);
	rendererCSS.domElement.style.position = 'absolute'; 
    rendererCSS.domElement.style.top = 0;
	document.getElementById('container').appendChild(rendererCSS.domElement); 

	// ================================================================================================================
	//  init(): set the controls
	//
	// set the controls to orbit around the view
	// ================================================================================================================
	
//	vrControls = new THREE.VRControls(vrCamera);
	
	orbitControls = new THREE.OrbitControls(orbitCamera);
	orbitControls.rotateSpeed = 0.5;
	orbitControls.minDistance = 500;
	orbitControls.maxDistance = 5000;
	orbitControls.addEventListener('change', render);
	
//	orbitCamera.add(vrCamera);		// use a 2nd child camera, vrCamera, for vrControls
	//sceneGL.add(orbitCamera);

	
	// ================================================================================================================
	//  init(): the stereoscopic effect
	//
	// applied only to the rendererGL; rendererCSS is separate
	// ================================================================================================================
	
	effect = new THREE.VREffect(rendererGL);
	effect.setSize(window.innerWidth, window.innerHeight);


	// ================================================================================================================
	//  init(): 
	//
	// TWEEN animation
	// ================================================================================================================
	
	//TWEEN.removeAll();


	for (var i = 0; i < objects.length; i++) {
						tweenTranslate(objects[i], targets.N5KanjiTable[i],  + 20, Math.random() * duration * 2);

	}

	new TWEEN.Tween(this)
		.to( {}, duration * 2)
		.onUpdate(render)
		.start();
	
	// ================================================================================================================
	//  init(): 
	//
	// events
	// ================================================================================================================
	
	window.addEventListener('resize', onResize, false);
	window.addEventListener('mousemove', onDocumentMouseMove, false);
}


// ================================================================================================================
//  setN5KanjiTable()
//
// ================================================================================================================

/**
 * @description 			 	fill out the Kanji from a separate js-file.
 *
 * @method setN5KanjiTable()
 * 
 */ 
function setN5KanjiTable() {
		// N5Kanji

	for (var i = 0; i < N5KanjiTable.length; i += 6) { // the N5KanjiTable  array contains six elements

		var kanjiBox = document.createElement('div');
		kanjiBox.className = 'kanji-box'; 

		var kanji = document.createElement('div');
		kanji.className = 'kanji';
		kanji.textContent = N5KanjiTable[i + 1];
		kanjiBox.appendChild(kanji);

		var hatsuon = document.createElement('div');
		hatsuon.className = 'hatsuon';
		hatsuon.innerHTML = N5KanjiTable[i + 2] + '<br>' + N5KanjiTable[i + 3];
		kanjiBox.appendChild(hatsuon);

		var object = new THREE.CSS3DObject(kanjiBox);
		object.position.x = (N5KanjiTable[i + 4] * gridPadding) - 1630;
		object.position.y = - (N5KanjiTable[i + 5] * gridPadding) + 990;
		object.position.z = Math.random() * 4000 - 2000;
		sceneCSS.add(object);

		objects.push(object);

		var object = new THREE.Object3D();
		object.position.x = (N5KanjiTable[i + 4] * gridPadding) - 1630; 
		object.position.y = - (N5KanjiTable[i + 5] * gridPadding) + 990;

		targets.N5KanjiTable.push(object);
		
		//		cube = new THREE.Mesh(new THREE.CubeGeometry(160, 180, 40), new THREE.MeshFaceMaterial( {
		////			color: baseColor, wireframe: true 
		//    new THREE.MeshBasicMaterial({color:0xff0000, transparent:true, opacity:0.8, side: THREE.DoubleSide}),
		//    new THREE.MeshBasicMaterial({color:0x00ff00, transparent:true, opacity:0.8, side: THREE.DoubleSide}), 
		//    new THREE.MeshBasicMaterial({color:0xffff00, transparent:true, opacity:0.8, side: THREE.DoubleSide}), 
		//    new THREE.MeshBasicMaterial({color:0xff00ff, transparent:true, opacity:0.8, side: THREE.DoubleSide}), 
		//    new THREE.MeshBasicMaterial({color:0x00ffff, transparent:true, opacity:0.8, side: THREE.DoubleSide}),
		//		} ));
		//		cube.position.x = (N5KanjiTable[i + 4] * gridPadding) - 1630; 
		//		cube.position.y = - (N5KanjiTable[i + 5] * gridPadding) + 990;
		//	//	cube.position.z = Math.random();
		////		cube.material.color.setHex( 0xffff00 ); 
		//		sceneGL.add(cube);  
		
		cube = new THREE.Mesh(new THREE.CubeGeometry(160, 180, 40), new THREE.MeshBasicMaterial( {color: 0x9999ff }));
		cube.position.x = (N5KanjiTable[i + 4] * gridPadding) - 1630; 
		cube.position.y = - (N5KanjiTable[i + 5] * gridPadding) + 990;
		//	cube.position.z = Math.random();
		sceneGL.add(cube);						 
		}	
}

// ================================================================================================================
//  onHover()
//
// ================================================================================================================

/**
 * @description 				update mouse coordinates
 *
 * @method onMouseMove(event) 
 * 
 */ 
function onDocumentMouseMove(event) {
	// prevent any other events
	 event.preventDefault();
	
	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	
	mouseHandler();
}


/**
 * @description 				handles pointer Ray with THREE.Raycaster
 *
 * @method mouseHandler()
 * 
 */ 
function mouseHandler() {
	// mouse ray vector
	//	var vector = new THREE.Vector2(mouse.x, mouse.y);
	//	projector.unprojectVector(vector, orbitCamera);
	//	var ray = new THREE.Raycaster(orbitCamera.position, vector.sub(orbitCamera.position).normalize());
	var ray = new THREE.Raycaster();
	
	ray.setFromCamera(mouse, orbitCamera);

	// intersections for the scene
	var intersects = ray.intersectObjects(sceneGL.children); 

	if (intersects.length > 0) 	{ 	// at least 1 intersection
			if (intersects[0].object != intersectionObject) {
				if (intersectionObject) {
					intersectionObject.material.color.setHex(intersectionObject.currentHex);
				
					if(intersectionObject.position.z = 60){
						tweenTranslate(intersectionObject, intersectionObject,   - 60, 222);
					}
				}	
				
				intersectionObject = intersects[0].object;
				intersectionObject.currentHex = intersectionObject.material.color.getHex();
				intersectionObject.material.color.setHex(0xcc6666); 
		
				tweenTranslate(intersectionObject, intersectionObject,  + 60, duration/222);
			
				// objs pos: 220 (gridPadding) x and y diff
				// width / diff = nr of x values
			
				//			new TWEEN.Tween(objects[1].position)
				//			.to( {x: intersectionObject.position.x, 
				//				  	 y: intersectionObject.position.y, 
				//				     z: (intersectionObject.position.z  + 60) },  
				//				 duration/222)
				//			.easing(TWEEN.Easing.Quartic.InOut)
				//			.start();

			
/*					console.log(' ============================================================================================================');
					console.log(' intersects.length > 0 ');
					console.log('intersectionObject.position.x' + intersectionObject.position.x);
					console.log('intersectionObject.position.y' + intersectionObject.position.y);
					console.log('intersectionObject.position.z' + intersectionObject.position.z);
					console.log('intersectionObject.position.indexOf()' + intersects.indexOf(intersectionObject));
					console.log(' ============================================================================================================');
			*/

		}
		 render();
		} 	else { // 0 intersections
			intersectionObject.material.color.setHex(0x9999ff);
			TWEEN.stop;
			TWEEN.removeAll;

			if(intersectionObject.position.z = 60){
				tweenTranslate(intersectionObject, intersectionObject,  - 60, 222);
			}

			intersectionObject = null;
			render();
	}
}


/**
 * @description 							common Tween translation along the z-axis
 *
 * @param object				 -		Tween() constructor parameter for object.position				
  * @param targetXYZ		 -		Tween.to() xyz target positions
  * @param  z_trans			   -	  z-coord translation 
  * @param  z_trans		       -	  Tween duration speed
 * @method  tweenTranslate() 
 * 
 */ 
function tweenTranslate(object, targetXYZ,  z_trans, speed) {
		new TWEEN.Tween(object.position)
		.to( {x: targetXYZ.position.x, 
				 y: targetXYZ.position.y, 
				 z: (targetXYZ.position.z  + z_trans) },  //  40 is the z-coord of the cube
			 speed)
		.easing(TWEEN.Easing.Quartic.InOut)
		.start();
}


// ================================================================================================================
//  onClick()
//
// ================================================================================================================

// ...

// ================================================================================================================
//  onResize()
//
// ================================================================================================================

/**
 * @description 				keep aspect ratio 	
 *
 * @method onResize()
 * 
 */ 
function onResize() {

//	vrCamera.aspect = window.innerWidth / window.innerHeight;
//	vrCamera.updateProjectionMatrix();
	
	orbitCamera.aspect = window.innerWidth / window.innerHeight;
	orbitCamera.updateProjectionMatrix();

	rendererCSS.setSize(window.innerWidth, window.innerHeight);
	//rendererGL.setSize(window.innerWidth, window.innerHeight);
	effect.setSize(window.innerWidth, window.innerHeight);

	render();
}

//window.addEventListener('vrdisplaypresentchange', onResize);

// ================================================================================================================
//  animate() 
//
// ================================================================================================================

/**
 * @description 			 	only onLoad animation
 *
 * @method animate() 
 * 
 */ 
function animate() {

	// note: three.js includes the requestAnimationFrame shim
	requestAnimationFrame(animate);

	TWEEN.update();
	
	orbitControls.update();
//	vrControls.update();
	
	mouseHandler();
}

// ================================================================================================================
//  render() 
//
// ================================================================================================================

/**
 * @description 			 	renders CSS and GL scenes; since the scenes are mostly static, there is no render loop
 *
 * @method render() 
 * 
 */ 
function render() {
	
//	rendererGL.render(sceneGL, camera);
	rendererCSS.render(sceneCSS, orbitCamera);
	effect.render(sceneGL, orbitCamera);
	//effect.render(sceneCSS, camera);
}


//// render loop at 60 fps:
//var render = function () {
//requestAnimationFrame(render);
//	
//		TWEEN.update();
//	
//	orbitControls.update();
//
////	rendererGL.render(sceneGL, camera);
//	rendererCSS.render(sceneCSS, orbitCamera);
//	effect.render(sceneGL, orbitCamera);
//	//effect.render(sceneCSS, camera);
//};
//render();



