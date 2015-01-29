;
var Sockie = (function(my) {
  var ws;

  var examples = {
    'coinbase': {
      'url': 'wss://ws-feed.exchange.coinbase.com',
      'msg': '{"type": "subscribe","product_id": "BTC-USD"}'
    },
    'blockchain': {
      'url': 'wss://ws.blockchain.info/inv',
      'msg': '{"op":"unconfirmed_sub"}'
    }
  }

  var $els = {
    socketUrl: $('#socketUrl'),
    subscribeMessage: $('#subscribeMessage'),
    console: $('.console'),
    errorBox: $('.error-message'),
    subscribeButton: $('#submitSocketRequestBtn'),
    closeButton: $('#closeSocketRequestBtn'),
    resetButton: $('#resetFormsBtn'),
    prettifyOutput: $('#prettifyOutput')
  }

  ////////////
  // Public
  ///////////

  my.intialize = function() {
    $els.subscribeButton.click(function() {
      initializeWebSocketConnection();
    });
    bindUserEvents();
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

  function bindUserEvents() {
    $els.closeButton.click(closeConnection);
    $els.resetButton.click(resetPage);
    $('.example').click(fillForm);
  }

  // WebSocket connection callbacks

  function webSocketOpenCallback(event) {
    $els.subscribeButton.hide();
    $els.closeButton.show();
    $els.resetButton.show();

    var msg = $els.subscribeMessage.val();
    ws.send(msg);
  }

  function webSocketMessageCallback(event) {
    var data = JSON.parse(event.data);
    printData(data);
  }

  function webSocketErrorCallback(event) {
    alert('Connection Unsuccessful');
  }

  // Data display functions

  // display error under form
  function displayError(err) {
    $els.errorBox.text(err);
    setTimeout(function(){ $els.errorBox.text('') }, 3000);
  }

  // Print data to console. Prettify if box is checked
  function printData(data) {
    var output;

    if ($els.prettifyOutput.prop('checked')) {
      output = 
        '<pre class="data-object">' +
        JSON.stringify(data, undefined, 2) +
        '</pre>'
    } else {
      output = 
        '<span class="data-object">' +
        JSON.stringify(data) +
        '</span>'
    }
    
    $els.console.append(output);
  }

  // expects to be called as event handler
  function fillForm() {
    var exampleName = $(this).data('example-key');
    $els.socketUrl.val(examples[exampleName].url);
    $els.subscribeMessage.val(examples[exampleName].msg);
  }

  // Update page state functions

  function closeConnection() {
    $els.closeButton.hide();
    $els.subscribeButton.show();
    if (!ws) return;
    ws.close();
    ws = undefined;
  }

  // reset form and console
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

