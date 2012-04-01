var node;
var nodeRef = new Array();

var error = false;

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
	if (node.hasAspect("app:simpleworkflow")){
		//Is this an approval or a rejection?
		if (url.match == "/simpleworkflow/approve/") {
			destination = node.properties["app:approveFolder"];
			//Make sure the destination is defined
			if (destination != null ) {
				//is this a move or a copy?
				if (node.properties["app:approveMove"]) {
					if (node.move(destination)){
						model.success = true;
						model.destination = destination.displayPath+"/"+destination.name;
						model.step = node.properties["app:approveStep"];
						model.move = node.properties["app:approveMove"];
						
						//once it is moved we need to remove the aspect
						node.removeAspect("app:simpleworkflow");
					} else {
						model.success = false;
						model.message = "Approved move failed";
					}
				} else {
					success = node.copy(destination);
					
					if (success != null) {
						model.success = true;
						model.destination = destination.displayPath+"/"+destination.name;
						model.step = node.properties["app:approveStep"];
						model.move = node.properties["app:approveMove"];
						
						//once it is copied we need to remove the aspect from copy and original
						node.removeAspect("app:simpleworkflow");
						success.removeAspect("app:simpleworkflow");
					} else {
						model.success = false;
						model.message = "Approved copy failed";
					}
				}
			}
		}
		else if (url.match == "/simpleworkflow/reject/") {
			destination = node.properties["app:rejectFolder"];
			
			if (destination != null ) {
				//is this a move or a copy?
				if (node.properties["app:rejectMove"]) {
					if (node.move(destination)){
						model.success = true;
						model.destination = destination.displayPath+"/"+destination.name;
						model.step = node.properties["app:rejectStep"];
						model.move = node.properties["app:rejectMove"];
						
						//once it is moved we need to remove the aspect
						node.removeAspect("app:simpleworkflow");
					} else {
						model.success = false;
						model.message = "Reject move failed";
					}
				} else {
					success = node.copy(destination);
					
					if (success != null) {
						model.success = true;
						model.destination = destination.displayPath+"/"+destination.name;
						model.step = node.properties["app:rejectStep"];
						model.move = node.properties["app:rejectMove"];
						
						//once it is copied we need to remove the aspect from copy and original
						node.removeAspect("app:simpleworkflow");
						success.removeAspect("app:simpleworkflow");
					} else {
						model.success = false;
						model.message = "Reject copy failed";
					}
				}
			}
		} 
	} else {
		status.code = 400;
		status.message = node.name+" does not have the aspect: app:simpleworkflow. No simpleWorkflow has been applied.";
		status.redirect = true;
	}
}