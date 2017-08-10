const Ajv = require('ajv');
const ajv = new Ajv();

const cvUser = {
	"additionalProperties" : false,
	"type" : "object",
	"properties" : {
		"name": {"type":"string"},
		"email": {"type":"string", "format":"email"},
		"id": {"type": "integer"},
		"photo" : {"type":"string"},
		"belts" : {
			"type": "array",
			"items":[
				{
					"type": "object",
					"additionalProperties" : false,
						"properties" : {
						"belt" : {"type": "string"},
						"batch" : {"type": "integer"}
					}
				}
			]
		},
		"skills": {
			"type": "array",
			"items": [{"type":"string"}]
		},
		"biography": {"type": "string"},
		"phone": {"type":"string"},
		"interests": {
			"type": "array",
			"items": [{"type":"string"}]
		},
		"hobbies": {
			"type": "array",
			"items": [{"type":"string"}]
		},
		"website": {"type": "string"},
		"facebook": {"type":"string"},
		"twitter": {"type":"string"},
		"linkedin": {"type":"string"},
		"github": {"type":"string"},

		"lenguages": {
			"type": "array",
			"items": [{"type":"string"}]
		}

	},
	"required":["name","email"]
}
var vcvUser = ajv.compile(cvUser)

module.exports.validateCvUser =  function(data){
	return vcvUser(data);
}
