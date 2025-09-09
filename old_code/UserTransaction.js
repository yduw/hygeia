import React, { Component } from 'react';
import axios from 'axios';
import FormUserDetails from './FormUserDetails';
import FormInsuranceLookup from './FormInsuranceLookup';
import FormInsuranceInfo from './FormInsuranceInfo';
import FormPumpSelection from './FormPumpSelection';
import FormPumpSelectionConfirm from './FormPumpSelectionConfirm';
import FormAddressLookup from './FormAddressLookup';
import FormOBInfo from './FormOBInfo';
import FormTransactionAgreements from './FormTransactionAgreements';
import moment from 'moment';
import validator from 'validator';

const formValid = ErrorList =>  {
    //receives the section of the error string array for the current step and checks if it's empty
    let valid = true;
    Object.values(ErrorList).forEach( val => {
        val.length > 0 && (valid = false)
    });
    return valid;
}
const emailRegex = RegExp(
    /^[a-z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-z0-9]@[a-z0-9][-\.]{0,1}([a-z][-\.]{0,1})*[a-z0-9]\.[a-z0-9]{1,}([\.\-]{0,1}[a-z]){0,}[a-z0-9]{0,}$/
);
const zipRegex = RegExp(
    /^[0-9]{5}(?:-[0-9]{4})?$/
);
const inFuture = (date) => {
    var today = new Date();
    var checkDate = new Date(date);
    today.setDate(today.getDate() - 366);
    var result = false;
    if(today < checkDate){
        result = true;
    }
    return result;
};

const lessThanOneYear = (date) => {
    var nextYear = new Date();
    var checkDate = new Date(date);
    nextYear.setDate(nextYear.getDate() + 365);
    var result = false;
    if(nextYear > checkDate){
        result = true;
    }
    return result;
};
const domainStyle = (domain) =>{
    var style = "";   
    switch(domain){
        case "http://localhost:3000":
            style = "style3";
        break;
        case "https://form.moms.abreastpumpandmore.com":
            style = "style1";
        break;
        case "https://form.abreastpumpandmore.com":
            style = "style1";
        break;
        case "https://form.hygeiahealth.com":
            style = "style2";
        break;
        case "https://form.momsgetmore.com":
            style = "style3";
        break;
        default:
            style = "style2";
        break;
    }
    return style;
};
const favIcon = document.getElementById('siteFavico');
const faviconSet = (globalClass) =>{
    switch(globalClass){
        case "style1":
            favIcon.href = 'favicon1.png';
        break;
        case "style2":
            favIcon.href = 'favicon2.ico';
        break;
        case "style3":
            favIcon.href = 'favicon3.ico';
        break;
        default:
            favIcon.href = 'favicon.ico';
        break;
    }
}

const stateBuffer = [
    {
        "value": "Alabama",
        "label": "Alabama - AL",
        "abbreviation": "AL"
    },
    {
        "value": "Alaska",
        "label": "Alaska - AK",
        "abbreviation": "AK"
    },
    {
        "value": "American Samoa",
        "label": "American Samoa - AS",
        "abbreviation": "AS"
    },
    {
        "value": "Arizona",
        "label": "Arizona - AZ",
        "abbreviation": "AZ"
    },
    {
        "value": "Arkansas",
        "label": "Arkansas - AR",
        "abbreviation": "AR"
    },
    {
        "value": "California",
        "label": "California - CA",
        "abbreviation": "CA"
    },
    {
        "value": "Colorado",
        "label": "Colorado - CO",
        "abbreviation": "CO"
    },
    {
        "value": "Connecticut",
        "label": "Connecticut - CT",
        "abbreviation": "CT"
    },
    {
        "value": "Delaware",
        "label": "Delaware - DE",
        "abbreviation": "DE"
    },
    {
        "value": "District Of Columbia",
        "label": "District Of Columbia - DC",
        "abbreviation": "DC"
    },
    {
        "value": "Federated States Of Micronesia",
        "label": "Federated States Of Micronesia - FM",
        "abbreviation": "FM"
    },
    {
        "value": "Florida",
        "label": "Florida - FL",
        "abbreviation": "FL"
    },
    {
        "value": "Georgia",
        "label": "Georgia - GA",
        "abbreviation": "GA"
    },
    {
        "value": "Guam",
        "label": "Guam - GU",
        "abbreviation": "GU"
    },
    {
        "value": "Hawaii",
        "label": "Hawaii - HI",
        "abbreviation": "HI"
    },
    {
        "value": "Idaho",
        "label": "Idaho - ID",
        "abbreviation": "ID"
    },
    {
        "value": "Illinois",
        "label": "Illinois - IL",
        "abbreviation": "IL"
    },
    {
        "value": "Indiana",
        "label": "Indiana - IN",
        "abbreviation": "IN"
    },
    {
        "value": "Iowa",
        "label": "Iowa - IA",
        "abbreviation": "IA"
    },
    {
        "value": "Kansas",
        "label": "Kansas - KS",
        "abbreviation": "KS"
    },
    {
        "value": "Kentucky",
        "label": "Kentucky - KY",
        "abbreviation": "KY"
    },
    {
        "value": "Louisiana",
        "label": "Louisiana - LA",
        "abbreviation": "LA"
    },
    {
        "value": "Maine",
        "label": "Maine - ME",
        "abbreviation": "ME"
    },
    {
        "value": "Marshall Islands",
        "label": "Marshall Islands - MH",
        "abbreviation": "MH"
    },
    {
        "value": "Maryland",
        "label": "Maryland - MD",
        "abbreviation": "MD"
    },
    {
        "value": "Massachusetts",
        "label": "Massachusetts - MA",
        "abbreviation": "MA"
    },
    {
        "value": "Michigan",
        "label": "Michigan - MI",
        "abbreviation": "MI"
    },
    {
        "value": "Minnesota",
        "label": "Minnesota - MN",
        "abbreviation": "MN"
    },
    {
        "value": "Mississippi",
        "label": "Mississippi - MS",
        "abbreviation": "MS"
    },
    {
        "value": "Missouri",
        "label": "Missouri - MO",
        "abbreviation": "MO"
    },
    {
        "value": "Montana",
        "label": "Montana - MT",
        "abbreviation": "MT"
    },
    {
        "value": "Nebraska",
        "label": "Nebraska - NE",
        "abbreviation": "NE"
    },
    {
        "value": "Nevada",
        "label": "Nevada - NV",
        "abbreviation": "NV"
    },
    {
        "value": "New Hampshire",
        "label": "New Hampshire - NH",
        "abbreviation": "NH"
    },
    {
        "value": "New Jersey",
        "label": "New Jersey - NJ",
        "abbreviation": "NJ"
    },
    {
        "value": "New Mexico",
        "label": "New Mexico - NM",
        "abbreviation": "NM"
    },
    {
        "value": "New York",
        "label": "New York - NY",
        "abbreviation": "NY"
    },
    {
        "value": "North Carolina",
        "label": "North Carolina - NC",
        "abbreviation": "NC"
    },
    {
        "value": "North Dakota",
        "label": "North Dakota - ND",
        "abbreviation": "ND"
    },
    {
        "value": "Northern Mariana Islands",
        "label": "Northern Mariana Islands - MP",
        "abbreviation": "MP"
    },
    {
        "value": "Ohio",
        "label": "Ohio - OH",
        "abbreviation": "OH"
    },
    {
        "value": "Oklahoma",
        "label": "Oklahoma - OK",
        "abbreviation": "OK"
    },
    {
        "value": "Oregon",
        "label": "Oregon - OR",
        "abbreviation": "OR"
    },
    {
        "value": "Palau",
        "label": "Palau - PW",
        "abbreviation": "PW"
    },
    {
        "value": "Pennsylvania",
        "label": "Pennsylvania - PA",
        "abbreviation": "PA"
    },
    {
        "value": "Puerto Rico",
        "label": "Puerto Rico - PR",
        "abbreviation": "PR"
    },
    {
        "value": "Rhode Island",
        "label": "Rhode Island - RI",
        "abbreviation": "RI"
    },
    {
        "value": "South Carolina",
        "label": "South Carolina - SC",
        "abbreviation": "SC"
    },
    {
        "value": "South Dakota",
        "label": "South Dakota - SD",
        "abbreviation": "SD"
    },
    {
        "value": "Tennessee",
        "label": "Tennessee - TN",
        "abbreviation": "TN"
    },
    {
        "value": "Texas",
        "label": "Texas - TX",
        "abbreviation": "TX"
    },
    {
        "value": "Utah",
        "label": "Utah - UT",
        "abbreviation": "UT"
    },
    {
        "value": "Vermont",
        "label": "Vermont - VT",
        "abbreviation": "VT"
    },
    {
        "value": "Virgin Islands",
        "label": "Virgin Islands - VI",
        "abbreviation": "VI"
    },
    {
        "value": "Virginia",
        "label": "Virginia - VA",
        "abbreviation": "VA"
    },
    {
        "value": "Washington",
        "label": "Washington - WA",
        "abbreviation": "WA"
    },
    {
        "value": "West Virginia",
        "label": "West Virginia - WV",
        "abbreviation": "WV"
    },
    {
        "value": "Wisconsin",
        "label": "Wisconsin - WI",
        "abbreviation": "WI"
    },
    {
        "value": "Wyoming",
        "label": "Wyoming - WY",
        "abbreviation": "WY"
    }
];

export class UserTransaction extends Component {
    constructor(){
        super();
        this.getInsuranceProviders = this.getInsuranceProviders.bind(this);
        this.getInsuranceInformation = this.getInsuranceInformation.bind(this);
        this.handleAddressChange = this.handleAddressChange.bind(this);
        this.saveHubSpotIDs = this.saveHubSpotIDs.bind(this);
        this.updateAddress = this.updateAddress.bind(this);
        this.updateDoctor = this.updateDoctor.bind(this);
        this.populateLastStepUrl = this.populateLastStepUrl.bind(this);
        this.state = {
            loading: true,
            submitting: false,
            domain: "",
            domainStyle: "",
            leadSource: "",
            step: 1,
            dueDate: '',
            firstBaby: null,
            stateResidence: '',
            email: '',
            phone: '',
            prefferedCommunicationMethod: '',
            insuranceProvider: '',
            firstName: '',
            lastName: '',
            dobMonth: '',
            dobDay: '',
            dobYear: '',
            memberID: '',
            chooseHygeia: true,
            chooseAmedaFinesse: false,
            chooseOtherSelection: "Hygeia",
            includeCourse: true,
            hasPAS: false,
            accesorySelection: "0", 
            paymentEmail: '',
            paymentCreditCard: '',
            paymentExpDate: '',
            paymentCVC: '',
            shippingAddressLookupString: '',
            shippingAddressL1: '',
            shippingAddressL2: '',
            shippingAddressCity: '',
            shippingAddressState: '',
            shippingAddressBreakDown: false,
            shippingAddressLookupConfirmation: false,
            shippingAddressZip: '',
            gynFirstName: '',
            gynLastName: '',
            gynPhoneNumber: '',
            obGynLookupList: [
                {
                    firstName: "Wu",
                    lastName: "Yong",
                    location: "Los Angeles, Ca.",
                    phone: "1124561201"
                },
                {
                    firstName: "Monica",
                    lastName: "Yong",
                    location: "Los Angeles, Ca.",
                    phone: "3151198013"
                },
                {
                    firstName: "Zeng",
                    lastName: "Yong",
                    location: "Los Angeles, Ca.",
                    phone: "3010114188"
                }
            ],
            gynLookupConfirmation: false,
            placingOrderAgreement: true,
            pasAgreement: true,
            pumpAuthorizationAgreement: true,
            progressPercent: 10,
            insuranceProviders: [],
            vid: null,
            dealId: null,
            providerInformation: null,
            pasRule: null,
            domainName: "Hygeia Health",
            apiError: false,
            apiErrorMessage: "Error, Please Try again",
            formErrors: [
                { //FormUserDetails
                    dueDate: "",
                    stateResidence: "",
                    email: "",
                    phone: ""
                },
                { //FormInsuranceLookup
                    stateResidence: "",
                    insuranceProvider: ""
                },
                { //FormInsuranceInfo
                    firstName: "",
                    lastName: "",
                    memberID: ""
                },
                { //FormPumpSelection
                    chooseHygeia: ""
                },
                { //FormPumpSelectionConfirm
                    chooseOtherSelection: "",
                    includeCourse: ""
                },
                {
                    shippingAddressLookupString: "",
                    shippingAddressL1: "",
                    shippingAddressL2: "",
                    shippingAddressCity: "",
                    shippingAddressState: "",
                    shippingAddressZip: ""
                },
                {//FormOBInfo
                    gynFirstName: "",
                    gynLastName: "",
                    gynPhoneNumber: ""
                },
                {//FormTransactionAgreements
                    agreementA: "",
                    agreementB: "",
                    agreementC: ""
                }

            ],
            showExistingFormModal: false,
            showDupeOrderModal: false,
            lastStepUrl: null
        }
    }
    componentDidMount(){
        const domain = window.location.origin;
        const params = this.getParams(window.location);
        const globalClass = domainStyle(domain);
        faviconSet(globalClass);
        this.setState({
            domainStyle : globalClass
        });
        document.body.classList.add(globalClass);
        if(params.leadSource === null){
            switch(domain){
                case "https://form.abreastpumpandmore.com":
                    params.leadSource = "WWW";
                    break;
                case "https://form.moms.abreastpumpandmore.com":
                    params.leadSource = "Google";
                    break;
                case "https://form.momsgetmore.com":
                    params.leadSource = "Moms Get More";
                    break;
                default:
                    params.leadSource = "HH";
            }
        }
        if(params.contactId !== null && params.dealId !== null){
            var vid = params.contactId;
            vid = vid.split(" ").join("+");
            var dealId = params.dealId;
            dealId = dealId.split(" ").join("+");
            var data = {
                vid: vid,
                dealId: dealId
            };
            axios.post("https://api2.hygeiahealth.com/api/v1/Form/Chase/GetApplication",data).then((response) => {
                console.log(response.data);
                var appData = response.data;

                if(!appData.hasError){
                    var step = appData.deal.formStep + 1;

                    var firstBaby = null;
                    var dueDate = null;
                    var dueDateFormatted = null;
                    var email = null;
                    var phone = null;
                    var leadSource = null;
                    var dob = null;
                    var dobMonth = null;
                    var dobDay = null;
                    var dobYear = null;
                    var chooseHygeia = null;
                    var doctorMike = null;
                    var shippingAddressLookupString = null;

                    if(step === 2){
                        firstBaby = false;
                        if(appData.deal.firstChild === "True"){
                            firstBaby = true;
                        }
                        
                        dueDate = appData.deal.dueDate;
                        dueDate = parseInt(dueDate) / 1000;
                        dueDateFormatted = moment.unix(dueDate).format("MM/DD/YYYY");

                        phone = '';
                        email = '';

                        if(typeof appData.contact.phone !== "undefined"){
                            phone = appData.contact.phone;
                        }
						
                        if(typeof appData.contact.email !== "undefined"){
                            email = appData.contact.email;
                        }						

                        leadSource = params.leadSource;
                        if(appData.deal.leadSource){
                            leadSource = appData.deal.leadSource;
                        }

                        this.setState({
                            vid: vid,
                            dealId: dealId,
                            phone: phone,
                            email: email,
                            firstBaby: firstBaby,
                            dueDate: dueDateFormatted,
                            leadSource: leadSource,
                            prefferedCommunicationMethod: appData.contact.communicationPreference,
                            step: step,
                            domain: domain,                        
                            loading: false
                        });
                    }else if(step === 3){
                        firstBaby = false;
                        if(appData.deal.firstChild === "True"){
                            firstBaby = true;
                        }

                        dueDate = appData.deal.dueDate;
                        dueDate = parseInt(dueDate) / 1000;
                        dueDateFormatted = moment.unix(dueDate).format("MM/DD/YYYY");

                        phone = '';
                        email = '';

                        if(typeof appData.contact.phone !== "undefined"){
                            phone = appData.contact.phone;
                        }
						
                        if(typeof appData.contact.email !== "undefined"){
                            email = appData.contact.email;
                        }						

                        leadSource = params.leadSource;
                        if(appData.deal.leadSource){
                            leadSource = appData.deal.leadSource;
                        }

                        this.setState({
                            vid: vid,
                            dealId: dealId,
                            phone: phone,
                            email: email,
                            firstBaby: firstBaby,
                            dueDate: dueDateFormatted,
                            insuranceProvider: appData.deal.insurance,
                            stateResidence: appData.contact.state,
                            leadSource: leadSource,
                            prefferedCommunicationMethod: appData.contact.communicationPreference,
                            step: step,
                            domain: domain,
                            loading: false,
                        });
                    }else if(step === 4){
                        firstBaby = false;
                        if(appData.deal.firstChild === "True"){
                            firstBaby = true;
                        }

                        dueDate = appData.deal.dueDate;
                        dueDate = parseInt(dueDate) / 1000;
                        dueDateFormatted = moment.unix(dueDate).format("MM/DD/YYYY");

                        dob = appData.deal.expectedMothersDateOfBirth;
                        dob = parseInt(dob) / 1000;
                        dobMonth = moment.unix(dob).format("MM");
                        dobDay = moment.unix(dob).format("DD");
                        dobYear = moment.unix(dob).format("YYYY");

                        phone = '';
                        email = '';

                        if(typeof appData.contact.phone !== "undefined"){
                            phone = appData.contact.phone;
                        }
						
                        if(typeof appData.contact.email !== "undefined"){
                            email = appData.contact.email;
                        }						

                        leadSource = params.leadSource;
                        if(appData.deal.leadSource){
                            leadSource = appData.deal.leadSource;
                        }

                        this.setState({
                            vid: vid,
                            dealId: dealId,
                            phone: phone,
                            email: email,
                            firstBaby: firstBaby,
                            dueDate: dueDateFormatted,
                            insuranceProvider: appData.deal.insurance,
                            stateResidence: appData.contact.state,
                            firstName: appData.contact.firstName,
                            lastName: appData.contact.lastName,
                            dobMonth: dobMonth,
                            dobDay: dobDay,
                            dobYear: dobYear,
                            memberID: appData.deal.memberId,
                            leadSource: leadSource,
                            prefferedCommunicationMethod: appData.contact.communicationPreference,
                            step: step,
                            domain: domain,
                            loading: false
                        });
                    }else if(step === 5){
                        firstBaby = false;
                        if(appData.deal.firstChild === "True"){
                            firstBaby = true;
                        }

                        dueDate = appData.deal.dueDate;
                        dueDate = parseInt(dueDate) / 1000;
                        dueDateFormatted = moment.unix(dueDate).format("MM/DD/YYYY");

                        dob = appData.deal.expectedMothersDateOfBirth;
                        dob = parseInt(dob) / 1000;
                        dobMonth = moment.unix(dob).format("MM");
                        dobDay = moment.unix(dob).format("DD");
                        dobYear = moment.unix(dob).format("YYYY");

                        phone = '';
                        email = '';

                        if(typeof appData.contact.phone !== "undefined"){
                            phone = appData.contact.phone;
                        }
						
                        if(typeof appData.contact.email !== "undefined"){
                            email = appData.contact.email;
                        }						

                        leadSource = params.leadSource;
                        if(appData.deal.leadSource){
                            leadSource = appData.deal.leadSource;
                        }

                        chooseHygeia = false;
                        if(appData.deal.breastPumpBrand === "Hygeia"){
                            chooseHygeia = true;
                        }

                        this.setState({
                            vid: vid,
                            dealId: dealId,
                            phone: phone,
                            email: email,
                            firstBaby: firstBaby,
                            dueDate: dueDateFormatted,
                            insuranceProvider: appData.deal.insurance,
                            stateResidence: appData.contact.state,
                            firstName: appData.contact.firstName,
                            lastName: appData.contact.lastName,
                            dobMonth: dobMonth,
                            dobDay: dobDay,
                            dobYear: dobYear,
                            memberID: appData.deal.memberId,
                            chooseHygeia: chooseHygeia,
                            leadSource: leadSource,
                            prefferedCommunicationMethod: appData.contact.communicationPreference,
                            step: step,
                            domain: domain,
                            loading: false
                        });
                    }else if(step === 6){
                        firstBaby = false;
                        if(appData.deal.firstChild === "True"){
                            firstBaby = true;
                        }

                        dueDate = appData.deal.dueDate;
                        dueDate = parseInt(dueDate) / 1000;
                        dueDateFormatted = moment.unix(dueDate).format("MM/DD/YYYY");

                        dob = appData.deal.expectedMothersDateOfBirth;
                        dob = parseInt(dob) / 1000;
                        dobMonth = moment.unix(dob).format("MM");
                        dobDay = moment.unix(dob).format("DD");
                        dobYear = moment.unix(dob).format("YYYY");

                        phone = '';
                        email = '';

                        if(typeof appData.contact.phone !== "undefined"){
                            phone = appData.contact.phone;
                        }
						
                        if(typeof appData.contact.email !== "undefined"){
                            email = appData.contact.email;
                        }						

                        leadSource = params.leadSource;
                        if(appData.deal.leadSource){
                            leadSource = appData.deal.leadSource;
                        }

                        chooseHygeia = false;
                        doctorMike = false;
                        if(appData.deal.breastPumpBrand === "Hygeia"){
                            chooseHygeia = true;

                            if(appData.deal.doctorMike === "true"){
                                doctorMike = true;
                            }
                        }           

                        this.setState({
                            vid: vid,
                            dealId: dealId,
                            phone: phone,
                            email: email,
                            firstBaby: firstBaby,
                            dueDate: dueDateFormatted,
                            insuranceProvider: appData.deal.insurance,
                            stateResidence: appData.contact.state,
                            firstName: appData.contact.firstName,
                            lastName: appData.contact.lastName,
                            dobMonth: dobMonth,
                            dobDay: dobDay,
                            dobYear: dobYear,
                            memberID: appData.deal.memberId,
                            chooseHygeia: chooseHygeia,
                            doctorMike: doctorMike,
                            leadSource: leadSource,
                            prefferedCommunicationMethod: appData.contact.communicationPreference,
                            step: step,
                            domain: domain,
                            loading: false
                        });
                    }else if(step === 7){
                        firstBaby = false;
                        if(appData.deal.firstChild === "True"){
                            firstBaby = true;
                        }

                        dueDate = appData.deal.dueDate;
                        dueDate = parseInt(dueDate) / 1000;
                        dueDateFormatted = moment.unix(dueDate).format("MM/DD/YYYY");

                        dob = appData.deal.expectedMothersDateOfBirth;
                        dob = parseInt(dob) / 1000;
                        dobMonth = moment.unix(dob).format("MM");
                        dobDay = moment.unix(dob).format("DD");
                        dobYear = moment.unix(dob).format("YYYY");

                        phone = '';
                        email = '';

                        if(typeof appData.contact.phone !== "undefined"){
                            phone = appData.contact.phone;
                        }
						
                        if(typeof appData.contact.email !== "undefined"){
                            email = appData.contact.email;
                        }						

                        leadSource = params.leadSource;
                        if(appData.deal.leadSource){
                            leadSource = appData.deal.leadSource;
                        }

                        chooseHygeia = false;
                        doctorMike = false;
                        if(appData.deal.breastPumpBrand === "Hygeia"){
                            chooseHygeia = true;

                            if(appData.deal.doctorMike === "true"){
                                doctorMike = true;
                            }
                        } 
                        
                        shippingAddressLookupString =  appData.contact.address + ", " + appData.contact.city + ", " + appData.contact.state + ", USA";

                        this.setState({
                            vid: vid,
                            dealId: dealId,
                            phone: phone,
                            email: email,
                            firstBaby: firstBaby,
                            dueDate: dueDateFormatted,
                            insuranceProvider: appData.deal.insurance,
                            stateResidence: appData.contact.state,
                            firstName: appData.contact.firstName,
                            lastName: appData.contact.lastName,
                            dobMonth: dobMonth,
                            dobDay: dobDay,
                            dobYear: dobYear,
                            memberID: appData.deal.memberId,
                            chooseHygeia: chooseHygeia,
                            doctorMike: doctorMike,
                            shippingAddressL1: appData.contact.address,
                            shippingAddressCity: appData.contact.city,
                            shippingAddressState: appData.contact.state,
                            shippingAddressZip: appData.contact.zipCode,
                            shippingAddressLookupString: shippingAddressLookupString,
                            leadSource: leadSource,
                            prefferedCommunicationMethod: appData.contact.communicationPreference,
                            step: step,
                            domain: domain,
                            loading: false
                        });
                    }else if(step === 8){
                        firstBaby = false;
                        if(appData.deal.firstChild === "True"){
                            firstBaby = true;
                        }

                        dueDate = appData.deal.dueDate;
                        dueDate = parseInt(dueDate) / 1000;
                        dueDateFormatted = moment.unix(dueDate).format("MM/DD/YYYY");

                        dob = appData.deal.expectedMothersDateOfBirth;
                        dob = parseInt(dob) / 1000;
                        dobMonth = moment.unix(dob).format("MM");
                        dobDay = moment.unix(dob).format("DD");
                        dobYear = moment.unix(dob).format("YYYY");

                        phone = '';
                        email = '';

                        if(typeof appData.contact.phone !== "undefined"){
                            phone = appData.contact.phone;
                        }
						
                        if(typeof appData.contact.email !== "undefined"){
                            email = appData.contact.email;
                        }						

                        leadSource = params.leadSource;
                        if(appData.deal.leadSource){
                            leadSource = appData.deal.leadSource;
                        }

                        chooseHygeia = false;
                        doctorMike = false;
                        if(appData.deal.breastPumpBrand === "Hygeia"){
                            chooseHygeia = true;

                            if(appData.deal.doctorMike === "true"){
                                doctorMike = true;
                            }
                        } 
                        
                        shippingAddressLookupString =  appData.contact.address + ", " + appData.contact.city + ", " + appData.contact.state + ", USA";

                        this.setState({
                            vid: vid,
                            dealId: dealId,
                            phone: phone,
                            email: email,
                            firstBaby: firstBaby,
                            dueDate: dueDateFormatted,
                            insuranceProvider: appData.deal.insurance,
                            stateResidence: appData.contact.state,
                            firstName: appData.contact.firstName,
                            lastName: appData.contact.lastName,
                            dobMonth: dobMonth,
                            dobDay: dobDay,
                            dobYear: dobYear,
                            memberID: appData.deal.memberId,
                            chooseHygeia: chooseHygeia,
                            doctorMike: doctorMike,
                            shippingAddressL1: appData.contact.address,
                            shippingAddressCity: appData.contact.city,
                            shippingAddressState: appData.contact.state,
                            shippingAddressZip: appData.contact.zipCode,
                            shippingAddressLookupString: shippingAddressLookupString,
                            gynFirstName: appData.deal.obGynFirstName,
                            gynLastName: appData.deal.obGynLastName,
                            gynPhoneNumber: appData.deal.obGymPhoneNumber,
                            leadSource: leadSource,
                            prefferedCommunicationMethod: appData.contact.communicationPreference,
                            step: step,
                            domain: domain,
                            loading: false
                        });
                    }else{
                        this.setState({
                            loading: false,
                            leadSource: params.leadSource,
                            domain: domain
                        });
                    }
                }else{
                    this.setState({
                        loading: false,
                        leadSource: params.leadSource,
                        domain: domain
                    });
                }
            }).catch((err) => {
                console.log(err);
                this.setState({
                    loading: false,
                    leadSource: params.leadSource,
                    domain: domain
                });
            });
        }else{
            this.setState({
                loading: false,
                leadSource: params.leadSource,
                domain: domain,
                obUploadId: params.obUploadId
            });
        }
    }
    getParams(location){
        const searchParams = new URLSearchParams(location.search);
        return {
            leadSource: searchParams.get('source') || null,
            contactId: searchParams.get('contact') || null,
            dealId: searchParams.get('deal') || null,
            obUploadId: searchParams.get('obUploadId') || null
        };
    }
    //next step GO
    nextStep = () => {
        const { step } = this.state;
        const { progressPercent } = this.state;
        this.setState({
            step: step + 1,
            progressPercent: progressPercent + 10
        });
    }
    //prev step GO
    prevStep = () => {
        const { step } = this.state;
        const { progressPercent } = this.state;
        this.setState({
            step: step - 1,
            progressPercent: progressPercent - 10
        });
    }
    showObGynConfirmation = () => {
        this.setState({
            gynLookupConfirmation : true
        });
    }
    hideObGynConfirmation = () => {
        this.setState({
            gynLookupConfirmation : false
        });
    }
    handleObGynChange = obgIndex => {
        var selectedOB = this.state.obGynLookupList[obgIndex];
        this.setState({
            gynFirstName: selectedOB.firstName,
            gynLastName: selectedOB.lastName,
            gynPhoneNumber: selectedOB.phone
        });
    }
    showAddressConfirmation = () =>{
        this.setState({
            shippingAddressLookupConfirmation : true
        });
    }
    hideAddressConfirmation = () =>{
        this.setState({
            shippingAddressLookupConfirmation : false,
            shippingAddressBreakDown: true
        });
    }
    AddressConfirmation = () =>{
        this.nextStep();
    }
    showAddressBreakDown = () =>{
        if(this.state.shippingAddressBreakDown === true){
            this.setState({
                shippingAddressBreakDown: false
            })
        }else{
            this.setState({
                shippingAddressBreakDown: true
            })
        }
    }
    //Dismiss for general errors
    handleDismiss = e =>  {
        e.preventDefault();
        this.setState ({ apiError: false });
    }
    //general submit for each step
    handleSubmit = e =>{
        e.preventDefault();
        var messages = document.getElementsByClassName("errorMessage"), len = messages !== null ? messages.length : 0,  i = 0;
        for(i; i < len; i++) {
            messages[i].className += " visible "; 
        }
        var submitOK = null;
        var pos = this.state.step - 1;
        if( formValid ( this.state.formErrors[pos])){
            console.log("--submitting--");
            this.setState ({ apiError: false , submitting : true });
            submitOK= true;
        }else{
            this.setState ({ apiErrorMessage:"Check your form for errors", apiError: true  });
            submitOK = false;
        }
        return submitOK;
    }
    handleSuccessfulSubmit =  e => {
        this.setState({ submitting : false});
    }
    // Handle Change for react-select component
    handleSelectChange = input => selectedOption =>{
        var value = selectedOption.value;
        this.setState ({[input]: value});
        if(input === "stateResidence"){
            this.getInsuranceProviders(value);
        }
        if(input === "insuranceProvider"){
            this.getInsuranceInformation(value);
        }
        var name = input;
        var pos = this.state.step - 1;
        let messageArray = this.state.formErrors.slice();
        switch (name){
            case 'shippingAddressLookupString':
                messageArray[pos].shippingAddressLookupString = value.length === 0 ? 'Enter a Valid Address' : "";
                break;
            case 'shippingAddressState': 
                messageArray[pos].shippingAddressState = value.length === 0 ? 'You must select a state' : '';
            break;
            default:
            break;
        }
        this.setState({formErrors: messageArray});
    }

    handleDirectEdit = input => value =>{
        this.setState ({[input]: value});
    }
    handleChange = input => e => {
        var value = null;
        var name = e.target.name;
        if( e.target.type === 'checkbox'){
            value = e.target.checked
            this.setState ({[input]: value});
        }
        if(e.target.type === 'radio'){
            value = (e.target.value);
            var output = false; 
            name = (e.target.name);
            if(value === "true"){
                output = true
            }else{
                output = false
            }
            //we can set this to change different variable names by using another else with if  or we could also use the names of the inputs to set 3 state variables in that else
            this.setState({
                [name]: output
            })
        }
        if(e.target.type === 'date'){
            value = e.target.value
            console.log('received ' + value);
            var date = moment(value);
            console.log('moment ' + date);
            var dateFormatted = date.format("MM/DD/YYYY");
            console.log('moment formated' + dateFormatted);
            this.setState ({[input]: dateFormatted});
        }
        if(e.target.type === 'text' ||  e.target.type === 'email' || e.target.type === 'select-one'){
            value = e.target.value
            this.setState ({[input]: value});
        }

        if(e.target.type === 'number'){
            value = parseInt(e.target.value);
            this.setState ({[input]: value});
        }
        if(e.target.type === 'button'){
            value = e.target.value;
            name = (e.target.name);
            this.setState ({[name]: value});
        }
        //starts validation upon data changes
        var pos = this.state.step - 1;
        let messageArray = this.state.formErrors.slice();

        switch (name){
            //pos 0 = step 1
            case 'dueDate':
                messageArray[pos].dueDate = inFuture(value) ? '' : 'Due Date cannot be in the past';
                messageArray[pos].dueDate = lessThanOneYear(value) ? messageArray[pos].dueDate : 'Due Date cannot be greater than 1 year';
            break;
            case 'email':
                messageArray[pos].email = validator.isEmail(value) ? '' : "Invalid email address";
            break;
            case 'phone':
                messageArray[pos].phone = value.length > 1 ? '' : 'Phone number is required';
                messageArray[pos].phone = validator.isMobilePhone(value, "en-US") ? messageArray[pos].phone : "Your phone number is not valid";
            break;
            // pos 1 = step 2 - No validation required
            // pos 2 = step 3
            case 'firstName':
                messageArray[pos].firstName = value.length > 1 ? '' : 'Check your Name, must be more than 2 letters (letters only)';
            break;
            case 'lastName':
                messageArray[pos].lastName =  value.length > 1 ? '' : 'Check your Last Name, must be more than 2 letters (letters only) ';
            break;
            case 'memberID':
                messageArray[pos].memberID= value.length === 0 ? 'MemberID required' : "";
            break;
            // pos 5 = step 6
            case 'shippingAddressL1': 
                messageArray[pos].shippingAddressL1 = value.length > 0 ? '' : 'Shipping address is Required';
            break;
            case 'shippingAddressCity':
                messageArray[pos].shippingAddressCity = value.length === 0 ? 'Your City of residence is Required' : '';
            break;
            case 'shippingAddressZip':
                messageArray[pos].shippingAddressZip = zipRegex.test(value) && value.length > 0 ? '' : 'Please check your ZipCode';
            break;
            // pos 6 = step 7
            case 'gynFirstName':
                messageArray[pos].gynFirstName = value.length > 1 ? '' : 'Check your OBGyn Name, must be more than 2 letters (letters only)';
            break;
            case 'gynLastName':
                messageArray[pos].gynLastName = value.length > 1 ? '' : 'Check your OBGyn Name, must be more than 2 letters (letters only)';
            break;
            case 'gynPhoneNumber':
                messageArray[pos].gynPhoneNumber = value.indexOf("_") !== -1 || value.length === 0 ? 'Check your OBGyn Phone number' : "";
            break;
            // pos 7 = step 8
            default:
            break;
        }
        this.setState({formErrors: messageArray});
    }
    handleAddressChange(streetNumber,street,city,state,zip){
        var fullAddress = streetNumber + " " + street;
        var addressLookup = streetNumber + " " + street + " " + city+ ", " + state + " " + zip;
        this.setState({
            shippingAddressL1: fullAddress,
            shippingAddressCity: city,
            shippingAddressState: state,
            shippingAddressZip: zip,
            shippingAddressLookupString: addressLookup,
            shippingAddressBreakDown: true
        });
    }
    setCommunicationMethod = method => {
        if (method != null){
            this.setState({
                prefferedCommunicationMethod: method
            })
        }
    }
    showFinishModalOrder = () =>{
        this.setState({
            showExistingFormModal : true
        });
    }
    hideFinishModalOrder = () =>{
        this.setState({
            showExistingFormModal : false
        });
    }
    displayDupeModal = () => {
        this.setState({
            showDupeOrderModal: true
        });
    }
    hideDupeModal = () => {
        this.setState({
            showDupeOrderModal: false
        });
    }
    abbrToState = (st) =>{
        var fullState = ""
        stateBuffer.forEach(function(element){
           if ( element.abbreviation  === st){
                console.log("finding " + st +" equals to "+element.value);
                fullState = element.value;
           }
        })
        return fullState;
    }
    getInsuranceProviders = (selectedState) =>{
        this.setState({
            insuranceProviders: [],
            insuranceProvider: ""
        });
        axios.get(`https://api2.hygeiahealth.com/api/v1/utilities/Payor/GetByState/${selectedState}`).then((payorResponse) => {
            var payors = [];
            payorResponse.data.Data[0].Unique.forEach((element) => {
                var payor = {
                    "value": element,
                    "label": element
                };
                payors.push(payor);
            });
            this.setState({
                insuranceProviders: payors
            });
        });
    }
    getInsuranceInformation(provider){
        this.setState({
            providerInforamtion: null,
            pasRule: null
        });
        axios.get(`https://api2.hygeiahealth.com/api/v1/Utilities/Payor/GetPayorDetailsByAlias/${provider}`).then((response) => {
            if(!response.data.Error){
                this.setState({
                    providerInformation: response.data.Data[0],
                    pasRule: response.data.Data[0].Properties.PASRule[0]
                });
            }else{
                console.log("PayorByAlias Error");
            }
        }).catch((err) => {
            console.log(err);
        });
    }
    saveHubSpotIDs(vid,dealId){
        this.setState({
            vid: vid,
            dealId: dealId
        });
    }
    updateAddress(address,address2,city,state,zip,shippingAddressLookupString){
        this.setState({
            shippingAddressL1: address,
            shippingAddressL2: address2,
            shippingAddressCity: city,
            shippingAddressState: state,
            shippingAddressZip: zip,
            shippingAddressLookupString: shippingAddressLookupString
        });
    }
    updateDoctor(firstName,lastName,phone){
        this.setState({
            obGynFirstName: firstName,
            obGynLastName: lastName,
            obGymPhoneNumber: phone
        });
    }
    populateLastStepUrl(lastStepURL){
        this.setState({
            lastStepUrl: lastStepURL
        });
    }
    render() {
        
        const { step, loading } =  this.state;
        const {
            submitting,
            dueDate,
            firstBaby,
            stateResidence,
            prefferedCommunicationMethod,
            email,
            phone,
            insuranceProvider,
            firstName,
            lastName,
            dobMonth,
            dobDay,
            dobYear,
            memberID,
            chooseHygeia,
            chooseAmedaFinesse,
            chooseOtherSelection,
            includeCourse,
            hasPAS,
            accesorySelection,
            paymentEmail,
            paymentCreditCard,
            paymentExpDate,
            paymentCVC,
            shippingAddressLookupString,
            shippingAddressL1,
            shippingAddressL2,
            shippingAddressCity,
            shippingAddressState,
            shippingAddressZip,
            shippingAddressBreakDown,
            shippingAddressLookupConfirmation,
            gynFirstName,
            gynLastName,
            gynPhoneNumber,
            obGynLookupList,
            gynLookupConfirmation,
            agreementA,
            agreementB,
            agreementC,
            placingOrderAgreement,
            pumpAuthorizationAgreement,
            pasAgreement,
            progressPercent,
            insuranceProviders,
            vid,
            dealId,
            providerInformation,
            pasRule,
            domainName,
            domain,
            domainStyle,
            leadSource,
            apiError,
            apiErrorMessage,
            formErrors,
            showExistingFormModal,
            showDupeOrderModal,
            lastStepUrl,
            obUploadId
        } = this.state;
        const values = {
            step,
            submitting,
            dueDate,
            firstBaby,
            stateResidence,
            prefferedCommunicationMethod,
            email,
            phone,
            insuranceProvider,
            firstName,
            lastName,
            dobMonth,
            dobDay,
            dobYear,
            memberID,
            chooseHygeia,
            chooseAmedaFinesse,
            chooseOtherSelection,
            includeCourse,
            hasPAS,
            accesorySelection,
            paymentEmail,
            paymentCreditCard,
            paymentExpDate,
            paymentCVC,
            shippingAddressLookupString,
            shippingAddressL1,
            shippingAddressL2,
            shippingAddressCity,
            shippingAddressState,
            shippingAddressZip,
            shippingAddressBreakDown,
            shippingAddressLookupConfirmation,
            gynFirstName,
            gynLastName,
            gynPhoneNumber,
            obGynLookupList,
            gynLookupConfirmation,
            agreementA,
            agreementB,
            agreementC,
            placingOrderAgreement,
            pumpAuthorizationAgreement,
            pasAgreement,
            progressPercent,
            insuranceProviders,
            vid,
            dealId,
            providerInformation,
            pasRule,
            domainName,
            domain,
            domainStyle,
            leadSource,
            apiError,
            apiErrorMessage,
            formErrors,
            showExistingFormModal,
            showDupeOrderModal,
            lastStepUrl,
            obUploadId
        }
        if(this.state.loading){
            // TODO: LOADING PAGE
            return(
                <div></div>
            );
        }else{
            
            switch(step){
                case 1:
                    return(
                        <FormUserDetails
                            nextStep={ this.nextStep}
                            handleChange= {this.handleChange}
                            handleSelectChange = {this.handleSelectChange}
                            handleDismiss = {this.handleDismiss}
                            saveHubSpotIDs = {this.saveHubSpotIDs}
                            values={values}
                            setCommunicationMethod = {this.setCommunicationMethod}
                            handleSubmit = {this.handleSubmit}
                            handleSuccessfulSubmit = {this.handleSuccessfulSubmit}
                            showFinishModalOrder = {this.showFinishModalOrder}
                            hideFinishModalOrder = {this.hideFinishModalOrder}
                            populateLastStepUrl = {this.populateLastStepUrl}
                        />
                    );
                case 2:
                    return(
                        <FormInsuranceLookup
                            nextStep={ this.nextStep }
                            prevStep={ this.prevStep }
                            handleSelectChange= {this.handleSelectChange}
                            handleDismiss = {this.handleDismiss}
                            values={values}
                            handleSubmit = {this.handleSubmit}
                            handleSuccessfulSubmit = {this.handleSuccessfulSubmit}
                            abbrToState = {this.abbrToState}
                        />
                    );
                case 3:
                    return(
                        <FormInsuranceInfo
                            nextStep={ this.nextStep }
                            prevStep={ this.prevStep }
                            handleSelectChange= {this.handleSelectChange}
                            handleChange= {this.handleChange}
                            handleDismiss = {this.handleDismiss}
                            values={values}
                            handleSubmit = {this.handleSubmit}
                            handleSuccessfulSubmit = {this.handleSuccessfulSubmit}
                        />
                    );
                case 4:
                    return(
                        <FormPumpSelection
                            nextStep={ this.nextStep }
                            prevStep={ this.prevStep }
                            handleChange= {this.handleChange}
                            handleDismiss = {this.handleDismiss}
                            values={values}
                            handleSubmit = {this.handleSubmit}
                            handleSuccessfulSubmit = {this.handleSuccessfulSubmit}
                        />
                    );
                case 5:
                    return(
                        <FormPumpSelectionConfirm
                            nextStep={ this.nextStep }
                            prevStep={ this.prevStep }
                            handleChange= {this.handleChange}
                            handleDismiss = {this.handleDismiss}
                            values={values}
                            handleSuccessfulSubmit = {this.handleSuccessfulSubmit}
                        />
                    );    
                    case 6:
                        return(
                            <FormAddressLookup
                                nextStep={ this.nextStep }
                                prevStep={ this.prevStep }
                                handleSelectChange = {this.handleSelectChange}
                                handleChange= {this.handleChange}
                                handleAddressChange = {this.handleAddressChange}
                                handleSubmit = {this.handleSubmit}
                                handleDismiss = {this.handleDismiss}
                                values={values}
                                showAddressConfirmation = {this.showAddressConfirmation}
                                hideAddressConfirmation = {this.hideAddressConfirmation}
                                showAddressBreakDown = {this.showAddressBreakDown}
                                updateAddress = {this.updateAddress}
                                handleSuccessfulSubmit = {this.handleSuccessfulSubmit}
                                abbrToState = {this.abbrToState}
                            />
                    );                                  
                    case 7:
                        return(
                            <FormOBInfo
                                nextStep={ this.nextStep }
                                prevStep={ this.prevStep }
                                handleChange= {this.handleChange}
                                handleDismiss = {this.handleDismiss}
                                values={values}
                                handleSubmit = {this.handleSubmit}
                                hideObGynConfirmation = {this.hideObGynConfirmation}
                                showObGynConfirmation = {this.showObGynConfirmation}
                                handleObGynChange = {this.handleObGynChange}
                                updateDoctor = {this.updateDoctor}
                                handleSuccessfulSubmit = {this.handleSuccessfulSubmit}
                            />
                    );           
                    case 8:
                        return(
                            <FormTransactionAgreements
                                nextStep={ this.nextStep }
                                prevStep={ this.prevStep }
                                handleChange= {this.handleChange}
                                handleDismiss = {this.handleDismiss}
                                values={values}
                                handleSubmit = {this.handleSubmit}
                                handleSuccessfulSubmit = {this.handleSuccessfulSubmit}
                                displayDupeModal = {this.displayDupeModal}
                                hideDupeModal = {this.hideDupeModal}
                            />
                    ); 
                // case 6:
                //     return(
                //         <FormOrderAccesories
                //             nextStep={ this.nextStep }
                //             prevStep={ this.prevStep }
                //             hangleChangeDirect= {this.hangleChangeDirect}
                //             handleChange= {this.handleChange}
                //             values={values}
                //         />
                //     );                    
                // case 7:
                //     return(
                //         <FormPayment
                //             nextStep={ this.nextStep }
                //             prevStep={ this.prevStep }
                //             handleChange= {this.handleChange}
                //             values={values}
                //         />
                //     );        
                //     case 8:
                //         return(
                //             <FormAddressLookup
                //                 nextStep={ this.nextStep }
                //                 prevStep={ this.prevStep }
                //                 handleSelectChange = {this.handleSelectChange}
                //                 handleChange= {this.handleChange}
                //                 values={values}
                //             />
                //     );                                  
                //     case 9:
                //         return(
                //             <FormOBInfo
                //                 nextStep={ this.nextStep }
                //                 prevStep={ this.prevStep }
                //                 handleChange= {this.handleChange}
                //                 values={values}
                //             />
                //     );           
                //     case 10:
                //         return(
                //             <FormTransactionAgreements
                //                 nextStep={ this.nextStep }
                //                 prevStep={ this.prevStep }
                //                 handleChange= {this.handleChange}
                //                 values={values}
                //             />
                //     ); 
                    default: 
                            return(
                              <div></div>  
                    );                        
            }
        } 
    }


}

export default UserTransaction
