;
var Sockie = (function(my) {
  var ws;
  var $els = {
    socketUrl: $('#socketUrl'),
    subscribeMessage: $('#subscribeMessage'),
    console: $('.console'),
    errorBox: $('.error-message'),
    subscribeButton: $('#submitSocketRequestBtn'),
    closeButton: $('#closeSocketRequestBtn'),
    resetButton: $('#resetFormsBtn')
  }

  ////////////
  // Public
  ///////////

  my.intialize = function() {
    $els.subscribeButton.click(function() {
      initializeWebSocketConnection();
    });

    $els.closeButton.click(closeConnection);
    $els.resetButton.click(resetPage)
  }

  ///////////
  // Private
  ///////////

  function initializeWebSocketConnection() {
    var uri = $els.socketUrl.val();

    try {
      ws = new WebSocket(uri);
    } catch (err) {
      return displayError(err);
    }
    
    ws.onopen = webSocketOpenCallback;
    ws.onmessage = webSocketMessageCallback;
    ws.onerror = webSocketErrorCallback;
  }

  function webSocketOpenCallback(event) {
    $els.subscribeButton.hide();
    $els.closeButton.show();
    $els.resetButton.show();

    var msg = $els.subscribeMessage.val();
    ws.send(msg);
  }

  function webSocketMessageCallback(event) {
    printData(event.data);
  }

  function webSocketErrorCallback(event) {
    alert('Connection Unsuccessful');
  }

  function displayError(err) {
    $els.errorBox.text(err);
    setTimeout(function(){ $els.errorBox.text('') }, 3000);
  }

  function printData(data) {
    $els.console.append('<p class="data-object">' + data + '</p>');
  }

  function closeConnection() {
    $els.closeButton.hide();
    $els.subscribeButton.show();
    if (!ws) return;
    ws.close();
    ws = undefined;
  }

  function resetPage() {
    closeConnection();
    $els.resetButton.hide();
    $els.socketUrl.val('');
    $els.subscribeMessage.val('');
    $els.console.html('');
  }

  return my;
})(Sockie || {})

Sockie.intialize();

