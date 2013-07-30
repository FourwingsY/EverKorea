//<![CDATA[
	function loadSVG() {
		svg = document.getElementById("map").getSVGDocument();
	}

	function setMapOption() {
		loadSVG();

		var element = svg.getElementById("cities");
		var elements = element.getElementsByTagName("path");

		for (var i = 0; i < elements.length; i++) {
			elements[i].onmouseover = mapMouseOver;
			elements[i].onmouseout = mapMouseOut;
			elements[i].onclick = mapClick;
		}
	}
	function mapMouseOver(evt) {
		var region_gid = evt.target.getAttribute("region");
		var region_id = "region_"+region_gid;
		var region = svg.getElementById(region_id);
		region.setAttribute("fill-opacity","1")

		if (evt.target.getAttribute("choosen") == 0) {
			evt.target.setAttribute("fill-opacity","1");
		} else {
			evt.target.setAttribute("fill","orange");
		}

		var name = evt.target.getAttribute("cityname");
		var text = svg.getElementById("location").firstChild;
		text.nodeValue = name;
	}
	function mapMouseOut(evt) {
		var region_gid = evt.target.getAttribute("region");
		var region_id = "region_"+region_gid;
		var region = svg.getElementById(region_id);
		region.setAttribute("fill-opacity","0")

		if (evt.target.getAttribute("choosen") == 0) {
			evt.target.setAttribute("fill-opacity","0");
		} else {
			evt.target.setAttribute("fill","red");
		}
	}
	function mapClick(evt) {
		var name = evt.target.getAttribute("cityname");
		var cb_id = "cb_" + evt.target.id.split("_")[1];
		var checkbox = cbx.getElementById(cb_id);

		if (evt.target.getAttribute("choosen") == 0) {
			evt.target.setAttribute("choosen","1");
			evt.target.setAttribute("fill-opacity","1");
			evt.target.setAttribute("fill","red");
			checkbox.checked = true;
		} else {
			evt.target.setAttribute("choosen","0");
			evt.target.setAttribute("fill-opacity","0");
			evt.target.setAttribute("fill","yellow");
			checkbox.checked = false;
		}
	}

	function exportIMG() {
		var canvas = map.getElementById("cities");
		var img    = canvas.toDataURL("image/png");
		map.write('<img src="'+img+'"/>');
	}
	

	function loadCBX() {
		cbx = document.getElementById("checkboxlist").contentDocument;
	}
	function setCheckBoxOption() {
		loadCBX();
		var vboxes = cbx.getElementsByTagName("input");
		for (var i = 0; i < vboxes.length; i++) {
			vboxes[i].onclick = checkBoxClick;
			vboxes[i].onmouseover = checkBoxMouseOver;
			vboxes[i].onmouseout = checkBoxMouseOut;

			var label = vboxes[i].parentNode;
			label.onmouseover = labelMouseOver;
			label.onmouseout = labelMouseOut;
		}
	}
	function checkBoxClick(evt) {
		pathElement = getPathElement(evt.target.id)
		checkBoxToMap(pathElement, 'click');
		if (evt.target.checked)
			evt.target.parentNode.style.backgroundColor = "red";
		else evt.target.parentNode.style.backgroundColor = "transparent";
	}
	function checkBoxMouseOver(evt) {
		pathElement = getPathElement(evt.target.id);
		checkBoxToMap(pathElement, 'mouseover');
	}
	function checkBoxMouseOut(evt) {
		pathElement = getPathElement(evt.target.id);
		checkBoxToMap(pathElement, 'mouseout');
	}

	function labelMouseOver(evt) {
		inputElementId = evt.target.firstChild.id;
		if (inputElementId) { // only for label, not checkbox
			pathElement = getPathElement(inputElementId);
			checkBoxToMap(pathElement, 'mouseover');
			if (evt.target.firstChild.checked)
				evt.target.style.backgroundColor = "orange";
			else evt.target.style.backgroundColor = "yellow";
		}
	}
	function labelMouseOut(evt) {
		inputElementId = evt.target.firstChild.id;
		if (inputElementId) { // only for label, not checkbox
			pathElement = getPathElement(inputElementId);
			checkBoxToMap(pathElement, 'mouseout');
			if (evt.target.firstChild.checked)
				evt.target.style.backgroundColor = "red";
			else evt.target.style.backgroundColor = "transparent";
		}
	}

	function getPathElement(id) {
		num = id.split("_")[1];
		path_id = "city_"+num;
		pathElement = svg.getElementById(path_id);
		return pathElement;
	}
	function checkBoxToMap(element, evtname) {
		var myEvt = document.createEvent('MouseEvents');
		myEvt.initEvent(evtname,true,false);
		element.dispatchEvent(myEvt);
	}


	//]]>