import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { likeScream, unlikeScream } from '../redux/actions/dataAction';

import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import MyButton from './MyButton';
import DeleteScream from './DeleteScream';

import ChatIcon from '@material-ui/icons/Chat';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import FavoriteIcon from '@material-ui/icons/Favorite';

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
   likedScream = () => {
      if (this.props.user.likes && 
         this.props.user.likes.find(l => l.screamId === this.props.scream.screamId)) {
         return true;
      } else {
         return false;
      }
   }

   likeScream = () => {
      this.props.likeScream(this.props.scream.screamId);
   }

   unlikeScream = () => {
      this.props.unlikeScream(this.props.scream.screamId);
   }

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

      const likeButton = !authenticated ? (
         <MyButton tip="Like">
            <Link to='/login'>
               <FavoriteBorderIcon color="primary" />
            </Link>
         </MyButton>
      ) : (
         this.likedScream() ? (
            <MyButton tip="Unlike" onClick={this.unlikeScream}>
               <FavoriteIcon color="primary"/>
            </MyButton>
         ) : (
            <MyButton tip="Like" onClick={this.likeScream}>
               <FavoriteBorderIcon color="primary"/>
            </MyButton>
         )
      );

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
               {likeButton}
               <span>{likeCount} likes</span>
               <MyButton tip="comments">
                  <ChatIcon color="primary" />
               </MyButton>
               <span>{commentCount} comments</span>
            </CardContent>
         </Card>
      )
   }
}

Scream.propTypes = {
   likeScream: PropTypes.func.isRequired,
   unlikeScream: PropTypes.func.isRequired,
   user: PropTypes.object.isRequired,
   scream: PropTypes.object.isRequired,
   classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
   user: state.user
});

const mapActionsToProps = {
   likeScream,
   unlikeScream
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Scream))