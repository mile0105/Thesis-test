package application.stations;


import application.stations.model.Station;
import application.stations.service.StationService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin("http://localhost:1234")
public class StationsController {

    private final StationService stationService;

    public StationsController(StationService stationService) {
        this.stationService = stationService;
    }

    @GetMapping(value = "/stations", produces = "application/json")
    public List<Station> readStations() {
        try {
            return stationService.readStations();
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
}
