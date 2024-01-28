from flask import Flask, render_template, request, redirect
import psycopg2

app = Flask(__name__, template_folder='D:\\front usuario', static_folder='D:\\front usuario')

# Configuración de la base de datos
DB_NAME = "usuario"
DB_USER = "postgres"
DB_PASSWORD = "12345"
DB_HOST = "localhost"
DB_PORT = "5432"

# Función para conectar a la base de datos
def connect_to_db():
    conn = psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT
    )
    return conn

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register', methods=['POST'])
def register():
    nombre = request.form['register-firstname']
    apellido = request.form['register-lastname']
    correo = request.form['register-email']
    cedula = request.form['register-id']
    celular = request.form['register-phone']
    contraseña = request.form['register-password']
    conn = connect_to_db()
    cur = conn.cursor()
    cur.execute("INSERT INTO usuarios (nombre, apellido, correo, cedula, celular, contraseña) VALUES (%s, %s, %s, %s, %s, %s)",
                (nombre, apellido, correo, cedula, celular, contraseña))
    
    conn.commit()
    cur.close()
    conn.close()

    return redirect('/')  

@app.route('/login', methods=['POST'])
def login():
    login_email = request.form['login-email']
    login_password = request.form['login-password']
    
    conn = connect_to_db()
    cur = conn.cursor()

    cur.execute("SELECT * FROM usuarios WHERE correo = %s AND contraseña = %s", (login_email, login_password))
    user = cur.fetchone()
    
    cur.close()
    conn.close()

    if user:
        return "Inicio de sesión exitoso"
    else:
        return "Credenciales incorrectas"

if __name__ == '__main__':
    app.run(debug=True)
