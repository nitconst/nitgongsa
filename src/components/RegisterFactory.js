// Register 폼 Component
import React, { useRef, useState } from "react";
import $ from "jquery";
import { dbService, storageService } from "../fbase";
import {
  setDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import EXIF from "exif-js";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";
import Lottie from "react-lottie";
import loadingAnimationData from "lotties/loading-construction.json";
import { set } from "react-ga";
import { CONTACT_DATA } from "lib/contact";

const {kakao} = window;



const RegisterFactory = ({ userObj, codeNum }) => {
  const [gongsa, setGongsa] = useState("");
  const [attachment, setAttachment] = useState("");
  const [date, setDate] = useState(""); //시각
  const [GPSla, setGPSLa] = useState([]); //위도
  const [GPSlong, setGPSLong] = useState([]); //경도
  const [address, setAddress] = useState(""); //주소변환
  const [arr, setArr] = useState([]); //지역변환
  const [isImgMeta, setIsImgMeta] = useState(false); //메타데이터
  const [load, setLoad] = useState(true); //로딩표시
  const [admin, setAdmin] = useState(""); //처리자표시
  const meta = useRef(null);
  const [usertype, setUsertype] = useState("");
  let phoneList = [];
  //submit 버튼 클릭 시 이벤트
  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";

    if (attachment !== "" || address !== "") {
      setLoad(false);
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );
      attachmentUrl = await getDownloadURL(response.ref);

      //지역코드 유효성검사
      if (test == undefined) {
        test = {
          code: "999",
          region: "기타",
        };
      }

      //regioncode2 추가
      let region2 = test.code.substr(0, 1) + "00";

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
        StateAdmin: admin,
        Usertype: usertype,
        regioncode2: region2,
      };

      //key값 부여를 위한 addDoc에서 setDoc으로 함수 변경
      await setDoc(doc(dbService, "gongsa", key), gongsaObj);
      setGongsa("");
      setAttachment("");

      // 문자 보내기
      // const requestOptions = {
      //   method: "POST",
      //   body: JSON.stringify({
      //     phone: "01073331262",
      //     smsbody: "test sms",
      //   }),
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // };
      // fetch(
      //   "https://www.nit-api.shop:5026/insert_sms_submit_ajax.php",
      //   requestOptions
      // )
      //   .then((response) => response.json())
      //   .then((response) => {
      //     if (response.token) {
      //       localStorage.setItem("wtw-token", response.token);
      //     }
      //   });

      const keyExists = (obj, key) => {
        if (!obj || (typeof obj !== "object" && !Array.isArray(obj))) {
          return false;
        } else if (obj.hasOwnProperty(key)) {
          return obj[key];
        } else if (Array.isArray(obj)) {
          for (let i = 0; i < obj.length; i++) {
            const result = keyExists(obj[i], key);
            if (result) {
              return obj[i];
            }
          }
        } else {
          for (const k in obj) {
            const result = keyExists(obj[k], key);
            if (result) {
              return result;
            }
          }
        }

        return false;
      };

      if (arr[2] == "성남시" || arr[2] == "용인시") {
        phoneList = keyExists(CONTACT_DATA, arr[3]);
      } else {
        phoneList = keyExists(CONTACT_DATA, arr[2]);
      }

      directSMS();
      window.location.reload();
    } else {
      alert("위치 기반 이미지 파일 등록은 필수입니다.");
      onClearAttachment();
    }
  };

  const directSMS = () => {
    const url = "https://www.nit-api.shop:5026/insert_sms_submit_ajax.php";
    const phoneNumber = "01073331262";

    const smsWaitingText =
      `[여기공사-신고]\n` +
      // `방문해 주셔서 감사합니다.\n` +
      `주소 : ` +
      address;
    // `입장 순서가 되면 안내해 드리겠습니다.(링크 참조)`;

    if (phoneList) {
      phoneList.forEach((element) => {
        console.log(element);
        $.ajax({
          url: url,
          method: "POST",
          data: {
            phone: element,
            smsbody: smsWaitingText,
          },
          error: function (request, status, error) {
            //   alert(
            //     "code:" +
            //       request.status +
            //       "\n" +
            //       "message:" +
            //       request.responseText +
            //       "\n" +
            //       "error:" +
            //       error
            //   );
            console.log(request.status, request.responseText, error);
          },
        });
      });
    }
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setGongsa(value);
  };

  //file(사진) 등록 시 event
  const onFileChange = async (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0]; //파일 읽는 상수 선언
    console.log("originalFile instanceof Blob", theFile instanceof Blob); // true
    console.log(`originalFile size ${theFile.size / 1024 / 1024} MB`);

    const reader = new FileReader(); //web에 불러오는 상수 선언

    //resize 함수 작성
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(theFile, options);
      console.log(
        "compressedFile instanceof Blob",
        compressedFile instanceof Blob
      ); // true
      console.log(
        `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
      ); // smaller than maxSizeMB
      reader.onloadend = (finishedEvent) => {
        const {
          currentTarget: { result },
        } = finishedEvent;

        setAttachment(result);
      };
      reader.readAsDataURL(compressedFile);
      meta.current = compressedFile;
    } catch (error) {
      console.log(error);
    }

    //usercode 가져오기
    const type = query(
      collection(dbService, "usertype"),
      where("phone", "==", userObj.displayName)
    );
    onSnapshot(type, (snapshot) => {
      const typearr = snapshot.docs.map((doc) => ({
        ...doc.data(),
      }));
      console.log(typearr[0].type);
      setUsertype(typearr[0].type);
    });

    //메타데이터 추출
    if (theFile && theFile.name) {
      console.log(theFile);
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
          const dateFirst = EXIF.getTag(this, "DateTime")
            .split(" ")[0]
            .replaceAll(":", "-");
          const dateLast = EXIF.getTag(this, "DateTime")
            .split(" ")[1]
            .substring(-1, 5);
          setDate(dateFirst + " " + dateLast);

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
          setFileData(a, b);

          if (isNaN(a) || isNaN(b)) {
            alert(
              "[오류] 사진의 위치정보가 존재하지 않습니다.\n\n ㅇ 위치기반 재촬영 방법 \n Android : 1. 설정>위치>사용 활성화 \n 2. 카메라>좌측 톱니바퀴 아이콘>위치 태그 활성화 \n iOS : 1. 설정>카메라>포맷>높은 호환성 체크 \n 2. 카메라 앱에서 사진 촬영 후, 사진 보관함에서 사진 선택해 추가"
            );
            onClearAttachment();
          }
        } else {
          console.log(date);
          alert(
            "[오류] 사진의 위치정보가 존재하지 않습니다.\n\n ㅇ 위치기반 재촬영 방법 \n Android : 1. 설정>위치>사용 활성화 \n 2. 카메라>좌측 톱니바퀴 아이콘>위치 태그 활성화 \n iOS : 1. 설정>카메라>포맷>높은 호환성 체크 \n 2. 카메라 앱에서 사진 촬영 후, 사진 보관함에서 사진 선택해 추가"
          );
          onClearAttachment();
          // window.location.reload();
        }
      });
    }
  };


  //주소변환함수
  const setFileData = (a, b) => {
    console.log(a, b);
    
//주소변환코드(kakao)
var geocoder = new kakao.maps.services.Geocoder();

var coord = new kakao.maps.LatLng(String(a), String(b));
var callback = function(result, status) {
    if (status === kakao.maps.services.Status.OK) {
      setAddress(result[0].address.address_name);
        console.log(result[0].address.address_name);
    }
};

geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
  }

  //clear 버튼 클릭 시
  const onClearAttachment = () => {
    setAttachment("");
    setGongsa(null);
    setIsImgMeta(false);
    setAddress("");
    fileInput.current.value = null;
  };

  const fileInput = useRef();

  //code 찾기
  let test = codeNum.find((codeNum) => {
    return codeNum.region === arr[2];
  });

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <>
      {load ? (
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
              className="button is-link is-rounded reg-btn"
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
      ) : (
        <div className="auth-container">
          <Lottie options={defaultOptions} height={200} width={200} />
        </div>
      )}
    </>
  );
};

export default RegisterFactory;
