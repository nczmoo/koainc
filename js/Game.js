class Game{
	config = new Config();
	mode = 'record';	
	playInterval = null;
	recordingStep = null;

	samples = [];
	states = ['record', 'play', 'program'];
	steps = [null];
	constructor(){
		for (let i = 0; i < this.config.numberOfPads; i++){
			this.samples[i] = null;
		}
	}
	back(){
		ui.back();
	}

	canYouUnlock(){
		for (let ingredient in this.config.stepUnlocks[this.steps.length]){
			let quantity = this.config.stepUnlocks[this.steps.length][ingredient];
			if (this.config.stuff[ingredient] < quantity){
				return false;
			}
		}
		return true;

	}

	canYouCraftRecipe(name){
		for (let ingredient in this.config.recipes[name]){
			let quantity = this.config.recipes[name][ingredient];
			if (this.config.stuff[ingredient] < quantity) {
				return false;
			}
		}
		return true;
	}

	clearPattern(){
		this.stopPlaying();
		this.stopRecording();
		for (let i in this.steps){
			this.steps[i] = null;
		}
	}


	pad(id){
		if (this.mode == 'record'){
			ui.showSamples(id);
			return;
		} 
		if (this.recordingStep != null){
			this.steps[this.recordingStep] = id;
			this.recordingStep++;
			if (this.recordingStep >= this.steps.length){
				ui.status("All " + this.steps.length + " step(s) of the pattern were programmed.")
				this.recordingStep = null;
			}
			return;
		}		
		game.play(id);
	}

	play(id){		
		if (this.samples[id] == null 
			|| !this.canYouCraftRecipe(this.samples[id])){
			return;
		}		
		this.config.stuff[this.samples[id]]++;		
		let txt = this.samples[id] + ": " 
		+ this.config.stuff[this.samples[id]] + " (+1)";

		for (let ingredient in this.config.recipes[this.samples[id]]){
			let quantity = this.config.recipes[this.samples[id]][ingredient];
			this.config.stuff[ingredient] -= quantity;
			txt += " " + ingredient + ": " + this.config.stuff[ingredient] 
				+ "(-"  + quantity + ")";
		}

		ui.status(txt);
	}

	playingPattern(){
		for (let i in game.steps){
			game.play(game.steps[i]);
		}
	}

	playPattern(){
		console.log('playPattern');
		this.stopPlaying();
		this.stopRecording();
		this.playInterval = setInterval(this.playingPattern, 1000);
		ui.status("Playing...");
	}

	recordPattern(){
		this.stopPlaying();
		this.stopRecording();
		ui.status("Programming...")
		this.clearPattern();
		this.recordingStep = 0;

	}

	sample (stuffID, padID){				
		this.samples[padID] = stuffID;
		ui.back();		
	}

	stopPlaying(){
		if (this.playInterval != null){
			clearInterval(this.playInterval);
			this.playInterval = null;
			ui.status("Stopped...");
			return;
		}
	}

	stopRecording(){
		if (this.recordingStep != null){
			ui.status( this.recordingStep + "/" + this.steps.length + " steps of the pattern programmed.");
			this.recordingStep = null;
			return;
		}
	}

	switch(id){
		this.mode = id;
		
	}

	unlockStep(){
		if (!this.canYouUnlock()){
			return;
		}
		
		let txt = "<div>New pattern step unlocked! [" + (Number(this.steps.length) + 1) + "]</div><div>";
		for (let ingredient in this.config.stepUnlocks[this.steps.length]){
			let quantity = this.config.stepUnlocks[this.steps.length][ingredient];
			this.config.stuff[ingredient] -= quantity;
			txt += " -" + quantity + " " + ingredient + "[" 
				+ this.config.stuff[ingredient] + "], ";
		}
		txt += "</div>"
		this.steps.push(null);
		ui.status(txt);
	}
}
