document.getElementById('toggle-register').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('register-container').classList.remove('hidden');
    document.getElementById('login-container').classList.add('hidden');
});

document.getElementById('toggle-login').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('login-container').classList.remove('hidden');
    document.getElementById('register-container').classList.add('hidden');
});
