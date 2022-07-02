import React from "react";
import "./FaceRecognition.css";

const FaceRecognition = ({ imageUrl, box }) => {
  return (
    <div className="center ma ">
      <div className=" absolute mt2" style={{
    marginLeft: 'calc(50% - 250px)'}}>
        <img
          id="inputImage"
          src={imageUrl}
          alt={""}
          width="500"
          height="auto"
        />
        <div
          className="bounding-box"
          style={{
            top: box.top_row,
            bottom: box.bottom_row,
            left: box.left_col,
            right: box.right_col,
          }}
        ></div>
      </div>
    </div>
  );
};
export default FaceRecognition;
