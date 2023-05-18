class AgendaApp {
    api;
    switcher;
    month = 0;
    constructor() {
        this.api = new API();
        this.switcher = new Switcher(this);
        this.api.getData().then(result => {
            this.switcher.loadAgenda(result[this.month]);
        });
    }

    switchMonths = (sign) =>{
        switch(sign){
        case "+":
            this.month = this.month + 1;
            break;
            case "-":
                this.month = this.month - 1;
                break;
        }

        if(this.month === 12){
            this.month = 0;
        }

        if(this.month < 0){
            this.month = 11;
        }

        this.switcher.loadAgenda(this.api.dataFromAPI[this.month]);
    }
}

class API {
    dataFromAPI = [];

  async  getData() {
       await fetch("../data/data.json").then(response => {
            return response.json();
        }).then(data => {
            this.dataFromAPI = data.months;
        })
        return this.dataFromAPI;
    }
}

class Agenda {
    renderer;
    header;
    month;
    htmlElement;
    agendaApp;

    constructor(data, agendaApp) {
        this.agendaApp = agendaApp;
        this.htmlElement = document.createElement("article");
        this.htmlElement.classList.add("agenda");
        this.data = data;
        this.renderer = new Renderer();
        this.renderer.render("body",this.htmlElement);
        this.header = new Header(this, data.name, this.agendaApp);
        this.month = new Month(this, data.days);
    }

    render(placeToRender,whatToRender){
         this.renderer.render(placeToRender, whatToRender);
    }
}

class Renderer {
    render(placeToRender, whatToRender){
        document.querySelector(placeToRender).appendChild(whatToRender);
    }
}

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
        this.htmlElement = document.createElement("header");
        this.htmlElement.classList.add("agenda__header");
       

        this.text = document.createElement("h2");
        this.text.innerText = this.nameOfMonth;

        this.agenda.render(".agenda", this.htmlElement);

        // this.agenda.render(".agenda__header", this.leftbutton);
        this.leftbutton = new Button("previous", "<", "agenda--left",this, this.agendaApp);
        this.agenda.render(".agenda__header", this.text);
        this.rightbutton = new Button("next", ">", "agenda--right",this,this.agendaApp);
        // this.agenda.render(".agenda__header", this.rightbutton);
    }

    render(placeToRender, whatToRender) {
        this.agenda.render(placeToRender, whatToRender);
    }
}

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
        this.htmlElement = document.createElement("button");    
        this.htmlElement.classList.add("agenda__button");
        this.extraclass = extraclass;
        this.htmlElement.classList.add(this.extraclass);
        this.innerText = innerText;
        this.htmlElement.innerText = this.innerText;
        // this.switcher = new Switcher(this.extraclass);

        this.render();

        this.htmlElement.onclick = this.buttonClicked;
    }

    buttonClicked = () => {
        if(this.type === "previous"){
            this.agendaApp.switchMonths("-");
            return;
        }
        this.agendaApp.switchMonths("+");
    }

    render() {
        this.header.render(".agenda__header",this.htmlElement)
    }
}

class Switcher {
    agendaApp;
    agenda;
    cleaner;
    constructor(agendaApp){
        this.agendaApp = agendaApp;
        this.cleaner = new Cleaner();
    }

    loadAgenda = (data) =>{
        this.cleaner.clean("body");
        this.agenda = new Agenda(data, this.agendaApp);
    }

    clicked = (type) => {
        console.log("ik moet naar", type);
    }
}

class Month {
    days = [];
    agenda;
    numberOfDays;
    htmlElement;
    constructor(agenda,numberOfDays) {
        this.htmlElement = document.createElement("ul");
        this.htmlElement.classList.add("agenda__month");
        this.numberOfDays = numberOfDays;
        this.agenda = agenda;
        this.agenda.render(".agenda", this.htmlElement);
        for (let i = 1; i <= numberOfDays; i++) {
            this.days.push(new Day(this, i));
        }
    }

    renderDays(placeToRender,whatToRender){
        this.agenda.render(placeToRender, whatToRender);
    }
}

class Day {
    month;
    htmlElement;
    dayNumber;

    constructor(month, dayNumber) {
        this.dayNumber = dayNumber; 
        this.htmlElement = document.createElement("li");
        this.htmlElement.classList.add("agenda__day");
        this.htmlElement.innerText = this.dayNumber;
        this.month = month;
        this.month.renderDays(".agenda__month", this.htmlElement);
    }

}

class Cleaner{
    clean(whereToClean){
        document.querySelector(whereToClean).innerHTML = "";
    }
}


const DaniAgenda = new AgendaApp();