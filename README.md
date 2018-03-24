[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

To deploy with Heroku simply click this button, log in/create a free Heroku account and click the "deploy for free" button at the bottom of the page.

#Django Frontend
This is a preliminary setup for our seads Frontend website, which will eventually include d3 visualizations. 

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

##Running the Website
you can now run the existing Seads website! Just type:

```sh
$ python3 manage.py runserver 0.0.0.0:8000
```

This will run the django server on your machine, at port 8000. Open your browser, and type in 0.0.0.0:8000 at youre address bar. You should see the Seads homepage.

To view the admin page, go to 0.0.0.0:8000/admin. I'm not sure what the proper username and passwords are yet.

To see what the former groups tried to do to visualize data, go to 0.0.0.0/visualization/1. This will take a long time to load.
