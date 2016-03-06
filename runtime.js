// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.Rails_Devise_Auth = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var isNWjs = false;
	var path = null;
	var fs = null;
	var nw_appfolder = "";
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.Rails_Devise_Auth.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

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
		this.lastData = "";
		this.token = "";
		this.tokenType = "";
		this.client = "";
		this.expiry = "";
		this.tokenUid = "";
		this.curTag = "";
		this.progress = 0;
		this.timeout = -1;
		
		isNWjs = this.runtime.isNWjs;
		
		if (isNWjs)
		{
			path = require("path");
			fs = require("fs");
			var process = window["process"] || nw["process"];
			nw_appfolder = path["dirname"](process["execPath"]) + "\\";
		}
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	var theInstance = null;

	// For handling AJAX events in DC
	window["C2_AJAX_DCSide"] = function (event_, tag_, param_)
	{
		if (!theInstance)
			return;
		
		if (event_ === "success")
		{
			theInstance.curTag = tag_;
			theInstance.lastData = param_;
			theInstance.token = "DC ISSUE";
			theInstance.runtime.trigger(cr.plugins_.Rails_Devise_Auth.prototype.cnds.OnComplete, theInstance);
		}
		else if (event_ === "error")
		{
			theInstance.curTag = tag_;
			theInstance.runtime.trigger(cr.plugins_.Rails_Devise_Auth.prototype.cnds.OnError, theInstance);
		}
		else if (event_ === "progress")
		{
			theInstance.progress = param_;
			theInstance.curTag = tag_;
			theInstance.runtime.trigger(cr.plugins_.Rails_Devise_Auth.prototype.cnds.OnProgress, theInstance);
		}
	};

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		// note the object is sealed after this call; ensure any properties you'll ever need are set on the object
		// e.g...
		// this.myValue = 0;
		//restRuntime = this.runtime;
		//restInst = this;
		//baseURI = this.properties[0];
		//filetype = this.properties[1];
		//token = this.properties[2];
		theInstance = this;
	};

	instanceProto.saveToJSON = function ()
	{
		return { "lastData": this.lastData, "token": this.token, "tokenType": this.tokenType, "client": this.client, "expiry": this.expiry, "tokenUid": this.tokenUid };
	};
	
	instanceProto.loadFromJSON = function (o)
	{
		this.lastData = o["lastData"];
		this.token = o["token"];
		this.tokenType = o["tokenType"];
		this.client = o["client"];
		this.expiry = o["expiry"];
		this.tokenUid = o["tokenUid"];
		this.curTag = "";
		this.progress = 0;
	};
	
	var next_request_headers = {};
	var next_override_mime = "";
	

	instanceProto.doRequest = function (tag_, url_, method_, data_)
	{
		// In directCanvas: forward request to webview layer
		if (this.runtime.isDirectCanvas)
		{
			AppMobi["webview"]["execute"]('C2_AJAX_WebSide("' + tag_ + '", "' + url_ + '", "' + method_ + '", ' + (data_ ? '"' + data_ + '"' : "null") + ');');
			return;
		}
		
		// Create a context object with the tag name and a reference back to this
		var self = this;
		var request = null;
		
		var doErrorFunc = function ()
		{
			self.curTag = tag_;
			self.runtime.trigger(cr.plugins_.Rails_Devise_Auth.prototype.cnds.OnError, self);
		};
		
		var errorFunc = function ()
		{
			// In node-webkit, try looking up the file on disk instead since it wasn't found in the project.
			if (isNWjs)
			{
				var filepath = nw_appfolder + url_;
				
				if (fs["existsSync"](filepath))
				{
					fs["readFile"](filepath, {"encoding": "utf8"}, function (err, data) {
						if (err)
						{
							doErrorFunc();
							return;
						}
						
						self.lastData = data.replace(/\r\n/g, "\n");
						self.token = "errorFunc issue";
						self.runtime.trigger(cr.plugins_.Rails_Devise_Auth.prototype.cnds.OnComplete, self);
					});
				}
				else
					doErrorFunc();
			}
			else
				doErrorFunc();
		};
			
		var progressFunc = function (e)
		{
			if (!e["lengthComputable"])
				return;
				
			self.progress = e.loaded / e.total;
			self.curTag = tag_;
			self.runtime.trigger(cr.plugins_.Rails_Devise_Auth.prototype.cnds.OnProgress, self);
		};
			
		try
		{
			// Windows Phone 8 can't AJAX local files using the standards-based API, but
			// can if we use the old-school ActiveXObject. So use ActiveX on WP8 only.
			if (this.runtime.isWindowsPhone8)
				request = new ActiveXObject("Microsoft.XMLHTTP");
			else
				request = new XMLHttpRequest();
			
			request.onreadystatechange = function()
			{
				if (request.readyState === 4)
				{
					self.curTag = tag_;
					
					if (request.responseText) {
						self.lastData = request.responseText.replace(/\r\n/g, "\n");		// fix windows style line endings
						self.token = request.getResponseHeader("Access-Token");
						self.tokenType = request.getResponseHeader("Token-Type");
						self.client = request.getResponseHeader("Client");
						self.expiry = request.getResponseHeader("Expiry");
						self.tokenUid = request.getResponseHeader("Uid");
					}
					else {
						self.lastData = "";
						self.token = "";
						self.tokenType = "";
						self.client = "";
						self.expiry = "";
						self.tokenUid = "";
					}
					
					if (request.status >= 400)
						self.runtime.trigger(cr.plugins_.Rails_Devise_Auth.prototype.cnds.OnError, self);
					else
					{
						// In node-webkit, don't trigger 'on success' with empty string if file not found.
						// In a browser also don't trigger 'on success' if the returned string is empty and the status is 0,
						// which is what happens when onerror is about to fire.
						if ((!isNWjs || self.lastData.length) && !(!isNWjs && request.status === 0 && !self.lastData.length))
							console.log(self);
							self.runtime.trigger(cr.plugins_.Rails_Devise_Auth.prototype.cnds.OnComplete, self);
					}
				}
			};
			
			if (!this.runtime.isWindowsPhone8)
			{
				request.onerror = errorFunc;
				request.ontimeout = errorFunc;
				request.onabort = errorFunc;
				request["onprogress"] = progressFunc;
			}
			
			request.open(method_, url_);
			
			if (!this.runtime.isWindowsPhone8)
			{
				// IE requires timeout be set after open()
				if (this.timeout >= 0 && typeof request["timeout"] !== "undefined")
					request["timeout"] = this.timeout;
			}
			
			// Workaround for CocoonJS bug: property exists but is not settable
			try {
				request.responseType = "text";
			} catch (e) {}
			
			if (data_)
			{
				if (request["setRequestHeader"] && !next_request_headers.hasOwnProperty("Content-Type"))
				{
					request["setRequestHeader"]("Content-Type", "application/x-www-form-urlencoded");
				}
			}
			
			// Apply custom headers
			if (request["setRequestHeader"])
			{
				var p;
				for (p in next_request_headers)
				{
					if (next_request_headers.hasOwnProperty(p))
					{
						try {
							request["setRequestHeader"](p, next_request_headers[p]);
						}
						catch (e) {}
					}
				}
				
				// Reset for next request
				next_request_headers = {};
			}
			
			// Apply MIME type override if one set
			if (next_override_mime && request["overrideMimeType"])
			{
				try {
					request["overrideMimeType"](next_override_mime);
				}
				catch (e) {}
				
				// Reset for next request
				next_override_mime = "";
			}

			if (data_)
				request.send(data_);
			else
				request.send();
			
		}
		catch (e)
		{
			errorFunc();
		}
	};
	
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{
		propsections.push({
			"title": "Auth Token",
			"properties": [
				{"name": "Last data", "value": this.lastData, "readonly": true},
				{"name": "Token", "value": this.token, "readonly": true},
				{"name": "Token Type", "value": this.tokenType, "readonly": true},
				{"name": "Client", "value": this.client, "readonly": true},
				{"name": "Expiry", "value": this.expiry, "readonly": true},
				{"name": "TokenUid", "value": this.tokenUid, "readonly": true}
			]
		});
	};
	/**END-PREVIEWONLY**/
	

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	// the example condition
	// Cnds.prototype.MyCondition = function (myparam)
	// {
		// return true if number is positive
		// return myparam >= 0;
	// };
	Cnds.prototype.OnComplete = function (tag)
	{
		return cr.equals_nocase(tag, this.curTag);
	};
	
	Cnds.prototype.OnError = function (tag)
	{
		return cr.equals_nocase(tag, this.curTag);
	};
	
	Cnds.prototype.OnProgress = function (tag)
	{
		return cr.equals_nocase(tag, this.curTag);
	};
	
	
	pluginProto.cnds = new Cnds();
	


	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.Request = function (tag_, url_)
	{
		this.doRequest(tag_, url_, "GET");
	};
	
	Acts.prototype.RequestFile = function (tag_, file_)
	{
		this.doRequest(tag_, file_, "GET");
	};
	
	Acts.prototype.Post = function (tag_, url_, data_, method_)
	{
		this.doRequest(tag_, url_, method_, data_);
	};
	
	Acts.prototype.SetTimeout = function (t)
	{
		this.timeout = t * 1000;
	};
	
	Acts.prototype.SetHeader = function (n, v)
	{
		next_request_headers[n] = v;
	};
	
	Acts.prototype.OverrideMIMEType = function (m)
	{
		next_override_mime = m;
	};

	//Acts.prototype.Create = function (resourceName, data)
	//{
		//console.log("Create action");
		//var xhr = new XMLHttpRequest();

		//xhr.open("POST", baseURI +"/"+ resourceName +"/", true);
		//xhr.setRequestHeader("Content-Type", "application/json");
		//xhr.overrideMimeType("application/json");

	    //xhr.send(data);

	    //return xhr;
		// make the ajax call
		// on response, parse it
		// i think this is where I define ResourceID, ResourceName, and ResourceJSON

	//};
	
	
	pluginProto.acts = new Acts();
	


	//////////////////////////////////////
	// Expressions
	function Exps() {};

	Exps.prototype.LastData = function (ret)
	{
		ret.set_string(this.lastData);
	};
	
	Exps.prototype.Progress = function (ret)
	{
		ret.set_float(this.progress);
	};

	Exps.prototype.Token = function (ret)
	{
		ret.set_string(this.token);
	};

	Exps.prototype.TokenType = function (ret)
	{
		ret.set_string(this.tokenType);
	};

	Exps.prototype.Client = function (ret)
	{
		ret.set_string(this.client);
	};

	Exps.prototype.Expiry = function (ret)
	{
		ret.set_string(this.expiry);
	};

	Exps.prototype.TokenUid = function (ret)
	{
		ret.set_string(this.tokenUid);
	};		
	// 'ret' must always be the first parameter - always return the expression's result through it!
	//Exps.prototype.getResourceID = function (ret)	{ ret.set_int(ResourceID); };
	//Exps.prototype.getResourceName = function (ret)	{ ret.set_string(ResourceName); };
	//Exps.prototype.getResourceJSON = function (ret)	{ ret.set_string(ResourceJSON); };
	
	
	pluginProto.exps = new Exps();

}());
