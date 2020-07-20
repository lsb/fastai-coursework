import React from 'react';
import './App.css';
import Webcam from 'react-webcam';
import { dataURLToBlob } from 'blob-util';

const INFERENCE_ENDPOINT = "https://redacting-camera.onrender.com/redact"

const videoConstraints = {
  width: 240*4,
  height: 240*4,
};

const codes = ['Animal', 'Archway', 'Bicyclist', 'Bridge', 'Building', 'Car', 'CartLuggagePram', 'Child', 'Column_Pole', 'Fence', 'LaneMkgsDriv', 'LaneMkgsNonDriv', 'Misc_Text', 'MotorcycleScooter', 'OtherMoving', 'ParkingBlock', 'Pedestrian', 'Road', 'RoadShoulder', 'Sidewalk', 'SignSymbol', 'Sky', 'SUVPickupTruck', 'TrafficCone', 'TrafficLight', 'Train', 'Tree', 'Truck_Bus', 'Tunnel', 'VegetationMisc', 'Void', 'Wall'];

const nameToCamvidTags = new Map([
  ["no people (for street rallies)", ['Bicyclist', 'Child', 'MotorcycleScooter', 'Pedestrian', 'Truck_Bus','Void']],
  ['ban cars', ['Car', 'SUVPickupTruck']],
  ['no sky, no trees', ['Sky', 'Tree', 'VegetationMisc']],
  ['nothing uncertain', ['Void']],
]);

const nameToCamvidIdxs = new Map(
  Array.from(nameToCamvidTags).map(([friendly, strings]) => [friendly, new Set(strings.map(s => codes.indexOf(s)))] )
);

const camvidIdxsToName = new Map(
  Array.from(nameToCamvidIdxs).map(([friendly, idxs]) => [idxs, friendly])
);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      originalPicture: null,
      processedPicture: null,
      categories: nameToCamvidIdxs.get('no people (for street rallies)'),
      facingMode: "environment",
    };
    this.webcamref = React.createRef();
  }
  parameterizeEndpoint() {
    return INFERENCE_ENDPOINT + "?categories=" + Array.from(this.state.categories).join(',');
  }
  componentDidMount() {
    this.handleWebcam();
  }
  handleWebcam() {
    if(this.webcamref && this.webcamref.current && this.webcamref.current.getScreenshot) {
      const screenshot = this.webcamref.current.getScreenshot();
      if (screenshot !== null) {
          this.ingestPicture(screenshot);
      } else {
        console.log('screenshot is null, might be still loading');
        requestAnimationFrame(() => this.handleWebcam());

      }
    }
  }
  async ingestPicture(originalPicture) {
    const startDate = Date.now();
    const firstPicture = this.state.originalPicture === null && this.state.processedPicture === null;
    if (firstPicture) { this.setState({processedPicture: originalPicture})}
    this.setState({originalPicture});
    const formdata = new FormData();
    formdata.append('image', dataURLToBlob(originalPicture));
    const parameterizedEndpoint = this.parameterizeEndpoint();
    const redaction = await fetch(parameterizedEndpoint, {
      method: "POST",
      body: formdata,
    });
    const redactedBlob = await redaction.blob();
    const endDate = Date.now();
    requestAnimationFrame(() => this.handleWebcam());
    this.setState({processedPicture: URL.createObjectURL(redactedBlob), millis: endDate-startDate});
  }
  toggleCode({checked, i}) {
    const newcats = new Set(this.state.categories);
    checked ? newcats.add(i) : newcats.delete(i);
    this.setState({categories: newcats});
  }
  render() {
    const {processedPicture, millis, facingMode, categories} = this.state;
    return <div className="App">
      <h1>Redacting Camera</h1>
      <h2>
        via your&nbsp;<select id="facingMode" onChange={e => this.setState({facingMode: e.target.value})} value={this.state.facingMode}>
         <option value="user">selfie</option>
         <option value="environment">photo</option>
         <option value=""></option>
        </select>&nbsp;<i>webcam!</i>
      </h2>
      <div className="millis">{millis}</div>
      <div>
        <span id="processed">
          <img src={processedPicture} className="processedPicture" />
        </span>
      </div>
      <div id="howtoredact">
        <div><i>how to redact‽</i></div>
        <div>
          <select
            id="categorygroupname"
            onChange={e => !nameToCamvidIdxs.has(e.target.value) ? this.setState({justChoseDIY: true}) : this.setState({categories: nameToCamvidIdxs.get(e.target.value), justChoseDIY: false})}
            value={this.state.justChoseDIY || !camvidIdxsToName.has(this.state.categories) ? 'diy' : camvidIdxsToName.get(this.state.categories)}
          >
            {Array.from(nameToCamvidIdxs.keys()).map(k => (<option value={k}>{k}</option> ))}
            <option value="diy">diy</option>
          </select>
        </div>
        <div id="codescheckboxes">
          {codes.map((e,i) => (<label><input type="checkbox" checked={categories.has(i)} onChange={e => this.toggleCode({checked: e.target.checked, i})} />{e}</label>) )}
        </div>
      </div>
      <Webcam
        audio={false}
        ref={this.webcamref}
        height={videoConstraints.height}
        width={videoConstraints.width}
        screenshotFormat="image/jpeg"
        videoConstraints={{...videoConstraints, facingMode}}
      />
    </div>
  }
}

export default App;
