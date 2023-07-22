"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var api_1 = require("@semantic-api/api");
var _a = (0, api_1.defineDescription)({
    $id: 'person',
    required: [],
    properties: {
        name: {
            type: 'string'
        },
        job: {
            enum: [
                'driver',
                'baker',
                'programmer',
                'policeman'
            ]
        }
    }
}), Person = _a[0], description = _a[1];
exports.default = (function () { return ({
    item: Person,
    description: description,
    functions: (0, api_1.useFunctions)()([
        'getAll',
        'insert'
    ])
}); });
