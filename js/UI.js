class UI{
	hidingUncraftable = true;

	constructor(){

	}
	refresh(){
		
		$(".changeBank").addClass('btn-outline-info');
		$(".changeBank").removeClass('btn-info');
		$(".changeBank").prop('disabled', false);
		$("#changeBank-" + game.bank).removeClass('btn-outline-info');
		$("#changeBank-" + game.bank).addClass('btn-info');
		$("#changeBank-" + game.bank).prop('disabled', true);
		$(".switcher").removeClass('btn-dark');
		$(".switcher").addClass('btn-outline-dark');
		$(".switcher").prop('disabled', false);
		$("#" + game.mode).prop('disabled', true);
		$("#" + game.mode).addClass('btn-dark');
		$("#" + game.mode).removeClass('btn-outline-dark');
		for (let sampleID = game.bank * 9; sampleID < (game.bank + 1) * 9; sampleID++){	
			let padID = sampleID - (game.bank * 9);		
			$("#pad-" + padID).prop('disabled', false);
	
			this.changePad(padID)
			$("#pad-" + padID).html('&nbsp;');
			if (game.samples[sampleID] != null){
				$("#pad-" + padID).html(game.samples[sampleID].trim());
				continue;
			}
			if (game.mode != 'record'){ //null by default
				$("#pad-" + padID).prop('disabled', true);
				continue;
			}			
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
				let doTheyHaveEnoughClass = '';
				let haveTheyAssignedClass = '';
				if (game.config.stuff[ingredient] >= quantity){
					doTheyHaveEnoughClass = ' fw-bold ';
				}
				if (game.hasThisAlreadyBeenAssigned(ingredient)){
					haveTheyAssignedClass = ' text-decoration-underline ';
				}
				txt += "<span class='" + doTheyHaveEnoughClass + haveTheyAssignedClass + "' >"
					+ quantity + " " + ingredient + " [" 
					+ game.config.stuff[ingredient] + "], "
					+ "</span>";

			}
			$("#incPatternRecipe").html(txt);
		}
		
		if (game.recordingStep != null){
			$("#recordPattern").html('stop');
			$("#recordPattern").removeClass('btn-outline-danger');
			$("#recordPattern").addClass('btn-danger');
		} else {
			$("#recordPattern").html('record');
			$("#recordPattern").addClass('btn-outline-danger');
			$("#recordPattern").removeClass('btn-danger');
		}
		$("#playPattern").prop('disabled', false);
		if (game.steps[0] == null){
			$("#playPattern").prop('disabled', true);
		}
		$("#playPattern").html('play');
		if (game.playInterval != null){
			$("#playPattern").html('stop');
			$("#playPattern").removeClass('btn-outline-success');
			$("#playPattern").addClass('btn-success');
		} else {
			$("#playPattern").addClass('btn-outline-success');
			$("#playPattern").removeClass('btn-success');
		}
		$("#mute").removeClass('btn-secondary');
		$("#mute").addClass('btn-outline-secondary');
		if (game.config.muteAudio){
			$("#mute").addClass('btn-secondary');
			$("#mute").removeClass('btn-outline-secondary');
		} 
			
		
	}

	changePad(padID){
		let sampleID = padID + (game.bank * 9);
		$("#pad-" + padID).removeClass('btn-outline-success');
		$("#pad-" + padID).removeClass('btn-outline-danger');
		$("#pad-" + padID).removeClass('btn-warning');	
		if (game.mode != 'record' 
			&& !Object.keys(game.config.mineable).includes(game.samples[sampleID]) 
			&& !game.canYouCraftRecipe(game.samples[sampleID])){
				console.log('yo', padID);
			$("#pad-" + padID).addClass('btn-warning');	
			$("#pad-" + padID).prop('disabled', true); //disabled is already marked false in parent function
			return;
		} else if (game.mode != 'record' && game.samples[sampleID] == null){
			$("#pad-" + padID).addClass('btn-outline-danger');
			return;
		} else if (game.mode != 'record' && game.samples[sampleID] != null){
			$("#pad-" + padID).addClass('btn-outline-success');
			return;
		}
		$(".pad").removeClass('btn-outline-success');
		$(".pad").removeClass('btn-outline-danger');
		$(".pad").removeClass('btn-warning');	

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
			txt += "<div class='ms-3'>" + ingredient + ": " + quantity + " [" + game.config.stuff[ingredient] + "]</div>";
		}
		return txt;
		
	}

	showSamples(padID){
		$(".window").addClass('d-none');
		$("#samples").removeClass('d-none');
		let txt = "<div class='text-center'><button id='back' class='verb0 btn btn-link'>back</button></div>";
		let hideChecked = '';
		if (this.hidingUncraftable){
			hideChecked = ' checked ';
		}
		txt += "<div class='text-center'>"
			+ "<input type='checkbox' id='hideUncraftable-" + padID + "' class='hideUncraftable' " + hideChecked + ">only show craftable"
			+ "</div>";
		for (let stuffID in game.config.stuff){		
			let displayClass = '';
			if (!game.canYouCraftRecipe(stuffID) && this.hidingUncraftable){				
				displayClass = ' d-none ';
			}
			let btnClass = ' btn-outline-dark ';
			if (game.hasThisAlreadyBeenAssigned(stuffID)){
				btnClass = ' btn-dark ';
			}
			txt += "<div class='uncraftable " + displayClass + "'>"
			txt += "<div class='mt-3'>"
			+ "<button id='sample-" + stuffID + "-" + padID
			+ "' class='sample btn btn-lg verb2 " + btnClass + "'>" + stuffID 
			+ "</button> [" 
			+ game.config.stuff[stuffID]
			+ "] </div>";
			+ "<div>"
			txt += this.showUnlocks(stuffID);
			txt += this.showRecipe(stuffID);
			txt += "</div>"
			txt += "</div>";
		}
		$("#samples").html(txt);
	}

	showUnlocks(stuffID){		
		
		if (game.canThisBeUsedToUnlock(stuffID)){
			return "<div class='ms-3 fw-bold'>unlocks next level</div>"
		}
		return '';
	}

	status(msg){
		$("#status").html(msg);
	}
}
