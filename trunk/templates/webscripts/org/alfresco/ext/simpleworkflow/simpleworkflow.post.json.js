var node;
var nodeRef = new Array();

var simpleworkflow;

var error = false;

//Make sure the simpleworkflow object was passed in the json and get it
if (json.isNull("simpleworkflow")) {
        error = true;
        status.code = 400;
        status.message = "simpleworkflow not found in json object";
        status.redirect = true;
} else {
        simpleworkflow = json;
}

// What node do we want to work on
nodeRef[0] = url.templateArgs.store_type;
nodeRef[1] = url.templateArgs.store_id;
nodeRef[2] = url.templateArgs.id;

if (nodeRef[0] == undefined || nodeRef[0].length == 0) {
	error = true;
	status.code = 400;
	status.message = "Store type is missing from URI.";
	status.redirect = true;
}

if (nodeRef[1] == undefined || nodeRef[1].length == 0) {
	error = true;
	status.code = 400;
	status.message = "Store id is missing from URI.";
	status.redirect = true;
}

if (nodeRef[2] == undefined || nodeRef[2].length == 0) {
	error = true;
	status.code = 400;
	status.message = "ID is missing from URI.";
	status.redirect = true;
}
		
//Get the node
if (!error) {
	node = search.findNode("node", nodeRef);
}
	
//If it does not exist
if (node == null) {
	status.code = 404;
	status.message = "Node not found: "+nodeRef[0]+"://"+nodeRef[1]+"/"+nodeRef[2];
	status.redirect = true;
} else {

	//Check for the simpleworkflow aspect
	if (!node.hasAspect("app:simpleworkflow")){
		if (!simpleworkflow.get("simpleworkflow").isNull("accept")) {
			accept = simpleworkflow.get("simpleworkflow").get("accept");
			
			var props = new Array();
			
			if (accept.isNull("name")) {
				status.code = 400;
				status.message = "required parameter name is missing in the accept obejct."
				status.redirect = true;
			} else {
				props["app:approveStep"] = accept.get("name");
			}
			
			if (accept.isNull("folder")) {
				status.code = 400;
				status.message = "required parameter folder is missing in the accept object."
				status.redirect = true;
			} else {
				var folder = search.findNode(accept.get("folder"));
				
				if (folder != null) {
					props["app:approveFolder"] = folder;
				} else {
					status.code = 404;
					status.message = "accept.folder nodeRef ("+accept.get("folder")+") does not exist.";
					status.redirect = true;
				}
			}
			
			if (accept.isNull("move")){
				status.code = 400;
				status.message = "required parameter move is missing in the accept object."
				status.redirect = true;
			}else {
				props["app:approveMove"] = eval('('+accept.get("move")+')');
			}
			
			if (!simpleworkflow.get("simpleworkflow").isNull("reject")) {
				reject = simpleworkflow.get("simpleworkflow").get("reject");
				
				if (reject.isNull("name")) {
					status.code = 400;
					status.message = "required parameter name is missing in the reject obejct."
					status.redirect = true;
				} else {
					props["app:rejectStep"] = reject.get("name");
				}
				
				if (reject.isNull("folder")) {
					status.code = 400;
					status.message = "required parameter folder is missing in the reject object."
					status.redirect = true;
				} else {
					var folder = search.findNode(reject.get("folder"));
					
					if (folder != null) {
						props["app:rejectFolder"] = folder;
					} else {
						status.code = 404;
						status.message = "reject.folder nodeRef ("+reject.get("folder")+") does not exist.";
						status.redirect = true;
					}
				}
				
				if (reject.isNull("move")){
					status.code = 400;
					status.message = "required parameter move is missing in the reject object."
					status.redirect = true;
				}else {
					props["app:rejectMove"] = eval('('+reject.get("move")+')');
				}
			}
			
			model.success = node.addAspect("app:simpleworkflow", props);
		} else {
			status.code = 400;
			status.message = "required parameter accept is missing."
			status.redirect = true;
		}
		
	} else {
		status.code = 400;
		status.message = node.name+" already has the aspect: app:simpleworkflow applied.";
		status.redirect = true;
	}
}