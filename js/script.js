// Проверка на допустимость ввода в поле логин

// Получение символа нажатой клавиши 
function getChar(event) {
	return String.fromCharCode(event.keyCode || event.charCode);
}

// Форма регистрации
var regBlock = document.querySelector('.reg');

// Блок блокиратор
var blockerBlock = document.querySelector('.blocker');

// Поле ФИО
var regName = document.getElementById('regName');

// Поле логин
var regLogin = document.getElementById('regLogin');

// Поле с ошибкой
var regError = document.querySelector('.reg__error');

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
var usersListCompile = Handlebars.compile(usersList);

// Блок-обертка для списка пользователей
var usersContent = document.querySelector('.left__content');

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

// Регистрация в чате
var regButton = document.querySelector('.reg__submit');

regButton.addEventListener('click',function(e){
	e.preventDefault();

	// Проверяем чтобы были заполнены поля ФИО и логин
	if(!regName.value.trim()) {
		regError.innerHTML = "Не заполнено поле ФИО";
		regError.style.display = "block";
		return;
	}

	if(!regLogin.value.trim()) {
		regError.innerHTML = "Не заполнен логин";
		regError.style.display = "block";
		return;
	}

	// Если ошибок нет, скрываем блок с ошибкой
	regError.innerHTML = "";
	regError.style.display = "none";

	// Создаем соединение с сервером
	var connection = new WebSocket('ws://localhost:5000');
	
	// Обработка ошибки соединения с сервером
	connection.onerror = function(e) {
		alert("Ошибка соединения с сервером");
	};

	// Отправляем запрос на регистрацию
	connection.onopen = function(e) {
		// Формируем объект
		var newUser = {"op":"reg", 
									 "data": {
									 		"name": regName.value,
									 		"login": regLogin.value
									 }};

		// Формируем JSON для отправки на сервер
		var newUserJson = JSON.stringify(newUser);

		connection.send(newUserJson);

	}

	// Прослушка сообщения сервера
	connection.onmessage = function(e) {

		// Получаем ответ сервера
		var answerJson = e.data;

		// Если вернулся пустой ответ, ничего не делаем
		if (!answerJson) {
			return;
		}

		// Преобразуем ответ в объект
		var answerObj = JSON.parse(answerJson);

		// Устанавливаем тип ответа
		var answerType = answerObj['op'];

		// В зависимости от типа ответа проводим действия
		if (answerType == "error") {
			// Если такой пользователь уже есть

			// Сообщаем об ошибке в форму регистрации
			regError.innerHTML = "Пользователь с таким именем уже существует";
			regError.style.display = "block";
			
			// Закрываем соедиение
			connection.close();
		} else if (answerType == "token") {
			// Если регистрация прошла успешно

			// Скрываем форму
			regBlock.style.display = "none";

			// И блок блокиратор
			blockerBlock.style.display = "none";

			// Записываем токен текущего пользователя
			userToken = answerObj['op'];

			// Записываем имя текущего пользователя
			userName = regName.value;

			// Записываем логин текущего пользователя
			userLogin = regLogin.value;

			// Выводим в заголовок страницы имя текущего пользователя
			userTitle.innerHTML = "Добро пожаловать, "+userName+"!";

			// Список пользователей онлайн в чате
			var usersOnline = answerObj['users'];

			// Выводим список пользователей в чате
			var templateUsersList = usersListCompile({list: usersOnline});
			usersContent.innerHTML = templateUsersList;

		} else if (answerType == "user-enter") {
			// Если новый пользователь вошел в чат

			// Получаем элемент список пользователей
			var leftList = document.querySelector('.left__list');

			// Добавляем нового пользователя в список
			var userEnter = document.createElement('li');
			userEnter.classList.add('left__item');
			userEnter.innerHTML = answerObj['user']['name'];
			leftList.appendChild(userEnter);

		}
		
	}

});

