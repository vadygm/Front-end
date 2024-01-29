let userId, userName, userLastName, userEmail, userCedula, userCelular, num_cuenta, saldo_cuenta;

document.addEventListener("DOMContentLoaded", function() {
    const loginContainer = document.getElementById("login-container");
    const registerContainer = document.getElementById("register-container");
    const createAccountBtn = document.getElementById("create-account-btn");
    const cancelRegisterBtn = document.getElementById("cancel-register-btn");
    const registerAccountBtn = document.getElementById("register-submit-btn");


    // Mostrar el formulario de registro
    createAccountBtn.addEventListener("click", function () {
        loginContainer.style.display = "none";
        registerContainer.style.display = "block";
    });

    
    registerAccountBtn.addEventListener("click", function () {
        loginContainer.style.display = "flex";
        registerContainer.style.display = "none";
    });

    cancelRegisterBtn.addEventListener("click", function () {
        loginContainer.style.display = "flex";
        registerContainer.style.display = "none";
    });
});

const usuarioString = localStorage.getItem('usuario');

if (usuarioString) {
    const usuario = JSON.parse(usuarioString);
    // Haz algo con la información del usuario, por ejemplo, actualiza el DOM con sus detalles
    console.log('Información del usuario:', usuario);
    console.log('Información del usuario:', usuario.nombre);
    userId = usuario.id;
    userName = usuario.nombre;
    userLastName = usuario.apellido;
    userEmail = usuario.correo;
    userCedula = usuario.cedula;
    userCelular = usuario.celular;
    obtenerCuentaAhorro();

} else {
    // Maneja el caso en el que no haya información del usuario
    console.log('No se encontró información del usuario en localStorage.');
}
// Asignar los valores de las variables globales a los elementos HTML
document.getElementById('user-name').innerText = userName || 'No disponible';
document.getElementById('user-lastname').innerText = userLastName || 'No disponible';
document.getElementById('user-email').innerText = userEmail || 'No disponible';
document.getElementById('user-cedula').innerText = userCedula || 'No disponible';
document.getElementById('user-celular').innerText = userCelular || 'No disponible';


async function obtenerCuentaAhorro() {
    try {
        // Verifica si el userId está definido
        if (!userId) {
            console.error('El userId no está definido.');
            return;
        }

        // Realiza la solicitud GET al servicio FastAPI
        const response = await fetch(`http://localhost:8000/cuenta_ahorro/${userId}`);

        if (response.ok) {
            // Si la respuesta es exitosa, obtén los datos de la cuenta de ahorro
            const cuentaAhorro = await response.json();
            console.log('Información de la cuenta de ahorro:', cuentaAhorro);
            num_cuenta = cuentaAhorro.numero_cuenta;
            saldo_cuenta = cuentaAhorro.saldo;
            document.getElementById('num-cuenta').innerText = num_cuenta || 'No disponible';
            document.getElementById('saldo-cuenta').innerText = saldo_cuenta || 'No disponible';
 
        } else {
            // Maneja el caso en el que la respuesta no sea exitosa
            console.error('Error al obtener la información de la cuenta de ahorro:', response.statusText);
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error.message);
    }
}

async function registrarUsuario() {
    const nombre = document.getElementById('register-firstname').value;
    const apellido = document.getElementById('register-lastname').value;
    const correo = document.getElementById('register-email').value;
    const cedula = document.getElementById('register-id').value;
    const celular = document.getElementById('register-phone').value;
    const contraseña = document.getElementById('register-password').value;

    try {
        const response = await fetch('http://localhost:8000/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "nombre": nombre,
                "apellido": apellido,
                "correo": correo,
                "cedula": cedula,
                "celular": celular,
                "contraseña": contraseña
            }),
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById("resultado").innerText = JSON.stringify(data, null, 2);
        } else {
            const errorData = await response.json();
            throw new Error(errorData.detail);
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error.message);
        document.getElementById("resultado").innerText = `Error: ${error.message}`;
    }
}


async function login() {
    const correo = document.getElementById('login-email').value;
    const contraseña = document.getElementById('login-password').value;

    try {
        const response = await fetch('http://127.0.0.1:8000/usuarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "nombre": "",
                "apellido": "",
                "correo": correo,
                "cedula": "",
                "celular": "",
                "contraseña": contraseña
            }),
        });

        if (response.ok) {
            const result = await response.json();
            // Almacena la información del usuario en localStorage
            localStorage.setItem('usuario', JSON.stringify(result.usuario));

            // Redirigir a la página cuenta.html
            window.location.href = 'cuenta.html';
        } else {
            const result = await response.json();
            document.getElementById('result').innerText = JSON.stringify(result, null, 2);
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error.message);
        document.getElementById('result').innerText = `Error: ${error.message}`;
    }
}