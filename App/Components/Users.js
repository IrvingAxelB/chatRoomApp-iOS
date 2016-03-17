var React = require('react-native');
var api = require('../Utils/api');

var {
  View,
  Text,
  StyleSheet,
  ListView,
} = React;

class ChatRoom extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      users: []
    };
  }
  // ** Updates users and listens to changes from Firebase ** //
  componentWillMount() {
    this.firebaseRef = new Firebase("https://github-saver-irving.firebaseio.com/members");

    this.firebaseRef.on("child_added", function(dataSnapshot) {
      var users = this.state.users;
      var newUsers = dataSnapshot.val();
      users.push(newUsers);
      this.setState({
        users: users,
        dataSource: this.state.dataSource.cloneWithRows(users)
      });
    }.bind(this));

  }
  // ** Users's Functional Component ** //
  renderUserName(user) {
    return (
      <View>
        <Text style={styles.heading}>{user}</Text>
      </View>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderUserName} />
      </View>
    );
  }
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  heading: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  }
});

module.exports = ChatRoom;
