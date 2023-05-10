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
        this.header = new Header(data.name);
        this.month = new Month(this, data.days);
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
    constructor(nameOfMonth) {
        this.htmlElement = document.createElement("header");
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
        this.numberofDays = numberofDays;
        for (let i = 0; i < numberofDays; i++) {
            this.days.push(new Day(this));
        }
        this.agenda = agenda;
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

 