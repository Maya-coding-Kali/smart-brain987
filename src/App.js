import { React, Component } from "react";
import "./App.css";
import Navigation from "./components/Navigation/Navigation.js";
import Logo from "./components/Logo/Logo.js";
import ImageLinkForm from "./components/ImageLinkForm/ImgeLinkForm";
import Rank from "./components/Rank/Rank.js";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";


const particalOptions = {
  fpsLimit: 144,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: "push",
      },
      onHover: {
        enable: true,
        mode: "repulse",
      },
      resize: true,
    },
    modes: {
      push: {
        quantity: 4,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: "#ffffff",
    },
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    collisions: {
      enable: true,
    },
    move: {
      direction: "none",
      enable: true,
      outModes: {
        default: "bounce",
      },
      random: false,
      speed: 1,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 80,
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      type: "circle",
    },
    size: {
      value: { min: 1, max: 5 },
    },
  },
  detectRetina: true,
};
const initialState = {
  input: "",
  imageUrl: "",
  box: {},
  route: "signin",
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    password: "",
    entries: 0,
    joined: "",
  },
};
class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      box: {},
      route: "signin",
      isSignedIn: false,
      user: {
        id: "",
        name: "",
        email: "",
        password: "",
        entries: 0,
        joined: "",
      },
    };
  }
  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        password: data.password,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };
  onRouteChange = (route) => {
    if (route === "signin") {
      this.setState(initialState);
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };
  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  calculateFaceLocation = (data) => {
    const clerifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width, height, clerifaiFace.bottom_row);
    return {
      left_col: clerifaiFace.left_col * width,
      right_col: width - (clerifaiFace.right_col * width),
      top_row: clerifaiFace.top_row * height,
      bottom_row: height - (clerifaiFace.bottom_row * height),
    };
  };

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({ box: box });
  };
  /* .then((response) => {
        if (response) {
          fetch("http://localhost:3000/image", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              body: JSON.stringify({
                id: this.state.user.id,
              }),
            }.then(response => response.json())
            .then(count=>this.setState({user:{
              entries: count,
            }}))

          });
        }
        this.displayFaceBox(this.calculateFaceLocation(response));
      }) */
  onPictureSubmit = () => {
   
    this.setState({ imageUrl: this.state.input });
    fetch("https://morning-savannah-82889.herokuapp.com/imageurl", {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              input: this.state.input,
            }),
          }).then(response => response.json())
      .then((response) => {
        if (response) {
          fetch(" https://morning-savannah-82889.herokuapp.com/image", {            
            method: "put",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          })
            .then((response) => response.json())
            .then((count) => {
              this.setState(Object.assign(this.state.user, { entries: count }));
            })
            .catch(console.log);
        }
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch((err) => console.log(err));
    console.log("click");
  };

  render() {
    const particlesInit = async (main) => {
      await loadFull(main);
    };

    const particlesLoaded = (container) => {};
    const { imageUrl, box, route, isSignedIn } = this.state;
    return (
      <div className="App">
        <Particles
          id="tsparticles"
          init={particlesInit}
          loaded={particlesLoaded}
          options={particalOptions}
        />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {route === "home" ? (
          <div>
            <Logo />
            <Rank
              onPictureSubmit={this.onPictureSubmit}
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onPictureSubmit={this.onPictureSubmit}
              onInputChange={this.onInputChange}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
        ) : route === "signin" ? (
          <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}

export default App;
