import React, { Component, PropTypes } from 'react';
import {
   View,
   Text,
   Dimensions,
   TouchableHighlight,
   Html5,
   ScrollView,
   StyleSheet,
   ListView,
   Image,
   TextInput,
   Alert,
   ListItem,
   Body,
   Content,
   AsyncStorage,
   TouchableOpacity
 } from 'react-native';

import Button from 'react-native-button';
import CheckBox from 'react-native-check-box';
const window = Dimensions.get('window');
const uri = 'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png';
import ModalDropdown from 'react-native-modal-dropdown';
import renderIf from '../functions/renderIf';

export default class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
        openBox: false,
        stages: [],
        enterprise: [],
        menuOpen: false,
    }
    AsyncStorage.getItem('user_token', (err, result) => {
      AsyncStorage.getItem('user_id', (err2, result2) => {
        fetch('http://www.pierreriche.com:8000/stagiaireinfo/' + result2, {
            method: 'get',
            headers: {
                'X-Auth-Token': result,
            }
        })
        .then((response) => response.json())
        .then((dat) => {
            fetch('http://www.pierreriche.com:8000/mystages/' + dat.id, {
                method: 'get',
                headers: {
                    'X-Auth-Token': result,
                }
            })
            .then((response) => response.json())
            .then((data) => {
                for (var len = 0; len < data.length; len++) {
                    if (len == 0) {
                        var newData = this.state.stages.concat([data[len].id_stage]);
                    }
                    else {
                        newData = newData.concat([data[len].id_stage]);
                    }
                }
                var job = [];
                for (var l = 0; l < data.length; l++) {
                    this.getNameOfEnterprise(data[l].id_stage.id, result);
                }
                if (newData == undefined) {
                  var newData = [];
                }
                this.setState({stages: newData});
            })
            .catch((error) => {
                console.warn(error);
            });
        })
        .catch((error) => {
            console.warn(error);
        });
      });
    });
  }
  getNameOfEnterprise(id, token) {
    var value = null;
     fetch('http://www.pierreriche.com:8000/stageformaitredestage/' + id, {
      method: 'get',
      headers: {
        'X-Auth-Token': token,
      }
    })
    .then((response) => response.json())
    .then((dataa) => {
       value = dataa.id_maitre_de_stage.nom_entreprise;
       this.setState({enterprise: this.state.enterprise.concat([value])});
    })
    .catch((error) => {
      console.warn(error);
    });
  }
  openDropDown() {
    this.setState({
      openBox: !this.state.openBox,
      menuOpen: !this.state.menuOpen,
    });
  }
  reload() {
    AsyncStorage.getItem('user_token', (err, result) => {
      AsyncStorage.getItem('user_id', (err2, result2) => {
        fetch('http://www.pierreriche.com:8000/stagiaireinfo/' + result2, {
            method: 'get',
            headers: {
                'X-Auth-Token': result,
            }
        })
        .then((response) => response.json())
        .then((dat) => {
            fetch('http://www.pierreriche.com:8000/mystages/' + dat.id, {
                method: 'get',
                headers: {
                    'X-Auth-Token': result,
                }
            })
            .then((response) => response.json())
            .then((data) => {
                this.setState({stages: []});
                for (var len = 0; len < data.length; len++) {
                    if (len == 0) {
                        var newData = this.state.stages.concat([data[len].id_stage]);
                    }
                    else {
                        newData = newData.concat([data[len].id_stage]);
                    }
                }
                var job = [];
                for (var l = 0; l < data.length; l++) {
                    this.getNameOfEnterprise(data[l].id_stage.id, result);
                }
                if (newData == undefined) {
                  var newData = [];
                }
                this.setState({stages: newData});
            })
            .catch((error) => {
                console.warn(error);
            });
        })
        .catch((error) => {
            console.warn(error);
        });
      });
    });
  }
  render() {
    var count = -1;
        return (
          <View scrollsToTop={false} scrollsToLeft={true} style={styles.menu}>

                  <View style={{  height: 50, backgroundColor: "white", flexDirection: "row" }}>
                        <Text style={{ fontFamily:"raleway_bold", color:"#00379b", marginLeft: 105, marginTop: 17.5 }}>Menu</Text>
                  </View>
            <TouchableOpacity onPress={this.openDropDown.bind(this)} >
            <View style={styles.avatarContainer}>
                <Text style={{ fontFamily: "raleway_bold", fontSize: 15, marginTop: 15, marginLeft: 80, color: "#00379b"}}>Mes stages</Text>
              {renderIf(this.state.menuOpen,
                  <Image source={require('../images/display_10x20.png')} style={{ marginLeft: 40, marginTop: 20, transform: [{ rotate: '180deg'}] }} />
                )}
              {renderIf(!this.state.menuOpen,
                  <Image source={require('../images/display_10x20.png')} style={{ marginLeft: 40, marginTop: 20 }} />
                )}
            </View>
            </TouchableOpacity>
            {renderIf(this.state.openBox,
              <View>
              <ScrollView>
              {this.state.stages.map((item) => {
                count++;
                return (
                  <TouchableOpacity onPress={() => this.props.showStage(item.id)}>
                    <View key={item.id} style={{backgroundColor: '#E6E6E6', marginBottom: 2, height: 80 }}>
                      <Text style={{ fontSize: 11, fontFamily: 'raleway_medium', color: "#00379b", marginLeft: 20, marginTop: 19 }}>{item.id_metier.titre}</Text>
                      <View style={{ flexDirection: "row"}} >
                          <Text style={{ fontSize: 11, fontFamily: 'raleway_medium', color: "#b45596", marginLeft: 20, marginTop: 2 }}>du {item.date_debut} au </Text>
                          <Text style={{ fontSize: 11, fontFamily: 'raleway_medium', color: "#b45596", marginTop: 2 }}>{item.date_fin}</Text>
                      </View>
                      <Text style={{ fontSize: 11, fontFamily: 'raleway_medium', color: "#323232", marginLeft: 20, marginTop: 4 }}>{this.state.enterprise[count]}</Text>
                    </View>
                  </TouchableOpacity>
                )
              })}
              </ScrollView>
              <View style={{position: 'relative', top: 0, left: 0, right: 0, height: 52 }}></View>
              </View>
            )}
            <TouchableOpacity onPress={() => this.props.showStats()}>
              <View style={{position: 'relative', top: 0, left: 0, right: 0, backgroundColor: "#E6E6E6", height: 50 }}>
                <Text
                  style={styles.item2}>
                  Ma progression
                </Text>
              </View>
            </TouchableOpacity>
            <View style={{position: 'absolute',left: 0,right: 0,bottom: 52, backgroundColor:'#00379b', height:50 }}>
              <TouchableOpacity onPress={() => { this.reload(); this.props.reload()}}>
                <Text
                  style={styles.item3}>
                  Actualiser
                </Text>
              </TouchableOpacity>
            </View>
              <View style={{position: 'absolute',left: 0,right: 0,bottom: 0, backgroundColor:'#00379b', height:50 }}>
                <TouchableOpacity onPress={() => this.props.onDisconnect()}>
                  <Text
                    style={styles.item}>
                    Déconnexion
                  </Text>
                </TouchableOpacity>
              </View>
        </View>
        )
    }
}
const styles = StyleSheet.create({
    menu: {
   flex: 1,
   width: 300,
   height: window.height,
   backgroundColor: 'white',
  },
  avatarContainer: {
   marginBottom: 3,
   backgroundColor: '#E6E6E6',
   height: 50,
   marginBottom: 2,
   flexDirection: 'row',
  },
  avatar: {
   width: 48,
   height: 48,
   borderRadius: 24,
   flex: 1,
  },
  name: {
   position: 'absolute',
   left: 70,
   top: 20,
  },
  item: {
   paddingTop: 17.5,
   marginLeft: 75,
   fontSize: 15,
   fontFamily: 'raleway_bold',
   color: 'white',
  },
  item3: {
   paddingTop: 17.5,
   marginLeft: 80,
   fontSize: 15,
   fontFamily: 'raleway_bold',
   color: 'white',
  },
  item2: {
    paddingTop: 17.5,
   marginLeft: 70,
   fontSize: 15,
   fontFamily: 'raleway_bold',
   color: '#00379b'
  }
});
Menu.propTypes = {
    onItemSelected: PropTypes.func.isRequired,
    showStats: PropTypes.func.isRequired,
    showStage: PropTypes.func.isRequired,
    onDisconnect: PropTypes.func.isRequired,
};
