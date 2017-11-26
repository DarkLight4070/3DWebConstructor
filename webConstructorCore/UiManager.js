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
	emmiter.on('UI_ENABLE_CO_MODE', this.enableCoModeUi.bind(this));
	emmiter.on('UI_REFRESH_TREE', this.refreshTreeUi.bind(this));
	emmiter.on('UI_PREF_PAGE', this.createPrefPageUi.bind(this));
	emmiter.on('UI_ENABLE_SECTION_MODE', this.enableSectionModeUi.bind(this));
	emmiter.on('UI_MIRROR_MESH', this.mirrorMesh.bind(this));
	emmiter.on('UI_CLEAR_SCENE', this.clearScene.bind(this));
	emmiter.on('CREATE_SCENE_CONTEXT_MENU', this.createSceneContextMenu.bind(this));
	emmiter.on('UI_DELETE_SELECTED_MESH', this.deleteSelectedMesh.bind(this));
	emmiter.on('UI_RESET_PREFAB_UI', this.resetPrefabUi.bind(this));
	emmiter.on('UI_RESET_PREFAB_POS_UI', this.resetPrefabPositionUi.bind(this));
	emmiter.on('UI_INIT_PREFAB_POS_UI_FROM_SELECTION', this.initPrefabPositionUiFromSelection.bind(this));
	emmiter.on('UI_ADD_NODE', this.addNodeToTree.bind(this));
}

UiManager.prototype.UI_CreateNumberField = function(__label, __id, __defaultValue)
{
	return Ext.create('Ext.form.field.Number', {
		fieldLabel: __label,
		id: __id,
		value: __defaultValue
	});
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
	var widthField = this.UI_CreateNumberField('Width', 'widthId', 1);
	var heightField = this.UI_CreateNumberField('Height', 'heightId', 1);
	var depthField = this.UI_CreateNumberField('Depth', 'depthId', 1);
	
	__container.add(widthField);
	__container.add(heightField);
	__container.add(depthField);
	var getPrefabPositionValue = this.getPrefabPositionValue;
	var getPrefabRotationValue = this.getPrefabRotationValue;
	prefabCreationFunction = function()
	{
		var width = widthField.getValue();
		var height = heightField.getValue();
		var depth = depthField.getValue();
		var position = getPrefabPositionValue();
		var rotation = getPrefabRotationValue();
		emmiter.emit('MESH_CREATE_BOX', width, height, depth, position, rotation);
	};
};

UiManager.prototype.createCylinderPrefabUi = function(__container)
{
	var heightField = this.UI_CreateNumberField('Height', 'heightId', 1);
	var topDiameterField = this.UI_CreateNumberField('Top Diameter', 'topDiameterId', 1);
	var bottomDiameterField = this.UI_CreateNumberField('Bottom Diameter', 'bottomDiameterId', 1);
	var tesselationField = this.UI_CreateNumberField('Tesselation', 'tesselationId', 10);

	__container.add(heightField);
	__container.add(topDiameterField);
	__container.add(bottomDiameterField);
	__container.add(tesselationField);
	
	var getPrefabPositionValue = this.getPrefabPositionValue;
	var getPrefabRotationValue = this.getPrefabRotationValue;
	prefabCreationFunction = function()
	{
		var height = heightField.getValue();
		var topDiameter = topDiameterField.getValue();
		var bottomDiameter = bottomDiameterField.getValue();
		var tesselation = tesselationField.getValue();
		
		var position = getPrefabPositionValue();
		var rotation = getPrefabRotationValue();
		
		emmiter.emit('MESH_CREATE_CYLINDER', height, topDiameter, bottomDiameter, tesselation, position, rotation);
	};
};

UiManager.prototype.createSpherePrefabUi = function(__container)
{
	var diameterField = this.UI_CreateNumberField('Diameter', 'diameterId', 1);
	var segmentsField = this.UI_CreateNumberField('Segments', 'segmentsId', 10);

	__container.add(diameterField);
	__container.add(segmentsField);
	
	var getPrefabPositionValue = this.getPrefabPositionValue;
	var getPrefabRotationValue = this.getPrefabRotationValue;
	
	prefabCreationFunction = function()
	{
		var diameter = diameterField.getValue();
		var segments = segmentsField.getValue();
		
		var position = getPrefabPositionValue();
		var rotation = getPrefabRotationValue();
		
		emmiter.emit('MESH_CREATE_SPHERE', diameter, segments, position, rotation);
		
	};
}

UiManager.prototype.createPlanePrefabUi = function(__container)
{
	var widthField = this.UI_CreateNumberField('Width', 'widthId', 1);
	var heightField = this.UI_CreateNumberField('Height', 'heightId', 1);
	var subdivisionsField = this.UI_CreateNumberField('Subdivisions', 'subdivisionsId', 2);

	__container.add(widthField);
	__container.add(heightField);
	__container.add(subdivisionsField);
	
	var getPrefabPositionValue = this.getPrefabPositionValue;
	var getPrefabRotationValue = this.getPrefabRotationValue;
	
	prefabCreationFunction = function()
	{
		var width = widthField.getValue();
		var height = heightField.getValue();
		var subdivisions = subdivisionsField.getValue();
		
		var position = getPrefabPositionValue();
		var rotation = getPrefabRotationValue();
		
		emmiter.emit('MESH_CREATE_PLANE', width, height, subdivisions, position, rotation);
	};
};

UiManager.prototype.createLinePrefabUi = function(__container)
{
	var x1Field = this.UI_CreateNumberField('X1', 'x1Id', 1);
	var y1Field = this.UI_CreateNumberField('Y1', 'y1Id', 1);
	var z1Field = this.UI_CreateNumberField('Z1', 'z1Id', 1);

	var x2Field = this.UI_CreateNumberField('X2', 'x2Id', 2);
	var y2Field = this.UI_CreateNumberField('Y2', 'y2Id', 2);
	var z2Field = this.UI_CreateNumberField('Z2', 'z2Id', 2);

	__container.add(x1Field);
	__container.add(y1Field);
	__container.add(z1Field);

	__container.add(x2Field);
	__container.add(y2Field);
	__container.add(z2Field);
	
	var getPrefabPositionValue = this.getPrefabPositionValue;
	var getPrefabRotationValue = this.getPrefabRotationValue;
	
	prefabCreationFunction = function()
	{
		var x1 = x1Field.getValue();
		var y1 = y1Field.getValue();
		var z1 = z1Field.getValue();

		var x2 = x2Field.getValue();
		var y2 = y2Field.getValue();
		var z2 = z2Field.getValue();
		
		var position = getPrefabPositionValue();
		var rotation = getPrefabRotationValue();
		
		emmiter.emit('MESH_CREATE_LINE', x1, y1, z1, x2, y2, z2, position, rotation);
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
		nodes.push({text: mesh.name, icon: icon, leaf: true, object: mesh, uid: mesh.data.uid, visible: mesh.data.visible});
	}
	meshesNode.appendChild(nodes);
}

UiManager.prototype.addNodeToTree = function(node)
{
	console.log('UiManager.prototype.addMeshesToTree');
	var mainTree = Ext.getCmp('mainTree');
	var root = mainTree.getRootNode();
	var meshesNode = root.findChild('text', 'Meshes');
	var uiNode = meshesNode.appendChild({text: node.name, icon: 'icons/co_mesh.png', leaf: false, object: node, uid: node.data.uid});
	
	var nodes = [];
	var meshes = node.getChildren();
	for(var i=0; i<meshes.length; i++)
	{
		var mesh = meshes[i];
		var icon = 'icons/mesh.png';
		nodes.push({text: mesh.name, icon: icon, leaf: true, object: mesh, uid: mesh.data.uid, visible: mesh.data.visible});
	}
	
	uiNode.appendChild(nodes);
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
		Ext.getCmp('pSXId').reset();
		Ext.getCmp('pSYId').reset();
		Ext.getCmp('pSZId').reset();
	}
	else
	{
		Ext.getCmp('pXId').setValue(mesh.position.x);
		Ext.getCmp('pYId').setValue(mesh.position.y);
		Ext.getCmp('pZId').setValue(mesh.position.z);

		Ext.getCmp('pRXId').setValue(mesh.rotation.x * (180 / Math.PI));
		Ext.getCmp('pRYId').setValue(mesh.rotation.y * (180 / Math.PI));
		Ext.getCmp('pRZId').setValue(mesh.rotation.z * (180 / Math.PI));
		
		Ext.getCmp('pSXId').setValue(mesh.scaling.x);
		Ext.getCmp('pSYId').setValue(mesh.scaling.y);
		Ext.getCmp('pSZId').setValue(mesh.scaling.z);
	}
};

UiManager.prototype.enableCoModeUi = function(pressed)
{
	if(pressed == true)
	{
		var mesh = this.sceneManager.selectionManager.lastPickedMesh;
		if(mesh == null)
		{
			Ext.MessageBox.alert('Compound Objects', 'Please select an object !');
			Ext.getCmp('enableCOModeButtonId').toggle(false, true);
		}
		else
		{
			this.setCoFirst(mesh.name);
			Ext.getCmp('coTabId').setDisabled(false);
			Ext.getCmp('toolsTabPanelId').setActiveTab(Ext.getCmp('coTabId'));
			emmiter.emit('ENABLE_CO_MODE', pressed);
		}
	}
	else
	{
		this.resetCoUi();
		Ext.getCmp('coTabId').setDisabled(true);
		emmiter.emit('ENABLE_CO_MODE', pressed);
	}
};

UiManager.prototype.setCoFirst = function(meshName)
{	
	Ext.getCmp('firstObjectId').setValue(meshName);
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

UiManager.prototype.refreshTreeUi = function()
{
	var mainTree = Ext.getCmp('mainTree');
	mainTree.getView().refresh();
};

UiManager.prototype.createPrefPageUi = function()
{
	console.log('UiManager.prototype.createPrefPageUi');
	
	var store = Ext.create('Ext.data.Store', {
		storeId:'prefStoreId',
		fields:['name'],
		data:
		{
			'items':
			[
				{'name': '3D view'},
				{'name': 'Camera'},
				{'name': 'Selection'},
				{'name': 'Mesh creation'},
				{'name': 'Trasformation Editor'}
			]
		},
		proxy: 
		{
			type: 'memory',
			reader: 
			{
				type: 'json',
				root: 'items'
			}
		}
	});
	
	store.load();
	
	var grid = Ext.create('Ext.grid.Panel', 
	{
		width: 200,
		store: store,
		layout: 'fit',
		hideHeaders: true,
		flex: 1,
		columns: 
		[
			{
				header: 'Name',  
				dataIndex: 'name',
				width: 200
			}
		]
	});
	
	Ext.create('Ext.window.Window',
	{
		title: 'Preferences',
		closable: true,
		resizable: false,
		width: 600,
		height: 400,
		layout: 
		{
			type: 'hbox',
			align: 'stretch'
		},
		bodyPadding: 5,
		items: 
		[
			grid,
			{
				xtype: 'form',
				html: 'Under construction',
				flex: 2
			}
		],
		buttons: 
		[
			{ 
				text: 'Apply'
			},
			{ 
				text: 'Cancel'
			}
		]
	}).show();
};

UiManager.prototype.getPrefabPositionValue = function()
{
	console.log('UiManager.prototype.getPrefabPositionValue');
	var position = new BABYLON.Vector3(Ext.getCmp('prefabPxId').getValue(), Ext.getCmp('prefabPyId').getValue(), Ext.getCmp('prefabPzId').getValue());
	return position;
};

UiManager.prototype.getPrefabRotationValue = function()
{
	console.log('UiManager.prototype.getPrefabRotationValue');
	var rotation = new BABYLON.Vector3(Ext.getCmp('prefabRxId').getValue() * (Math.PI / 180) , Ext.getCmp('prefabRyId').getValue() * (Math.PI / 180), Ext.getCmp('prefabRzId').getValue() * (Math.PI / 180));
	return rotation; 
};

UiManager.prototype.enableSectionModeUi = function(pressed)
{
	console.log('UiManager.prototype.enableSectionModeUi');
	var mesh = this.sceneManager.selectionManager.lastPickedMesh;
	if(mesh == null)
	{
		Ext.MessageBox.alert('3D Section', 'Please select an object !');
		Ext.getCmp('enableSectionModeButtonId').toggle(false, true);
		return;
	}
	
	emmiter.emit('ENABLE_SECTION_MODE', pressed);
	
	if(pressed == true)
	{
		Ext.getCmp('sectionTabId').setDisabled(false);
		Ext.getCmp('toolsTabPanelId').setActiveTab(Ext.getCmp('sectionTabId'));
		var bboxInfo = mesh.getBoundingInfo()
		bboxInfo.update(mesh._worldMatrix);
		var vectors = bboxInfo.boundingBox.vectors; 
		var width = Number(vectors[1].x - vectors[0].x);
		Ext.getCmp('sectionXPositionId').setMaxValue(width * 100 / 2);
		Ext.getCmp('sectionXPositionId').setMinValue(-width * 100 / 2);
		Ext.getCmp('sectionXPositionId').setValue(width * 100 / 2);
		var heigh = Number(vectors[1].y - vectors[0].y);
		Ext.getCmp('sectionYPositionId').setMaxValue(heigh * 100 / 2);
		Ext.getCmp('sectionYPositionId').setMinValue(-heigh * 100 / 2);
		Ext.getCmp('sectionYPositionId').setValue(heigh * 100 / 2);
		var depth = Number(vectors[1].z - vectors[0].z);
		Ext.getCmp('sectionZPositionId').setMaxValue(depth * 100 / 2);
		Ext.getCmp('sectionZPositionId').setMinValue(-depth * 100 / 2);
		Ext.getCmp('sectionZPositionId').setValue(depth * 100 / 2);
	}
	else
	{
		Ext.getCmp('sectionTabId').setDisabled(true);
	}
};

UiManager.prototype.mirrorMesh = function(axes)
{
	console.log('UiManager.prototype.mirrorMesh');
	if(sceneManager.selectionManager.lastPickedMesh == null)
	{
		Ext.MessageBox.alert('3D Section', 'Please select an object !');
		return;
	}
	emmiter.emit('MESH_MIRROR', axes);
};

UiManager.prototype.clearScene = function()
{
	console.log('UiManager.prototype.clearScene');
	Ext.Msg.show(
	{
		title:'Clear Scene',
		msg: 'This action will clear the scene ! Do you want to continue ?',
		buttons: Ext.Msg.YESNO,
		icon: Ext.Msg.QUESTION,
		fn: function(btn, text)
		{
			if(btn == 'yes')
			{
				emmiter.emit('UI_ENABLE_CO_MODE', false);
				emmiter.emit('UI_UPDATE_MESH_PROPERTIES_FROM_SELECTION', null);
				emmiter.emit('CHANGE_VIEW', 'FRONT');
				emmiter.emit('SCENE_CLEAR');
				
			}
		}
	});
};

UiManager.prototype.deleteSelectedMesh = function()
{
	if(this.sceneManager.selectionManager.lastPickedMesh == null)
	{
		Ext.MessageBox.alert('Delete Mesh', 'Please select an object !');
		return;
	}
	this.updateMeshPropertiesUiFromSelection(null);
	emmiter.emit('DELETE_SELECTED_MESH');
};

UiManager.prototype.createSceneContextMenu = function(x, y)
{
	console.log('UiManager.prototype.createSceneContextMenu');
	var menu = Ext.create('Ext.menu.Menu', 
	{
		margin: '0 0 10 0',
		width: 100,
		renderTo: Ext.getCmp('3dViewId').getEl(),
		zIndex: 9999,
		floating: true,
		shadow: false,
		items: 
		[
			{
				text: 'Hide selected',
				disabled: sceneManager.selectionManager.lastPickedMesh == null,
				handler: function()
				{
					var mesh = sceneManager.selectionManager.lastPickedMesh;
					mesh.visibility = false;
					if(mesh.name != 'Grid')
					{
						mesh.isPickable = mesh.visibility;
					}
					var mainTree = Ext.getCmp('mainTree');
					mainTree.getView().refresh();
					sceneManager.selectionManager.lastPickedMesh.material = sceneManager.selectionManager.lastPickedMesh.data.originalMaterial;
					sceneManager.selectionManager.lastPickedMesh = null;
					emmiter.emit('UI_UPDATE_SELECTION', null);
				}
			},
			{
				text: 'Hide unselected',
				disabled: sceneManager.selectionManager.lastPickedMesh == null,
				handler: function()
				{
					emmiter.emit('MESH_HIDE_UNSELECTED');
				}

			},
			{
				text: 'Show all',
				handler: function()
				{
					emmiter.emit('MESH_SHOW_ALL');
				}
			},
			{
				xtype: 'menuseparator'
			},
			{
				text: 'Enable Edges',
				disabled: sceneManager.selectionManager.lastPickedMesh == null || (sceneManager.selectionManager.lastPickedMesh != null && sceneManager.selectionManager.lastPickedMesh.edgesWidth > 0),
				handler: function()
				{
					emmiter.emit('MESH_ENABLE_EDGES', sceneManager.selectionManager.lastPickedMesh);
				}
			},
			{
				text: 'Disable Edges',
				disabled: sceneManager.selectionManager.lastPickedMesh == null || (sceneManager.selectionManager.lastPickedMesh != null && sceneManager.selectionManager.lastPickedMesh.edgesWidth == 0),
				handler: function()
				{
					emmiter.emit('MESH_DISABLE_EDGES', sceneManager.selectionManager.lastPickedMesh);
				}
			},
			{
				xtype: 'menuseparator'
			},
			{
				text: 'Wireframe',
				disabled: sceneManager.selectionManager.lastPickedMesh == null || sceneManager.selectionManager.lastPickedMesh.material.wireframe == true,
				handler: function()
				{
					var mesh = sceneManager.selectionManager.lastPickedMesh;
					emmiter.emit('MESH_SET_WIREFRAME', mesh, !mesh.material.wireframe);
					emmiter.emit('UI_REFRESH_TREE');
				}

			},
			{
				text: 'Default Material',
				disabled: sceneManager.selectionManager.lastPickedMesh == null || sceneManager.selectionManager.lastPickedMesh.material.wireframe == false,
				handler: function()
				{
					var mesh = sceneManager.selectionManager.lastPickedMesh;
					emmiter.emit('MESH_SET_WIREFRAME', mesh, !mesh.material.wireframe);
					emmiter.emit('UI_REFRESH_TREE');
				}

			}
		]
	});
	menu.showAt(x, y);
	menu.toFront();
};

UiManager.prototype.resetPrefabUi = function()
{
	console.log('UiManager.prototype.resetPrefabUi');
	Ext.getCmp('prefabPxId').reset();
	Ext.getCmp('prefabPyId').reset();
	Ext.getCmp('prefabPzId').reset();
	
	Ext.getCmp('prefabRxId').reset();
	Ext.getCmp('prefabRyId').reset();
	Ext.getCmp('prefabRzId').reset();
	
	var components = Ext.getCmp('prefabParamsFieldSet').query('numberfield');
	for(var i=0; i<components.length; i++)
	{
		var field = components[i];
		field.reset();
	}
	
};

UiManager.prototype.resetPrefabPositionUi = function()
{
	console.log('UiManager.prototype.resetPrefabPositionUi');
	Ext.getCmp('prefabPxId').reset();
	Ext.getCmp('prefabPyId').reset();
	Ext.getCmp('prefabPzId').reset();
};

UiManager.prototype.initPrefabPositionUiFromSelection = function()
{
	console.log('UiManager.prototype.initPrefabPositionUiFromSelection');
	if(this.sceneManager.selectionManager.lastPickedMesh != null)
	{
		Ext.getCmp('prefabPxId').setValue(this.sceneManager.selectionManager.lastPickedMesh.position.x);
		Ext.getCmp('prefabPyId').setValue(this.sceneManager.selectionManager.lastPickedMesh.position.y);
		Ext.getCmp('prefabPzId').setValue(this.sceneManager.selectionManager.lastPickedMesh.position.z);
	}		
};
