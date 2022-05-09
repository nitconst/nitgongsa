import React, { useEffect, useRef, useState } from "react";
import { dbService, storageService } from "../fbase";
import { collection, addDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import EXIF from "exif-js";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import Geocode from "react-geocode";

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_API_KEY);
Geocode.setLanguage("ko");
Geocode.setRegion("kr");
Geocode.enableDebug();

//geocode 작업 필요

const Register = ({ userObj }) => {
  const [gongsa, setGongsa] = useState("");
  const [gongsas, setGongsas] = useState([]);
  const [attachment, setAttachment] = useState("");
  const [date, setDate] = useState("");
  const [GPSla, setGPSLa] = useState([]); //위도
  const [GPSlong, setGPSLong] = useState([]); //경도

  // const [meta, setMeta] = useState(""); //metadata
  const meta = useRef(null);

  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";

    if (attachment !== "") {
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );
      attachmentUrl = await getDownloadURL(response.ref);
    }

    const gongsaObj = {
      text: gongsa,
      createdAt: date,
      GPSLatitude: GPSla,
      GPSLongitude: GPSlong,
      createdId: userObj.uid,
      attachmentUrl,
      code: 0,
      // 필드 태그 수정 필요(Ex. phoneNumber, addr(geocode) .. etc)
    };
    await addDoc(collection(dbService, "gongsa"), gongsaObj);
    setGongsa("");
    setAttachment("");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setGongsa(value);
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
    meta.current = theFile;
    //메타데이터 console
    if (theFile && theFile.name) {
      EXIF.getData(theFile, function () {
        let exifData = EXIF.pretty(this);
        let gpsLa = EXIF.getTag(this, "GPSLatitude");
        let gpsLaRef = EXIF.getTag(this, "GPSLatitudeRef");
        let gpsLong = EXIF.getTag(this, "GPSLongitude");
        let gpsLongRef = EXIF.getTag(this, "GPSLongitudeRef");

        let la = [];
        let long = [];

        if (exifData) {
          //exifdata 존재 시 gps 계산 수행
          console.log(exifData);
          console.log(gpsLa);
          console.log(gpsLong);
          for (let i = 0; i < gpsLa.length; i++) {
            la[i] = gpsLa[i].numerator / gpsLa[i].denominator;
          }
          for (let i = 0; i < gpsLong.length; i++) {
            long[i] = gpsLong[i].numerator / gpsLong[i].denominator;
          }
          //값 확인 콘솔
          console.log(la, long, gpsLaRef, gpsLongRef);

          //statedata 설정
          setDate(EXIF.getTag(this, "DateTime"));
          //ref 조건 별 위경도 계산
          if (gpsLaRef == "N") {
            setGPSLa(
              parseInt(la[0]) +
                (60 * parseInt(la[1]) + parseFloat(la[2])) / 3600
            );
          } else {
            setGPSLa(
              -1 * parseInt(la[0]) +
                (-60 * parseInt(la[1]) + -1 * parseFloat(la[2])) / 3600
            );
          }
          if (gpsLongRef == "E") {
            setGPSLong(
              parseInt(long[0]) +
                (60 * parseInt(long[1]) + parseFloat(long[2])) / 3600
            );
          } else {
            setGPSLong(
              -1 * parseInt(long[0]) +
                (-60 * parseInt(long[1]) + -1 * parseFloat(long[2])) / 3600
            );
          }
        } else {
          console.log("No EXIF data found in image '" + theFile.name + "'.");
        }
      });
    }
  };

  const onClearAttachment = () => {
    setAttachment(null);
    fileInput.current.value = null;
  };

  const fileInput = useRef();

  return (
    <div>
      <h2>민정씨 Component</h2>
      <form onSubmit={onSubmit}>
        <input
          value={gongsa}
          onChange={onChange}
          type="text"
          placeholder="공사 정보 입력"
        />
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={fileInput}
        />
        <input type="submit" value="submit" />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
        {console.log(meta)}
        <hr />
        Time : {date}
        <hr />
        GPSLatitude : {GPSla}
        <hr />
        GPSLongitude : {GPSlong}
      </form>
    </div>
  );
};

export default Register;
