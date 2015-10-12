function liveShempGraph(renderTo, min, max) {
   this.min = min;
   this.max = max;
   this.sensors = {};
   this.live = false;
   this.liveInterval;
   Highcharts.setOptions({
      global: {
         useUTC : true
      }
   });
   this.chart = new Highcharts.StockChart({
      chart: {
         backgroundColor: $("body").css("background-color"),
         renderTo: renderTo,
         type: "line",
         zoomType: 'x',
         animation: false
      },
      legend : {
         enabled : true
      },
      title: {
         text: "Data Exploration"
      },
      xAxis : {
         ordinal : false,
         type : "datetime"
      },
      navigator : {
         adaptToUpdatedData : false,
         series : {
            data : []
         },
         min : min,
         max : max
      },
      yAxis : [{
         id : "AC Voltage",
         lineWidth: 2,
         opposite : false,
         showEmpty : false,
         title: {
            text: 'AC Voltage'
         }
      },
      {
         id : "AC Current",
         lineWidth: 2,
         opposite : false,
         showEmpty : false,
         title: {
            text: 'AC Current'
         }
      },
      {
         id : "DC Voltage",
         lineWidth: 2,
         opposite : true,
         showEmpty : false,
         title: {
            text: 'DC Voltage'
         }
      },
      {
         id : "DC Current",
         lineWidth: 2,
         opposite : true,
         showEmpty : false,
         title: {
            text: 'DC Current'
         }
      },
      {
         id : "Wattage",
         lineWidth: 2,
         opposite : true,
         showEmpty : false,
         title: {
            text: 'Wattage'
         }
      },
      {
         id : "Temperature",
         lineWidth: 2,
         opposite : true,
         showEmpty : false,
         title: {
            text: 'Temperature'
         }
      },
      {
         id : "Light",
         lineWidth: 2,
         opposite : false,
         showEmpty : false,
         title: {
            text: 'Light'
         }
      },
      {
         id : "Sound",
         lineWidth: 2,
         opposite : false,
         showEmpty : false,
         title: {
            text: 'Sound'
         }
      }]
   });
}

ShempGraph.prototype.setLiveState = function(isLive) {
   if (isLive) {
      this.liveInterval = setInterval(this.getNewPoints.bind(this), 1000);
   }
   else clearInterval(this.liveInterval);
}

ShempGraph.prototype.getNewPoints = function() {
   var new_max = new Date().getTime();
   var new_min = new_max - 60 * 1000;
   this.setExtremes(new_min, new_max);
   var options = {
      sensor_ids : [],
      ranges : {},
      useRanges : true
   };
   for (var sensor_id in this.sensors) {
      var dataMax = this.sensors[sensor_id].dataMax;
      options.sensor_ids.push(sensor_id);
      options.ranges[sensor_id] = {
         start : dataMax ? dataMax * 1000: new_min * 1000
      }
   }
   sendDataRequest(options, this.addMultipleSensorData.bind(this));
}

/* Operations for adding/removing sensors to/from the graph */

ShempGraph.prototype.addSensor = function(device, sensor, data) {
   if (this.chart.get(sensor.sensor_id)) return;
   data = data || [];
   this.chart.addSeries({
      data: data,
      dataGrouping: {
         enabled: false
      },
      gapSize : 0,
      marker : {
         enabled : false,
         radius : 1.5
      },
      id: sensor.sensor_id,
      name: sensor.sensor_type + " (" + device.device_name + ")",
      type: "line",
      yAxis: sensor.sensor_type
   }, true, true);
   this.sensors[sensor.sensor_id] = {
      dataMin : data.length ? data[0][0] : null,
      dataMax : data.length ? data[data.length - 1][0] : null
   }
   var options = {
      sensor_ids : [sensor.sensor_id],
      start : this.min * 1000,
      end : this.max * 1000,
      useRanges : false
   };
   this.chart.showLoading("Loading data from SHEMP server");
   sendDataRequest(options, this.setMultipleSensorData.bind(this));
}

/**
 * Remove the sensor from both the graph and the associative array
 * kept by ShempGraph
 */
ShempGraph.prototype.removeSensor = function(sensor) {
   var series = this.chart.get(sensor.sensor_id);
   if (!series) return;
   delete this.sensors[sensor.sensor_id];
   series.remove();
}

/**
 * Below are the methods for adding data to the graph.
 */
ShempGraph.prototype.addSensorData = function(sensor_id, data, redraw) {
   var series = this.chart.get(sensor_id);
   this.sensors[sensor_id].dataMin = data ? Math.min(data[0][0], this.sensors[sensor_id].dataMin) : null;
   this.sensors[sensor_id].dataMax = data ? Math.max(data[data.length-1][0], this.sensors[sensor_id].dataMax) : null;
   $.each(data, function(index, value) {
      series.addPoint(value, false, false, false);
   });
   if (redraw) self.chart.redraw();
}

ShempGraph.prototype.setSensorData = function(sensor_id, data) {
   var series = this.chart.get(sensor_id);
   this.sensors[sensor_id].dataMin = data.length ? data[0][0] : null;
   this.sensors[sensor_id].dataMax = data.length ? data[data.length-1][0] : null;
   series.setData(fixGaps(data));
   // Bug here: data.length always returning 0?
   //if (data.length == 0) this.chart.showLoading("No Data Available For This Time Period");
}

// modify data to account for large gaps
// by adding a zero point before the gap
function fixGaps(data) {
   var fixed_data = new Array();
   $.each(data, function(index, sensor_data) {
      var next_timestamp;
      if (index+1 < data.length) next_timestamp = data[index+1][0];
      fixed_data.push(sensor_data);
      // push a zero point 1ms before and after the gap
      if (next_timestamp - sensor_data[0] > 60000) {
         fixed_data.push([sensor_data[0]+1,0]);
         fixed_data.push([next_timestamp-1, 0]);
      }
   });
   return fixed_data;
}

ShempGraph.prototype.addMultipleSensorData = function(sensor_data) {
   console.log(sensor_data);
   var self = this;
   var redraw = false;
   $.each(sensor_data, function(sensor_id, data) {
      if (data.length) {
         self.addSensorData(sensor_id, data, false);
         redraw = true;
      }
   });
   if (redraw) self.chart.redraw();
}
        
ShempGraph.prototype.setMultipleSensorData = function(sensor_data) {
   var self = this;
   this.chart.hideLoading();
   $.each(sensor_data, function(sensor_id, data) {
      self.setSensorData(sensor_id, data);
   });
}

ShempGraph.prototype.setExtremes = function(min, max) {
   //Update ShempGraph internal variables for min and max
   this.min = min;
   this.max = max;
   
   //Set the range on both the graph (xAxis[0]) and the
   //range navigator (xAxis[1])
   this.chart.xAxis[0].setExtremes(min, max);
   this.chart.xAxis[1].setExtremes(min, max);
}

ShempGraph.prototype.setDataRange = function(min, max) {
   this.setExtremes(min, max);
   //Build an array of all the sensor id's currently
   //present in the graph.
   var sensor_ids = [];
   for (var sensor_id in this.sensors) sensor_ids.push(sensor_id);
   
   //Indicate that data is being loaded
   this.chart.showLoading("Loading data from SHEMP server");
   
   //Send request for data to backend script between min and max
   var options = {
      sensor_ids : sensor_ids,
      start : min * 1000,
      end : max * 1000,
      useRanges : false
   };
   sendDataRequest(options, this.setMultipleSensorData.bind(this));
}

function sendDataRequest(options, callback) {   
   //Make an asynchronous call to the back end server for data.
   //on success, the callback funtion is called, passing in
   //the echoed result.
   $.ajax({
      url : "php/get_sensor_data.php",
      type : "POST",
      data : {options: options},
      dataType : "json",
      error : function() {for (var arg in arguments) {console.log("Error in data request with args", arguments[arg]);}},
      success : callback ? callback : function(){}
   });
}
