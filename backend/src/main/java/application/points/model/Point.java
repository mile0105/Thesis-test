package application.points.model;

import java.math.BigDecimal;

public class Point {
    private final BigDecimal x;
    private final BigDecimal y;
    private final BigDecimal z;
    private final double color;

    public Point(BigDecimal x, BigDecimal y, BigDecimal z, double color) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.color = color;
    }

    public double getColor() {
        return color;
    }

    public BigDecimal getX() {
        return x;
    }

    public BigDecimal getY() {
        return y;
    }

    public BigDecimal getZ() {
        return z;
    }
}
