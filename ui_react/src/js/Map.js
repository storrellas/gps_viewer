import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import RandomColor from 'randomcolor';
import EasyFit from 'easy-fit';

// Map Imports
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import GPX from 'gpx-for-runners';

// Project imports
import NavBar from './NavBar';
import SideBar from './SideBar';

const Mapbox = ReactMapboxGl({
  accessToken: "pk.eyJ1Ijoic3RvcnJlbGxhcyIsImEiOiJjaWp6bHQ5Y3kwMDU4dmNtMHgzb2NhNmU5In0.M3jJSPh7KUT0QDSd7Bn3Rg"
});
//const EasyFitDefault = EasyFit.default;

// Create a EasyFit instance (options argument is optional)
const easyFit = new EasyFit({
  force: true,
  speedUnit: 'km/h',
  lengthUnit: 'km',
  temperatureUnit: 'kelvin',
  elapsedRecordField: true,
  mode: 'cascade',
});


const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'auto',
  },
  mapContainer: {
    display: 'inital',
    height: "50vh",
    width: "100%",
  },
  container: {
    margin: '2em',
    display: 'flex',
    flexFlow: 'row nowrap'
  },
  input: {
    display: 'none',
  },
  button: {
    alignSelf:'center',
    flexGrow: 2,
  },
  rootPadding: {
    marginLeft: '2em',
  },
  selectRoute: {
    width: '15em',
  }
});

class Map extends React.Component {
  constructor(props) {
    super(props);


    const route_list = [
      {
        name: 'myRoute - 10:02:03',
        waypointList: [
            [2.183699, 41.394960],
            [2.153699, 41.394960],
            [2.14699, 41.394960],
            [2.123699, 41.394960],
            [2.113699, 41.394960]
          ],
        waypointCorrectedList: [
            [2.183699, 41.374960],
            [2.153699, 41.374960],
            [2.14699, 41.374960],
            [2.123699, 41.374960],
            [2.113699, 41.374960]
          ],
        linePaint: {
          'line-color': RandomColor(),
          'line-width': 5
        },
        linePaintCorrected: {
          'line-color': RandomColor(),
          'line-width': 5
        },
        lineLayout: {
          'line-cap': 'round',
          'line-join': 'round'
        }
      },
      {
        name: 'myRoute2 - 10:33:03',
         waypointList: [
            [2.183699, 41.394960],
            [2.183699, 41.374960],
            [2.183699, 41.344960],
            [2.183699, 41.334960],
            [2.183699, 41.334960]
          ],
          waypointCorrectedList: [
             [2.143699, 41.394960],
             [2.143699, 41.374960],
             [2.143699, 41.344960],
             [2.143699, 41.334960],
             [2.143699, 41.334960]
           ],
        linePaint: {
          'line-color': RandomColor(),
          'line-width': 5
        },
        linePaintCorrected: {
          'line-color': RandomColor(),
          'line-width': 5
        },
        lineLayout: {
          'line-cap': 'round',
          'line-join': 'round'
        }
      }
    ]


    this.state = {
      fitBounds: undefined,
      center: [-0.481747846041145, 51.3233379650232],
      zoom: [10],
      route_list : route_list,
      center_default: [2.143699, 41.394960],
      open: true,
      route_selected: 'all'
    };

  }

  getTime(){
    return new Date().toLocaleTimeString().replace("/.*(\d{2}:\d{2}:\d{2}).*/", "$1");
  }

  handleOnReadEnd(){
    const file_content = fileReader.result;
  }

  fetchWaypointCorrected(){
    console.log("My Test")
  }

  generateRouteObject(waypoint_list, waypoint_corrected_list){
    return {
      name: "Route - " + this.getTime(),
      waypointList: waypoint_list,
      linePaint: {
        'line-color': RandomColor(),
        'line-width': 5
      },
      waypointCorrectedList: waypoint_corrected_list,
      linePaintCorrected: {
        'line-color': RandomColor(),
        'line-width': 5
      },
      lineLayout: {
        'line-cap': 'round',
        'line-join': 'round'
      }
    }
  }

  generateRouteFake(waypoint_list){

    // Generate Corrected Waypoint List
    const waypoint_corrected_list = []
    for (const waypoint of waypoint_list) {
        const waypoint_corrected = [waypoint[0] - 0.02, waypoint[1]]
        waypoint_corrected_list.push(waypoint_corrected)
    }
    return this.generateRouteObject(waypoint_list, waypoint_corrected_list)
  }

  async generateRoute(waypoint_list){
    const response = await fetch('http://localhost:8080/api/waypoint', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "waypoint": waypoint_list })
    })
    const data = await response.json()

    const waypoint_corrected_list = data.waypoint_corrected

    const route = {
      name: "Route - " + this.getTime(),
      waypointList: waypoint_list,
      linePaint: {
        'line-color': RandomColor(),
        'line-width': 5
      },
      waypointCorrectedList: waypoint_corrected_list,
      linePaintCorrected: {
        'line-color': RandomColor(),
        'line-width': 5
      },
      lineLayout: {
        'line-cap': 'round',
        'line-join': 'round'
      }
    }
    return route

  }

  async fileGPXHandler(fileReader){

    const file_content = fileReader.result;
    const gpx = new GPX( file_content );

    // Generate Waypoint List
    const waypoint_list = gpx.trackpoints.map( trackpoint => [trackpoint.lon, trackpoint.lat])

    // Get Route
    const route = this.generateRouteFake(waypoint_list)
    //const route = await this.generateRoute(waypoint_list)

    // Add new route
    let route_list_local = this.state.route_list;
    route_list_local.push(route)

    // Add new item
    this.setState({
      route_selected: route.name,
      route_list: route_list_local
    });


  }

  async fileFITHandler(fileReader){

    const file_content = fileReader.result;
    const waypoint_list = await new Promise(function(resolve, reject){

      // Parse your file
      easyFit.parse(file_content, function (error, data) {

        // Handle result of parse method
        if (error) {
          console.log(error);
          return reject()
        }

        // Generate waypoint list local
        const waypoint_list_local = []
        // INIT: Iterate sessions
        for (const session of data.activity.sessions) {
          // INIT: Iterate laps
          for (const lap of session.laps) {
            // INIT: Iterate records
            for (const record of lap.records) {
              waypoint_list_local.push([record.position_lat, record.position_long])
            } // END: Iterate records
          } // END: Iterate laps
        } // END: Iterate sessions

        console.log( waypoint_list_local )
        return resolve(waypoint_list_local)
        console.log("This is not resolved")

      })
    })

    // Generate Route
    const route = this.generateRouteFake(waypoint_list)
    //const route = await this.generateRoute(waypoint_list)
    
    // Add new route
    let route_list_local = this.state.route_list;
    route_list_local.push(route)

    // Add new item
    this.setState({
      route_selected: route.name,
      route_list: route_list_local
    });

  }

  handleInputGPXFile(event){
    let fileReader = new FileReader()
    fileReader.onloadend = this.fileGPXHandler.bind(this, fileReader)
    // Read file
    fileReader.readAsText(event.target.files[0])
  }

  handleInputFITFile(event){
    let fileReader = new FileReader()
    fileReader.onloadend = this.fileFITHandler.bind(this, fileReader)
    // Read file
    fileReader.readAsArrayBuffer(event.target.files[0])
  }

  handleClearRoute(event){
    this.setState({ route_list: [] });
  }

  handleSelectRoute(event){
    this.setState({ [event.target.name]: event.target.value });
  }

  handleChange(event){
    this.setState({ [event.target.name]: event.target.value });
  }


  handleDrawer = (open) => {
    this.setState({ open: open });
  }

  render() {
    const position = []
    const { fitBounds, center, zoom, route_list, center_default, route_selected } = this.state;
    const { classes } = this.props;



    // Select routes
    let route_rendered_list = route_list;
    if( route_selected == "none" ){
      route_rendered_list = []
    }else{
      for (let route of route_list) {
        if(route.name == route_selected){
          route_rendered_list = [route]
        }
      }
    }

    // Decide center
    let center_map = center_default;
    if( route_rendered_list.length > 0 ){
      center_map = route_rendered_list[0].waypointList[0]
    }

    return (
      <div className={classes.root}>
        <CssBaseline />
        <NavBar open={this.state.open} handleDrawer={this.handleDrawer.bind(this)}/>
        <SideBar open={this.state.open} handleDrawer={this.handleDrawer.bind(this)}/>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Typography variant="h4" gutterBottom component="h2">
            GPX Reader
          </Typography>
          <div className={classes.mapContainer}>
            <Mapbox
              style="mapbox://styles/mapbox/streets-v9"
              zoom={zoom}
              center={center_map}
              containerStyle={{
                height: "100%",
                width: "100%"
              }}>
              {route_rendered_list.map(route => (
                <div key={route.name}>
                  <Layer type="line" layout={route.lineLayout} paint={route.linePaint}>
                    <Feature coordinates={route.waypointList} />
                  </Layer>
                  <Layer type="line" layout={route.lineLayout} paint={route.linePaintCorrected}>
                    <Feature coordinates={route.waypointCorrectedList} />
                  </Layer>
                </div>
                )
              )}
            </Mapbox>



            <div className={classes.container}>
              <div>
                  <input
                    className={classes.input}
                    id="gpx-button-file"
                    multiple
                    type="file"
                    onChange={this.handleInputGPXFile.bind(this)}/>
                   <label htmlFor="gpx-button-file">
                      <Button variant="contained" component="span" className={classes.button}>
                        Load GPX File
                      </Button>
                   </label>
              </div>
                 <div>
                   <input
                     className={classes.input}
                     id="fit-button-file"
                     multiple
                     type="file"
                     onChange={this.handleInputFITFile.bind(this)}/>
                    <label htmlFor="fit-button-file">
                       <Button variant="contained" component="span" className={[classes.button, classes.rootPadding].join(' ')}>
                         Load FIT File
                       </Button>
                    </label>
                </div>
                <div>
                  <Button variant="contained" component="span" className={[classes.button, classes.rootPadding].join(' ')} onClick={this.handleClearRoute.bind(this)}>
                    Clear Routes
                  </Button>
               </div>
            </div>
            <div className={classes.container}>
              <Typography variant="h6" gutterBottom component="h2">
                Select Routes
              </Typography>
              <Select
                className={[classes.rootPadding, classes.selectRoute].join(' ')}
                value={this.state.route_selected}
                onChange={this.handleSelectRoute.bind(this)}
                inputProps={{
                  name: 'route_selected',
                  id: 'route_selected_simple',
                }}
              >
                <MenuItem value="none"><em>None</em></MenuItem>
                {route_list.map(route => (
                  <MenuItem key={route.name} value={route.name}>{route.name}</MenuItem>
                  )
                )}
                <MenuItem value="all"><em>All</em></MenuItem>

              </Select>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

Map.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Map);
