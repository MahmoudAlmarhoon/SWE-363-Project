async function addItem(event) {
	event.preventDefault();

	const bigPicture = document.getElementById("bigPicture").value.trim();
    const sidePic1 = document.getElementById("sidePic1").value.trim();
	const sidePic2 = document.getElementById("sidePic2").value.trim();
	const sidePic3 = document.getElementById("sidePic3").value.trim();
    // Get all radio buttons by their name
    var radioButtons = document.getElementsByName('itemType');

    // Initialize a variable to store the selected value
    var selectedValue = '';

    // Loop through each radio button
    for (var i = 0; i < radioButtons.length; i++) {
        // Check if the current radio button is checked
        if (radioButtons[i].checked) {
            // If checked, set the selectedValue to the value of the checked radio button
            selectedValue = radioButtons[i].value;
            // Break out of the loop since we found the selected radio button
            break;
        }
    }

    // If no radio button is selected, selectedValue will be an empty string
    const productName = document.getElementsByClassName("name-input").value.trim();
    const price = document.getElementsByClassName("price-input").value.trim();
    const quantity = document.getElementsByClassName("quantity-input").value.trim();
    const descreption = document.getElementsByClassName("description-inputdescription-input").value.trim();

	// var id, username;
	// const user = JSON.parse(localStorage.getItem("user"));
	// if ((user != null) && (user != "")) {
	// 	id = user.id;
	// 	username = user.fullName;
	// } else {
	// 	id = 1;
	// 	username = "Anonymous";
	// }

	if ((bigPicture != "") && (selectedValue != "") && (productName != "") &&(price != "")
         &&(quantity != "") &&(descreption != "") &&(sidePic1 != "")&&(sidePic2 != "") &&(sidePic3 != "")) {
		const payload = JSON.stringify({
			"bigPicture": bigPicture,
            "sidePic1": sidePic1,
            "sidePic2": sidePic2,
			"sidePic3": sidePic3,
			"selectedValue": selectedValue,
			"productName": productName,
			"price": price,
            "description": description,
			"quantity": quantity,
            "inCart": false,
        });
    };
};


fetch('http://localhost:3000/api/register', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        mobileNumber: "1234567890",
        password: "password",
        idNumber: "123456",
        buildingNumber: "9A"
    })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
