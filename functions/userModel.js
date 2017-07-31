const Ajv = require('ajv');
const ajv = new Ajv();

const newUser = {
	"additionalProperties": false,
	"type": "object",
	"properties": {
		"uid": {"type":"string"},
		"name": {"type":"string"},
		"user": {"type":"string"},
		"email": {"type":"string", "format":"email"}
	}
};

const cvUser = {
	"additionalProperties" : false,
	"type" : "object",
	"properties" : {
		"name": {"type":"string"},
		"email": {"type":"string", "format":"email"},
		"photo" : {"type":"string", "format": "uri"},
		"cintas" : {
			"type": "array",
			"items":[
				{
					"type": "object",
					"additionalProperties" : false,
						"properties" : {
						"cinta" : {"type": "string"},
						"batch" : {"type": "integer"}
					}
				}
			]
		},
		"skills": {
			"type": "array",
			"items": [{"type":"string"}]
		},
		"bio": {"type": "string"},
		"telefono": {"type":"string"},
		"interests": {
			"type": "array",
			"items": [{"type":"string"}]
		},
		"hoobies": {
			"type": "array",
			"items": [{"type":"string"}]
		},
		"website": {"type": "string", "format": "uri"},
		"social": {
			"type": "object",
			"additionalProperties": false,
			"properties": {
				"facebook": {"type":"string", "format": "uri"},
				"twitter": {"type":"string", "format": "uri"},
				"linkedin": {"type":"string", "format": "uri"},
				"github": {"type":"string", "format": "uri"}
			}
		},
		"lenguages": {
			"type": "array",
			"items": [{"type":"string"}]
		}

	}
}
var vnewUser = ajv.compile(newUser);
var vcvUser = ajv.compile(cvUser)

module.exports.validateNewUser =  function(data){
	return vnewUser(data)
}

module.exports.validateCvUser =  function(data){
	return vcvUser(data)
}
