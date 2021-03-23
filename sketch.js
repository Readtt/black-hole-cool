let particles = [],
    blackHoles = [],
    gui,
    canvasX, canvasY, options, isHitting;

function setup() {
    canvasX = windowWidth;
    canvasY = windowHeight;
    isHitting = false;
    options = {
        trail: false,
        particles: 10,
        maxMass: 65,
        outline: false,
        displayFps: false,
        FPS: 60,
        NUMBlackHoles: false,
        eatBlackHoles: false,
        eatParticles: false,
        particleRandom: false,
        scale: 1,
        displayScale: false
    }
    createCanvas(canvasX, canvasY)
    gui = new dat.GUI();
    gui.add(options, 'particles', 1, 100, 1)
    gui.add(options, 'maxMass', 1, 65, 1)
    gui.add(options, 'trail', true, false)
    gui.add(options, 'outline', true, false)
    gui.add(options, 'displayFps', true, false)
    gui.add(options, 'FPS', 1, 60, 1)
    gui.add(options, 'NUMBlackHoles', true, false)
    gui.add(options, 'eatBlackHoles', true, false)
    gui.add(options, 'eatParticles', true, false)
    gui.add(options, 'particleRandom', true, false)
    gui.add(options, 'displayScale', true, false)
}

function draw() {
    if (options.trail == true) {
        background(0, 0, 0, 4)
    } else {
        background(31, 31, 31, 255);
    }
    frameRate(options.FPS)
    if (options.displayFps) {
        textAlign(CENTER, CENTER);
        textSize(15);
        text("FPS: " + parseInt(frameRate()), 10 + 20, 10);
    }
    if (options.NUMBlackHoles) {
        if (options.displayFps == false) {
            textAlign(CENTER, CENTER);
            textSize(15);
            text("Black Holes: " + blackHoles.length, 10 + 50, 10);
        } else {
            textAlign(CENTER, CENTER);
            textSize(15);
            text("Black Holes: " + blackHoles.length, 10 + 50, 35);
        }
    }
    if (options.displayScale) {
        textAlign(CENTER, CENTER);
        textSize(15);
        text("Scale: " + options.scale.toFixed(2), 10 + 50, windowHeight / 2 * 1.9 + 10);
    }

    scale(options.scale)

    for(let h = 0; h < blackHoles.length; h++) {
        if(blackHoles[h].mass > options.maxMass) {
            blackHoles[h].mass = options.maxMass;
        }
    }

    if (particles.length < options.particles || particles.length > options.particles) {
        if (particles.length > options.particles) {
            for (let p = 0; p < particles.length - options.particles; p++) {
                particles.pop()
            }
        } else {
            if (options.particleRandom) {
                particles.push(new Particle(random(1, canvasX), random(1, canvasY), 1))
            } else {
                particles.push(new Particle(40, 40, 1))
            }
        }
    }

    if (blackHoles.length == 0) {
        for (let k = 0; k < particles.length; k++) {
            particles[k].update()
            particles[k].display()
        }
    } else {
        for (let i = 0; i < blackHoles.length; i++) {
            if (options.eatBlackHoles) {} else {
                for (let u = 0; u < blackHoles.length; u++) {
                    if (i != u && dist(blackHoles[u].pos.x, blackHoles[u].pos.y, blackHoles[i].pos.x, blackHoles[i].pos.y) < blackHoles[i].mass * 2 + blackHoles[u].mass * 2) {
                        blackHoles[i].collide(blackHoles[u])
                    }
                }
            }
            for (let b = 0; b < particles.length; b++) {
                if (options.eatParticles) {
                    for (let j = 0; j < blackHoles.length; j++) {
                        let d = dist(particles[b].pos.x, particles[b].pos.y, blackHoles[j].pos.x, blackHoles[j].pos.y)
                        if (d < particles[b].radius * 2 + blackHoles[j].mass * 2) {
                            particles.splice(b, 1)
                            isHitting = true;
                        } else {
                            isHitting = false;
                        }
                    }

                    if (!isHitting) {
                        let force = blackHoles[i].attract(particles[b]);
                        particles[b].applyForce(force);
                        particles[b].update();
                        blackHoles[i].display();
                        particles[b].display();
                    }
                } else {
                    let force = blackHoles[i].attract(particles[b]);
                    particles[b].applyForce(force);
                    particles[b].update();
                    blackHoles[i].display();
                    particles[b].display();
                }
            }
        }
    }
}

function keyPressed() {
    if (keyCode == 46 || keyCode == 8) {
        for (let i = 0; i < blackHoles.length; i++) {
            let d = dist(mouseX, mouseY, blackHoles[i].pos.x, blackHoles[i].pos.y)
            if (d < blackHoles[i].mass * 2) {
                blackHoles.splice(i, 1)
            }
        }
    }
    if (keyCode == 187) {
        options.scale *= 1.05;
    } else if (keyCode == 189) {
        options.scale *= 0.95;
    }
    if (keyCode == 82) {
        resetScale()
    }
}

function resetScale() {
    notification("Scale was reset to 1.00", "success")
    options.scale = 1
}

function mouseDragged() {
    if (options.scale != 1) {} else {
        for (let i = 0; i < blackHoles.length; i++) {
            let d = dist(mouseX, mouseY, blackHoles[i].pos.x, blackHoles[i].pos.y)
            if (d < blackHoles[i].mass * 2) {
                if (options.eatBlackHoles) {
                    for (let k = 0; k < blackHoles.length; k++) {
                        if (i != k && dist(blackHoles[k].pos.x, blackHoles[k].pos.y, blackHoles[i].pos.x, blackHoles[i].pos.y) < blackHoles[i].mass * 2 + blackHoles[k].mass * 2) {
                            if (blackHoles[i].mass + blackHoles[k].mass >= options.maxMass) {
                                //blackHoles[i].mass = parseInt(options.maxMass)
                                blackHoles[i].mass += 1
                                blackHoles.splice(k, 1);
                            } else {
                                blackHoles[i].mass += blackHoles[k].mass;
                                blackHoles.splice(k, 1);
                            }
                        }
                    }
                } else {
                    for (let k = 0; k < blackHoles.length; k++) {
                        if (i != k && dist(blackHoles[k].pos.x, blackHoles[k].pos.y, blackHoles[i].pos.x, blackHoles[i].pos.y) < blackHoles[i].mass * 2 + blackHoles[k].mass * 2) {
                            blackHoles[i].collide(blackHoles[k])
                        }
                    }
                }
                blackHoles[i].pos.x = mouseX;
                blackHoles[i].pos.y = mouseY;
            }
        }
    }
}

function notification(msg, stus) {
    UIkit.notification({
        message: msg,
        status: stus,
        pos: 'top-center',
        timeout: 2000
    });
}

function mousePressed() {
    if (options.scale != 1) {
        if (mouseY >= canvasY) {} else {
            if (mouseX > gui.domElement.getBoundingClientRect().left && mouseX < gui.domElement.getBoundingClientRect().left + gui.domElement.clientWidth && mouseY > gui.domElement.getBoundingClientRect().top && mouseY < gui.domElement.getBoundingClientRect().top + gui.domElement.clientHeight + document.querySelector("body > div > div > div.close-button").getBoundingClientRect().top) {} else {
                notification("You can only place black holes\nwhen the zoom is reset! (Reset by pressing R)", "warning")
            }
        }
    } else {
        if (blackHoles.length == 0) {
            if (mouseY >= canvasY) {} else {
                if (mouseX > gui.domElement.getBoundingClientRect().left && mouseX < gui.domElement.getBoundingClientRect().left + gui.domElement.clientWidth && mouseY > gui.domElement.getBoundingClientRect().top && mouseY < gui.domElement.getBoundingClientRect().top + gui.domElement.clientHeight + document.querySelector("body > div > div > div.close-button").getBoundingClientRect().top) {} else {
                    blackHoles.push(new BlackHole(mouseX, mouseY))
                }
            }
        } else {
            if (mouseY >= canvasY) {} else {
                if (mouseX > gui.domElement.getBoundingClientRect().left && mouseX < gui.domElement.getBoundingClientRect().left + gui.domElement.clientWidth && mouseY > gui.domElement.getBoundingClientRect().top && mouseY < gui.domElement.getBoundingClientRect().top + gui.domElement.clientHeight + document.querySelector("body > div > div > div.close-button").getBoundingClientRect().top) {} else {
                    for (let i = 0; i < blackHoles.length; i++) {
                        let d = dist(mouseX, mouseY, blackHoles[i].pos.x, blackHoles[i].pos.y)
                        if (d < blackHoles[i].mass * 2) {
                            return;
                        } else {
                            continue;
                        }
                    }
                    blackHoles.push(new BlackHole(mouseX, mouseY))
                }
            }
        }
    }
}

function mouseWheel(event) {
    var wheel;
    if (event.delta < 0) {
        wheel = "up"
    } else {
        wheel = "down"
    }
    for (let i = 0; i < blackHoles.length; i++) {
        let d = dist(mouseX, mouseY, blackHoles[i].pos.x, blackHoles[i].pos.y)
        if (d < (blackHoles[i].mass * 2)) {
            if (wheel == "up") {
                if ((blackHoles[i].mass + 1) >= options.maxMass) {} else {
                    blackHoles[i].mass = blackHoles[i].mass + 1
                }
            } else if (wheel == "down") {
                if ((blackHoles[i].mass - 1) <= 10) {} else {
                    blackHoles[i].mass = blackHoles[i].mass - 1
                }
            }
        }
    }
}

function windowResized() {
    resizeCanvas(canvasX, canvasY);
}