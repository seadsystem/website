function DeviceManager() {
   var devices = {};
   var sensors = {};
   var deviceTypes = {};
   var self = this;
   var devicesTable = new DeviceTable();
   devicesTable.init();
   
   self.addDevice = function(device) {
      devices[device.device_id] = device;
      $.each(device.sensors, function(index, sensor) {
         self.addSensor(sensor);
      });
      devicesTable.addDeviceRow(device);
      sensorSelector.addDeviceOptGroup(device);
      sensorSelector.refresh();
   };
   
   self.addSensor = function(sensor) {
      sensors[sensor.sensor_id] = sensor;
   };
   
   self.getSensorById = function(id) {
      try {
         return sensors[id];
      }
      catch (error) {
         return null;
      }
   };

   self.getDeviceById = function(id) {
      try {
         return devices[id];
      }
      catch (error) {
         return null;
      }
   }
   
   self.getDevices = function() {
      return Object.keys(devices).map(function (key) {
         return devices[key];
      });
   }
   
   self.getSensors = function() {
      return Object.keys(sensors).map(function (key) {
         return sensors[key];
      });
   }
   
   self.addDeviceType = function(deviceType) {
      deviceTypes[Object.keys(deviceType)[0]] = deviceType;
   }
   
   self.setDeviceTypes = function(types) {
      deviceTypes = types;
   }
   
   self.getDeviceTypes = function() {
      return deviceTypes;
   }
   
   self.getDeviceTypeByName = function(name) {
      try {
         return deviceTypes[name];
      }
      catch (error) {
         return null;
      }
   }
   
   self.deleteDeviceById = function(device_id) {
      new ModalConfirmation().confirm(
         "Are you sure you want to delete " + deviceManager.getDeviceById(device_id).device_name + "?",
         function () {
            $.ajax({
               url : "php/delete_device.php",
               type : "post",
               data : {device_id: device_id},
               error : function(response) {console.log("Error:", response);},
               success : function(response) {
                  $.each(devices[device_id].sensors, function(index, sensor) {
                     shempGraph.removeSensor(sensor);
                  });
                  $('#graph_devices').multiselect("refresh");
                  //gets an error here
                  $('#devices_table').dataTable().fnDeleteRow($('#devices_table tr[device_id='+device_id+']'));
                  delete devices[device_id];
                  //new ModalConfirmation().confirm(
               }
            });
         }
      );
   }
   
   var sensorSelector = new GraphSensorSelector("graph_devices");
   sensorSelector.init();
   sensorSelector.fillList(self.getDevices());
}

function DeviceTable() {
   var self = this;
   var oTable;
   
   var copyDevice = function (device) {
      return {"device_name" : device.device_name,
              "device_serial" : device.device_serial,
              "connection_status" : "Not Implemented",
              "power_status" : "Not Implemented",
              "delete_device" : "Doesnt matter?",
              "device_id" : device.device_id
             };
   }
   
   var copyDevices = function() {
      return $.map(deviceManager.getDevices(), function(device) {
         return copyDevice(device)
      });
   }
   
   self.init = function() {
      /* Init DataTables */
      
      oTable = $('#devices_table').dataTable({
         "aoColumns" : [
            {
               "sTitle": "Name",
               "mData": "device_name"
            },
            { 
               "sTitle": "Serial Number",
               "mData" : "device_serial"
            },
            {
               "sTitle": "Connection Status",
               "mData" : "connection_status"
            },
            {
               "sTitle": "Power Status",
               "mData" : "power_status",
               "mRender": function ( url, type, full )  {
                  return  '<input type="checkbox"></input>';
               }
            },
            {
               "sTitle": "Delete Device",
               "mData" : "delete_device",
               "mRender": function ( url, type, full )  {
                  return  '<button type="button" onclick="deviceManager.deleteDeviceById(' + full.device_id + ');">Delete</button>';
               }
            }
         ],
         "fnRowCallback" : function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $(nRow).attr("device_id", aData["device_id"]);
         }
      });
   }
   
   self.addDeviceRow = function(device) {
      var aData = copyDevice(device);
      oTable.fnAddData(aData);
   }
}

function GraphSensorSelector(id) {
   var self = this;
   var multiselect;
   var id = id;
   
   self.fillList = function(devices) {
      $.each(devices, function(id, device) {
         self.addDeviceOptGroup(device);
      });
   }
   
   self.addDeviceOptGroup = function(device) {
      var selection = $('#'+id);
      var device_group = $(
         "<optgroup>"
      ).attr(
         "label", device.device_name
      );
      $.each(device.sensors, function(index, sensor) {
         var option = $(
            "<option>"
         ).attr(
            "name", "sensors[]"
         ).attr(
            "value", sensor.sensor_id
         ).text(
            sensor.sensor_type
         // set default sensors to be checked
         );//.prop(
         //   'selected',
         //   sensor.sensor_id == 7 ||
         //   sensor.sensor_id == 8 ? true : false
         //);
         device_group.append(option);
      });
      selection.append(device_group);
   }
   
   self.refresh = function() {
      multiselect.multiselect("refresh");
   }

   self.init = function() {
      // Creates multi-select using sensor_ids select element
      multiselect = $('#'+id).multiselect({
         click : function(event, ui){
            setGraphSensor(ui.value, ui.checked);
         },
         checkAll: function(a, b){
            $.map($(this).multiselect("getChecked"), function(item) {
               setGraphSensor(item.value, true);
            });
         },
         uncheckAll: function(a){
            $.map($(this).multiselect("getUnchecked"), function(item) {
               setGraphSensor(item.value, false);
            });
         },
         optgrouptoggle: function(event, ui) {
            $.map(ui.inputs, function(item) {
               setGraphSensor(item.value, ui.checked);
            });
         },
         position : {
            my : "left top",
            at : "left bottom",
            collision : "flip flip"
         },
         selectedText : "# Sensors on Graph",
         noneSelectedText : "Add Sensors To Graph"
      }).multiselectfilter(); // adds on a filter to the multi-select
   }
}
