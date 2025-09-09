import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select from 'react-select';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Alert from 'react-bootstrap/Alert';

var monthOptions = require('../data/months');
var dayOptions = require('../data/days');
var yearOptions = require('../data/years');

export class FormInsuranceInfo extends Component {
    constructor(){
        super();
        this.continue = this.continue.bind(this);
    }
    handleSubmitLocal = e => {
        var valid =  this.props.handleSubmit(e);
        if (valid){
            this.continue(e)
        }
    }
    continue = e => {
        e.preventDefault();
        var dob = this.props.values.dobMonth + "/" + this.props.values.dobDay + "/" + this.props.values.dobYear;
        var data = {
            vid: this.props.values.vid,
            dealId: this.props.values.dealId,
            firstName: this.props.values.firstName,
            lastName: this.props.values.lastName,
            dob: dob,
            memberId: this.props.values.memberID
        };
        axios.post("https://api2.hygeiahealth.com/api/v1/Form/Submit/InsuranceInfo",data).then((response) => {
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
    render() {
        const { values, handleChange, handleSubmit, handleSelectChange, handleDismiss } = this.props;
        const  validationStep = 2;
        return (
            <div className={"wrapper-" + (values.domain !== "" ? values.domainStyle : '')}>
                <ProgressBar  now={values.progressPercent} /> 
                <div className="badge badge-primary progressBar-step"> Step {values.step} of 8</div>
                <div className={"submitting " + (this.props.values.submitting ? '': 'hidden')} >
                    <div>
                        <FontAwesomeIcon icon="circle-notch" className="green" size="10x" spin/>
                    </div>
                </div>
                <h1>Insurance Details</h1>
                <Form onSubmit={ this.handleSubmitLocal} noValidate>
                    <Form.Group controlId="formInsuredFirstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                            className={ values.formErrors[validationStep].firstName.length > 0 ? "invalid" : ""}
                            name="firstName"
                            type="text"
                            placeholder="Your First Name"
                            onChange = {handleChange('firstName')}
                            defaultValue = {values.firstName}
                            size="sm"
                        />
                        <Form.Text className="text-muted">
                            {values.formErrors[validationStep].firstName.length > 0 &&(
                                <span className="errorMessage">
                                        {values.formErrors[validationStep].firstName}
                                </span>
                            )}
                        </Form.Text>
                    </Form.Group>
                    <Form.Group controlId="formInsuredLasttName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                            className={ values.formErrors[validationStep].lastName.length > 0 ? "invalid" : ""}
                            name="lastName"
                            type="text"
                            placeholder="Your Last Name"
                            onChange = {handleChange('lastName')}
                            defaultValue = {values.lastName}
                            size="sm"
                        />
                        <Form.Text className="text-muted">
                            {values.formErrors[validationStep].lastName.length > 0 &&(
                                <span className="errorMessage">
                                    {values.formErrors[validationStep].lastName}
                                </span>
                            )}
                        </Form.Text>
                    </Form.Group>
                    <Form.Group controlId="formDOBMonth">
                        <Form.Label>Mother&apos;s Birth Month</Form.Label>
                        <Select
                            onChange= { handleSelectChange('dobMonth')}
                            value={monthOptions.filter(option => option.value === values.dobMonth)}
                            options = {monthOptions}
                            placeholder = "Birth Month"
                            name="dobMonth"
                            className='react-select-container'
                            classNamePrefix="react-select"
                        />
                        <Form.Text className="text-muted">
                            Select your Birth Month
                        </Form.Text>
                    </Form.Group>
                    <Form.Group controlId="formDOBDay">
                        <Form.Label>Mother&apos;s Birth Day</Form.Label>
                        <Select
                            onChange= { handleSelectChange('dobDay')}
                            value={dayOptions.filter(option => option.value === values.dobDay)}
                            options = {dayOptions}
                            placeholder = "Birth Day"
                            name="dobDay"
                            className='react-select-container'
                            classNamePrefix="react-select"
                        />
                        <Form.Text className="text-muted">
                            Select your Birth Day
                        </Form.Text>
                    </Form.Group>
                    <Form.Group controlId="formDOBYear">
                        <Form.Label>Mother&apos;s Birth Year</Form.Label>
                        <Select
                            onChange= { handleSelectChange('dobYear')}
                            value={yearOptions.filter(option => option.value === values.dobYear)}
                            options = {yearOptions}
                            placeholder = "Birth Year"
                            name="dobYear"
                            className='react-select-container'
                            classNamePrefix="react-select"
                        />
                        <Form.Text className="text-muted">
                            Select your Birth Year
                        </Form.Text>
                    </Form.Group>
                    <Form.Group controlId="formMemberID">
                        <Form.Label>Member ID</Form.Label>
                        <Form.Control
                            className={ values.formErrors[validationStep].memberID.length > 0 ? "invalid" : ""}
                            name="memberID"
                            type="text"
                            placeholder=" Insurance MemberID"
                            onChange = {handleChange('memberID')}
                            defaultValue = {values.memberID}
                            size="sm"
                        />
                        <Form.Text className="text-muted">
                            {values.formErrors[validationStep].memberID.length > 0 &&(
                                <span className="errorMessage">
                                    {values.formErrors[validationStep].memberID}
                                </span>
                            )}
                        </Form.Text>
                    </Form.Group>
                    {/* <p>Need help finding your ID?
                        <a href="#">  Play This Video  <FontAwesomeIcon icon="play-circle" size="lg"/>
                        </a>
                    </p> */}

                    <Row>
                        <Col className="text-right  border-top pt-3 pb-3">
                            <Button variant="default" type="button" onClick={this.back}>
                                Previous
                            </Button>
                            <Button variant="primary" type="submit" disabled={(!values.firstName || !values.lastName || !values.memberID || !values.dobMonth || !values.dobDay ||  !values.dobYear ) }>
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

export default FormInsuranceInfo
