document.getElementById('addCustomerForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const firstName = document.getElementById('first_name').value;
    const lastName = document.getElementById('last_name').value;
    const street = document.getElementById('street').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    const token = localStorage.getItem('accessToken');
    const customerData = {
        "first_name": firstName,
        "last_name": lastName,
        "street": street,
        "address": address,
        "city": city,
        "state": state,
        "email": email,
        "phone": phone
    };

    fetch('https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=create', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(customerData)
    })
        .then(response => {
            if (response.status === 201) {
                // If the customer is created successfully, display a success message
                alert('Customer added successfully!');
                window.location.href = 'customer_list.html';
            } else if (response.status === 400) {
                alert('First Name or Last Name is missing.');
            } else {
                alert('Failed to add the customer.');
            }
        })
        .catch(error => {
            console.error('Error adding the customer:', error);
            alert('Error adding the customer.');
        });
    // Call the API to create a new customer
    // Implement the API call here using the provided path and method (POST)
    // Handle the API response, show success or error message, and redirect back to the customer list screen
});
