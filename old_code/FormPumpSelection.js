import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import Alert from "react-bootstrap/Alert";
import Figure from 'react-bootstrap/Figure';
import HygeiaPump from '../assets/images/Hygeia_Express.png';


export class FormPumpSelection extends Component {
    constructor(){
        super();
        this.continue = this.continue.bind(this);
    }
    continue = e => {
        e.preventDefault();
        var pumpSelection = "Other";
        if(this.props.values.chooseHygeia){
            pumpSelection = "Hygeia";
        }
        var data = {
            vid: this.props.values.vid,
            dealId: this.props.values.dealId,
            pump: pumpSelection
        };
        axios.post("https://api2.hygeiahealth.com/api/v1/Form/Submit/ChoosePump",data).then((response) => {
            if(!response.data.hasError){
                this.props.values.vid = response.data.vid;
                this.props.values.dealId = response.data.dealId;
                this.props.nextStep();
            }else{
                //TODO: HANDLE API ERRORS
            }
        }).catch((err) => {
            console.log(err);
        });
    }
    back = e => {
        e.preventDefault();
        this.props.prevStep();
    }
    render() {
        const { values, handleChange,handleDismiss } = this.props;
        return (
            <div className={"wrapper-" + (values.domain !== "" ? values.domainStyle : '')}>
                <ProgressBar  now={values.progressPercent} />
                <div className="badge badge-primary progressBar-step"> Step {values.step} of 8</div>
                <h1>Choose your Pump <small>You're halfway there!</small></h1>
                
                <Row className = "align-items-center mt-4">
                    <Col xs={12} md={6}>
                        <Form.Check id='Free' className={" FormCheck-radio " + ( values.chooseHygeia ? 'selected' : '' )}>
                            <Form.Check.Input 
                                type='radio'
                                name="chooseHygeia"
                                isValid                               
                                onChange = {handleChange('chooseHygeia')}
                                defaultChecked = { values.chooseHygeia === true }
                                defaultValue = {true}                                                          
                            />
                            <Form.Check.Label>Free Hospital-Grade Pump</Form.Check.Label>
                                <ul className="text-left lh-small feature-list">
                                    <li>Double electric pump</li>
                                    <li>Cordless</li>
                                    <li>Wearable cups included</li>
                                    <li>Free extra collection cups and accessories</li>
                                </ul>
                            <div className="text-center pump-container">                        
                                <Figure >
                                    <Figure.Image
                                        className="img-fluid"
                                        alt="Hygeia Pump"
                                        src={HygeiaPump}
                                    />
                                </Figure>
                            </div>
                        </Form.Check>
                    </Col>
                    <Col xs={12} md={6}>
                        <Form.Check id='ChooseAnother' className={" FormCheck-radio " + ( values.chooseHygeia ? '' : 'selected' )}>
                                <Form.Check.Input
                                    type='radio'
                                    name="chooseHygeia" 
                                    isValid 
                                    onChange = {handleChange('chooseHygeia')}
                                    defaultChecked = { values.chooseHygeia === false}
                                    defaultValue = {false}
                                />
                                <Form.Check.Label>Choose your Pump</Form.Check.Label>
                                <Form.Control.Feedback>(Not all options are FREE)</Form.Control.Feedback>
                        </Form.Check>
                    </Col>

                </Row>
                <Row>
                    <Col className="text-right  border-top pt-3 pb-3">
                        <Button variant="default" type="button" onClick={this.back}>
                                Previous 
                        </Button>
                        <Button variant="primary" type="button" onClick={this.continue}>
                                Continue 
                        </Button>
                    </Col>
                </Row>
                <Alert variant="danger" show={values.apiError}>
                    <button type="button" className="close"  onClick={handleDismiss}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <span>{values.apiErrorMessage}</span>
                </Alert>
            </div>
        )
    }
}

export default FormPumpSelection
