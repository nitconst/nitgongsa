import React, { useRef, useState } from "react";
import { dbService, storageService } from "../fbase";
import { setDoc, doc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import EXIF from "exif-js";
import { async } from "@firebase/util";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import Geocode from "react-geocode";

Geocode.setApiKey("AIzaSyBIWmLYzIJmYLxLoRsHchr0OAErLWpKcyI");
Geocode.setLanguage("ko");
Geocode.setRegion("kr");
Geocode.enableDebug();

const Register = ({ userObj }) => {
  const [gongsa, setGongsa] = useState("");
  const [attachment, setAttachment] = useState("");
  const [date, setDate] = useState(""); //시각
  const [GPSla, setGPSLa] = useState([]); //위도
  const [GPSlong, setGPSLong] = useState([]); //경도
  const [address, setAddress] = useState(""); //주소변환
  const [arr, setArr] = useState([]); //지역변환
  const meta = useRef(null);

  //조직관할 코드 Array(서울 : 1 경기 : 2 인천 : 3)
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

  //submit 버튼 클릭 시 이벤트
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
    //attachment 유효성검사
    if (attachmentUrl == "") {
      alert("이미지 파일은 필수입니다.");
      window.location.reload();
    }

    //지역코드 유효성검사
    if (test == undefined) {
      test = {
        code: "404",
        region: "UnKnown",
      };
    }

    //게시글 삭제,수정을 위한 고유키 값 부여
    const key = uuidv4();

    //DB저장 필드
    const gongsaObj = {
      text: gongsa,
      createdAt: date,
      GPSLatitude: GPSla,
      GPSLongitude: GPSlong,
      addr: address,
      docKey: key,
      phone: userObj.displayName,
      createdId: userObj.uid,
      attachmentUrl,
      code: 0, //처리코드
      regioncode: test.code, //지역코드
    };

    //key값 부여를 위한 addDoc에서 setDoc으로 함수 변경
    await setDoc(doc(dbService, "gongsa", key), gongsaObj);
    setGongsa("");
    setAttachment("");

    window.location.reload();
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setGongsa(value);
  };

  //file(사진) 등록 시 event
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

  //주소변환함수
  const setFileData = (a, b) => {
    console.log(GPSla, GPSlong);
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
          console.log(element);
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

  //clear 버튼 클릭 시
  const onClearAttachment = () => {
    setAttachment(null);
    setGongsa(null);
    fileInput.current.value = null;
  };

  const fileInput = useRef();

  //code 찾기 (이슈 : 매칭 안되는 지역은 submit이 안됨)
  let test = CodeNum.find((CodeNum) => {
    return CodeNum.region === arr[2];
  });

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
