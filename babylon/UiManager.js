function UiManager(__scene)
{
	this.scene = __scene;
	emmiter.on('UI_UPDATE_SELECTION', this.updateUiSelection.bind(this));
	this.uid = 0;
}

UiManager.prototype.updateUiSelection = function(uid)
{
	var mainTree = Ext.getCmp('mainTree');
	if(uid == null)
	{
		mainTree.getSelectionModel().deselectAll();
	}
	var rootNode = mainTree.getRootNode();
	var node = rootNode.findChild('text', uid, true);
	if(node != null)
	{
		console.log('Mesh found in tree' + node);
		mainTree.getSelectionModel().select(node);
	}
}

UiManager.prototype.createBoxPrefabUi = function(__container, uid)
{
	var widthField = UI_CreateNumberField('Width', 'widthId', 1);
	var heightField = UI_CreateNumberField('Height', 'heightId', 1);
	var depthField = UI_CreateNumberField('Depth', 'depthId', 1);

	__container.add(widthField);
	__container.add(heightField);
	__container.add(depthField);
	prefabCreationFunction = function()
	{
		var width = widthField.getValue();
		var height = heightField.getValue();
		var depth = depthField.getValue();

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
		updateMeshSpacialAttributesFromUi(box);
		box.data = {type: 'sceneObject', uid: uid};
		console.log('Creation UID: ' + uid);

		var mainTree = Ext.getCmp('mainTree');
		var rootNode = mainTree.getRootNode();
		var meshesNode = rootNode.findChild('text', 'Meshes');
		meshesNode.appendChild({text: box.id, leaf: true, object: box, uid: box.data.uid});
	};
};

UiManager.prototype.createCylinderPrefabUi = function(__container, uid)
{
	var heightField = UI_CreateNumberField('Height', 'heightId', 1);
	var topDiameterField = UI_CreateNumberField('Top Diameter', 'topDiameterId', 1);
	var bottomDiameterField = UI_CreateNumberField('Bottom Diameter', 'bottomDiameterId', 1);
	var tesselationField = UI_CreateNumberField('Tesselation', 'tesselationId', 10);

	__container.add(heightField);
	__container.add(topDiameterField);
	__container.add(bottomDiameterField);
	__container.add(tesselationField);
	prefabCreationFunction = function()
	{
		var height = heightField.getValue();
		var topDiameter = topDiameterField.getValue();
		var bottomDiameter = bottomDiameterField.getValue();
		var tesselation = tesselationField.getValue();

	  	//name, height, diameterTop, diameterBottom, tessellation, subdivisions, scene, updatable, sideOrientation
		var cylinder = BABYLON.Mesh.CreateCylinder("Cylinder" + uid, height, topDiameter, bottomDiameter, tesselation, 10, this.scene, true, BABYLON.Mesh.DOUBLESIDE);
		cylinder.material = new BABYLON.StandardMaterial("cylinderMat", this.scene);
		cylinder.material.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
		cylinder.material.backFaceCulling = false;
		cylinder.data = {type: 'sceneObject', uid: uid};
		updateMeshSpacialAttributesFromUi(cylinder);

		var mainTree = Ext.getCmp('mainTree');
		var rootNode = mainTree.getRootNode();
		var meshesNode = rootNode.findChild('text', 'Meshes');
		meshesNode.appendChild({text: cylinder.id, leaf: true, object: cylinder, uid: cylinder.data.uid});
	};
};

UiManager.prototype.createSpherePrefabUi = function(__container, uid)
{
	var diameterField = UI_CreateNumberField('Diameter', 'diameterId', 1);
	var segmentsField = UI_CreateNumberField('Segments', 'segmentsId', 10);

	__container.add(diameterField);
	__container.add(segmentsField);

	prefabCreationFunction = function()
	{
		var diameter = diameterField.getValue();
		var segments = segmentsField.getValue();

	  	//CreateSphere(name, segments, diameter, scene, updatable, sideOrientation)
		var mesh = BABYLON.Mesh.CreateSphere("Sphere" + uid, segments, diameter, this.scene, true, BABYLON.Mesh.DOUBLESIDE);
		mesh.material = new BABYLON.StandardMaterial("SphereMat", this.scene);
		mesh.material.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
		mesh.material.backFaceCulling = false;
		mesh.data = {type: 'sceneObject', uid: uid};
		updateMeshSpacialAttributesFromUi(mesh);

		var mainTree = Ext.getCmp('mainTree');
		var rootNode = mainTree.getRootNode();
		var meshesNode = rootNode.findChild('text', 'Meshes');
		meshesNode.appendChild({text: mesh.id, leaf: true, object: mesh, uid: mesh.data.uid});
	};
}

UiManager.prototype.createPlanePrefabUi = function(__container, uid)
{
	var widthField = UI_CreateNumberField('Width', 'widthId', 1);
	var heightField = UI_CreateNumberField('Height', 'heightId', 1);
	var subdivisionsField = UI_CreateNumberField('Subdivisions', 'subdivisionsId', 2);

	__container.add(widthField);
	__container.add(heightField);
	__container.add(subdivisionsField);

	prefabCreationFunction = function()
	{
		var width = widthField.getValue();
		var height = heightField.getValue();
		var subdivisions = subdivisionsField.getValue();

		var options = {
		    width: width,
		    height: height,
		    subdivisions: subdivisions,
		    updatable: true
	  	};

	  	//CreatePlane(name, options, scene)
		var mesh = BABYLON.MeshBuilder.CreateGround("Plane" + uid, options, this.scene);
		mesh.material = new BABYLON.StandardMaterial("PlaneMat", this.scene);
		mesh.material.backFaceCulling = false;
		mesh.material.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
		mesh.data = {type: 'sceneObject', uid: uid};
		
		updateMeshSpacialAttributesFromUi(mesh);

		var mainTree = Ext.getCmp('mainTree');
		var rootNode = mainTree.getRootNode();
		var meshesNode = rootNode.findChild('text', 'Meshes');
		meshesNode.appendChild({text: mesh.id, leaf: true, object: mesh, uid: mesh.data.uid});
	};
};

UiManager.prototype.createLinePrefabUi = function(__container, uid)
{
	var x1Field = UI_CreateNumberField('X1', 'x1Id', 1);
	var y1Field = UI_CreateNumberField('Y1', 'y1Id', 1);
	var z1Field = UI_CreateNumberField('Z1', 'z1Id', 1);

	var x2Field = UI_CreateNumberField('X2', 'x2Id', 2);
	var y2Field = UI_CreateNumberField('Y2', 'y2Id', 2);
	var z2Field = UI_CreateNumberField('Z2', 'z2Id', 2);

	__container.add(x1Field);
	__container.add(y1Field);
	__container.add(z1Field);

	__container.add(x2Field);
	__container.add(y2Field);
	__container.add(z2Field);
	prefabCreationFunction = function()
	{
		var x1 = x1Field.getValue();
		var y1 = y1Field.getValue();
		var z1 = z1Field.getValue();

		var x2 = x2Field.getValue();
		var y2 = y2Field.getValue();
		var z2 = z2Field.getValue();

		var options = {
		    points: [new BABYLON.Vector3(x1, y1, z1), new BABYLON.Vector3(x2, y2, z2)]
	  	};
		var line = BABYLON.MeshBuilder.CreateLines('Line' + uid, options, this.scene);
		line.material = new BABYLON.StandardMaterial("boxMat", this.scene);
		line.material.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
		line.data = {type: 'sceneObject', uid: uid};
		
		updateMeshSpacialAttributesFromUi(line);

		var mainTree = Ext.getCmp('mainTree');
		var rootNode = mainTree.getRootNode();
		var meshesNode = rootNode.findChild('text', 'Meshes');
		meshesNode.appendChild({text: line.id, leaf: true, object: line, uid: line.data.uid});
	};
};

UiManager.prototype.buildPrefabEntriesUi = function(__prefabType)
{
	var fieldSet = Ext.getCmp('prefabParamsFieldSet');
	fieldSet.removeAll(true);
	if(__prefabType == 'Box')
	{
		this.createBoxPrefabUi(fieldSet, this.uid++);
	}
	else if(__prefabType == 'Line')
	{
		this.createLinePrefabUi(fieldSet, this.uid++);
	}
	else if(__prefabType == 'Cylinder')
	{
		this.createCylinderPrefabUi(fieldSet, this.uid++);
	}
	else if(__prefabType == 'Sphere')
	{
		this.createSpherePrefabUi(fieldSet, this.uid++);
	}
	else if(__prefabType == 'Plane')
	{
		this.createPlanePrefabUi(fieldSet, this.uid++);
	}
};

UiManager.prototype.updateRootTreeUi = function()
{
	var sceneDataModel = this.parseScene(this.scene);

	var mainTree = Ext.getCmp('mainTree');
	var rootNode = {
		name: 'Scene',
		text: 'Scene',
		expanded: true,
		leaf: false,
		children: 
		[
		]
	};

	var meshes = {
		text: 'Meshes',
		leaf: false,
		expanded: true,
		children:
		[]
	};

	var cameras = {
		text: 'Cameras',
		expanded: true,
		leaf: false,
		children:
		[]
	};

	var lights = {
		text: 'lights',
		expanded: true,
		leaf: false,
		children:
		[]
	};

	for(var i = 0; i < sceneDataModel.meshes.length; i++)
	{
		meshes.children.push({text: sceneDataModel.meshes[i].id, leaf: true, object: sceneDataModel.meshes[i], uid: sceneDataModel.meshes[i].data.uid});
	}

	for(var i = 0; i < sceneDataModel.cameras.length; i++)
	{
		cameras.children.push({text: sceneDataModel.cameras[i].id, leaf: true, object: sceneDataModel.cameras[i]});
	}

	for(var i = 0; i < sceneDataModel.lights.length; i++)
	{
		lights.children.push({text: sceneDataModel.lights[i].id, leaf: true, object: sceneDataModel.lights[i]});
	}

	mainTree.setRootNode(rootNode);
	var root = mainTree.getRootNode();
	root.appendChild(cameras);
	root.appendChild(lights);
	root.appendChild(meshes);
};

UiManager.prototype.parseScene = function()
{
	var sceneStructure = {lights: [], cameras: [], meshes: []};

	var cameras = this.scene.cameras;
	var lights = this.scene.lights;
	var meshes = this.scene.meshes;
	
	for(var i = 0; i < cameras.length; i++)
	{
		sceneStructure.cameras.push(cameras[i]);
	}
	
	for(var i = 0; i < lights.length; i++)
	{
		sceneStructure.lights.push(lights[i]);
	}

	for(var i = 0; i < meshes.length; i++)
	{
		sceneStructure.meshes.push(meshes[i]);
	}

	return sceneStructure;
}