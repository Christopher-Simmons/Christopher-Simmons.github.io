//To check for misses
function hasNumber(myString) {
	return /\d/.test(myString);
}
//Global life calc variable
var p1DmgTotal = 0,
	p2DmgTotal = 0,
	low_life_threshold = 50;

$(".attack").on("click", function() {
	attack(thunder, maser);
});

$(".reset").on("click", function() {
	(p1DmgTotal = 0), (p2DmgTotal = 0);
	$(".dmgoutput").text("");
	$(".p1Life").text("");
	$(".dmgoutput2").text("");
	$(".p2Life").text("");
	clickCount=0;
});
var clickCount = 0;
//This is where the magic happens
	function damage(str,target_def,spe,target_dex,weapon_damage,weapon_accuracy,target_armour,weapon_stealth,target_health,target_happy,target_maxhappy) {
		// magic numbers should be used for tweaking
		// Math.random() gives a real number (0,1]

		var Damage_multiplier = (50 + weapon_damage) * 0.15; // tweak multiplier to get "feel good" damage numbers
		var Accuracy_multiplier = (50 + weapon_accuracy) * 0.01; // tweak multiplier to get numbers in the 0.5-1 range with different weapons
		var Damage_spread = 0.1; // tweak to make damage numbers more or less random (0 = no randomness)

		var High_stat_penalty = 0.4; // 1 = no penalty, lower = more penalty. Should be in the range (0.5, 1)
		var Damage = Math.pow(str/target_def, High_stat_penalty) * Damage_multiplier * (1-Damage_spread + (Damage_spread*2)*Math.random());
		var Accuracy = Math.pow(spe/target_dex, High_stat_penalty) * Accuracy_multiplier;

		// Check for miss
		if (Math.random() > Accuracy) {
			return 'MISS'; // miss
		}

		// Check for speed crits
		if (Accuracy > 1) {
			var avg_speed_crit_damage_multiplier = Accuracy;
			var Max_speed_crit_chance = 0.3; // to be tweaked
			var Min_speed_crit_multi = 1.5; // to be tweaked
			var Max_speed_crit_multi = 2.5; // to be tweaked
			var speed_crit_chance = Math.min((Accuracy-1) / (Min_speed_crit_multi-1), Max_speed_crit_chance);
			var speed_crit_multi = 1+(avg_speed_crit_damage_multiplier-1) / speed_crit_chance;

			if (speed_crit_multi > Max_speed_crit_multi) {
				// cap crit multi, and add a constant damage scaling instead
				var speed_crit_multi = Max_speed_crit_multi;
				Damage *= Accuracy / (1 + speed_crit_chance*(speed_crit_multi-1));
				console.log("Speed constant scaling: " + (Accuracy / (1 + speed_crit_chance*(speed_crit_multi-1))) + " (" + speed_crit_chance + " chance)");
			}

			if (Math.random() < speed_crit_chance) {
				Damage *= speed_crit_multi;
				console.log("Speed crit multiplier: " + speed_crit_multi);
			}
		}

		// Check for normal crits
		var Crit_multi = 2.5; // tweak this to get "feel good" and noticeable crits. (Range 2 - 4) Lower crit_multi gives more frequent crits and vice versa.
		var Crit_chance = weapon_stealth * (0.02/(Crit_multi-1)); // formula made so that stealth is just as an important stat on weapons as attack and accuracy

		if (Math.random() < Crit_chance) {
			// crit -> deal more damage and ignore armour
			Damage *= Crit_multi;
			console.log("Normal crit multiplier: " + Crit_multi + " (" + Crit_chance + " chance)");
		}

		// apply armour damage reduction
		var Armour_multiplier = (1+target_happy/target_maxhappy)/2; // don't tweak this unless happiness changes
		Damage *= (100-target_armour*Armour_multiplier)/100;

		// apply low life damage reduction
		if (target_health <= low_life_threshold) {
			// bonus crit chance on low life
			console.log("Low life: 30% less damage");
			Damage *= 0.7;
		}

		// Final rounding
		return Math.max(1, Math.round(Damage));

	}

//Just calls and pulls together the data for display
function attack(p1, p2) {
	
	var p1dmg = damage(
		p1.strength,
		p2.defense,
		p1.speed,
		p2.dexterity,
		p1.weapon,
		p1.wacc,
		p2.armor,
		p1.stealth,
		p2.health - p1DmgTotal,
		p2.happiness,
		p2.maxHappiness
	);
	var p2dmg = damage(
		p2.strength,
		p1.defense,
		p2.speed,
		p1.dexterity,
		p2.weapon,
		p2.wacc,
		p1.armor,
		p2.stealth,
		p1.health - p2DmgTotal,
		p1.happiness,
		p1.maxHappiness
	);
	if (hasNumber(p1dmg)) {
		p1DmgTotal += p1dmg;
	}
	if (hasNumber(p2dmg)) {
		p2DmgTotal += p2dmg;
	}
	$(".dmgoutput").text(p1.name + " Attacks For= " + p1dmg);
	$(".p1Life").text("Life= " + (p1.health - p2DmgTotal));
	$(".dmgoutput2").text(p2.name + " Attacks For= " + p2dmg);
	$(".p2Life").text("Life= " + (p2.health - p1DmgTotal));
}


var thunder = {
	strength: 2237.0321,
	defense: 1000.7741,
	speed: 1000.0409,
	dexterity: 1003.7054,
	weapon: 60,
	wacc: 78,
	armor: 34,
	stealth: 18,
	health: 250,
	happiness: 6000,
	maxHappiness: 6000,
	name: "Thunder"
};

var beast = {
	strength: 2500.2545,
	defense: 2000.5253,
	speed: 2000.0409,
	dexterity: 2503.7054,
	weapon: 58,
	wacc: 56,
	armor: 34,
	stealth: 20,
	health: 250,
	happiness: 6000,
	maxHappiness: 6000,
	name: "beastPlayer"
};

var maser = {
	strength: 1703.8808,
	defense: 1100.8311,
	speed: 1100.0854,
	dexterity: 500.0330,
	weapon: 80,
	wacc: 38,
	armor: 34,
	stealth: 4,
	health: 250,
	happiness: 6000,
	maxHappiness: 6000,
	name: "maser"
};
var lerus = {
	strength: 903.8808,
	defense: 800.8311,
	speed: 800.0854,
	dexterity: 800.0330,
	weapon: 58,
	wacc: 44,
	armor: 34,
	stealth: 24,
	health: 250,
	happiness: 6000,
	maxHappiness: 6000,
	name: "lerus"
};
var gurl = {
	strength: 500,
	defense: 500,
	speed: 500,
	dexterity: 500,
	weapon: 58,
	wacc: 56,
	armor: 34,
	stealth: 20,
	health: 190,
	happiness: 6000,
	maxHappiness: 6000,
	name: "Gurl"
};
var traveler = {
    strength: 10,
    defense: 10,
    speed: 10,
    dexterity: 10,
    weapon: 16, // hammer
    wacc: 18, // hammer
    armor: 0,
    stealth: 22, // hammer
    health: 70,
    happiness: 100,
    maxHappiness: 100,
    name: "traveler"
};
var newbie = {
	strength: 10,
	defense: 10,
	speed: 10,
	dexterity: 10,
	weapon: 10, // knuckle duster
	wacc: 10, // knuckle duster
	armor: 0,
	stealth: 16, // knuckle duster
	health: 100,
	happiness: 100,
	maxHappiness: 100,
	name: "newbie"
};
var zombo = {
    strength: 3000,
    defense: 15000,
    speed: 2500,
    dexterity: 1000,
    weapon: 16, // hammer
    wacc: 18, // hammer
    armor: 34,// chainmail
    stealth: 22, // hammer
    health: 5000,
    happiness: 100,
    maxHappiness: 100,
    name: "Zombo"
};
