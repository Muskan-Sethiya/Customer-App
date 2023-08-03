document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const login_id = document.getElementById('login_id').value;
    const password = document.getElementById('password').value;
    const authData = {
        login_id: login_id,
        password: password
    };
    fetch('https://qa2.sunbasedata.com/sunbase/portal/api/assignment_auth.jsp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(authData)
    })
    .then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            throw new Error('Authentication failed');
        }
    })
    .then(data => {
        const token = data.access_token;
        localStorage.setItem('accessToken', token);
        window.location.href = 'customer_list.html';
    })
    .catch(error => {
        alert(error.message)
        console.error(error);
    });
});