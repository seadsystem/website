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

    var new_id = function() {
        self.vue.id_tracker += 1;
        return String(self.vue.id_tracker);
    }

    var editing_room = function() {
        self.vue.modal_room_name = self.vue.rooms[self.vue.action_room].name;
        self.vue.modal_chosen_icon_path = self.vue.rooms[self.vue.action_room].icon_path;
    }

    var default_room_name = function(path) {
        var dirname = path.substring(path.lastIndexOf('/') + 1);
        dirname = dirname.substring(0, dirname.lastIndexOf(".")).capitalize();
        return dirname;
    }

    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }

    //-----------------init-----------------
    var modal_event_init = function() {
        console.log('modal event inited');
        $(function() { // after all dom elements are loaded

            var add_room_modal = $('#add-room-modal');

            add_room_modal.on('shown.bs.modal', function(w) {
                $('#modal-input').focus();
            });

            add_room_modal.on('hidden.bs.modal', function(e) {
                self.modal_reinit();
            });

            var del_room_modal = $('#del-room-modal');
            // console.log(del_room_modal);
            del_room_modal.on('show.bs.modal', function(w) {
                console.log('modal2');
                $('.del-room-list').first().addClass('disabled');
            });
        });
    }

    //--------------------------------------

    self.test = function(i) {
        self.vue.rooms[i].data[0] = scatterdataset; //test
        scatter(self.vue.rooms[i], 0, 0);
    }

    self.modal_reinit = function() {
        self.vue.modal_room_name = '';
        self.vue.modal_chosen_icon_path = self.vue.default_icon_path;
    }

    self.adding_editing_room = function(action) {
        // console.log('adding_editing_room');
        if (action == 'edit') {
            self.vue.adding_room = false;
            editing_room();
        } else if (action == 'add') {
            self.vue.adding_room = true;
        } else {
            console.log('error adding_editing_room');
        }
    }

    self.add_edit_room_enter = function(action) {
        // console.log('adding_editing_room');
        if (self.vue.adding_room) {
            self.add_room();
        } else if (!self.vue.adding_room) {
            self.edit_room();
        } else {
            console.log('error adding_editing_room');
        }
        $('#add-room-modal').modal('hide');
    };

    self.edit_room = function() {
        // console.log('edit_room');
        var room = self.vue.rooms[self.vue.action_room]
        room.name = self.vue.modal_room_name;
        room.icon_path = self.vue.modal_chosen_icon_path;
        self.vue.icon_path = room.icon_path;

        // re-initialize
        self.modal_reinit();
    }

    self.del_room = function(_idx) {
        if (_idx == 0) { //cannot delete room
        } else if (_idx == self.vue.action_room) { //currently using that room
            // jump to home   
            self.manage_btn_toggle(0);
            self.vue.rooms.splice(_idx, 1);
            $('#del-room-modal').modal('hide');
        } else {
            self.vue.rooms.splice(_idx, 1);
            $('#del-room-modal').modal('hide');
        }
        enumerate(self.vue.rooms);
    };

    self.add_room = function() {
        // console.log('add_room');
        var name = (self.vue.modal_room_name ? self.vue.modal_room_name : default_room_name(self.vue.modal_chosen_icon_path));
        var id_name = name.replace(/ /g, "_") + "_"; // edit to id format
        var new_room = {
            'name': name,
            '_idx': self.vue.rooms.length,
            'notice': 0,
            'data': [],
            'modules': [],
            'isActive': false,
            'icon_path': self.vue.modal_chosen_icon_path,
        };
        self.vue.rooms.push(new_room);
        console.log('add ' + name);
        self.vue.action_room = self.vue.rooms.length - 1;
        self.add_module(1, 'Activity'); // number refers to module type
        self.add_module(3, 'Devices');
        self.add_module(2, 'Device Graph');
        self.manage_btn_toggle(self.vue.rooms.length - 1); //set this to active (jump to this page)

        enumerate(self.vue.rooms); //just for check

        // re-initialize
        self.modal_reinit();
    };


    self.add_module = function(type, header) {
        // console.log('add_module');
        var room = self.vue.rooms[self.vue.action_room];
        var id_name = room.name.replace(/ /g, "_") + "_";
        var modType = 'module1'; //default
        if (type == 2) {
            modType = 'module2';
        } else if (type == 3) {
            modType = 'module3';
        }
        var id = new_id()
        var new_module = {
            'header': header,
            '_idx': 0,
            'modType': modType,
            'el_id': id_name + "el_" + id,
            'id': id_name + id,
        }
        room.modules.push(new_module);
        enumerate(room.modules);
    }

    self.modal_choose_icon = function(path) {
        console.log('modal_choose_icon');
        self.vue.modal_chosen_icon_path = path;
        $('#modal-input').focus();
    }

    self.del_module = function(r_idx, mod) {
        // console.log('del_module');
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
        // console.log('manage_btn_toggle');
        for (i = 0; i < self.vue.rooms.length; i++) {
            if (_idx == self.vue.rooms[i]._idx) {
                // console.log('Click on ' + self.vue.rooms[i].name);
                self.vue.rooms[i].isActive = true;
                self.vue.icon_path = self.vue.rooms[i].icon_path;
                self.vue.action_room = i;
            } else {
                self.vue.rooms[i].isActive = false;
            }
        }

    };

    self.top_manage_bar_toggle = function() {
        // console.log('top_manage_bar_toggle');
        var bar = $("#top-manage-bar");
        self.vue.op_manage_bar_display = !self.vue.op_manage_bar_display;
        $("html, body").animate({ scrollTop: 0 }, 400);
        if (self.vue.op_manage_bar_display) {
            bar.hide().slideDown();
        } else {
            bar.slideUp();
        }
    };


    // Vue.component('panel-icon', {
    //     props: ['icon', ],
    //     template: ' <a v-on:click.prevent>\
    //                     <img class="panel-icon" :src="icon">\
    //                 </a>'
    // }); // ***the delimiter in template does not change

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
                                <div class="panel-heading text-left">\
                                    {{mod.header}}\
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
            rooms: [{
                'name': 'Home', // or possibly separated from room
                '_idx': 0, // index of local manage-list
                'notice': 0,
                'data': [],
                'icon_path': img_path + "/home.png",
                'isActive': true,
                'modules': [{
                    'header': 'Activity',
                    '_idx': 0,
                    'modType': 'module1', // type of module (1-3, css differ)
                    'el_id': 'Home_el_0', //for plot use( the inner el box )
                    'id': 'Home_0' // this should be computed and assigned at the insertion
                }, {
                    'header': 'Devices',
                    '_idx': 1,
                    'modType': 'module3',
                    'el_id': 'Home_el_1',
                    'id': 'Home_1'
                }, {

                    'header': 'Device Graph',
                    '_idx': 2,
                    'modType': 'module2',
                    'el_id': 'Home_el_2',
                    'id': 'Home_2'
                }],
            },],
            id_tracker: 2,
            search_bar_input_val: '',
            top_manage_bar_display: false,
            icon_path: img_path + "/home.png",
            icons: [img_path + "/bedroom.png",
                img_path + "/bedroom2.png",
                img_path + "/office.png",
                img_path + "/kitchen.png",
                img_path + "/bathroom.png",
                img_path + "/livingroom.png"
            ],
            modal_chosen_icon_path: img_path + "/home.png",
            default_icon_path: img_path + "/home.png",
            modal_room_name: '',
            action_room: 0, //_idx of room, 0 refers to Home
            adding_room: true, // modal is for editng or adding
        },
        methods: {
            manage_btn_toggle: self.manage_btn_toggle,
            test: self.test,
            top_manage_bar_toggle: self.top_manage_bar_toggle,
            del_module: self.del_module,
            add_module: self.add_module,
            modal_choose_icon: self.modal_choose_icon,
            add_room: self.add_room,
            del_room: self.del_room,
            adding_editing_room: self.adding_editing_room,
            add_edit_room_enter: self.add_edit_room_enter,
            edit_room: self.edit_room,
            modal_reinit: self.modal_reinit,
            test: self.test,
        },
    });

    modal_event_init();

    d3.select(window).on('resize', rendering);
    console.log('d3 resize event added');

    // rendering();
    // console.log('d3 first rendering');


    //test dummy add
    self.vue.modal_chosen_icon_path = img_path + "/bedroom.png";
    self.add_room();
    self.vue.modal_chosen_icon_path = img_path + "/kitchen.png";
    self.add_room();
    self.vue.modal_chosen_icon_path = img_path + "/office.png";
    self.add_room();
    self.vue.modal_chosen_icon_path = img_path + "/bathroom.png";
    self.add_room();
    self.vue.modal_chosen_icon_path = img_path + "/livingroom.png";
    self.add_room();
    self.modal_reinit();
    self.manage_btn_toggle(0);

    self.vue.rooms[0].data[0] = scatterdataset; //test
    scatter(self.vue.rooms[0], 0, 0);
    // self.test();
    self.vue.rooms[1].data[0] = scatterdataset; //test
    scatter(self.vue.rooms[1], 0, 0);
    // self.vue.rooms[2].data[0] = scatterdataset; //test
    // scatter(self.vue.rooms[2], 0, 0);
    // d3tree(self.vue.rooms[0].modules[0].el_id);

    // self.test();
    $("#vue-div").show();
    console.log('Vue initialized');
    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function() {
    APP = app();
    console.log('APP returned');
});


//draggable Example   module component draggable class
// $(function() {
//     console.log('draggable loadeed');
//     // target elements with the "draggable" class
//     interact('.draggable')
//         .draggable({
//             // enable inertial throwing
//             inertia: true,
//             // keep the element within the area of it's parent
//             restrict: {
//                 restriction: "parent",
//                 endOnly: true,
//                 elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
//             },
//             // enable autoScroll
//             autoScroll: true,
//
//             // call this function on every dragmove event
//             onmove: dragMoveListener,
//             // call this function on every dragend event
//             onend: function(event) {
//                 var textEl = event.target.querySelector('p');
//
//                 textEl && (textEl.textContent =
//                     'moved a distance of ' + (Math.sqrt(event.dx * event.dx +
//                         event.dy * event.dy) | 0) + 'px');
//             }
//         });
//
//     function dragMoveListener(event) {
//         var target = event.target,
//             // keep the dragged position in the data-x/data-y attributes
//             x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
//             y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
//
//         // translate the element
//         target.style.webkitTransform =
//             target.style.transform =
//             'translate(' + x + 'px, ' + y + 'px)';
//
//         // update the posiion attributes
//         target.setAttribute('data-x', x);
//         target.setAttribute('data-y', y);
//     }
//
//     // this is used later in the resizing and gesture demos
//     window.dragMoveListener = dragMoveListener;
// });
//DUMMY ROOM
// {
//     'name': 'Home', // or possibly separated from room
//     '_idx': 0, // index of local manage-list
//     'notice': 0,
//     'data': [],
//     // Data is a list containing all devices data
//     // according data query file from android team, data should be a 
//     // list of value with heading ["time", "W"]
//     // follow by lots of data list ["2015-09-29 15:44:14.405187", "-4"]
//     // integrate with D3.js
//     'modules': [{
//         'header': 'Activity',
//         '_idx': 0,
//         'modType': 'module1', // type of module (1-3, css differ)
//         'el_id': 'Home0', //for plot use( the inner el box )
//         'id': '00001' // this should be computed and assigned at the insertion
//     }, {
//         'header': 'Device',
//         // 'data': [],
//         '_idx': 2,
//         'modType': 'module3',
//         'el_id': 'Home2',
//         'id': '000055'
//     }, {

//         'header': 'Device name',
//         // 'data': [],
//         '_idx': 1,
//         'modType': 'module2',
//         'el_id': 'Home1',
//         'id': '00002'
//     }], // a list of module 
//     'isActive': true, // is active or not
//     'icon_path': 'images/logo2.png'
// }, {
//     'name': 'Master Bedroom',
//     '_idx': 1,
//     'notice': 0,
//     'data': [],
//     'modules': [{
//         'header': 'Bedroom Dummy0',
//         // 'data': [],
//         '_idx': 0,
//         'modType': 'module1',
//         'el_id': 'M0',
//         'id': '00004'
//     }, {
//         'header': 'Bedroom Dummy1',
//         // 'data': [],
//         '_idx': 1,
//         'modType': 'module1',
//         'el_id': 'M1',
//         'id': '00005'
//     }, {
//         'header': 'Bedroom Dummy2',
//         // 'data': [],
//         '_idx': 2,
//         'modType': 'module1',
//         'el_id': 'M3',
//         'id': '00006'
//     }],
//     'isActive': false,
//     'icon_path': 'images/bedroom2.png'
// }, {
//     'name': 'Living Room',
//     '_idx': 2,
//     'notice': 0,
//     'data': [],
//     'modules': [{
//         'header': 'Living Dummy0',
//         // 'data': [],
//         '_idx': 0,
//         'modType': 'module3',
//         'el_id': 'L0',
//         'id': '00007'
//     }, {
//         'header': 'Living Dummy1',
//         // 'data': [],
//         '_idx': 1,
//         'modType': 'module2',
//         'el_id': 'L1',
//         'id': '00008'
//     }, {
//         'header': 'Living Dummy2',
//         // 'data': [],
//         '_idx': 2,
//         'modType': 'module1',
//         'el_id': 'L2',
//         'id': '00009'
//     }],
//     'isActive': false,
//     'icon_path': 'images/livingroom.png'
// }
