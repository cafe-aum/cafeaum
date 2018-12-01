## Installation

*NOTE: Requires [virtualenv](http://virtualenv.readthedocs.org/en/latest/),
[virtualenvwrapper](http://virtualenvwrapper.readthedocs.org/en/latest/) and
[Node.js](http://nodejs.org/).*

* Fork this repository.
* `$ git clone git@github.com:<your username>/thinkster-django-angular-boilerplate.git`
* `$ mkvirtualenv thinkster-djangular`
* `$ cd thinkster-django-angular-boilerplate/`
* `$ pip install -r requirements.txt`
* `$ npm install -g bower`
* `$ npm install`
* `$ bower install`
* `$ python manage.py migrate`
* `$ python manage.py runserver`



## Création de la DATABASE postrges :

* `$ sudo su - postgres`
* `$ psql`
* `$ CREATE DATABASE <myproject>;`
* `$ CREATE USER <myprojectuser> WITH PASSWORD '<password>';`
* `$ ALTER ROLE <myprojectuser> SET client_encoding TO 'utf8';`
* `$ ALTER ROLE <myprojectuser> SET default_transaction_isolation TO 'read committed';`
* `$ ALTER ROLE <myprojectuser> SET timezone TO 'Europe/Paris';`
* `$ GRANT ALL PRIVILEGES ON DATABASE <myproject> TO <myprojectuser>;`
* `$ \q`
* `$ exit`


## Deploiement sur Heroku :
* `$  pip freeze > requirements.txt `
* `$  git init`
* `$  vim .gitignore  # *.pyc, static ...`
* `$  git add .`
* `$  heroku create <app>`
* `$  heroku stack:set cedar-14`
* `$  heroku buildpacks:add https://github.com/heroku/heroku-buildpack-multi.git`
* `$  heroku config:set PGBOUNCER_MAX_CLIENT_CONN=120`
* `$  heroku addons:create heroku-postgresql:hobby-dev`
* `$  vim <app>/uwsgi.ini`


## uwsgi.ini
[uwsgi]  
 http-socket = /tmp/nginx.socket  
 master = true  
 processes = 4  
 die-on-term = true  
 memory-report = true  
 enable-threads = true  
 hook-accepting1 = exec:touch /tmp/app-initialized  
 env = DJANGO_SETTINGS_MODULE=<app>.settings  
 module = <app>.wsgi:application  


* `$  git add uwsgi.ini `
* `$  vim <app>/settings.py`

## <app>/settings.py
 import dj_database_url  

 DATABASES = {'default': dj_database_url.config()}  

 if bool(os.environ.get('LOCAL_DEV', True)):  
    DATABASES = {  
        'default': {  
            'ENGINE': 'django.db.backends.postgresql_psycopg2',  
            'NAME': 'papyoga',  
            'USER': 'veroniquepagnon',  
            'PASSWORD': 'veroyoga',  
            'HOST': 'localhost',  
            'PORT': '',  
        }  
    }  


## Procfile

 # Procfile with nginx, pgbouncer, uWSGI and django-q  
 web: bin/start-nginx bin/start-pgbouncer-stunnel uwsgi uwsgi.ini  
 worker: bin/start-pgbouncer-stunnel python manage.py qcluster  


## Procfile

* python-2.7.14

## <app>/wsgi.py
* `$ vim <app>/wsgi.py`


 import os  
 os.environ.setdefault("DJANGO_SETTINGS_MODULE", "<app>.settings")  

 from django.core.wsgi import get_wsgi_application  
 from whitenoise.django import DjangoWhiteNoise  

 application = get_wsgi_application()  
 application = DjangoWhiteNoise(application)  


* `$ git push heroku master`
* `$ heroku run python manage.py syncdb`



## Nom de domaine 


* `$ heroku domains:add <domaine.fr> -a <app>`
* `$ heroku domains:add <www.domaine.fr> -a <app>`


* `$ heroku domains -a pas-a-pas-yoga`
* ▸    heroku-cli: update available from 6.14.30-304197d to 6.15.22-3f1c4bd
* === pas-a-pas-yoga Heroku Domain
* pas-a-pas-yoga.herokuapp.com

* === pas-a-pas-yoga Custom Domains
* Domain Name            DNS Record Type  DNS Target
* ─────────────────────  ───────────────  ───────────────────────────────────
* www.pas-a-pas-yoga.fr  CNAME            www.pas-a-pas-yoga.fr.herokudns.com
* pas-a-pas-yoga.fr      ALIAS or ANAME   pas-a-pas-yoga.fr.herokudns.com


## Amen.fr :
* Configuration DNS -> configuration avancée

* pas-a-pas-yoga.fr.         TXT       "pas-a-pas-yoga.fr.herokudns.com."
* www.pas-a-pas-yoga.fr.    CNAME      www.pas-a-pas-yoga.herokuapp.com.


  "dependencies": {
    "angular": "1.6.9",
    "json3": "^3.3.0",
    "es5-shim": "^4.1.1",
    "bootstrap": "4.0.0",
    "bootstrap-material-design": "4.1.1",
    "angular-animate": "1.6.9",
    "angular-aria": "1.6.9",
    "angular-bootstrap": "2.5.0",
    "angular-cookies": "1.6.9",
    "angular-material": "1.1.7",
    "angular-messages": "1.6.9",
    "angular-moment": "1.2.0",
    "angular-payments": "0.1.1",
    "angular-route": "1.6.9",
    "angular-sanitize": "1.6.9",
    "angular-touch": "1.6.9",
    "angular-ui-calendar": "1.0.2",
    "fullcalendar": "2.1.1",
    "jquery": "2.1.1",
    "moment":"2.20.1",
    "ng-dialog":"1.4.0",
    "underscore":"1.8.3",
  },
  "devDependencies": {
    "angular-mocks": "1.6.9",
    "angular-scenario": "1.6.9"
  },
  "appPath": "app"
