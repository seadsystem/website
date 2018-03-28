[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

To deploy with Heroku simply click this button, log in/create a free Heroku account and click the "deploy for free" button at the bottom of the page.

#Django Frontend
This is a preliminary setup for our seads Frontend website, which will eventually include d3 visualizations. 

To install the necessary dependencies on Ubuntu 16.04, open a terminal and type the following commands.

    ```sh
    sudo apt-get install python3
    sudo apt-get install python3-pip
    sudo pip3 install -r requirements.txt
    ```

    
##Running the Website
you can now run the existing Seads website! Just type:

```sh
$ python3 manage.py runserver 0.0.0.0:8000
```

This will run the django server on your machine, at port 8000. Open your browser, and type in 0.0.0.0:8000 at youre address bar. You should see the Seads homepage.

Login will not work without a SEADS Firebase service account key.
