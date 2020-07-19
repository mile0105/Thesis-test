package application.points.service;

import application.points.model.Point;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class PointsService {

    private double maxColorValue;
    private double minColorValue;

    public List<Point> getPoints() {
        String fileName = "Tricity_eudem_xyz.bin";
        List<String> fileLines = readFileAndSetColors(fileName);
        return mapToPoints(fileLines);
    }

    private List<String> readFileAndSetColors(String fileName) {
        List<String> lines = new ArrayList<>();

        maxColorValue = Double.MIN_VALUE;
        minColorValue = Double.MAX_VALUE;

        try {

            File file = ResourceUtils.getFile("classpath:bin\\" + fileName);
            final BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(file)));
            String line;
            while((line = reader.readLine()) != null) {
                lines.add(line);
                final String[] splits = line.split(" ",3);
                final double current = Double.parseDouble(splits[2]);

                if (current > maxColorValue) {
                    maxColorValue = current;
                }

                if(current < minColorValue) {
                    minColorValue = current;
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return lines;
    }

    private List<Point> mapToPoints(List<String> lines) {

        final List<Point> points = new ArrayList<>();
        for (final String line: lines) {
            final String[] split = line.split(" ", 3);
            final BigDecimal x = new BigDecimal(split[0]);
            final BigDecimal y = new BigDecimal(split[1]);
            final double z = Double.parseDouble(split[2]);

            final double color = (z - minColorValue) * 255 / (maxColorValue - minColorValue);

            points.add(new Point(x, y ,color));
        }
        return points;
    }
}
