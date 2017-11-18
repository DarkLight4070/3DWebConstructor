function SceneManager()
{
	this.__instance = null;
	this.scene = null;
	this.camera = null;
	this.canvas = null;
	this.engine = null;
	this.selectionManager = null;
	this.uid = 0;
	this.targetSelection = false;
	
	this.selectionMaterial = null;
	
	emmiter.on('DELETE_SELECTED_MESH', this.deleteSelectedMesh.bind(this));
	emmiter.on('CLONE_MESH', this.cloneMesh.bind(this));
	emmiter.on('EXECUTE_CO', this.executeCo.bind(this));
	emmiter.on('CHANGE_VIEW', this.setView.bind(this));
	emmiter.on('MESH_CREATE_BOX', this.createBox.bind(this));
	emmiter.on('MESH_CREATE_CYLINDER', this.createCylinder.bind(this));
	emmiter.on('MESH_CREATE_SPHERE', this.createSphere.bind(this));
	emmiter.on('MESH_CREATE_PLANE', this.createPlane.bind(this));
	emmiter.on('MESH_CREATE_LINE', this.createLine.bind(this));
	emmiter.on('APPLY_TRANSFORMATION_TO_SELECTION', this.applyTransformationToSelection.bind(this));
	emmiter.on('MESH_CHANGE_VISIBILITY', this.changeMeshVisibility.bind(this));
	emmiter.on('MESH_SET_WIREFRAME', this.setWireframe.bind(this));
	emmiter.on('MESH_IMPORT', this.importMesh.bind(this));
	emmiter.on('MESH_HIDE_ALL', this.hideAll.bind(this));
	emmiter.on('MESH_SHOW_ALL', this.showAll.bind(this));
	emmiter.on('MESH_WIREFRAME_ALL', this.wireframeAll.bind(this));
	emmiter.on('SCENE_CLEAR', this.clearScene.bind(this));
	emmiter.on('MESH_MIRROR', this.mirrorMesh.bind(this));
	emmiter.on('MESH_HIDE_UNSELECTED', this.hideUnselected.bind(this));
}

SceneManager.prototype.instance = function()
{
	if(this.__instance == null)
	{
		this.__instance = new SceneManager();
	}
	return this.__instance;
};

SceneManager.prototype.create3DScene = function()
{
	this.canvas = document.getElementById("renderCanvas");
	this.canvas.style.width = '100%';
	this.canvas.style.height = '100%';
	
	this.engine = new BABYLON.Engine(this.canvas, true);
			
	this.scene = new BABYLON.Scene(this.engine);
	
	this.selectionMaterial = new BABYLON.StandardMaterial("SelectionMaterial", this.scene);
	this.selectionMaterial.backFaceCulling = false;
	this.selectionMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
	this.selectionMaterial.alpha = .3;
	
	this.camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 0, new BABYLON.Vector3(0, 0, 0), this.scene);
	this.camera.setPosition(new BABYLON.Vector3(0, 50, -50));
	this.camera.inertia = 0;
	this.camera.setTarget(BABYLON.Vector3.Zero());
	this.camera.upperBetaLimit = 2 * Math.PI;
	this.camera.attachControl(this.canvas, false);

	var lightUp = new BABYLON.HemisphericLight("Up", new BABYLON.Vector3(0, -100, 0), this.scene);
	lightUp.intensity = .4;
	var lightDown = new BABYLON.HemisphericLight("Down", new BABYLON.Vector3(0, 100, 0), this.scene);
	lightDown.intensity = .4;
	var left = new BABYLON.HemisphericLight("Left", new BABYLON.Vector3(-100, 0, 0), this.scene);
	left.intensity = .4;
	var right = new BABYLON.HemisphericLight("Right", new BABYLON.Vector3(100, 0, 0), this.scene);
	right.intensity = .4;
	var front = new BABYLON.HemisphericLight("Front", new BABYLON.Vector3(0, 0, 100), this.scene);
	front.intensity = .4;
	var back = new BABYLON.HemisphericLight("Back", new BABYLON.Vector3(0, 0, -100), this.scene);
	back.intensity = .4;

	// Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
	var ground = BABYLON.Mesh.CreateGround("Grid", 20, 20, 20, this.scene);
	ground.material = new BABYLON.StandardMaterial("GridMaterial", this.scene);
	ground.material.wireframe = true;
	ground.material.backFaceCulling = false;
	ground.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
	ground.isPickable = false;
	ground.data = {uid: -1};
	this.selectionManager = new SelectionManager(this);
	this.selectionManager.initSceneSelection(this);
	
	
	this.engine.runRenderLoop(this.renderFrames.bind(this));
	
	
	
	return this.scene;
};

SceneManager.prototype.renderFrames = function()
{
	this.scene.render();
	this.canvas.style.width = '100%';
	this.canvas.style.height = '100%';
	this.engine.resize();
	this.camera.update();
	
	if(this.selectionManager.lastPickedMesh != null && this.selectionManager.lastPickedMesh.visibility == true)
	{
		if(this.selectionManager.editControl == null && this.selectionManager.transform != '')
		{
			var EditControl = org.ssatguru.babylonjs.component.EditControl;
			this.selectionManager.editControl = new EditControl(this.selectionManager.lastPickedMesh, this.camera, this.canvas, 0.75, true);
			this.selectionManager.editControl.enableTranslation(3.14/18);
			this.selectionManager.editControl.enableTranslation(3.14/18);
			this.selectionManager.editControl.setRotSnapValue(3.14 / 18);
			this.selectionManager.editControl.setScaleSnapValue(.5);
			this.selectionManager.editControl.setTransSnapValue(.1);
			this.selectionManager.editControl.setLocal(false);
			this.selectionManager.bindEditControlActionListeners();
		}
		
		if(this.selectionManager.transform == '')
		{
			if(this.selectionManager.editControl != null)
			{
				this.selectionManager.editControl.removeAllActionListeners();
				this.selectionManager.editControl.detach();
				this.selectionManager.editControl = null;
			}
		}
		
		if(this.selectionManager.transform == 't')
		{
			this.selectionManager.editControl.enableTranslation();
		}
		if(this.selectionManager.transform == 'r')
		{
			this.selectionManager.editControl.enableRotation();
		}
		if(this.selectionManager.transform == 's')
		{
			this.selectionManager.editControl.enableScaling();
		}
	}
	else
	{
		if(this.selectionManager.editControl != null)
		{
			this.selectionManager.editControl.removeAllActionListeners();
			this.selectionManager.editControl.detach();
			this.selectionManager.editControl = null;
		}
	}
};

SceneManager.prototype.deleteSelectedMesh = function()
{
	this.removeMesh(this.selectionManager.lastPickedMesh);
}

SceneManager.prototype.removeMesh = function(mesh)
{
	this.selectionManager.removeEditControl();
	this.scene.removeMesh(mesh);
	this.selectionManager.lastPickedMesh = null;
	emmiter.emit('UI_REMOVE_MESH_FROM_TREE', mesh.name);
	
};

SceneManager.prototype.cloneMesh = function()
{
	var uid = this.getNextUid();
	if(this.selectionManager.lastPickedMesh == null)
	{
		Ext.MessageBox.alert('Clone Operation', 'Please select an object !');
	}
	var clone = this.selectionManager.lastPickedMesh.clone('Clone-' + this.selectionManager.lastPickedMesh.name + uid);
	clone.material = new BABYLON.StandardMaterial("mat", this.scene);
	clone.material = this.selectionManager.lastPickedMesh.data.originalMaterial.clone('OMaterial');
	clone.data = {type: 'sceneObject', uid: uid, visible: true, originalMaterial: clone.material, selectionMaterial: this.selectionMaterial.clone()};
	this.enableEdgeMode(clone);
	emmiter.emit('UI_ADD_MESH_TO_TREE', clone);
	
	return clone;
};

SceneManager.prototype.executeCo = function(operationType, deleteObjs)
{
	console.log('Compoud Objects Create');										
	var firstCsg = BABYLON.CSG.FromMesh(this.selectionManager.coFirst);
	var secondCsg = BABYLON.CSG.FromMesh(this.selectionManager.coSecond);
	var csg = null;
	
	if(operationType == 'union')
	{
		csg = firstCsg.union(secondCsg);
	}
	else if(operationType == 'intersect')
	{
		csg = firstCsg.intersect(secondCsg);
	}
	else if('sub')
	{
		csg = firstCsg.subtract(secondCsg);
	}
	
	var material = new BABYLON.StandardMaterial("mat", this.scene);
	material.backFaceCulling = false;
	material.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
	var result = csg.toMesh(this.selectionManager.coFirst.name + "*" + this.selectionManager.coSecond.name + this.getNextUid(), material, this.scene, true);
	result.data = {type: 'sceneObject', uid: this.getNextUid(), isCo: true, visible: true, selectionMaterial: this.selectionMaterial.clone(), originalMaterial: result.material};
	var positions = result.getVerticesData(BABYLON.VertexBuffer.PositionKind);
	var indices = result.getIndices();
	var normals = result.getVerticesData(BABYLON.VertexBuffer.NormalKind);
	BABYLON.VertexData.ComputeNormals(positions, indices, normals);
	result.updateVerticesData(BABYLON.VertexBuffer.NormalKind, normals, true, true);
	
	this.enableEdgeMode(result);
	
	emmiter.emit('UI_ADD_MESH_TO_TREE', result);
	
	if(deleteObjs)
	{
		this.removeMesh(this.selectionManager.coFirst);
		this.removeMesh(this.selectionManager.coSecond);
	}
	this.selectionManager.coFirst = null;
	this.selectionManager.coSecond = null;
	this.selectionManager.compoundObjectsMode = false;
	emmiter.emit('UI_CO_RESET');
};

SceneManager.prototype.setView = function(view)
{
	this.camera.setTarget(BABYLON.Vector3.Zero());
	if(view == 'FRONT')
	{
		this.camera.setPosition(new BABYLON.Vector3(0, 0, -50));
	}
	else if(view == 'BACK')
	{
		this.camera.setPosition(new BABYLON.Vector3(0, 0, 50));
	}
	else if(view == 'LEFT')
	{
		this.camera.setPosition(new BABYLON.Vector3(-50, 0, 0));
	}
	else if(view == 'RIGHT')
	{
		this.camera.setPosition(new BABYLON.Vector3(50, 0, 0));
	}
	else if(view == 'TOP')
	{
		this.camera.setPosition(new BABYLON.Vector3(0, 50, 0));
	}
	else if(view == 'BOTTOM')
	{
		this.camera.alpha = 0;
		this.camera.beta = Math.PI / 2;
	}
};

SceneManager.prototype.getNextUid = function()
{
	this.uid ++;
	return this.uid;
};

SceneManager.prototype.createBox = function(width, height, depth)
{
	var uid = this.getNextUid();
	var options = {
		width: width,
		height: height,
		depth: depth,
		updatable: false,
		sideOrientation: BABYLON.Mesh.DOUBLESIDE
	};
	var box = BABYLON.MeshBuilder.CreateBox('Box' + uid, options, this.scene);
	console.log(box.uniqueId);
	box.material = new BABYLON.StandardMaterial("boxMat", this.scene);
	box.material.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
	box.material.backFaceCulling = false;
	
	this.enableEdgeMode(box);
	
	box.data = {type: 'sceneObject', uid: uid, visible: true, originalMaterial: box.material, selectionMaterial: this.selectionMaterial.clone()};
	emmiter.emit('UI_ADD_MESH_TO_TREE', box);
};

SceneManager.prototype.createCylinder = function(height, topDiameter, bottomDiameter, tesselation)
{
	var uid = this.getNextUid();
	
	var cylinder = BABYLON.Mesh.CreateCylinder("Cylinder" + uid, height, topDiameter, bottomDiameter, tesselation, 10, this.scene, true, BABYLON.Mesh.DOUBLESIDE);
	cylinder.material = new BABYLON.StandardMaterial("cylinderMat", this.scene);
	cylinder.material.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
	cylinder.material.backFaceCulling = false;
	cylinder.data = {type: 'sceneObject', uid: uid, visible: true, originalMaterial: cylinder.material, selectionMaterial: this.selectionMaterial.clone()};
	
	this.enableEdgeMode(cylinder);
	
	emmiter.emit('UI_ADD_MESH_TO_TREE', cylinder);
};

SceneManager.prototype.createSphere = function(diameter, segments)
{
	var uid = this.getNextUid();
	
	var mesh = BABYLON.Mesh.CreateSphere("Sphere" + uid, segments, diameter, this.scene, true, BABYLON.Mesh.DOUBLESIDE);
	mesh.material = new BABYLON.StandardMaterial("SphereMat", this.scene);
	mesh.material.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
	mesh.material.backFaceCulling = false;
	mesh.data = {type: 'sceneObject', uid: uid, visible: true, originalMaterial: mesh.material, selectionMaterial: this.selectionMaterial.clone()};
	
	this.enableEdgeMode(mesh);
	
	emmiter.emit('UI_ADD_MESH_TO_TREE', mesh);
};

SceneManager.prototype.createPlane = function(width, height, subdivisions)
{
	var uid = this.getNextUid();
	
	var options = {
		width: width,
		height: height,
		subdivisions: subdivisions,
		updatable: true
	};
	
	var mesh = BABYLON.MeshBuilder.CreateGround("Plane" + uid, options, this.scene);
	mesh.material = new BABYLON.StandardMaterial("PlaneMat", this.scene);
	mesh.material.backFaceCulling = false;
	mesh.material.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
	mesh.data = {type: 'sceneObject', uid: uid, visible: true, originalMaterial: mesh.material, selectionMaterial: this.selectionMaterial.clone()};
	
	this.enableEdgeMode(mesh);

	emmiter.emit('UI_ADD_MESH_TO_TREE', mesh);
};

SceneManager.prototype.createLine = function(x1, y1, z1, x2, y2, z2)
{
	var uid = this.getNextUid();
	
	var options = {
		points: [new BABYLON.Vector3(x1, y1, z1), new BABYLON.Vector3(x2, y2, z2)]
	};
	var line = BABYLON.MeshBuilder.CreateLines('Line' + uid, options, this.scene);
	line.material = new BABYLON.StandardMaterial("boxMat", this.scene);
	line.material.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
	line.data = {type: 'sceneObject', uid: uid, visible: true, originalMaterial: line.material, selectionMaterial: this.selectionMaterial.clone()};

	emmiter.emit('UI_ADD_MESH_TO_TREE', line);
};

SceneManager.prototype.applyTransformationToSelection = function(x, y, z, xr, yr, zr)
{
	this.selectionManager.lastPickedMesh.position.x = x;
	this.selectionManager.lastPickedMesh.position.y = y;
	this.selectionManager.lastPickedMesh.position.z = z;

	this.selectionManager.lastPickedMesh.rotation.x = xr * (Math.PI / 180);
	this.selectionManager.lastPickedMesh.rotation.y = yr * (Math.PI / 180);
	this.selectionManager.lastPickedMesh.rotation.z = zr * (Math.PI / 180);
};

SceneManager.prototype.enableEdgeMode = function(mesh)
{
	mesh.enableEdgesRendering(.9999999999);
	var vectors = mesh.getBoundingInfo().boundingBox.vectors; 
	var width = Number(vectors[1].x - vectors[0].x);
	var heigh = Number(vectors[1].y - vectors[0].y);
	var depth = Number(vectors[1].z - vectors[0].z);
	if((width + heigh + depth) / 3> 10)
	{
		mesh.edgesWidth = 5.0;
	}
	else if(width > 5)
	{
		mesh.edgesWidth = 2.0;
	}
	else
	{
		mesh.edgesWidth = 0.5;
	}
	
	mesh.edgesColor = new BABYLON.Color4(1, 1, 1, 1);
};

SceneManager.prototype.disableEdgeMode = function(mesh)
{
	mesh.disableEdgesRendering();
};

SceneManager.prototype.changeMeshVisibility = function(mesh, visibility)
{
	this.selectionManager.removeEditControl();
	mesh.visibility = visibility;
	if(mesh.name != 'Grid')
	{
		mesh.isPickable = visibility;
	}
};

SceneManager.prototype.setWireframe = function(mesh, wireframe)
{
	console.log('SceneManager.prototype.setWireframe');
	if(wireframe == true)
	{
		this.disableEdgeMode(mesh);
	}
	mesh.material.wireframe = wireframe;
};

SceneManager.prototype.importMesh = function()
{
	var uid = this.getNextUid();
	console.log('SceneManager.prototype.importMesh');
	var assetsManager = new BABYLON.AssetsManager(this.scene);
	var meshTask = assetsManager.addMeshTask("obj task", "", "assets/", "wind_old_windmill.obj");
	
	var selectionMaterial = this.selectionMaterial;
	var scene = this.scene;
	var enableEdgeMode = this.enableEdgeMode;
	var camera = this.camera;
	var meshes = [];
	
	meshTask.onSuccess = function (task)
	{
		var root = new BABYLON.AbstractMesh('root', scene);
		console.log('onSuccess');
		console.log('Loaded meshes number: ' + task.loadedMeshes.length);
		var loadedMeshes = task.loadedMeshes;
		for(var i=0; i<loadedMeshes.length; i++)
		{
			var mesh = loadedMeshes[i];
			mesh.computeWorldMatrix(true);
			mesh.setPivotPoint(mesh.getBoundingInfo().boundingBox.center);
			enableEdgeMode(mesh);
			mesh.name = mesh.name + uid;
			mesh.data = {type: 'sceneObject', uid: uid++, visible: true, originalMaterial: mesh.material, selectionMaterial: selectionMaterial.clone()};
			mesh.parent = root;
			meshes.push(mesh);
		}
		
		var totalBoundingInfo = function(meshes)
		{
			var boundingInfo = meshes[0].getBoundingInfo();
			var min = boundingInfo.minimum.add(meshes[0].position);
			var max = boundingInfo.maximum.add(meshes[0].position);
			for(var i=1; i<meshes.length; i++){
				boundingInfo = meshes[i].getBoundingInfo();
				min = BABYLON.Vector3.Minimize(min, boundingInfo.minimum.add(meshes[i].position));
				max = BABYLON.Vector3.Maximize(max, boundingInfo.maximum.add(meshes[i].position));
			}
			return new BABYLON.BoundingInfo(min, max);
		}
		
		var bboxInfo = totalBoundingInfo(root.getChildren());
		bboxInfo.update(root._worldMatrix);
		var vectors = bboxInfo.boundingBox.vectors; 
		var width = Number(vectors[1].x - vectors[0].x);
		var heigh = Number(vectors[1].y - vectors[0].y);
		var depth = Number(vectors[1].z - vectors[0].z);
		root.position = new BABYLON.Vector3(0, 0, 0);
		console.log(root.position);
		var max = width;
		if(max > heigh)
		{
			max = heigh;
		}
		if(depth > max)
		{
			max = depth
		}
		
		camera.radius = 2 * max;
		console.log('Root width: ' + width);
		console.log('Root heigh: ' + heigh);
		console.log('Root depth: ' + depth);
		console.log(bboxInfo.boundingBox.centerWorld);
		camera.setTarget(new BABYLON.Vector3(bboxInfo.boundingBox.center.x / 2, bboxInfo.boundingBox.center.y / 2, bboxInfo.boundingBox.center.z / 2));
		
		emmiter.emit('UI_ADD_MESHES_TO_TREE', meshes);
	}
	
	assetsManager.onFinish = function()
	{	
		console.log('onFinish');
		
		console.log('finished');
    };
	assetsManager.load();
};

SceneManager.prototype.hideAll = function()
{
	console.log('SceneManager.prototype.hideAll');
	var meshes = this.scene.meshes;
	for(var i=0; i<meshes.length; i++)
	{
		var mesh = meshes[i];
		if(mesh.name != 'Grid')
		{
			mesh.visibility = false;
			mesh.isPickable = false;
		}
	}
	emmiter.emit('UI_REFRESH_TREE');
};

SceneManager.prototype.showAll = function()
{
	console.log('SceneManager.prototype.showAll');
	var meshes = this.scene.meshes;
	for(var i=0; i<meshes.length; i++)
	{
		var mesh = meshes[i];
		mesh.visibility = true;
		if(mesh.name != 'Grid')
		{
			mesh.isPickable = true;
		}
	}
	emmiter.emit('UI_REFRESH_TREE');
};

SceneManager.prototype.hideUnselected = function()
{
	console.log('SceneManager.prototype.hideUnselected');
	this.hideAll();
	this.selectionManager.lastPickedMesh.visibility = true;
	this.selectionManager.lastPickedMesh.isPickable = true;
	emmiter.emit('UI_REFRESH_TREE');
};

SceneManager.prototype.wireframeAll = function(value)
{
	console.log('SceneManager.prototype.wireframeAll');
	var meshes = this.scene.meshes;
	for(var i=0; i<meshes.length; i++)
	{
		var mesh = meshes[i];
		if(mesh.name != 'Grid' && mesh.data != undefined)
		{
			if(value == true)
			{
				mesh.disableEdgesRendering();
			}
			else
			{
				this.enableEdgeMode(mesh);
			}
			if(mesh.data.originalMaterial == undefined && mesh.material != undefined)	
			{
				mesh.data.originalMaterial = mesh.material.clone();
				mesh.data.originalMaterial.backFaceCulling = false;
				mesh.material.wireframe = value;
				mesh.data.originalMaterial.wireframe = value;
				mesh.data.selectionMaterial.wireframe = value;
			}
			else if(mesh.material != undefined)
			{
				mesh.material.wireframe = value;
				mesh.data.originalMaterial.wireframe = value;
				mesh.data.selectionMaterial.wireframe = value;
			}
		}
	}
	emmiter.emit('UI_REFRESH_TREE');
};

SceneManager.prototype.clearScene = function(value)
{
	console.log('SceneManager.prototype.clearScene');
	var meshes = this.scene.meshes;
	console.log(meshes.length + ' to remove !');
	this.selectionManager.removeEditControl();
	this.selectionManager.lastPickedMesh = null;
	for(var i=meshes.length - 1; i>=0; i--)
	{
		var mesh = meshes[i];
		if(mesh != undefined)
		{
			var children = mesh.getChildren();
			console.log('Mesh children count: ' + mesh.getChildren().length);
			for(var j=children.length - 1; j>=0; j--)
			{
				if(children[j] != undefined)
				{
					emmiter.emit('UI_REMOVE_MESH_FROM_TREE', children[j].name);
					children[j].dispose();
				}
			}
			if(mesh.name != 'Grid')
			{
				console.log('Removing: ' + mesh.name);
				emmiter.emit('UI_REMOVE_MESH_FROM_TREE', mesh.name);
				mesh.dispose();
			}
		}
	}
};

SceneManager.prototype.mirrorMesh = function(axe)
{
	console.log('SceneManager.prototype.mirrorMesh');
	var clone = this.cloneMesh();
	clone.material.backFaceCulling = false;
	clone.data.originalMaterial.backFaceCulling = false;
	if(axe == 'x')
	{
		clone.scaling.x = -clone.scaling.x;
	}
	if(axe == 'y')
	{
		clone.scaling.y = -clone.scaling.y;
	}
	if(axe == 'z')
	{
		clone.scaling.z = -clone.scaling.z;
	}
};

