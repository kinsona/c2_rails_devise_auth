// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.AJK_REST = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.AJK_REST.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;
	var restRuntime = null;
	var restInst = null;
	var ResourceID = null;
	var ResourceName = "";
	var ResourceJSON = "";

	// called on startup for each object type
	typeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		
		// any other properties you need, e.g...
		// this.myValue = 0;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		// note the object is sealed after this call; ensure any properties you'll ever need are set on the object
		// e.g...
		// this.myValue = 0;
		restRuntime = this.runtime;
		restInst = this;
	};
	
	

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	// the example condition
	// Cnds.prototype.MyCondition = function (myparam)
	// {
		// return true if number is positive
		// return myparam >= 0;
	// };
	
	
	pluginProto.cnds = new Cnds();
	


	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.Create = function (resourceName)
	{
		console.log("Create action");
		// make the ajax call
		// on response, parse it
		// i think this is where I define ResourceID, ResourceName, and ResourceJSON
	};
	
	
	pluginProto.acts = new Acts();
	


	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	// 'ret' must always be the first parameter - always return the expression's result through it!
	Exps.prototype.getResourceID = function (ret)	{ ret.set_int(ResourceID); };
	Exps.prototype.getResourceName = function (ret)	{ ret.set_string(ResourceName); };
	Exps.prototype.getResourceJSON = function (ret)	{ ret.set_string(ResourceJSON); };
	
	
	pluginProto.exps = new Exps();

}());
