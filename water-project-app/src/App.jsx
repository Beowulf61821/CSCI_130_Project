import { useState } from 'react'
import { useEffect } from 'react'
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import './App.css'

function App() {

  //const [acPond, setAcPond] = useState(0);
  //const [longSide, setLongSide] = useState(0);
  //const [shortSide, setShortSide] = useState(0);
  //const [topLevee, setTopLevee] = useState(0);
  //const [pondSlope, setPondSlope] = useState(0);
  //const [freeboard, setFreeBoard] = useState(0);
  //const [waterDepth, setWaterDepth] = useState(0);
  //const [soilType, setSoilType] = useState("");
  //const [infiltrationRate, setInfiltrationRate] = useState(0);
  const [wetFrequency, setWetFrequency] = useState(0);
  const [wetDuration, setWetDuration] = useState(0);
  const [landCost, setLandCost] = useState(0);
  const [pipeline, setPipeline] = useState(0);
  const [earthwork, setEarthwork] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [loanDuration, setLoanDuration] = useState(0);
  const [rechargeWaterCost, setRechargeWaterCost] = useState(0);
  const [storedWaterValue, setStoredWaterValue] = useState(0);
  const [om, setOM] = useState(0);

  const area = 0.25;
  const perimeter = 10560;
  const levee = 10951;
  const leveeCost = Number(levee) * Number(earthwork);
  const wettedArea = 156;
  const landPurchase = 160 * Number(landCost);
  const pipeInletCost = 20000;
  const pipelineCost = Number(pipeline) * 200;
  const subtotal = Number(landPurchase) + Number(leveeCost) + Number(pipeInletCost) + Number(pipelineCost);
  const contingency = Math.round(Number(subtotal) * 0.2);
  const totalEstimate = Number(subtotal) + Number(contingency);
  const annualavgRechargeDepth = 94;
  const netRecharge = Number(annualavgRechargeDepth) * 30 * Number(wetDuration) * Number(wetFrequency / 100) * 0.7;
  const annualCapitalFirst = Number(totalEstimate) * Number(interestRate/100) * (Number(1 + (interestRate/100)) ** loanDuration);
  const annualCapitalSecond = (Number(1 + (interestRate/100)) ** loanDuration) - 1;
  const annualCapitalPayment = Math.round(annualCapitalFirst / annualCapitalSecond);
  const annualCapitalPerAcreFoot = annualCapitalPayment / netRecharge;
  const totalAnnualCapitalPerAcreFoot = Number(annualCapitalPerAcreFoot) + Number(om) + Number(rechargeWaterCost);
  const netBenefit = storedWaterValue - totalAnnualCapitalPerAcreFoot;
  const costValue = ((rechargeWaterCost + om) * netRecharge + wettedArea);
  const benefitValue = netRecharge * storedWaterValue;
  const roiBenefitValue = benefitValue - costValue;
  const npvFirst = costFunc(totalEstimate, interestRate, loanDuration);
  const npvSecond = benefitFunc(benefitValue, interestRate, loanDuration);
  const bcRatio = npvSecond / npvFirst;
  const roiVal = roi(totalEstimate, roiBenefitValue, loanDuration);

  useEffect(() => {
    if (L.DomUtil.get("map") !== null) {
      L.DomUtil.get("map")._leaflet_id = null;
    }
    // Initialize the map
    const map = L.map("map").setView([51.505, -0.09], 13);

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map);

    var marker = L.marker([51.5, -0.09]).addTo(map);

    var circle = L.circle([51.508, -0.11], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 500
    }).addTo(map);

    var polygon = L.polygon([
      [51.509, -0.08],
      [51.503, -0.06],
      [51.51, -0.047]
    ]).addTo(map);

    marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
    circle.bindPopup("I am a circle.");
    polygon.bindPopup("I am a polygon.");

    var popup = L.popup();

    function onMapClick(e) {
      popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
    }

    map.on('click', onMapClick);
  }, []);


  function costFunc(total, cost, interest, years) {
    let tempVal = (Number(total)/((1+(interest/100))**1));
    for(let i = 1; i <= years; i++) {
      tempVal += Number(cost)/((1+(interest/100))**i);
    }
    return tempVal;
  };

  function benefitFunc(benefitVal, interest, years) {
    let tempVal = 0;
    for(let i = 1; i <= years; i++) {
      tempVal += Number(benefitVal)/((1+(interest/100))**i);
    }
    return tempVal;
  };

  function roi(total, netBenVal, years) {
    let r = 0;
    let i = 0;
    const barrier = 0.00001;

    while (i < 100000) {
      let npv = -total;
      for(let y = 1; y < years; y++) {
        npv += (netBenVal/((1 + r)**y));
      }

      if(Math.abs(npv) < barrier) {
        return r;
      }

      r += 0.000145;
      i++;
    }
    return r;
  };




  function handleWetFrequency (e) {
    setWetFrequency(e.target.value);
  }

  function handleWetDuration (e) {
    setWetDuration(e.target.value);
  }

  function handleLandCost (e) {
    setLandCost(e.target.value);
  }

  function handlePipeline (e) {
    setPipeline(e.target.value);
  }

  function handleEarthwork (e) {
    setEarthwork(e.target.value);
  }

  function handleInterestRate (e) {
    setInterestRate(e.target.value);
  }

  function handleLoanDuration (e) {
    setLoanDuration(e.target.value);
  }

  function handleRechargeWaterCost (e) {
    setRechargeWaterCost(e.target.value);
  }

  function handleStoredWaterValue (e) {
    setStoredWaterValue(e.target.value);
  }

  function handleOM (e) {
    setOM(e.target.value);
  }

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
      <h1>CWI Recharge Basin Project</h1>
      <section className="navbar">
        <p><a className="item" href="#about-problem">Problem</a></p>
        <p><a className="item" href="#about-solution">Solution</a></p>
        <p><a className="item" href="#find-roi">Find ROI</a></p>
        <p><a className="item" href="#about-cwi">About Us</a></p>
      </section>
      <section id="about-problem">
        <h2>The Water Problem</h2>
        <p>Groundwater levels in California’s Central Valley are extremely low. When California is in a drought, groundwater level will become very low. When California has excess rain, the ground does not have enough time to percolate the water. This makes it so that we do not have enough excess water in case California goes into another dry spell.</p>
      </section>
      <section id="about-solution">
        <h2>Solution</h2>
        <p>To help address this, CWI wants to encourage farmers to repurpose unused land into water recharge basins. In order to make sure that farmers know what they are getting into and what kind of investment or benefits the are likely to expect with this, we decided that an easy application to calculate these investments. Users/Farmers need to just input into the appropriate input fields. Then, the calculator will do the rest of the work.</p>
      </section>
      <section id="find-roi">
        <h2>Find Return on Investment</h2>
        <p>If you are stuck on anything, please see the example calculation on the section.</p>
        <div id="map"></div>
        <form>
          <label>Enter wet year frequency percentage:
            <input type ="number" value ={wetFrequency} onChange={handleWetFrequency}></input>
            %
          </label>
        </form>
        <form>
          <label>Enter wet year duration(months):
            <input type="number" value={wetDuration} onChange={handleWetDuration}></input>
            months
          </label>
        </form>
        <form>
          <label>Enter land cost per acre:
            <input type="number" value ={landCost} onChange={handleLandCost}></input>
            /acre
          </label>
        </form>
        <form>
          <label>Enter pipeline length in ft:
            <input type="number" value={pipeline} onChange={handlePipeline}></input>
            ft
          </label>
        </form>
        <form>
          <label>Enter the cost of earthwork for each cubic yard:
            <input type="number" value={earthwork} onChange={handleEarthwork}></input>
            /cubic yard
          </label>
        </form>
        <form>
          <label>Enter interest rate:
            <input type="number" value={interestRate} onChange={handleInterestRate}></input>
            %
          </label>
        </form>
        <form>
          <label>Enter loan duration in years:
            <input type="number" value={loanDuration} onChange={handleLoanDuration}></input>
            yrs
          </label>
        </form>
        <form>
          <label>Enter the cost of recharge water per acre-ft:
            <input type ="number" value={rechargeWaterCost} onChange={handleRechargeWaterCost}></input>
            /af
          </label>
        </form>
        <form>
          <label>Enter the value of stored water per acre-ft:
            <input type="number" value={storedWaterValue} onChange={handleStoredWaterValue}></input>
            /af
          </label>
        </form>
        <form>
          <label>Enter O&M per acre-ft:
            <input type ="number" value={om} onChange={handleOM}></input>
            /af
          </label>
        </form>
        <p>Land Purchase: ${landPurchase}</p>
        <p>Eartwork: ${leveeCost}</p>
        <p>Pipeline Inlets: ${pipeInletCost}</p>
        <p>Pipeline Cost: ${pipelineCost}</p>
        <p>Subtotal: ${subtotal}</p>
        <p>Engineering and Contingency Cost: ${contingency}</p>
        <p>Total Estimate: ${totalEstimate}</p>
        <p>Annual Capital Payment: ${annualCapitalPayment}/year</p>
        <p>Average Annual Recharge Depth: {annualavgRechargeDepth}ft/day</p>
        <p>Net Recharge: ${netRecharge}ac ft/year</p>
        <p>Annualized Capital Cost per Acre foot: ${annualCapitalPerAcreFoot}/af</p>
        <p>Water Purchase Cost of Recharge Water: ${rechargeWaterCost}/af</p>
        <p>O&M Cost of Recharge and Basin Maintenance: ${om}/af</p>
        <p>Total Annualized Cost Per Acre Foot of Recharge Water: ${totalAnnualCapitalPerAcreFoot}/af</p>
        <p>Net Benefit: ${netBenefit}/af</p>
        <p>B/C Ratio: {bcRatio}</p>
        <p>ROI: {roiVal}%</p>
        <div id="map" style={{height: "180px"}}></div>
      </section>
      <section id="exampleCalculation">
        <h2>Example Calculation</h2>
        <p>This is an example calculation to help with anyone who is struggling with the calculations.</p>
      </section>
      <section id="about-cwi">
        <h2>About CWI</h2>
        <p>The California Water Institute(CWI) focuses on trying to provide sustainable water resource management solutions in the Central Valley.</p>
      </section>
    </>
  )
}

export default App
