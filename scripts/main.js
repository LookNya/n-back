document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        init();
    }
}
function init(){
	start.addEventListener('touchstart',game.start)
	resetTRUE.addEventListener('touchstart',game.reset)
	for(var i = 0; i < document.getElementsByClassName('nbut').length; i++){
		game.setNums(i)
		document.getElementsByClassName('nbut')[i].addEventListener('touchstart', game.nbutClick)
	}
	game.initRecordsDiv()

}

game = {
	stage: 0,
	allStages: 1,
	startSecs: 0,
	secsViewInterval: '',
	start: function(e){
		e.preventDefault()
		content.className = 'enter'
		game.step = 0
		clearInterval(game.secsViewInterval)
		game.enter()
		
	},
	reset: function(e){
		if(e)e.preventDefault()
		content.className = 'begining'
		secs.innerHTML = ''
		game.step = 0
		clearTimeout(game.enteringTimer)
		clearInterval(game.secsViewInterval)
		game.initRecordsDiv()
	},
	nbutClick: function(e){
		e.preventDefault()
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
	enteringTimer:'',
	st2Timer:'',
	st3Timer:'',
	enter: function(){
		var first = utils.rnd10(), second = utils.rnd10()
		game.prev[1] = first*second
		task.innerHTML = '<div>'+first+' * '+second+'</div>'
		gbcount.className = 'st1'
		clearTimeout(game.enteringTimer)
		clearTimeout(game.st2Timer)
		clearTimeout(game.st3Timer)
		game.st2Timer = setTimeout(function(){gbcount.className = 'st2'}, 1000)
		game.st3Timer = setTimeout(function(){gbcount.className = 'st3'}, 2000)
		game.enteringTimer = setTimeout(function(){content.className = 'playing'; game.newStep();gbcount.className = ''}, 3000)
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
		if(game.step == 10){
			game.end()
		}
		if(game.step == 1){
			game.secsViewInterval = setInterval(game.refreshSecs,100)
			game.startSecs = new Date()
		}
	},
	getRecords: function(stage){
		if(localStorage.getItem('myData4')){
			var buff = JSON.parse(localStorage.getItem('myData4')).data
			for(var i = 0; i<game.allStages; i++){
				if(buff[i][0]==stage){
					return buff[i][1]
				} else {
					return 0
				}
			}
		}
	},
	saveRecord: function(stage, record){
		if(localStorage.getItem('myData4')){
			var buff = JSON.parse(localStorage.getItem('myData4')).data
			for(var i = 0; i<game.allStages; i++){
				if(buff[i][0]==stage){
					buff[i][1] = record
				} else {
				buff.push([[stage],[record]])
				}
			}
			
			localStorage.setItem('myData4', JSON.stringify({"data":buff}))
			return;
		}	
		var buff =[[stage],[record]]
		localStorage.setItem('myData4', JSON.stringify({"data":[buff]}))
	},
	end: function(){
		clearInterval(game.secsViewInterval)
		var resTime = new Date() - game.startSecs
		var msg = 'Стадия пройдена за '+utils.normalTime(resTime)+'. \n'
		if(resTime < game.getRecords(game.stage)){
			msg+='Новый рекорд!'
			game.saveRecord(game.stage, resTime)
		}
		alert(msg)
		game.reset()
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
		game.respColorTimeout = setTimeout(function(){controls.className = ''}, 150)
	},
	refreshSecs: function(){
		secs.innerHTML =  utils.normalTime(new Date() - game.startSecs)	
	},
	initRecordsDiv: function(){
		var str = ''
		for(var i = 0; i<game.allStages; i++){
			var lol = i+1
			str += 'Рекорд стадии '+lol+' — '+utils.normalTime(game.getRecords(i)) + '<br>'
		}	
		records.innerHTML = str
	}
}
utils = {
	rnd10: function(){
		return Math.round(Math.random() * (9 - 1) + 1)
	},
	normalTime: function(time){
		return time/1000 + ' секунд'
	}
}