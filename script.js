//<![CDATA[
	function loadDocs() {
		svg = document.getElementById("map").getSVGDocument();
		cbx = document.getElementById("checkboxlist").contentDocument;
	}

	function loadURL() {
		var choosen = getParamsFromURL();
		if (choosen)
			presentChoosen(choosen);
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
		var category = cbx.getElementsByClassName("category")[0];
		var list = category.getElementsByTagName("li");
		
		for (var i = 0; i < list.length; i++) {
			list[i].onclick = listClick;
			list[i].onmouseover = listOver;
			list[i].onmouseout = listOut;
		}
		list = cbx.getElementsByClassName('checkbox_region');
		for(var i = 0;i<list.length;i++){
			list[i].style.display="none";
		}
		list[0].style.display = "block";
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

	function listClick(evt) {
		var list = cbx.getElementsByClassName('checkbox_region');
		for(var i = 0;i<list.length;i++){
			list[i].style.display="none";
		}
		
		var region_id = evt.target.getAttribute('regionId');
		var cbx_region = cbx.getElementById("cb_region_"+region_id);
		cbx_region.style.display="block";
		
		var region = svg.getElementById("region_"+region_id);
		if (evt.target.choosen) {
			evt.target.choosen = false;
			evt.target.style.backgroundColor = "beige";
			region.setAttribute("fill", "beige");
		}
		else {
			var elements = cbx.getElementsByTagName("li");
			for (var i=0; i<elements.length; i++) {
				elements[i].choosen = false;
				elements[i].style.backgroundColor = "transparent";
				var relatedRegion_id = elements[i].getAttribute('regionId');
				var relatedRegion = svg.getElementById("region_"+relatedRegion_id);
				relatedRegion.setAttribute("fill-opacity", 0);
			}
			evt.target.choosen = true;
			evt.target.style.backgroundColor = "yellow";
			region.setAttribute("fill", "yellow");
			region.setAttribute("fill-opacity", 0.5);
		}
		
	}
	function listOver(evt) {
		evt.target.style.backgroundColor = "beige";
		
		var region_id = evt.target.getAttribute("regionId");
		var region = svg.getElementById("region_"+region_id);
		
		
		
		if (evt.target.choosen) {
			region.setAttribute("fill","yellow");
			evt.target.style.backgroundColor = "yellow";
		} else {
			region.setAttribute("fill","beige");
			region.setAttribute("fill-opacity", 1);
			evt.target.style.backgroundColor = "beige";
		}
	}
	function listOut(evt) {
		evt.target.style.backgroundColor = "transparent";
		
		var region_id = evt.target.getAttribute("regionId");
		var region = svg.getElementById("region_"+region_id);
		
		if (evt.target.choosen) {
			evt.target.style.backgroundColor = "yellow";
			
		} else {
			region.setAttribute("fill-opacity", 0);
			evt.target.style.backgroundColor = "transparent";
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

	function getParamsFromURL() {
		var idx = document.URL.indexOf('?');
		var tempParams = new Object();

		if (idx == -1)
			return null;
	
		var pairs = document.URL.substring(idx+1, document.URL.length).split('&');
		for (var i=0; i<pairs.length; i++) {
			nameVal = pairs[i].split('=');
			tempParams[nameVal[0]] = nameVal[1];
		}
		return tempParams["choosen"].split(",");
	}

	function presentChoosen(idList) {
		var element = svg.getElementById("cities");
		var elements = element.getElementsByTagName("path");

		for (var i = 0; i < idList.length; i++) {
			var path_id = "city_" + idList[i];
			var path = svg.getElementById(path_id);

			var checkbox_id = "cb_" + idList[i];
			var checkbox = cbx.getElementById(checkbox_id);

			var evt = document.createEvent("MouseEvents");
			evt.initEvent('click', true, true);
			path.dispatchEvent(evt);

			path.setAttribute("fill", "red");
			checkbox.parentNode.style.backgroundColor = "red";
		}
	}
//]]>