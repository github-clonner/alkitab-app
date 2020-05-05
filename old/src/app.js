//@flow
import React, { Component } from "react";
import { StyleSheet, View, Platform, StatusBar, Modal } from "react-native";
import PassageScreen from "./screens/Passage/PassageScreen";
import SearchScreen from "./screens/Search/SearchScreen";
var RNFS = require("react-native-fs");

class App extends Component {
  state = {
    showSearch: false,
    searchText: ""
  };
  componentWillMount() {
    RNFS.unlink(RNFS.DocumentDirectoryPath + "/nkjv.realm");
    RNFS.unlink(RNFS.DocumentDirectoryPath + "/nkjv.realm.lock");
    if (Platform.OS == "android") {
      RNFS.copyFileAssets("nkjv.realm", RNFS.DocumentDirectoryPath + "/nkjv.realm");
      RNFS.copyFileAssets("nkjv.realm.lock", RNFS.DocumentDirectoryPath + "/nkjv.realm.lock");
    } else {
      try {
        RNFS.copyFile(RNFS.MainBundlePath + "/nkjv.realm", RNFS.DocumentDirectoryPath + "/nkjv.realm");
        RNFS.copyFile(RNFS.MainBundlePath + "/nkjv.realm.lock", RNFS.DocumentDirectoryPath + "/nkjv.realm.lock");
      } catch (e) {
        console.log("FILE ALREADY EXISTS");
      }
    }
  }
  _onShowSearch() {
    this.setState({
      showSearch: true,
      jumpPassage: null
    });
  }
  _onHideSearch() {
    this.setState({ showSearch: false });
  }
  _onJumpPassage(verse) {
    this.setState({
      jumpPassage: verse
    });
  }
  render() {
    const { jumpPassage, searchText } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#fff" barStyle="default" />
        <PassageScreen onShowSearch={() => this._onShowSearch()} jumpPassage={jumpPassage} />
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showSearch}
          onRequestClose={() => this._onHideSearch()}
        >
          <SearchScreen
            searchText={searchText}
            onChangeSearchText={searchText => this.setState({ searchText })}
            onHideSearch={() => this._onHideSearch()}
            onJumpPassage={verse => this._onJumpPassage(verse)}
          />
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default App;
