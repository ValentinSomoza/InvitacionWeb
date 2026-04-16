from flask import Flask, render_template, request, redirect
from dotenv import load_dotenv
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

import os


basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, ".env"))

app = Flask(__name__)

EVENT_DATA = {
    "nombre1":  os.getenv("EVENTO_NOMBRE1"),
    "nombre2":  os.getenv("EVENTO_NOMBRE2"),
    "fecha":    os.getenv("EVENTO_FECHA"),
    "hora":     os.getenv("EVENTO_HORA"),
    "fecha_js": os.getenv("EVENTO_FECHA_JS"),
    "lugar":    os.getenv("EVENTO_LUGAR"),
    "direccion":os.getenv("EVENTO_DIRECCION"),

    # nuevos
    "cvu": os.getenv("CVU"),
    "alias": os.getenv("ALIAS"),
    "titular": os.getenv("TITULAR"),
    "maps_url": os.getenv("MAPS_URL"),

    "itinerario": [
        os.getenv("ITINERARIO_1"),
        os.getenv("ITINERARIO_2"),
        os.getenv("ITINERARIO_3"),
        os.getenv("ITINERARIO_4"),
        os.getenv("ITINERARIO_5"),
    ]
}

EMAIL_SENDER    = os.getenv("EMAIL_SENDER")
EMAIL_PASSWORD  = os.getenv("EMAIL_PASSWORD")
EMAIL_RECEIVERS = os.getenv("EMAIL_RECEIVERS").split(",")


@app.route("/")
def home():
    return render_template("index.html", event=EVENT_DATA, mostrar_banco=True)

@app.route("/vip")
def home_vip():
    return render_template("index.html", event=EVENT_DATA, mostrar_banco=False)

@app.route("/confirmar", methods=["POST"])
def confirmar():
    nombre     = request.form.get("nombre")
    asistencia = request.form.get("asistencia")
    mensaje    = request.form.get("mensaje")
    preferencias = request.form.getlist("preferencias")
    otras      = request.form.get("otras_preferencias")

    preferencias_str = ", ".join(preferencias) if preferencias else "No especificadas"
    otras_str = otras if otras else "Ninguna"

    with open("invitados.txt", "a", encoding="utf-8") as f:
        f.write(f"{nombre} - {asistencia} - {mensaje} - {preferencias_str} - {otras_str}\n")

    with open("invitados.txt", "r", encoding="utf-8") as f:
        lista_completa = f.read()

    enviar_email(nombre, asistencia, mensaje, preferencias_str, otras_str, lista_completa)

    return redirect("/")


def enviar_email(nombre, asistencia, mensaje, preferencias, otras, lista_completa):
    asunto = "Nueva confirmación de asistencia del Casamiento"

    cuerpo = f"""
Nueva confirmación:

Nombre: {nombre}
Asistencia: {asistencia}
Mensaje: {mensaje}

Preferencias alimentarias: {preferencias}
Otras preferencias/alergias: {otras}

-----------------------------

Lista completa de confirmados:
(Nombre, Asistencia, Mensaje, Preferencias, Mensaje de otras preferencias)

{lista_completa}
"""

    msg = MIMEMultipart()
    msg["From"]    = EMAIL_SENDER
    msg["To"]      = ", ".join(EMAIL_RECEIVERS)
    msg["Subject"] = asunto
    msg.attach(MIMEText(cuerpo, "plain"))

    try:
        servidor = smtplib.SMTP("smtp.gmail.com", 587)
        servidor.starttls()
        servidor.login(EMAIL_SENDER, EMAIL_PASSWORD)
        servidor.sendmail(EMAIL_SENDER, EMAIL_RECEIVERS, msg.as_string())
        servidor.quit()
        print("Correo enviado correctamente")
    except Exception as e:
        print("Error al enviar correo:", e)


if __name__ == "__main__":
    app.run(debug=True)