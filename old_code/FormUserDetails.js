import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select from 'react-select';
import Alert from 'react-bootstrap/Alert';
import MaskedFormControl from 'react-bootstrap-maskedinput';
import axios from 'axios';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from "react-bootstrap/Modal";
import PumpBrands from '../assets/images/brands.png';
import Figure from 'react-bootstrap/Figure';
import swal from 'sweetalert';

const firstBabyOptions = [
    {
        "value": true,
        "label": "Yes"
    },
    {
        "value": false,
        "label": "No"
    }
];

const toInputDate = date => {
    var inputDate = moment(date);
    console.log(inputDate);
    var outputDate = inputDate.format("YYYY-MM-DD");
    console.log(outputDate);
    return outputDate;
}

export class FormUserDetails extends Component {

    constructor() {
        super();
        this.continue = this.continue.bind(this);
    }
    handleSubmitLocal = e => {
        var valid = this.props.handleSubmit(e);
        if (valid) {
            this.continue(e)
        }
    }

    continue = e => {
        e.preventDefault();
        const { saveHubSpotIDs } = this.props;
        var data = {
            vid: this.props.values.vid,
            dealId: this.props.values.dealId,
            leadSource: this.props.values.leadSource,
            domain: this.props.values.domain,
            dueDate: this.props.values.dueDate,
            firstChild: this.props.values.firstBaby,
            email: this.props.values.email,
            phone: this.props.values.phone,
            communicationMethod: this.props.values.prefferedCommunicationMethod,
            obUploadId: this.props.values.obUploadId
        };
        axios.post("https://api2.hygeiahealth.com/api/v1/Form/Submit/UserDetails", data).then((response) => {
            if (!response.data.hasError) {
                this.props.values.vid = response.data.vid;
                this.props.values.dealId = response.data.dealId;
                this.props.handleSuccessfulSubmit();
                saveHubSpotIDs(response.data.vid, response.data.dealId);
                console.log(response.data);
                if (response.data.userExist && response.data.previousFormUrl !== "") {
                    this.props.populateLastStepUrl(response.data.previousFormUrl);
                    this.props.showFinishModalOrder();
                } else {
                    this.props.nextStep();
                }

            } else {
                this.props.handleSuccessfulSubmit();
                this.displayErrorAlert(response.data.errorMessage);
            }
        }).catch((err) => {
            console.log(err);
        });
    }
    setPhone = e => {
        e.preventDefault();
        this.props.setCommunicationMethod('Text');
        this.setState({ activeIndex: 1 });
    }
    setEmail = e => {
        e.preventDefault();
        this.props.setCommunicationMethod('Email');
        this.setState({ activeIndex: 2 });
    }
    goToLastStep = e => {
        e.preventDefault();
        window.location.replace(this.props.values.lastStepUrl);
    }

    displayErrorAlert = (errorMessage) => {
        switch(errorMessage){
            case "invalid_email":
                swal(
                    "Invalid Email",
                    "The email address you have entered is invalid. Please validate your email address and submit again.",
                    "error"
                );
                break;
            default:
                swal(
                    "Internal Error",
                    "An internal error has occurred, please try again later.",
                    "error"
                );
                break;
        }
    }

    hideExistingOrderModal = () => {
        this.props.saveHubSpotIDs(null, null);
        this.props.populateLastStepUrl("");
        this.props.hideFinishModalOrder();
    }

    render() {
        const { values, handleChange, handleSelectChange, handleDismiss, setCommunicationMethod } = this.props;
        const validationStep = 0;
        const communicationOptions = [
            { value: "Text", text: "Text Me", smstyle: { span: 3, offset: 3 }, clickmethod: this.setPhone },
            { value: "Email", text: "Email Me", smstyle: { span: 3 }, clickmethod: this.setEmail }
        ];
        return (
            <div>
                <div className={"mt-2 brands-row brand-" + (values.domain !== "" ? values.domainStyle : '')}>
                    <Figure>
                        <Figure.Caption>
                            Choose from the brands you love!
                        </Figure.Caption>
                        <Figure.Image
                            className="img-fluid"
                            alt="Hygeia Pump"
                            src={PumpBrands}
                        />
                    </Figure>
                </div>
                <div className={"mt-2 step1 wrapper-" + (values.domain !== "" ? values.domainStyle : '')}>
                    
                    <ProgressBar now={values.progressPercent} />
                    <div className="badge badge-primary progressBar-step"> Step {values.step} of 8</div>
                    <div className={"submitting " + (this.props.values.submitting ? '' : 'hidden')} >
                        <div>
                            <FontAwesomeIcon icon="circle-notch" className="green" size="10x" spin />
                        </div>
                    </div>
                    <h1>Tell us about you </h1>
                    <Form onSubmit={this.handleSubmitLocal} noValidate>
                        <Form.Group controlId="formDueDate">
                            <Form.Label>Due Date</Form.Label>
                            <Form.Control
                                className={values.formErrors[validationStep].dueDate.length > 0 ? "invalid" : ""}
                                defaultValue={toInputDate(values.dueDate)}
                                name="dueDate"
                                type="date"
                                placeholder="Due Date"
                                onChange={handleChange('dueDate')}
                                size="sm"
                            />
                            <Form.Text className="text-muted">
                                Approximate Due Date
                                {values.formErrors[validationStep].dueDate.length > 0 && (
                                    <span className="errorMessage">
                                        {values.formErrors[validationStep].dueDate}
                                    </span>
                                )}
                            </Form.Text>
                        </Form.Group>
                        <Form.Group controlId="firstBaby">
                            <Form.Label>First Baby?</Form.Label>
                            <Select
                                onChange={handleSelectChange('firstBaby')}
                                options={firstBabyOptions}
                                value={firstBabyOptions.filter(option => option.value === values.firstBaby)}
                                placeholder="Is this your first baby?"
                                name="firstBaby"
                                className='react-select-container'
                                classNamePrefix="react-select"
                            />
                        </Form.Group>

                        <Row>
                            <Col xs={12} >
                                    <Form.Group controlId="email">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            className={values.formErrors[validationStep].email.length > 0 ? "invalid" : ""}
                                            name="email"
                                            type="email"
                                            placeholder="name@server.com"
                                            onChange={handleChange('email')}
                                            defaultValue={values.email}
                                            size="sm"
                                            isValid={values.email.length > 0 && values.formErrors[validationStep].email.length === 0}
                                        />
                                        <Form.Text className="text-muted">
                                            Enter your personal email address
                                            {values.formErrors[validationStep].email.length > 0 && (
                                                <span className="errorMessage">
                                                    {values.formErrors[validationStep].email}
                                                </span>
                                            )}
                                        </Form.Text>
                                    </Form.Group>
                            </Col>

                            <Col xs={12} >
                                    <Form.Group controlId="phone">
                                        <Form.Label>Mobile Number</Form.Label>
                                        <MaskedFormControl
                                            mask='(111)111-1111'
                                            name="phone"
                                            type="text"
                                            onChange={handleChange('phone')}
                                            className={"form-control-sm " + (values.formErrors[validationStep].phone.length > 0 ? "invalid" : "")}
                                            value={values.phone}
                                        />
                                        <Form.Text className="text-muted">
                                            Enter your Personal Mobile phone number
                                            {values.formErrors[validationStep].phone.length > 0 && (
                                                <span className="errorMessage">
                                                    {values.formErrors[validationStep].phone}
                                                </span>
                                            )}
                                        </Form.Text>
                                    </Form.Group>
                            </Col>
                        </Row>                

                        <h1>How do you prefer to be communicated with? </h1>
                        <Row className="mb-3" >
                            {
                                communicationOptions.map((option,index) => {
                                    return (
                                        <Col xs={6} sm={option.smstyle} key={index}>
                                            <Button variant="outline-primary" block onClick={option.clickmethod} className={values.prefferedCommunicationMethod === option.value ? "active" : ""}>{option.text}</Button>
                                        </Col>
                                    );
                                })
                            }
                        </Row>

                        <Row>
                            <Col className="text-right  border-top pt-3 pb-3">
                                <Button variant="primary" type="submit" disabled={(!values.dueDate || values.firstBaby === null || !values.email || !values.phone || !values.prefferedCommunicationMethod)} >
                                    Continue
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                    <Alert variant="danger" show={values.apiError}>
                        <button type="button" className="close" onClick={handleDismiss}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <span>{values.apiErrorMessage}</span>
                    </Alert>
                    <Modal show={values.showExistingFormModal} onHide={this.hideExistingOrderModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Oh… Good news!</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Your phone or email already exists our system.  No need to start over, you can click the button below to jump ahead.</Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={this.goToLastStep}>
                                Finish your order
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>


        )
    }
}

export default FormUserDetails
