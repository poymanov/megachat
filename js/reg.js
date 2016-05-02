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

	// Получение символа нажатой клавиши 
	function getChar(event) {
		return String.fromCharCode(event.keyCode || event.charCode);
	}

	// События валидации ввода для поля логина
	if(regLogin) {

		regLogin.addEventListener('keypress',function(event){
			var e = event||window.event;
			
			// спец. сочетания - не обрабатываем
			if (e.ctrlKey || e.altKey || e.metaKey) {
				return true
			};

			var reg = new RegExp('^[A-Za-z0-9-_]', 'g');
			var char = getChar(e);
		
			if(!char.match(reg)){
				event.preventDefault();
			}
			
		});

		regLogin.addEventListener('paste',function(e){
			
			// Получаем данные из буфера обмены
			data = e.clipboardData.getData('text');
			var reg = new RegExp('^[A-Za-z0-9-_]', 'g');
			
			if(!data.match(reg)){
				event.preventDefault();
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