import React, { Component } from 'react';
import Figure from 'react-bootstrap/Figure';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';

export class FormOrderAccesories extends Component {
    continue = e => {
        e.preventDefault();
        this.props.nextStep();
    }
    skip = () => {                
        this.props.nextStep();
    }

    render() {
        const { values, handleChange } = this.props;
        return (
            <div className={"wrapper-" + (values.domain !== "" ? values.domainStyle : '')}>
                <ProgressBar  now={values.progressPercent} /> 
                <div className="badge badge-primary progressBar-step"> Step {values.step} of 8</div>
                <h1>Select Accesories to Include</h1>
                <Row className={ "align-items-center " + (values.accesorySelection==='1' ? 'selected' : '')}>
                    <Col xs={8} className="figureContainer">
                        <Figure>
                            <Figure.Image
                                width={171}
                                height={180}
                                alt="171x180"
                                src="holder.js/171x180"
                            />
                            <Figure.Caption>
                                Hygeia Hospital-grade Pump
                            </Figure.Caption>
                        </Figure>
                    </Col>
                    <Col xs={4}>
                        <Button 
                                value={1}
                                name="accesorySelection"
                                variant="primary"                            
                                onClick = {handleChange('accesorySelection')}
                                >
                            $29 Accesory Set</Button>       
                    </Col>
                </Row>
                <Row className={ "align-items-center " + (values.accesorySelection==='2' ? 'selected' : '')}>
                    <Col xs={8} className="figureContainer">
                        <Figure>
                            <Figure.Image
                                width={171}
                                height={180}
                                alt="171x180"
                                src="holder.js/171x180"
                            />
                            <Figure.Caption>
                                Hygeia Hospital-grade Pump
                            </Figure.Caption>
                        </Figure>
                    </Col>
                    <Col xs={4}>
                            <Button 
                                value={2}
                                name="accesorySelection"
                                variant="primary"                            
                                onClick = {handleChange('accesorySelection')}
                                >
                            $29 Accesory Set</Button>     
                    </Col>
                </Row>
                <Row className={ "align-items-center " +  (values.accesorySelection==='3' ? 'selected' : '')}>
                    <Col xs={8} className="figureContainer">
                        <Figure>
                            <Figure.Image
                                width={171}
                                height={180}
                                alt="171x180"
                                src="holder.js/171x180"
                            />
                            <Figure.Caption>
                                Hygeia Hospital-grade Pump
                            </Figure.Caption>
                        </Figure>
                    </Col>
                    <Col xs={4}>
                        <Button 
                            value={3}
                            name="accesorySelection"
                            variant="primary"                            
                            onClick = {handleChange('accesorySelection')}
                            >
                        $29 Accesory Set</Button>     
                    </Col>
                </Row>
                <Row>
                    <Col className="text-right  border-top pt-3 pb-3"> 
                        <Button  name="accesorySelection" value={0} variant="default" type="button" onClick={this.skip}> 
                                No Thank You 
                        </Button>
                        <Button type="button" onClick={this.continue} disabled={values.accesorySelection === 0}>
                            Complete My Order
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

export default FormOrderAccesories
