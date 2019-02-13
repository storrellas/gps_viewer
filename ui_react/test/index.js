// Require the module
var EasyFit = require('easy-fit').default;

// Read a .FIT file
var fs = require('fs');
fs.readFile('./samplefile-briangodsey.fit', function (err, content) {

  // Create a EasyFit instance (options argument is optional)
  var easyFit = new EasyFit({
    force: true,
    speedUnit: 'km/h',
    lengthUnit: 'km',
    temperatureUnit: 'kelvin',
    elapsedRecordField: true,
    mode: 'cascade',
  });


  // Parse your file
  easyFit.parse(content, function (error, data) {

    // Handle result of parse method
    if (error) {
      console.log(error);
    } else {
      // console.log(data)
      // console.log("-- Session --")
      // console.log(data.activity.sessions[0])
      //
      // console.log("-- First lap --")
      // console.log(data.activity.sessions[0].laps[0])
      //console.log(data.activity.events)
      //console.log(JSON.stringify(data, null, 2));
      //console.log(JSON.stringify(data.activity.sessions, null, 2));


      waypoint_list = []
      // INIT: Iterate sessions
      for (const session of data.activity.sessions) {
        // INIT: Iterate laps
        for (const lap of session.laps) {
          // INIT: Iterate records
          for (const record of lap.records) {
            waypoint_list.push([record.position_lat, record.position_long])
          } // END: Iterate records
        } // END: Iterate laps
      } // END: Iterate sessions

      console.log( waypoint_list )

    } // If no error


  });

});
