import React, { useRef, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { dbService, storageService } from "fbase";
import styled from "styled-components";
import {
  ref,
  deleteObject,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import Geocode from "react-geocode";
import EXIF from "exif-js";

Geocode.setApiKey("AIzaSyBIWmLYzIJmYLxLoRsHchr0OAErLWpKcyI");
Geocode.setLanguage("ko");
Geocode.setRegion("kr");
Geocode.enableDebug();

const Img = styled.img`
  height: 100px;
  border: none;
`;

const GongsaList = ({ gongsaObj, isOwner, userObj }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [textEdit, setTextEdit] = useState(gongsaObj.text);
  const [attachment, setAttachment] = useState("");
  const [date, setDate] = useState(""); //시각
  const [GPSla, setGPSLa] = useState([]); //위도
  const [GPSlong, setGPSLong] = useState([]); //경도
  const [address, setAddress] = useState(""); //주소변환
  const [arr, setArr] = useState([]); //지역변환
  const meta = useRef(null);
  const CodeNum = [
    { code: "000", region: undefined },
    { code: "101", region: "강남구" },
    { code: "102", region: "강동구" },
    { code: "103", region: "강서구" },
    { code: "104", region: "관악구" },
    { code: "105", region: "구로구" },
    { code: "106", region: "금천구" },
    { code: "107", region: "동작구" },
    { code: "108", region: "서초구" },
    { code: "109", region: "송파구" },
    { code: "110", region: "양천구" },
    { code: "201", region: "과천시" },
    { code: "202", region: "광명시" },
    { code: "203", region: "광주시" },
    { code: "204", region: "군포시" },
    { code: "205", region: "김포시" },
    { code: "206", region: "부천시" },
    { code: "207", region: "성남시" },
    { code: "208", region: "수원시" },
    { code: "209", region: "시흥시" },
    { code: "210", region: "안산시" },
    { code: "211", region: "안성시" },
    { code: "212", region: "안양시" },
    { code: "213", region: "여주시" },
    { code: "215", region: "오산시" },
    { code: "216", region: "용인시" },
    { code: "217", region: "의왕시" },
    { code: "218", region: "이천시" },
    { code: "219", region: "평택시" },
    { code: "220", region: "하남시" },
    { code: "221", region: "화성시" },
    { code: "111", region: "영등포구" },
    { code: "301", region: "계양구" },
    { code: "302", region: "남구" },
    { code: "303", region: "남동구" },
    { code: "304", region: "동구" },
    { code: "305", region: "부평구" },
    { code: "306", region: "연수구" },
    { code: "307", region: "옹진군" },
    { code: "308", region: "중구" },
  ];
  let test = CodeNum.find((CodeNum) => {
    return CodeNum.region === arr[2];
  });
  //주소변환함수
  const setFileData = (a, b) => {
    Geocode.fromLatLng(String(a), String(b)).then(
      (response) => {
        //대한민국 제외 주소 DB 저장
        setAddress(response.results[0].formatted_address.substr(5));
        let city, state, country;
        // let add = response.results[0].formatted_address;
        // let result = add.substr(5);
        // console.log(result);
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

        //배열에 공백 단위로 주소 나눠넣기
        setArr(response.results[0].formatted_address.split(" "));
        console.log(city, state, country);
      },
      (error) => {
        console.error(error);
      }
    );
  };

  //삭제 기능
  const handleCancle = async (key, index) => {
    const ok = window.confirm("정말 삭제하시겠습니까?");
    if (ok) {
      await deleteDoc(doc(dbService, "gongsa", key));
      await deleteObject(ref(storageService, gongsaObj.attachmentUrl));
      window.location.reload();
    }
  };

  //수정 기능
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setTextEdit(value);
  };

  const handleFileChange = async (event) => {
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
    //메타데이터 추출
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

        if (gpsLa) {
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
          alert(
            "[오류] 사진의 위치정보가 존재하지 않습니다.\n\n ㅇ 위치기반 재촬영 방법 \n Android : 설정>위치>사용 활성화 \n iOS : 설정>카메라>포맷>높은 호환성>재촬영 후 사진 보관함에서 사진 선택"
          );
          window.location.reload();
        }
        //위경도 기반 주소변환 실행
        setFileData(a, b);
      });
    }
  };

  //업데이트 기능
  const handleSubmit = async (key) => {
    let attachmentUrl = "";
    if (attachment !== "") {
      await deleteObject(ref(storageService, gongsaObj.attachmentUrl));
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );
      attachmentUrl = await getDownloadURL(response.ref);
      await updateDoc(doc(dbService, "gongsa", key), {
        text: textEdit,
        createdAt: date,
        GPSLatitude: GPSla,
        GPSLongitude: GPSlong,
        addr: address,
        docKey: key,
        attachmentUrl: attachmentUrl,
        code: 0, //처리코드
        regioncode: test.code, //지역코드
      });
    } else if (attachment === "") {
      await updateDoc(doc(dbService, "gongsa", key), {
        text: textEdit,
      });
    }
    if (test == undefined) {
      test = {
        code: "404",
        region: "UnKnown",
      };
    }
    window.location.reload();
  };
  const toggleEditing = () => setIsEditing((prev) => !prev);

  return (
    <div>
      {isEditing ? (
        <>
          <div>
            <Img src={gongsaObj.attachmentUrl} />
            <input type="text" value={textEdit} onChange={onChange} required />
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button
              onClick={() => {
                handleSubmit(gongsaObj.docKey);
              }}
            >
              업데이트
            </button>
            <button onClick={toggleEditing}>취소</button>
          </div>
        </>
      ) : (
        <>
          <h4>{gongsaObj.text}</h4>
          <Img src={gongsaObj.attachmentUrl} />
          {isOwner && (
            <>
              <button onClick={toggleEditing}>수정</button>
              <button
                onClick={() => {
                  handleCancle(gongsaObj.docKey);
                }}
              >
                삭제
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default GongsaList;
