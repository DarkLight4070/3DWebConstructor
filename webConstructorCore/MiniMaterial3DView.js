function MiniMaterial3DView()
{
	this.scene = null;
	this.camera = null;
	this.canvas = null;
	this.engine = null;
	this.material = null;
	this.box = null;
	emmiter.on('MATERAIL_MINI_VIEW_UPDATE_MATERIAL', this.updateMaterial.bind(this));
}

MiniMaterial3DView.prototype.createMaterialMiniView = function()
{
	console.log('MiniMaterial3DView.prototype.createMaterialMiniView');
	this.canvas = document.getElementById("miniViewCanvas");
	
	this.engine = new BABYLON.Engine(this.canvas, true);
			
	this.scene = new BABYLON.Scene(this.engine);
	
	var light = new BABYLON.HemisphericLight("MiniViewHemiLight", new BABYLON.Vector3(0, -1, 0), this.scene);
	
	this.material = new BABYLON.StandardMaterial("TestMaterial", this.scene);
	this.material.backFaceCulling = false;
	this.material.ambientColor  = new BABYLON.Color3(0, 0, 0);
	this.material.diffuseColor  = new BABYLON.Color3(1, 1, 1);
	this.material.specularColor  = new BABYLON.Color3(1, 1, 1);
	this.material.emissiveColor  = new BABYLON.Color3(0, 0, 0);
	this.material.specularPower = 64;
	this.material.roughness = 0;
	this.material.alpha = 1;
	
	this.camera = new BABYLON.ArcRotateCamera("MiniViewCamera", 0, 0, 0, new BABYLON.Vector3(0, 0, 0), this.scene);
	this.camera.setPosition(new BABYLON.Vector3(0, 5, -5));
	this.camera.inertia = 0;
	this.camera.setTarget(BABYLON.Vector3.Zero());
	this.camera.attachControl(this.canvas, false);
	
	
	var options = 
	{
		width: 2,
		height: 2,
		depth: 2,
		updatable: false,
		sideOrientation: BABYLON.Mesh.DOUBLESIDE
	};
	this.box = BABYLON.MeshBuilder.CreateBox('MiniViewBox', options, this.scene);
	this.box.position = new BABYLON.Vector3(-1.5, 0, 0);
	this.box.material = this.material;
	var sphere = BABYLON.Mesh.CreateSphere("MiniViewSphere", 10, 2, this.scene, true, BABYLON.Mesh.DOUBLESIDE);
	sphere.position = new BABYLON.Vector3(1.5, 0, 0);
	sphere.material = this.material;
	
	var scene = this.scene;
	this.engine.runRenderLoop(function()
	{
		scene.render();
	});
	
};

MiniMaterial3DView.prototype.updateMaterial = function(ambient, diffuse, specular, emissive, specularPower, alpha, roughness)
{
	console.log('MiniMaterial3DView.prototype.updateMaterial');
	
	this.material.ambientColor  = new BABYLON.Color3(0, 0, 0);
	this.material.diffuseColor  = new BABYLON.Color3(1, 1, 1);
	this.material.specularColor  = new BABYLON.Color3(1, 1, 1);
	this.material.emissiveColor  = new BABYLON.Color3(0, 0, 0);
	this.material.specularPower = 64;
	this.material.roughness = 0;
	this.material.alpha = 1;
	
	if(ambient != null)
	{
		this.material.ambientColor = new BABYLON.Color3(ambient[0], ambient[1], ambient[2]);
	}
	if(diffuse != null)
	{
		this.material.diffuseColor = new BABYLON.Color3(diffuse[0], diffuse[1], diffuse[2]);
	}
	if(specular != null)
	{
		this.material.specularColor  = new BABYLON.Color3(specular[0], specular[1], specular[2]);
	}
	if(emissive != null)
	{
		this.material.emissiveColor  = new BABYLON.Color3(emissive[0], emissive[1], emissive[2]);
	}
	if(specularPower != null && specularPower != undefined)
	{
		this.material.specularPower = specularPower;
	}
	
	if(roughness != null && roughness != undefined)
	{
		this.material.roughness = roughness;
	}
	if(alpha != null && alpha != undefined)
	{
		this.material.alpha = alpha;
	}
};