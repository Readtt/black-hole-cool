class Particle {
    constructor(x, y, mass) {
        this.mass = mass;
        this.radius = mass * 8 / 2;
        this.pos = createVector(x, y)
        this.vel = createVector(1, 0)
        this.acceleration = createVector(0, 0)
    }
    applyForce(force) {
        let f = p5.Vector.div(force, this.mass);
        this.acceleration.add(f);
    }
    update() {
        this.vel.add(this.acceleration);
        this.pos.add(this.vel);
        this.acceleration.mult(0); // remove one of these
    }
    display() {
        if (options.outline == true) {
            stroke(0)
            strokeWeight(2)
        } else {
            noStroke()
        }
        fill(255);
        ellipse(this.pos.x, this.pos.y, this.radius * 2);
    }
}