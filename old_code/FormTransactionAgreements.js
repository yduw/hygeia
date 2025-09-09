import React, { Component } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from "react-bootstrap/Modal";

export class FormTransactionAgreements extends Component {
    continue = e => {
        e.preventDefault();

        var valid = this.props.handleSubmit(e);

        if (valid) {
            var data = {
                vid: this.props.values.vid,
                dealId: this.props.values.dealId,
                placingOrder: this.props.values.placingOrderAgreement,
                pasAgreement: this.props.values.pasAgreement,
                pumpAuthorization: this.props.values.pumpAuthorizationAgreement
            };
            axios.post("https://api2.hygeiahealth.com/api/v1/Form/Submit/Agreements", data).then((result) => {
                this.props.handleSuccessfulSubmit();

                if(result.data.hasError && result.data.errorMessage === "Dupe"){
                    this.props.displayDupeModal();
                }else{
                    if(this.props.values.domain === "https://form.abreastpumpandmore.com" && (this.props.values.leadSource === 'Google' || this.props.values.leadSource === 'Facebook')){
                        window.location.href = "https://moms.abreastpumpandmore.com/success-upload/?id="+this.props.values.vid;
                    }else if(this.props.values.domain === "https://form.abreastpumpandmore.com"){
                        window.location.href = "https://abreastpumpandmore.com/success-upload/?id="+this.props.values.vid;
                    }else if(this.props.values.domain === "https://form.momsgetmore.com"){
                        window.location.href = "https://momsgetmore.com/success-upload/?id="+this.props.values.vid;
                    }else{
                        window.location.href = "https://www.hygeiahealth.com/success-upload/?id="+this.props.values.vid;
                    }
                }
            });
        }
    }
    render() {
        const { values, handleChange, handleDismiss } = this.props;
        const AgreementAText = `We need you to approve we can ship you a pump and accessories after your insurance company approves. Under Women’s Preventive Services you will not have any cost sharing as long as your health insurance is in good standing on the date delivered. I also agree to the <a link target="_blank" href="https://www.hygeiahealth.com/support/return-policy/">Return Policy</a>, <a link target="_blank" href="https://www.hygeiahealth.com/assignment-of-benefits/">Assignment of Benefits</a>, <a link target="_blank" href="https://www.hygeiahealth.com/payor-rules/">Payor Specific Rules</a>, <a link target="_blank" href="https://www.hygeiahealth.com/hipaa/">HIPAA Statement</a>, <a link target="_blank" href="https://www.hygeiahealth.com/authorization-for-release-of-information/">Release of Information</a> and <a link target="_blank" href="https://www.hygeiahealth.com/medicare-dmepos-supplier-standards/">Supplier Standard</a>`;
        const AgreementA = ` By clicking this button, I formally acknowledge I am placing an order to have a Hygeia breast pump and supplies shipped to my address, upon approval by my insurance carrier and I agree to the return policies linked above. I acknowledge this is an order not a request for information.`;
        const AgreementBText = `Many times insurance companies will cover free collection cups and accessories in addition to your pump, but we need your authorization to check.`;
        const AgreementB = `By clicking this button, I formally acknowledge I am placing an order to have additional accessories shipped to my address, if they are covered by my insurance. (<a link target="_blank" href="https://www.hygeiahealth.com/accessories-explanation/">Click here for more details</a>).`;
        const AgreementCText = `Many insurances allow you to only request a single pump. We need your authorization that you have not ordered or received a pump from another provider.`;
        const AgreementC = `I acknowledge I have not ordered or received a breast pump from another provider and could be financially responsible if I have taken this action.`;

        return (
            <div className={"wrapper-" + (values.domain !== "" ? values.domainStyle : '')}>
                <ProgressBar now={values.progressPercent} />
                <div className="badge badge-primary progressBar-step"> Step {values.step} of 8</div>
                <div className={"submitting " + (this.props.values.submitting ? '' : 'hidden')} >
                    <div>
                        <FontAwesomeIcon icon="circle-notch" className="green" size="10x" spin />
                    </div>
                </div>
                <h1>Agreements</h1>
                <Row>
                    <Col xs="12">
                        <Card className="agreement agreement-A">
                            <Card.Body><span dangerouslySetInnerHTML={{ __html: AgreementAText }}></span></Card.Body>
                        </Card>
                        <Form>
                            <Form.Check
                                name="agreementA"
                                type="switch"
                                id="agreementA"
                                label={<span dangerouslySetInnerHTML={{ __html: AgreementA }}></span>}
                                onChange={handleChange('placingOrderAgreement')}
                                defaultValue={values.placingOrderAgreement}
                                defaultChecked={values.placingOrderAgreement}
                            />
                        </Form>
                    </Col>
                    <Col xs="12">
                        <Card className="agreement agreement-B">
                            <Card.Body><span dangerouslySetInnerHTML={{ __html: AgreementBText }}></span></Card.Body>
                        </Card>
                        <Form>
                            <Form.Check
                                name="agreementB"
                                type="switch"
                                id="agreementB"
                                label={<span dangerouslySetInnerHTML={{ __html: AgreementB }}></span>}
                                onChange={handleChange('pasAgreement')}
                                defaultValue={values.pasAgreement}
                                defaultChecked={values.pasAgreement}
                            />
                        </Form>
                    </Col>
                    <Col xs="12">
                        <Card className="agreement agreement-C">
                            <Card.Body>{<span dangerouslySetInnerHTML={{ __html: AgreementCText }}></span>}</Card.Body>
                        </Card>
                        <Form>
                            <Form.Check
                                name="agreementC"
                                type="switch"
                                id="agreementC"
                                label={<span dangerouslySetInnerHTML={{ __html: AgreementC }}></span>}
                                onChange={handleChange('pumpAuthorizationAgreement')}
                                defaultValue={values.pumpAuthorizationAgreement}
                                defaultChecked={values.pumpAuthorizationAgreement}
                            />
                        </Form>
                    </Col>
                </Row>
                <Row>
                    <Col className="text-right  border-top pt-3 pb-3">
                        <Button variant="primary" type="button" onClick={this.continue} disabled={(!values.placingOrderAgreement || !values.pasAgreement || !values.pumpAuthorizationAgreement)}>
                            Finish
                        </Button>

                    </Col>
                </Row>
                <Alert variant="danger" show={values.apiError}>
                    <button type="button" className="close" onClick={handleDismiss}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <span>{values.apiErrorMessage}</span>
                </Alert>
                <Modal show={values.showDupeOrderModal} backdrop="static" onHide={this.props.hideDupeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Existing Order</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>The order could not be submitted because an order has already been found in our system.</p>
                        <p>Please go to <a href='https://status.hygeiahealth.com' target='_blank'>https://status.hygeiahealth.com</a> to track this existing order.</p>
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}

export default FormTransactionAgreements
