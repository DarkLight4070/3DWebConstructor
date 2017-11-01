function UiManager(__sceneManager)
{
	this.sceneManager = __sceneManager;
	emmiter.on('UI_UPDATE_SELECTION', this.updateUiSelection.bind(this));
	emmiter.on('UI_ADD_MESH_TO_TREE', this.addMeshToTree.bind(this));
	emmiter.on('UI_REMOVE_MESH_FROM_TREE', this.removeMeshFromTree.bind(this));
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

UiManager.prototype.createBoxPrefabUi = function(__container)
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
			emmiter.emit('MESH_CREATE_BOX', width, height, depth);
	};
};

UiManager.prototype.createCylinderPrefabUi = function(__container)
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
		emmiter.emit('MESH_CREATE_CYLINDER', height, topDiameter, bottomDiameter, tesselation);
	};
};

UiManager.prototype.createSpherePrefabUi = function(__container)
{
	var diameterField = UI_CreateNumberField('Diameter', 'diameterId', 1);
	var segmentsField = UI_CreateNumberField('Segments', 'segmentsId', 10);

	__container.add(diameterField);
	__container.add(segmentsField);

	prefabCreationFunction = function()
	{
		var diameter = diameterField.getValue();
		var segments = segmentsField.getValue();
		emmiter.emit('MESH_CREATE_SPHERE', diameter, segments);
		
	};
}

UiManager.prototype.createPlanePrefabUi = function(__container)
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
		emmiter.emit('MESH_CREATE_PLANE', width, height, subdivisions);
	};
};

UiManager.prototype.createLinePrefabUi = function(__container)
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
		emmiter.emit('MESH_CREATE_LINE', x1, y1, z1, x2, y2, z2);
	};
};

UiManager.prototype.buildPrefabEntriesUi = function(__prefabType)
{
	var fieldSet = Ext.getCmp('prefabParamsFieldSet');
	fieldSet.removeAll(true);
	if(__prefabType == 'Box')
	{
		this.createBoxPrefabUi(fieldSet);
	}
	else if(__prefabType == 'Line')
	{
		this.createLinePrefabUi(fieldSet);
	}
	else if(__prefabType == 'Cylinder')
	{
		this.createCylinderPrefabUi(fieldSet);
	}
	else if(__prefabType == 'Sphere')
	{
		this.createSpherePrefabUi(fieldSet);
	}
	else if(__prefabType == 'Plane')
	{
		this.createPlanePrefabUi(fieldSet);
	}
};

UiManager.prototype.updateRootTreeUi = function()
{
	var sceneDataModel = this.parseScene(this.sceneManager.scene);

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

UiManager.prototype.addMeshToTree = function(mesh)
{
	var mainTree = Ext.getCmp('mainTree');
	var root = mainTree.getRootNode();
	var meshesNode = root.findChild('text', 'Meshes');
	meshesNode.appendChild({text: mesh.name, leaf: true, object: mesh, uid: mesh.data.uid});
}

UiManager.prototype.removeMeshFromTree = function(meshId)
{
	var mainTree = Ext.getCmp('mainTree');
	var root = mainTree.getRootNode();
	var meshesNode = root.findChild('text', 'Meshes');
	var toRemove = meshesNode.findChild('text', meshId);
	if(toRemove != null)
	{
		meshesNode.removeChild(toRemove);
	}
}

UiManager.prototype.parseScene = function()
{
	var sceneStructure = {lights: [], cameras: [], meshes: []};

	var cameras = this.sceneManager.scene.cameras;
	var lights = this.sceneManager.scene.lights;
	var meshes = this.sceneManager.scene.meshes;
	
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