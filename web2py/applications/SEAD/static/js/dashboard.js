// This is the js for the default/index.html view.


//dummy data for scatterdataset

// for areaspline
var tmp_data;
// var asline_data1 = [300, 300, 800, 700, 900, 110, 120];
// var asline_data2 = [100, 400, 300, 500, 600, 100, 110];


var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings


    //---------------HELPER-----------------
    var is_mod = function() {
        console.log('works');
    };

    var array_remove = function(index) {
        arr = jQuery.grep(arr, function(index) {
            return value != removeItem;
        });
        return arr
    };

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
                // console.log('here');
                newArray.push(actual[i]);
            }
        }
        return newArray;
    };

    var new_id = function() {
        self.vue.id_tracker += 1;
        return String(self.vue.id_tracker);
    };

    var editing_room = function() {
        self.vue.modal_room_name = self.vue.rooms[self.vue.action_room].name;
        self.vue.modal_chosen_icon_path = self.vue.rooms[self.vue.action_room].icon_path;
    };

    var default_room_name = function(path) {
        var dirname = path.substring(path.lastIndexOf('/') + 1);
        dirname = dirname.substring(0, dirname.lastIndexOf(".")).capitalize();
        return dirname;
    };

    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };

    var remove_el = function(id) {
        var el = $(id); //arbitrary
        el.remove();
    };

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
    };

    var initHome = function() {
        for (i = 0; i < self.vue.rooms[0].modules.length; i++) {
            self.create_chart(0, i);
        }

    }

    var initRooms = function() {
        var callback = function()
        {
            var rooms = self.vue.room_structure.rooms;
            // console.log(rooms);
            for(var i = 1; i < rooms.length; i++){
                // console.log("icon_path: " + rooms[i].icon_path);
                // console.log("room: " + rooms[i].room)
                self.vue.modal_chosen_icon_path = img_path + rooms[i].icon_path;
                self.vue.modal_room_name = rooms[i].room;
                self.add_room();
                self.modal_reinit();
            }
            console.log('Room Inited');
            enumerate(self.vue.rooms);
            self.modal_reinit();
            self.manage_btn_toggle(0);
            self.vue.isInitialized = true;
        };
        self.get_room(callback);
        // self.reload_house();
    }

    var date_picker = function () {
        $(function() {
            var start = moment().subtract(29, 'days');
            var end = moment();

            function cb(start, end) {
                $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
                self.vue.start_date = start.format('YYYY,M,D');
                self.vue.end_date = end.format('YYYY,M,D');
            }

            $('#reportrange').daterangepicker({
                startDate: start,
                endDate: end,
                ranges: {
                    'Today': [moment(), moment()],
                    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                }
            }, cb);

            cb(start, end);

        });
    }

    //---------------API calls-----------------
    self.get_room = function (callback) {
        $.getJSON(get_room_url + "?" + $.param({user_id: self.vue.user_id}),
            function (info) {
                console.log('get room success');
                // console.log(info);
                self.vue.room_structure = info;
                // success: callback;
                success: callback();
            }
        );
    }

    function get_data_url_param(room, device, start, end) {
        var param = {
            room: room,
            device: device,
            start: start,
        };
        if (end != null){
            param.end = end;
        }
        return get_data_url + "?" + $.param(param);
    }

    self.get_data = function (room, device, start, end, room_i) {
        $.getJSON(get_data_url_param(room, device, start, end),
            function (info) {
                console.log('get data success');
                // console.log(info);
                self.vue.rooms[room_i].data[0] = info;
                tmp_data = info;
                self.reload_mod(0,0);
            }
        );
    };

    //--------------------------------------


    self.test = function(i){
        // $.getJSON(test_url,
        //     function (data) {
        //         console.log('test success');
        //         tmp_data = data.user;
        //     }
        // );
        self.get_data("bedroom", "tv", self.vue.start_date, self.vue.end_date, 0);
        // console.log(tmp);
        // self.vue.rooms[0].data[0] = tmp_data;
        // console.log(self.vue.rooms[0].data[0]);
        // self.reload_house();
        // self.reload_room(self.vue.action_room)
            // self.vue.rooms[i].data[0] = scatterdataset; //test
            // scatter(self.vue.rooms[i], 0, 0);
            // scatter(self.vue.rooms[i], 1, 0);
            // scatter(self.vue.rooms[i], 2, 0);
            // barchart(self.vue.rooms[i], 2, 0);
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

    self.add_room = function() {
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

        var add_room_action = function () {
            // console.log('add_room');
            self.vue.rooms.push(new_room);
            console.log('add ' + name);
            self.vue.action_room = self.vue.rooms.length - 1;
            self.add_module(1, 'activity'); // number refers to module type
            self.add_module(3, 'devices');
            self.add_module(2, 'graph');
            self.add_module(3, 'consumption');
            self.add_module(2, 'notification');
            if (self.vue.isInitialized) {
                self.manage_btn_toggle(self.vue.rooms.length - 1); //set this to active (jump to this page)
            }
            //!!!***dummy data
            // self.vue.rooms[new_room._idx].data[0] = scatterdataset; //test
            // self.vue.rooms[new_room._idx].data[1] = asline_data1;
            // self.vue.rooms[new_room._idx].data[2] = asline_data2;
            self.vue.rooms[new_room._idx].data[3] = [40, 50, 80];
            enumerate(self.vue.rooms);
        }

        if (self.vue.isInitialized) {
            // Add to server if is init
            $.post(add_room_url,
            {
                'rooms': self.vue.room_structure.rooms.push(name),
            },  function (data) {
                    console.log('add room success');
                    add_room_action();
                    setTimeout(function() {
                        self.reload_room(new_room._idx);
                    }, 2);
                }
            ).fail(
                function(response) {
                    alert('Error: ' + response.responseText);
                }
            );
        } else {
            add_room_action();
        }

        enumerate(self.vue.rooms); //just for check

        // re-initialize ( clear modal )
        self.modal_reinit();
    };

    self.reload_house = function() {
        console.log(self.vue.rooms.length)
        for (var i = 0; i < self.vue.rooms.length; i++) {
            console.log('here');
            self.reload_room(i);
        }
    }

    self.reload_room = function(room_i) {
        var room = self.vue.rooms[room_i];
        console.log('Reload Room ' + room.name);
        for (var i = 0; i < room.modules.length; i++) {
            self.reload_mod(room_i, i);
        }
    }

    self.reload_mod = function(room_i, mod_i) {
        var mod = self.vue.rooms[room_i].modules[mod_i];
        console.log('Reloading Mod ' + mod.header);
        if (mod.chart != "") {
            mod.chart.destroy();
        } else if (mod.header == "devices") {
            $('#' + mod.el_id).empty();
        }
        self.create_chart(room_i, mod_i);
        console.log('----DONE');
    }

    self.create_chart = function(room_i, mod_i) {
        var mod = self.vue.rooms[room_i].modules[mod_i];
        if (room_i == 0) { //Home condition
            if (mod.header == "activity") {
                areaspline(self.vue.rooms, room_i, mod_i);
            } else if (mod.header == "devices") {
                htmltag = gen_dev_list(room_i);
                tmp = self.vue.rooms[room_i].modules[mod_i];
                $('#'+tmp.el_id).append("\
                    <div class=\"device-list\">\
                    <div class=\"list-group\">"
                    + htmltag +
                    "</div>\
                    </div>\
                ");
                // gauge(self.vue.rooms[room_i], mod_i, 3);
            } else if (mod.header == "graph") {
                bar(self.vue.rooms[room_i], mod_i, 3);
            } else if (mod.header == "consumption") {
                gauge(self.vue.rooms[room_i], mod_i, 3);
            } else if (mod.header == "notification") {
                gauge(self.vue.rooms[room_i], mod_i, 3);
            } else {
                console.log("create_chart() error: " + mod.header);
            }
        } else { // Normal room   ** Not done yet
            if (mod.header == "activity") {
                areaspline(self.vue.rooms, room_i, mod_i);
            } else if (mod.header == "devices") {
                htmltag = gen_dev_list(room_i);
                tmp = self.vue.rooms[room_i].modules[mod_i];
                $('#'+tmp.el_id).append("\
                    <div class=\"device-list\">\
                    <div class=\"list-group\">"
                    + htmltag +
                    "</div>\
                    </div>\
                ");
            } else if (mod.header == "graph") {
                bar(self.vue.rooms[room_i], mod_i, 3);
            } else if (mod.header == "consumption") {
                gauge(self.vue.rooms[room_i], mod_i, 3); // 3 to be changes
            } else if (mod.header == "notification") {
                areaspline(self.vue.rooms, room_i, mod_i);
            } else {
                console.log("create_chart() error: " + mod.header);
            }
        }
    }


    var gen_dev_list = function (room_i) {
        // room = self.vue.rooms[room_i];
        room_data = ['ipad', 'tv', 'light', 'ac'];   //new, change in future
        htmltag = '';
        // for(i=0; i < room_data.length; i++){
        var i = 0;
        while (i < room_data.length){
            htmltag += '<li class="list-group-item">';
            htmltag += '<span class="item-name">' + room_data[i] + '</span>';
            htmltag += '<label class="switch">';
            htmltag += '<input type="checkbox" checked>';
            htmltag += '<div class="slider round"></div></label></li>';
            i+=1;
        }
        htmltag += '<div class="btn-wrap"><button class="btn btn-warning addbtn">add device</button></div>';
        return htmltag;
    }

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
        var id = new_id();
        var new_module = {
            'header': header,
            '_idx': room.modules.length,
            'modType': modType,
            'el_id': id_name + "el_" + id,
            'id': id_name + id,
            'chart': "",
        };
        room.modules.push(new_module);
        if (self.vue.isInitialized) {
            setTimeout(function() {
                self.create_chart(self.vue.action_room, new_module._idx);
                $("html, body").animate({ scrollTop: $(document).height() }, 1000);
            }, 100);
        }
        enumerate(room.modules);
    }

    self.modal_choose_icon = function(path) {
        console.log('modal_choose_icon');
        self.vue.modal_chosen_icon_path = path;
        $('#modal-input').focus();
    }

    self.del_room = function(_idx) {
        console.log('in del_room');
        if (_idx == 0) { //cannot delete room
            console.log('Cannot delete Home');
        } else if (_idx == self.vue.action_room) { //currently using that room
            console.log('del1 for ' + self.vue.rooms[_idx].name);
            // for (i = 0; i < self.vue.rooms[_idx].modules.length; i++) {
            //     console.log("room: " + _idx + ", mod: " + i);
            //     $("#" + self.vue.rooms[_idx].modules[i].id).empty();
            // }
            // self.vue.rooms[_idx].modules = [];
            $('#del-room-modal').modal('hide');
            // jump to home   
            self.manage_btn_toggle(0);
        } else {
            console.log('del2 for ' + self.vue.rooms[_idx].name);
            // for (i = 0; i < self.vue.rooms[_idx].modules.length; i++) {
            //     console.log("room: " + _idx + ", mod: " + i);
            //     $("#" + self.vue.rooms[_idx].modules[i].id).empty();
            // }
            // self.vue.rooms[_idx].modules = [];
            $('#del-room-modal').modal('hide');
        }
        // self.vue.rooms.splice(_idx, 1); //Only work outside of this call
        setTimeout(function() {
            self.vue.rooms.splice(_idx, 1);
        }, 200);
        enumerate(self.vue.rooms);
    };


    self.del_module = function(r_idx, mod) {
        console.log('del_module : ' + self.vue.rooms[r_idx].name + "-" + mod.header);
        var wrap = $("#" + mod.id);
        var mod_element = $("#" + mod.el_id);
        $.when(wrap.fadeOut(200)).done(function() {
            $.when(wrap.css('display', '')).done(
                function() {
                    // console.log('here');
                    // remove_svg("#" + mod.el_id + "svg");
                    var room = self.vue.rooms[r_idx];
                    // if (mod.header == 'Activity' || mod.header == 'Devices') {
                    // remove_el("#" + "highcharts-0");
                    // $("#" + "highcharts-0").children().unwrap();
                    // mod.chart.destroy();
                    // }
                    // console.log(room.modules.splice(mod._idx, 1));
                    // setTimeout(function() {
                    //     console.log(room.modules.splice(mod._idx, 1));
                    // }, 500);
                    // self.reload_room(r_idx);
                    room.modules.splice(mod._idx, 1);
                    enumerate(self.vue.rooms[r_idx].modules);
                    setTimeout(function() {
                        console.log('reloading');
                        self.reload_room(r_idx);
                    }, 5);
                });
        });
        // console.log('here');
        // remove_svg("#" + mod.el_id + "svg");
        // var room = self.vue.rooms[r_idx];
        // if (mod.header == 'Activity' || mod.header == 'Devices') {
        // remove_el("#" + "highcharts-0");
        // $("#" + "highcharts-0").children().unwrap();
        // mod.chart.destroy();
        // }
        // mod_element.empty();
        // console.log(room.modules.splice(mod._idx, 1));
        // setTimeout(function() {
        // console.log(room.modules.splice(mod._idx, 1));
        // }, 500);

        // enumerate(self.vue.rooms[r_idx].modules);
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
        // This should refresh the action room's graph (delete and re-add.)
        // refresh_graph(self.vue.action_room);
        if (self.vue.isInitialized) {
            setTimeout(function() {
                self.reload_room(_idx);
            }, 1);
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

    // device-list
    Vue.component('device-list', {
        props: ['room'],
        template: ' <li class="list-group-item">\
                    <span class="item-name">Device-1</span>\
                    <!-- Rounded switch -->\
                    <label class="switch">\
                        <input type="checkbox" checked>\
                        <div class="slider round"></div>\
                    </label>\
                    </li>'
    }); // ***the delimiter in template does not change

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
            user_id: 0, // from query file
            name: 'Ewing',
            email: 'ylin62@ucsc.edu',
            room_structure: [],
            rooms: [{
                'name': 'Home', // or possibly separated from room
                '_idx': 0, // index of local manage-list
                'notice': 0,
                'data': [],
                'icon_path': img_path + "/home.png",
                'isActive': true,
                'modules': [{
                    'header': 'activity',
                    '_idx': 0,
                    'modType': 'module1', // type of module (1-3, css differ)
                    'el_id': 'Home_el_0', //for plot use( the inner el box )
                    'id': 'Home_0', // this should be computed and assigned at the insertion
                    'chart': '',
                }, {
                    'header': 'devices',
                    '_idx': 1,
                    'modType': 'module3',
                    'el_id': 'Home_el_1',
                    'id': 'Home_1',
                    'chart': '',
                }, {
                    'header': 'graph',
                    '_idx': 2,
                    'modType': 'module2',
                    'el_id': 'Home_el_2',
                    'id': 'Home_2',
                    'chart': '',
                }, {
                    'header': 'consumption',
                    '_idx': 3,
                    'modType': 'module3',
                    'el_id': 'Home_el_3',
                    'id': 'Home_3',
                    'chart': '',
                }, {
                    'header': 'notification',
                    '_idx': 4,
                    'modType': 'module2',
                    'el_id': 'Home_el_4',
                    'id': 'Home_4',
                    'chart': '',
                }],
            }, ],
            id_tracker: 4, //according to that last Home_(id)
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
            isInitialized: false,
            start_date: moment().subtract(7, 'days').format('YYYY,M,D'),
            end_date: moment().format('YYYY,M,D'),
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
        },
    });

    modal_event_init();

    // d3.select(window).on('resize', rendering);
    // console.log('d3 resize event added');

    // rendering();
    // console.log('d3 first rendering');


    //test dummy add
    // self.vue.modal_chosen_icon_path = img_path + "/bedroom.png";
    // self.add_room();
    // self.vue.modal_chosen_icon_path = img_path + "/kitchen.png";
    // self.add_room();
    // self.vue.modal_chosen_icon_path = img_path + "/office.png";
    // self.add_room();
    // self.vue.modal_chosen_icon_path = img_path + "/bathroom.png";
    // self.add_room();
    // self.vue.modal_chosen_icon_path = img_path + "/livingroom.png";
    // self.add_room();



    // self.vue.rooms[0].data[0] = scatterdataset; //test
    // self.vue.rooms[0].data[1] = asline_data1;
    // self.vue.rooms[0].data[2] = asline_data2;
    self.vue.rooms[0].data[3] = [40, 50, 80];

    // areaspline(self.vue.rooms, 0, 0);
    // gauge(self.vue.rooms[0], 1, 3);
    // gauge(self.vue.rooms[0], 2, 3);

    // scatter(self.vue.rooms[0], 2, 0);
    // self.test();
    // self.vue.rooms[1].data[0] = scatterdataset; //test
    // scatter(self.vue.rooms[1], 0, 0);
    // self.vue.rooms[2].data[0] = scatterdataset; //test
    // scatter(self.vue.rooms[2], 0, 0);
    // d3tree(self.vue.rooms[0].modules[0].el_id);

    date_picker();
    initHome();
    initRooms();

    //when not isInitialized, don't add graph when add default room above,
    // (manage_btn_toggle will trigger add graph event).
    // self.vue.isInitialized = true;    //now in initRooms
    console.log('Create Date Range Picker');


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
