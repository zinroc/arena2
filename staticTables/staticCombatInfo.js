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

var bottom_position = {};
bottom_position.guard = {time_to_sub: 0, sub_def = 2, gnp_def=2, escape_def=1};
bottom_position.half_guard = {time_to_sub: 3, sub_def = 1, gnp_def = 1, escape_def=0.5};
bottom_position.mount = {time_to_sub: 6, sub_def = 0.5, gnp_def: 0.5, escape_def = 0}; 

var top_position = {};
top_position.guard = {time_to_sub: 6, sub_def = 1, gnp_atk = 1, escape_def: 1};
top_position.half_guard = {time_to_sub: 2, sub_def = 3, gnp_atk = 1.5, escape_def: 2}; 
top_position.mount = {time_to_sub: 0, sub_def = 3, gnp_atk = 3, escape_def: 4};

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
	 bottom_guard_pass: 'prevent having guard passed', //physical
	 bottom_guard_escape: 'prevent opponent escaping guard', //physical
	 top_guard_sweep: 'prevent being swept', //physical
	 top_guard_recovery: 'prevent guard recovery',//physical
	 top_guard_escape: 'prevent escape', //physical
	 ground_strike: 'prevent being struck from guard' //physical;
};

var wards = {
	 mist: 'evade incoming attacks', //evasion
	 psychic: 'prevent water ability from bypassing a physical ward', //awareness
	 harmony: 'alert when opponent is vulnerabile' //timing
};



var grappling_focuses = ['water', 'lightning', 'shadow', 'arcane', 'earth'];
var ground_strike_focuses = ['water', 'lightning', 'shadow', 'arcane', 'fire'];
var standing_focuses = ['water', 'lightning', 'light', 'shadow', 'arcane', 'air', 'fire'];


var bottom_vulnerabilities = ['ground_strike', 'bottom_guard_pass, bottom_guard_escape',
 'joint_submission', 'choke_submission'];
var top_vulnerabilities = ['top_guard_sweep', 'top_guard_recovery', 'top_guard_escape', 
 'joint_submission', 'choke_submission'];
var grappling_vulnerabilities = ['ground_strike', 'bottom_guard_pass, bottom_guard_escape',
 'joint_submission', 'choke_submission', 'top_guard_sweep', 'top_guard_recovery', 'top_guard_escape'];
var standing_vulnerabilities = ['takedown', 'strike'];
var takedown_vulnerabilities = ['takedown', 'strike', 'joint_submission', 'choke_submission', 
'top_guard_sweep', 'top_guard_recovery', 'top_guard_escape'];

var attack = [];
attack[0] = [];
attack[1] = [];

ward = [];
ward[0] = [];
ward[1] = [];


ward[0][0].name = 'psychic';
ward[0][1].name = 'harmony';
ward[1][0].name = 'mist';
ward[1][1].name = 'psychic';
ward[1][2].name = 'harmony';


attack[0][0].name = 'sweep';
attack[0][0].target = ['top_guard_sweep'];
attack[0][0].vulnerability_pre = bottom_vulnerabilities;
attack[0][0].vulnerability_post = top_vulnerabilities;
attack[0][0].focuses = grappling_focuses;

attack[0][1].name = "pass";
attack[0][1].target = ['bottom_guard_pass'];
attack[0][1].vulnerability_pre = top_vulnerabilities;
attack[0][1].vulnerability_post = bottom_vulnerabilities;
attack[0][1].focuses = grappling_focuses;

attack[0][2].name = "bottom_escape";
attack[0][2].target = ['top_guard_escape'];
attack[0][2].vulnerability_pre = bottom_vulnerabilities;
attack[0][2].vulnerability_post = standing_vulnerabilities; 
attack[0][2].focuses = grappling_focuses;

attack[0][3].name = 'joint_lock';
attack[0][3].target = ['joint_submission'];
attack[0][3].vulnerability_pre = grappling_vulnerabilities;
attack[0][3].vulnerability_post = grappling_vulnerabilities;
attack[0][3].focuses = grappling_focuses;

attack[0][3].name = 'choke';
attack[0][3].target = ['choke_submission'];
attack[0][3].vulnerability_pre = grappling_vulnerabilities;
attack[0][3].vulnerability_post = grappling_vulnerabilities;
attack[0][3].focuses = grappling_focuses;

attack[0][4].name = "ground_strike";
attack[0][4].target = ['ground_and_pound'];
attack[0][4].vulnerability_pre = top_vulnerabilities; 
attack[0][4].vulnerability_post = [];
attack[0][4].focuses = ground_and_pound_focuses;

attack[1][0].name = 'takedown';
attack[1][0].target = ['takedown'];
attack[1][0].vulnerability_pre = standing_vulnerabilities; 
attack[1][0].vulnerability_post = takedown_vulnerabilities;
attack[1][0].focuses = standing_focuses;

attack[1][1].name = 'striking';
attack[1][1].target = ['strike'];
attack[1][1].vulnerability_pre = standing_vulnerabilities;
attack[1][1].vulnerability_post = standing_vulnerabilities; 
attack[1][1].focuses = standing_focuses;

