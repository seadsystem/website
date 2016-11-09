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

    var array_remove = function(index) {
        arr = jQuery.grep(arr, function(index) {
            return value != removeItem;
        });
        return arr
    }

    var enumerate = function(v) {
        var k = 0;
        return v.map(function(e) {
            e._idx = k++;
        });
    };

    var cleanArray = function(actual) {
        var newArray = new Array();
        for (var i = 0; i < actual.length; i++) {
            if (actual[i]) {
                console.log('here');
                newArray.push(actual[i]);
            }
        }
        return newArray;
    }


    //--------------------------------------

    self.del_module = function(r_idx, mod) {
        var tmp = $("#" + mod.el_id + "svg"); //arbitrary
        var wrap = $("#" + mod.id);
        $.when(wrap.fadeOut(300)).done(function() {
            $.when(wrap.css('display', '')).done(
                function() {
                    console.log('here');
                    tmp.remove();
                    var room = self.vue.rooms[r_idx];
                    room.modules.splice(mod._idx, 1);
                    enumerate(self.vue.rooms[r_idx].modules);
                });
        });
    };

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
                self.vue.icon_path = self.vue.rooms[i].icon_path;
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
        props: ['mod', 'room', 'del_module'],
        template: ' <div class="mo" :class="mod.modType" :id="mod.id">\
                        <div class="mo-el">\
                            <div class="panel panel-default">\
                                <div class="panel-heading text-center">\
                                    {{mod.device}}\
                                    <a href="" v-on:click.prevent="del_module(room._idx, mod);" class="pull-right">\
                                        <i class="fa fa-times" aria-hidden="true"></i>\
                                    </a>\
                                </div>\
                                <div class="panel-body" :id="mod.el_id">\
                                    <div class="tooltip hidden">\
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
                        'el_id': 'Home0', //for plot use( the inner el box )
                        'id': '00001' // this should be computed and assigned at the insertion
                    }, {
                        'device': 'Home Dummy1',
                        'data': [],
                        '_idx': 1,
                        'modType': 'module2',
                        'el_id': 'Home1',
                        'id': '00002'
                    }, {
                        'device': 'Home Dummy2',
                        'data': [],
                        '_idx': 2,
                        'modType': 'module3',
                        'el_id': 'Home2',
                        'id': '000055'
                    }], // a list of module 
                    'isActive': true, // is active or not
                    'icon_path': 'images/logo2.png'
                }, {
                    'name': 'Master Bedroom',
                    '_idx': 1,
                    'notice': 0,
                    'modules': [{
                        'device': 'Bedroom Dummy0',
                        'data': [],
                        '_idx': 0,
                        'modType': 'module1',
                        'el_id': 'M0',
                        'id': '00004'
                    }, {
                        'device': 'Bedroom Dummy1',
                        'data': [],
                        '_idx': 1,
                        'modType': 'module1',
                        'el_id': 'M1',
                        'id': '00005'
                    }, {
                        'device': 'Bedroom Dummy2',
                        'data': [],
                        '_idx': 2,
                        'modType': 'module1',
                        'el_id': 'M3',
                        'id': '00006'
                    }],
                    'isActive': false,
                    'icon_path': 'images/bedroom2.png'
                }, {
                    'name': 'Living Room',
                    '_idx': 2,
                    'notice': 0,
                    'modules': [{
                        'device': 'Living Dummy0',
                        'data': [],
                        '_idx': 0,
                        'modType': 'module3',
                        'el_id': 'L0',
                        'id': '00007'
                    }, {
                        'device': 'Living Dummy1',
                        'data': [],
                        '_idx': 1,
                        'modType': 'module2',
                        'el_id': 'L1',
                        'id': '00008'
                    }, {
                        'device': 'Living Dummy2',
                        'data': [],
                        '_idx': 2,
                        'modType': 'module1',
                        'el_id': 'L2',
                        'id': '00009'
                    }],
                    'isActive': false,
                    'icon_path': 'images/livingroom.png'
                }

            ],
            search_bar_input_val: '',
            top_manage_bar_display: false,
            icon_path: 'images/logo2.png'
        },
        methods: {
            manage_btn_toggle: self.manage_btn_toggle,
            test: self.test,
            top_manage_bar_toggle: self.top_manage_bar_toggle,
            del_module: self.del_module
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
