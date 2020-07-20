import React from 'react';
import './App.css';
import Webcam from 'react-webcam';
import { dataURLToBlob } from 'blob-util';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const INFERENCE_ENDPOINT = "https://art-text-plant.onrender.com/identify";

const videoConstraints = {
  width: 256, //1280,
  height: 256, //720,
};

const ringBufferSize = 69  // ring buffers help u live in the moment
const makeRingBuffer = () => Array.from({length: ringBufferSize}, () => 1); // highcharts does not appreciate float32arrays coming in

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idx: 0,
      arts: makeRingBuffer(), texts: makeRingBuffer(), plants: makeRingBuffer(),
      picture: null, identification: null
    };
    this.webcamref = React.createRef();
  }
  componentDidMount() {
    this.handleWebcam();
  }
  handleWebcam() {
    if(this.webcamref && this.webcamref.current && this.webcamref.current.getScreenshot) {
      const screenshot = (this.webcamref.current.getScreenshot());
      if(screenshot !== null) {
        this.ingestPicture(screenshot);
      } else {
        console.log('screenshot is null');
        requestAnimationFrame(() => this.handleWebcam());
      }
    }
  }
  ingestStats({art,text,plant,millis}) {
    const {idx, arts, texts, plants} = this.state;
    arts[idx] = art;
    texts[idx] = text;
    plants[idx] = plant;
    this.setState({idx: (idx + 1) % ringBufferSize, millis});
  }
  async ingestPicture(picture) {
    const startDate = Date.now();
    this.setState({picture});
    const formdata = new FormData();
    formdata.append('image', dataURLToBlob(picture))
    const infer = await fetch(INFERENCE_ENDPOINT, {
      method: "POST",
      body: formdata,
    });
    const identification = await infer.json();
    const endDate = Date.now();
    requestAnimationFrame(() => this.handleWebcam());
    this.ingestStats({...identification, millis: endDate - startDate});
  }
  render() {
    const {idx, arts, texts, plants} = this.state;
    return <div className="App">
      <h1>
        <span style={{opacity: arts[(idx + ringBufferSize - 1) % ringBufferSize] * 0.75 + 0.25}}>ART</span>
        &nbsp;
        <span style={{opacity: texts[(idx + ringBufferSize - 1) % ringBufferSize] * 0.75 + 0.25}}>TEXT</span>
        &nbsp;
        <span style={{opacity: plants[(idx + ringBufferSize - 1) % ringBufferSize] * 0.75 + 0.25}}>PLANT</span>
      </h1>
      <h2>via your&nbsp;
        <select id="facingMode" onChange={e => this.setState({facingMode: e.target.value})} value={this.state.facingMode}>
          <option value="user">selfie</option>
          <option value="environment">photo</option>
          <option value=""></option>
        </select>&nbsp;<i>webcam!</i></h2>
      <Webcam
        audio={false}
        height={videoConstraints.height}
        ref={this.webcamref}
        screenshotFormat="image/jpeg"
        width={videoConstraints.width}
        videoConstraints={{...videoConstraints, facingMode: this.state.facingMode}}
      />
      {/* <div><img src={this.state.picture} /></div> */}
      <div className="millis">{this.state.millis} millis</div>
        <HighchartsReact highcharts={Highcharts} options={
          {
            chart: {"type": "area", "animation": false,},
            title: {text: "predictions"},
            series: [
              {name: "art", data: arts},
              {name: "text", data: texts},
              {name: "plant", data: plants},
            ],
            yAxis: {
              min: 0,
              max: 1,
              title: "certainty",
            },
            xAxis: {
              min: 0,
              max: ringBufferSize,
              title: "point in time",
            },
            plotOptions: {
              area: {
                marker: {
                  enabled: false,
                }
              }
            }
          }
        } />
      </div>
  }
}

export default App;
