<?php

	if (isset($_POST["name"])) {
		$name = $_POST["name"];
	} else {
		header("Location: index.html");
		die();
	}

	$points = $_POST["correct"];
	$time = $_POST["time"];

	create_data($name, $points, $time);

	function create_data($name, $points, $time) {
		$data = "$name: $points, $time\n";
		file_put_contents("data.txt", $data, FILE_APPEND);
		header("Location: index.html");
		die();
	}

?>