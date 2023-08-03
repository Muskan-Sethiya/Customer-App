// Function to fetch and display the customer list
function getCustomerList() {
    // Get the bearer token from local storage
    const token = localStorage.getItem('accessToken');

    // Make the API call to get the list of customers
    fetch('https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=get_customer_list', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else if (response.status === 401) {
                throw new Error('Invalid Authorization');
            } else {
                throw new Error('Failed to fetch customer list');
            }
        })
        .then(data => {
            setData(data);
        })
        .catch(error => {
            console.error('Error reading the JSON file:', error);
        });
}

const label = [
    "first_name",
    "last_name",
    "street",
    "address",
    "city",
    "state",
    "email",
    "phone"
]

function editCustomer(customerId) {
    const row = document.getElementById(customerId);
    const cells = row.getElementsByTagName('td');
    for (let i = 0; i < cells.length - 1; i++) {
        const cell = cells[i];
        const cellData = cell.innerText;
        cell.innerHTML = `<input type="text" value="${cellData}">`;
    }
    // Change the "Edit" button to "Save"
    cells[cells.length - 1].innerHTML = `
    <img class='icon' onclick="cancelEdit()" src='cancel.png'/>
    <img class='icon' onclick="saveCustomer('${customerId}')" src='save.png'/>
    `;
}

function cancelEdit(){
    window.location.reload();
}

function saveCustomer(customerId) {
    const row = document.getElementById(customerId);
    const cells = row.getElementsByTagName('td');
    const token = localStorage.getItem('accessToken');
    const customerData = {}
    for (let i = 0; i < cells.length - 2; i++) {
        customerData[label[i]] = cells[i].getElementsByTagName('input')[0].value;
    }
    fetch(`https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=update&uuid=${customerId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(customerData)
    })
        .then(response => {
            if (response.status === 200) {
                // If the customer is updated successfully, display a success message
                alert('Customer updated successfully!');
                location.reload();
            } else if (response.status === 400) {
                alert('UUID not found or body is empty.');
            } else {
                alert('Failed to update the customer.');
            }
        })
        .catch(error => {
            console.error('Error updating the customer:', error);
            alert('Error updating the customer.');
        });
    // Change the "Save" button back to "Edit"
    const saveButton = cells[cells.length - 1].getElementsByTagName('button')[0];
    saveButton.innerText = 'Edit';
    saveButton.onclick = () => editCustomer(customerId);
}

function deleteCustomer(customerId) {
    const confirmation = confirm('Are you sure you want to delete this customer?');
    if (confirmation) {
        // Make the API call to delete the customer with the specified customerId
        const token = localStorage.getItem('accessToken');
        fetch(`https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=delete&uuid=${customerId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (response.status === 200) {
                    // If the customer is deleted successfully, remove the row from the table
                    alert('Data Deleted');
                    location.reload();
                } else if (response.status === 400) {
                    alert('UUID not found.');
                } else {
                    alert('Failed to delete the customer.');
                }
            })
            .catch(error => {
                console.error('Error deleting the customer:', error);
                alert('Error deleting the customer.');
            });
    }
}

function setData(customers) {

    // Assuming the API returns an array of customer objects in the response
    // Update the table with the customer data
    const tableBody = document.querySelector('#customerTable tbody');
    tableBody.innerHTML = '';

    customers.forEach(customer => {
        const row = document.createElement('tr');
        row.setAttribute("id", customer.uuid)
        row.innerHTML = `
                <td>${customer.first_name}</td>
                <td>${customer.last_name}</td>
                <td>${customer.street}</td>
                <td>${customer.address}</td>
                <td>${customer.city}</td>
                <td>${customer.state}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td class='center'>
                    <img class='icon' onclick="deleteCustomer('${customer.uuid}')" src='delete-icon.jpeg'/>
                    <img class='icon' onclick="editCustomer('${customer.uuid}')" src='edit.png'/>
                </td>
            `;
        tableBody.appendChild(row);
    });
}