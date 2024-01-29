let userId, userName, userLastName, userEmail, userCedula, userCelular, num_cuenta, saldo_cuenta;
// Obtener los eventos del formulario de registro
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
// Verifica si la información del usuario está almacenada en localStorage
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
// Función para registrar un usuario
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

// Obtener el formulario de registro
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

// Función para realizar un depósito
async function realizarDeposito() {
    // Obtener los valores de los campos del formulario
    const numeroCuenta = document.getElementById('account-number').value;
    const montoDeposito = parseFloat(document.getElementById('deposit-amount').value);

    try {
        // Realizar la solicitud POST al servicio FastAPI
        const response = await fetch(`http://localhost:8000/cuentas/${numeroCuenta}/deposito`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                monto: montoDeposito,
            }),
        });

        if (response.ok) {
            // Si la respuesta es exitosa, obtener el mensaje
            const data = await response.json();
            console.log(data.message);
            window.location.href = window.location.href;

            // Aquí puedes realizar acciones adicionales después del depósito
        } else {
            // Manejar el caso en el que la respuesta no sea exitosa
            const errorData = await response.json();
            console.error('Error al realizar el depósito:', errorData.detail);
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error.message);
    }
}

// Obtener el formulario de depósito
const depositForm = document.getElementById('deposit-form');

// Agregar un event listener para el submit del formulario
depositForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar el envío tradicional del formulario
    realizarDeposito(); // Llamar a la función para realizar el depósito
    
});

// Función para realizar un retiro
async function realizarRetiro() {
    // Obtener los valores de los campos del formulario
    const numeroCuentaRetiro = document.getElementById('account-number-withdraw').value;
    const montoRetiro = parseFloat(document.getElementById('withdrawal-amount').value);

    try {
        // Realizar la solicitud POST al servicio FastAPI para realizar el retiro
        const response = await fetch(`http://localhost:8000/cuentas/${numeroCuentaRetiro}/retiro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                monto: montoRetiro,
            }),
        });

        if (response.ok) {
            // Si la respuesta es exitosa, obtener el mensaje
            const data = await response.json();
            console.log(data.message);
            window.location.href = window.location.href;// Actualizar la página
        } else {
            // Manejar el caso en el que la respuesta no sea exitosa
            const errorData = await response.json();
            console.error('Error al realizar el retiro:', errorData.detail);
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error.message);
    }
}

// Obtener el formulario de retiro
const withdrawForm = document.getElementById('withdraw-form');

// Agregar un event listener para el submit del formulario de retiro
withdrawForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar el envío tradicional del formulario
    realizarRetiro(); // Llamar a la función para realizar el retiro
});