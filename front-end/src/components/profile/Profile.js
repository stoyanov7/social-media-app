import React, { Component, Fragment  } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs'; 
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { uploadImage, logoutUser } from '../../redux/actions/userAction';

import Paper from '@material-ui/core/Paper';
import MuiLink from '@material-ui/core/Link'; 
import Typography from '@material-ui/core/Typography'; 
import Button from '@material-ui/core/Button';   
import EditDetails from './EditDetails';
import MyButton from '../MyButton';
import ProfileSkeleton from '../../components/layout/ProfileSkeleton';

import LocationOn from '@material-ui/icons/LocationOn'; 
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday'; 
import EditIcon from '@material-ui/icons/Edit'; 
import KeyboardReturn from '@material-ui/icons/KeyboardReturn'; 

import withStyles from '@material-ui/core/styles/withStyles';

const styles = (theme) => ({
   ...theme.spread
});

class Profile extends Component {
   handleImageChange = (event) => {
      const image = event.target.files[0];
      const formData = new FormData();

      formData.append('image', image, image.name);
      this.props.uploadImage(formData);
   };

   handleEditPicture = () => {
      const fileInput = document.getElementById('imageInput');
      fileInput.click();
   };

   handleLogout = () => {
      this.props.logoutUser();
   };

   render() {
      const {
         classes,
         user: {
            credentials: { handle, createdAt, imageUrl, bio, website, location },
            loading,
            authenticated
         }
      } = this.props;

      let authenticatedPaper = (
         <Paper className={classes.paper}>
            <div className={classes.profile}>
               <div className="image-wrapper">
                  <img src={imageUrl} alt="profile" className="profile-image" />
                  <input 
                     type="file" 
                     id="imageInput" 
                     hidden="hidden" 
                     onChange={this.handleImageChange} 
                  />
                  <MyButton
                     tip="Edit profile picture"
                     onClick={this.handleEditPicture}
                     btnClassName="button"
                  >
                     <EditIcon color="primary" />
                  </MyButton>
               </div>
               <hr />
               <div className="profile-details">
                  <MuiLink
                     component={Link}
                     to={`/users/${handle}`}
                     color="primary"
                     variant="h5"
                  >
                     @{handle}
                  </MuiLink>
                  <hr /> 
                  {bio && <Typography variant="body2">{bio}</Typography>}
                  <hr />
                  {location && (
                     <Fragment>
                        <LocationOn color="primary" /> <span>{location}</span>
                        <hr />
                     </Fragment>
                  )}
                  <hr />
                  {website && (
                     <Fragment>
                        <LinkIcon color="primary" />
                        <a href={website} target="_blank" rel="noopener noreferrer">
                           {' '}
                           {website}
                        </a>
                        <hr />
                     </Fragment>
                  )}
                  <CalendarToday color="primary" />{' '}
                  <span>Joined {dayjs(createdAt).format('MMM YYYY')}</span> 
               </div>
               <MyButton tip="Logout" onClick={this.handleLogout}>
                  <KeyboardReturn color="primary" />
               </MyButton>
               <EditDetails />
            </div>
         </Paper>
      );

      let unauthenticatedPaper = (
         <Paper className={classes.paper}>
            <Typography variant="body2" align="center">
               No profile found, please login again
            </Typography>
            <div className={classes.buttons}>
               <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/login"
               >
                  Login
               </Button>
               <Button
                  variant="contained"
                  color="secondary"
                  component={Link}
                  to="/signup"
               >
                  Signup
               </Button>
            </div>
         </Paper>
      );

      return !loading ? (authenticated ? (authenticatedPaper) : (unauthenticatedPaper)) : (<ProfileSkeleton />);
   }
}

const mapStateToProps = (state) => ({
   user: state.user
});

const mapActionsToProps = { uploadImage, logoutUser }; 

Profile.propTypes = {
   user: PropTypes.object.isRequired,
   classes: PropTypes.object.isRequired,
   uploadImage: PropTypes.func.isRequired,
   logoutUser: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Profile))