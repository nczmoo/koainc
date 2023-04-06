class Config {
    multiPadsPlaying = true;
    muteAudio = false;
    audioPlaying = null;
    padPlaying = [];
    recipes = {
        babop:{
            boobee: 1,
            bop: 1,
        },
        beebop: {
            beep: 1, bop: 1
        },
        beelala: {
            beep: 1,
            la: 2,

        },
        beelalala: {
            beep: 1,
            lalalala: 1,            
        },
        beepbeep: {
            beep: 2,
        },
        bipbipbop: {
            beep: 1,
            beebop: 1,
        },        
        boobee: {
            beep: 1, bop: 1
        },
        boolalala: {
            bop: 1,
            lalala: 1,
        },
        boopbop: {
            bop: 2,
        },
        bopboo:{
            bop: 1,
            babop: 1,
        },
        boopbopla: {
            boopbop: 1,
            la: 1,
        },

        bopboola: {
            bopboo: 1,
            la: 1,
        },
        bopla: {
            bop: 1,
            la: 1,
        },
        boplabeep: {
            bopla: 1,
            beep: 1,
        },
        lalala: {
            la: 3,
        },
        lalalabop: {
            lalala: 1,
            bop: 1,
        },
        lalalala: {
            la: 4,
        }
    };
    mineable = {
        beep: 0,
        bop: 0,
        la: 0,
    };
    numberOfPads = 27; //pads are not dynamically generated    
    
    stepUnlocks = [        
        null,
        {beep: 5, la: 5},
        {bop: 5, la: 5},
        {beepbeep: 3, bopla: 2},
        {beebop: 2, lalala: 2},
        {boobee: 3, lalalala: 1},        
        {lalalabop: 2, beepbeep: 2},
        {beebop: 2, bopla: 3},
        {boopbop: 1, beepbeep: 1, lalalala: 1},
        {lalala: 1, bopla: 1, beebop: 1},
        {lalalabop: 1, beepbeep:1, bopla: 1},
        {boopbop:1, boobee: 1, lalalala: 1},
        {beelalala: 1, bipbipbop: 1},
        {boplabeep: 1, boopbopla: 1},
        {boolalala: 1, bopboola: 1},
        {bipbipbop:1, beelalala: 1},
    ];
    stuff = {};

    constructor(){
        for (let i = 0; i < this.numberOfPads; i ++){
            this.padPlaying[i] = null;
        }

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
        this.integrityCheck();
    }

    integrityCheck(){
        console.log('integrity check');
        for (let i in this.recipes){
            for (let ingredient in this.recipes[i]){                
                if (!Object.keys(this.stuff).includes(ingredient)){
                    console.log("  NO! " + ingredient );
                }
            }            
        }
        for (let i in this.stepUnlocks){            
            for (let ingredient in this.stepUnlocks[i]){                
                if (!Object.keys(this.stuff).includes(ingredient)){
                    console.log("  NO! " + ingredient );
                }
            }
        }
    }
}