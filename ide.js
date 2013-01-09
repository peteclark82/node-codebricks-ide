var path = require("path"), colors = require("colors"), $f = require("fluid"),
		async = require("async");
var cb = require("codebricks");

var config = {
	sources : require("codebricks-noodle").getSources(),
	repositoryBrickTypeId : ["codebricks.brickRepositories.fileSystem", "codebricks.brickRepositories.fileSystem"],
	setupRepository : function(repoBrick, index, callback) {
		switch (index) {
			case 0:
				repoBrick.path = path.resolve(__dirname, "bricks");
				break;
			case 1:
				repoBrick.path = path.resolve(__dirname, "bricksOutput");
				break;
		}
		callback();
	}
};

setupEnvironment(config, function(err, options) {
	var env = options.env;
	var repoBricks = options.repoBricks;
	env.methods.BrickTypes.getBrick({ id : "ideServer", depth : true }, function(err, brick) {
		if (err) { env.log("error", JSON.stringify(err, null, 2)); } else {
			env.log("data", require("util").inspect(brick, null, null, true));	
			brick.start({}, function(err) {
				if (err) { env.log("error", JSON.stringify(err, null, 2)); } else {
					env.log("info", "Running IDE server...");
					repoBricks[1].save({ brick : brick, depth : true }, function(err) {
						
						if (err) {
							env.log("error", JSON.stringify(err, null, 2));
						} else {
							env.log("info", "Brick SAVED!!!");
						}
					});
				}
			});
		}
	});
});

function setupEnvironment(options, callback) {
	cb.createEnvironment({
		definitions : options.sources
	}, function(err, env) {
		if (err) { console.log("error", JSON.stringify(err, null, 2).red.bold); } else {		
			var repoBricks = [];
			async.forEachSeries(options.repositoryBrickTypeId, function(repoBrickTypeId, nextRepo) {
				env.methods.BrickTypes.createBrick(repoBrickTypeId, function(err, repoBrick) {
					if (err) { nextRepo(err); } else {
						var index = repoBricks.length;
						repoBricks.push(repoBrick);
						options.setupRepository(repoBrick, index, nextRepo);
					}
				});
			}, function(err) {
				if (err) { callback(err); } else {
					env.methods.BrickTypes.registerRepository(repoBricks[0], function(err) {
						if (err) { env.log("error", JSON.stringify(err, null, 2)); } else {
							callback(null, { env : env, repoBricks : repoBricks });
						}
					});
				}
			});
		}
	});
}