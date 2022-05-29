// Register 폼 Component
import React, { useRef, useState } from "react";
import { dbService, storageService } from "../fbase";
import { setDoc, doc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import EXIF from "exif-js";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import Geocode from "react-geocode";

Geocode.setApiKey("AIzaSyBIWmLYzIJmYLxLoRsHchr0OAErLWpKcyI");
Geocode.setLanguage("ko");
Geocode.setRegion("kr");
Geocode.enableDebug();

const RegisterFactory = ({ userObj, codeNum }) => {
  const [gongsa, setGongsa] = useState("");
  const [attachment, setAttachment] = useState("");
  const [date, setDate] = useState(""); //시각
  const [GPSla, setGPSLa] = useState([]); //위도
  const [GPSlong, setGPSLong] = useState([]); //경도
  const [address, setAddress] = useState(""); //주소변환
  const [arr, setArr] = useState([]); //지역변환
  const [isImgMeta, setIsImgMeta] = useState(false);
  const meta = useRef(null);

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
          setIsImgMeta(true);
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
    setIsImgMeta(false);
    fileInput.current.value = null;
  };

  const fileInput = useRef();

  //code 찾기 (이슈 : 매칭 안되는 지역은 submit이 안됨)
  let test = codeNum.find((codeNum) => {
    return codeNum.region === arr[2];
  });

  return (
    <div>
      <hr className="hr-main" />
      <form className="boxForm" onSubmit={onSubmit}>
        <label htmlFor="attach-file" className="imgLabel">
          <span>사진 추가 </span>
          <span className="icon">
            <i className="fas fa-plus"></i>
          </span>
        </label>
        <input
          id="attach-file"
          className="img-hide"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={fileInput}
        />
        {attachment && (
          <div>
            <img src={attachment} className="reg-temp-img" />
            <button
              className="button is-small is-rounded"
              onClick={onClearAttachment}
            >
              Clear
            </button>
          </div>
        )}
        <textarea
          className="textarea is-small"
          value={gongsa}
          onChange={onChange}
          type="text"
          placeholder="공사관련 메모"
        />
        <input
          className="button is-link is-small is-rounded reg-btn"
          type="submit"
          value="등록"
        />
        {isImgMeta && (
          <>
            <hr />
            <div className="content is-small">
              <h4>주소</h4>
              <p>{address}</p>
              <h4>시간</h4>
              <p>{date}</p>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default RegisterFactory;
