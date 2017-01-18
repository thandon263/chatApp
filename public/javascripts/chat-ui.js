function divEscapeContentElement(message) {
  return $('<div></div>').text(message);
}

function divSystemContentElement(message) {
  return $('<div></div>').html('<i>' + message + '</i>');
}

// Processing Raw user input
let processingUserInput = (chatApp, socket) => {
  let message = $('#send-message').val();
  let systemMessage;

  if (message.charAt(0) == '/') {
    systemMessage = chatApp.processCommand(message);
    if (systemMessage) {
      $('#messages').append(divSystemContentElement(systemMessage));
      }

    } else {
      chatApp.sendMessage($('#room').text(), message);
      $('#messages').append(divEscapeContentElement(message));
      $('#messages').scrollTop($('#messages').prop('scrollHeight'));
    }

    $('#send-message').val('');

}
