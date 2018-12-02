import React from 'react';
import axios from 'axios';
import { Heading, Paragraph, Pane, Text, Link, TextInputField, Label, Textarea, Button, toaster } from 'evergreen-ui';
import Config from '../Config';
import './signup.css';

export default class SignUp extends React.Component {
  
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      message: '',
      validName: null,
      validEmail: null,
      validMessage: null,
    };
  }

  handleChange = (event) => {
    const mailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const newState = { ...this.state };
    newState[event.target.getAttribute('name')] = event.target.value;
    newState.validName = newState.name.length > 0 ? newState.name.length < 100 : null;
    newState.validEmail = newState.email.length > 0 ? mailRe.test(String(newState.email).toLowerCase()) : null;
    newState.validMessage = newState.message.length > 0 ? newState.message.length < 1000 : null;
    this.setState(newState);
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const url = Config.slackWebhookUrl;
    const data = JSON.stringify({text: `${this.state.name} (${this.state.email}), ${Config.messageLabel}:\n${this.state.message}`});
    axios.post(url, data)
    .then(() => {
      // handle success
      this.setState({
        name: '',
        email: '',
        message: '',
        validName: null,
        validEmail: null,
        validMessage: null,
      });
      toaster.success('Cool, es freut uns dich an Bord zu haben! Wir melden uns bei dir.');
    })
    .catch((error) => {
      // handle error
      console.error('arrrgh...', error);
      toaster.danger('Das hat leider nicht geklappt. Versuch\'s doch bitte nochmal, oder kontaktiere uns via E-Mail: info@grit.rocks');
    });
  };

  render() {
    return (
      <Pane
        justifyContent="center"
        marginTop={32}
      >
        <Pane
          width={400}
          marginBottom={24}
        >
          <Heading size={800}>{Config.title}</Heading>
          {Config.description.map(paragraph => (
            <Paragraph marginTop="default">
              {paragraph}
            </Paragraph>
          ))}
        </Pane>
        <form onSubmit={this.handleSubmit}>
          <div className="formSection">
            <TextInputField
              label="Name"
              placeholder="John Doe"
              name="name"
              value={this.state.name}
              onChange={this.handleChange}
              isInvalid={this.state.validName != null && !this.state.validName}
              width={400}
            />
          </div>
          <div className="formSection">
            <TextInputField
              label="E-Mail"
              placeholder="john.doe@chipmunks.com"
              name="email"
              value={this.state.email}
              onChange={this.handleChange}
              isInvalid={this.state.validEmail != null && !this.state.validEmail}
              width={400}
            />
          </div>
          <div className="formSection">
            <Label
              htmlFor="textarea-2"
              marginBottom={4}
              display="block"
            >
              {Config.messageLabel}
            </Label>
            <Textarea
              id="textarea-2"
              placeholder={Config.messagePlaceholder}
              name="message"
              value={this.state.message}
              onChange={this.handleChange}
              isInvalid={this.state.validMessage != null && !this.state.validMessage}
              width={400}
            />
          </div>
          <div className="formSection">
          <Pane
            display="flex"
            justifyContent="center"
            marginTop={32}
          >
            <Button 
              appearance="primary"
              iconBefore="endorsed"
              height={40}
              type="submit"
              disabled={!this.state.validName || !this.state.validEmail || !this.state.validMessage}
            >
              {Config.buttonLabel}
            </Button>
          </Pane>
          </div>
        </form>
        <Pane
          width={400}
          marginTop={24}
        >
          <Pane
            width={100}
            marginRight={12}
          >
            <div id='logo'></div>
          </Pane>
          <Pane>
            <Text>Dies ist ein öffentlicher Event von GRIT.</Text>
            <Link href="http://www.grit.rocks">www.grit.rocks</Link>
          </Pane>
        </Pane>
      </Pane>
    );
  }
}