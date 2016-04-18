function GetPluginSettings()
{
	return {
		"name":			"Rails Devise Authentication",					// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"Rails_Devise_Auth",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.0",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Coming soon - based on the native AJAX plugin.",
		"author":		"Adam Kinson",
		"help url":		"Coming soon",
		"category":		"Web",					// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":		false,				// only used when "type" is "world".  Enables an angle property on the object.
		"flags":		pf_singleglobal			// uncomment lines to enable flags...
	};
};

////////////////////////////////////////
// Parameter types:
// AddNumberParam(label, description [, initial_string = "0"])			// a number
// AddStringParam(label, description [, initial_string = "\"\""])		// a string
// AddAnyTypeParam(label, description [, initial_string = "0"])			// accepts either a number or string
// AddCmpParam(label, description)										// combo with equal, not equal, less, etc.
// AddComboParamOption(text)											// (repeat before "AddComboParam" to add combo items)
// AddComboParam(label, description [, initial_selection = 0])			// a dropdown list parameter
// AddObjectParam(label, description)									// a button to click and pick an object type
// AddLayerParam(label, description)									// accepts either a layer number or name (string)
// AddLayoutParam(label, description)									// a dropdown list with all project layouts
// AddKeybParam(label, description)										// a button to click and press a key (returns a VK)
// AddAnimationParam(label, description)								// a string intended to specify an animation name
// AddAudioFileParam(label, description)								// a dropdown list with all imported project audio files

////////////////////////////////////////
// Conditions

// AddCondition(id,					// any positive integer to uniquely identify this condition
//				flags,				// (see docs) cf_none, cf_trigger, cf_fake_trigger, cf_static, cf_not_invertible,
//									// cf_deprecated, cf_incompatible_with_triggers, cf_looping
//				list_name,			// appears in event wizard list
//				category,			// category in event wizard list
//				display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//				description,		// appears in event wizard dialog when selected
//				script_name);		// corresponding runtime function name
				
AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different AJAX requests.", "\"\"");
AddCondition(0,	cf_trigger, "On completed", "Rails Devise Auth", "On <b>{0}</b> completed", "Triggered when an AJAX request completes successfully.", "OnComplete");

AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different AJAX requests.", "\"\"");
AddCondition(1,	cf_trigger, "On error", "Rails Devise Auth", "On <b>{0}</b> error", "Triggered when an AJAX request fails.", "OnError");

AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different AJAX requests.", "\"\"");
AddCondition(2,	cf_trigger, "On progress", "Rails Devise Auth", "On <b>{0}</b> progress", "Triggered when an AJAX request has a progress update.", "OnProgress");


////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

// example
AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different AJAX requests.", "\"\"");
AddStringParam("URL", "The URL to request.  Note: most browsers prevent cross-domain requests.", "\"http://\"");
AddAction(0, 0, "Request URL", "Rails Devise Auth", "Request <b>{1}</b> (tag <i>{0}</i>)", "Request a URL by a GET request and retrieve the server response.", "Request");

AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different AJAX requests.", "\"\"");
AddFileParam("File", "Select a project file to request.");
AddAction(1, 0, "Request project file", "Rails Devise Auth", "Request <b>{1}</b> (tag <i>{0}</i>)", "Request a file in the project and retrieve its contents.", "RequestFile");

AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different AJAX requests.", "\"\"");
AddStringParam("URL", "The URL to post to.  Note: most browsers prevent cross-domain posts.", "\"http://\"");
AddStringParam("Data", "The data to post, in query string form.  Be sure to URLEncode any user-entered data.");
AddStringParam("Method", "The HTTP method to use, typically \"POST\".", "\"POST\"");
AddAction(2, 0, "Post to URL", "Rails Devise Auth", "Send <b>{2}</b> to URL <b>{1}</b> (method <i>{3}</i>, tag <i>{0}</i>)", "Send data with a request to a URL and retrieve the server response.", "Post");

AddNumberParam("Timeout", "The timeout for AJAX requests in seconds. Use -1 for no timeout.");
AddAction(3, 0, "Set timeout", "Rails Devise Auth", "Set timeout to <i>{0}</i> seconds", "Set the maximum time before a request is considered to have failed.", "SetTimeout");

AddStringParam("Header", "The HTTP header name to set on the request.");
AddStringParam("Value", "A string of the value to set the header to.");
AddAction(4, 0, "Set request header", "Rails Devise Auth", "Set request header <i>{0}</i> to <i>{1}</i>", "Set a HTTP header on the next request that is made.", "SetHeader");

AddStringParam("MIME type", "The MIME type to interpret the response as.");
AddAction(5, 0, "Override MIME type", "Rails Devise Auth", "Override MIME type with <b>{0}</b>", "In the next request, override the MIME type indicated by the response.", "OverrideMIMEType");


//AddStringParam("Resource Name", "Enter the name of the RESTful resource (e.g.'account', 'user', etc.)");
//AddStringParam("Data", "Enter the data to be sent with the request.");
//AddAction(0, af_none, "Create resource (POST)", "API Calls", "Create a new {0}", "Sends a POST request to the server to create a new resource.", "Create");


////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

// example
//AddExpression(0, ef_return_number, "Resource ID", "API Data", "getResourceID", "Returns the database ID of this resource.");
//AddExpression(1, ef_return_string, "Resource Name", "API Data", "getResourceName", "Returns the name of this resource.");
//AddExpression(2, ef_return_string, "Resource JSON", "API Data", "getResourceJSON", "Returns the full JSON response for this resource.");

AddExpression(0, ef_return_string, "Get last data", "Rails Devise Auth", "LastData", "Get the data returned by the last successful request.");
AddExpression(1, ef_return_number, "Get progress", "Rails Devise Auth", "Progress", "Get the progress, from 0 to 1, of the request in 'On progress'.");
AddExpression(2, ef_return_string, "Get token", "Rails Devise Auth", "Token", "Get the API token returned by the last successful request.");
AddExpression(3, ef_return_string, "Get token type", "Rails Devise Auth", "TokenType", "Get the token type returned by the last successful request.");
AddExpression(4, ef_return_string, "Get token client", "Rails Devise Auth", "Client", "Get the client identifier returned by the last successful request.");
AddExpression(5, ef_return_string, "Get token expiry", "Rails Devise Auth", "Expiry", "Get the token expiry timestamp returned by the last successful request.");
AddExpression(6, ef_return_string, "Get token uid", "Rails Devise Auth", "TokenUid", "Get the token UID returned by the last successful request.");
AddExpression(7, ef_return_number, "Get resource ID", "Rails Devise Auth", "ResourceId", "Get the ID of the RESTful resource returned by the last successful request.");



////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,		name,	initial_value,	description)		// an integer value
// new cr.Property(ept_float,		name,	initial_value,	description)		// a float value
// new cr.Property(ept_text,		name,	initial_value,	description)		// a string
// new cr.Property(ept_color,		name,	initial_value,	description)		// a color dropdown
// new cr.Property(ept_font,		name,	"Arial,-16", 	description)		// a font with the given face name and size
// new cr.Property(ept_combo,		name,	"Item 1",		description, "Item 1|Item 2|Item 3")	// a dropdown list (initial_value is string of initially selected item)
// new cr.Property(ept_link,		name,	link_text,		description, "firstonly")		// has no associated value; simply calls "OnPropertyChanged" on click

var property_list = [
	//new cr.Property(ept_text, "Base URI", "https://yoursite.com", "The base URI for your RESTful server.")
	//new cr.Property(ept_text, "File Type", "application/json", "The file type that's expected by the server (e.g., application/json).")
	//new cr.Property(ept_text, "API token", "", "The user's API token for the server, saved after authentication)
	];
	
// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
	return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	// Save the constructor parameters
	this.instance = instance;
	this.type = type;
	
	// Set the default property values from the property table
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
		
	// Plugin-specific variables
	// this.myValue = 0...
}

// Called when inserted via Insert Object Dialog for the first time
IDEInstance.prototype.OnInserted = function()
{
}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}
