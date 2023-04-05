class Config {
    recipes = {
        beebop: {
            beep: 1, bop: 1
        },
        boobee: {
            beep: 1, bop: 1
        },
    };
    mineable = {
        beep: 0,
        bop: 0,
    };
    numberOfPads = 9; //pads are not dynamically generated
    stepUnlocks = [
        null,
        {beep: 1, bop: 1},
        {beebop: 1, boobee: 1},
    ];
    stuff = {};

    constructor(){
        for(let i in this.mineable){
            this.stuff[i] = this.mineable[i];
        }
        for (let i in this.recipes){
            this.stuff[i] = 0;
        }
        let names = Object.keys(this.stuff);
        names.sort();
        let newStuff = {};
        for (let i of names){
            newStuff[i] = this.stuff[i];
        }
        this.stuff = newStuff;
    }
}