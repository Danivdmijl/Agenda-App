class AgendaApp {
    api;
    agenda;

    constructor() {
        this.api = new API();
        let result = this.api.getData().then(result => {
        })
        this.agenda = new Agenda();
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
    constructor() {
        this.renderer = new Renderer();
        this.header = new Header();
        this.month = new Month(this);
    }
}

class Renderer {

}

class Header {

}

class Month {
    agenda;
    days = [];

    constructor(agenda) {
        for (let i = 0; i < 31; i++) {
            this.days.push(new Day(this));
        }
        this.agenda = agenda;
    }
}

class Day {
    month;

    constructor(month) {
        this.month = month;
    }
}

const DaniAgenda = new AgendaApp();

 