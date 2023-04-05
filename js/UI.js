class UI{
	constructor(){

	}
	refresh(){
		$(".switcher").removeClass('btn-dark');
		$(".switcher").addClass('btn-outline-dark');
		$(".switcher").prop('disabled', false);
		$("#" + game.mode).prop('disabled', true);
		$("#" + game.mode).addClass('btn-dark');
		$("#" + game.mode).removeClass('btn-outline-dark');
		for (let padID in game.samples){			
			this.changePad(padID)

			if (game.samples[padID] == null){
				continue;
			}

			$("#pad-" + padID).html(game.samples[padID]);
		}
		let txt = '';
		for (let i in game.steps){
			let stepClass = '';
			if (game.steps[i] != null){
				stepClass = ' programmed ';
			}
			txt += "<span class='step " + stepClass + "'>&nbsp;</span>";
		}
		$("#patternSteps").html(txt);
		$("#programMenu").addClass('d-none');
		txt = 'Required: ';
		if (game.mode == 'program'){
			$("#unlockStep").prop('disabled', true);
			if (game.canYouUnlock()){
				$("#unlockStep").prop('disabled', false);
			}
			$("#programMenu").removeClass('d-none');
			for (let ingredient in game.config.stepUnlocks[game.steps.length]){
				let quantity = game.config.stepUnlocks[game.steps.length][ingredient];
				txt += quantity + " " + ingredient + " [" 
					+ game.config.stuff[ingredient] + "], ";
			}
			$("#incPatternRecipe").html(txt);
		}
		console.log(game.recordingStep);
		if (game.recordingStep != null){
			$("#recordPattern").removeClass('btn-outline-danger');
			$("#recordPattern").addClass('btn-danger');
		} else {
			$("#recordPattern").addClass('btn-outline-danger');
			$("#recordPattern").removeClass('btn-danger');
		}

		if (game.playInterval != null){
			$("#playPattern").removeClass('btn-outline-success');
			$("#playPattern").addClass('btn-success');
		} else {
			$("#playPattern").addClass('btn-outline-success');
			$("#playPattern").removeClass('btn-success');
		}

	}

	changePad(id){

		if (game.mode != 'record' && game.samples[id] == null){
			$("#pad-" + id).addClass('empty');
			return;
		} else if (game.mode != 'record' && game.samples[id] != null){
			$("#pad-" + id).addClass('filled');
			return;
		}
		$(".pad").removeClass('filled');
		$(".pad").removeClass('empty');
	}

	back(){
		$(".window").addClass('d-none');
		$("#game").removeClass('d-none');
	}
	showRecipe (stuffID){
		if (Object.keys(game.config.mineable).includes(stuffID)){
			return '';
		}	
		let txt = '';	
		let recipe = game.config.recipes[stuffID];
		for (let ingredient in recipe){
			let quantity = recipe[ingredient];
			txt += "<div class='ms-3'>" + ingredient + ": " + quantity + "</div>";
		}
		console.log(txt);
		return txt;
		
	}

	showSamples(padID){
		$(".window").addClass('d-none');
		$("#samples").removeClass('d-none');
		let txt = "<div class='text-center'><button id='back' class='verb0 btn btn-link'>back</button></div>";
		for (let stuffID in game.config.stuff){		
			if (!game.canYouCraftRecipe(stuffID)){
				continue;
			}
			txt += "<div class='mt-3'>"
			+ "<button id='sample-" + stuffID + "-" + padID
			+ "' class='sample btn btn-lg btn-outline-dark verb2'>" + stuffID 
			+ "</button> [" 
			+ game.config.stuff[stuffID]
			+ "] </div>";
			+ "<div>"
			txt += this.showRecipe(stuffID);
			txt += "</div>"
		}
		$("#samples").html(txt);
	}

	status(msg){
		$("#status").html(msg);
	}
}
