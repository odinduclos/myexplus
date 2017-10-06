import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableHighlight, Html5, ScrollView, StyleSheet, ListView, Image, TextInput, Alert, TouchableOpacity } from 'react-native';
import Button from 'react-native-button';
import HeaderInscription from './components/HeaderInscription';
var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;


export default class Inscription extends Component {
	constructor(props) {
		super(props);
		this.state = {
			firstname: '',
			lastname: '',
			mail: '',
			password: '',
			password_confirm: '',
		};
		MessageBarManager.registerMessageBar(this.refs.alertinscription);
	}

	Register() {
		if (this.state.password == this.state.password_confirm) {
			fetch('http://www.pierreriche.com:8000/utilisateurs/new', {
				method: 'post',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					prenom: this.state.firstname,
					nom: this.state.lastname,
					mail: this.state.mail,
					password_hash: this.state.password
				})
			})
			.then((response) => response.json())
			.then((data) => {
				if (data.message_err == undefined) {
					this.props.onBack();
				}
				else {
					MessageBarManager.showAlert({
			      title: 'Une erreur est survenue',
			      message: data.message_err,
			      alertType: 'warning',
			    });
				}
			})
			.catch((error) => {
				console.warn(error, "Pas de chance LOL");
			});
		}
		else {
		    MessageBarManager.showAlert({
			      title: 'Erreur confirmation mot de passe',
			      message: 'Le mot de passe et sa confirmation sont differents',
			      alertType: 'warning',
			    });
		}
	}
	componentDidMount() {
		MessageBarManager.registerMessageBar(this.refs.alertinscription);
	}
 	componentWillUnmount() {
	 	MessageBarManager.unregisterMessageBar();
 	}
	render() {
		return (
			<View style={styles.container}>
			<HeaderInscription />
			<View style={{backgroundColor: 'white', alignItems: "center"}}>
			<TextInput
			onChangeText={(text) => this.setState({firstname: text})}
			value={this.state.firstname}
			style={styles.input}
			placeholder="Votre prénom"
			underlineColorAndroid= {'transparent'}
			/>
			<TextInput
			onChangeText={(text) => this.setState({lastname: text})}
			value={this.state.lastname}
			style={styles.input}
			placeholder="Votre nom"
			underlineColorAndroid= {'transparent'}
			/>
			<TextInput
			onChangeText={(text) => this.setState({mail: text})}
			value={this.state.mail}
			style={styles.input}
			placeholder="Votre adresse mail"
			underlineColorAndroid= {'transparent'}
			/>
			<TextInput
			onChangeText={(text) => this.setState({password: text})}
			secureTextEntry={true}
			value={this.state.password}
			style={styles.input}
			placeholder="Votre mot de passe"
			underlineColorAndroid= {'transparent'}
			/>
			<TextInput
			onChangeText={(text) => this.setState({password_confirm: text})}
			secureTextEntry={true}
			value={this.state.password_confirm}
			style={styles.input}
			placeholder="Confirmez votre mot de passe"
			underlineColorAndroid= {'transparent'}
			/>
			<View style={{ justifyContent: "center", width: 275,  marginTop: 20 }}>
				<Text style={{ fontFamily: 'raleway_bold', fontSize: 13, color: "#8C8C8C" }}>
				Un mail de confirmation vous sera envoyé, après quoi vous pourrez vous connecter.
				</Text>
			</View>
			</View>
			<View style={{backgroundColor: 'white', width: 292, marginBottom: 20 }}>
			<Button onPress={(this.Register.bind(this))}
			containerStyle={{padding:11, height:45, overflow:'hidden', borderRadius:22, backgroundColor: '#093996'}}
			style={{fontSize: 15, color: 'white'}}>
			Inscription
			</Button>
			<TouchableOpacity style={{ alignItems: "center", marginTop: 15 }} onPress={this.props.onBack}>
			<Text style={styles.underlineText} >Déjà un compte ? Connectez vous.</Text>
			</TouchableOpacity>
			</View>
			<MessageBarAlert ref="alertinscription" />
			</View>
			)
	}
}


const onButtonPress = () => { Alert.alert('Button has been pressed!'); };

const styles = StyleSheet.create({
	container: {
		margin: 0,
		padding: 0,
		justifyContent: "center",
		backgroundColor: "white",
		flex: 1,
		justifyContent: "space-between",
		flexDirection: 'column',
		alignItems: 'center',
	},
	title: {
		fontSize: 30,
	},
	input: {
		width: 300,
		marginTop: 20,
		backgroundColor: "#E6E6E6",
		borderRadius: 2,
		height: 40,
		paddingLeft: 10,
		fontFamily: 'raleway',

	},
	button: {
		color: "#333333",
		padding: 30,
		backgroundColor: "#00379b",
		borderRadius: 10,
	},
	underlineText: {
		textDecorationLine: "underline",
		textDecorationStyle: "solid",
		textDecorationColor: "#00379b",
		color: '#b45596',
		fontFamily: 'raleway_bold',
		fontSize: 15,
	}
});

Inscription.propTypes = {
	title: PropTypes.string.isRequired,
	onForward: PropTypes.func.isRequired,
	onBack: PropTypes.func.isRequired,
};
