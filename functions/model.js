var userModel = require('./userModel');

/*const data = {
	uid : "454454",
	name : "Emmanuel",
	user : "juanito",
	email : "emma@gmail.com"
}
*/
const data = {
			
	photo : "http://google.com",
	cintas : [
		{cinta: "Roja", batch: 14},
		{cinta: "Negra Backend", batch: 15}
	],
	bio: "Mi nombre es emmanuel",
	skills: ["a","b"],
	telefono: "5560793169",
	interests: ["a","b"],
	hoobies: ["a","b"],
	website: "http://google.com",
	social: {"twitter":"http://google.com"},
	lenguages: ["ingles","ruso"]
	
	
}
var r = userModel.validateCvUser(data);

console.log(r);

