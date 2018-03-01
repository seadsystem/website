$(function() {
    var config = {
        apiKey: "AIzaSyD_YhQipbxuDNLyyY5FU-YE7u1vmTMssUc",
        authDomain: "seads-8023c.firebaseapp.com",
        databaseURL: "https://seads-8023c.firebaseio.com",
        projectId: "seads-8023c",
        storageBucket: "seads-8023c.appspot.com"
    };

    var userIdToken = null;
    function configureFirebaseLogin() {
        firebase.initializeApp(config);
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                $('#log-in').hide();
                $('#register').hide();
                user.getIdToken().then(function (idToken) {
                    userIdToken = idToken;

                    // Send id token to backend for verification and session init
                    $.ajax('/authenticate/', {
                        headers: {
                            'Authorization': 'Bearer ' + userIdToken
                        }
                    });

                    // Show log out and dashboard buttons
                    $('#log-out').show();
                    $('#dashboard').show();
                });
            } else {
                $('#log-out').hide();
                $('#dashboard').hide();
                $('#log-in').show();
                $('#register').show();
            }
        });
    }

    // Redirect to account selection page to login
    $('#log-in').click(function (event) {
        event.preventDefault();
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect(provider);
    });

    // Sign out and clear session
    $('#log-out').click(function (event) {
        event.preventDefault();
        firebase.auth().signOut().then(function () {
            $.post('/logout/', { csrfmiddlewaretoken: '{{ csrf_token }}' });
            window.location.replace('/');
        }, function (error) {
            console.log(error);
        });
    });

    configureFirebaseLogin();

});

