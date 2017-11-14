function UiManager(__sceneManager)
{
	this.sceneManager = __sceneManager;
	emmiter.on('UI_UPDATE_SELECTION', this.updateUiSelection.bind(this));
	emmiter.on('UI_ADD_MESH_TO_TREE', this.addMeshToTree.bind(this));
	emmiter.on('UI_ADD_MESHES_TO_TREE', this.addMeshesToTree.bind(this));
	emmiter.on('UI_REMOVE_MESH_FROM_TREE', this.removeMeshFromTree.bind(this));
	emmiter.on('UI_UPDATE_MESH_PROPERTIES_FROM_SELECTION', this.updateMeshPropertiesUiFromSelection.bind(this));
	emmiter.on('UI_CO_SET_FIRST', this.setCoFirst.bind(this));
	emmiter.on('UI_CO_SET_SECOND', this.setCoSecond.bind(this));
	emmiter.on('UI_CO_RESET', this.resetCoUi.bind(this));
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
	var rootNode = 
	{
		name: 'Scene',
		text: 'Scene',
		icon: 'icons/scene.png',
		expanded: true,
		leaf: false,
		children: 
		[
		]
	};

	var meshes = 
	{
		text: 'Meshes',
		icon: 'icons/mesh_node.png',
		leaf: false,
		expanded: true,
		children:
		[]
	};

	var cameras = {
		text: 'Cameras',
		expanded: true,
		icon: 'icons/cameras.png',
		leaf: false,
		children:
		[]
	};

	var lights = 
	{
		text: 'Lights',
		expanded: true,
		icon: 'icons/lights.png',
		leaf: false,
		children:
		[]
	};

	for(var i = 0; i < sceneDataModel.meshes.length; i++)
	{
		meshes.children.push({text: sceneDataModel.meshes[i].id, icon: 'icons/mesh.png', leaf: true, object: sceneDataModel.meshes[i], uid: sceneDataModel.meshes[i].data.uid, visible: true});
	}

	for(var i = 0; i < sceneDataModel.cameras.length; i++)
	{
		cameras.children.push({text: sceneDataModel.cameras[i].id, icon: 'icons/camera.png', leaf: true, object: sceneDataModel.cameras[i]});
	}

	for(var i = 0; i < sceneDataModel.lights.length; i++)
	{
		lights.children.push({text: sceneDataModel.lights[i].id, icon: 'icons/light.png', leaf: true, object: sceneDataModel.lights[i]});
	}

	mainTree.setRootNode(rootNode);
	var root = mainTree.getRootNode();
	root.appendChild(cameras);
	root.appendChild(lights);
	root.appendChild(meshes);
};

UiManager.prototype.addMeshToTree = function(mesh)
{
	console.log('UiManager.prototype.addMeshToTree');
	var mainTree = Ext.getCmp('mainTree');
	var root = mainTree.getRootNode();
	var meshesNode = root.findChild('text', 'Meshes');
	var icon = 'icons/mesh.png';
	if(mesh.data.isCo == true)
	{
		icon = 'icons/co_mesh.png';
	}
	console.log(mesh);
	console.log(mesh.data);
	console.log(mesh.data.uid);
	console.log(mesh.data.visible);
	meshesNode.appendChild({text: mesh.name, icon: icon, leaf: true, object: mesh, uid: mesh.data.uid, visible: mesh.data.visible});
}

UiManager.prototype.addMeshesToTree = function(meshes)
{
	console.log('UiManager.prototype.addMeshesToTree');
	var mainTree = Ext.getCmp('mainTree');
	var root = mainTree.getRootNode();
	var meshesNode = root.findChild('text', 'Meshes');
	var nodes = [];
	for(var i=0; i<meshes.length; i++)
	{
		var mesh = meshes[i];
		var icon = 'icons/mesh.png';
		if(mesh.data.isCo == true)
		{
			icon = 'icons/co_mesh.png';
		}
		console.log('mesh.name: ' + mesh.name);
		console.log('icon: ' + icon);
		console.log('object: ' + mesh);
		console.log('uid: ' + mesh.data.uid);
		console.log('mesh.data.visible: ' + mesh.data.visible);
		nodes.push({text: mesh.name, icon: icon, leaf: true, object: mesh, uid: mesh.data.uid, visible: mesh.data.visible});
	}
	console.log(nodes);
	meshesNode.appendChild(nodes);
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
};

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
};

UiManager.prototype.updateMeshPropertiesUiFromSelection = function(mesh)
{
	if(mesh == null)
	{
		Ext.getCmp('pXId').reset();
		Ext.getCmp('pYId').reset();
		Ext.getCmp('pZId').reset();
		Ext.getCmp('pRXId').reset();
		Ext.getCmp('pRYId').reset();
		Ext.getCmp('pRZId').reset();
	}
	else
	{
		Ext.getCmp('pXId').setValue(mesh.position.x);
		Ext.getCmp('pYId').setValue(mesh.position.y);
		Ext.getCmp('pZId').setValue(mesh.position.z);

		Ext.getCmp('pRXId').setValue(mesh.rotation.x * (180 / Math.PI));
		Ext.getCmp('pRYId').setValue(mesh.rotation.y * (180 / Math.PI));
		Ext.getCmp('pRZId').setValue(mesh.rotation.z * (180 / Math.PI));
	}
};

UiManager.prototype.setCoFirst = function(meshName)
{
	if(meshName == null)
	{
		Ext.MessageBox.alert('Compound Objects', 'Please select an object !');
		Ext.getCmp('enableCOModeButtonId').toggle(false, true);
	}
	else
	{
		Ext.getCmp('firstObjectId').setValue(meshName);
		Ext.getCmp('toolsTabPanelId').setActiveTab(Ext.getCmp('coTabId'));
	}
};

UiManager.prototype.setCoSecond = function(meshName)
{
	Ext.getCmp('secondObjectId').setValue(meshName);
};

UiManager.prototype.resetCoUi = function()
{
	Ext.getCmp('firstObjectId').reset();
	Ext.getCmp('secondObjectId').reset();
	Ext.getCmp('coTypeId').reset();
	Ext.getCmp('coDeleteObjectsId').reset();
	Ext.getCmp('enableCOModeButtonId').toggle(false, true);
};
