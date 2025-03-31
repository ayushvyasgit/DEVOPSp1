# CloudOps
Consists of chatbot that will give answer to user queries 

# CloudOps
Install locally 
Install node modules 
Run (npm start) 


Run Flask App on AWS EC2 Instance
Install Python Virtualenv

sudo apt-get update
sudo apt-get install python3-venv
Activate the new virtual environment in a new directory

Create directory

mkdir helloworld
cd helloworld
Create the virtual environment

python3 -m venv venv
Activate the virtual environment

source venv/bin/activate
Install Flask

pip install Flask
Create a Simple Flask API

sudo vi app.py
// Add this to app.py
from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello_world():
	return 'Hello World!'

if __name__ == "__main__":
	app.run()
Verify if it works by running

python app.py
Run Gunicorn WSGI server to serve the Flask Application When you “run” flask, you are actually running Werkzeug’s development WSGI server, which forward requests from a web server. Since Werkzeug is only for development, we have to use Gunicorn, which is a production-ready WSGI server, to serve our application.

Install Gunicorn using the below command:

pip install gunicorn
Run Gunicorn:

gunicorn -b 0.0.0.0:8000 app:app 
Gunicorn is running (Ctrl + C to exit gunicorn)!

Use systemd to manage Gunicorn Systemd is a boot manager for Linux. We are using it to restart gunicorn if the EC2 restarts or reboots for some reason. We create a .service file in the /etc/systemd/system folder, and specify what would happen to gunicorn when the system reboots. We will be adding 3 parts to systemd Unit file — Unit, Service, Install

Unit — This section is for description about the project and some dependencies Service — To specify user/group we want to run this service after. Also some information about the executables and the commands. Install — tells systemd at which moment during boot process this service should start. With that said, create an unit file in the /etc/systemd/system directory

sudo nano /etc/systemd/system/helloworld.service
Then add this into the file.

[Unit]
Description=Gunicorn instance for a simple hello world app
After=network.target
[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/home/ubuntu/helloworld
ExecStart=/home/ubuntu/helloworld/venv/bin/gunicorn -b localhost:8000 app:app
Restart=always
[Install]
WantedBy=multi-user.target
Then enable the service:

sudo systemctl daemon-reload
sudo systemctl start helloworld
sudo systemctl enable helloworld
Check if the app is running with

curl localhost:8000
Run Nginx Webserver to accept and route request to Gunicorn Finally, we set up Nginx as a reverse-proxy to accept the requests from the user and route it to gunicorn.

Install Nginx

sudo apt-get nginx
Start the Nginx service and go to the Public IP address of your EC2 on the browser to see the default nginx landing page

sudo systemctl start nginx
sudo systemctl enable nginx
Edit the default file in the sites-available folder.

sudo nano /etc/nginx/sites-available/default
Add the following code at the top of the file (below the default comments)

upstream flaskhelloworld {
    server 127.0.0.1:8000;
}
Add a proxy_pass to flaskhelloworld atlocation /

location / {
    proxy_pass http://flaskhelloworld;
}
Restart Nginx

sudo systemctl restart nginx
Tada! Our application is up!
