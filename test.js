var path = require("path"), colors = require("colors"), $f = require("fluid");
var cb = require("codebricks");

setupEnvironment(function(err, env) {
	if (false) {
		env.methods.BrickTypeDefinition.getBrick({ id : "httpServer1" }, function(err, brick) {
			console.log(brick);			
			if (err) { console.error(JSON.stringify(err, null, 2).bold.red); } else {
				brick.start({}, function(err) {
					if (err) { console.error(JSON.stringify(err, null, 2).bold.red); } else {
					}
				});
			}
		});
	} else {		
		$f(env.methods.BrickTypeDefinition)
			({name:"httpServer"}).createBrick("codebricks.noodle.httpServer")
			({name:"httpServer"}).createBrick("codebricks.noodle.httpServer")
		.go(function(err, result) {
			if (err) { console.error(JSON.stringify(err, null, 2).bold.red); } else {
				var httpServer1 = result.httpServer[0];
				var httpServer2 = result.httpServer[1];

				httpServer1.__.id = "httpServer1";
				httpServer1.port = 9123;
				
				httpServer2.__.id = "httpServer2";
				httpServer2.port = 9124;
				
				httpServer1.start({}, function(err) {
					if (err) { console.error(JSON.stringify(err, null, 2).bold.red); } else {							
						env.methods.BrickTypeDefinition.saveBrick({ brick : httpServer1 }, function(err) {
							if (err) { console.error(JSON.stringify(err, null, 2).bold.red); } else {
								console.log("BRICK SAVED");
							}
						});
					}
				});
			}
		});
		/*
		env.methods.BrickTypeDefinition.createBrick("codebricks.noodle.httpServer", function(err, serverBrick) {
			if (err) { console.error(JSON.stringify(err, null, 2).bold.red); } else {
				serverBrick.__.id = "httpServer1";
				serverBrick.port = 9123;
				serverBrick.start({}, function(err) {
					if (err) { console.error(JSON.stringify(err, null, 2).bold.red); } else {							
						env.methods.BrickTypeDefinition.saveBrick({ brick : serverBrick }, function(err) {
							if (err) { console.error(JSON.stringify(err, null, 2).bold.red); } else {
								console.log("BRICK SAVED");
							}
						});
					}
				});
			}
		});
		*/
		
	}
});

function setupEnvironment(callback) {
	cb.createEnvironment({
		definitions : require("noodle").getSources()
	}, function(err, env) {
		if (err) { console.error(JSON.stringify(err, null, 2).bold.red); } else {		
			console.log("TESTING...");

			env.methods.BrickTypeDefinition.createBrick("codebricks.brickRepositories.fileSystem", function(err, repoBrick) {
				if (err) { console.error(JSON.stringify(err, null, 2).bold.red); } else {
					repoBrick.path = path.resolve(__dirname, "testBricks");
					env.methods.BrickTypeDefinition.registerRepository(repoBrick, function(err) {
						if (err) { console.error(JSON.stringify(err, null, 2).bold.red); } else {
							callback(null, env);
						}
					});
				}
			});
		}
	});
}