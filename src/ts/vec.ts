export class Vec2 {
  public x: number;
  public y: number;

  public constructor (_x = 0, _y = 0) {
    this.x = _x
    this.y = _y
  }

  public sum (other: Vec2) {
    return new Vec2(this.x + other.x, this.y + other.y)
  }

  public product (mult: number) {
    return new Vec2(this.x * mult, this.y * mult)
  }

  public rotated (radians: number) {
    const cos = Math.cos(radians)
    const sin = Math.sin(radians)

    return new Vec2(cos * this.x - sin * this.y, sin * this.x + cos * this.y)
  }
}
