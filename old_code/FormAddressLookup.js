import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Script from 'react-load-script';
import Select from 'react-select';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

var stateOptions = require('../data/states');

export class FormAddressLookup extends Component {
    constructor(props) {
        super(props);
        this.acceptSuggesstedAddress = this.acceptSuggesstedAddress.bind(this);
        this.handleScriptLoad = this.handleScriptLoad.bind(this);
        this.handlePlaceSelect = this.handlePlaceSelect.bind(this);
        this.state = { 
            address: '',
            fedexMessage: "",
            fedexReccomendedAddress: "",
            address: "",
            address2: "",
            city: "",
            state: "",
            zip: "",
            showAddressContinue: true
        }
    }
    handleSubmitLocal = e => {
        var valid =  this.props.handleSubmit(e);
        if (valid){
            this.continue(e)
        }
    }
    continue = e => {
        e.preventDefault();
        var data = {
            addressLine1: this.props.values.shippingAddressL1,
            addressLine2: this.props.values.shippingAddressL2,
            city: this.props.values.shippingAddressCity,
            state: this.props.values.shippingAddressState,
            postalCode: String(this.props.values.shippingAddressZip)
        };
        axios.post("https://api2.hygeiahealth.com/api/v1/Fedex/ValidateAddress",data).then((response) => {
            console.log(response);
            if(response.data.validationResult === "Valid"){
                var address = response.data.addressLine1;
                var address2 = response.data.addressLine2;
                var city = response.data.city;
                var state = response.data.stateOrProvinceCode;
                var zip = response.data.postalCode;
                zip = zip.substring(0,5);
                var fedexReccomendedAddress = address + " " + city + ", " + state + " " + zip;
                if(address2 !== ""){
                    fedexReccomendedAddress = address + " " + address2 + " " + city + ", " + state + " " + zip;
                }
                this.setState({
                    fedexMessage: "We use FedEx to ship all our products and they don't recognize your address. Please accept the suggested address or edit your address to go back.",
                    fedexReccomendedAddress: fedexReccomendedAddress,
                    address: address,
                    address2: address2,
                    city: city,
                    state: state,
                    zip: zip,
                    showAddressContinue: true
                });
                this.props.showAddressConfirmation();
            }else{
                if(this.props.values.shippingAddressL2 === ""){
                    // this.setState({
                    //     fedexMessage: "<strong>We looked up your address with FEDEX and can’t find that address.  Please re-enter your information.</strong>",
                    //     fedexReccomendedAddress: "",
                    //     address: "",
                    //     address2: "",
                    //     city: "",
                    //     state: "",
                    //     zip: "",
                    //     showAddressContinue: false 
                    // });
                    // this.props.showAddressConfirmation();
                    var fedexReccomendedAddress = this.props.values.shippingAddressL1 + " " + this.props.values.shippingAddressL2 + " " + this.props.values.shippingAddressCity + ", " + this.props.values.shippingAddressState + " " + this.props.values.shippingAddressZip;
                    this.setState({
                        fedexReccomendedAddress: fedexReccomendedAddress,
                        address: this.props.values.shippingAddressL1,
                        address2: this.props.values.shippingAddressL2,
                        city: this.props.values.shippingAddressCity,
                        state: this.props.values.shippingAddressState,
                        zip: this.props.values.shippingAddressZip
                    });
                    this.acceptSuggesstedAddress();
                }else{
                    var fedexReccomendedAddress = this.props.values.shippingAddressL1 + " " + this.props.values.shippingAddressL2 + " " + this.props.values.shippingAddressCity + ", " + this.props.values.shippingAddressState + " " + this.props.values.shippingAddressZip;
                    this.setState({
                        fedexReccomendedAddress: fedexReccomendedAddress,
                        address: this.props.values.shippingAddressL1,
                        address2: this.props.values.shippingAddressL2,
                        city: this.props.values.shippingAddressCity,
                        state: this.props.values.shippingAddressState,
                        zip: this.props.values.shippingAddressZip
                    });
                    this.acceptSuggesstedAddress();
                }
            }
        });
    }
    handleSubmitLocal = e => {
        var valid =  this.props.handleSubmit(e);
        if (valid){
            this.continue(e)
        }
    }
    back = e => {
        e.preventDefault();
        this.props.prevStep();
    }
    handleChange = address => {
        this.setState({ address });
    };

    handleSelect = address => {
        const {handleAddressChange} = this.props;
        this.setState({address});
        handleAddressChange(address);
    };
    correctAddress = input =>{
        console.log(input+" selected ");
    }
    showRecommendedAddress = e =>{
        this.props.showAddressConfirmation();
    }
    hideRecommendedAddress = e =>{
        this.props.hideAddressConfirmation();
        this.props.handleSuccessfulSubmit();
    }
    enterManualAddress = e =>{
        this.props.showAddressBreakDown();
    }
    acceptSuggesstedAddress(){
        this.props.updateAddress(this.state.address,this.state.address2,this.state.city,this.state.state,this.state.zip,this.state.fedexReccomendedAddress);
        var data = {
            vid: this.props.values.vid,
            dealId: this.props.values.dealId,
            addressLine1: this.state.address,
            addressLine2: this.state.address2,
            city: this.state.city,
            state: this.state.state,
            zip: this.state.zip
        };
        axios.post("https://api2.hygeiahealth.com/api/v1/Form/Submit/ShippingAddress",data).then((response2) => {
            if(!response2.data.hasError){
                this.props.handleSuccessfulSubmit();
                this.props.nextStep();
            }else{
                //TODO SHOW ERROR
            }
        });
    }
    handleScriptLoad = () => {
        // Initialize Google Autocomplete
        /*global google*/ // To disable any eslint 'google not defined' errors
        this.autocomplete = new google.maps.places.Autocomplete(
            document.getElementById('autocomplete'),
        );

        // Avoid paying for data that you don't need by restricting the set of
        // place fields that are returned to just the address components and formatted
        // address.
        this.autocomplete.setFields(['address_components', 'formatted_address']);

        // Fire Event when a suggested name is selected
        this.autocomplete.addListener('place_changed', this.handlePlaceSelect);
    }
    handlePlaceSelect = () => {
        const {handleAddressChange} = this.props;
        const addressObject = this.autocomplete.getPlace();
        const address = addressObject.address_components;

        // Check if address is valid
        if (address) {
            var a = 0;
            var streetNumber = "";
            var street = "";
            var city = "";
            var state = "";
            var zip = "";
            console.log(address);
            address.forEach((element) =>{
                var type = element['types'][0];
                switch(type){
                    case "street_number":
                        streetNumber = element['long_name'];
                        break;
                    case "route":
                        street = element['long_name'];
                        break;
                    case "locality":
                        city = element['long_name'];
                        break;
                    case "administrative_area_level_1":
                        state = element['short_name'];
                        break;
                    case "postal_code":
                        zip = element['long_name'];
                        break;
                    default:
                        break;
                }
                a++;
                if(a === address.length){
                    handleAddressChange(streetNumber,street,city,state,zip);
                }
            });
        }
    }
    render() {
        const { values, handleChange, handleSelectChange, handleDismiss, handleSubmit, abbrToState} = this.props;
        const validationStep = 5;

        return (
            <div className={"wrapper-" + (values.domain !== "" ? values.domainStyle : '')}>
                <ProgressBar  now={values.progressPercent} />
                <div className="badge badge-primary progressBar-step"> Step {values.step} of 8</div>
                <div className={"submitting " + (this.props.values.submitting ? '': 'hidden')} >
                    <div>
                        <FontAwesomeIcon icon="circle-notch" className="green" size="10x" spin/>
                    </div>
                </div>

                <h1>Your Shipping Address <small>You're getting there! </small></h1>
                <Form onSubmit={this.handleSubmitLocal} noValidate>
                    <div  className={ (values.shippingAddressBreakDown ? 'd-none' : 'd-block' )} >
                        <Script
                            url="https://maps.googleapis.com/maps/api/js?key=AIzaSyCzt0w9R8o8yxujAS1hO3fgw4_JC0lqXIU&libraries=places"
                            onLoad={this.handleScriptLoad}
                        />
                        <Form.Group controlId="autocomplete">
                                <Form.Label>Search for Address</Form.Label>
                                <Form.Control
                                    name="autocomplete"
                                    type="text"
                                    placeholder="Search Shipping Address"
                                    size="sm"
                                />
                                <Form.Text className="text-muted">
                                    Type your Home Address and we'll confirm with you
                                </Form.Text>
                        </Form.Group>
                    </div>
                    <div className={ (values.shippingAddressBreakDown ? 'd-block' : 'd-none' )}>
                        <div>
                            <Form.Group controlId="shippingAddressL1">
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                    className={ values.formErrors[validationStep].shippingAddressL1.length > 0 ? "invalid" : ""}
                                    type="text"
                                    placeholder="Address"
                                    onChange = {handleChange('shippingAddressL1')}
                                    defaultValue = {values.shippingAddressL1}
                                    size="sm"
                                    name= "shippingAddressL1"
                                />
                                <Form.Text className="text-muted">
                                    Shipping Address
                                    {values.formErrors[validationStep].shippingAddressL1.length > 0 &&(
                                        <span className="errorMessage">
                                            {values.formErrors[validationStep].shippingAddressL1}
                                        </span>
                                    )}
                                </Form.Text>
                            </Form.Group>
                            <Form.Group controlId="shippingAddressL2">
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Address 2"
                                    onChange = {handleChange('shippingAddressL2')}
                                    defaultValue = {values.shippingAddressL2}
                                    size="sm"
                                    name="shippingAddressL2"
                                />
                                <Form.Text className="text-muted">
                                    Unit or Appartment Number

                                </Form.Text>
                            </Form.Group>
                            <Form.Group controlId="shippingAddressCity">
                                <Form.Label>City</Form.Label>
                                <Form.Control
                                    className={ values.formErrors[validationStep].shippingAddressCity.length > 0 ? "invalid" : ""}
                                    type="text"
                                    placeholder="City"
                                    onChange = {handleChange('shippingAddressCity')}
                                    defaultValue = {values.shippingAddressCity}
                                    size="sm"
                                    name="shippingAddressCity"
                                />
                                <Form.Text className="text-muted">
                                    City
                                    {values.formErrors[validationStep].shippingAddressCity.length > 0 &&(
                                            <span className="errorMessage">
                                                {values.formErrors[validationStep].shippingAddressCity}
                                            </span>
                                    )}
                                </Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formState">
                                <Form.Label>State</Form.Label>
                                <Select
                                    onChange= { handleSelectChange('shippingAddressState')}
                                    defaultInputValue = {abbrToState(values.shippingAddressState)}
                                    value = {{value: values.shippingAddressState, label: abbrToState(values.shippingAddressState)}}
                                    options = {stateOptions}
                                    placeholder = "Search your State of Residence"
                                    name="shippingAddressState"
                                    className='react-select-container'
                                    classNamePrefix="react-select"
                                />
                                <Form.Text className="text-muted">
                                Your State of Residence
                                </Form.Text>
                            </Form.Group>
                            <Form.Group controlId="shippingAddressZip">
                                <Form.Label>Zip Code</Form.Label>
                                <Form.Control
                                    className={ values.formErrors[validationStep].shippingAddressZip.length > 0 ? "invalid" : ""}
                                    type="text"
                                    placeholder="Zip Code"
                                    onChange = {handleChange('shippingAddressZip')}
                                    defaultValue = {values.shippingAddressZip}
                                    size="sm"
                                    name="shippingAddressZip"
                                />
                                <Form.Text className="text-muted">
                                    Zip Code
                                    {values.formErrors[validationStep].shippingAddressZip.length > 0 &&(
                                            <span className="errorMessage">
                                                {values.formErrors[validationStep].shippingAddressZip}
                                            </span>
                                    )}
                                </Form.Text>
                            </Form.Group>
                        </div>
                    </div>
                    <Row>
                        <Button variant="link" size="sm" className="float-left" onClick={this.enterManualAddress}>
                            {(values.shippingAddressBreakDown ? "Not your address? Lookup address again " : "Enter Address Manually")}
                        </Button>
                    </Row>
                    <Row>
                        <Modal show={values.shippingAddressLookupConfirmation}>
                            <Modal.Header >
                                <Modal.Title>Address Question</Modal.Title>
                                <button type="button" className="close" onClick={this.hideRecommendedAddress}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </Modal.Header>
                            <Modal.Body>
                                <p dangerouslySetInnerHTML={{__html: this.state.fedexMessage}}></p>
                                <p>{this.state.fedexReccomendedAddress}</p>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={this.hideRecommendedAddress}>
                                    Edit your Address
                                </Button>
                                <Button variant="primary" onClick={this.acceptSuggesstedAddress} className={(this.state.showAddressContinue ? '' : 'hidden')}>
                                    Yes, This Address is Correct
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </Row>
                    {/* <Row>
                        <Col>
                        {(values.shippingAddressLookupString !== "" && lookupResults.length > 0) &&
                            <div>
                                <h6>Address Recommendations</h6>
                                <ListGroup defaultActiveKey="#link1">
                                {lookupResults.map((item, key) =>
                                    <ListGroup.Item id={key} key={key} action onClick={this.correctAddress(item.value)}>
                                        {item.value}
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                            </div>
                        }
                        </Col>
                    </Row> */}
                    <Row>
                        <Col className="text-right  border-top pt-3 pb-3">
                            {/*<Button variant="default" type="button" disabled>
                                    Previous
                            </Button>*/}
                            <Button variant="primary" type="submit" disabled={(!values.shippingAddressLookupString) || (!values.shippingAddressL1 || !values.shippingAddressCity || !values.shippingAddressState || !values.shippingAddressZip ) }>
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

export default FormAddressLookup
