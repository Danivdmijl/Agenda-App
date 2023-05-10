class AgendaApp {
    api;
    agenda;

    constructor() {
        this.api = new API();
        this.api.getData().then(result => {
            this.agenda = new Agenda(result[0]);
        })
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

    constructor(data) {
        this.htmlElement = document.createElement("article");
        this.htmlElement.classList.add("agenda");
        this.data = data;
        this.renderer = new Renderer();
        this.renderer.render("body", this.htmlElement);
        this.header = new Header(this, data.name);
        this.month = new Month(this, data.days);
    }

    render(placeToRender, whatToRender) {
        this.renderer.render(placeToRender, whatToRender);
    }
}

class Renderer {
    render(placeToRender, whatToRender) {
        document.querySelector(placeToRender).appendChild(whatToRender);
    }
}

class Header {
    nameOfMonth;
    htmlElement;
    agenda;
    constructor(agenda, nameOfMonth) {
        this.agenda = agenda;
        this.htmlElement = document.createElement("header");
        this.htmlElement.classList.add("agenda__header");
        this.agenda.render(".agenda", this.htmlElement);
        this.nameOfMonth = nameOfMonth;
    }
}

class Month {
    htmlElement;
    agenda;
    numberofDays;
    days = [];

    constructor(agenda, numberofDays) {
        this.htmlElement = document.createElement("ul");
        this.htmlElement.classList.add("agenda__month");
        this.numberofDays = numberofDays;
        for (let i = 0; i < numberofDays; i++) {
            this.days.push(new Day(this));
        }
        this.agenda = agenda;
        this.agenda.render(".agenda", this.htmlElement);
    }
}

class Day {
    htmlElement;
    month;

    constructor(month) {
        this.htmlElement = document.createElement("li");
        this.month = month;
    }
}

const DaniAgenda = new AgendaApp();

 