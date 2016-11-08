// This is the js for the default/index.html view.

var app = function () {

    var self = {};

    Vue.config.silent = false; // show all warnings


    //---------------HELPER-----------------

    // Extends an array
    self.extend = function (a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };


    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            search_bar_input_val: ''
        },
        methods: {
            //get_more: self.get_more,
        }
    });


    Vue.component('post', {
        props: ['post',
            'user_email',
            'date_created',
            'edit_post',
            'clear_form',
            'editing',
            'action',
            'delete_post'],
        template: ' <div class="post-content">\
                    <div class="post_title">{{post.title}}</div>\
                    <div class="post_content">{{post.content}}\
                        <div  class="edit_icon" v-if="user_email==post.author_email">\
                            <a href="#" v-on:click="edit_post(post.title, post.content); action(post.id); " v-if="!editing">\
                                <i class="fa fa-pencil icon"></i>\
                            </a>\
                            <a href="#" v-on:click="delete_post(post.id);">\
                                <i class="fa fa-trash-o icon"></i>\
                            </a>\
                        </div>\
                    </div>\
                    <div class="meta">{{post.author}}</div>\
                    <div class="meta">{{post.date_created}}</div>\
                    <div class="meta">{{post.date_updated}}</div>\
                    </div>'
    }); // ***the delimiter in template does not change


    $("#vue-div").show();
    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function () {
    APP = app();
});
