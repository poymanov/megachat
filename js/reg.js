define('reg',function(){

	// Поле логин
	var regLogin = document.getElementById('regLogin');

	// Форма регистрации
	var regBlock = document.querySelector('.reg');

	// Блок блокиратор
	var blockerBlock = document.querySelector('.blocker');

	// Поле ФИО
	var regName = document.getElementById('regName');

	// Поле с ошибкой
	var regError = document.querySelector('.reg__error');

	// Регистрация в чате
	var regButton = document.querySelector('.reg__submit');

	// События валидации ввода для поля логина
	if(regLogin) {

		regLogin.addEventListener('input',function(event){
			var e = event||window.event;
			

			// спец. сочетания - не обрабатываем
			if (e.ctrlKey || e.altKey || e.metaKey) {
				return true;
			};

			var reg = new RegExp('^[A-Za-z0-9-_]', 'g');
			
			// Текущий вводимый символ
			var char = this.value.substr(-1);

			if(!char.match(reg)){
				this.value = this.value.replace(char,'');
			}
			
		});
	}

	return {
		regBlock: regBlock,
		blockerBlock: blockerBlock,
		regButton: regButton,
		regName: regName,
		regError: regError,
		regLogin: regLogin
	}
});