function SelectionManager(__sceneManager)
{
	this.__instance = null;
	this.lastPickedMesh = null;
	this.lastPickedVertex = null;
	this.lastClickX = 0;
	this.lastClickY = 0;
	this.wireframe = false;
	this.editControl = null;
	this.vertexSelectionMode = 0;
	this.objectSelectionMode = 1;
	this.transform = '';
	this.selectionMode = this.objectSelectionMode;
	this.compoundObjectsMode = false;
	this.coFirst = null;
	this.coSecond = null;
	this.sectionMode = false;
	
	this.sceneManager = __sceneManager;
	
	emmiter.on('POINTER_UP', this.pointerUp.bind(this));
	emmiter.on('POINTER_DOWN', this.pointerDown.bind(this));
	emmiter.on('ENABLE_CO_MODE', this.setCompoundObjectsMode.bind(this));
	emmiter.on('SELECT_MESH', this.selectMesh.bind(this));
	emmiter.on('ENABLE_SECTION_MODE', this.enableSectionMode.bind(this));
}

SelectionManager.prototype.instance = function()
{
	if(this.__instance == null)
	{
		this.__instance = new SelectionManager();
	}
	return this.__instance;
};

SelectionManager.prototype.pointerDown = function(evt)
{
		this.lastClickX = evt.clientX;
		this.lastClickY = evt.clientY;
}

SelectionManager.prototype.pointerUp = function(evt, pickResult)
{
	if(this.sectionMode == true)
	{
		return;
	}
	
	if(pickResult == null)
	{
		emmiter.emit('UI_UPDATE_MESH_PROPERTIES_FROM_SELECTION', null);
		return;
	}
	console.log('PICK EVENT');
	if(this.lastClickX == evt.clientX && this.lastClickY == evt.clientY && this.objectSelectionMode == 1)
	{
		if(this.lastPickedMesh != null)
		{
			this.lastPickedMesh.material = this.lastPickedMesh.data.originalMaterial;
		}

		if (pickResult.hit) 
		{
			if(this.lastPickedMesh != null)
			{
				this.lastPickedMesh.material = this.lastPickedMesh.data.originalMaterial;
				if(this.editControl != null)
				{
					this.editControl.removeAllActionListeners();
					this.editControl.detach();
					this.editControl = null;
				}
			}
			
			if(pickResult.pickedMesh.data.originalMaterial == undefined)
			{
				pickResult.pickedMesh.data.originalMaterial = pickResult.pickedMesh.material.clone();
			}
			
			emmiter.emit('UI_UPDATE_SELECTION', pickResult.pickedMesh.name);
			pickResult.pickedMesh.material = pickResult.pickedMesh.data.selectionMaterial;
			this.lastPickedMesh = pickResult.pickedMesh;
			if(this.lastPickedMesh.data != undefined && this.lastPickedMesh.data.type == 'sceneObject' && this.lastPickedMesh.data.gizmo == undefined)
			{
				if(this.transform != '')
				{
					var EditControl = org.ssatguru.babylonjs.component.EditControl;
					this.editControl = new EditControl(this.lastPickedMesh, this.sceneManager.camera, this.sceneManager.canvas, 0.75, true);
					this.editControl.enableTranslation(3.14/18);
					this.editControl.enableTranslation(3.14/18);
					this.editControl.setRotSnapValue(3.14 / 18);
					this.editControl.setScaleSnapValue(.5);
					this.editControl.setTransSnapValue(.1);
					this.bindEditControlActionListeners();
					this.editControl.setLocal(false);
				}
			}
			if(this.compoundObjectsMode == true)
			{
				this.coSecond = this.lastPickedMesh;
				emmiter.emit('UI_CO_SET_SECOND', this.coSecond.name);
			}
			emmiter.emit('UI_UPDATE_MESH_PROPERTIES_FROM_SELECTION', this.lastPickedMesh);
		}
		else
		{
			emmiter.emit('UI_UPDATE_SELECTION', null);
			this.lastPickedMesh = null;
			if(this.editControl != null)
			{
				this.editControl.removeAllActionListeners();
				this.editControl.detach();
				this.editControl = null;
			}
			emmiter.emit('UI_UPDATE_MESH_PROPERTIES_FROM_SELECTION', null);
		}
	}
};

SelectionManager.prototype.executeVertexMode = function()
{
	if(this.lastPickedMesh == null)
	{
		return false;
	}
	/*
	var clone = lastPickedMesh.clone();
	clone.material = new BABYLON.StandardMaterial("vertex", scene);
	clone.material.pointsCloud = true;
	clone.material.pointSize = 5;
	*/
	
	var positions = this.lastPickedMesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
	var vertexMeshs = [];
	for(var i = 0; i < positions.length; i += 3)
	{
		//var mesh = BABYLON.Mesh.CreateSphere("Sphere", 5, .1, scene, true);
		
		var options = {
			points: [new BABYLON.Vector3(positions[i], positions[i + 1], positions[i + 2]), new BABYLON.Vector3(positions[i] + .1, positions[i + 1] + .1, positions[i + 2] + .1)]
		};
		var mesh = BABYLON.MeshBuilder.CreateLines('Line', options, this.sceneManager.scene);
		
		mesh.position = new BABYLON.Vector3(positions[i], positions[i + 1], positions[i + 2]);
		mesh.data = {type: 'VERTEX_OBJECT', vertexIndex: i, mesh: lastPickedMesh}
		mesh.parent = this.lastPickedMesh;
		mesh.material = new BABYLON.StandardMaterial("vertex", this.sceneManager.scene);
		mesh.material.diffuseColor = new BABYLON.Color3(0, 1, 0);
		//mesh.material.alpha = .3;
		vertexMeshs.push(mesh);
	}
	console.log('Vertices number: ' + vertexMeshs.length);
	this.lastPickedMesh.data = {type: 'SCENE_OBJECT', vertexMeshs: vertexMeshs};
	
	return true;
};



SelectionManager.prototype.initSceneSelection = function(__sceneManager)
{
	
	__sceneManager.scene.onPointerDown = function (evt, pickResult)
	{
		emmiter.emit('POINTER_DOWN', evt);
	};
	
	__sceneManager.scene.onPointerUp = function (evt, pickResult) 
	{	
		emmiter.emit('POINTER_UP', evt, pickResult);
		if(this.lastClickX == evt.clientX && this.lastClickY == evt.clientY && this.selectionMode == this.vertexSelectionMode)
		{
			if(this.lastPickedVertex != null)
			{
				this.lastPickedVertex.material.alpha = .3;
			}

			if (pickResult.hit && pickResult.pickedMesh.data != undefined) 
			{
				if(pickResult.pickedMesh.data.type == 'VERTEX_OBJECT')
				{
					pickResult.pickedMesh.material.alpha = 1;
					this.lastPickedVertex = pickResult.pickedMesh;
					//updateMeshPropertiesUiFromSelection(pickResult.pickedMesh);
				}
				else
				{
					//updateMeshPropertiesUiFromSelection(null);
					this.lastPickedVertex = null;
				}
			}
		}
	};
};

SelectionManager.prototype.setCompoundObjectsMode = function(enable)
{
	if(enable && !this.compoundObjectsMode)
	{
		if(this.lastPickedMesh == null)
		{
			emmiter.emit('UI_CO_SET_FIRST', null);
		}
		else
		{
			this.compoundObjectsMode = true;
			this.coFirst = this.lastPickedMesh;
			emmiter.emit('UI_CO_SET_FIRST', this.coFirst.name);
		}
	}
	else
	{
		this.compoundObjectsMode = false;
		emmiter.emit('UI_CO_RESET');
	}
};

SelectionManager.prototype.selectMesh = function(mesh)
{
	if(this.sectionMode == true)
	{
		return;
	}
	if(mesh.name == 'Grid')
	{
		emmiter.emit('UI_UPDATE_MESH_PROPERTIES_FROM_SELECTION', null);
		return;
	}
	
	if(mesh.data.visible == false)
	{
		return;
	}
	
	if(this.lastPickedMesh != null)
	{
		this.lastPickedMesh.material = this.lastPickedMesh.data.originalMaterial;
		if(this.editControl != null)
		{
			this.editControl.removeAllActionListeners();
			this.editControl.detach();
			this.editControl = null;
		}
	}
	
	mesh.material = mesh.data.selectionMaterial;
	//mesh.material.wireframe = this.wireframe;
	this.lastPickedMesh = mesh;
	if(mesh.data != undefined && mesh.data.type == 'sceneObject' && mesh.data.gizmo == undefined)
	{
		if(this.transform != '')
		{
			var EditControl = org.ssatguru.babylonjs.component.EditControl;
			this.editControl = new EditControl(this.lastPickedMesh, this.sceneManager.camera, this.sceneManager.canvas, 0.75, true);
			this.editControl.enableTranslation(3.14/18);
			this.editControl.enableTranslation(3.14/18);
			this.editControl.setRotSnapValue(3.14 / 18);
			this.editControl.setScaleSnapValue(.5);
			this.editControl.setTransSnapValue(.1);
			this.bindEditControlActionListeners();
			this.editControl.setLocal(false);
		}
	}
	
	if(this.compoundObjectsMode)
	{
		if(this.coFirst == null)
		{
			this.coFirst = mesh;
			console.log('First object selected for CO');
			emmiter.emit('UI_CO_SET_FIRST', this.coFirst.name);
		}
		else
		{
			this.coSecond = mesh;
			console.log('Second object selected for CO');
			emmiter.emit('UI_CO_SET_SECOND', this.coSecond.name);
		}
	}
	
	emmiter.emit('UI_UPDATE_MESH_PROPERTIES_FROM_SELECTION', mesh);
};

SelectionManager.prototype.addEditControlActionsOnListener = function(action)
{
	if(this.sectionMode == true)
	{
		this.lastPickedMesh.material.setVector3("vLightPosition", new BABYLON.Vector3(this.lastPickedMesh.position.x, this.lastPickedMesh.position.y, this.lastPickedMesh.position.z));
	}
	emmiter.emit('UI_UPDATE_MESH_PROPERTIES_FROM_SELECTION', this.editControl.mesh);
};

SelectionManager.prototype.addEditControlActionsEndListener = function(action)
{
	emmiter.emit('UI_UPDATE_MESH_PROPERTIES_FROM_SELECTION', this.editControl.mesh);
};

SelectionManager.prototype.bindEditControlActionListeners = function()
{
	this.editControl.addActionListener(this.addEditControlActionsOnListener.bind(this));
	this.editControl.addActionEndListener(this.addEditControlActionsEndListener.bind(this));
};

SelectionManager.prototype.removeEditControl = function()
{
	console.log('SelectionManager.prototype.removeEditControl');
	if(this.editControl != null)
	{
		this.editControl.removeAllActionListeners();
		this.editControl.detach();
		this.editControl = null;
	}
};

SelectionManager.prototype.enableSectionMode = function(pressed)
{
	this.sectionMode = pressed;
	if(this.sectionMode == true)
	{
		
		BABYLON.Effect.ShadersStore["customVertexShader"]=                "precision highp float;\r\n"+

		"// Attributes\r\n"+
		"attribute vec3 position;\r\n"+
		"attribute vec3 normal;\r\n"+

		"// Uniforms\r\n"+
		"uniform mat4 worldViewProjection;\r\n"+

		"// Varying\r\n"+
		"varying vec3 vPosition;\r\n"+
		"varying vec3 vNormal;\r\n"+

		"void main(void) {\r\n"+
		"    vec4 outPosition = worldViewProjection * vec4(position, 1.0);\r\n"+
		"    gl_Position = outPosition;\r\n"+
		"    \r\n"+
		"    vPosition = position;\r\n"+
		"    vNormal = normal;\r\n"+
		"}\r\n";

		BABYLON.Effect.ShadersStore["customFragmentShader"]=                "precision highp float;\r\n"+

		"// Varying\r\n"+
		"varying vec3 vPosition;\r\n"+
		"varying vec3 vNormal;\r\n"+
		"uniform float xlimit;\r\n"+
		"uniform float ylimit;\r\n"+
		"uniform float zlimit;\r\n"+
		"uniform vec3 vLightPosition;\r\n"+
		"// Uniforms\r\n"+
		"uniform mat4 world;\r\n"+

		"// Refs\r\n"+
		"uniform vec3 cameraPosition;\r\n"+
		"uniform vec3 color;\r\n"+

		"void main(void) {\r\n"+
		"    // World values\r\n"+
		"    vec3 vPositionW = vec3(world * vec4(vPosition, 1.0));\r\n"+
		"    vec3 vNormalW = normalize(vec3(world * vec4(vNormal, 0.0)));\r\n"+
		"    vec3 viewDirectionW = normalize(cameraPosition - vPositionW);\r\n"+
		"    \r\n"+
		"    // Light\r\n"+
		"    vec3 lightVectorW = normalize(vLightPosition - vPositionW);\r\n"+
		"    \r\n"+
		"    // diffuse\r\n"+
		"    float ndl = max(0., dot(vNormalW, lightVectorW));\r\n"+
		"    \r\n"+
		"    // Specular\r\n"+
		"    vec3 angleW = normalize(viewDirectionW + lightVectorW);\r\n"+
		"    float specComp = max(0., dot(vNormalW, angleW));\r\n"+
		"    specComp = pow(specComp, max(1., 64.)) * 2.;\r\n"+
		"    \r\n"+
		"    if (vPosition.x > xlimit || vPosition.y > ylimit || vPosition.z > zlimit) {\r\n"+
		"        discard;\r\n"+
		"    }\r\n"+
		"    \r\n"+
		"    vec3 ambientColor = vec3(.05, .05, .05);\r\n"+
		"    gl_FragColor = vec4((color * ndl) + ambientColor, 1.);\r\n"+
		"}\r\n";
		
		// Compile
		var shaderMaterial = new BABYLON.ShaderMaterial("shader" + this.lastPickedMesh.name, this.sceneManager.scene, {
			vertex: "custom",
			fragment: "custom",
		},
		{
			attributes: ["position", "normal", "uv"],
			uniforms: ["world", "worldView", "worldViewProjection", "view", "projection"]
		});
		shaderMaterial.setFloat("xlimit", 0);
		shaderMaterial.setFloat("ylimit", 0);
		shaderMaterial.setFloat("zlimit", 0);
		shaderMaterial.setVector3("vLightPosition", new BABYLON.Vector3(this.lastPickedMesh.position.x, this.lastPickedMesh.position.y, this.lastPickedMesh.position.z));
		
		var dc = this.lastPickedMesh.data.originalMaterial.diffuseColor;
		shaderMaterial.setVector3("color", new BABYLON.Vector3(dc.r, dc.g, dc.b));
		
		shaderMaterial.setVector3("cameraPosition", this.sceneManager.scene.cameras[0].position);
		shaderMaterial.backFaceCulling = false;
		
		this.lastPickedMesh.material = shaderMaterial;
	}
	else
	{
		this.lastPickedMesh.material = this.lastPickedMesh.data.selectionMaterial;
	}
}
