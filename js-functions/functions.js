import {arrow_up_right, arrow_down_right} from "./includes/icons.js";
import {how_much, timings} from "./includes/variables.js";

export {how_much} from "./includes/variables.js";

var timer = {
    timestamp_last: 0
};

var all_steps_and_jumps = [];
var all_steps_and_jumps_counter = 1;
var all_steps_and_jumps_number;

var interval; // for function

var add_burpee = function(up_or_down, section, burpee, delay) {
    let new_object = {
        number: all_steps_and_jumps_counter,
        up_or_down: up_or_down,
        section: section,
        step_or_burpee: "burpee",
        burpee: burpee,
        delay: delay
    };
    all_steps_and_jumps.push(new_object);
    all_steps_and_jumps_counter++;
};

var add_step = function(up_or_down, section, figure, step, delay) {
    let new_object = {
        number: all_steps_and_jumps_counter,
        up_or_down: up_or_down,
        section: section,
        step_or_burpee: "step",
        figure: figure,
        step:step,
        delay: delay
    };
    all_steps_and_jumps.push(new_object);
    all_steps_and_jumps_counter++;
};

var figures_and_burpees = function(section, up_or_down) {
    // sections
    for (let k = 1; k <= section; k++) {
        // walking patterns
        for (let l = 1; l <=how_much.figure_steps; l++) {
            let delay = 0;
            if (l === how_much.figure_steps) {
                delay = timings.delay_step+timings.delay_walk_pattern;
            } else {
                delay = timings.delay_step;
            }
            add_step(up_or_down, section, k, l, delay);
        }
    }

    for (let k = 1; k <= section; k++) {
        let delay = 0;
        if (k === section) {
            delay = timings.delay_jump + timings.delay_jumps;
        } else {
            delay  = timings.delay_jump;
        }
        add_burpee(up_or_down, section, k, delay);
    }
};

export var calculate_all = function () {
    all_steps_and_jumps = [];
    all_steps_and_jumps_counter = 0;
    let up_or_down = "up";
    for (let k = 1; k <= how_much.sections; k++) {
        figures_and_burpees(k, up_or_down);
    }
    up_or_down = "down";
    for (let k = how_much.sections-1; k > 0; k--) {
        figures_and_burpees(k, up_or_down);
    }
    all_steps_and_jumps_number = all_steps_and_jumps_counter;
};

var check_for_next = function() {
    let timestamp =   new Date().getTime();
    if (all_steps_and_jumps_counter === 0) {
        // first step, execute immediately
        console.log(all_steps_and_jumps[all_steps_and_jumps_counter]);
        timer.timestamp_last = timestamp;
        update_timer_DOM(all_steps_and_jumps_counter);
        all_steps_and_jumps_counter++;
    }else {
        if (timestamp > all_steps_and_jumps[all_steps_and_jumps_counter - 1].delay + timer.timestamp_last) {
            console.log(all_steps_and_jumps[all_steps_and_jumps_counter]);
            timer.timestamp_last = timestamp;
            update_timer_DOM(all_steps_and_jumps_counter);
            all_steps_and_jumps_counter++;
        }
    }


  if (all_steps_and_jumps_counter === all_steps_and_jumps_number - 1) {
      clearInterval(interval);
  }
};

export var do_all = function() {
    all_steps_and_jumps_counter = 0;
    interval = setInterval(check_for_next, 100);
};

export var abort_all = function() {
    clearInterval(interval);
};

let update_timer_DOM = function (current) {
    let data = all_steps_and_jumps[current];
    if (data.step_or_burpee === "step") {
        let main = document.getElementById("step_burpee");
        main.textContent = data.figure + "-" + data.step;
        main.style.color = "blue";
    } else if (data.step_or_burpee === "burpee") {
        let main = document.getElementById("step_burpee");
        main.textContent = data.burpee;
        main.style.color = "red";
    }
    let uod = document.getElementById("up_down");
    if (data.up_or_down === "up") {
        uod.innerHTML = arrow_up_right + " " + data.up_or_down + " " + arrow_up_right;
    } else if (data.up_or_down === "down") {
        uod.innerHTML = arrow_down_right + " " + data.up_or_down + " " + arrow_down_right;
    }

    let section = document.getElementById("section");
    section.textContent = data.section;
};

export var print_current_settings = function () {
    let list = document.getElementById("list_of_settings");
    list.innerHTML = "";
    let li1 = document.createElement("li");
    li1.appendChild(document.createTextNode('Burpees bis: ' + how_much.sections));
    list.appendChild(li1);
    let li2 = document.createElement("li");
    li2.appendChild(document.createTextNode('Zeit pro Schritt: ' + (timings.delay_step/1000).toFixed(2) + ' s'));
    list.appendChild(li2);
    let li3 = document.createElement("li");
    li3.appendChild(document.createTextNode('Zeit pro Burpee: ' + (timings.delay_jumps/1000).toFixed(2) + ' s'));
    list.appendChild(li3);

};
