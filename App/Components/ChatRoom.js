var React = require('react-native');
var api = require('../Utils/api');
var Users = require('./Users.js');

var {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  ListView,
  ActivityIndicatorIOS,
  NavigatorIOS
} = React;

class ChatRoom extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      messages: [],
      message: '',
      users: {},
      isLoading: false,
      error: false
    };
  }
  // ** Updates messages and listens to changes from Firebase ** //
  componentWillMount() {
    this.firebaseRef = new Firebase("https://github-saver-irving.firebaseio.com/messages");
    var currentUser = this.props.username;

    this.firebaseRef.on("child_added", function(dataSnapshot) {
      var messages = this.state.messages;
      var users = this.state.users;
      var messageData = dataSnapshot.val();
      var newUsername = messageData.username;
      users[newUsername] = newUsername;
      users[currentUser] = currentUser;
      messages.push(messageData);
      this.setState({
        messages: messages,
        dataSource: this.state.dataSource.cloneWithRows(messages),
        users: users
      });
    }.bind(this));
  }
  // ** Disconnect from Firebase ** //
  componentWillUnmount() {
    this.firebaseRef.off();
  }
  // ** Navigates to Users ** //
  showUsers() {
    this.props.navigator.push({
      title: 'Users',
      component: Users
    });
  }
  // ** Saves text input ** //
  handleChange(e) {
    this.setState({
      message: e.nativeEvent.text
    })
  }
  // ** Stores message to firebase ** //
  handleSubmit(e) {
    e.preventDefault();
    var date = new Date;
    var minutes = date.getMinutes();
    var hour = date.getHours();
    var month = date.getMonth();
    var day = date.getDate();
    var timeStamp = ''+month+'/'+day+'- '+hour+":"+minutes;
    this.firebaseRef.push({
      message: this.state.message,
      username: this.props.username,
      timeStamp: timeStamp
    });
  }
  // ** Text input Functional Component ** //
  textInput() {
    return (
      <View style={styles.textInputContainer}>
        <TextInput
          style={styles.textInput}
          value={this.state.note}
          onChange={this.handleChange.bind(this)}
          placeholder='New Message' />
        <TouchableHighlight
          style={styles.button}
          onPress={this.handleSubmit.bind(this)}
          underlayColor='#88D4F5'>
            <Text style={styles.buttonText}> Submit </Text>
        </TouchableHighlight>
      </View>
    );
  }
  // ** Message's Functional Component ** //
  renderMessage(message) {
    return (
      <View>
        <Text style={styles.heading}>{message.username}: {message.timeStamp}</Text>
        <Text style={styles.message}>{message.message}</Text>
      </View>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight
          style={styles.showUsers}
          onPress={this.showUsers.bind(this)}
          underlayColor='#88D4F5'>
            <Text style={styles.showUsersButton}> Show All Users </Text>
        </TouchableHighlight>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderMessage}
          style={styles.listView} />
        <ActivityIndicatorIOS 
          animating={this.state.isLoading}
          color='#dddddd'
          size='large'>
        </ActivityIndicatorIOS>
        {this.textInput()}
      </View>
    );
  }
};

var styles = StyleSheet.create({
  showUsers: {
    height: 50,
    marginTop: 64,
    backgroundColor: '#E3E3E3',
    alignItems: 'center',
    flexDirection: 'row'
  }, 
  showUsersButton: {
    color: '#48BBEC',
    fontSize: 18
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  buttonText: {
    fontSize: 18,
    color: 'white'
  },
  button: {
    height: 60,
    backgroundColor: '#48BBEC',
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textInput: {
    height: 60,
    padding: 10,
    fontSize: 18,
    color: '#111',
    flex: 10
  },
  textInputContainer: {
    backgroundColor: '#E3E3E3',
    alignItems: 'center',
    flexDirection: 'row'
  },
  heading: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
  },
});

module.exports = ChatRoom;
