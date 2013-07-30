//<![CDATA[
	function loadDocs() {
		svg = document.getElementById("map").getSVGDocument();
		cbx = document.getElementById("checkboxlist").contentDocument;
	}

	function setMapOption() {
		var element = svg.getElementById("cities");
		var elements = element.getElementsByTagName("path");

		for (var i = 0; i < elements.length; i++) {
			elements[i].onclick = clickEvent;
			elements[i].onmouseover = mOverEvent;
			elements[i].onmouseout = mOutEvent;
		}
	}
	function setCheckBoxOption() {
		var vboxes = cbx.getElementsByTagName("input");
		for (var i = 0; i < vboxes.length; i++) {
			vboxes[i].onclick = clickEvent;
			vboxes[i].onmouseover = mOverEvent;
			vboxes[i].onmouseout = mOutEvent;

			var label = vboxes[i].parentNode;
			label.onmouseover = mOverEvent;
			label.onmouseout = mOutEvent;
		}
	}

	function clickEvent(evt) {
		var id_num = evt.target.id.split("_")[1];

		var path_id = "city_" + id_num;
		var path = svg.getElementById(path_id);

		var checkbox_id = "cb_" + id_num;
		var checkbox = cbx.getElementById(checkbox_id);

		if (path.getAttribute("choosen") == "false") {
			path.setAttribute("choosen","true");
			path.setAttribute("fill-opacity","1");
			path.setAttribute("fill","orange");
			checkbox.checked = true;
			checkbox.parentNode.style.backgroundColor = "orange";
		}
		else {
			path.setAttribute("choosen","false");
			path.setAttribute("fill","yellow");
			checkbox.checked = false;
			checkbox.parentNode.style.backgroundColor = "yellow";
		}
		var areaText = svg.getElementById("totalarea").firstChild;
		areaText.nodeValue = getAreaRatio().toString()+"%";
	}
	
	function mOverEvent(evt) {
		var id_num = evt.target.id.split("_")[1];

		var path_id = "city_" + id_num;
		var path = svg.getElementById(path_id);

		var checkbox_id = "cb_" + id_num;
		var checkbox = cbx.getElementById(checkbox_id);

		var region_id = "region_"+ path.getAttribute("region");
		var region = svg.getElementById(region_id);
		region.setAttribute("fill-opacity","1");

		var name = path.getAttribute("cityname");
		var text = svg.getElementById("location").firstChild;
		text.nodeValue = name;

		if (path.getAttribute("choosen") == "false") {
			path.setAttribute("fill-opacity","1");
			checkbox.parentNode.style.backgroundColor = "yellow";
		} else {
			path.setAttribute("fill","orange");
			checkbox.parentNode.style.backgroundColor = "orange";
		}
	}

	function mOutEvent(evt) {
		var id_num = evt.target.id.split("_")[1];

		var path_id = "city_" + id_num;
		var path = svg.getElementById(path_id);

		var checkbox_id = "cb_" + id_num;
		var checkbox = cbx.getElementById(checkbox_id);

		var region_id = "region_"+ path.getAttribute("region");
		var region = svg.getElementById(region_id);
		region.setAttribute("fill-opacity","0");

		if (path.getAttribute("choosen") == "false") {
			path.setAttribute("fill-opacity","0");
			checkbox.parentNode.style.backgroundColor = "transparent";
		} else {
			path.setAttribute("fill","red");
			checkbox.parentNode.style.backgroundColor = "red";
		}
	}

	function getAreaRatio() {
		const TOTAL_AREA = 99959.63;
		var region = svg.getElementById("cities");
		var cities = region.getElementsByTagName("path");
		var areaSum = 0;
		for (var i = 0; i < cities.length; i++) {
			if (cities[i].getAttribute("choosen") == "true") {
				areaSum += Number(cities[i].getAttribute("area"));
			}
		}
		return (areaSum * 100/TOTAL_AREA).toFixed(2);
	}