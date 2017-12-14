import {Router} from "../WebServer";

export default class ApiRouter extends Router {
    constructor() {
        super('/api');
        this.get('*', (req, res) => {
            res.send('This is the API route.');
        });
    }
}
