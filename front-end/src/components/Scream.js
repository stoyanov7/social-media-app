import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import withStyles from '@material-ui/core/styles/withStyles';


const styles = {
   card: {
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
      const { classes, scream: { userImage, userHandle, createdAt, body } } = this.props;
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
               <Typography variant="body2" color="textSecondary">{createdAt}</Typography>
               <Typography variant="body1">{body}</Typography>
            </CardContent>
         </Card>
      )
   }
}

export default withStyles(styles)(Scream)