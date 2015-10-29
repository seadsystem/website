#Django Frontend
This is a preliminary setup for our seads Frontend website, which will eventually include d3 visualizations. Currently, this website will only work with a local postgres database, which can be installed with the instructions below.

##Installation
The django application within this repository must, at this time, work with a local postgres database on your machine. To install postgress on Ubuntu, type the following commands in your terminal:
```sh
$ sudo apt-get update
$ sudo apt-get install python-pip python-dev libpq-dev postgresql postgresql-contrib
```

Now, log in to postgres as an administrator, and create your database myDB:
```sh
$ sudo su - postgres
$ psql
> CREATE DATABASE myDB;
```
Next, create your username and password( keep the single quotes around 'myPassword'):
```sh
> CREATE USER myUsername WITH PASSWORD 'myPassword';
```
You should also be sure to explicitly grant all priveleges to your new user:
```sh
GRANT ALL PRIVILEGES ON DATABASE myDB TO myUsername;
```
Now, quit out of psql:
```sh
> \q
```
and log out of the postgres administrator:
```sh
$ exit
```

Now, we can configure the Django server in this repository to work with your myDB database. Go into SeadsFront ->settings.py, and scroll down until you see the object DATABASES. Modify it to look like this:

```sh
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'myDB',
        'USER': 'myUsername',
        'PASSWORD': 'myPassword',
        'HOST': 'localhost',
        'PORT': '',
    }
}
```
You also need to migrate these changes. Go to the main directory with manage.py, and type:

```sh
$ python manage.py makemigrations
$ python manage.py migrate
```

##Running the Website
you can now run the existing Seads website! Just type:

```sh
$ python manage.py runserver 0.0.0.0:8000
```

This will run the django server on your machine, at port 8000. Open your browser, and type in 0.0.0.0:8000 at youre address bar. You should see the Seads homepage.

To view the admin page, go to 0.0.0.0:8000/admin. I'm not sure what the proper username and passwords are yet.

To see what the former groups tried to do to visualize data, go to 0.0.0.0/visualization/1. This will take a long time to load.


