define('messages',['handlebars'],function(handlebars){

	// Шаблон сообщения чата
	var messageChat = document.getElementById('messageChat').innerHTML;

	// Скомпилированный шаблон сообщения
	var messageChatCompile = handlebars.compile(messageChat);

	// Список сообщений чата
	var messagesList = document.querySelector('.right__list');

	// Кнопка отправить сообщение
	var sendButton = document.getElementById('sendMessage');

	// Поле с текстом сообщения
	var messageInput = document.getElementById('messageInput');

	return {
		messageChatCompile: messageChatCompile,
		messagesList: messagesList,
		messageInput: messageInput,
		sendButton: sendButton
	}
});