function UiManager(__scene)
{
	this.scene = __scene;
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
		var depth = heightField.getValue();
	
		var faceColors = new Array(6);

		faceColors[4] = new BABYLON.Color4(1,0,0,1);
		faceColors[1] = new BABYLON.Color4(0,1,0,1);
		var options = 
		{
		    width: width,
		    height: height,
		    depth: depth,
		    updatable: true,
			faceColors : faceColors,
		    sideOrientation: BABYLON.Mesh.DOUBLESIDE
	  	};
		var box = BABYLON.MeshBuilder.CreateBox('box', options, this.scene);
		
		box.material = new BABYLON.StandardMaterial("boxMat", this.scene);
		box.material.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
		box.material.backFaceCulling = false;
		updateMeshSpacialAttributesFromUi(box);
		box.data = {type: 'sceneObject'};

		var mainTree = Ext.getCmp('mainTree');
		var rootNode = mainTree.getRootNode();
		var meshesNode = rootNode.findChild('text', 'Meshes');
		meshesNode.appendChild({text: box.id, leaf: true, object: box});
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

	  	//name, height, diameterTop, diameterBottom, tessellation, subdivisions, scene, updatable, sideOrientation
		var cylinder = BABYLON.Mesh.CreateCylinder("cylinder", height, topDiameter, bottomDiameter, tesselation, 10, this.scene, true, BABYLON.Mesh.DOUBLESIDE);
		cylinder.material = new BABYLON.StandardMaterial("cylinderMat", this.scene);
		cylinder.material.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
		cylinder.material.backFaceCulling = false;
		cylinder.data = {type: 'sceneObject'};
		updateMeshSpacialAttributesFromUi(cylinder);

		var mainTree = Ext.getCmp('mainTree');
		var rootNode = mainTree.getRootNode();
		var meshesNode = rootNode.findChild('text', 'Meshes');
		meshesNode.appendChild({text: cylinder.id, leaf: true, object: cylinder});
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

	  	//CreateSphere(name, segments, diameter, scene, updatable, sideOrientation)
		var mesh = BABYLON.Mesh.CreateSphere("Sphere", segments, diameter, this.scene, true, BABYLON.Mesh.DOUBLESIDE);
		mesh.material = new BABYLON.StandardMaterial("SphereMat", this.scene);
		mesh.material.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
		mesh.material.backFaceCulling = false;
		mesh.data = {type: 'sceneObject'};
		updateMeshSpacialAttributesFromUi(mesh);

		var mainTree = Ext.getCmp('mainTree');
		var rootNode = mainTree.getRootNode();
		var meshesNode = rootNode.findChild('text', 'Meshes');
		meshesNode.appendChild({text: mesh.id, leaf: true, object: mesh});
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

		var options = {
		    width: width,
		    height: height,
		    subdivisions: subdivisions,
		    updatable: true
	  	};

	  	//CreatePlane(name, options, scene)
		var mesh = BABYLON.MeshBuilder.CreateGround("Plane", options, this.scene);
		mesh.material = new BABYLON.StandardMaterial("PlaneMat", this.scene);
		mesh.material.backFaceCulling = false;
		mesh.material.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
		mesh.data = {type: 'sceneObject'};
		
		updateMeshSpacialAttributesFromUi(mesh);

		var mainTree = Ext.getCmp('mainTree');
		var rootNode = mainTree.getRootNode();
		var meshesNode = rootNode.findChild('text', 'Meshes');
		meshesNode.appendChild({text: mesh.id, leaf: true, object: mesh});
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

		var options = {
		    points: [new BABYLON.Vector3(x1, y1, z1), new BABYLON.Vector3(x2, y2, z2)]
	  	};
		var line = BABYLON.MeshBuilder.CreateLines('Line', options, this.scene);
		line.material = new BABYLON.StandardMaterial("boxMat", this.scene);
		line.material.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
		line.data = {type: 'sceneObject'};
		
		updateMeshSpacialAttributesFromUi(line);

		var mainTree = Ext.getCmp('mainTree');
		var rootNode = mainTree.getRootNode();
		var meshesNode = rootNode.findChild('text', 'Meshes');
		meshesNode.appendChild({text: line.id, leaf: true, object: line});
	};
}

UiManager.prototype.buildPrefabEntriesUi = function(__prefabType)
{
	var fieldSet = Ext.getCmp('prefabParamsFieldSet');
	fieldSet.removeAll(true);
	if(__prefabType == 'Box')
	{
		createBoxPrefabUi(fieldSet);
	}
	else if(__prefabType == 'Line')
	{
		createLinePrefabUi(fieldSet);
	}
	else if(__prefabType == 'Cylinder')
	{
		createCylinderPrefabUi(fieldSet);
	}
	else if(__prefabType == 'Sphere')
	{
		createSpherePrefabUi(fieldSet);
	}
	else if(__prefabType == 'Plane')
	{
		createPlanePrefabUi(fieldSet);
	}
}