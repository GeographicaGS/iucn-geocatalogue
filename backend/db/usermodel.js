var db = require('./db.js');
var BaseModel = db.BaseModel;
var md5 = require('MD5');

function UserModel() {

}

UserModel.prototype.getUser = function(username,callback){
	BaseModel.query(callback, 'select u.name,p.name as profile,surname,email,password from data.user u inner join data.profile p on u.id_profile = p.id where email=$1', [username]);
};


UserModel.prototype.getUserList = function(callback){
	BaseModel.query(callback, 'select id, name,surname,email from data.user ORDER BY name||surname');
};

UserModel.prototype.getUserInfo = function(id,callback){
	BaseModel.query(callback, 'select u.id, u.name, u.surname, u.email, u.id_profile, p.name as profile from data.user u INNER JOIN data.profile p on p.id=u.id_profile  where u.id=$1', [id]);
};


UserModel.prototype.updateUser = function(user, callback){
	BaseModel.query(callback, 'UPDATE data.user '+
							   'SET name=$1, surname=$2, email=$3, password=$4, id_profile=$5 '+
							 'WHERE id=$6',[user.name, user.surname, user.email, user.password, user.id_profile, user.id]);
};

UserModel.prototype.createUser = function(user, callback){
	BaseModel.query(callback, 'INSERT INTO data.user(id_profile, name, surname, email, password) VALUES ($5, $1, $2, $3, $4);', [user.name, user.surname, user.email, user.password, user.id_profile]);
};

UserModel.prototype.removeUser = function(id,callback){

	BaseModel.query(function(){

		BaseModel.query(callback, 'DELETE FROM data.user WHERE id=$1', [id]);

	}, 'DELETE FROM data.incidence WHERE id_user=$1', [id]);
};


module.exports = UserModel;

