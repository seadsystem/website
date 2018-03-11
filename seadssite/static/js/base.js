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
    }

    // Redirect to account selection page to login
    $('#log-in').click(function (event) {
        event.preventDefault();
        var provider = new firebase.auth.GoogleAuthProvider();
        //firebase.auth().signInWithRedirect(provider);
        firebase.auth().signInWithPopup(provider).then(function (result) {
            if (result.user) {
                result.user.getIdToken().then(function (idToken) {
                    userIdToken = idToken;

                    // Send id token to backend for verification and session init
                    $.ajax('/authenticate/', {
                        headers: {
                            'Authorization': 'Bearer ' + userIdToken
                        }
                    });

                    $(document).ajaxStop(function () {
                        window.location = "/dashboard/"
                    })
                });
            }
        });
    });

    // Sign out and clear session
    $('#log-out').click(function (event) {
        // Get CSRF token to send with post req
        var csrf_token = null;
        if(document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for(var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if(cookie.substring(0, 10) === ('csrftoken=')) {
                    csrf_token = decodeURIComponent(cookie.substring(10));
                    break;
                }
            }
        }

        $.post('/logout/', { csrfmiddlewaretoken: csrf_token });
        firebase.auth().signOut();
    });


    configureFirebaseLogin();

});