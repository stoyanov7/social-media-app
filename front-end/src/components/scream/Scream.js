import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import MyButton from '../MyButton';
import DeleteScream from './DeleteScream';
import ScreamDialog from './ScreamDialog';
import LikeButton from './LikeButton';

import ChatIcon from '@material-ui/icons/Chat';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = {
   card: {
      position: 'relative',
      display: 'flex',
      marginBottom: 20
   },
   image: {
      minWidth: 200
   },
   content: {
      padding: 25,
      objectFit: 'cover'
   }
}

class Scream extends Component {
   render() {
      dayjs.extend(relativeTime);

      const { 
         classes, 
         scream: { 
            userImage, 
            userHandle, 
            createdAt, 
            body,
            likeCount,
            commentCount,
            screamId
         },
         user: {
            authenticated,
            credentials: {
               handle
            }
         } 
      } = this.props;

      const deleteButton = authenticated && userHandle === handle ? (
         <DeleteScream screamId={screamId} />
      ) : null

      return (
         <Card className={classes.card}>
            <CardMedia image={userImage} title="Profile image" className={classes.image}></CardMedia>
            <CardContent className={classes.content}>
               <Typography
                  variant="h5" 
                  component={Link} 
                  to={`/users/${userHandle}`} 
                  color="primary"
               >
                  {userHandle}
               </Typography>
               {deleteButton}
               <Typography variant="body2" color="textSecondary">
                  {dayjs(createdAt).fromNow()}
               </Typography>
               <Typography variant="body1">{body}</Typography>
               <LikeButton screamId={screamId} />
               <span>{likeCount} likes</span>
               <MyButton tip="comments">
                  <ChatIcon color="primary" />
               </MyButton>
               <span>{commentCount} comments</span>
               <ScreamDialog
                  screamId={screamId}
                  userHandle={userHandle}
                  openDialog={this.props.openDialog}
               />
            </CardContent>
         </Card>
      )
   }
}

Scream.propTypes = {
   user: PropTypes.object.isRequired,
   scream: PropTypes.object.isRequired,
   classes: PropTypes.object.isRequired,
   openDialog: PropTypes.bool
};

const mapStateToProps = (state) => ({
   user: state.user
});

export default connect(mapStateToProps)(withStyles(styles)(Scream))