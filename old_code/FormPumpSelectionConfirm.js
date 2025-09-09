import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HygeiaPump from '../assets/images/Hygeia_Express.png';
import AmedaMyaJoy from '../assets/images/Ameda_Mya_Joy.jpg';
import ElvieStride from '../assets/images/Elvie-Stride-alternate-photo.png';
import MomcozyM5 from '../assets/images/MomcozyM5.jpg';
import MomcozyS12Pro from '../assets/images/MomcozyS12Pro.jpg';
import SpectraSynergyGold from '../assets/images/Spectra_Synergy_Gold.jpg';
import SpectraSynergyGoldPortStandard from '../assets/images/Spectra Synergy Gold, Portable with standard flanges.jpg';
import SpectraSynergyGoldPortWearable from '../assets/images/Spectra Synergy Gold, Portable with wearable flanges.jpg';
import WillowGo from '../assets/images/Willow Go.jpg';
import SpectraPumps1 from '../assets/images/SpectraS1.png';
import SpectraPumps2 from '../assets/images/spectra_s2.jpeg';
import MedelaPump from '../assets/images/medela-maxflow.png';
import axios from 'axios';
import StripeCheckout from 'react-stripe-checkout';
import Alert from 'react-bootstrap/Alert';


export class FormPumpSelectionConfirm extends Component {
    constructor(){
        super();
        this.state = {
            isLoading: false
        };
        this.continue = this.continue.bind(this);
        this.processMedelaPump = this.processMedelaPump.bind(this);
        this.processHygeiaPumpSelection = this.processHygeiaPumpSelection.bind(this);
        this.processFreeAmeda = this.processFreeAmeda.bind(this);
        this.processElvieStridePurchase = this.processElvieStridePurchase.bind(this);
        this.processMomcozyM5Purchase = this.processMomcozyM5Purchase.bind(this);
        this.processMomcozyS12ProPurchase = this.processMomcozyS12ProPurchase.bind(this);
        this.processSpectraS1Purchase = this.processSpectraS1Purchase.bind(this);
        this.processSpectraS2Purchase = this.processSpectraS2Purchase.bind(this);
        this.processSpectraSynergyGoldPurchase = this.processSpectraSynergyGoldPurchase.bind(this);
        this.processSpectraSynergyGoldPortStandardPurchase = this.processSpectraSynergyGoldPortStandardPurchase.bind(this);
        this.processSpectraSynergyGoldPortWearablePurchase = this.processSpectraSynergyGoldPortWearablePurchase.bind(this);
        this.processWillowGoPurchase = this.processWillowGoPurchase.bind(this);
        this.processPayment = this.processPayment.bind(this);
        this.back = this.back.bind(this);
    }
    
    // Pump option data
    getPumpOptions = () => {
        return [
            // Free options (first 2)
            {
                id: 1,
                title: "Hygeia Express",
                image: HygeiaPump,
                price: "FREE",
                isFree: true,
                action: this.processHygeiaPumpSelection,
                description: "Hospital-grade pump"
            },
            {
                id: 2,
                title: "Ameda Mya Joy",
                image: AmedaMyaJoy,
                price: "FREE",
                isFree: true,
                action: this.processFreeAmeda,
                description: "Personal use pump"
            },
            {
                id: 3,
                title: "Elvie Stride",
                image: ElvieStride,
                price: "$60",
                amount: 6000,
                stripeAction: this.processElvieStridePurchase,
                description: "Personal use pump"
            },
            {
                id: 4,
                title: "Medela MaxFlow",
                image: MedelaPump,
                price: "$39",
                amount: 3900,
                stripeAction: this.processMedelaPump,
                description: "Personal use pump"
            },
            {
                id: 5,
                title: "Momcozy M5",
                image: MomcozyM5,
                price: "$60",
                amount: 6000,
                stripeAction: this.processMomcozyM5Purchase,
                description: "Personal use with battery"
            },
            {
                id: 6,
                title: "Momcozy S12 Pro",
                image: MomcozyS12Pro,
                price: "$30",
                amount: 3000,
                stripeAction: this.processMomcozyS12ProPurchase,
                description: "Compact personal pump"
            },
            {
                id: 7,
                title: "Spectra S1",
                image: SpectraPumps1,
                price: "$100",
                amount: 10000,
                stripeAction: this.processSpectraS1Purchase,
                description: "Professional grade pump"
            },
            {
                id: 8,
                title: "Spectra S2",
                image: SpectraPumps2,
                price: "$29",
                amount: 2900,
                stripeAction: this.processSpectraS2Purchase,
                description: "Hands-free wearable pump"
            },
            {
                id: 9,
                title: "Spectra Synergy Gold",
                image: SpectraSynergyGold,
                price: "$130",
                amount: 13000,
                stripeAction: this.processSpectraSynergyGoldPurchase,
                description: "Alternative Medela option"
            },
            {
                id: 10,
                title: "Spectra Synergy Gold, Portable with standard flange",
                image: SpectraSynergyGoldPortStandard,
                price: "$155",
                amount: 15500,
                stripeAction: this.processSpectraSynergyGoldPortStandardPurchase,
                description: "Personal use pump"
            },
            {
                id: 11,
                title: "Spectra Synergy Gold, Portable with wearable flanges",
                image: SpectraSynergyGoldPortWearable,
                price: "$170",
                amount: 17000,
                stripeAction: this.processSpectraSynergyGoldPortWearablePurchase,
                description: "Personal use pump"
            },
            {
                id: 12,
                title: "Willow Go",
                image: WillowGo,
                price: "$290",
                amount: 29000,
                stripeAction: this.processWillowGoPurchase,
                description: "Premium wearable pump"
            }
        ];
    }

    processHygeiaPumpSelection = e =>{
        e.preventDefault();
        this.setState({ isLoading: true });
        var pumpSelection = "Hygeia";
        var data = {
            vid: this.props.values.vid,
            dealId: this.props.values.dealId,
            pump: pumpSelection,
            doctorMike: this.props.values.includeCourse
        };
        axios.post("https://api2.hygeiahealth.com/api/v1/Form/Submit/ConfirmHygeia",data).then((response) => {
            this.setState({ isLoading: false });
            if(!response.data.hasError){
                this.props.values.vid = response.data.vid;
                this.props.values.dealId = response.data.dealId;
                this.props.handleSuccessfulSubmit();
                this.props.nextStep();
            }else{
                //TODO: HANDLE API ERRORS
            }
        }).catch((err) => {
            this.setState({ isLoading: false });
            console.log(err);
        });
    }
    
    processFreeAmeda = e => {
        e.preventDefault();
        this.setState({ isLoading: true });
        var pumpSelection = "ameda-mya-joy";
        var data = {
            vid: this.props.values.vid,
            dealId: this.props.values.dealId,
            pump: pumpSelection,
            doctorMike: this.props.values.includeCourse
        };
        axios.post("https://api2.hygeiahealth.com/api/v1/Form/Submit/ConfirmHygeia",data).then((response) => {
            this.setState({ isLoading: false });
            if(!response.data.hasError){
                this.props.values.vid = response.data.vid;
                this.props.values.dealId = response.data.dealId;
                this.props.handleSuccessfulSubmit();
                this.props.nextStep();
            }else{
                //TODO: HANDLE API ERRORS
            }
        }).catch((err) => {
            this.setState({ isLoading: false });
            console.log(err);
        });
    }

    // Additional payment processors for new pumps
    processElvieStridePurchase = (token) => {
        this.processPayment(token, 6000, "elvie-stride");
    }

    processMedelaPump = (token) => {
        this.processPayment(token, 3900, "medela-maxflow");
    }

    processMomcozyM5Purchase = (token) => {
        this.processPayment(token, 6000, "momcozy-m5");
    }

    processMomcozyS12ProPurchase = (token) => {
        this.processPayment(token, 3000, "momcozy-s12-pro");
    }

    processSpectraS1Purchase = (token) => {
        this.processPayment(token, 10000, "spectra-s1");
    }

    processSpectraS2Purchase = (token) => {
        this.processPayment(token, 2900, "spectra-s2");
    }

    processSpectraSynergyGoldPurchase = (token) => {
        this.processPayment(token, 13000, "spectra-synergy-gold");
    }

    processSpectraSynergyGoldPortStandardPurchase = (token) => {
        this.processPayment(token, 15500, "spectra-synergy-gold-port-standard");
    }

    processSpectraSynergyGoldPortWearablePurchase = (token) => {
        this.processPayment(token, 17000, "spectra-synergy-gold-port-wearable");
    }

    processWillowGoPurchase = (token) => {
        this.processPayment(token, 29000, "willow-go");
    }

    processPayment = (token, amount, pumpType) => {
        this.setState({ isLoading: true });
        var stripeToken = token.id;
        var data = {
            vid: this.props.values.vid,
            dealId: this.props.values.dealId,
            token: stripeToken,
            amount: amount,
            pumpType: pumpType
        };
        
        axios.post("https://api2.hygeiahealth.com/api/v1/Form/Payments/PumpPurchase",data).then((response) => {
            this.setState({ isLoading: false });
            console.log(response);
            if(!response.data.hasError){
                this.props.nextStep();
            }else{
                //TODO: HANDLE API ERRORS
            }
        }).catch((err) => {
            this.setState({ isLoading: false });
            console.log(err);
        });
    }

    continue = e => {
        e.preventDefault();
        var pumpSelection = "Other";
        if(this.props.values.chooseHygeia){
            pumpSelection = "Hygeia";
        }
        if(this.props.values.chooseOtherSelection === "Ameda"){
            pumpSelection = "ameda-mya-joy";
        }
        var data = {
            vid: this.props.values.vid,
            dealId: this.props.values.dealId,
            pump: pumpSelection,
            doctorMike: this.props.values.includeCourse
        };
        axios.post("https://api2.hygeiahealth.com/api/v1/Form/Submit/ConfirmHygeia",data).then((response) => {
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
        const { values, handleDismiss } = this.props;
        const pumpOptions = this.getPumpOptions();
        
        return (
            <div className={"wrapper-" + (values.domain !== "" ? values.domainStyle : '')}>
                <ProgressBar  now={values.progressPercent} /> 
                <div className="badge badge-primary progressBar-step"> Step {values.step} of 8</div>
                <div className={"submitting " + (this.props.values.submitting || this.state.isLoading ? '': 'hidden')} >
                    <div>
                        <FontAwesomeIcon icon="circle-notch" className="green" size="10x" spin/>
                    </div>
                </div>
                <h1>Choose Your Breast Pump
                    <small className="d-block">Select from our available pump options</small>
                </h1>
                
                <Container fluid className="pump-selection-grid" style={{maxWidth: '1400px'}}>
                    <Row>
                        {pumpOptions.map((pump, index) => (
                            <Col lg={3} md={4} sm={6} xs={12} key={pump.id} className="mb-4">
                                <Card className="h-100 pump-card">
                                    <Card.Body className="d-flex flex-column text-center">
                                        <Card.Title as="h5">{pump.title}</Card.Title>
                                        <div className="pump-image-container mb-3" style={{height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                            <img 
                                                src={pump.image} 
                                                alt={pump.title}
                                                className="img-fluid"
                                                style={{maxHeight: '180px', maxWidth: '100%', objectFit: 'contain'}}
                                            />
                                        </div>
                                        <div className="mt-auto">
                                            {pump.isFree ? (
                                                <Button 
                                                    variant={pump.title.toLowerCase().includes('hygeia') ? 'success' : 'primary'}
                                                    size="lg"
                                                    onClick={pump.action}
                                                    block
                                                    className="font-weight-bold"
                                                    disabled={this.state.isLoading}
                                                >
                                                    {this.state.isLoading ? 'Processing...' : 'FREE'}
                                                </Button>
                                            ) : (
                                                <StripeCheckout
                                                    name={values.domainName}
                                                    description={pump.title}
                                                    label={`${pump.price}`}
                                                    image="https://hygeiahealth.com/wp-content/uploads/2024/04/hg-logo.png"
                                                    panelLabel={`Purchase ${pump.title} ${pump.price}`}
                                                    amount={pump.amount}
                                                    currency="USD"
                                                    //stripeKey="pk_test_LX9EmXwSegO2Y9rDA3yp6xsX"
                                                    stripeKey="pk_live_XZ7rBghf4y1yRmU5rhISIaZi"
                                                    token={pump.stripeAction}
                                                    disabled={this.state.isLoading}
                                                >
                                                    <Button 
                                                        variant="primary"
                                                        size="lg"
                                                        block
                                                        disabled={this.state.isLoading}
                                                    >
                                                        {this.state.isLoading ? 'Processing...' : pump.price}
                                                    </Button>
                                                </StripeCheckout>
                                            )}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>

                <Row>
                    <Col className="text-right border-top pt-3 pb-3 col"> 
                        <Button variant="default" type="button" onClick={this.back}>
                                Previous 
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

export default FormPumpSelectionConfirm
