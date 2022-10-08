import Logger from "cutesy.js"
import api from "./api/index.js"
import cron from "./cron/index.js"
import { connect } from "./helper/database.js"

const logger = new Logger().addTimestamp("hh:mm:ss").changeTag("Main").purpleBlue()

logger.send("Starting Advance Version Alpha-3.1.0")

await connect()

await api()

cron()