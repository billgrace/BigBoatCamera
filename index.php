<!DOCTYPE html>
<html>
<head>
	<title>Big Boat Closeup Camera</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
	<style type="text/css">
		body {
			margin: 0px;
			background-color: #fff;
			overflow: hidden;
		}
	</style>
</head>
<body>
	<div id="messageDisplay" style="color:#332211;background-color:#00FFFF;opacity:0.6;position:absolute;left:0px;top:550px">
	</div>
	<script type="text/javascript" src="script/ajax.js"></script>
	<script type="text/javascript">
		init();
		function showMessage( message ) {
			var messageDisplayElement = document.getElementById( "messageDisplay" );
			messageDisplayElement.innerHTML = message;
		}
		function clearMessage() {
			var messageDisplayElement = document.getElementById( "messageDisplay" );
			messageDisplayElement.innerHTML = '';
		}
		function appendMessage( message ) {
			var messageDisplayElement = document.getElementById( "messageDisplay" );
			if( messageDisplayElement.innerHTML.length > 0 ) {
				messageDisplayElement.innerHTML += '<br>';
			}
			messageDisplayElement.innerHTML += message;
		}

		function init() {
			showMessage("Hello, world!");
		}
	</script>
</body>
</html>
