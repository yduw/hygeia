import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import MaskedFormControl from 'react-bootstrap-maskedinput';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import swal from 'sweetalert';
import validator from 'validator';
import Figure from 'react-bootstrap/Figure';
import PumpBrands from '../assets/images/brands.png';

export class FormPAS extends Component {

    constructor(props) {
        super(props);
        this.state = {
            step: 1, // 1 = email/phone input, 2 = OTP input
            email: '',
            phone: '',
            contactMethod: '', // 'email' or 'phone'
            otp: ['', '', '', '', '', ''],
            submitting: false,
            apiError: false,
            apiErrorMessage: '',
            formErrors: {
                email: '',
                phone: ''
            }
        };
    }

    componentDidMount() {
        // Get domain styling
        const domain = window.location.origin;
        const style = this.getDomainStyle(domain);
        this.setState({ domainStyle: style });
        
        // Add body class for background styling
        document.body.classList.add(style);
    }

    componentWillUnmount() {
        // Clean up body class
        const { domainStyle } = this.state;
        if (domainStyle) {
            document.body.classList.remove(domainStyle);
        }
    }

    getDomainStyle = (domain) => {
        switch(domain){
            case "http://localhost:3000":
                return "style2";
            case "https://form.moms.abreastpumpandmore.com":
                return "style1";
            case "https://form.abreastpumpandmore.com":
                return "style1";
            case "https://form.hygeiahealth.com":
                return "style2";
            case "https://form.momsgetmore.com":
                return "style3";
            default:
                return "style2";
        }
    }

    handleChange = (field) => (e) => {
        const value = e.target.value;
        this.setState({ [field]: value });

        // Validation
        let formErrors = { ...this.state.formErrors };
        switch (field) {
            case 'email':
                formErrors.email = validator.isEmail(value) || value === '' ? '' : 'Invalid email address';
                break;
            case 'phone':
                formErrors.phone = value.length > 1 ? '' : 'Phone number is required';
                formErrors.phone = validator.isMobilePhone(value, "en-US") ? formErrors.phone : "Your phone number is not valid";
                break;
            default:
                break;
        }
        this.setState({ formErrors });
    }

    handleOTPChange = (index) => (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Only digits
        if (value.length <= 1) {
            let newOtp = [...this.state.otp];
            newOtp[index] = value;
            this.setState({ otp: newOtp });

            // Auto focus to next input
            if (value && index < 5) {
                const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`);
                if (nextInput) nextInput.focus();
            }
        }
    }

    handleKeyDown = (index) => (e) => {
        // Handle backspace to go to previous input
        if (e.key === 'Backspace' && !this.state.otp[index] && index > 0) {
            const prevInput = document.querySelector(`input[name="otp-${index - 1}"]`);
            if (prevInput) prevInput.focus();
        }
    }

    requestOTP = async (e) => {
        e.preventDefault();
        
        const { email, phone } = this.state;
        
        // Determine contact method
        let contactMethod = '';
        let payload = {};
        
        if (email && !phone) {
            contactMethod = 'email';
            payload = { email: email };
        } else if (phone && !email) {
            contactMethod = 'phone';
            payload = { phone: phone };
        } else if (email && phone) {
            // If both provided, prefer email
            contactMethod = 'email';
            payload = { email: email };
        } else {
            this.setState({
                apiError: true,
                apiErrorMessage: 'Please enter either an email address or phone number'
            });
            return;
        }

        // Validate input
        if (contactMethod === 'email' && this.state.formErrors.email) {
            this.setState({
                apiError: true,
                apiErrorMessage: 'Please enter a valid email address'
            });
            return;
        }

        if (contactMethod === 'phone' && this.state.formErrors.phone) {
            this.setState({
                apiError: true,
                apiErrorMessage: 'Please enter a valid phone number'
            });
            return;
        }

        this.setState({ submitting: true, apiError: false });

        try {
            const response = await axios.post('https://api2.hygeiahealth.com/api/PAS/RequestOTP', payload);
            
            if (response.status === 200) {
                this.setState({
                    step: 2,
                    contactMethod: contactMethod,
                    submitting: false
                });
                swal('Success', `OTP code sent to your ${contactMethod}`, 'success');
            }
        } catch (error) {
            console.error('Error requesting OTP:', error);
            this.setState({
                submitting: false,
                apiError: true,
                apiErrorMessage: 'Failed to send OTP. Please try again.'
            });
        }
    }

    validateOTP = async (e) => {
        e.preventDefault();
        
        const otpCode = this.state.otp.join('');
        
        if (otpCode.length !== 6) {
            this.setState({
                apiError: true,
                apiErrorMessage: 'Please enter the complete 6-digit OTP code'
            });
            return;
        }

        this.setState({ submitting: true, apiError: false });

        try {
            const response = await axios.post('https://api2.hygeiahealth.com/api/PAS/ValidateOTP', {
                otp: parseInt(otpCode)
            });
            
            if (response.status === 200 && response.data.vid) {
                // Redirect to Medi-Cal PAS page with contact ID
                window.location.href = `https://www.hygeiahealth.com/medi-cal-pas/?contactId=${response.data.vid}`;
            }
        } catch (error) {
            console.error('Error validating OTP:', error);
            this.setState({
                submitting: false,
                apiError: true,
                apiErrorMessage: 'Invalid OTP code. Please try again.'
            });
        }
    }

    handleDismiss = () => {
        this.setState({ apiError: false });
    }

    goBack = () => {
        this.setState({ 
            step: 1,
            otp: ['', '', '', '', '', ''],
            apiError: false 
        });
    }

    render() {
        const { step, email, phone, otp, submitting, apiError, apiErrorMessage, formErrors, domainStyle } = this.state;

        return (
            <div>
                <div className={`mt-2 brands-row brand-${domainStyle || 'style2'}`}>
                    <Figure>
                        {/* <Figure.Caption>
                            Pre-Authorization Service
                        </Figure.Caption>
                        <Figure.Image
                            className="img-fluid"
                            alt="Hygeia Health"
                            src={PumpBrands}
                        /> */}
                    </Figure>
                </div>
                <div className={`mt-2 step1 wrapper-${domainStyle || 'style2'}`}>
                    <div className={`submitting ${submitting ? '' : 'hidden'}`}>
                        <div>
                            <FontAwesomeIcon icon="circle-notch" className="green" size="10x" spin />
                        </div>
                    </div>

                    {step === 1 ? (
                        <div className="pt-5">
                            <h1>Parts and Accessories Request</h1>
                            <p className="lead">Enter your email or phone number to request a verification code.</p>
                            
                            <Form onSubmit={this.requestOTP} noValidate>
                                <Form.Group controlId="formEmail">
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control
                                        className={formErrors.email.length > 0 ? "invalid" : ""}
                                        name="email"
                                        type="email"
                                        placeholder="name@server.com"
                                        onChange={this.handleChange('email')}
                                        value={email}
                                        size="sm"
                                        isValid={email.length > 0 && formErrors.email.length === 0}
                                    />
                                    <Form.Text className="text-muted">
                                        Enter your email address
                                        {formErrors.email.length > 0 && (
                                            <span className="errorMessage">
                                                {formErrors.email}
                                            </span>
                                        )}
                                    </Form.Text>
                                </Form.Group>

                                <div className="text-center my-3">
                                    <strong>OR</strong>
                                </div>

                                <Form.Group controlId="formPhone">
                                    <Form.Label>Phone Number</Form.Label>
                                    <MaskedFormControl
                                        mask='(111)111-1111'
                                        name="phone"
                                        type="text"
                                        onChange={this.handleChange('phone')}
                                        className={"form-control-sm " + (formErrors.phone.length > 0 ? "invalid" : "")}
                                        value={phone}
                                        isValid={phone.length > 0 && formErrors.phone.length === 0}
                                    />
                                    <Form.Text className="text-muted">
                                        Enter your phone number
                                        {formErrors.phone.length > 0 && (
                                            <span className="errorMessage">
                                                {formErrors.phone}
                                            </span>
                                        )}
                                    </Form.Text>
                                </Form.Group>

                                <Row className="mb-4">
                                    <Col className="text-center border-top pt-3 pb-3">
                                        <Button 
                                            variant="primary" 
                                            type="submit" 
                                            disabled={submitting || (!email && !phone) || (email && formErrors.email) || (phone && formErrors.phone)}
                                        >
                                            {submitting ? 'Sending...' : 'Send Verification Code'}
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    ) : (
                        <div className="pt-5">
                            <h1>Enter Verification Code</h1>
                            <p className="lead">
                                We've sent a 6-digit verification code to your {this.state.contactMethod}.
                            </p>
                            
                            <Form onSubmit={this.validateOTP} noValidate>
                                <Form.Group>
                                    <Form.Label className="text-center d-block">Verification Code</Form.Label>
                                    <div className="d-flex justify-content-center">
                                        <div style={{ maxWidth: '350px', width: '100%' }}>
                                            <Row className="justify-content-center no-gutters">
                                                {otp.map((digit, index) => (
                                                    <Col key={index} className="px-1 d-flex justify-content-center">
                                                        <Form.Control
                                                            name={`otp-${index}`}
                                                            type="text"
                                                            value={digit}
                                                            onChange={this.handleOTPChange(index)}
                                                            onKeyDown={this.handleKeyDown(index)}
                                                            maxLength="1"
                                                            className="text-center"
                                                            style={{ 
                                                                fontSize: '1.5rem', 
                                                                fontWeight: 'bold',
                                                                width: '45px',
                                                                height: '50px',
                                                                maxWidth: '45px'
                                                            }}
                                                        />
                                                    </Col>
                                                ))}
                                            </Row>
                                        </div>
                                    </div>
                                    <Form.Text className="text-muted text-center mt-2">
                                        Enter the 6-digit code sent to your {this.state.contactMethod}
                                    </Form.Text>
                                </Form.Group>

                                <Row className="mt-4 mb-4">
                                    <Col xs={5} className="offset-1">
                                        <Button 
                                            variant="outline-secondary" 
                                            onClick={this.goBack}
                                            disabled={submitting}
                                            block
                                        >
                                            Back
                                        </Button>
                                    </Col>
                                    <Col xs={5}>
                                        <Button 
                                            variant="primary" 
                                            type="submit"
                                            block
                                            disabled={submitting || otp.join('').length !== 6}
                                        >
                                            {submitting ? 'Verifying...' : 'Verify Code'}
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    )}

                    <Alert variant="danger" show={apiError} className="mt-3">
                        <button type="button" className="close" onClick={this.handleDismiss}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <span>{apiErrorMessage}</span>
                    </Alert>
                </div>
            </div>
        );
    }
}

export default FormPAS;
