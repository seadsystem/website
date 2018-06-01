var app = function () {

    var self = {};

    Vue.config.silent = false; // show all warnings

    var enumerate = function (v) {
        var k = 0;
        return v.map(function (e) {
            e._idx = k++;
        });
    };

    var new_id = function () {
        self.vue.id_tracker += 1;
        return String(self.vue.id_tracker);
    };

    var editing_room = function () {
        self.vue.modal_room_name = self.vue.rooms[self.vue.action_room].name;
        self.vue.modal_chosen_icon_path = self.vue.rooms[self.vue.action_room].icon_path;
    };

    var default_room_name = function (path) {
        var dirname = path.substring(path.lastIndexOf("/") + 1);
        dirname = dirname.substring(0, dirname.lastIndexOf(".")).capitalize();
        return dirname;
    };

    String.prototype.capitalize = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };

    //-----------------init-----------------
    var modal_event_init = function () {
        console.log("modal event inited");
        $(function () { // after all dom elements are loaded

            var add_room_modal = $("#add-room-modal");

            add_room_modal.on("shown.bs.modal", function (w) {
                $("#modal-input").focus();
            });

            add_room_modal.on("hidden.bs.modal", function (e) {
                self.modal_reinit();
            });

            var del_room_modal = $("#del-room-modal");
            // console.log(del_room_modal);
            del_room_modal.on("show.bs.modal", function (w) {
                console.log("modal2");
                $('.del-room-list').first().addClass('disabled');
            });
        });
    };

    function date_picker() {
        var start = moment().subtract(7, 'days');
        var end = moment();

        function cb(start, end) {
            $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            self.vue.start_date = Math.floor(start / 1000);
            self.vue.end_date = Math.floor(end / 1000);
            console.log(moment.unix(self.vue.start_date).format("MM/DD/YYYY h:mm a") + " to " + moment.unix(self.vue.end_date).format("MM/DD/YYYY h:mm a"));
            refresh_data();
            self.create_chart(self.vue.action_room, 0);
        }

        $('#reportrange').daterangepicker({
            dateLimit: {
                "months": 1,
            },
            startDate: start,
            endDate: end,
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment()],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        }, cb);

        cb(start, end);
    }

    // Generates a power data structure and generates monthly power usage data for each appliance
    function init_data() {
        Object.keys(device.rooms).forEach(function (room) {
            Object.keys(device.rooms[room].appliances).forEach(function (appliance) {
                var appl_id = device.rooms[room].appliances[appliance].id;
                self.vue.power_data[appl_id] = {
                    name: appliance,
                    monthly_data: gen_monthly_appl_data(self.vue.device_id, appliance, appl_id),
                    data: undefined,
                };
            });
        });
    }

    // Refreshes saved power data based on current start and end date
    function refresh_data() {
        console.log("refresh_data");
        Object.keys(self.vue.power_data).forEach(function (appl_id) {
            self.vue.power_data[appl_id].data = gen_cont_appl_data(self.vue.device_id, self.vue.power_data[appl_id].name,
                appl_id, self.vue.start_date, self.vue.end_date, 30);
        });
    }

    var init_home = function () {
        for (var i = 0; i < self.vue.rooms[0].modules.length; i++) {
            self.create_chart(0, i);
        }
    }

    var init_rooms = function () {
        var rooms = self.vue.room_structure.rooms;
        Object.keys(rooms).forEach(function (room_name) {
            var room = rooms[room_name];
            self.vue.modal_chosen_icon_path = img_path + "/" + room.icon + ".png";
            self.vue.modal_room_name = room_name;
            self.vue.modal_appliances = room.appliances;
            self.vue.add_room();
            self.modal_reinit();
        });
        enumerate(self.vue.rooms);
        self.modal_reinit();
        self.manage_btn_toggle(0);
        self.vue.isInitialized = true;
    }

    // Generates monthly usage of specified panel for the last 12 months
    function gen_monthly_appl_data(device_id, appl_name, appl_id) {
        var result = [];

        var points = [];
        var start = moment().subtract(12, "months").startOf("month");
        var end = moment().subtract(5, "minutes");
        var time;
        for (var i = 0; i <= 12; i++) {
            time = Math.floor(start / 1000);
            $.ajax({
                url: "http://db.sead.systems:8080/" + device_id + "?start_time=" + time + "&end_time=" + time + "&device=" + appl_id + "&type=P",
                dataType: 'json',
                async: false,
                success: function (data_test) {
                    points.push(data_test[1]);
                }
            });
            if (i >= 11)
                start = end;
            else
                start.add(1, "month");
        }

        for (var i = 1; i < points.length; i++) {
            if (points[i] !== undefined && points[i - 1] !== undefined) {
                result.push(
                    Math.abs((points[i - 1][1] - points[i][1]) / 3600000)
                )
            } else
                result.push(null);
        }
        return result;
    }

    // Generates continous power usage data for the specified parameters
    function gen_cont_appl_data(device_id, name, appliance_id, start, end, data_points) {
        var granularity = Math.floor((end - start) / data_points);

        var result = [];
        $.ajax({
            url: "http://db.sead.systems:8080/" + device_id + "?start_time=" + start + "&end_time=" + end +
            "&list_format=energy&type=P&device=" + appliance_id + "&granularity=" + granularity,
            dataType: 'json',
            async: false,
            success: function (response) {
                result = Object.keys(response.data).reverse().map(function (key) {
                    return [moment(response.data[key]["time"], "YYYY-MM-DD HH:mm:ss").valueOf(), parseFloat(response.data[key]["energy"])];
                })
            }
        });
        document.getElementById("loader").style.display = "none"
        return result;
    }

    // Generates areaspline graph for the specified room
    function gen_line_chart(room_i, mod_i) {
        var payload = [];
        var appliances;

        var temp = [];
        if (room_i == 0) {
            var appl_data;
            for (var i = 1; i < self.vue.rooms.length; i++) {
                appliances = self.vue.rooms[i].appliances;
                Object.keys(appliances).forEach(function (key, index) {
                    appl_data = self.vue.power_data[appliances[key].id].data;
                    for (var j = 0; j < appl_data.length; j++) {
                        if (index == 0)
                            temp[j] = appl_data[j].slice(0);
                        else
                            temp[j][1] = temp[j][1] + appl_data[j][1];
                    }
                });
                payload.push({
                    name: self.vue.rooms[i].name,
                    data: temp
                });
                temp = [];
            }
        } else {
            appliances = self.vue.rooms[room_i].appliances;
            Object.keys(appliances).forEach(function (key) {
                payload.push({
                    name: key,
                    data: self.vue.power_data[appliances[key].id].data,
                });
            });
        }
        areaspline(self.vue.rooms[room_i], mod_i, payload);
    }

    // Generates bar chart for specified room
    function gen_bar_chart(room_i, mod_i) {
        var categories = [];
        var month = moment().month() + 1;
        for (var i = 0; i < 12; i++) {
            categories.push(moment().month(month).format('MMMM'));
            month = (month + 1) % 12;
        }

        var payload = [];
        var appliances;
        if (room_i == 0) {
            var temp = [];
            var appl_data;
            for (var i = 1; i < self.vue.rooms.length; i++) {
                appliances = self.vue.rooms[i].appliances;
                Object.keys(appliances).forEach(function (key, index) {
                    appl_data = self.vue.power_data[appliances[key].id].monthly_data;
                    if (index == 0)
                        temp = appl_data.slice();
                    else {
                        for (var j = 0; j < appl_data.length; j++) {
                            if (appl_data[j] != null)
                                temp[j] += appl_data[j];
                        }
                    }
                });
                payload.push({
                    name: self.vue.rooms[i].name,
                    data: temp
                })
            }
        } else {
            appliances = self.vue.rooms[room_i].appliances;
            Object.keys(appliances).forEach(function (key) {
                payload.push({
                    name: key,
                    data: self.vue.power_data[appliances[key].id].monthly_data
                });
            });
        }
        bar(self.vue.rooms[room_i], mod_i, categories, payload);
    }

    self.modal_reinit = function () {
        self.vue.modal_room_name = '';
        self.vue.modal_chosen_icon_path = self.vue.default_icon_path;
    }

    self.adding_editing_room = function (action) {
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

    self.add_edit_room_enter = function (action) {
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

    self.edit_room = function () {
        // console.log('edit_room');
        var room = self.vue.rooms[self.vue.action_room];
        room.name = self.vue.modal_room_name;
        room.icon_path = self.vue.modal_chosen_icon_path;
        self.vue.icon_path = room.icon_path;

        // re-initialize
        self.modal_reinit();
    }

    self.add_room = function () {
        var name = (self.vue.modal_room_name ? self.vue.modal_room_name : default_room_name(self.vue.modal_chosen_icon_path));
        var new_room = {
            'name': name,
            '_idx': self.vue.rooms.length,
            'notice': 0,
            'data': [],
            'appliances': self.vue.modal_appliances,
            'modules': [],
            'isActive': false,
            'icon_path': self.vue.modal_chosen_icon_path,
        };

        var add_room_action = function () {
            self.vue.rooms.push(new_room);
            self.vue.action_room = self.vue.rooms.length - 1;
            self.add_module(1, 'activity'); // number refers to module type
            //self.add_module(3, 'devices');
            self.add_module(2, 'graph');
            self.add_module(3, 'consumption');
            //self.add_module(2, 'notification');
            if (self.vue.isInitialized) {
                self.manage_btn_toggle(self.vue.rooms.length - 1); //set this to active (jump to this page)
            }
            enumerate(self.vue.rooms);
        }

        if (self.vue.isInitialized) {
            var icon = self.vue.modal_chosen_icon_path.split('\\').pop().split('/').pop();
            icon = icon.substring(0, icon.length - 4);
            console.log(icon);
            self.vue.room_structure.rooms[name] = {
                icon: icon
            };
            $.post("/update_info/",
                {
                    csrfmiddlewaretoken: self.vue.csrf_token,
                    device_id: self.vue.device_id,
                    data: JSON.stringify(self.vue.room_structure)
                }, function () {
                    console.log('add room success');
                    add_room_action();
                    setTimeout(function () {
                        self.reload_room(new_room._idx);
                    }, 2);
                }
            ).fail(
                function (response) {
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

    self.reload_house = function () {
        console.log(self.vue.rooms.length)
        for (var i = 0; i < self.vue.rooms.length; i++) {
            console.log('here');
            self.reload_room(i);
        }
    }

    self.reload_room = function (room_i) {
        var room = self.vue.rooms[room_i];
        console.log('Reload Room ' + room.name);
        for (var i = 0; i < room.modules.length; i++) {
            self.reload_mod(room_i, i);
        }
    }

    self.reload_mod = function (room_i, mod_i) {
        var mod = self.vue.rooms[room_i].modules[mod_i];
        if (mod.chart != "") {
            mod.chart.destroy();
        } else if (mod.header == "devices") {
            $('#' + mod.el_id).empty();
        }
        self.create_chart(room_i, mod_i);
    }

    var isSortInitialized = false;

    self.create_chart = function (room_i, mod_i) {
        var mod = self.vue.rooms[room_i].modules[mod_i];
        if (mod.header == "activity") {
            gen_line_chart(room_i, mod_i);
        } else if (mod.header == "devices") {
            $('#' + mod.el_id).empty();
            htmltag = gen_dev_list(room_i);
            tmp = self.vue.rooms[room_i].modules[mod_i];
            $('#' + tmp.el_id).append("\
                    <div class=\"device-list\">\
                    <div class=\"list-group\">"
                + htmltag +
                "</div>\
                </div>\
            ");
        } else if (mod.header == "graph") {
            gen_bar_chart(room_i, mod_i);
        } else if (mod.header == "consumption") {
            gauge(self.vue.rooms[room_i], mod_i, self.vue.device_id);
        } else if (mod.header == "notification") {
            //gauge(self.vue.rooms[room_i], mod_i, self.vue.device_id);
        } else if (mod.header == "Sort appliances") {
            console.log("sort appliances");
            tmp = self.vue.rooms[room_i].modules[mod_i];
            console.log("tmpelid");
            console.log($('#' + tmp.el_id));
            if (!isSortInitialized) {
                // construct string to contain individual divs
                var sortAppliancesString = gen_application_sort_string();

                $('#' + tmp.el_id).append(sortAppliancesString);

                isSortInitialized = true;
            }
        } else {
            console.log("create_chart() error: " + mod.header);
        }
    }


    // gen_application_sort_string()
    // generates html to display the Sort Application module on the homepage
    var gen_application_sort_string = function () {

        var sortAppliancesString = '<div id = "application-sort-container">' +
            '           <table id="application-sort-table">' +
            '               <tr>';
        curDevice = self.vue.device_id;

        var rooms = device.rooms;
        var roomIds = Object.keys(rooms);
        var idIndex = 0;
        for (var i = 0; i < roomIds.length; i++) {
            var roomName = roomIds[i];
            var room = rooms[roomName];
            var appliancesKeys = Object.keys(room.appliances); // array of names of the appliances as shown to the user
            var appliancesValues = Object.values(room.appliances); // array of objects containing id's of the appliances which is used to communicate with the SEADS db
            console.log('---------');
            console.log(roomName);
            // In this loop, inject the new div for another room-column container
            sortAppliancesString = sortAppliancesString +
                '                   <td>' +
                '                       <div class="room-column-container">' +
                '                           <div class="unselectable room-column" unselectable="on" id = "' + roomName + '" ondrop="column = this; applianceSortDrop(event)" ondragover="applianceSortAllowDrop(event)">' +
                '                               <h3 class="unselectable roomNameHeader" unselectable="on">' + roomName + '</h1>' +
                '                               <hr>';

            for (var appliancesIndex = 0; appliancesIndex < appliancesKeys.length; appliancesIndex++) {
                idIndex++;
                sortAppliancesString = sortAppliancesString +
                    '                                   <p class="draggable" id="' + appliancesValues[appliancesIndex].id + '" draggable="true" ondragstart="applianceSortDragged(event)">' + appliancesKeys[appliancesIndex] + '</p>';
            }
            // close the room-column-container and room-column div
            sortAppliancesString = sortAppliancesString +
                '                           </div>' +
                '                       </div>' +
                '                   </td>';
        }
        sortAppliancesString = sortAppliancesString +
            '               </tr>' +
            '           </table>' +
            '       </div>';
        return sortAppliancesString;
    };

    var gen_dev_list = function (room_i) {
        appliances = self.vue.rooms[room_i].appliances;

        htmltag = '';
        for (var key in appliances) {
            if (!appliances.hasOwnProperty(key))
                continue;
            htmltag += '<li class="list-group-item">';
            htmltag += '<span class="item-name">' + key + '</span>';
            htmltag += '<label class="switch">';
            htmltag += '<input type="checkbox" checked>';
            htmltag += '<div class="slider round"></div></label></li>';
        }
        htmltag += '<div class="btn-wrap"><button class="btn btn-warning addbtn">add device</button></div>';
        return htmltag;
    }

    self.add_module = function (type, header) {
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
            setTimeout(function () {
                self.create_chart(self.vue.action_room, new_module._idx);
                $("html, body").animate({scrollTop: $(document).height()}, 1000);
            }, 100);
        }
        enumerate(room.modules);
    }

    self.modal_choose_icon = function (path) {
        console.log('modal_choose_icon');
        self.vue.modal_chosen_icon_path = path;
        $('#modal-input').focus();
    }

    self.del_room = function (_idx) {
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
        setTimeout(function () {
            self.vue.rooms.splice(_idx, 1);
        }, 200);
        enumerate(self.vue.rooms);
    };


    self.del_module = function (r_idx, mod) {
        console.log('del_module : ' + self.vue.rooms[r_idx].name + "-" + mod.header);
        var wrap = $("#" + mod.id);
        var mod_element = $("#" + mod.el_id);
        $.when(wrap.fadeOut(200)).done(function () {
            $.when(wrap.css('display', '')).done(
                function () {
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
                    setTimeout(function () {
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


    self.manage_btn_toggle = function (_idx) {
        // console.log('manage_btn_toggle');
        for (var i = 0; i < self.vue.rooms.length; i++) {
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
        if (self.vue.isInitialized) {
            setTimeout(function () {
                self.reload_room(_idx);
            }, 1);
        }
    };

    self.top_manage_bar_toggle = function () {
        // console.log('top_manage_bar_toggle');
        var bar = $("#top-manage-bar");
        self.vue.op_manage_bar_display = !self.vue.op_manage_bar_display;
        $("html, body").animate({scrollTop: 0}, 400);
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
            csrf_token: function () {
                var csrf_token = null;
                if (document.cookie && document.cookie !== '') {
                    var cookies = document.cookie.split(';');
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = jQuery.trim(cookies[i]);
                        if (cookie.substring(0, 10) === ('csrftoken=')) {
                            csrf_token = decodeURIComponent(cookie.substring(10));
                            break;
                        }
                    }
                }
                return csrf_token;
            },
            house_id: 99, // Not sure, from query file
            user_id: 0, // from query file
            device_id: device_id,
            room_structure: device,
            power_data: {},
            rooms: [{
                'name': 'Home', // or possibly separated from room
                '_idx': 0, // index of local manage-list
                'notice': 0,
                'data': [],
                'appliances': [],
                'icon_path': img_path + "/home.png",
                'isActive': true,
                'modules': [{
                    'header': 'activity',
                    '_idx': 0,
                    'modType': 'module1', // type of module (1-3, css differ)
                    'el_id': 'Home_el_0', //for plot use( the inner el box )
                    'id': 'Home_0', // this should be computed and assigned at the insertion
                    'chart': '',
                }
                    // ,
                    //     {
                    //     'header': 'devices',
                    //     '_idx': 1,
                    //     'modType': 'module3',
                    //     'el_id': 'Home_el_1',
                    //     'id': 'Home_1',
                    //     'chart': '',
                    // }
                    , {
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
                    },
                    //     {
                    //     'header': 'notification',
                    //     '_idx': 4,
                    //     'modType': 'module2',
                    //     'el_id': 'Home_el_4',
                    //     'id': 'Home_4',
                    //     'chart': '',
                    // },
                    {
                        'header': 'Sort appliances',
                        '_idx': 5,
                        'modType': 'module1',
                        'el_id': 'Home_el_5',
                        'id': 'Home_5',
                        'chart': '',
                    }],
            },],
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
            modal_appliances: [],
            action_room: 0, //_idx of room, 0 refers to Home
            adding_room: true, // modal is for editng or adding
            isInitialized: false,
            start_date: moment().utc().unix() - (7 * 86400),
            end_date: moment().utc().unix(),
        },
        methods: {
            manage_btn_toggle: self.manage_btn_toggle,
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
    init_rooms();

    init_data();
    date_picker();

    init_home();

    $("#vue-div").show();
    console.log('Vue initialized');
    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function () {
    APP = app();
    console.log('APP returned');
});
