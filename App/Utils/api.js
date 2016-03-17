import Firebase from 'firebase';

var api = {
  // ** Saves username to firebase ** //
  saveUserName(username) {
    var url = `https://github-saver-irving.firebaseio.com/members.json`;
    return fetch(url, {
      method: 'post',
      body: JSON.stringify(username)
    }).then((res) => res.json());
  }
};

module.exports = api;
