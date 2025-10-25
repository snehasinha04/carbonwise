const express = require("express");
const cors = require("cors");

const port = 3001;
const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.post("/calculate", (req, res) => {
  try {
    const {
      electricityUsageKWh,
      transportationUsageGallonsPerMonth,
      shortFlight,
      mediumFlight,
      longFlight,
      dietaryChoice,
    } = req.body;

    // Factors
    const electricityFactor = 0.3978;
    const transportationFactor = 9.087;
    const shortFlightFactor = 100;
    const mediumFlightFactor = 200;
    const longFlightFactor = 300;
    const dietaryChoiceFactor = {
      vegan: 200,
      vegetarian: 400,
      pescatarian: 600,
      meateater: 800,
    };
    const year = 12;

    // Calculations
    const electricityEmission = electricityUsageKWh * electricityFactor;
    const transportationEmission = transportationUsageGallonsPerMonth * transportationFactor;
    const airTravelShortFlight = shortFlight * shortFlightFactor;
    const airTravelMediumFlight = mediumFlight * mediumFlightFactor;
    const airTravelLongFlight = longFlight * longFlightFactor;

    const dietaryChoiceEmission = dietaryChoiceFactor[dietaryChoice?.toLowerCase()] || 0;
    const totalEmissionFlight =
      airTravelShortFlight + airTravelMediumFlight + airTravelLongFlight;
    const totalElectricityUsage = electricityEmission * year;
    const totalTransportationUsage = transportationEmission * year;

    const totalYearlyEmissions =
      dietaryChoiceEmission + totalEmissionFlight + totalElectricityUsage + totalTransportationUsage;

    // Response JSON
    const result = {
      totalYearlyEmissions: { value: totalYearlyEmissions, unit: "kgCO2/year" },
      totalTransportationUsage: { value: totalTransportationUsage, unit: "kgCO2/year" },
      totalElectricityUsage: { value: totalElectricityUsage, unit: "kgCO2/year" },
      totalEmissionFlight: { value: totalEmissionFlight, unit: "kgCO2/year" },
      dietaryChoiceEmission: { value: dietaryChoiceEmission, unit: "kgCO2/year" },
    };

    res.json(result);
    
  } catch (err) {
    console.error("Error calculating CO2 emissions: ", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});
