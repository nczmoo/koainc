$(document).on('click', '', function(e){

})
$(document).on('click', '.verb0', function(e){
	game[e.target.id](	)
})
$(document).on('click', '.verb2', function(e){
	game[e.target.id.split('-')[0]](e.target.id.split('-')[1], e.target.id.split('-')[2])
})

$(document).on('click', '.switcher', function(e){
	game.switch(e.target.id);
})

$(document).on('click', '.pad', function(e){
	game.pad(e.target.id.split('-')[1]);
});

$(document).on('click', 'button', function(e){
	ui.refresh()
})
