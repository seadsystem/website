// If everyone wrote code like this maybe this project would go somewhere.
// Yes, I am very modest :B
var gauge = function(room, mod_i, data_i, device_id) {
        // Get timestamps for the start and end of the week
        // This is our area of interest, since we will be fetching all
        // the data for the week (hourly) - so at most 168 data points.
        var startTime = Math.floor(moment().startOf('week') / 1000);
        var endTime = Math.floor(moment().endOf('week') / 1000);

        // This object will hold the responses with data points for a
        // specific appliance.
        var applianceResponses = {};

        // This object will hold the ids of the appliances we will query.
        var appliance_ids = [];

        // Just a weird Firebase thing. Gotta make it look like string for
        // Firebase to work ...
        device_id_string = "\"" + device_id + "\"";

        // Home is a special case, we get all the appliances for each room
        if (room.name == "Home") {
          Object.keys(user_devices[device_id_string]["rooms"]).forEach(function (room) {
              Object.keys(user_devices[device_id_string]["rooms"][room]["appliances"]).forEach(function (appliance) {
                appliance_id = user_devices[device_id_string]["rooms"][room]["appliances"][appliance].id;
                appliance_ids.push(appliance_id);
              });
          });
        }
        // Here we just get all the appliances for a specific room.
        else {
          Object.keys(user_devices[device_id_string]["rooms"][room.name]["appliances"]).forEach(function (appliance) {
            var appliance_id = user_devices[device_id_string]["rooms"][room.name]["appliances"][appliance].id;
            appliance_ids.push(appliance_id);
          })
        }


        // Filter the appliances to avoid duplicates.
        // Time complexity doesn't matter here.
        var unique_appliance_ids = [];
        appliance_ids.forEach(function(appliance_id) {
          if (!unique_appliance_ids.includes(appliance_id)) {
            unique_appliance_ids.push(appliance_id);
          }
        });
        appliance_ids = unique_appliance_ids;


        // Send requests for each of the appliances.
        appliance_ids.forEach(function (appliance_id) {
          sendRequestForCurrentWeek(appliance_id);
        });

        /*
          This function construct a valid url to our backend using
          the timestamps and appliance id.
        */
        function buildUrl(appliance_id) {
          var url = "http://db.sead.systems:8080/" + device_id +
                    "?start_time=" + startTime +
                    "&end_time=" + endTime +
                    "&device=" + appliance_id +
                    "&granularity=3600&type=P&list_format=energy";
          return url;
        }

        /*
          Sends ajax request to get data points for the week.
        */
        function sendRequestForCurrentWeek(appliance_id) {
          var url = buildUrl(appliance_id);
          $.ajax({
              url: url,
              dataType: 'json',
              success: function (response) {
                energy_data_points = Object.keys(response.data).reverse().map(function (key) {
                    return {
                            timestamp: moment(response.data[key]["time"], "YYYY-MM-DD HH:mm:ss"),
                            value: parseFloat(response.data[key]["energy"])
                      };
                })

                // Save the response in the dictionary
                applianceResponses[appliance_id] = energy_data_points;

                // Once we saved all the responses in the dictionary for
                // all of the appliance_ids, we're ready to move on.
                var numberOfResponses = Object.keys(applianceResponses).length;
                if (numberOfResponses == appliance_ids.length) {
                  calculateCosts();
                }
              }
          });
        }

        /*
          This function does the cost calculation for all appliances.
        */
        function calculateCosts() {
          var total_today_cost = 0.0;
          var total_yesterday_cost = 0.0;
          var total_week_cost = 0.0;

          Object.keys(applianceResponses).forEach(function(appliance_id) {
            // We exclude solar from our costs.
            if (appliance_id == "PowerS") {
              return;
            }
            var week_data_points = applianceResponses[appliance_id];
            var today_data_points = week_data_points.filter(data_point =>  isToday(data_point.timestamp));
            var yesterday_data_points = week_data_points.filter(data_point =>  isYesterday(data_point.timestamp));
            var today_cost = calculateCostForDataPoints(today_data_points);
            var yesterday_cost = calculateCostForDataPoints(yesterday_data_points);
            var week_cost = calculateCostForDataPoints(week_data_points);

            total_today_cost += today_cost;
            total_yesterday_cost += yesterday_cost;
            total_week_cost += week_cost;
          });
          createCostChart(
            parseFloat(total_today_cost.toFixed(1)),
            parseFloat(total_yesterday_cost.toFixed(1)),
            parseFloat(total_week_cost.toFixed(1)));
        }

        function isToday(date) {
          var TODAY = moment().startOf('day');
          return date.isSame(TODAY, 'd');
        }

        function isYesterday(date) {
          var YESTERDAY = moment().subtract(1, 'days').startOf('day');
          return date.isSame(YESTERDAY, 'd');
        }

        /*
          Calculates energy cost for a set of data points.
        */
        function calculateCostForDataPoints(energy_data_points) {
          var cost = 0.0;
          for (var i = 0; i < energy_data_points.length; i++) {
            var rate = getRate(i % 24);
            cost += energy_data_points[i].value * rate;
          }
          return cost;
        }

        /*
          These are currently hard coded to Pat Mantey's energy plan.
        */
        function getRate(hour) {
          const OFFPEAK = 0.245;
          const PARTIALPEAK = 0.322;
          const PEAK = 0.437;

          if (hour >= 0 && hour < 10) {
            return OFFPEAK;
          } else if (hour >= 10 && hour < 13) {
            return PARTIALPEAK;
          } else if (hour >= 13 && hour < 19) {
            return PEAK;
          } else if (hour >= 19 && hour < 21) {
            return PARTIALPEAK;
          } else {
            return OFFPEAK;
          }
        }

        function createCostChart(today, yesterday, lastweek) {
          room.modules[mod_i].chart = Highcharts.chart(room.modules[mod_i].el_id , {
                  chart: {
                      type: 'solidgauge',
                      marginTop: 50
                  },

                  title: {
                      text: 'Electricy Consumption',
                      style: {
                          fontSize: '24px'
                      }
                  },

                  tooltip: {
                      borderWidth: 0,
                      backgroundColor: 'none',
                      shadow: false,
                      style: {
                          fontSize: '16px'
                      },
                      pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">${point.y}</span>',
                      positioner: function(labelWidth) {
                          return {
                              x: $("#" + room.modules[mod_i].el_id).width() / 2 - labelWidth / 2,
                              y: $("#" + room.modules[mod_i].el_id).height() / 2 - 17
                          };
                      }
                  },

                  pane: {
                      startAngle: 0,
                      endAngle: 360,
                      background: [{ // Track for Move
                          outerRadius: '112%',
                          innerRadius: '88%',
                          backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[3]).setOpacity(0.3).get(),
                          borderWidth: 0
                      }, { // Track for Exercise
                          outerRadius: '87%',
                          innerRadius: '63%',
                          backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.3).get(),
                          borderWidth: 0
                      }, { // Track for Stand
                          outerRadius: '62%',
                          innerRadius: '38%',
                          backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[2]).setOpacity(0.3).get(),
                          borderWidth: 0
                      }]
                  },

                  yAxis: {
                      min: 0,
                      max: 100,
                      lineWidth: 0,
                      tickPositions: []
                  },

                  plotOptions: {
                      solidgauge: {
                          borderWidth: '34px',
                          dataLabels: {
                              enabled: false
                          },
                          linecap: 'round',
                          stickyTracking: false
                      }
                  },

                  series: [{
                      name: 'Today',
                      borderColor: Highcharts.getOptions().colors[3],
                      data: [{
                          color: Highcharts.getOptions().colors[3],
                          radius: '100%',
                          innerRadius: '100%',
                          y: today
                      }]
                  }, {
                      name: 'Yesterday',
                      borderColor: Highcharts.getOptions().colors[0],
                      data: [{
                          color: Highcharts.getOptions().colors[0],
                          radius: '75%',
                          innerRadius: '75%',
                          y: yesterday
                      }]
                  }, {
                      name: 'Last Week',
                      borderColor: Highcharts.getOptions().colors[2],
                      data: [{
                          color: Highcharts.getOptions().colors[2],
                          radius: '50%',
                          innerRadius: '50%',
                          y: lastweek
                      }]
                  }]
              },

              /**
               * In the chart load callback, add icons on top of the circular shapes
               */
              function callback() {

                  // Move icon
                  this.renderer.path(['M', -8, 0, 'L', 8, 0, 'M', 0, -8, 'L', 8, 0, 0, 8])

                  .translate(190, 26)
                      .add(this.series[2].group);

                  // Exercise icon
                  this.renderer.path(['M', -8, 0, 'L', 8, 0, 'M', 0, -8, 'L', 8, 0, 0, 8, 'M', 8, -8, 'L', 16, 0, 8, 8])

                  .translate(190, 61)
                      .add(this.series[2].group);

                  // Stand icon
                  this.renderer.path(['M', 0, 8, 'L', 0, -8, 'M', -8, 0, 'L', 0, -8, 8, 0])

                  .translate(190, 96)
                      .add(this.series[2].group);
              });
        }
    }
    //just hook up the values here
