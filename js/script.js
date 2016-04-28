// Проверка на допустимость ввода в поле логин

// Получение символа нажатой клавиши 
function getChar(event) {
  return String.fromCharCode(event.keyCode || event.charCode);
}

var regLogin = document.getElementById('regLogin');

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