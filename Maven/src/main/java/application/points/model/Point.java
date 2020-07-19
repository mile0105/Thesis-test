package application.points.model;

//import org.json.simple.JSONObject;

import java.math.BigDecimal;

public class Point {
    private final BigDecimal x;
    private final BigDecimal y;
    private final double color;

    public Point(BigDecimal x, BigDecimal y, double color) {
        this.x = x;
        this.y = y;
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
}
