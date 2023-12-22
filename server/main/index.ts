import express, { Express, Request, Response, NextFunction } from "express";
import { Session } from "./modules/Session"


const app: Express = express();
var allSessions = new Map<string, Session>();

function CreateNewSession(sessionid: string) {

	let newsession: Session = new Session();
	allSessions.set(sessionid, newsession);
	return newsession

}

function JoinSession(sessionid: string, ip: string) {

	var desiredsession = allSessions.get(sessionid)
	if (desiredsession !== undefined) {
		desiredsession.AddClient(ip)
		return true //return if the session was joined successfully or not
	}
	return false

}

function ConfigureCORSHeaders(res: Response) {
	res.header("Access-Control-Allow-Origin", "http://localhost:5173");
	res.header("Access-Control-Allow-Methods", "POST, GET")
}

app.use((req: Request, res: Response, next: NextFunction) => {
	ConfigureCORSHeaders(res);
	next();
})


app.get("/api/host/:sessionid", (req: Request, res: Response) => {

	if (req.params.sessionid !== undefined && req.ip !== undefined) {

		let sessionid: string = req.params.sessionid;
		let ip: string = req.ip;

		//create new session
		let newsession = CreateNewSession(sessionid) 

		//attempt to join newly created session
		let success = JoinSession(sessionid, req.ip)

		if (success) {
			res.status(201).json(
				{
					status: "Successfully created session",
					sessionid: req.params.sessionid, 
				}
			);
			return; //guard clause
		}

	}

	res.status(400).send()

});

app.get("/api/join/:sessionid", (req: Request, res: Response) => {
	
	if (req.params.sessionid !== undefined && req.ip !== undefined) {
		
		let sessionid: string = req.params.sessionid;
		let ip: string = req.ip;

 		//attempt to join 
		let success = JoinSession(sessionid, ip);

		if (success) {
			res.status(202).json(
				{
					status: "Successfully joined session",
					sessionid: req.params.sessionid,
				}
			);
			return; //guard clause 
		} 

	}

	res.status(400).send()

});

app.listen(9999, () => {
	console.log("server started")
})