function SceneManager()
{
	this.__instance = null;
	this.scene = null;
	this.camera = null;
	this.canvas = null;
	this.engine = null;
	this.selectionManager = null;
	this.uid = 0;
	
	emmiter.on('REMOVE_MESH', this.removeMesh.bind(this));
	emmiter.on('CLONE_MESH', this.cloneMesh.bind(this));
	emmiter.on('EXECUTE_CO', this.executeCo.bind(this));
	emmiter.on('CHANGE_VIEW', this.setView.bind(this));
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
	
	this.camera = new BABYLON.ArcRotateCamera("Camera", 0, .8, 40, new BABYLON.Vector3(0, 0, 0), this.scene);
	this.camera.inertia = 0;
	this.camera.setTarget(BABYLON.Vector3.Zero());
	this.camera.upperBetaLimit = 2 * Math.PI;
	this.camera.attachControl(this.canvas, false);

	var lightUp = new BABYLON.HemisphericLight("lightUp", new BABYLON.Vector3(0, -1, 0), this.scene);
	lightUp.intensity = 0.7;
	var lightDown = new BABYLON.HemisphericLight("lightDown", new BABYLON.Vector3(0, 1, 0), this.scene);
	lightDown.intensity = 0.4;

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
	
	if(this.selectionManager.lastPickedMesh != null)
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
		}
		
		if(this.selectionManager.transform == '')
		{
			if(this.selectionManager.editControl != null)
			{
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
};

SceneManager.prototype.removeMesh = function()
{
	if(this.selectionManager.editControl != null)
	{
		this.selectionManager.editControl.detach();
		this.selectionManager.editControl = null;
	}
	this.scene.removeMesh(this.selectionManager.lastPickedMesh);
	this.selectionManager.lastPickedMesh = null;
};

SceneManager.prototype.cloneMesh = function()
{
	if(this.selectionManager.lastPickedMesh == null)
	{
		Ext.MessageBox.alert('Clone Operation', 'Please select an object !');
	}
	var clone = this.selectionManager.lastPickedMesh.clone(this.selectionManager.lastPickedMesh.name + 1);
	clone.material = new BABYLON.StandardMaterial("mat", this.scene);
	clone.material.diffuseColor = this.selectionManager.lastPickedMeshMaterial;
	clone.material.backFaceCulling = false;
	clone.data = {type: 'sceneObject', uid: this.uid++};
	emmiter.emit('UI_ADD_MESH_TO_TREE', clone);
}

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
	
	var result = csg.toMesh("a*b", new BABYLON.StandardMaterial("mat", this.scene), this.scene);
	result.material = new BABYLON.StandardMaterial("mat", this.scene);
	result.material.backFaceCulling = false;
	result.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
	result.data = {type: 'sceneObject'};
	
	if(deleteObjs)
	{
		this.scene.removeMesh(this.selectionManager.coFirst);
		this.scene.removeMesh(this.selectionManager.coSecond);
	}
};

SceneManager.prototype.setView = function(view)
{
	if(view == 'FRONT')
	{
		this.camera.alpha = this.camera.beta = 0;
	}
	else if(view == 'BACK')
	{
		this.camera.alpha = 0;
		this.camera.beta = Math.PI;
	}
	else if(view == 'LEFT')
	{
		this.camera.alpha = -Math.PI / 2;
		this.camera.beta = Math.PI / 2;
	}
	else if(view == 'RIGHT')
	{
		this.camera.alpha = Math.PI / 2;
		this.camera.beta = Math.PI / 2;
	}
	else if(view == 'TOP')
	{
		this.camera.alpha = 0;
		this.camera.beta = 3 * Math.PI / 2;
	}
	else if(view == 'BOTTOM')
	{
		this.camera.alpha = 0;
		this.camera.beta = Math.PI / 2;
	}
};