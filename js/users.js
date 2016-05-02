define('users',['handlebars'],function(handlebars){
	// Текущий токен зарегистрированного пользователя
	var userToken = "";

	// Имя текущего пользователя
	var userName = "";

	// Логин текущего пользователя
	var userLogin = "";

	// Поле с именем текущего пользователя
	var userTitle = document.querySelector('.left__profile-user');

	// Шаблон общего списка пользователей
	var usersList = document.getElementById('usersList').innerHTML;

	// Скомпилированный шаблон списка пользователя
	var usersListCompile = handlebars.compile(usersList);

	// Блок-обертка для списка пользователей
	var usersContent = document.querySelector('.left__content');

	return {
		userToken: userToken,
		userName: userName,
		userLogin: userLogin,
		userTitle: userTitle,
		usersListCompile: usersListCompile,
		usersContent: usersContent
	}
});