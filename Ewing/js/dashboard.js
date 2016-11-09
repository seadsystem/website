// This is the js for the default/index.html view.


//dummy data for scatterdataset
var scatterdataset = [{
    "amount": 3.15,
    "device": "AC",
    "hour": 18,
    "epc": 317,
    "total": 98.9,
    "was_on": 312
}, {

    "amount": 0.75,
    "device": "AC",
    "hour": 12,
    "epc": 120,
    "total": 57,
    "was_on": 1359
}, {
    "amount": 1.71,
    "device": "AC",
    "hour": 10,
    "epc": 171,
    "total": 21.7,
    "was_on": 127
}, {
    "amount": 1.85,
    "device": "AC",
    "hour": 8,
    "epc": 171,
    "total": 14.1,
    "was_on": 83
}, {
    "amount": 1.72,
    "device": "AC",
    "hour": 6,
    "epc": 170,
    "total": 10.7,
    "was_on": 63
}, {
    "amount": 1.43,
    "device": "AC",
    "hour": 4,
    "epc": 143,
    "total": 8.8,
    "was_on": 62
}, {
    "amount": 0.58,
    "device": "AC",
    "hour": 2,
    "epc": 58,
    "total": 11.3,
    "was_on": 195
}, {
    "amount": 1.26,
    "device": "AC",
    "hour": 0,
    "epc": 126,
    "total": 7.6,
    "was_on": 60

}];



var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings


    //---------------HELPER-----------------
    var is_mod = function() {
        console.log('works');
    }

    //--------------------------------------

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    self.manage_btn_toggle = function(_idx) {
        for (i = 0; i < self.vue.rooms.length; i++) {
            if (_idx == self.vue.rooms[i]._idx) {
                console.log('Click on ' + self.vue.rooms[i].name);
                self.vue.rooms[i].isActive = true;
            } else {
                self.vue.rooms[i].isActive = false;
            }
        }
    };

    self.top_manage_bar_toggle = function() {
        var bar = $("#top-manage-bar");
        self.vue.op_manage_bar_display = !self.vue.op_manage_bar_display;
        if (self.vue.op_manage_bar_display) {
            bar.hide().slideDown();
        } else {
            bar.slideUp();
        }
    };


    // manage-bar => manage-list
    Vue.component('manage-item', {
        props: ['room', 'manage_btn_toggle'],
        template: ' <a href=""\
                    class="list-group-item manage-item"\
                    :class="{active:room.isActive}"\
                    v-on:click.prevent="manage_btn_toggle(room._idx);">\
                    {{room.name}}\
                    </a>'
    }); // ***the delimiter in template does not change

    // manage-bar => manage-list
    Vue.component('top-manage-item', {
        props: ['room', 'manage_btn_toggle', 'top_manage_bar_toggle'],
        template: ' <a href=""\
                    class="list-group-item manage-item"\
                    :class="{active:room.isActive}"\
                    v-on:click.prevent="manage_btn_toggle(room._idx); top_manage_bar_toggle();">\
                    {{room.name}}\
                    </a>'
    }); // ***the delimiter in template does not change

    // page-wrap => module-wrap
    Vue.component('module', {
        props: ['mod'],
        template: ' <div class="mo" :class="mod.modType">\
                        <div class="mo-el">\
                            <div class="panel panel-default">\
                                <div class="panel-heading">{{mod.device}}</div>\
                                <div class="panel-body" :id="mod.id">\
                                    <div class="tooltip" class="hidden">\
                                        <p id="value"> </p>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                    </div>'
    }); // ***the delimiter in template does not change


    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            house_id: 99, // Not sure, from query file
            user_id: 123, // from query file
            rooms: [ //dummy now
                {
                    'name': 'Home', // or possibly separated from room
                    '_idx': 0, // index of local manage-list
                    'notice': 0,
                    'modules': [{
                        'device': 'Home Dummy0',
                        'data': [], // according data query file from android team, data should be a 
                        // list of value with heading ["time", "W"]
                        // follow by lots of data list ["2015-09-29 15:44:14.405187", "-4"]
                        // integrate with D3.js
                        '_idx': 0,
                        'modType': 'module1', // type of module (1-3, css differ)
                        'id': 'Home1'
                    }, {
                        'device': 'Home Dummy1',
                        'data': [], // according data query file from android team, data should be a 
                        // list of value with heading ["time", "W"]
                        // follow by lots of data list ["2015-09-29 15:44:14.405187", "-4"]
                        // integrate with D3.js
                        '_idx': 1,
                        'modType': 'module2', // type of module (1-3, css differ)
                        'id': 'Home1'
                    }, {
                        'device': 'Home Dummy2',
                        'data': [], // according data query file from android team, data should be a 
                        // list of value with heading ["time", "W"]
                        // follow by lots of data list ["2015-09-29 15:44:14.405187", "-4"]
                        // integrate with D3.js
                        '_idx': 2,
                        'modType': 'module3', // type of module (1-3, css differ)
                        'id': 'Home2'
                    }], // a list of module 
                    'isActive': true, // is active or not
                    'icon_path': ''
                }, {
                    'name': 'Master Bedroom', // or possibly separated from room
                    '_idx': 1, // index of local manage-list
                    'notice': 0,
                    'modules': [{
                        'device': 'Bedroom Dummy0',
                        'data': [], // according data query file from android team, data should be a 
                        // list of value with heading ["time", "W"]
                        // follow by lots of data list ["2015-09-29 15:44:14.405187", "-4"]
                        // integrate with D3.js
                        '_idx': 0,
                        'modType': 'module1', // type of module (1-3, css differ)
                        'id': 'M0'
                    }, {
                        'device': 'Bedroom Dummy1',
                        'data': [], // according data query file from android team, data should be a 
                        // list of value with heading ["time", "W"]
                        // follow by lots of data list ["2015-09-29 15:44:14.405187", "-4"]
                        // integrate with D3.js
                        '_idx': 1,
                        'modType': 'module1', // type of module (1-3, css differ)
                        'id': 'M1'
                    }, {
                        'device': 'Bedroom Dummy2',
                        'data': [], // according data query file from android team, data should be a 
                        // list of value with heading ["time", "W"]
                        // follow by lots of data list ["2015-09-29 15:44:14.405187", "-4"]
                        // integrate with D3.js
                        '_idx': 2,
                        'modType': 'module1', // type of module (1-3, css differ)
                        'id': 'M3'
                    }], // a list of module 
                    'isActive': false, // is active or not
                    'icon_path': ''
                }, {
                    'name': 'Living Room', // or possibly separated from room
                    '_idx': 2, // index of local manage-list
                    'notice': 0,
                    'modules': [{
                        'device': 'Living Dummy0',
                        'data': [], // according data query file from android team, data should be a 
                        // list of value with heading ["time", "W"]
                        // follow by lots of data list ["2015-09-29 15:44:14.405187", "-4"]
                        // integrate with D3.js
                        '_idx': 0,
                        'modType': 'module3', // type of module (1-3, css differ)
                        'id': 'L0'
                    }, {
                        'device': 'Living Dummy1',
                        'data': [], // according data query file from android team, data should be a 
                        // list of value with heading ["time", "W"]
                        // follow by lots of data list ["2015-09-29 15:44:14.405187", "-4"]
                        // integrate with D3.js
                        '_idx': 1,
                        'modType': 'module2', // type of module (1-3, css differ)
                        'id': 'L1'
                    }, {
                        'device': 'Living Dummy2',
                        'data': [], // according data query file from android team, data should be a 
                        // list of value with heading ["time", "W"]
                        // follow by lots of data list ["2015-09-29 15:44:14.405187", "-4"]
                        // integrate with D3.js
                        '_idx': 2,
                        'modType': 'module1', // type of module (1-3, css differ)
                        'id': 'L2'
                    }], // a list of module 
                    'isActive': false, // is active or not
                    'icon_path': ''
                }

            ],
            search_bar_input_val: '',
            top_manage_bar_display: false
        },
        methods: {
            manage_btn_toggle: self.manage_btn_toggle,
            test: self.test,
            top_manage_bar_toggle: self.top_manage_bar_toggle
        },
    });



    $("#vue-div").show();
    console.log('vue');
    self.vue.rooms[0].modules[0].data = scatterdataset; //test
    scatter(self.vue.rooms[0].modules[0]);
    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function() {
    APP = app();
});
