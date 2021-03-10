package application.stations.service;

import application.stations.model.Station;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.stereotype.Service;

import java.io.FileReader;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class StationService {

    JSONParser parser = new JSONParser();


    public List<Station> readStations() throws Exception{
        String fileName = "C:\\Users\\Mile\\Desktop\\Thesis stuff\\files\\Stacje.geojson";

        Object parse = parser.parse(new FileReader(fileName));
        JSONObject jsonObject = (JSONObject) parse;

        return mapToStations(jsonObject);
    }

    private List<Station> mapToStations(JSONObject object) {

        List<Station> stations = new ArrayList<>();

        JSONArray features = (JSONArray) object.get("features");
        for (Object feat : features) {
            JSONObject feature = (JSONObject)feat;
            JSONObject properties = (JSONObject)feature.get("properties");
            BigDecimal x = BigDecimal.valueOf((Double) properties.get("X"));
            BigDecimal y = BigDecimal.valueOf((Double) properties.get("Y"));
            BigDecimal pm10 = BigDecimal.valueOf((Double) properties.get("PM10_avg"));

            stations.add(new Station(x, y, pm10));
        }


        return stations;
    }
}
