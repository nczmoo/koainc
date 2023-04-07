class Game{
	bank = 0;
	config = new Config();
	mode = 'record';	
	playInterval = null;
	recordingStep = null;

	samples = [];
	states = ['record', 'play', 'program'];
	stepActive = null;
	steps = [null];
	constructor(){
		for (let i = 0; i < this.config.numberOfPads; i++){
			this.samples[i] = null;
		}
	}
	back(){
		ui.back();
	}

	changeBank(bankID){
		this.bank = Number(bankID);
	}

	canThisBeUsedToUnlock(name){
		for (let ingredient in this.config.stepUnlocks[this.steps.length]){			
			if (ingredient == name){
				return true;
			}
		}
		return false;
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
		if (this.playInterval != null){
			this.stopPlaying();
		}
		for (let i in this.steps){
			this.steps[i] = null;
		}
	}

	hasThisAlreadyBeenAssigned(stuffID){
		for (let i in this.samples){
			if (stuffID == this.samples[i]){
				return true;
			}
		}
		return false;
	}

	mute(){
		this.config.muteAudio = !this.config.muteAudio;
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
		let sampleID = Number(id) + (this.bank * 9);
		if (this.samples[sampleID] == null 
			|| !this.canYouCraftRecipe(this.samples[sampleID])){
			return;
		}		
		this.config.stuff[this.samples[sampleID]]++;		
		let txt = this.samples[sampleID] + ": " 
		+ this.config.stuff[this.samples[sampleID]] + " (+1)";

		for (let ingredient in this.config.recipes[this.samples[sampleID]]){
			let quantity = this.config.recipes[this.samples[sampleID]][ingredient];
			this.config.stuff[ingredient] -= quantity;
			txt += " " + ingredient + ": " + this.config.stuff[ingredient] 
				+ "(-"  + quantity + ")";
		}
		this.playAudio(sampleID);
		ui.status(txt);
	}

	playAudio(sampleID){
		if (this.config.muteAudio){
			return;
		}
		let filename = 'audio/' + this.samples[sampleID] + ".mp3";
		/*
		if (this.config.multiPadsPlaying){
			//pausing audio when new audio plays sounds horrible
			this.config.padPlaying[padID] = new Audio(filename);
			this.config.padPlaying[padID].play();
			return;
		}
		*/
		this.config.audioPlaying = new Audio(filename);
		this.config.audioPlaying.play();
	}

	playingPattern(){
		game.play(game.steps[game.stepActive]);
		game.stepActive++;
		if (game.stepActive > game.steps.length - 1 
			|| game.steps[game.stepActive] == null){
			game.stepActive = 0;
		}
	}

	playPattern(){
		this.stopRecording();

		if (this.stopPlaying() || this.steps[0] == null ){
			return;
		}
		this.stepActive = 0;
		this.playInterval = setInterval(this.playingPattern, 1000);
		ui.status("Playing...");
	}

	recordPattern(){
		this.clearPattern();

		this.stopPlaying();
		if (this.stopRecording()){
			return;
		}

		ui.status("Programming...")
		this.recordingStep = 0;

	}

	sample (stuffID, padID){					
		padID = Number(padID);
		this.samples[padID + (this.bank * 9)] = stuffID;
		ui.back();		
	}

	stopPlaying(){
		if (this.playInterval != null){
			clearInterval(this.playInterval);
			this.playInterval = null;
			ui.status("Stopped...");
			return true;
		}
		return false;
	}

	stopRecording(){
		if (this.recordingStep != null){
			ui.status( this.recordingStep + "/" + this.steps.length + " steps of the pattern programmed.");
			this.recordingStep = null;
			return true;
		}
		return false;
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
