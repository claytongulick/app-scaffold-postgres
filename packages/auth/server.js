/**
 server.js

 Starting point for launching server.

 @author Clay Gulick
 @email clay@ratiosoftware.com
**/
import '../../load-env.js';
import config from './config/config.js';
import Logging from 'common/server/logging.js';
let logger = Logging.getLogger(config.logging);
import router from './server/routes/index.js';
import ExpressServer from 'common/server/express-server.js';
let app = ExpressServer(logger, [router], config.express);
import ClusterServer from 'common/server/cluster-server.js';

let server = new ClusterServer(app, logger, config.cluster);
server.start();