document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        init();
    }
}
function init(){
	start.addEventListener('touchstart',game.start)
	reset.addEventListener('touchstart',game.reset)
	for(var i = 0; i < document.getElementsByClassName('nbut').length; i++){
		game.setNums(i)
		document.getElementsByClassName('nbut')[i].addEventListener('touchstart', game.nbutClick)
	}
}

game = {
	start: function(){
		content.className = 'enter'
		game.step = 0
		game.enter()
	},
	reset: function(){
		content.className = 'begining'
		game.step = 0
	},
	nbutClick: function(e){
		var num = (e.target.dataset.num)%10
		if(num == (game.prev[0])%10){
			game.respCorr(true)
			game.newStep()
		} else {
			game.respCorr(false)
		}
	},
	setNums: function(i){
		if(i==9){
			document.getElementsByClassName('nbut')[i].dataset.num = 0
		} else {
			document.getElementsByClassName('nbut')[i].dataset.num = i+1
		}
	},
	enter: function(){
		var first = utils.rnd10(), second = utils.rnd10()
		game.prev[1] = first*second
		task.innerHTML = '<div>'+first+' * '+second+'</div>'
		gbcount.className = 'st1'
		setTimeout(function(){gbcount.className = 'st2'}, 1000)
		setTimeout(function(){gbcount.className = 'st3'}, 2000)
		setTimeout(function(){content.className = 'playing'; game.newStep();gbcount.className = ''}, 3000)
	},
	step: 0,
	prev: [0,0],
	newStep: function(){
	
		var first = utils.rnd10(), second = utils.rnd10()
		
		for(var i=0; i<game.prev.length-1; i++){
			game.prev[i] = game.prev[i+1]
		}
		game.prev[game.prev.length-1] = first*second
		task.innerHTML = '<div>'+first+' * '+second+'</div>'
		game.step++
		if(game.step == 9){
			alert("That's all.")
			game.reset()
		}
	},
	respColorTimeout: '',
	respCorr: function(correct){
		clearTimeout(game.respColorTimeout)
		controls.className = ''
		
		if(correct){
			controls.className = 'cor'
		} else {
			controls.className = 'err'
		}
		game.respColorTimeout = setTimeout(function(){controls.className = ''}, 300)
	},
}
utils = {
	rnd10: function(){
		return Math.round(Math.random() * (9 - 1) + 1)
	}
}