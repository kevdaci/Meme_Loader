initializeRadioButtons();

//uploadId variable used for element uniqueness
var uploadId = 0;

/*
 * Load the page with radio buttons based on the results from the query
 */
function initializeRadioButtons(){
	var url = "server/index.php";
	var xhr = new XMLHttpRequest();
	var data = null;
	xhr.onreadystatechange = function(){
		if(this.readyState == 4){
			if(this.status == 200){
				data = JSON.parse(this.responseText);
				console.log(data);
				for(var i = 0; i < data.length; i++){
					addRadioMemeButton(data[i].image_name, data[i].description);
				}
			}
			else{
				console.log("ERROR Reloading");
			}
		}
	}
	xhr.open("GET", url, true);
	xhr.send();
}

/*
 * Methods to open and close the popup (modal)
 */
function openPopup(){
	var popup = document.getElementById("popup");
	popup.style.display = "block";
}

function closePopup(){
	var popup = document.getElementById("popup");
	var popupContentChildren = document.getElementById("popup-content").childNodes;
	for(var i = popupContentChildren.length - 1; i >= 5; i--){
		popupContentChildren[i].remove();
	}
	uploadId = 0;
	popup.style.display = "none";
}

/*
 * Method to select the image based on the click of a radio option
 */
function getImage(){
	var radioButtons = document.getElementsByName("meme-select");
	for(var i = 0; i < radioButtons.length; i++){
		if(radioButtons[i].checked){
			document.getElementById("image").src = radioButtons[i].value;
		}
	}
}

/*
 * Method to add radio buttons with the info for its respective image
 */
function addRadioMemeButton(image_name, text){
	var radioButtons = document.getElementById("meme-buttons")
	var newRadioButton = document.createElement("input");
	newRadioButton.type = "radio";
	newRadioButton.name = "meme-select";
	newRadioButton.value = "images/" + image_name;
	newRadioButton.onclick = getImage;
	radioButtons.appendChild(newRadioButton);
	radioButtons.appendChild(document.createTextNode(" " + text));
	radioButtons.appendChild(document.createElement("br"));
}

/*
 * Method to upload the image to the server and add the radio button with its respective
 * image.
 */
function uploadImage(popupContentDiv, file){
	var removeDiv = popupContentDiv;
	var childrenNodes = removeDiv.childNodes;
	var image = childrenNodes[0];
	var textInput = childrenNodes[1];
	if(textInput.value == ""){
		alert("Put in a description");
		return;
	}
	if(uploadImageToServer(file, textInput.value)){
		addRadioMemeButton(file.name, textInput.value);
	}
	else{
		alert("Cannot upload image");
	}
	removePopupContentDiv(removeDiv);
}


/*
 * Method to attempt to upload the image to the server
 */
function uploadImageToServer(file, text){
	var url = "server/upload.php";
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	var fd = new FormData();
	fd.append("upload_file", file);
	fd.append("description", text);
	fd.append("image_name", file.name);
	xhr.send(fd);

	while(!(xhr.readyState === 4)){}

	if(xhr.status === 200){
		return true;
	}

	return false;
}

/*
 * Method to remove a content div from the popup. It is executed when the user
 * confirms or cancels to upload the photo to the server.
 */
function removePopupContentDiv(popupContentDiv){
	popupContentDiv.remove();
	uploadId--;
	if(uploadId === 0){
		closePopup();
	}
}

/*
 * Method to create a content div for the popup
 */
function photoUploadView(file){

	//Creating a div to add to the div with class popup-content
	var newDiv = document.createElement("div");
	newDiv.id = (""+ uploadId);
	newDiv.className = "photo-upload";


	//Creating image element that was chosen from the file explorer
	var newImage = document.createElement("img");
	newImage.file = file
	var reader = new FileReader();
	reader.onload = function(event){
		source = event.target.result;
		newImage.src = source;
	}
	reader.readAsDataURL(file);
	newDiv.appendChild(newImage);

	//Creating input text element for the user to input the description
	var newInput = document.createElement("input");
	newInput.type = "text";
	newInput.placeholder = "Put a description for the meme."
	newInput.value = "";
	newDiv.appendChild(newInput);

	//Creating inner div for the buttons
	var innerDiv = document.createElement("div");

	//Upload confirm button
	var uploadConfirmButton = document.createElement("a");
	uploadConfirmButton.id = "upload-button-" + uploadId;
	uploadConfirmButton.className = "upload-confirm";
	uploadConfirmButton.text = "Upload"
	uploadConfirmButton.addEventListener("click", function(){
		uploadImage(newDiv, file);
	});

	//Cancel button
	var cancelButton = document.createElement("a");
	cancelButton.id = "cancel-button-" + uploadId;
	cancelButton.className = "cancel-upload";
	cancelButton.text = "Cancel";
	cancelButton.addEventListener("click", function(){
		removePopupContentDiv(newDiv);
	});

	innerDiv.appendChild(uploadConfirmButton);
	innerDiv.appendChild(cancelButton);
	newDiv.appendChild(innerDiv);

	document.getElementById("popup-content").appendChild(newDiv);

	//Increment the uploadId variable. This is used for element uniqueness purposes
	uploadId++;
}

/*
 * Creating event listener for the file input button
 */
var fileInput2 = document.getElementById('multiplefiles');
fileInput2.addEventListener('change', function () {
	var files = this.files;
	if(files.length == 0){
		return;
	}
	for(var i=0; i<files.length; i++){
		console.group('File '+ i);
		photoUploadView(files[i]);
		console.groupEnd();
	}
	openPopup();
}, false);