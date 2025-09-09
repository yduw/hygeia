import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select from 'react-select';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Fuse from 'fuse.js'


var stateOptions = require('../data/states');

export class FormInsuranceLookup extends Component {
    constructor(){
        super();
        this.populateInsuranceDropdown = this.populateInsuranceDropdown.bind(this);

        this.state = {
            inputValue: ""
        };
    }
    handleSubmitLocal = e => {
        var valid =  this.props.handleSubmit(e);
        if (valid){
            this.continue(e)
        }
    }

    fuzzySearch = (list, input) =>{
        
        if (input == ""){
            return list;
        }

        var fuseOptions = {
            shouldSort: true,
            tokenize: true,
            threshold: 0.6,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: [
            "label"
            ]
        };
        var fuse = new Fuse(list, fuseOptions);

        var fuzzySearchResults = fuse.search(input);

        var filteredList = []

        fuzzySearchResults.forEach((item, index) =>{
            filteredList.push(item.item)
        });
        return filteredList;

    }
    continue = e => {
        e.preventDefault();
        var data = {
            vid: this.props.values.vid,
            dealId: this.props.values.dealId,
            state: this.props.values.stateResidence,
            insuranceProvider: this.props.values.insuranceProvider
        };
        console.log(data);
        axios.post("https://api2.hygeiahealth.com/api/v1/Form/Submit/InsuranceLookup",data,{
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            console.log(response);
            if(!response.data.hasError){
                this.props.values.vid = response.data.vid;
                this.props.values.dealId = response.data.dealId;
                this.props.handleSuccessfulSubmit();
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
    populateInsuranceDropdown(key){
        return(
            <option>{this.props.values.insuranceList[key]}</option>
        );
    }
    render() {
        const { values, handleSelectChange, handleDismiss,abbrToState } = this.props;
        return (
            <div className={"wrapper-" + (values.domain !== "" ? values.domainStyle : '')}>
                <ProgressBar  now={values.progressPercent} /> 
                <div className="badge badge-primary progressBar-step"> Step {values.step} of 8</div>
                <div className={"submitting " + (this.props.values.submitting ? '': 'hidden')} >
                    <div>
                        <FontAwesomeIcon icon="circle-notch" className="green" size="10x" spin/>
                    </div>
                </div>
                <h1>Insurance Lookup</h1>
                <Form onSubmit={this.handleSubmitLocal} noValidate>
                    <Form.Group controlId="formState">
                            <Form.Label>State</Form.Label>
                            <Select
                                onChange= { handleSelectChange('stateResidence')}
                                value = {stateOptions.filter(option => option.value == values.stateResidence)}
                                options = {stateOptions}
                                placeholder = "Search your State of Residence"
                                className='react-select-container'
                                classNamePrefix="react-select"
                                name="stateResidence"
                                />
                            <Form.Text className="text-muted">
                                Your State of Residence
                            </Form.Text>
                    </Form.Group>
                    <Form.Group controlId="formState" className={(this.props.values.insuranceProviders.length === 0 ? 'hidden' : '')}>
                            <Form.Label>Insurance Provider</Form.Label>
                            <Select
                                onChange= { handleSelectChange('insuranceProvider')}
                                defaultInputValue = {values.insuranceProvider}
                                options = {this.fuzzySearch(this.props.values.insuranceProviders, this.state.inputValue)}
                                onInputChange={(v) => this.setState({inputValue: v})}
                                placeholder = "Search your Insurance Provider"
                                name="insuranceProvider"
                                filterOption={false}
                            />
                            <Form.Text className="text-muted">
                                Type your insurance company name and select the best match
                            </Form.Text>
                    </Form.Group>
                    <Row>
                        <Col className="text-right  border-top pt-3 pb-3">
                            <Button variant="default" type="button" onClick={this.back}>
                                    Previous
                            </Button>
                            <Button variant="primary" type="submit" disabled={!values.insuranceProvider || !values.stateResidence}>
                                Continue
                            </Button>

                        </Col>
                    </Row>
                </Form>
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

export default FormInsuranceLookup
