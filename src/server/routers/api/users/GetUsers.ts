import {mongo} from "../../../../start";
import UserSchema from "../../../../db/schema/UserSchema";

export default class GetUsers {
    private constructor() {
    }

    static listUsers(req, res): void {
        // list users
        mongo.getAll(new UserSchema, (err, result) => {
            if (err) {
                res.json(err);
            } else {
                res.json(result);
            }
        });
    }

    static createUser(req, res): void {
        // create user
        let content = req.body;
        let result = {
            success: false,
            message: "Content is invalid."
        };
        const required_fields = {
            'name': 'string',
            'email': 'string',
            'password': 'string'
        };

        // validate input
        if (!content || typeof content != "object") {
            res.status(400).json(result);
            return;
        }

        for (let field in required_fields) {
            if (!(field in content)) {
                result.message = "Required field '" + field + "' is missing.";
                res.status(400).json(result);
                return;
            }
            if (typeof content[field] != required_fields[field]) {
                result.message = "Field '" + field + "' is of type " + (typeof content[field]) +
                    " (" + JSON.stringify(content[field]) + "), expected " + required_fields[field];
                res.status(400).json(result);
                return;
            }
        }

        // check if there is already a user with that name
        let schema = new UserSchema;
        schema.name = content.name;
        mongo.getOne(schema, (err, user) => {
            if (err) {
                res.status(500).json(err);
                return;
            }
            if (user) {
                result.message = "There is already a user with the name '" + content['name'] + "'.";
                console.log(user);
                res.status(400).json(result);
                return;
            }
            schema.email = content.email;
            schema.set_password(content.password);
            mongo.insert(schema, (err) => {
                if (err) {
                    res.status(500).json(err);
                    return;
                }
                result.success = true;
                result.message = "User created successfully.";
                res.status(200).json(result);
            });
        });
    }

    static getUser(req, res): void {
        // get a user
        if (!req.params.name) {
            // no name parameter
            res.status(400).end();
        }
        let name = req.params.name;
        let schema = new UserSchema;
        schema.name = name;
        mongo.getOne(schema, (err, result) => {
            if (err) {
                res.json(err);
            } else if (result) {
                res.json(result);
            } else {
                res.status(404).end();
            }
        });
    }
}