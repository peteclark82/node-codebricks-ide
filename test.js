var path = require("path"), colors = require("colors"), $f = require("fluid");
var cb = require("codebricks");


setupEnvironment(function(err, env) {
	if (true) {
		env.methods.BrickTypes.getBrick({ id : "expressServer1", deep : true }, function(err, brick) {
			if (err) { console.error(JSON.stringify(err, null, 2).bold.red); } else {
				console.log(require("util").inspect(brick, null, null, true));	
				brick.start({}, function(err) {
					if (err) { console.error(JSON.stringify(err, null, 2).bold.red); } else {
						console.log("FINSIHED");
					}
				});
			}
		});
	} else {		
		$f(env.methods.BrickTypes)
			({name:"httpServer"}).createBrick("codebricks.net.httpServer")
			({name:"httpServer"}).createBrick("codebricks.net.httpServer")
		.go(function(err, result) {
			if (err) { console.error(JSON.stringify(err, null, 2).bold.red); } else {
				var httpServer1 = result.httpServer[0];
				var httpServer2 = result.httpServer[1];

				httpServer1.__.id = "httpServer1";
				
				httpServer2.__.id = "httpServer2";
				httpServer2.port = 9124;
				
				httpServer1.handlers.push(httpServer2);
				httpServer1.something.prop1 = httpServer2;
				httpServer2.handlers.push(httpServer1);
				httpServer2.something.deep.deeper.deepProp.myBrick = httpServer1;
				
				
				httpServer1.start({}, function(err) {
					if (err) { console.error(JSON.stringify(err, null, 2).bold.red); } else {							
						env.methods.BrickTypes.saveBrick({ brick : httpServer1, deep : true }, function(err) {
							if (err) { console.error(JSON.stringify(err, null, 2).bold.red); } else {
								console.log("BRICK SAVED");
							}
						});
					}
				});
			}
		});		
	}
});

function setupEnvironment(callback) {
	cb.createEnvironment({
		definitions : require("noodle").getSources()
	}, function(err, env) {
		if (err) { console.error(JSON.stringify(err, null, 2).bold.red); } else {		
			console.log("TESTING...");

			env.methods.BrickTypes.createBrick("codebricks.brickRepositories.fileSystem", function(err, repoBrick) {
				if (err) { console.error(JSON.stringify(err, null, 2).bold.red); } else {
					repoBrick.path = path.resolve(__dirname, "testBricks");
					env.methods.BrickTypes.registerRepository(repoBrick, function(err) {
						if (err) { console.error(JSON.stringify(err, null, 2).bold.red); } else {
							callback(null, env);
						}
					});
				}
			});
		}
	});
}