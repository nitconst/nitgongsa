import React, { useEffect, useRef, useState } from "react";
import { dbService, storageService } from "../fbase";
import { collection, addDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import EXIF from "exif-js";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import Geocode from "react-geocode";

Geocode.setApiKey("AIzaSyBIWmLYzIJmYLxLoRsHchr0OAErLWpKcyI");
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
  const [address, setAddress] = useState(""); //주소변환

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

    if (attachmentUrl == "") {
      alert("이미지 파일은 필수입니다.");
    }

    const gongsaObj = {
      text: gongsa,
      createdAt: date,
      GPSLatitude: GPSla,
      GPSLongitude: GPSlong,
      addr: address,
      phone: userObj.displayName,
      createdId: userObj.uid,
      attachmentUrl,
      code: 0,
      // 필드 태그 수정 필요
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

    if (theFile && theFile.name) {
      EXIF.getData(theFile, function () {
        let exifData = EXIF.pretty(this);
        let gpsLa = EXIF.getTag(this, "GPSLatitude");
        let gpsLaRef = EXIF.getTag(this, "GPSLatitudeRef");
        let gpsLong = EXIF.getTag(this, "GPSLongitude");
        let gpsLongRef = EXIF.getTag(this, "GPSLongitudeRef");

        let la = [];
        let long = [];

        //위경도 api 연동 변수
        let a = "";
        let b = "";

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

          //사진 시각 정보 설정
          setDate(EXIF.getTag(this, "DateTime"));

          //ref 조건 별 위경도 계산
          if (gpsLaRef == "N") {
            a =
              parseInt(la[0]) +
              (60 * parseInt(la[1]) + parseFloat(la[2])) / 3600;
          } else {
            a =
              -1 * parseInt(la[0]) +
              (-60 * parseInt(la[1]) + -1 * parseFloat(la[2])) / 3600;
          }
          setGPSLa(a);

          if (gpsLongRef == "E") {
            b =
              parseInt(long[0]) +
              (60 * parseInt(long[1]) + parseFloat(long[2])) / 3600;
          } else {
            b =
              -1 * parseInt(long[0]) +
              (-60 * parseInt(long[1]) + -1 * parseFloat(long[2])) / 3600;
          }
          setGPSLong(b);
        } else {
          console.log("No EXIF data found in image '" + theFile.name + "'.");
        }
        //주소변환 실행
        setFileData(a, b);
      });
    }
  };

  //주소변환함수
  const setFileData = (a, b) => {
    console.log(GPSla, GPSlong);
    Geocode.fromLatLng(String(a), String(b)).then(
      (response) => {
        setAddress(response.results[0].formatted_address);
        let city, state, country;
        for (const element of response.results[0].address_components) {
          for (let j = 0; j < element.types.length; j++) {
            switch (element.types[j]) {
              case "locality":
                city = element.long_name;
                break;
              case "administrative_area_level_1":
                state = element.long_name;
                break;
              case "country":
                country = element.long_name;
                break;
            }
          }
        }
        console.log(city, state, country);
      },
      (error) => {
        console.error(error);
      }
    );
  };

  const onClearAttachment = () => {
    setAttachment(null);
    fileInput.current.value = null;
  };

  const fileInput = useRef();
  //attachment 유효성검사

  return (
    <div>
      <h2>민정씨 Component</h2>
      <form onSubmit={onSubmit}>
        <textarea
          value={gongsa}
          onChange={onChange}
          type="text"
          placeholder="공사 제목"
        />
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={fileInput}
        />
        <hr />
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
        <hr />
        Addr : {address}
      </form>
    </div>
  );
};

export default Register;
