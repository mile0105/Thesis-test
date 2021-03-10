package application.stations.model;


import java.math.BigDecimal;

public class Station {
    private final BigDecimal x;
    private final BigDecimal y;
    private final BigDecimal pm10Value;

    public Station(BigDecimal x, BigDecimal y, BigDecimal pm10Value) {
        this.x = x;
        this.y = y;
        this.pm10Value = pm10Value;
    }

    public BigDecimal getPm10Value() {
        return pm10Value;
    }


    public BigDecimal getY() {
        return y;
    }

    public BigDecimal getX() {
        return x;
    }
}
