define('profile',['reg','users'],function(reg,users){
	// Ссылка вызова формы изменения аватара
	var newAvatarLink = document.querySelector('.left__profile-link');

	// Форма изменения аватара
	var newAvatar = document.querySelector('.new-avatar');

	// Кнопка закрытия форма изменения аватара
	var newAvatarClose = document.querySelector('.new-avatar__form-close');

	// Зона для загрузки файла
	var newAvatarUpload = document.querySelector('.new-avatar__upload');

	// Область вывода ошибки в форме загрузки аватара
	var newAvatarError = document.querySelector('.new-avatar__error');

	// Файл с изображением нового аватара
	var newAvatarFile = "";

	// Кнопка загрузка изображения
	var newAvatarSubmit = document.querySelector('.new-avatar__form-submit');

	// Аватар пользователя в левой части
	var profileAvatar = document.querySelector('.left__profile-avatar');

	// Открытие формы измения аватара
	newAvatarLink.addEventListener('click',function(e){

		e.preventDefault();

		// Отображаем блок блокиратор
		reg.blockerBlock.style.display = "block";

		// Отображаем форму изменения аватара
		newAvatar.style.display = "block";

		// Сбрасываем область просмотра изображения
		newAvatarUpload.innerHTML = "Загрузить сюда фото";

	});

	// Закрытие формы изменения аватара
	newAvatarClose.addEventListener('click',function(e){
		e.preventDefault();

		// Скрываем блок блокиратор
		reg.blockerBlock.style.display = "none";

		// Скрываем форму изменения аватара
		newAvatar.style.display = "none";

	});

		// События для формы загрузки нового аватара

	newAvatarUpload.addEventListener('dragover', function(e){
		e.stopPropagation();
	  e.preventDefault();
	  e.dataTransfer.dropEffect = 'copy';
	}, false);

	newAvatarUpload.addEventListener('drop', function(e){
		e.stopPropagation();
	  e.preventDefault();

	  var file = e.dataTransfer.files[0];

	  // Прерываем функцию, если возникает какая-то ошибка чтения файла
	  if(!file){
	  	return;
	  }

	  // Скрываем блок с описанием ошибки
	  newAvatarError.style.display = "none";
	  newAvatarError.innerHTML = "none";

	  // Ошибка: неверный тип файла
	  if(file['type'] != 'image/jpeg') {
	  	newAvatarError.style.display = "block";
	  	newAvatarError.innerHTML = "Неверный формат файла! Разрешен только JPEG!";
	  	return;
	  }

	  filesize = file['size'] / 1024;

	  // Ошибка: не более 512 кб
	  if(filesize > 512) {
	  	newAvatarError.style.display = "block";
	  	newAvatarError.innerHTML = "Превышение размера файла! Допустимый размер 512 кб!";
	  	return;
	  }

	  // Сохраняем файл в переменную
		newAvatarFile = file;
		
	  // Отображаем превью изображения
	  var fileReader = new FileReader();

	  fileReader.readAsDataURL(file);

	  fileReader.addEventListener('load',function(){

	  	// Убираем текст-подсказку
	  	newAvatarUpload.innerHTML = "";

	  	// Создаем изображение
	  	var previewImage = document.createElement('img');
	  	previewImage.classList.add('new-avatar__upload-preview');
			previewImage.src = this.result;

			// Выводим изображение
			newAvatarUpload.appendChild(previewImage);

	  });

	}, false);

	// Загрузка нового аватара
	newAvatarSubmit.addEventListener('click',function(e){
		e.preventDefault();

		// Отправляем изображение на сервер
		var xhr = new XMLHttpRequest();
		xhr.open('POST', 'http://localhost:5000/upload',true);

		newImage = new FormData();
		newImage.append('photo',newAvatarFile);
		newImage.append('token',users.userToken);
		xhr.send(newImage);

		xhr.onreadystatechange = function() {
		  if (xhr.readyState != 4) {return};

		  if (xhr.status != 200) {
		    // Если не удалось загрузить фотографию
	  		newAvatarError.style.display = "block";
	  		newAvatarError.innerHTML = "Ошибка загрузки фотографии";
		  } else {
		    // Если загрузка прошла успешно

				// Скрываем блок блокиратор
				reg.blockerBlock.style.display = "none";
				// Скрываем форму изменения аватара
				newAvatar.style.display = "none";
		  }

		}
	});

	return {
		profileAvatar: profileAvatar
	}
});