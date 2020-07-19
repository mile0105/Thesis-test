package application.points;

import application.points.model.Point;
import application.points.service.PointsService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:1234")
public class PointsController {

    private final PointsService pointsService;

    public PointsController(PointsService pointsService) {
        this.pointsService = pointsService;
    }

    @GetMapping(value = "/", produces = "application/json")
    public List<Point> getPoints() {
        return pointsService.getPoints();
    }
}
