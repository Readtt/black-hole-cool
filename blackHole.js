class BlackHole {
    constructor(x, y) {
        this.pos = createVector(x, y)
        this.mass = 10;
        this.G = 3;
        this.do = createVector(0, 0);
        this.dr = false;
        this.ro = false;
    }
    attract(particle) {
        let force = p5.Vector.sub(this.pos, particle.pos);
        let distance = force.mag();
        distance = constrain(distance, 5, 25);
        let strength = (this.G * this.mass * particle.mass) / (distance * distance);
        force.setMag(strength);
        return force;
    }
    display() {
        noStroke()
        fill(0);
        strokeWeight(random(1, 8));
        stroke(54);
        ellipse(this.pos.x, this.pos.y, this.mass * 2, this.mass * 2)
    }
    isOn(mx, my) {
        let d = dist(mx, my, this.pos.x, this.pos.y)
        if (d < this.mass) {
            return true;
        } else {
            return false;
        }
    }
    collide(bh) {
        let d = dist(bh.pos.x, bh.pos.y, this.pos.x, this.pos.y)
        let colDist = (bh.mass * 2 + this.mass * 2);
        if(d < colDist) {
            let angle = atan2(bh.pos.y - this.pos.y, bh.pos.x - this.pos.x);
            let targetX = this.pos.x + cos(angle) * colDist;
            let targetY = this.pos.y + sin(angle) * colDist;
            let ax = (targetX - bh.pos.x) * 0.05;
            let ay = (targetY - bh.pos.y) * 0.05;
            bh.pos.x += ax;
            bh.pos.y += ay;
        }
    }
}