//<![CDATA[
	function loadDocs() {
		svg = document.getElementById("map").getSVGDocument();
		cbx = document.getElementById("checkboxlist").contentDocument;
	}
	function setOptions() {
		setSVGOption();
		setCheckboxOption();
		setCategotyOption();
	}

	function setSVGOption() {
		var svgCityList = svg.getElementById("cities").getElementsByTagName("path");

		for (var i = 0; i < svgCityList.length; i++) {
			svgCityList[i].onclick = cityClick;
			svgCityList[i].onmouseover = cityOver;
			svgCityList[i].onmouseout = cityOut;
			svgCityList[i].choosen = "false";
		}
	}
	function setCheckboxOption() {
		var cbxCheckboxList = cbx.getElementById("cb_list").getElementsByTagName("input");

		for (var i = 0; i < cbxCheckboxList.length; i++) {
			cbxCheckboxList[i].onclick = cityClick;
			cbxCheckboxList[i].onmouseover = cityOver;
			cbxCheckboxList[i].onmouseout = cityOut;

			var label = cbxCheckboxList[i].parentNode;
			label.onmouseover = cityOver;
			label.onmouseout = cityOut;
		}
	}
	function setCategotyOption() {
		var cbxCategoryList = cbx.getElementById("category").getElementsByTagName("li");

		for (var i = 0; i < cbxCategoryList.length; i++) {
			cbxCategoryList[i].onmouseover = categoryOver;
		}
	}

	function cbxInitialize() {
		cbxCatInit();
		cbx.getElementById("cbgroup_s").style.display = "block";
	}
	function cbxCatInit() {
		var cbGroupList = cbx.getElementsByClassName("cbgroup");

		for(var i = 0;i<cbGroupList.length;i++)
			cbGroupList[i].style.display="none";

		var cbxCategoryList = cbx.getElementById("category").getElementsByTagName("li");

		for (var i=0 ; i<cbxCategoryList.length; i++) {
			cbxCategoryList[i].style.backgroundColor = "transparent";
		}

		svgRegionInit();
	}
	function svgRegionInit() {
		var svgRegionList = svg.getElementById("regions").getElementsByTagName("path");
		for (var i = 0; i < svgRegionList.length; i++) {
			svgRegionList[i].setAttribute("fill-opacity", 0);
		}
	}

	function categoryOver(evt) {
		var evtCategory = evt.target;
		var evtRegionId = evtCategory.getAttribute('regionId');
		var evtRegion = svg.getElementById("region_"+evtRegionId);
		var evtCheckboxGroup = cbx.getElementById("cbgroup_"+evtRegionId);
		
		cbxCatInit();
		evtCheckboxGroup.style.display = "block";
		evtCategory.style.backgroundColor = "beige";
		evtRegion.setAttribute("fill-opacity", 1);
	}

	function cityClick(evt) {
		// whatever target was label or checkbox or path,
		// it's id is same.
		var evtCityId = evt.target.id.split("_")[1];

		var checkboxId = "cb_" + evtCityId;
		var checkbox = cbx.getElementById(checkboxId);
		var label = checkbox.parentNode;

		var pathId = "city_" + evtCityId;
		var path = svg.getElementById(pathId);

		if (path.getAttribute("choosen") == "true") {
			path.setAttribute("choosen", "false");
			checkbox.checked = false;
			label.style.backgroundColor = "yellow";
			path.setAttribute("fill","yellow");
		}
		else {
			path.setAttribute("choosen", "true");
			checkbox.checked = true;
			label.style.backgroundColor = "orange";
			path.setAttribute("fill-opacity","1");
			path.setAttribute("fill","orange");
		}

		var areaText = svg.getElementById("totalarea").firstChild;
		areaText.nodeValue = getVisitedAreaRatio().toString()+"%";
	}
	function cityOver(evt) {
		var evtCityId = evt.target.id.split("_")[1];

		var checkboxId = "cb_" + evtCityId;
		var checkbox = cbx.getElementById(checkboxId);
		var label = checkbox.parentNode;

		var pathId = "city_" + evtCityId;
		var path = svg.getElementById(pathId);

		var categoryId = "cat_"+ path.getAttribute("region");
		var category = cbx.getElementById(categoryId);

		var name = path.getAttribute("cityname");
		var text = svg.getElementById("location").firstChild;
		text.nodeValue = name;
		var text = svg.getElementById("location").textContent;
		text = name;

		if (checkbox.checked) {
			path.setAttribute("fill","orange");
			checkbox.parentNode.style.backgroundColor = "orange";
		} else {
			path.setAttribute("fill-opacity","1");
			checkbox.parentNode.style.backgroundColor = "yellow";
		}

		if (category.style.backgroundColor == "transparent") {
			var e = document.createEvent("MouseEvents");
			e.initMouseEvent("mouseover", 
				true, true, window, 0, 
				0, 0, 0, 0, 
				false, false, false, false, 
				0, null);
			category.dispatchEvent(e);
		}
	}
	function cityOut(evt) {
		var evtCityId = evt.target.id.split("_")[1];

		var checkboxId = "cb_" + evtCityId;
		var checkbox = cbx.getElementById(checkboxId);

		var pathId = "city_" + evtCityId;
		var path = svg.getElementById(pathId);

		if (checkbox.checked) {
			path.setAttribute("fill","red");
			checkbox.parentNode.style.backgroundColor = "red";
		} else {
			path.setAttribute("fill-opacity","0");
			checkbox.parentNode.style.backgroundColor = "transparent";
		}
	}
	function getVisitedAreaRatio() {
		var TOTAL_AREA = 99959.63;
		var svgCityList = svg.getElementById("cities").getElementsByTagName("path");
		var areaSum = 0;
		for (var i = 0; i < svgCityList.length; i++) {
			if (svgCityList[i].getAttribute("choosen") == "true") {
				areaSum += Number(svgCityList[i].getAttribute("area"));
			}
		}
		return (areaSum * 100/TOTAL_AREA).toFixed(2);
	}