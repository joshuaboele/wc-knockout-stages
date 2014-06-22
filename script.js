var groups = [
	{
		"group": "A",
		"teams": ["brazil","mexico","croatia"]
	},
	{
		"group": "B",
		"teams": ["holland","chile"]
	},
	{
		"group": "C",
		"teams": ["colombia","ivorycoast","japan","greece",]
	},
	{
		"group": "D",
		"teams": ["costarica","italy", "uruguay"]
	},
	{
		"group": "E",
		"teams": ["france","ecuador","switzerland","honduras"]
	},
	{
		"group": "F",
		"teams": ["argentina","nigeria","iran"]
	},
	{
		"group": "G",
		"teams": ["germany","usa", "ghana", "portugal"]
	},
	{
		"group": "H",
		"teams": ["belgium","southkorea","algeria","russia" ]
	}
];
var favorite = "";

$(function(){
	var hash = window.location.hash;
	if(hash){
		favorite = hash.replace("#","");
		calculateOpponents();
	}

	$('button').on('click', function(e){
		e.preventDefault();
		window.location.hash = $('input').val().toLowerCase();
	});
	$('button.all').on('click', function(e){
		favorite = $('input').val().toLowerCase();
		if(favorite){
			calculateOpponents();
		}
	});

	$('button.real').on('click', function(e){
		favorite = $('input').val().toLowerCase();;
		if(favorite){
			calculateRealOpponents();
		}
	});
	
});

function calculateRealOpponents(){
	var roundOf16 = [
		[groups[0].teams[0], groups[1].teams[1]],
		[groups[0].teams[1], groups[1].teams[0]],
		[groups[2].teams[0], groups[3].teams[1]],
		[groups[2].teams[1], groups[3].teams[0]],
		[groups[4].teams[0], groups[5].teams[1]],
		[groups[4].teams[1], groups[5].teams[0]],
		[groups[6].teams[0], groups[7].teams[1]],
		[groups[6].teams[1], groups[7].teams[0]]
	];
	var quarterFinals = [
		[roundOf16[0],roundOf16[2]],
		[roundOf16[1],roundOf16[3]],
		[roundOf16[4],roundOf16[6]],
		[roundOf16[5],roundOf16[7]]
	];
	var semiFinals = [
		[quarterFinals[0],quarterFinals[2]],
		[quarterFinals[1],quarterFinals[3]]
	]
	
	var possibleOpponents = {
		roundOne : "",
		roundTwo : "",
		roundThree : "",
		roundFour: "",
	};
	$.each(roundOf16,function(i,j){
		if($.inArray(favorite,j) !== -1){
			var opponent = $.grep(j,function(a){
				return a !== favorite;
			});
			possibleOpponents.roundOne = opponent;
		}
	});
	$.each(quarterFinals,function(i,j){
		$.each(j, function(k,l){
			if($.inArray(favorite,l) !== -1){
				var opponents = $.grep(j,function(a){
					return a !== l;
				});
				possibleOpponents.roundTwo = opponents;
			}
		});
	});
	$.each(semiFinals,function(i,j){
		
		$.each(j, function(k,l){
			$.each(l,function(m,n){
				if($.inArray(favorite,n) !== -1){
					var opponents = $.grep(j,function(a){
						return a !== l;
					});
					possibleOpponents.roundThree = opponents;
					var finalOpponents;
					if(i===1){
						finalOpponents = 0;
					}else{
						finalOpponents = 1;
					}
					possibleOpponents.roundFour = semiFinals[finalOpponents];
				}
			});
			
		});
	});

	showResults(possibleOpponents);
}

function calculateOpponents(){
	var roundOf16 = [[groups[0].teams, groups[1].teams],[groups[2].teams, groups[3].teams],[groups[4].teams, groups[5].teams],[groups[6].teams, groups[7].teams]];
	var quarterFinals = [[roundOf16[0],roundOf16[1]],[roundOf16[2], roundOf16[3]]];
	var semiFinals = [quarterFinals[0],quarterFinals[1]]
	var possibleOpponents = {
		roundOne : "",
		roundTwo : "",
		roundThree : "",
		roundFour: "",
	};
	$.each(roundOf16,function(i,j){
		$.each(j, function(k,l){
			if($.inArray(favorite,l) !== -1){
				var opponents = $.grep(j,function(a){
					return a !== l;
				});
				possibleOpponents.roundOne = opponents;
			}
		});
	});
	$.each(quarterFinals,function(i,j){
		$.each(j, function(k,l){
			$.each(l, function(m,n){
				if($.inArray(favorite,n) !== -1){
					var opponents = $.grep(j,function(a){
						return a !== l;
					});
					var otherWinners;
					if(i===0){
						otherWinners = 1;
					}else{
						otherWinners = 0;
					}
					possibleOpponents.roundThree = quarterFinals[otherWinners];
					possibleOpponents.roundTwo = opponents;
				}
			});
		});
	});
	showResults(possibleOpponents);
}

function showResults(data){ 
	$('.container').html('<h2>Possible opponents for ' + favorite + '</h2>');
	var rounds = ["round of 16", "quarter finals", "semi finals", "final"]
	var n = 0;
	for(var key in data){
		if(data[key]){
			var $content = $('<div class="round"></div>');
			var roundData = flattenArray(data[key]);
			var title = $('<h3>').html(rounds[n])
			$content.append(title);
			var list = $content.append('<ul>');
			$.each(roundData,function(i,j){
				var listItem = $('<li>').html(j);
				list.append(listItem);
			});

			$('.container').append($content);
			n++;
		}
	}
	
}

function flattenArray(array){
	var flatArray=[];
	if(Array.isArray(array)){
		$.each(array,function(i,j){
			if(Array.isArray(j)){
				$.each(j,function(k,l){
					if(Array.isArray(l)){
						$.each(l, function(m,n){
							if(Array.isArray(n)){
								$.each(n, function(o,p){
									if(Array.isArray(p)){
									}else{
										flatArray.push(p);
									}
								});
							}else{
								flatArray.push(n);
							}
						});
					}else{
						flatArray.push(l);
					}
				});
			}else{
				flatArray.push(j);
			}
		});
	}
	return flatArray;

}