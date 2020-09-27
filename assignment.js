

function loadData() {	
	// call loadData only onece for per web page
	// after calling loadData, get data from local Storage
	$.get("http://127.0.0.1/jqueryassignmentdummydata.json", function(jsonData) {
		// now save it to local storage
		localStorage.setItem("jsonData", JSON.stringify(jsonData));
	})

	var jsonData = JSON.parse(localStorage.getItem("jsonData"));

	// add the ID field
	for (var i = 0; i < jsonData.length; i++) {
		var userRow = jsonData[i];
		userRow["id"] = i;
		jsonData[i] = userRow;
	}
	// re-store the version with ID added
	localStorage.setItem("jsonData", JSON.stringify(jsonData));

	return jsonData;
}

function populateData(jsonData, quantity){

	var tableBody = $('#data tbody');
	var displayColumns = [
		"id", "firstname", "lastname",
		"email", "location", "phone"
	];

    var count = 0;
    //clear data
    tableBody.empty();

	//insert data into table
	for (var rowKey in jsonData) {
		const tr = document.createElement('tr');

		var row = jsonData[rowKey];

		// add the rest of the fields
		for (var j in displayColumns) {
			displayColumn = displayColumns[j];
			const td = document.createElement('td');
			if (displayColumn !='address' && displayColumn !='marks') {
				td.textContent = row[displayColumn];
				tr.appendChild(td);
			}

		};

		tableBody.append(tr);

		count +=1;
		if (count == quantity) {
			break;
		}
	};
}

// var userData = JSON.parse(localStorage.getItem('jsonData'));
//localStorage.setItem("userList", JSON.stringify(jsonData));
// var id = parseInt($("#student_id").val());

// Show details
$(document).ready(function() {

	// load the data (and add ID)
	var jsonData = loadData();

	// figure out how many rows to populate
	var quantity = parseInt($("#dropdown").val());

	// populate table with it
	populateData(jsonData, quantity);


    // drop down list
	$("#dropdown").change(function() {
		// get the quantity to change to
		var newQuantity = $(this).children("option:selected").val();

		// call populate
		populateData(jsonData, newQuantity);

	});

	$("#detail").click(function() {
		var tableBody = $('#detaildata tbody');
		// clear detail table
		tableBody.empty();
		var html ='';
		var detailId = parseInt($("#student_id").val());
        
        //localStorage.getItem("jsonData");
        //populateData(jsonData, 1000);

        // show all users before filtering
		populateData(jsonData, -1);

		$("#data tbody tr").filter(function() {
			$(this).toggle($(this).find("td:first").text() == detailId);
		});

		try {
			html +='<tr> <th>First Name</th><th>Address</th><th>Marks</th></tr>';
			html += '<td>' + jsonData[detailId].firstname + '</td>';
			html += '<td >' + '<strong>Communication :</strong>' + jsonData[detailId].address.communication + "<br>" + '<strong>Permanent:</strong>' + jsonData[detailId].address.permanent + '</td>';
			html += '<td >' + '<strong>English : </strong>'+ jsonData[detailId].marks.english+ "<br>"+ '<strong>Science : </strong>' + jsonData[detailId].marks.science+
			"<br>"+ '<strong>Computers : </strong>' + jsonData[detailId].marks.computers +"<br>"+ '<strong>Hardware : </strong>' + jsonData[detailId].marks.hardware + '</td>';
	        $('#detaildata tbody').append(html);
	    } catch (err) {
        	alert("Student ID " + detailId + " not found.");
		};
	});		

	// delete records
	$("#delete").click(function() {
    
    	// 1. delete student ID for jsonData
    	// look for a way to delete an dictionary record by key
    	var id = parseInt($("#student_id").val());
    	delete jsonData[id];

    	// 2. update the html table
    	// update tableBody var (which is linked to $('#data tbody'); )
        // loadingData();


    	// 3. update jsonData in localStorage
    	localStorage.setItem("jsonData", JSON.stringify(jsonData));

	});

	// Submit new data 
	$("#submit").click(function() {
		var newData ={
			"firstname": $("#firstname").val(),
			"lastname": $("#lastname").val(),
			"email": $("#email").val(),
			"location": $("#location").val(),
			"phone": $("#phone").val(),
			"address": {
				"communication": $("#communication").val(),
				"permanent": $("#permanent").val(),
			},
			"marks":{
				"english": $("#english").val(),
				"science": $("#science").val(),
				"computers": $("#computers").val(),
				"hardware": $("#hardware").val()
			}

		};
		jsonData.push(newData);
		localStorage.setItem("jsonData", JSON.stringify(jsonData));
		// $.post("http://127.0.0.1/jqueryassignmentdummydata.json",jsonData,
		// 	function(){alert("new record upload success!");
		// });
	}); 

	//Edit data
	$("#edit").click(function() {

		var id = parseInt($("#student_id").val());
		if (id == undefined) {
      		alert("Please insert student ID before click Edit");
  		}

		var updateData = {
			"firstname": $("#firstname").val(),
			"lastname": $("#lastname").val(),
			"email": $("#email").val(),
			"location": $("#location").val(),
			"phone": $("#phone").val(),
			"address": {
				"communication": $("#communication").val(),
				"permanent": $("#permanent").val(),
			},
			"marks": {
				"english": $("#english").val(),
				"science": $("#science").val(),
				"computers": $("#computers").val(),
				"hardware": $("#hardware").val()	
			}
		}

        for (var key in jsonData[id]) {
            if (typeof jsonData[id][key] === 'string') {
        	    if (!!updateData[key] && updateData[key] !=jsonData[id][key]) {
        		    jsonData[id][key]= updateData[key];
        	    }
            } else {
               	for (var subkey in jsonData[id][key]) {
               		if (!!updateData[key][subkey] && updateData[key][subkey] != jsonData[id][key][subkey]) {
        		    	jsonData[id][key][subkey] = updateData[key][subkey];
        	        } 
        	    }

            }

        };

        localStorage.setItem("jsonData", JSON.stringify(jsonData));
		// $.post("http://127.0.0.1/jqueryassignmentdummydata.json",jsonData,
		// 	function(){alert("record update success!");
		// });
    });

	//search box
    $("#search").click(function() { 

    	localStorage.getItem("jsonData");
        populateData(jsonData,-1);
        var searchdata = $("#searchdata").val().toLowerCase();
        var table = $("#data tbody tr")

       
        table.filter(function() {
        	$(this).toggle($(this).text().toLowerCase().indexOf(searchdata) >-1)
        });

	});
	// drag and drop

 	 document.addEventListener('dragstart', function (event) {
 	 	
     event.dataTransfer.setData('Text', [event.target.innerHTML,]);
      });


});








