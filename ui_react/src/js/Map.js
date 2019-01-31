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

// Map Imports
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import GPX from 'gpx-for-runners';

// Project imports
import NavBar from './NavBar';
import SideBar from './SideBar';

const Mapbox = ReactMapboxGl({
  accessToken: "pk.eyJ1Ijoic3RvcnJlbGxhcyIsImEiOiJjaWp6bHQ5Y3kwMDU4dmNtMHgzb2NhNmU5In0.M3jJSPh7KUT0QDSd7Bn3Rg"
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

    var route_list = [
      {
        name: 'myRoute',
        waypoints: [
            [2.183699, 41.394960],
            [2.153699, 41.394960],
            [2.14699, 41.394960],
            [2.123699, 41.394960],
            [2.113699, 41.394960]
          ],
        linePaint: {
          'line-color': '#4790E5',
          'line-width': 12
        }
      },
      {
        name: 'myRoute2',
        waypoints: [
            [2.183699, 41.394960],
            [2.183699, 41.374960],
            [2.183699, 41.344960],
            [2.183699, 41.334960],
            [2.183699, 41.334960]
          ],
        linePaint: {
          'line-color': '#808000',
          'line-width': 12
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

  handleOnReadEnd(){
    const file_content = fileReader.result;
  }

  handleInputGPXFile(event){
    let fileReader = new FileReader()
    var obj = this;
    fileReader.onloadend = function(){
        const file_content = fileReader.result;
        const gpx = new GPX( file_content );
        obj.setState({
          route: gpx.trackpoints.map( trackpoint => [trackpoint.lon, trackpoint.lat])
        });
    }

    // Read file
    fileReader.readAsText(event.target.files[0])
  }

  handleInputFITFile(event){
    console.log("Handling FIT File")

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

    const lineLayout = {
      'line-cap': 'round',
      'line-join': 'round'
    };

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
    if( route_list.length > 0 ){
      center_map = route_list[0].waypoints[0]
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
                  <Layer key={route.name} type="line" layout={lineLayout} paint={route.linePaint}>
                   <Feature coordinates={route.waypoints} />
                 </Layer>
                  )
              )}
            </Mapbox>



            <div className={classes.container}>
              <div>
                  <input
                    className={classes.input}
                    id="raised-button-file"
                    multiple
                    type="file"
                    onChange={this.handleInputGPXFile.bind(this)}/>
                   <label htmlFor="raised-button-file">
                      <Button variant="contained" component="span" className={classes.button}>
                        Load GPX File
                      </Button>
                   </label>
              </div>
                 <div>
                   <input
                     className={classes.input}
                     id="raised-button-file"
                     multiple
                     type="file"
                     onChange={this.handleInputFITFile.bind(this)}/>
                    <label htmlFor="raised-button-file">
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
