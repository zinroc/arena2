/*
* Concept - ability casting has 2 phases
*	
*	Phase 1 - vulnerability_pre
*	During this phase you are vulnerable to a certain school of attacks
*	You are also vulnerable to being interrupted and other effects
*
*	Phase 2 - completion
*	During this phase you do guaranteed damage / have a guaranteed effect.
*
*	Phase 3 - vulnerability_post
*	During this phase, you are vulnerable. This applied to grappling techniques always. 
*	This applies to striking techniques if they are evaded.

/*
*	Index 1 - range
*	0 - grappling
* 	1 - standing
*	Index 2-- ID
*/

var focuses = {
	fire: 'extra impact when technique lands', //strength
	light: 'needed for hitting opponents obscured by mist', //accuracy
	water: 'chance to bypass a defence', //fluidity
	lightning: 'reduce vulnerability tempo before the attack', //explosiveness
	earth: 'reduce vulnerability tempo after ground attack', //stability
	air: 'reduce vulnerability tempo after missing standing attack', //reseting
	shadow: 'reduce the opponents precieved vulnerability tempo', //telegraphing
	arcane: 'chance to eliminate wind-up time when attacking a visible vulnerability'//countering
};


var physical_wards = {
	 standing: 'prevent being knocked prone', //physical
	 strike: 'block standing strikes', //physical
	 constitution: 'prevent being physically submitted', //physical
	 fortitude: 'prevent being mentally submitted', //physical
};

var wards = {
	 mist: 'evade incoming attacks', //evasion
	 psychic: 'prevent water ability from bypassing a physical ward', //awareness
	 harmony: 'alert when opponent is vulnerabile' //timing
};

