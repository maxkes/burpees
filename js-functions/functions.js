let arrow_up_right = `
    <svg class="bi bi-arrow-up-right" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" d="M6.5 4a.5.5 0 01.5-.5h5a.5.5 0 01.5.5v5a.5.5 0 01-1 0V4.5H7a.5.5 0 01-.5-.5z" clip-rule="evenodd"/>
    <path fill-rule="evenodd" d="M12.354 3.646a.5.5 0 010 .708l-9 9a.5.5 0 01-.708-.708l9-9a.5.5 0 01.708 0z" clip-rule="evenodd"/>
    </svg>
`;

let arrow_down_right = `
    <svg class="bi bi-arrow-down-right" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" d="M12 7.5a.5.5 0 01.5.5v5a.5.5 0 01-.5.5H7a.5.5 0 010-1h4.5V8a.5.5 0 01.5-.5z" clip-rule="evenodd"/>
      <path fill-rule="evenodd" d="M2.646 3.646a.5.5 0 01.708 0l9 9a.5.5 0 01-.708.708l-9-9a.5.5 0 010-.708z" clip-rule="evenodd"/>
    </svg>
`;


var timer = {
    timestamp_last: 0
};

var storage = {
    sections: 2,
    figure_steps: 6,

    // the "delay after" includes also the time for the action (jumping, walking)
    // all in ms
    // after every step
    delay_step: 300,
    // extra time after all steps, before the jumps
    delay_walk_pattern: 1000,
    // after every jump
    delay_jump: 1000,
    // extra time after the jumps, before the next walking pattern
    delay_jumps: 1000,

    // intern data
    all_steps_and_jumps: [],
    all_steps_and_jumps_counter: 1,
    all_steps_and_jumps_number: 0
};

var interval; // for function

var add_burpee = function(up_or_down, section, burpee, delay) {
    let new_object = {
        number: storage.all_steps_and_jumps_counter,
        up_or_down: up_or_down,
        section: section,
        step_or_burpee: "burpee",
        burpee: burpee,
        delay: delay
    };
    storage.all_steps_and_jumps.push(new_object);
    storage.all_steps_and_jumps_counter++;
};

var add_step = function(up_or_down, section, figure, step, delay) {
    let new_object = {
        number: storage.all_steps_and_jumps_counter,
        up_or_down: up_or_down,
        section: section,
        step_or_burpee: "step",
        figure: figure,
        step:step,
        delay: delay
    };
    storage.all_steps_and_jumps.push(new_object);
    storage.all_steps_and_jumps_counter++;
};

var figures_and_burpees = function(section, up_or_down) {
    // sections
    for (let k = 1; k <= section; k++) {
        // walking patterns
        for (let l = 1; l <= storage.figure_steps; l++) {
            let delay = 0;
            if (l === storage.figure_steps) {
                delay = storage.delay_step + storage.delay_walk_pattern;
            } else {
                delay = storage.delay_step;
            }
            add_step(up_or_down, section, k, l, delay);
        }
    }

    for (let k = 1; k <= section; k++) {
        let delay = 0;
        if (k === section) {
            delay = storage.delay_jump + storage.delay_jumps;
        } else {
            delay = storage.delay_jump;
        }
        add_burpee(up_or_down, section, k, delay);
    }
};

var calculate_all = function () {
    storage.all_steps_and_jumps = [];
    storage.all_steps_and_jumps_counter = 0;
    let up_or_down = "up";
    for (let k = 1; k <= storage.sections; k++) {
        figures_and_burpees(k, up_or_down);
    }
    up_or_down = "down";
    for (let k = storage.sections - 1; k > 0; k--) {
        figures_and_burpees(k, up_or_down);
    }
    storage.all_steps_and_jumps_number = storage.all_steps_and_jumps_counter;
};

var check_for_next = function() {
    let timestamp =   new Date().getTime();
    if (storage.all_steps_and_jumps_counter === 0) {
        // first step, execute immediately
        console.log(storage.all_steps_and_jumps[storage.all_steps_and_jumps_counter]);
        timer.timestamp_last = timestamp;
        update_timer_DOM(storage.all_steps_and_jumps_counter);
        storage.all_steps_and_jumps_counter++;
    }else {
        if (timestamp > storage.all_steps_and_jumps[storage.all_steps_and_jumps_counter - 1].delay + timer.timestamp_last) {
            console.log(storage.all_steps_and_jumps[storage.all_steps_and_jumps_counter]);
            timer.timestamp_last = timestamp;
            update_timer_DOM(storage.all_steps_and_jumps_counter);
            storage.all_steps_and_jumps_counter++;
        }
    }


  if (storage.all_steps_and_jumps_counter === storage.all_steps_and_jumps_number - 1) {
      clearInterval(interval);
  }
};

var do_all = function () {
    calculate_all();
    storage.all_steps_and_jumps_counter = 0;
    interval = setInterval(check_for_next, 100);
};

var abort_all = function () {
    clearInterval(interval);
};

let update_timer_DOM = function (current) {
    let data = storage.all_steps_and_jumps[current];
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

