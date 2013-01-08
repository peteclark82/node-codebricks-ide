var path = require("path"), colors = require("colors"), $f = require("fluid");
var cb = require("codebricks");

var config = {
	sources : require("codebricks-noodle").getSources(),
	repositoryBrickTypeId : "codebricks.brickRepositories.fileSystem",
	setupRepository : function(repoBrick, callback) {
		repoBrick.path = path.resolve(__dirname, "bricks");
		callback();
	}
};

setupEnvironment(config, function(err, env) {
	env.methods.BrickTypes.getBrick({ id : "ideServer", depth : true }, function(err, brick) {
		if (err) { env.log("error", JSON.stringify(err, null, 2)); } else {
			env.log("data", require("util").inspect(brick, null, null, true));	
			brick.start({}, function(err) {
				if (err) { env.log("error", JSON.stringify(err, null, 2)); } else {
					env.log("info", "Running IDE server...");
				}
			});
		}
	});
});

function setupEnvironment(options, callback) {
	cb.createEnvironment({
		definitions : options.sources
	}, function(err, env) {
		if (err) { env.log("error", JSON.stringify(err, null, 2)); } else {		
			env.methods.BrickTypes.createBrick(options.repositoryBrickTypeId, function(err, repoBrick) {
				if (err) { env.log("error", JSON.stringify(err, null, 2)); } else {
					options.setupRepository(repoBrick, function(err) {
						env.methods.BrickTypes.registerRepository(repoBrick, function(err) {
							if (err) { env.log("error", JSON.stringify(err, null, 2)); } else {
								callback(null, env);
							}
						});
					});
				}
			});
		}
	});
}