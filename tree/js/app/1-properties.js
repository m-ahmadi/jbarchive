var currentUser,
	currentUsername,
	treeStructure,
	isTreeLoaded = false,
	isTreeModified = false,
	
	fullPriv = {
		groups: {
			forView: [],
			forSend: []
		},
		users: {
			forView: [],
			forSend: []
		}
	},
	halfPriv = {
		groups: {
			forView: [],
			forSend: []
		},
		users: {
			forView: [],
			forSend: []
		}
	};