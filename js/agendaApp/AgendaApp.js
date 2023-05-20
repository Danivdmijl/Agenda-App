// Maakt een class blueprint aan

class AgendaApp {
    api;
    switcher;
    month = 0;
    constructor() {
        this.api = new API(); // creeert api class
        this.switcher = new Switcher(this); // creeert switcher class en geeft zichzelf mee
        this.api.getData().then(result => {
            this.switcher.loadAgenda(result[this.month]); // runt getdata van api en voert dan loadagenda uit
        });
    }

    switchMonths = (sign) =>{ // kijkt wat er binnen komt een + of een - en telt dan op of af
        switch(sign){
        case "+":
            this.month = this.month + 1;
            break;
            case "-":
                this.month = this.month - 1;
                break;
        }

        if(this.month === 12){ //kijkt of de maand gelijk is aan 12
            this.month = 0;
        }

        if(this.month < 0){ // kijkt of het kleiner is dan 0
            this.month = 11;
        }

        this.switcher.loadAgenda(this.api.dataFromAPI[this.month]); // geeft maand data mee
    }
}

// Maakt een class blueprint aan
class API {
    dataFromAPI = []; // haalt data van json bestand

  async  getData() {
       await fetch("../data/data.json").then(response => {
            return response.json();
        }).then(data => {
            this.dataFromAPI = data.months;
        })
        return this.dataFromAPI;
    }
}

// Maakt een class blueprint aan
class Agenda {
    renderer;
    header;
    month;
    htmlElement;
    agendaApp;

    constructor(data, agendaApp) {
        this.agendaApp = agendaApp; // maakt zichzelf een nieuwe zelf
        this.htmlElement = document.createElement("article"); // maakt een article aan
        this.htmlElement.classList.add("agenda"); // geeft class agenda
        this.data = data;
        this.renderer = new Renderer(); // maakt nieuwe render class
        this.renderer.render("body",this.htmlElement); //geeft wat je wilt renderen in de render
        this.header = new Header(this, data.name, this.agendaApp); // nieuwe class geeft zichzelf + data naam + agenda app mee
        this.month = new Month(this, data.days); // nieuwe class geeft zichzelf en de dagen mee
    }

    render(placeToRender,whatToRender){
         this.renderer.render(placeToRender, whatToRender); // rendered wat + waar het moet komen
    }
}

// Maakt een class blueprint aan
class Header {
    nameOfMonth;
    htmlElement;
    agenda;
    leftbutton;
    rightbutton;
    constructor(agenda, nameOfMonth, agendaApp) {
        this.agenda = agenda;
        this.agendaApp = agendaApp;
        this.nameOfMonth = nameOfMonth;
        this.htmlElement = document.createElement("header"); // Maak een nieuw header HTML-element
        this.htmlElement.classList.add("agenda__header"); // Voeg de class "agenda__header" toe aan het HTML-element
       
        this.text = document.createElement("h2"); // Maak een nieuw h2 HTML element
        this.text.innerText = this.nameOfMonth; // zet de tekst van het h2 element in op de naam van de maand

        this.agenda.render(".agenda", this.htmlElement); // Voeg het header HTML-element toe aan de ".agenda" container

        this.leftbutton = new Button("previous", "<", "agenda--left",this, this.agendaApp); // Maak een nieuwe linkerknop met de tekst "<" en de class "agenda--left"
        this.agenda.render(".agenda__header", this.text); // Voeg het h2 HTML-element toe aan de ".agenda__header" container
        this.rightbutton = new Button("next", ">", "agenda--right",this,this.agendaApp); // Maak een nieuwe rechterknop met de tekst ">" en de class "agenda--right"
    }

    render(placeToRender, whatToRender) {
        this.agenda.render(placeToRender, whatToRender); // rendered het op de juiste plek
    }
}

// Maakt een class blueprint aan
class Button{
    htmlElement;
    innerText;
    extraclass;
    switcher;
    header;
    type;
    constructor(type, innerText, extraclass, header, agendaApp) {
        this.type = type;
        this.header = header;
        this.agendaApp = agendaApp;
        this.htmlElement = document.createElement("button");    // maakt de button
        this.htmlElement.classList.add("agenda__button"); // voegt class toe voor styling
        this.extraclass = extraclass;
        this.htmlElement.classList.add(this.extraclass);
        this.innerText = innerText; 
        this.htmlElement.innerText = this.innerText; // maakt de innertext de maand van de api
        // this.switcher = new Switcher(this.extraclass);

        this.render();

        this.htmlElement.onclick = this.buttonClicked; // als er gedrukt word word de functie buttonClicked uitgevoert
    }

    buttonClicked = () => {
        if(this.type === "previous"){
            this.agendaApp.switchMonths("-"); // Schakel naar de vorige maand in de agenda-app
            return;
        }
        this.agendaApp.switchMonths("+"); // Schakel naar de volgende maand in de agenda-app
    }

    render() {
        this.header.render(".agenda__header",this.htmlElement) // Voeg het HTML element van de knop toe aan de header
    }
}

// Maakt een class blueprint aan
class Switcher {
    agendaApp;
    agenda;
    cleaner;
    constructor(agendaApp){
        this.agendaApp = agendaApp; // maakt de agendaApp  een nieuwe agenda app met zijn waarde
        this.cleaner = new Cleaner(); // maakt cleaner class
    }


      // Laad de agenda met de gegevens.
    loadAgenda = (data) =>{
        this.cleaner.clean("body"); // de clean-functie van de cleaner om de body te cleanen
        this.agenda = new Agenda(data, this.agendaApp); // nieuwe agenda aanmaken na de clean
    }

    clicked = (type) => {
        console.log("ik moet naar", type); // een console log voor de lol
    }
}

// Maakt een class blueprint aan
class Month {
    days = [];
    agenda;
    numberOfDays;
    htmlElement;
    constructor(agenda,numberOfDays) {
        
        this.htmlElement = document.createElement("ul");  // Maak een nieuw ul-element aan voor de maand
        this.htmlElement.classList.add("agenda__month"); // geeft class mee
        this.numberOfDays = numberOfDays;
        this.agenda = agenda;
        this.agenda.render(".agenda", this.htmlElement);
        for (let i = 1; i <= numberOfDays; i++) { 
            this.days.push(new Day(this, i)); //maakt alle dagen aan in de huidige maand
        }
    }

    //rendered de dagen op de plek waar t moet komen
    renderDays(placeToRender,whatToRender){
        this.agenda.render(placeToRender, whatToRender);
    }
}

// Maakt een class blueprint aan
class Day {
    month;
    htmlElement;
    dayNumber;

    constructor(month, dayNumber) {
        this.dayNumber = dayNumber; 
        this.htmlElement = document.createElement("li"); // maakt li aan
        this.htmlElement.classList.add("agenda__day"); // maakt class aan
        this.htmlElement.innerText = this.dayNumber; // geeft de dag het nummer die hij moet hebben
        this.month = month; 
        this.month.renderDays(".agenda__month", this.htmlElement); // waar en wat je wilt renderen doet hij
    }

}

