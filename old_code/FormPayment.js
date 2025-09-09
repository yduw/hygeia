import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Alert from 'react-bootstrap/Alert';

export class FormPayment extends Component {
    continue = e => {
        e.preventDefault();
        this.props.nextStep();
    }
    back = e => { 
        e.preventDefault();
        this.props.prevStep();
    }
    render() {
        const { values, handleChange } = this.props;

        return (
            <div className={"wrapper-" + (values.domain !== "" ? values.domainStyle : '')}>
                <ProgressBar  now={values.progressPercent} /> 
                <div className="badge badge-primary progressBar-step"> Step {values.step} of 8</div>
                <Alert variant="danger"  show={values.apiError}>
                    <Alert.Heading>Error: </Alert.Heading>
                    <p>{values.apiErrorMessage}</p>
                </Alert>

                <h1>Payment</h1>
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

            </div>
        )
    }
}

export default FormPayment
