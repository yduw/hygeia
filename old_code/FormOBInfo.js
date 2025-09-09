import React, { Component } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import MaskedFormControl from 'react-bootstrap-maskedinput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export class FormOBInfo extends Component {

    constructor() {
        super();
        this.handleSubmitLocal = this.handleSubmitLocal.bind(this);
        this.getSelectedOBGyn = this.getSelectedOBGyn.bind(this);
        this.state = {
            doctors: [],
            isSearch: true
        };
    }
    back = e => {
        e.preventDefault();
        this.props.prevStep();
    }
    showRecommendedOBG = e => {
        this.props.showObGynConfirmation();
    }
    hideRecommendedOBG = e => {
        this.props.hideObGynConfirmation();
        this.props.handleSuccessfulSubmit();
    }
    getSelectedOBGyn = (docKey) => {
        var selectedDoctor = this.state.doctors[docKey];
        this.props.updateDoctor(selectedDoctor.firstname, selectedDoctor.lastname, selectedDoctor.phonenumber1);
        var data2 = {
            vid: this.props.values.vid,
            dealId: this.props.values.dealId,
            doctorFirstName: selectedDoctor.provider_first_name,
            doctorLastName: selectedDoctor.provider_last_name,
            doctorNPI: selectedDoctor.npi
        };
        axios.post("https://api2.hygeiahealth.com/api/v1/Form/Submit/OBInfo", data2).then((response2) => {
            if (!response2.data.hasError) {
                this.props.nextStep();
                this.props.handleSuccessfulSubmit();
            } else {
                //TODO HANDLE ERROR
            }
        });
    }
    submitOriginalDocInfo() {
        var data2 = {
            vid: this.props.values.vid,
            dealId: this.props.values.dealId,
            doctorFirstName: this.props.values.gynFirstName,
            doctorLastName: this.props.values.gynLastName,
            doctorPhoneNumber: this.props.values.gynPhoneNumber
        };
        axios.post("https://api2.hygeiahealth.com/api/v1/Form/Submit/OBInfo", data2).then((response2) => {
            if (!response2.data.hasError) {
                this.props.nextStep();
                this.props.handleSuccessfulSubmit();
            } else {
                //TODO HANDLE ERROR
                this.props.handleSuccessfulSubmit();
            }
        });
    }
    myDoctorIsNotListed() {
        this.hideRecommendedOBG();
        this.setState({
            isSearch: false,
            gynPhoneNumber: '',
        });
    }
    handleSubmitLocal = e => {
        e.preventDefault();

        if (this.state.isSearch) {
            this.searchDoctors();
        } else {
            var valid = this.props.handleSubmit(e);
            console.log(valid);
            if (valid) {
                this.submitOriginalDocInfo();
            }
        }
    }
    searchDoctors() {
        var data = {
            doctorFirstName: this.props.values.gynFirstName,
            doctorLastName: this.props.values.gynLastName,
            state: this.props.values.stateResidence
        };
        axios.post("https://api2.hygeiahealth.com/api/v1/Utilities/Doctor/Validate", data).then((result) => {

            if (!result.data.error) {
                let doctorList = [];

                if (result.data.exactMatches) {
                    doctorList = result.data.exactMatches;
                } else {
                    doctorList = result.data.suggestions;
                }
                this.setState({
                    doctors: doctorList
                });
                this.showRecommendedOBG();
            }else{
                this.submitOriginalDocInfo();
            }
        });
    }
    render() {
        const { values, handleChange, handleDismiss, handleSubmit } = this.props;
        const validationStep = 6;
        let nextStepButton;
        const listItems = this.state.doctors.map((value, key) =>
            <ListGroup.Item className="obg-suggest"
                key={key}
            >
                <span>
                    <span>{value.provider_first_name} {value.provider_last_name}</span><br />
                    <span>{value.provider_first_line_business_practice_location_address} {value.provider_business_practice_location_address_city}, {value.provider_business_practice_location_address_state} {value.provider_business_practice_location_address_postal.substring(0, 5)}</span><br />
                    <span>{value.provider_business_practice_location_address_telephone_number}</span>
                </span>
                <Button className="float-right" data-obgkey={key} onClick={() => { this.getSelectedOBGyn(key) }} variant='outline-info'>Select</Button>
            </ListGroup.Item>
        );

        if (this.state.isSearch) {
            nextStepButton =
                <Button variant="primary" type="submit" disabled={(!values.gynFirstName || !values.gynLastName)}>
                    Search
            </Button>
        } else {
            nextStepButton =
                <Button variant="primary" type="submit" disabled={(!values.gynFirstName || !values.gynLastName || !values.gynPhoneNumber)}>
                    Continue
            </Button>
        }
        return (
            <div className={"wrapper-" + (values.domain !== "" ? values.domainStyle : '')}>
                <ProgressBar now={values.progressPercent} />
                <div className="badge badge-primary progressBar-step"> Step {values.step} of 8</div>
                <div className={"submitting " + (this.props.values.submitting ? '' : 'hidden')} >
                    <div>
                        <FontAwesomeIcon icon="circle-notch" className="green" size="10x" spin />
                    </div>
                </div>
                <h1>OB GYN information <small>One last thing!</small></h1>
                <p className="text-muted"> If you see multiple doctors, please just enter the name of one of the doctors in the OB/GYN office. </p>
                <Form onSubmit={this.handleSubmitLocal} noValidate>

                    <Form.Group controlId="gynFirstName">
                        <Form.Label>Your OB GYN first name
                            </Form.Label>
                        <Form.Control
                            name="gynFirstName"
                            type="text"
                            placeholder="Your OB GYN First Name"
                            onChange={handleChange('gynFirstName')}
                            defaultValue={values.gynFirstName}
                            size="sm"
                        />
                        <Form.Text className="text-muted">
                            {values.formErrors[validationStep].gynFirstName.length > 0 && (
                                <span className="errorMessage">
                                    {values.formErrors[validationStep].gynFirstName}
                                </span>

                            )}
                                Ex. Jane (does not need to say Dr.)
                            </Form.Text>
                    </Form.Group>
                    <Form.Group controlId="gynLastName">
                        <Form.Label>Your OB GYN last name</Form.Label>
                        <Form.Control
                            name="gynLastName"
                            type="text"
                            placeholder="Your OB GYN Last Name"
                            onChange={handleChange('gynLastName')}
                            defaultValue={values.gynLastName}
                            size="sm"
                        />
                        <Form.Text className="text-muted">
                            {values.formErrors[validationStep].gynLastName.length > 0 && (
                                <span className="errorMessage">
                                    {values.formErrors[validationStep].gynLastName}
                                </span>
                            )}
                                Ex. Doe
                            </Form.Text>
                    </Form.Group>

                    {
                        !this.state.isSearch &&
                        <Form.Group controlId="gynPhoneNumber">
                            <Form.Label>OB GYN Phone Number</Form.Label>
                            <MaskedFormControl
                                mask='(111)111-1111'
                                name="gynPhoneNumber"
                                type="text"
                                onChange={handleChange('gynPhoneNumber')}
                                value={values.gynPhoneNumber}
                                className="form-control-sm"
                            />
                            <Form.Text className="text-muted">
                                {values.formErrors[validationStep].gynPhoneNumber.length > 0 && (
                                    <span className="errorMessage">
                                        {values.formErrors[validationStep].gynPhoneNumber}
                                    </span>
                                )}
                            </Form.Text>
                        </Form.Group>
                    }

                    <Row>
                        <Modal show={values.gynLookupConfirmation}>
                            <Modal.Header >
                                <Modal.Title>Is Your Doctor Listed Here</Modal.Title>
                                <button type="button" className="close" onClick={this.hideRecommendedOBG}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </Modal.Header>
                            <Modal.Body>
                                <ListGroup>
                                    {listItems}
                                    <ListGroup.Item action onClick={this.hideRecommendedOBG}>
                                        I want to re-enter my Doctor Information.
                                    </ListGroup.Item>
                                    <ListGroup.Item action onClick={() => { this.myDoctorIsNotListed() }}>
                                        My Doctor is Not Listed
                                    </ListGroup.Item>
                                </ListGroup>
                            </Modal.Body>
                        </Modal>
                    </Row>
                    <Row>
                        <Col className="text-right  border-top  pt-3 pb-3">
                            <Button variant="default" type="button" onClick={this.back}>
                                Previous
                            </Button>
                            {nextStepButton}
                        </Col>
                    </Row>
                </Form>
                <Alert variant="danger" show={values.apiError}>
                    <button type="button" className="close" onClick={handleDismiss}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <span>{values.apiErrorMessage}</span>
                </Alert>
            </div>

        )
    }
}

export default FormOBInfo
