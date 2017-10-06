import React, { Component, PropTypes } from 'react';
import {
   View,
   Text,
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
   TouchableOpacity,
   BackAndroid
 } from 'react-native';

import Button from 'react-native-button';
import CheckBox from 'react-native-check-box';
import Orientation from 'react-native-orientation';
import renderIf from './functions/renderIf';
import Swiper from 'react-native-swiper';
import Carousel from 'react-native-snap-carousel';
var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;


export default class ShowStage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mail: '',
      password: '',
      stages: [],
      enterprise: [],
      comp_validated: [],
      comp_notValidated: [],
      comp_notEval: [],
      see_comp: 'notEval',
      notecomp: [],
      likecomp: [],
      waitTime: undefined,
      valide: {
        width: 115.5,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e6e6e6',
        margin: 2.2,
      },
      notvalide: {
        width: 115.5,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e6e6e6',
        margin: 2.2,
      },
      all: {
        width: 115.5,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00379b',
        margin: 2.2,
      },
      validetext: {
        color: '#00379b',
        fontFamily: "raleway_bold"
      },
      alltext: {
        color: 'white',
        fontFamily: "raleway_bold"
      },
      notvalidetext: {
        color: '#00379b',
        fontFamily: "raleway_bold"
      },
      validateButton: "#093996",
      allswipe: true,
      valideswipe: false,
      notvalideswipe: false,
    }
    AsyncStorage.getItem('user_token', (err, result) => {
        AsyncStorage.getItem('user_id', (err2, result2) => {
            fetch('http://www.pierreriche.com:8000/stages/' + this.props.donnee, {
             method: 'get',
             headers: {
               'X-Auth-Token': result,
             }
           })
           .then((response) => response.json())
           .then((data) => {
              var stage = this.state.stages.concat([data]);
              this.setState({stages: stage});
              this.getNameOfEnterprise(data.id, result);
              fetch('http://www.pierreriche.com:8000/mycompetences/' + this.props.donnee, {
               method: 'get',
               headers: {
                 'X-Auth-Token': result,
               }
             })
             .then((response) => response.json())
             .then((dat) => {
                for (var l = 0; l < dat.length; l++) {
                  if (dat[l].validation_stagiaire != "useless") {
                    if (newData == undefined) {
                      var newData = this.state.comp_notEval.concat([dat[l]]);
                    }
                    else {
                      newData = newData.concat([dat[l]]);
                    }
                    this.state.notecomp[dat[l].id] = dat[l].competence_stagiaire;
                    this.state.likecomp[dat[l].id] = dat[l].note_stagiaire;
                  }
                  if (dat[l].validation_maitre_de_stage == 1) {
                    if (concatData == undefined) {
                      var concatData = this.state.comp_validated.concat([dat[l]]);
                    }
                    else {
                      concatData = concatData.concat([dat[l]]);
                    }
                  }
                  if (dat[l].validation_maitre_de_stage != 1) {
                    if (stock == undefined) {
                      var stock = this.state.comp_notValidated.concat([dat[l]]);
                    }
                    else {
                      stock = stock.concat([dat[l]]);
                    }
                  }
                }
                if (newData == undefined) {
                  var newData = [];
                }
                if (concatData == undefined) {
                  var concatData = [];
                }
                if (stock == undefined) {
                  var stock = [];
                }
                this.setState({
                  comp_notEval: newData,
                  comp_validated: concatData,
                  comp_notValidated: stock,
                })
             })
             .catch((error) => {
               console.warn(error);
             });
           })
           .catch((error) => {
             console.warn(error);
             MessageBarManager.registerMessageBar(this.refs.alertvalidation);
             MessageBarManager.showAlert({
               title: 'Erreur serveur',
               message: 'Veuillez vérifier votre connexion internet',
               alertType: 'error',
             });
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
  componentDidMount() {
    MessageBarManager.registerMessageBar(this.refs.alertvalidation);
  }
  componentWillUnmount() {
    MessageBarManager.unregisterMessageBar();
  }
  myComp() {

  }
  changeStatus(node) {
    if (node == "valide") {
      this.setState({
        valide: {
          width: 115.5,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#00379b',
          margin: 2.2,
        },
        notvalide: {
          width: 115.5,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#e6e6e6',
          margin: 2.2,
        },
        all: {
          width: 115.5,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#e6e6e6',
          margin: 2.2,
        },
        validetext: {
          color: 'white',
          fontFamily: "raleway_bold"
        },
        alltext: {
          color: '#00379b',
          fontFamily: "raleway_bold"
        },
        notvalidetext: {
          color: '#00379b',
          fontFamily: "raleway_bold"
        },
        allswipe: false,
        valideswipe: true,
        notvalideswipe: false,
      })
    }
    else if (node == 'notvalide') {
      this.setState({
        valide: {
          width: 115.5,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#e6e6e6',
          margin: 2.2,
        },
        notvalide: {
          width: 115.5,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#00379b',
          margin: 2.2,
        },
        all: {
          width: 115.5,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#e6e6e6',
          margin: 2.2,
        },
        validetext: {
          color: '#00379b',
          fontFamily: "raleway_bold"
        },
        alltext: {
          color: '#00379b',
          fontFamily: "raleway_bold"
        },
        notvalidetext: {
          color: 'white',
          fontFamily: "raleway_bold"
        },
        allswipe: false,
        valideswipe: false,
        notvalideswipe: true,
      })
    }
    else {
      this.setState({
        valide: {
          width: 115.5,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#e6e6e6',
          margin: 2.2,
        },
        notvalide: {
          width: 115.5,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#e6e6e6',
          margin: 2.2,
        },
        all: {
          width: 115.5,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#00379b',
          margin: 2.2,
        },
        validetext: {
          color: '#00379b',
          fontFamily: "raleway_bold"
        },
        alltext: {
          color: 'white',
          fontFamily: "raleway_bold"
        },
        notvalidetext: {
          color: '#00379b',
          fontFamily: "raleway_bold"
        },
        allswipe: true,
        valideswipe: false,
        notvalideswipe: false,
      })
    }
  }
  renderheart(obj, id) {
    var renderheart = [];
    for (var c = 1; c <= 5; c++) {
      if (c <= obj) {
        renderheart.push(<TouchableHighlight key={c} style={{marginTop: 2, marginLeft: 8}} onPress={(this.evaluateheart.bind(this, c, id))}><Image source={require('./images/heart_full_30x25.png')}/></TouchableHighlight>);
      }
      else {
        renderheart.push(<TouchableHighlight key={c} style={{marginTop: 2, marginLeft: 8}} onPress={(this.evaluateheart.bind(this, c, id))}><Image source={require('./images/heart_empty_30x25.png')}/></TouchableHighlight>);
      }
    }
    return renderheart;
  }
  renderstar(obj, id, check1) {
    var renderstars = [];
    for (var c = 1; c <= 5; c++) {
      if (c <= obj) {
        renderstars.push(<TouchableHighlight onPress={(this.evaluatestar.bind(this, c, id, check1))} key={c} style={{marginTop: 2, marginLeft: 8}}><Image source={require('./images/star_full_30x25.png')}/></TouchableHighlight>);
      }
      else {
        renderstars.push(<TouchableHighlight onPress={(this.evaluatestar.bind(this, c, id, check1))} key={c} style={{marginTop: 2, marginLeft: 8}}><Image source={require('./images/star_empty_30x25.png')}/></TouchableHighlight>);
      }
    }
    return renderstars;
  }
  evaluateheart(note, id) {
    if (this.state.likecomp[id] != undefined) {
      AsyncStorage.getItem('user_token', (err, result) => {
        fetch('http://www.pierreriche.com:8000/stagiairescompetences/' + id, {
         method: 'patch',
         headers: {
           'X-Auth-Token': result,
           'Content-Type': 'application/x-www-form-urlencoded',
         },
         body: 'noteStagiaire=' + note,
       })
       .then((response) => response.json())
       .then((data) => {
          this.state.likecomp[id] = note;
          this.setState({
            likecomp: this.state.likecomp,
          })
       })
       .catch((error) => {
         console.warn(error);
       });
      });
    }
  }
  evaluatestar(note, id, check1) {
    if (check1 != 1) {
      this.setState({validateButton: "#093996"});
      AsyncStorage.getItem('user_token', (err, result) => {
        fetch('http://www.pierreriche.com:8000/stagiairescompetences/' + id, {
         method: 'patch',
         headers: {
           'X-Auth-Token': result,
           'Content-Type': 'application/x-www-form-urlencoded',
         },
         body: 'competenceStagiaire=' + note,
       })
       .then((response) => response.json())
       .then((data) => {
          this.state.notecomp[id] = note;
          this.setState({
            notecomp: this.state.notecomp,
          })
       })
       .catch((error) => {
         console.warn(error);
       });
      });
    }
  }
  checkIfValidated(check1, id) {
    if (check1 == 1) {
      return (<Image style={{marginLeft: 20}} source={require('./images/star_validated_30x30.png')}/>);
    }
    else {
      return (<TouchableHighlight onPress={(this.evaluatestar.bind(this, 0, id, check1))}><Image style={{marginLeft: 20}} source={require('./images/cancel_grade_30x30.png')}/></TouchableHighlight>);
    }
  }
  validateComp(id) {
    if (this.state.validateButton == "#093996") {
      this.setState({validateButton: "#E8EBEF"});
      AsyncStorage.getItem('user_token', (err, result) => {
        MessageBarManager.registerMessageBar(this.refs.alertvalidation);
        MessageBarManager.showAlert({
          title: 'Demande de validation envoyée',
          message: 'Votre maître de stage va recevoir une demande de validation de vos compétences',
          alertType: 'success',
        });
        fetch('http://www.pierreriche.com:8000/validation/' + id, {
          method: 'post',
          headers: {
            'X-Auth-Token': result,
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        })
        .then((response) => response.json())
        .then((data) => {

        })
        .catch((error) => {
          console.warn(error);
        });
      });
    }
  }
  dateDiff(date1, date2) {
    var diff = {}
    var tmp = date2 - date1;
    tmp = Math.floor(tmp/1000);
    diff.sec = tmp % 60;
    tmp = Math.floor((tmp-diff.sec)/60);
    diff.min = tmp % 60;
    tmp = Math.floor((tmp-diff.min)/60);
    diff.hour = tmp % 24;
    tmp = Math.floor((tmp-diff.hour)/24);
    diff.day = tmp;
    return diff;
  }
  render() {
    var count = -1;
        return (
          <View style={styles.container}>
          {this.state.stages.map((item) => {
            count++;
            return  <View key={item.id} style={{backgroundColor: 'white'}}>
              <Image source={{uri: item.id_metier.photo_path}} style={{height: 130, margin: 0}}>
              <TouchableOpacity onPress={this.props.onBack}>
                <View style={{height: 50, width: 50, margin: 10, borderRadius: 50, backgroundColor: 'white'}}>
                    <Image source={require('./images/display_10x20.png')} style={{ marginTop: 20, marginLeft: 15, transform: [{ rotate: '90deg'}] }} />
                </View>
              </TouchableOpacity>
              </Image>
              <View style={{width: 1000, height: 60, padding: 20, backgroundColor: 'white', transform: [{ rotate: '-6deg'}], marginTop: -56, paddingLeft: 20, paddingRight: 20}}></View>
              <View style={{marginTop: 20, marginLeft: 40, backgroundColor: 'white'}}>
                <Text style={{fontSize: 16, fontFamily: 'raleway_bold', color: '#00379b'}}>{item.id_metier.titre}</Text>
              </View>
              <View style={{marginTop: 5, marginLeft: 40, backgroundColor: 'white', flexDirection: 'row', width: 330}}>
                <View style={{alignItems: 'flex-start', width: 170}}>
                  <Text style={{fontSize: 14, fontFamily: 'raleway', color: 'black'}}>{this.state.enterprise[count]}</Text>
                </View>
                <View style={{alignItems: 'flex-end', width: 130}}>
                  <Text style={{fontSize: 12, fontFamily: 'raleway', color: '#b45596'}}>du {item.date_debut} au {item.date_fin}</Text>
                </View>
              </View>
              <View style={{width: 292, marginLeft: 30, marginTop: 25, backgroundColor: 'white'}}>
                <Button
                containerStyle={{padding:11, height:45, overflow:'hidden', borderRadius:22, backgroundColor: this.state.validateButton,}}
                style={{fontSize: 15, color: 'white', fontFamily: 'raleway'}} onPress={this.validateComp.bind(this, item.id)}>
                  Valider les compétences
                </Button>
              </View>
              <View style={{marginTop: 25, backgroundColor: 'white', flexDirection: 'row'}}>
                <TouchableOpacity onPress={this.changeStatus.bind(this, "all")}>
                  <View style={this.state.all}>
                    <Text style={this.state.alltext}>Toutes</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.changeStatus.bind(this, "valide")}>
                  <View style={this.state.valide}>
                  <Text style={this.state.validetext}>Validées</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.changeStatus.bind(this, "notvalide")}>
                  <View style={this.state.notvalide}>
                    <Text style={this.state.notvalidetext}>Non-validées</Text>
                  </View>
                </TouchableOpacity>
              </View>
              {renderIf(this.state.valideswipe,
                <Swiper style={styles.wrapper} showsButtons={true} showsPagination={false} height={310}>
                {this.state.comp_validated.map((item) => {
                  return (<View key={item.id} style={styles.slide}>
                    <View style={{width: 260, height: 230, backgroundColor: 'white'}}>
                      <View style={{backgroundColor: 'white', flexDirection: 'row', marginTop: 25}}>
                        <Image style={{marginLeft: 20}} source={require('./images/skills_35x35.png')}/>
                        <View style={{alignItems: 'center', justifyContent: 'center', width: 180}}>
                        <Text style={styles.titlecomp}>{item.id_competence.titre}</Text>
                        </View>
                      </View>
                      <View style={{backgroundColor: 'white', flexDirection: 'row', marginTop: 20}}>
                      <TouchableOpacity onPress={(this.evaluateheart.bind(this, 0, item.id))}>
                        <Image style={{marginLeft: 20}} source={require('./images/cancel_grade_30x30.png')}/>
                      </TouchableOpacity>
                          {(this.renderheart(this.state.likecomp[item.id], item.id))}
                      </View>
                      <View style={{backgroundColor: 'white', flexDirection: 'row', marginTop: 20}}>
                        <Image style={{marginLeft: 20}} source={require('./images/star_validated_30x30.png')}/>
                          {(this.renderstar(this.state.notecomp[item.id], item.id, item.validation_maitre_de_stage))}
                      </View>
                      <View style={{backgroundColor: 'white', marginTop: 20}}>
                        <Text style={{marginLeft: 20, color: "#8c8c8c"}}>{item.id_competence.type}</Text>
                      </View>
                    </View>
                  </View>)
                })
                }
                </Swiper>
              )}
              {renderIf(this.state.allswipe && this.state.comp_notEval != undefined,
                <Swiper showsButtons={true} showsPagination={false} height={310}>
                {this.state.comp_notEval.map((item) => {
                  return (<View key={item.id} style={styles.slide}>
                    <View style={{width: 260, height: 230, backgroundColor: 'white'}}>
                      <View style={{backgroundColor: 'white', flexDirection: 'row', marginTop: 25}}>
                        <Image style={{marginLeft: 20}} source={require('./images/skills_35x35.png')}/>
                        <View style={{alignItems: 'center', justifyContent: 'center', width: 180}}>
                        <Text style={styles.titlecomp}>{item.id_competence.titre}</Text>
                        </View>
                      </View>
                      <View style={{backgroundColor: 'white', flexDirection: 'row', marginTop: 20}}>
                        <TouchableOpacity onPress={(this.evaluateheart.bind(this, 0, item.id))}>
                          <Image style={{marginLeft: 20}} source={require('./images/cancel_grade_30x30.png')}/>
                        </TouchableOpacity>
                          {(this.renderheart(this.state.likecomp[item.id], item.id))}
                      </View>
                      <View style={{backgroundColor: 'white', flexDirection: 'row', marginTop: 20}}>
                          {(this.checkIfValidated(item.validation_maitre_de_stage, item.id))}
                          {(this.renderstar(this.state.notecomp[item.id], item.id, item.validation_maitre_de_stage))}
                      </View>
                      <View style={{backgroundColor: 'white', marginTop: 20}}>
                        <Text style={{marginLeft: 20, color: "#8c8c8c"}}>{item.id_competence.type}</Text>
                      </View>
                    </View>
                  </View>)
                })
                }
                </Swiper>
              )}
              {renderIf(this.state.notvalideswipe && this.state.comp_notValidated != undefined,
                <Swiper showsButtons={true} showsPagination={false} height={310}>
                {this.state.comp_notValidated.map((item) => {
                  return (<View key={item.id} style={styles.slide}>
                    <View style={{width: 260, height: 230, backgroundColor: 'white'}}>
                      <View style={{backgroundColor: 'white', flexDirection: 'row', marginTop: 25}}>
                        <Image style={{marginLeft: 20}} source={require('./images/skills_35x35.png')}/>
                        <View style={{alignItems: 'center', justifyContent: 'center', width: 180}}>
                        <Text style={styles.titlecomp}>{item.id_competence.titre}</Text>
                        </View>
                      </View>
                      <View style={{backgroundColor: 'white', flexDirection: 'row', marginTop: 20}}>
                        <TouchableOpacity onPress={(this.evaluateheart.bind(this, 0, item.id))}>
                          <Image style={{marginLeft: 20}} source={require('./images/cancel_grade_30x30.png')}/>
                        </TouchableOpacity>
                          {(this.renderheart(this.state.likecomp[item.id], item.id))}
                      </View>
                      <View style={{backgroundColor: 'white', flexDirection: 'row', marginTop: 20}}>
                        <TouchableOpacity onPress={(this.evaluatestar.bind(this, 0, item.id, item.validation_maitre_de_stage))}>
                          <Image style={{marginLeft: 20}} source={require('./images/cancel_grade_30x30.png')}/>
                        </TouchableOpacity>
                          {(this.renderstar(this.state.notecomp[item.id], item.id, item.validation_maitre_de_stage))}
                      </View>
                      <View style={{backgroundColor: 'white', marginTop: 20}}>
                        <Text style={{marginLeft: 20, color: "#8c8c8c"}}>{item.id_competence.type}</Text>
                      </View>
                    </View>
                  </View>)
                })
                }
                </Swiper>
              )}
            </View>
          })}
            <MessageBarAlert ref="alertvalidation" />
          </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    title: {
      fontSize: 30,
    },
    inputmail: {
        width: 300,
        padding: 5,
        borderColor: 'grey',
        backgroundColor: 'rgba(0,0,0, 0.1)',
        marginTop: 40,
        borderRadius: 2,
        paddingLeft: 10
    },
    inputpassword: {
        width: 300,
        padding: 5,
        borderColor: 'grey',
        backgroundColor: 'rgba(0,0,0, 0.1)',
        marginTop: 20,
        paddingLeft: 10
    },
    inline_block: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      backgroundColor: 'white'
    },
    underlineText: {
      textDecorationLine: "underline",
      textDecorationStyle: "solid",
      textDecorationColor: "#093996",
      color: '#9932CC'
    },
    wrapper: {
    },
  slide: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6e6e6',
  },
  titlecomp: {
    color: '#323232',
    fontSize: 16,
    fontFamily: 'raleway_bold',
    marginLeft: 10,
  },
  text: {
    color: '#323232',
    fontSize: 18,
    fontFamily: 'raleway',
  }
});

ShowStage.propTypes = {
    title: PropTypes.string.isRequired,
    onBack: PropTypes.func.isRequired,
    donnee: PropTypes.number.isRequired,
};
