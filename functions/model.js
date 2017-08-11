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
	biography: "Mi nombre es emmanuel",
	skills: ["a","b"],
	phone: "5560793169",
	interests: ["a","b"],
	hobbies: ["a","b"],
	website: "http://google.com",
	social: {"twitter":"http://google.com"},
	languages: ["ingles","ruso"]


}
var r = userModel.validateCvUser(data);

console.log(r);

