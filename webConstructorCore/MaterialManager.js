function MaterialManager(__sceneManager)
{
	this.sceneManager = __sceneManager;
}

MaterialManager.prototype.instance = function()
{
	if(this.__instance == null)
	{
		this.__instance = new MaterialManager();
	}
	return this.__instance;
};

MaterialManager.prototype.createNewMaterial = function()
{
	console.log('MaterialManager.prototype.createNewMaterial');
};
