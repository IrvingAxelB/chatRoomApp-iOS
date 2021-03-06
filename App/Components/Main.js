var React = require('react-native');
var api = require('../Utils/api');
var ChatRoom = require('./ChatRoom.js');

var {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS
} = React;

class Main extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      isLoading: false,
      error: false
    }
  }
  // ** Saves text input for username ** //
  handleChange(e) {
    this.setState({
      username: e.nativeEvent.text
    })
  }
  // ** Navigates to ChatRoom component ** //
  handleSubmit() {
    var username = this.state.username;
    this.setState({
      isLoading: true,
    });
    api.saveUserName(username)
      .then((jsonRes) => {
        this.props.navigator.push({
          title: 'ChatRoom',
          component: ChatRoom, 
          passProps: {username: username}
        });
        this.setState({
          isLoading: false,
          error: false,
          username: ''
        });
      })
      .catch((err) => {
        this.setState({
          isLoading: false,
          error: `There was an error: ${err}`
        })
      })
  }
  render() {
    var showErr = (
      this.state.error ? <Text> {this.state.error} </Text> : <View></View>
    );

    return (
      <View style={styles.mainContainer}>
        <Text style={styles.title}>
          Enter UserName
        </Text>
        <TextInput
          style={styles.searchInput}
          value={this.state.username}
          onChange={this.handleChange.bind(this)} />
        <TouchableHighlight
          style={styles.button}
          onPress={this.handleSubmit.bind(this)}
          underlayColor="white">
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableHighlight>
        <ActivityIndicatorIOS 
          animating={this.state.isLoading}
          color='#111'
          size='large'>
        </ActivityIndicatorIOS>
        {showErr}
      </View>
    );
  }
};

var styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 30,
    marginTop: 65,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#48BBEC'
  },
  title: {
    marginBottom: 20,
    fontSize: 25,
    textAlign: 'center',
    color: '#fff'
  },
  searchInput: {
    height: 50,
    padding: 4,
    marginRight: 5,
    fontSize: 23,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    color: 'white'
  },
  buttonText: {
    fontSize: 18,
    color: '#111',
    alignSelf: 'center'
  },
  button: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
});

module.exports = Main;
