import React, { Component } from 'react'

export class Success extends Component {
    state = {
        step: 1,
        dueDate: '',
        stateResidence: '',
        email: '',
        phone: '',
        insuranceProvider: '',
        firstName: '',
        lastName: '',
        memberID: '',
        chooseHygeia: false,
        hasPAS: false,
        accesorySelection: 0, 
        paymentEmail: '',
        paymentCreditCard: '',
        paymentExpDate: '',
        paymentCVC: '',
        shippingAddressL1: '',
        shippingAddressL2: '',
        shippingAddressCity: '',
        shippingAddressState: '',
        gynFirstName: '',
        gynLastName: '',
        gynPhoneNumber: '',
        agreementA: false,
        agreementB: false,
        agreementC: false
    }

    //next step GO
    nextStep = () => {
        const { step } = this.state;
        this.setState({
            step: step + 1
        });
    }
    //prev step GO
    prevStep = () => {
        const { step } = this.state;
        this.setState({
            step: step - 1
        });
    }
    //Handle Field Change
    handleChange = input =>  e => {
        this.setState ({[input]: e.target.value});
    }

    

        switch(step){
            case 1:
                return(
                    <InsuranceLookup
                        nextStep={ this.nextStep}
                        handleChange= {this.handleChange}
                        values={values}
                    />
                );
            case 2:
                return(
                    <h1>FormInsurance Info</h1>
                );
        }
        return (
            <div>
                
            </div>
        )
    }
}

export default Success
