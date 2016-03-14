[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

#Django Frontend
This is a preliminary setup for our seads Frontend website, which will eventually include d3 visualizations. Currently, this website will only work with a local postgres database, which can be installed with the instructions below.

##Installation-Ubuntu 14.04
The django application within this repository must, at this time, work with a local postgres database on your machine. To install postgress on Ubuntu, type the following commands in your terminal:
```sh
$ sudo apt-get update
$ sudo apt-get install python-pip python-dev libpq-dev postgresql postgresql-contrib
```
##Installation-OSX 10.10
This assumes you have the package manager homebrew installed, if not you can go to http://brew.sh/ to download and install homebrew.

To install the necessary dependencies of this project open a terminal and type the following commands.

1. Install python3

    ```sh
    brew install python3
    ```

2. Install django

    ```sh
    pip3 install django
    ```

3. Install requests library for python

    ```sh
    pip3 install requests
    ```

4. Install Django Rest Framework

    ```sh
    pip3 install djangorestframework
    ```

5. Install Rest Framework Swagger

    ```sh
    pip3 install django-rest-swagger
    ```

6. Install postgresql

    ```sh
    brew install postgress
    ```

7. Initialize database

    ```sh
    initdb /usr/local/var/postgres
    ```

8. Launch database

    ```sh
    postgres -D /usr/local/var/postgres
    ```

9. Or configure it to launch as a background process on login
    ```sh
    mkdir -p ~/Library/LaunchAgents
    ln -sfv /usr/local/opt/postgresql/*.plist ~/Library/LaunchAgents
    launchctl load ~/Library/LaunchAgents/homebrew.mxcl.postgresql.plist
    ```

## Install psycopg2
In order to allow Django to communicate with PostgreSQL you will need to install [psycopg2](http://initd.org/psycopg/). To do this run:
```sh
pip3 install psycopg2
```

Note: if pip is having trouble finding you `pg_config` check out [this](https://rayed.com/wordpress/?p=1743) article for help.

##Setup local database for project development

Now, log in to postgres as an administrator, and create your database myDB:
(Make sure that your postgres is running before attempting this)

### Ubuntu 14.04
```sh
$ sudo su - postgres
```
### OSX 10.10+
```sh
psql -d postgres
```

#### The rest of these instructions are the same on OSX and Ubuntu

NOTE: psql folds all identifiers to lowercase! CREATE USER myUsername will actually create a user called "myusername"

```sh
$ psql
> CREATE DATABASE mydb;
```
Next, create your username and password( keep the single quotes around 'myPassword'):
```sh
> CREATE USER myusername WITH PASSWORD 'myPassword';
```
You should also be sure to explicitly grant all priveleges to your new user:
```sh
GRANT ALL PRIVILEGES ON DATABASE mydb TO myusername;
```
Now, quit out of psql:
```sh
> \q
```


Now, we can configure the Django server in this repository to work with your myDB database. Go into settings.py, and scroll down until you see the object DATABASES. Modify it to look like this:

```js
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'mydb',
        'USER': 'myusername',
        'PASSWORD': 'myPassword',
        'HOST': 'localhost',
        'PORT': '',
    }
}
```
You also need to migrate these changes. Go to the main directory with manage.py, and type:

```sh
$ python3 manage.py makemigrations
$ python3 manage.py migrate
```

##Running the Website
you can now run the existing Seads website! Just type:

```sh
$ python3 manage.py runserver 0.0.0.0:8000
```

This will run the django server on your machine, at port 8000. Open your browser, and type in 0.0.0.0:8000 at youre address bar. You should see the Seads homepage.

To view the admin page, go to 0.0.0.0:8000/admin. I'm not sure what the proper username and passwords are yet.

To see what the former groups tried to do to visualize data, go to 0.0.0.0/visualization/1. This will take a long time to load.
