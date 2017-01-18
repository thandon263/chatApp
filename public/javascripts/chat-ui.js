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

// Client side application initialization logic
let socket = io.connect();

// Displaying results of a name change attempt
$(function() {
  let chatApp = new Chat(socket);

  socket.on('nameResult', (result) => {
    let message;

    if (result.success) {
      message = 'You are now known ass ' + result.name + '.';
    } else {
      message = result.message;
    }

    $('#messages').append(divSystemContentElement(message));

  });
// Displaying results of a room change
  socket.on('joinResult', (result) => {
    $('#room').text(result.room);
    $('#messages').append(divSystemContentElement('Room Changed.'));
  });
// Displaying received messages
  socket.on('message', (message) => {
    let newElement = $('<div></div>').text(message.text);
    $('#messages').append(newElement);
  });
// display list of rooms available
  socket.on('rooms', (rooms) => {
    $('#room-list').empty();

    for (let room in rooms) {
      room = room.substring(1, room.length);
      if (room != '') {
        $('#room-list').append(divEscapeContentElement(room));
      }
    }
// Allow click of a room name to change that room
    $('#room-list div').click(() => {
      chatApp.processCommand('/join ' + $(this).text());
      $('#send-message').focus();
    });
  });
// Request list of rooms available intermittently
  setInterval(() => {
    socket.emit('rooms');
  }, 1000);

  $('#send-message').focus();
// Allow submitting the form to send a chat message.
  $('#send-form').submit(() => {
      processingUserInput(chatApp, socket);
      return false;
  });

}); // End of the initialization function
