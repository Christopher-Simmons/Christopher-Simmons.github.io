/*
 Yo Tom, Whatuuuuuuuuuuuuuuuuuuuup!
*/

//p1=TGE, p2=Maser, p3=sightings, p4=Tman23

$('.attack').on('click', function () {
	attack(playerOne, playerFour);
})

$('.reset').on('click', function () {
	p1DmgTotal = 0, p2DmgTotal = 0;
	$('.dmgoutput').text('');
	$('.p1Life').text('');
	$('.dmgoutput2').text('');
	$('.p2Life').text('');
})

//This is where the magic happens
function damage(str, def, spd, dex, wdmg, wacc, armour, crit_chance, health, curHappiness, maxHappiness) {
	
		//var x = spd / dex * wacc / 50
  	//var chance_to_hit = 25 + 100*x/(x+1)
		var x = (spd/dex) * (wacc / 50);
		var s = x / (x + 0.167);
		var chance_to_hit =  Math.min(95, 10 + 110 * s*s*s);
	
		
	  // roll for miss
    var miss_roll = Math.random()*100;
    if (miss_roll > chance_to_hit) {
         return 'MISS'; // miss
    } 

    // roll base damage with random coefficient: 0.5 - 1.5
    var dmg = ((str/def)*wdmg)*0.15 * (0.5 + 1*Math.random());

    // roll for crit
    var crit_roll = Math.random()*100;
		//Bonus to crit for low life
		if (health <= low_life_threshold) {
			crit_chance = crit_chance + 50;
			console.log('LOW LIFE CRIT!!!!');
		}
    if (crit_roll < crit_chance) {
        dmg = dmg * 2; // 50% more damage on crits
    } else {
       // damage prevention from armour (this is ignored for crits)
       // reduce armour depending on happiness
       armour = armour * (1 + curHappiness / maxHappiness) / 2;
       // calculate reduced damage 
       dmg = dmg * (100 - armour) / 100;
    }
	
    return Math.max(1, Math.round(dmg));
}



//Just calls and pulls together the data for display
function attack(p1, p2){
	var p1dmg = damage(p1.strength, p2.defense, p1.speed, p2.dexterity, p1.weapon, p1.wacc, p1.armor, (p1.stealth * 2), (p1.health - p2DmgTotal), p1.happiness, p1.maxHappiness);
	var p2dmg = damage(p2.strength, p1.defense, p2.speed, p1.dexterity, p2.weapon, p2.wacc, p2.armor, (p2.stealth * 2), (p2.health - p1DmgTotal) , p2.happiness, p2.maxHappiness);
	if(hasNumber(p1dmg)){
			p1DmgTotal += p1dmg;
	}
	if(hasNumber(p2dmg)){
			p2DmgTotal += p2dmg;
	}
	$('.dmgoutput').text(p1.name + " Attacks For= " + p1dmg);
	$('.p1Life').text('Life= ' + (p1.health - p2DmgTotal) );
	$('.dmgoutput2').text(p2.name + " Attacks For= " + p2dmg);
	$('.p2Life').text('Life= ' + (p2.health - p1DmgTotal) );
	
}
//To check for misses
function hasNumber(myString) {
  return /\d/.test(myString);
}
//Global life calc variable
var p1DmgTotal = 0, p2DmgTotal = 0, low_life_threshold = 50;

var playerOne = {//ThunderGunExpress
    strength: 612.5104,
    defense: 405.7166,
	  speed: 224.1394,
	  dexterity: 224.1639,
	  weapon: 84,
	  wacc: 80,
	  armor: 34,
	  stealth: 8,
	  health: 220,
		happiness: 5597,
		maxHappiness: 5750,
	  name:'ThunderGunExpress'
	  
};

var playerTwo = {//Maser
    strength: 1000.2270,
    defense: 506.2704,
	  speed: 205.1590,
	  dexterity: 203.3519,
	  weapon: 80,
	  wacc: 50,
	  armor: 34,
	  stealth: 4,
	  health: 200,
		happiness: 2550,
		maxHappiness: 5750,
	  name:'Maser'
};

var playerThree = {//Sightings
    strength: 1030.217,
    defense: 1000.8978,
	  speed: 510.0262,
	  dexterity: 1010.3301,
	  weapon: 78,
	  wacc: 65,
	  armor: 34,
	  stealth:8,
		health:250,
		happiness: 4050,
		maxHappiness: 5750,
	  name:'Sightings'
};

var playerFour = {//Tman23
    strength: 747.3117,
    defense: 347.7593,
	  speed: 404.8098,
	  dexterity: 365.9581,
	  weapon: 78,
	  wacc: 65,
	  armor: 34,
	  stealth:8,
		health:220,
		happiness: 0,
		maxHappiness: 5750,
	  name:'Tman23'
};

var welder = {
    strength: 10,
    defense: 10,
    speed: 10,
    dexterity: 10,
    weapon: 14, // hammer
    wacc: 50, // hammer
    armor: 0, // none
    stealth:6, // hammer
    health:90,
    happiness: 100,
    maxHappiness: 100,
    name:'welder'
};
