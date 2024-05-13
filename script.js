document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent the form from submitting traditionally

            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            // Simple validation check
            if (!username || !password) {
                alert('Please enter both username and password.');
                return;
            }

            try {
                // Assuming the login endpoint is '/login'
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                if (response.ok) {
                    const data = await response.json();
                    // Assuming the response includes some kind of result indicating success
                    if (data.success) {
                        window.location.href = 'MainSell.html'; // Redirect on successful login
                    } else {
                        alert('Login failed: ' + data.message);
                    }
                } else {
                    throw new Error('Failed to connect to the server.');
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
    }

    // Optionally handle the signup button
    const signupButton = document.querySelector('.signup-button');
    if (signupButton) {
        signupButton.addEventListener('click', () => {
            console.log('Signup button clicked');

            // Redirect to a signup page or handle signup
            window.location.href = 'Register.html'; // Change to your actual signup page URL
        });
    }

    const registerForm = document.querySelector('.register');

    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent the default form submission

            // Get all form values
            const firstName = document.getElementById('first-name').value.trim();
            const lastName = document.getElementById('last-name').value.trim();
            const email = document.getElementById('email').value.trim();
            const mobileNumber = document.getElementById('mobile-number').value.trim();
            const password = document.getElementById('password').value.trim();
            const confirmPassword = document.getElementById('confirm-password').value.trim();
            const idNumber = document.getElementById('id-number').value.trim();
            const buildingNumber = document.getElementById('building-number').value.trim();
            const termsCheckbox = document.querySelector('input[type="checkbox"]').checked;

            // Validate inputs
            if (!firstName || !lastName || !email || !mobileNumber || !password || !confirmPassword || !idNumber || !buildingNumber || !termsCheckbox) {
                alert('Please fill in all fields and accept the terms.');
                return;
            }

            if (password !== confirmPassword) {
                alert('Passwords do not match.');
                return;
            }

            // Assuming email regex validation
            const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // Prepare data for sending
            const userData = {
                firstName,
                lastName,
                email,
                mobileNumber,
                password,  
                idNumber,
                buildingNumber
            };

            // Send data to the server via fetch API
            try {
                const response = await fetch('/Register.html', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });

                if (response.ok) {
                    const result = await response.json();
                    alert('Registration successful!');
                    window.location.href = 'login.html';
                } else {
                    throw new Error('Failed to register.');
                }
            } catch (error) {
                alert('Registration failed: ' + error.message);
            }
        });
    }
});
