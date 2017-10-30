function SceneManager()
{
	this.__instance = null;
	this.scene = null;
	this.camera = null;
	this.canvas = null;
	this.engine = null;
	this.selectionManager = null;
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
	this.camera = new BABYLON.ArcRotateCamera("Camera", 0, .8, 10, new BABYLON.Vector3(0, 0, 0), this.scene);
	this.camera.inertia = 0;

	this.camera.setTarget(BABYLON.Vector3.Zero());
	this.camera.attachControl(this.canvas, true);

	var lightUp = new BABYLON.HemisphericLight("lightUp", new BABYLON.Vector3(0, -1, 0), this.scene);
	lightUp.intensity = 0.7;
	var lightDown = new BABYLON.HemisphericLight("lightDown", new BABYLON.Vector3(0, 1, 0), this.scene);
	lightDown.intensity = 0.4;

	// Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
	var ground = BABYLON.Mesh.CreateGround("ground1", 20, 20, 20, this.scene);
	ground.material = new BABYLON.StandardMaterial("m3", this.scene);
	ground.material.wireframe = true;
	ground.material.backFaceCulling = false;
	ground.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
	ground.isPickable = false;
	
	this.render(this.canvas, this.engine, this.scene, this.camera);

	window.addEventListener("resize", function () 
	{
		this.engine.resize();
	});
	
	this.selectionManager = new SelectionManager(this);
	this.selectionManager.initSceneSelection(this);
	
	return this.scene;
};


SceneManager.prototype.render = function(canvas, engine, scene, camera)
{
	this.engine.runRenderLoop(function () 
	{
		canvas.style.width = '100%';
		canvas.style.height = '100%';
		engine.resize();
		camera.update();
		scene.render();
		/*
		if(editControl != null && lastPickedMesh != null)
		{
			if(transform == 't')
			{
				editControl.enableTranslation();
			}
			if(transform == 'r')
			{
				editControl.enableRotation();
			}
			if(transform == 's')
			{
				editControl.enableScaling();
			}
		}
		*/
	});
};